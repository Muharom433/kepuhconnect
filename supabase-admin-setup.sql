-- =====================================================
-- KepuhConnect - Admin Setup & RLS Security Hardening
-- Jalankan SETELAH supabase-schema.sql
-- =====================================================

-- =====================================================
-- LANGKAH 1: Perkuat RLS - Cegah user set role admin
-- =====================================================

-- Hapus policy INSERT & UPDATE lama
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;

-- Policy INSERT: user boleh insert profil sendiri, role harus 'pengguna'
-- Catatan: menggunakan auth.uid() untuk sesi yang sudah login
-- Saat signUp tanpa email confirm, auth.uid() sudah ada
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id
    AND role IN ('pengguna', 'pengunjung')  -- tidak boleh insert sebagai 'admin'
    AND is_verified = false                 -- selalu mulai belum terverifikasi
  );

-- Policy UPDATE: user boleh update data diri sendiri KECUALI field role & is_verified
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles p2 WHERE p2.id = auth.uid())
    AND is_verified = (SELECT is_verified FROM public.profiles p2 WHERE p2.id = auth.uid())
  );

-- Policy khusus admin: admin bisa kelola semua profil (verifikasi, ganti role, dll)
CREATE POLICY "Admin can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- =====================================================
-- LANGKAH 2: Nonaktifkan email confirmation (opsional)
-- =====================================================
-- Jika ingin signup langsung berhasil tanpa perlu klik link email,
-- pergi ke Supabase Dashboard:
-- Authentication > Providers > Email > Confirm email = OFF
-- 
-- Atau biarkan ON jika ingin ada verifikasi email.


-- =====================================================
-- LANGKAH 3: Upgrade user yang sudah ada menjadi Admin
-- =====================================================
-- Ganti 'EMAIL_ADMIN_ANDA@gmail.com' dengan email Anda:

UPDATE public.profiles
SET
  role = 'admin',
  is_verified = true
WHERE email = 'EMAIL_ADMIN_ANDA@gmail.com';

-- Verifikasi:
SELECT id, first_name, last_name, email, role, is_verified
FROM public.profiles
WHERE role = 'admin';


-- =====================================================
-- LANGKAH 4: Cek semua user
-- =====================================================
SELECT
  first_name || ' ' || last_name AS nama,
  email, role, is_verified, created_at
FROM public.profiles
ORDER BY created_at DESC;
