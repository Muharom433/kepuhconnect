-- =========================================================
-- KepuhConnect - Migration v2: Sistem Kependudukan Lengkap
-- Jalankan di: Supabase Dashboard > SQL Editor
-- =========================================================

-- =========================================================
-- 1. UPDATE TABEL profiles - Tambah Kolom Kependudukan
-- =========================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nik            TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS no_kk          TEXT,
  ADD COLUMN IF NOT EXISTS tanggal_lahir  DATE,
  ADD COLUMN IF NOT EXISTS jenis_kelamin  TEXT CHECK (jenis_kelamin IN ('L', 'P')),
  ADD COLUMN IF NOT EXISTS status         TEXT DEFAULT 'aktif'
                                          CHECK (status IN ('aktif', 'tidak_aktif', 'nonaktif')),
  -- 'aktif'       = bisa login, terhitung penduduk
  -- 'tidak_aktif' = balita/anak/tanpa email, terhitung penduduk, tidak bisa login  
  -- 'nonaktif'    = pindah/meninggal, tidak terhitung statistik

  ADD COLUMN IF NOT EXISTS kepala_keluarga_id UUID REFERENCES public.profiles(id),
  -- NULL  = ini adalah kepala keluarga itu sendiri
  -- filled = anggota keluarga, KK-nya = profile dengan id ini

  ADD COLUMN IF NOT EXISTS rt              TEXT,  -- '001', '002', dst
  ADD COLUMN IF NOT EXISTS rw              TEXT,  -- '001', '002', dst
  ADD COLUMN IF NOT EXISTS jabatan         TEXT DEFAULT NULL;
  -- NULL          = warga biasa
  -- Diisi sesuai posisi di village_structure: 'Ketua RT 01', 'Ketua RW 01', 'Dukuh', 'Sekretaris', dll

-- =========================================================
-- 2. UPDATE TABEL village_structure - Link ke Profil + Detail + Hierarki
-- =========================================================
ALTER TABLE public.village_structure
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS detail     TEXT,
  -- detail: nomor RT/RW, misal '17', '5', '16,15' dan sebagainya
  ADD COLUMN IF NOT EXISTS org_parent TEXT;
  -- Nama jabatan induk (parent) untuk hierarki org chart
  -- NULL = root / jabatan paling atas
  -- 'Kepala Dusun' = ini jabatan berada di bawah Kepala Dusun


-- =========================================================
-- 3. UPDATE TABEL surat_submissions - Alur Disposisi
-- =========================================================
ALTER TABLE public.surat_submissions
  ADD COLUMN IF NOT EXISTS nama_pemohon    TEXT,
  -- Nama anggota keluarga yang dibuatkan surat (bisa beda dengan KK)
  
  ADD COLUMN IF NOT EXISTS anggota_id      UUID REFERENCES public.profiles(id),
  -- Profile ID anggota keluarga yang dibuatkan surat (opsional)

  -- Status disposisi bertingkat: KK -> RT -> RW -> Dukuh
  ADD COLUMN IF NOT EXISTS status_rt       TEXT DEFAULT 'pending'
                                           CHECK (status_rt IN ('pending', 'disetujui', 'ditolak')),
  ADD COLUMN IF NOT EXISTS catatan_rt      TEXT,
  ADD COLUMN IF NOT EXISTS waktu_rt        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rt_id           UUID REFERENCES public.profiles(id),

  ADD COLUMN IF NOT EXISTS status_rw       TEXT DEFAULT 'pending'
                                           CHECK (status_rw IN ('pending', 'disetujui', 'ditolak')),
  ADD COLUMN IF NOT EXISTS catatan_rw      TEXT,
  ADD COLUMN IF NOT EXISTS waktu_rw        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rw_id           UUID REFERENCES public.profiles(id),

  ADD COLUMN IF NOT EXISTS status_dukuh    TEXT DEFAULT 'pending'
                                           CHECK (status_dukuh IN ('pending', 'disetujui', 'ditolak')),
  ADD COLUMN IF NOT EXISTS catatan_dukuh   TEXT,
  ADD COLUMN IF NOT EXISTS waktu_dukuh     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dukuh_id        UUID REFERENCES public.profiles(id),

  -- Status surat keseluruhan (update kolom existing)
  ADD COLUMN IF NOT EXISTS whatsapp_sent   BOOLEAN DEFAULT false;
  -- Flag: apakah notif WA sudah dikirim ke RT?

-- =========================================================
-- 4. RLS POLICIES - Update untuk kolom baru
-- =========================================================

-- Hapus SEMUA policy yang ada (aman dijalankan berulang)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON public.profiles';
  END LOOP;
END $$;

-- Buat ulang policies yang bersih
CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can manage all profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own safe fields"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles p WHERE p.id = auth.uid())
    AND is_verified = (SELECT is_verified FROM public.profiles p WHERE p.id = auth.uid())
    AND status = (SELECT status FROM public.profiles p WHERE p.id = auth.uid())
  );


-- =========================================================
-- 5. VIEW: Statistik Kependudukan (untuk homepage)
-- =========================================================
CREATE OR REPLACE VIEW public.statistik_kependudukan AS
SELECT
  COUNT(*) FILTER (WHERE status IN ('aktif', 'tidak_aktif'))           AS jumlah_penduduk,
  COUNT(*) FILTER (WHERE status IN ('aktif', 'tidak_aktif')
                     AND jenis_kelamin = 'L')                          AS laki_laki,
  COUNT(*) FILTER (WHERE status IN ('aktif', 'tidak_aktif')
                     AND jenis_kelamin = 'P')                          AS perempuan,
  COUNT(*) FILTER (WHERE kepala_keluarga_id IS NULL
                     AND status != 'nonaktif')                         AS jumlah_kk,
  COUNT(*) FILTER (WHERE status = 'aktif' AND is_verified = true)      AS pengguna_aktif,
  COUNT(*) FILTER (WHERE status = 'tidak_aktif')                       AS belum_aktif
FROM public.profiles;

-- =========================================================
-- 6. FUNCTION: Ambil anggota keluarga dari KK
-- =========================================================
CREATE OR REPLACE FUNCTION public.get_anggota_keluarga(kk_id UUID)
RETURNS TABLE (
  id UUID, first_name TEXT, last_name TEXT, nik TEXT,
  tanggal_lahir DATE, jenis_kelamin TEXT, status TEXT
) AS $$
  SELECT id, first_name, last_name, nik, tanggal_lahir, jenis_kelamin, status
  FROM public.profiles
  WHERE kepala_keluarga_id = kk_id
  ORDER BY tanggal_lahir ASC;
$$ LANGUAGE sql SECURITY DEFINER;

-- =========================================================
-- 7. Cek hasil migration
-- =========================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;
