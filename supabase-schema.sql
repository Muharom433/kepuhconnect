-- =====================================================
-- KepuhConnect - Supabase Database Schema
-- Website Desa Kepuh
-- =====================================================

-- 1. Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT,
  country_code TEXT DEFAULT '+62',
  address TEXT,
  role TEXT DEFAULT 'pengunjung' CHECK (role IN ('admin', 'pengguna', 'pengunjung')),
  is_verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Village Info (dynamic content)
CREATE TABLE public.village_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'number', 'html', 'image')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Village Structure (organisasi desa)
CREATE TABLE public.village_structure (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. News / Berita
CREATE TABLE public.news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'umum',
  is_published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES public.profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. UMKM Products
CREATE TABLE public.umkm_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price BIGINT DEFAULT 0,
  category TEXT,
  image_url TEXT,
  owner_name TEXT,
  owner_id UUID REFERENCES public.profiles(id),
  contact TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Kost / Hunian Listings
CREATE TABLE public.kost_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT DEFAULT 0,
  location TEXT,
  image_url TEXT,
  contact TEXT,
  facilities TEXT,
  is_active BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Surat Types (templates)
CREATE TABLE public.surat_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Surat Submissions
CREATE TABLE public.surat_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  surat_type_id UUID REFERENCES public.surat_types(id),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kost_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surat_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surat_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Village Info: public read, admin write
CREATE POLICY "Village info is public" ON public.village_info FOR SELECT USING (true);
CREATE POLICY "Admin can manage village info" ON public.village_info FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Village Structure: public read, admin write
CREATE POLICY "Village structure is public" ON public.village_structure FOR SELECT USING (true);
CREATE POLICY "Admin can manage village structure" ON public.village_structure FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- News: public read published, admin write
CREATE POLICY "Published news is public" ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- UMKM: public read active, owner/admin write
CREATE POLICY "Active UMKM is public" ON public.umkm_products FOR SELECT USING (is_active = true);
CREATE POLICY "Owner can manage own UMKM" ON public.umkm_products FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admin can manage all UMKM" ON public.umkm_products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Kost: public read active, owner/admin write
CREATE POLICY "Active kost is public" ON public.kost_listings FOR SELECT USING (is_active = true);
CREATE POLICY "Owner can manage own kost" ON public.kost_listings FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admin can manage all kost" ON public.kost_listings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Surat Types: public read, admin write
CREATE POLICY "Surat types are public" ON public.surat_types FOR SELECT USING (true);
CREATE POLICY "Admin can manage surat types" ON public.surat_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Surat Submissions: user sees own, admin sees all
CREATE POLICY "Users can view own submissions" ON public.surat_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own submissions" ON public.surat_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can manage all submissions" ON public.surat_submissions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =====================================================
-- Seed Data
-- =====================================================

-- Village Info seed
INSERT INTO public.village_info (key, value, type) VALUES
('sambutan_dukuh', 'Selamat datang di Website Desa Kepuh. Kami berkomitmen untuk memberikan pelayanan terbaik kepada seluruh masyarakat melalui transformasi digital. Semoga website ini dapat memudahkan akses informasi dan layanan bagi seluruh warga.', 'text'),
('nama_dukuh', 'H. Ahmad Sutrisno', 'text'),
('jumlah_penduduk', '4523', 'number'),
('jumlah_kk', '1205', 'number'),
('jumlah_rt', '12', 'number'),
('jumlah_rw', '4', 'number'),
('luas_wilayah', '325', 'number'),
('visi', 'Mewujudkan Desa Kepuh yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Partisipasi Aktif Masyarakat', 'text'),
('misi', '1. Meningkatkan kualitas pelayanan publik berbasis teknologi informasi\n2. Mengembangkan potensi ekonomi lokal dan UMKM\n3. Meningkatkan kualitas sumber daya manusia\n4. Melestarikan budaya dan kearifan lokal\n5. Mewujudkan infrastruktur desa yang memadai', 'text'),
('hero_title', 'Desa Kepuh', 'text'),
('hero_subtitle', 'Transformasi Digital untuk Pelayanan Masyarakat yang Lebih Baik', 'text'),
('alamat', 'Jl. Raya Kepuh No. 01, Kecamatan Kepuh, Kabupaten Cirebon, Jawa Barat 45100', 'text'),
('telepon', '(0231) 123456', 'text'),
('email_desa', 'info@desakepuh.id', 'text');

-- Village Structure seed
INSERT INTO public.village_structure (name, position, sort_order) VALUES
('H. Ahmad Sutrisno', 'Kepala Desa', 1),
('Siti Rahayu, S.Pd', 'Sekretaris Desa', 2),
('Budi Santoso', 'Kaur Keuangan', 3),
('Dewi Lestari', 'Kaur Perencanaan', 4),
('Agus Widodo', 'Kasi Pemerintahan', 5),
('Sri Mulyani', 'Kasi Kesejahteraan', 6),
('Hendra Wijaya', 'Kasi Pelayanan', 7);

-- Surat Types seed
INSERT INTO public.surat_types (name, description, requirements) VALUES
('Surat Keterangan Domisili', 'Surat yang menerangkan domisili/tempat tinggal seseorang', 'KTP, KK, Pas Foto 3x4'),
('Surat Keterangan Tidak Mampu', 'Surat keterangan untuk warga kurang mampu', 'KTP, KK, Surat Pengantar RT/RW'),
('Surat Keterangan Usaha', 'Surat keterangan untuk keperluan usaha', 'KTP, KK, Surat Izin Usaha (jika ada)'),
('Surat Pengantar SKCK', 'Surat pengantar untuk pembuatan SKCK', 'KTP, KK, Pas Foto 4x6 background merah'),
('Surat Keterangan Kelahiran', 'Surat keterangan kelahiran anak', 'KTP Orang Tua, KK, Surat Keterangan dari Bidan/RS'),
('Surat Keterangan Kematian', 'Surat keterangan kematian warga', 'KTP Almarhum, KK, Surat Keterangan dari RS/Dokter');

-- News seed
INSERT INTO public.news (title, slug, content, excerpt, category, is_published, published_at) VALUES
('Program Digitalisasi Desa Kepuh Resmi Diluncurkan', 'program-digitalisasi-desa-kepuh', 'Desa Kepuh resmi meluncurkan program digitalisasi untuk meningkatkan pelayanan publik. Program ini mencakup pembuatan website desa, sistem persuratan online, dan katalog UMKM digital. Kepala Desa berharap program ini dapat memudahkan warga dalam mengakses layanan desa.', 'Desa Kepuh meluncurkan program digitalisasi untuk meningkatkan pelayanan publik kepada masyarakat.', 'pengumuman', true, NOW()),
('Pelatihan UMKM Digital untuk Warga Desa Kepuh', 'pelatihan-umkm-digital', 'Pemerintah Desa Kepuh mengadakan pelatihan UMKM digital bagi warga yang memiliki usaha. Pelatihan ini bertujuan untuk meningkatkan kemampuan warga dalam memasarkan produk secara online melalui platform KepuhConnect.', 'Pelatihan UMKM digital diadakan untuk meningkatkan kemampuan pemasaran online warga desa.', 'kegiatan', true, NOW() - INTERVAL '2 days'),
('Gotong Royong Pembersihan Sungai Desa', 'gotong-royong-pembersihan-sungai', 'Warga Desa Kepuh mengadakan gotong royong pembersihan sungai yang melintasi desa. Kegiatan ini diikuti oleh ratusan warga dari seluruh RT dan RW. Kepala Desa mengapresiasi partisipasi warga dalam menjaga kebersihan lingkungan.', 'Ratusan warga berpartisipasi dalam gotong royong pembersihan sungai desa.', 'kegiatan', true, NOW() - INTERVAL '5 days');

-- UMKM Products seed
INSERT INTO public.umkm_products (name, description, price, category, owner_name, contact, is_active) VALUES
('Batik Kepuh Motif Mega Mendung', 'Batik tulis khas Desa Kepuh dengan motif Mega Mendung yang elegan', 350000, 'Kerajinan', 'Ibu Siti', '081234567890', true),
('Keripik Singkong Pedas', 'Keripik singkong renyah dengan bumbu pedas khas Desa Kepuh', 15000, 'Makanan', 'Pak Budi', '081234567891', true),
('Madu Hutan Asli', 'Madu hutan asli dari lebah yang diternakkan di pekarangan desa', 85000, 'Minuman', 'Pak Agus', '081234567892', true),
('Anyaman Bambu Dekoratif', 'Anyaman bambu untuk hiasan rumah dan peralatan rumah tangga', 75000, 'Kerajinan', 'Ibu Dewi', '081234567893', true),
('Kopi Robusta Kepuh', 'Kopi robusta pilihan yang ditanam di kebun desa', 45000, 'Minuman', 'Pak Hendra', '081234567894', true),
('Sambal Terasi Bu Mul', 'Sambal terasi homemade resep turun temurun', 25000, 'Makanan', 'Bu Mulyani', '081234567895', true);

-- Kost seed
INSERT INTO public.kost_listings (title, description, price, location, contact, facilities, is_active) VALUES
('Kost Putra Dekat Balai Desa', 'Kost putra nyaman dengan fasilitas lengkap, dekat balai desa dan masjid', 500000, 'RT 03/RW 01', '081234567800', 'WiFi, Kamar Mandi Dalam, Parkir Motor', true),
('Kontrakan 2 Kamar Tidur', 'Rumah kontrakan 2 kamar tidur, cocok untuk keluarga kecil', 1200000, 'RT 05/RW 02', '081234567801', 'Dapur, Kamar Mandi, Taman Kecil', true);
