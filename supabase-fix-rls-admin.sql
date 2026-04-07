-- =====================================================
-- RESET TOTAL RLS Profiles - KepuhConnect
-- Jalankan di: Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Hapus SEMUA policy yang ada di tabel profiles
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON public.profiles';
  END LOOP;
END $$;

-- 2. Buat ulang policy yang bersih dan benar

-- BACA: Siapapun (termasuk tamu/anon) bisa baca semua profil
CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- INSERT: User yang baru daftar bisa insert profil dirinya sendiri
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE (admin): User dengan role admin bisa update profil siapapun
CREATE POLICY "Admin can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- UPDATE (user biasa): User hanya bisa update datanya sendiri
-- tapi TIDAK bisa ubah role dan is_verified
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles p WHERE p.id = auth.uid())
    AND is_verified = (SELECT is_verified FROM public.profiles p WHERE p.id = auth.uid())
  );

-- 3. Cek hasilnya
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd;
