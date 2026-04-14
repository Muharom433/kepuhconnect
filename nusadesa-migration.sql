-- =========================================================
-- NusaDesa Migration v1.0
-- Transform KepuhConnect (single-tenant) → NusaDesa (multi-tenant)
-- 
-- Jalankan di: Supabase Dashboard > SQL Editor
-- PENTING: Backup data sebelum menjalankan!
-- =========================================================

-- =========================================================
-- STEP 1: Buat tabel villages (master data desa)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.villages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  full_address TEXT,
  province TEXT,
  regency TEXT,
  district TEXT,
  village_type TEXT DEFAULT 'dusun' CHECK (village_type IN ('desa', 'dusun', 'kelurahan', 'nagari')),
  description TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  registered_by UUID REFERENCES auth.users(id),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- STEP 2: Buat tabel village_registrations (pendaftaran desa baru)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.village_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  village_name TEXT NOT NULL,
  slug TEXT NOT NULL,
  full_address TEXT NOT NULL,
  province TEXT,
  regency TEXT,
  district TEXT,
  village_type TEXT DEFAULT 'dusun',
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  documents JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- STEP 3: Insert desa pertama (Padukuhan Kepuh) dengan UUID deterministik
-- =========================================================
INSERT INTO public.villages (id, name, slug, full_address, province, regency, district, village_type, status, approved_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Padukuhan Kepuh',
  'kepuh',
  'Desa Pacarejo, Kapanewon Semanu, Gunung Kidul',
  'DI Yogyakarta',
  'Gunung Kidul',
  'Semanu',
  'dusun',
  'active',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- STEP 4: Tambah village_id ke profiles + update role constraint
-- =========================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages(id) ON DELETE SET NULL;

-- Drop constraint lama dan buat baru dengan super_admin
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('super_admin', 'admin', 'pengguna', 'pengunjung'));

-- Assign semua user existing ke desa Kepuh
UPDATE public.profiles SET village_id = '00000000-0000-0000-0000-000000000001' WHERE village_id IS NULL;

-- =========================================================
-- STEP 5: Tambah village_id ke village_info
-- =========================================================
ALTER TABLE public.village_info
  ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE;

UPDATE public.village_info SET village_id = '00000000-0000-0000-0000-000000000001' WHERE village_id IS NULL;

-- Update unique constraint: key harus unik per desa (bukan global)
ALTER TABLE public.village_info DROP CONSTRAINT IF EXISTS village_info_key_key;
ALTER TABLE public.village_info ADD CONSTRAINT village_info_village_key_unique UNIQUE (village_id, key);
ALTER TABLE public.village_info ALTER COLUMN village_id SET NOT NULL;

-- =========================================================
-- STEP 6: Tambah village_id ke village_structure
-- =========================================================
ALTER TABLE public.village_structure
  ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE;

UPDATE public.village_structure SET village_id = '00000000-0000-0000-0000-000000000001' WHERE village_id IS NULL;
ALTER TABLE public.village_structure ALTER COLUMN village_id SET NOT NULL;

-- =========================================================
-- STEP 7: Tambah village_id ke news
-- =========================================================
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE;

UPDATE public.news SET village_id = '00000000-0000-0000-0000-000000000001' WHERE village_id IS NULL;

-- Slug unik per desa (bukan global)
ALTER TABLE public.news DROP CONSTRAINT IF EXISTS news_slug_key;
ALTER TABLE public.news ADD CONSTRAINT news_village_slug_unique UNIQUE (village_id, slug);
ALTER TABLE public.news ALTER COLUMN village_id SET NOT NULL;

-- =========================================================
-- STEP 8: Tambah village_id ke umkm_products
-- =========================================================
ALTER TABLE public.umkm_products
  ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE;

UPDATE public.umkm_products SET village_id = '00000000-0000-0000-0000-000000000001' WHERE village_id IS NULL;
ALTER TABLE public.umkm_products ALTER COLUMN village_id SET NOT NULL;

-- =========================================================
-- STEP 9: Tambah village_id ke kost_listings
-- =========================================================
ALTER TABLE public.kost_listings
  ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE;

UPDATE public.kost_listings SET village_id = '00000000-0000-0000-0000-000000000001' WHERE village_id IS NULL;
ALTER TABLE public.kost_listings ALTER COLUMN village_id SET NOT NULL;

-- =========================================================
-- STEP 10: Tambah village_id ke surat_types
-- =========================================================
ALTER TABLE public.surat_types
  ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE;

UPDATE public.surat_types SET village_id = '00000000-0000-0000-0000-000000000001' WHERE village_id IS NULL;
ALTER TABLE public.surat_types ALTER COLUMN village_id SET NOT NULL;

-- =========================================================
-- STEP 11: Tambah village_id ke surat_submissions
-- =========================================================
ALTER TABLE public.surat_submissions
  ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages(id) ON DELETE CASCADE;

UPDATE public.surat_submissions SET village_id = '00000000-0000-0000-0000-000000000001' WHERE village_id IS NULL;
ALTER TABLE public.surat_submissions ALTER COLUMN village_id SET NOT NULL;

-- =========================================================
-- STEP 12: Update view statistik_kependudukan (per desa)
-- =========================================================
DROP VIEW IF EXISTS public.statistik_kependudukan;
CREATE OR REPLACE VIEW public.statistik_kependudukan AS
SELECT
  village_id,
  COUNT(*) FILTER (WHERE status IN ('aktif', 'tidak_aktif'))           AS jumlah_penduduk,
  COUNT(*) FILTER (WHERE status IN ('aktif', 'tidak_aktif')
                     AND jenis_kelamin = 'L')                          AS laki_laki,
  COUNT(*) FILTER (WHERE status IN ('aktif', 'tidak_aktif')
                     AND jenis_kelamin = 'P')                          AS perempuan,
  COUNT(*) FILTER (WHERE kepala_keluarga_id IS NULL
                     AND status != 'nonaktif')                         AS jumlah_kk,
  COUNT(*) FILTER (WHERE status = 'aktif' AND is_verified = true)      AS pengguna_aktif,
  COUNT(*) FILTER (WHERE status = 'tidak_aktif')                       AS belum_aktif
FROM public.profiles
WHERE village_id IS NOT NULL
GROUP BY village_id;

-- =========================================================
-- STEP 13: Update function get_anggota_keluarga (tidak berubah, tetap per KK)
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
-- STEP 14: Enable RLS pada tabel baru
-- =========================================================
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_registrations ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- STEP 15: Drop SEMUA RLS policies lama (clean slate)
-- =========================================================
DO $$
DECLARE
  pol record;
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'profiles', 'village_info', 'village_structure', 'news',
    'umkm_products', 'kost_listings', 'surat_types', 'surat_submissions'
  ])
  LOOP
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = tbl
    LOOP
      EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON public.' || tbl;
    END LOOP;
  END LOOP;
END $$;

-- =========================================================
-- STEP 16: Helper functions untuk RLS
-- =========================================================

-- Cek apakah user adalah super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Cek apakah user adalah admin dari desa tertentu
CREATE OR REPLACE FUNCTION public.is_village_admin(v_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin' AND village_id = v_id
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =========================================================
-- STEP 17: RLS Policies baru — Multi-Tenant
-- =========================================================

-- ── VILLAGES ──
CREATE POLICY "Anyone can read active villages" ON public.villages
  FOR SELECT USING (status = 'active' OR public.is_super_admin());

CREATE POLICY "Super admin can manage villages" ON public.villages
  FOR ALL USING (public.is_super_admin());

-- ── VILLAGE REGISTRATIONS ──
CREATE POLICY "Anyone can submit registration" ON public.village_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super admin can manage registrations" ON public.village_registrations
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "Submitter can view own registration" ON public.village_registrations
  FOR SELECT USING (
    contact_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

-- ── PROFILES ──
CREATE POLICY "Anyone can read profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id
    AND role IN ('pengguna', 'pengunjung')
    AND is_verified = false
  );

CREATE POLICY "Users can update own safe fields" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles p WHERE p.id = auth.uid())
    AND is_verified = (SELECT is_verified FROM public.profiles p WHERE p.id = auth.uid())
  );

CREATE POLICY "Village admin can manage village profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin' 
      AND p.village_id = profiles.village_id
    )
  );

CREATE POLICY "Super admin can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_super_admin());

-- ── VILLAGE INFO ──
CREATE POLICY "Village info is public" ON public.village_info
  FOR SELECT USING (true);

CREATE POLICY "Village admin can manage own village info" ON public.village_info
  FOR ALL USING (public.is_village_admin(village_id));

CREATE POLICY "Super admin can manage all village info" ON public.village_info
  FOR ALL USING (public.is_super_admin());

-- ── VILLAGE STRUCTURE ──
CREATE POLICY "Village structure is public" ON public.village_structure
  FOR SELECT USING (true);

CREATE POLICY "Village admin can manage own village structure" ON public.village_structure
  FOR ALL USING (public.is_village_admin(village_id));

CREATE POLICY "Super admin can manage all village structure" ON public.village_structure
  FOR ALL USING (public.is_super_admin());

-- ── NEWS ──
CREATE POLICY "Published news is public" ON public.news
  FOR SELECT USING (is_published = true);

CREATE POLICY "Village admin can manage own village news" ON public.news
  FOR ALL USING (public.is_village_admin(village_id));

CREATE POLICY "Super admin can manage all news" ON public.news
  FOR ALL USING (public.is_super_admin());

-- ── UMKM PRODUCTS ──
CREATE POLICY "Active UMKM is public" ON public.umkm_products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owner can manage own UMKM" ON public.umkm_products
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Village admin can manage own village UMKM" ON public.umkm_products
  FOR ALL USING (public.is_village_admin(village_id));

CREATE POLICY "Super admin can manage all UMKM" ON public.umkm_products
  FOR ALL USING (public.is_super_admin());

-- ── KOST LISTINGS ──
CREATE POLICY "Active kost is public" ON public.kost_listings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owner can manage own kost" ON public.kost_listings
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Village admin can manage own village kost" ON public.kost_listings
  FOR ALL USING (public.is_village_admin(village_id));

CREATE POLICY "Super admin can manage all kost" ON public.kost_listings
  FOR ALL USING (public.is_super_admin());

-- ── SURAT TYPES ──
CREATE POLICY "Surat types are public" ON public.surat_types
  FOR SELECT USING (true);

CREATE POLICY "Village admin can manage own village surat types" ON public.surat_types
  FOR ALL USING (public.is_village_admin(village_id));

CREATE POLICY "Super admin can manage all surat types" ON public.surat_types
  FOR ALL USING (public.is_super_admin());

-- ── SURAT SUBMISSIONS ──
CREATE POLICY "Users can view own submissions" ON public.surat_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON public.surat_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Village admin can manage own village submissions" ON public.surat_submissions
  FOR ALL USING (public.is_village_admin(village_id));

CREATE POLICY "Super admin can manage all submissions" ON public.surat_submissions
  FOR ALL USING (public.is_super_admin());

-- =========================================================
-- STEP 18: Performance indexes
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_village_id ON public.profiles(village_id);
CREATE INDEX IF NOT EXISTS idx_village_info_village_id ON public.village_info(village_id);
CREATE INDEX IF NOT EXISTS idx_village_structure_village_id ON public.village_structure(village_id);
CREATE INDEX IF NOT EXISTS idx_news_village_id ON public.news(village_id);
CREATE INDEX IF NOT EXISTS idx_umkm_products_village_id ON public.umkm_products(village_id);
CREATE INDEX IF NOT EXISTS idx_kost_listings_village_id ON public.kost_listings(village_id);
CREATE INDEX IF NOT EXISTS idx_surat_types_village_id ON public.surat_types(village_id);
CREATE INDEX IF NOT EXISTS idx_surat_submissions_village_id ON public.surat_submissions(village_id);
CREATE INDEX IF NOT EXISTS idx_villages_slug ON public.villages(slug);
CREATE INDEX IF NOT EXISTS idx_villages_status ON public.villages(status);

-- =========================================================
-- STEP 19: Buat super admin pertama
-- GANTI 'EMAIL_SUPER_ADMIN@gmail.com' dengan email Anda!
-- =========================================================
-- UPDATE public.profiles
-- SET role = 'super_admin', is_verified = true, village_id = NULL
-- WHERE email = 'EMAIL_SUPER_ADMIN@gmail.com';

-- =========================================================
-- STEP 20: Verifikasi migration
-- =========================================================
SELECT 'villages' AS tabel, count(*) AS jumlah FROM public.villages
UNION ALL SELECT 'profiles', count(*) FROM public.profiles
UNION ALL SELECT 'village_info', count(*) FROM public.village_info
UNION ALL SELECT 'village_structure', count(*) FROM public.village_structure
UNION ALL SELECT 'news', count(*) FROM public.news
UNION ALL SELECT 'umkm_products', count(*) FROM public.umkm_products
UNION ALL SELECT 'kost_listings', count(*) FROM public.kost_listings
UNION ALL SELECT 'surat_types', count(*) FROM public.surat_types
UNION ALL SELECT 'surat_submissions', count(*) FROM public.surat_submissions;

-- Cek kolom village_id sudah ada
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
  AND column_name IN ('village_id', 'role')
ORDER BY ordinal_position;
