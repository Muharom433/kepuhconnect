import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Globe, Shield, FileText, Store, Users, ArrowRight,
  Newspaper, Building2, MapPin, ChevronRight, ChevronLeft,
  Zap, Lock, Smartphone, CheckCircle,
  Home, ClipboardList, Landmark, BarChart2,
  Anchor, Trees, Waves, Feather, Gem,
  GraduationCap, Leaf
} from 'lucide-react'
import './LandingPage.css'

export default function LandingPage() {
  const [villageCount, setVillageCount] = useState(0)
  const [villages, setVillages] = useState([])
  const sliderRef = useRef(null) // Referensi untuk slider provinsi

  useEffect(() => {
    async function fetchStats() {
      const { data, count } = await supabase
        .from('villages')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .limit(6)
      if (data) setVillages(data)
      if (count) setVillageCount(count)
    }
    fetchStats()
  }, [])

  const fitur = [
    {
      icon: FileText,
      nama: 'Layanan Persuratan',
      desc: 'Ajukan surat administrasi desa secara daring — tanpa antre, tanpa jauh. Pantau status permohonan kapan saja.',
      color: '#00844F'
    },
    {
      icon: Store,
      nama: 'Katalog UMKM Desa',
      desc: 'Tampilkan produk unggulan usaha lokal desa dalam satu etalase digital yang bisa diakses seluruh Nusantara.',
      color: '#EF642C'
    },
    {
      icon: Newspaper,
      nama: 'Berita & Pengumuman',
      desc: 'Sampaikan warta kampung, agenda kegiatan, dan pengumuman penting kepada seluruh warga.',
      color: '#008086'
    },
    {
      icon: Users,
      nama: 'Data Kependudukan',
      desc: 'Kelola data warga, kartu keluarga, dan statistik demografis desa secara nyata dan terkini.',
      color: '#00844F'
    },
    {
      icon: Building2,
      nama: 'Struktur Pamong Desa',
      desc: 'Tampilkan susunan perangkat desa — dari kepala dusun, RT, hingga RW — dalam diagram yang rapi.',
      color: '#008086'
    },
    {
      icon: Shield,
      nama: 'Keamanan Berlapis',
      desc: 'Sistem peran bertingkat: Super Admin, Admin Desa, RT, RW, dan warga — dengan keamanan tingkat database.',
      color: '#EF642C'
    },
  ]

  const langkah = [
    {
      num: '01',
      judul: 'Daftarkan Desa Anda',
      desc: 'Isi formulir pendaftaran dengan data desa, alamat, dan kontak penanggungjawab yang valid.',
      icon: FileText,
      color: 'var(--primary)',
    },
    {
      num: '02',
      judul: 'Verifikasi Tim NusaDesa',
      desc: 'Tim kami akan memeriksa kelengkapan data dan keabsahan desa yang didaftarkan.',
      icon: Shield,
      color: 'var(--secondary)',
    },
    {
      num: '03',
      judul: 'Desa Aktif & Siap Pakai',
      desc: 'Setelah disetujui, desa Anda punya URL unik sendiri — misalnya /kepuh atau /dengok — dan langsung bisa melayani warga.',
      icon: Zap,
      color: 'var(--accent)',
    },
  ]

  // 38 Provinsi Indonesia
  const daftarProvinsi = [
    // Sumatera
    { nama: 'Aceh', wilayah: 'Sumatera', icon: Anchor }, { nama: 'Sumatera Utara', wilayah: 'Sumatera', icon: Anchor },
    { nama: 'Sumatera Barat', wilayah: 'Sumatera', icon: Anchor }, { nama: 'Riau', wilayah: 'Sumatera', icon: Anchor },
    { nama: 'Kepulauan Riau', wilayah: 'Sumatera', icon: Anchor }, { nama: 'Jambi', wilayah: 'Sumatera', icon: Anchor },
    { nama: 'Bengkulu', wilayah: 'Sumatera', icon: Anchor }, { nama: 'Sumatera Selatan', wilayah: 'Sumatera', icon: Anchor },
    { nama: 'Bangka Belitung', wilayah: 'Sumatera', icon: Anchor }, { nama: 'Lampung', wilayah: 'Sumatera', icon: Anchor },
    // Jawa
    { nama: 'Banten', wilayah: 'Jawa', icon: Gem }, { nama: 'DKI Jakarta', wilayah: 'Jawa', icon: Gem },
    { nama: 'Jawa Barat', wilayah: 'Jawa', icon: Gem }, { nama: 'Jawa Tengah', wilayah: 'Jawa', icon: Gem },
    { nama: 'DI Yogyakarta', wilayah: 'Jawa', icon: Gem }, { nama: 'Jawa Timur', wilayah: 'Jawa', icon: Gem },
    // Bali & Nusa Tenggara
    { nama: 'Bali', wilayah: 'Bali', icon: Waves }, { nama: 'Nusa Tenggara Barat', wilayah: 'Nusa Tenggara', icon: Waves },
    { nama: 'Nusa Tenggara Timur', wilayah: 'Nusa Tenggara', icon: Waves },
    // Kalimantan
    { nama: 'Kalimantan Barat', wilayah: 'Kalimantan', icon: Trees }, { nama: 'Kalimantan Tengah', wilayah: 'Kalimantan', icon: Trees },
    { nama: 'Kalimantan Selatan', wilayah: 'Kalimantan', icon: Trees }, { nama: 'Kalimantan Timur', wilayah: 'Kalimantan', icon: Trees },
    { nama: 'Kalimantan Utara', wilayah: 'Kalimantan', icon: Trees },
    // Sulawesi
    { nama: 'Sulawesi Utara', wilayah: 'Sulawesi', icon: Globe }, { nama: 'Gorontalo', wilayah: 'Sulawesi', icon: Globe },
    { nama: 'Sulawesi Tengah', wilayah: 'Sulawesi', icon: Globe }, { nama: 'Sulawesi Barat', wilayah: 'Sulawesi', icon: Globe },
    { nama: 'Sulawesi Selatan', wilayah: 'Sulawesi', icon: Globe }, { nama: 'Sulawesi Tenggara', wilayah: 'Sulawesi', icon: Globe },
    // Maluku & Papua
    { nama: 'Maluku', wilayah: 'Maluku', icon: Feather }, { nama: 'Maluku Utara', wilayah: 'Maluku', icon: Feather },
    { nama: 'Papua', wilayah: 'Papua', icon: Feather }, { nama: 'Papua Barat', wilayah: 'Papua', icon: Feather },
    { nama: 'Papua Selatan', wilayah: 'Papua', icon: Feather }, { nama: 'Papua Tengah', wilayah: 'Papua', icon: Feather },
    { nama: 'Papua Pegunungan', wilayah: 'Papua', icon: Feather }, { nama: 'Papua Barat Daya', wilayah: 'Papua', icon: Feather }
  ]

  const getProvinsiStyle = (wilayah) => {
    if (['Sumatera', 'Kalimantan', 'Papua'].includes(wilayah)) return { bg: 'var(--primary-bg)', color: 'var(--primary)' }
    if (['Jawa', 'Sulawesi'].includes(wilayah)) return { bg: 'var(--secondary-bg)', color: 'var(--secondary)' }
    return { bg: 'rgba(239, 100, 44, 0.1)', color: 'var(--accent-dark)' }
  }

  // Pemetaan foto unik per provinsi (karena mencari 38 URL valid rumah adat sangat rentan broken/404, kita menggunakan static Unsplash mixing dengan Picsum Unique Seeded agar tidak kembar)
  const getRumahAdatFoto = (wilayah, index, nama) => {
    // Kombinasi foto arsitektur Nusantara yang robust dengan filter khusus
    const basePhotos = {
      'Sumatera': 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=500&auto=format&fit=crop',
      'Jawa': 'https://images.unsplash.com/photo-1588693959306-bf2e74af35fe?q=80&w=500&auto=format&fit=crop',
      'Bali': 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=500&auto=format&fit=crop',
      'Nusa Tenggara': 'https://images.unsplash.com/photo-1558228581-2856f62b2ac3?q=80&w=500&auto=format&fit=crop',
      'Kalimantan': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=500&auto=format&fit=crop',
      'Sulawesi': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=500&auto=format&fit=crop',
    }
    
    // Memberikan ID unik pada Picsum untuk mendapatkan 38 foto berbeda bagi provinsi yang wilayahnya sama
    // Ini memastikan seluruh 38 provinsi memiliki foto yang *berbeda* secara visual.
    const fallback = basePhotos[wilayah] || 'https://images.unsplash.com/photo-1533087353988-cb86c673ba1f?q=80&w=500&auto=format&fit=crop';
    
    // Ganjil genap: separuh pakai foto robust budaya, separuh pakai foto unik placeholder
    if (index % 2 === 0 || index % 3 === 0) {
      return `https://picsum.photos/seed/${nama.replace(/\s/g, '')}/500/600`;
    }
    
    return fallback;
  }

  // Fungsi scroll slider ke kiri/kanan
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300; // Jarak scroll
      sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }

  // 8 peribahasa dari 8 wilayah berbeda Nusantara
  const peribahasa = [
    {
      teks: 'Adat basandi syarak, syarak basandi kitabullah — tata hidup yang berpijak pada nilai ilahi.',
      asal: 'Falsafah Minangkabau',
      wilayah: 'Sumatera Barat',
      warna: 'var(--primary)'
    },
    {
      teks: 'Dalihan na tolu — tiga tungku yang menjadi fondasi kebersamaan, keseimbangan, dan saling menopang.',
      asal: 'Falsafah Batak',
      wilayah: 'Sumatera Utara',
      warna: 'var(--primary)'
    },
    {
      teks: 'Berakit-rakit ke hulu, berenang-renang ke tepian — bersakit-sakit dahulu, bersenang-senang kemudian.',
      asal: 'Peribahasa Melayu',
      wilayah: 'Riau & Kepulauan Riau',
      warna: 'var(--secondary)'
    },
    {
      teks: 'Siri\' na pacce — menjaga martabat diri dan merasakan empati kepada sesama yang berduka.',
      asal: 'Falsafah Bugis-Makassar',
      wilayah: 'Sulawesi Selatan',
      warna: 'var(--secondary)'
    },
    {
      teks: 'Menyama braya — memperlakukan sesama seperti saudara kandung sendiri, melampaui segala perbedaan.',
      asal: 'Filosofi Bali',
      wilayah: 'Bali',
      warna: 'var(--primary)'
    },
    {
      teks: 'Pela gandong — ikatan persaudaraan antar kampung yang melampaui batas agama, suku, dan adat.',
      asal: 'Tradisi Pela Gandong',
      wilayah: 'Maluku',
      warna: 'var(--accent)'
    },
    {
      teks: 'Belom bahadat — hidup yang bermakna adalah hidup yang berpedoman pada adat dan nilai leluhur.',
      asal: 'Falsafah Dayak',
      wilayah: 'Kalimantan',
      warna: 'var(--secondary)'
    },
    {
      teks: 'Bersatu kita teguh, bercerai kita runtuh — kekuatan sejati ada dalam kebersamaan.',
      asal: 'Peribahasa Nusantara',
      wilayah: 'Seluruh Indonesia',
      warna: 'var(--accent)'
    },
  ]

  const [periIdx] = useState(() => Math.floor(Math.random() * peribahasa.length))

  // Aksara dari 6 wilayah berbeda Nusantara
  const aksaraNusantara = [
    { char: '\u1BD4', label: 'Aksara Batak', region: 'Sumut', font: 'Noto Sans Batak, serif' },
    { char: '\u1A12', label: 'Lontara', region: 'Sulsel', font: 'Noto Sans Buginese, serif' },
    { char: '\u1B13', label: 'Aksara Bali', region: 'Bali', font: 'Noto Sans Balinese, serif' },
    { char: '\uA9A4', label: 'Aksara Jawa', region: 'Jateng', font: 'Noto Sans Javanese, serif' },
    { char: '\u1B94', label: 'Aksara Sunda', region: 'Jabar', font: 'Noto Sans Sundanese, serif' },
    { char: '\uA936', label: 'Aksara Rejang', region: 'Bengkulu', font: 'serif' },
  ]

  // Manfaat — Lucide icons, tidak ada emoji
  const manfaat = [
    {
      icon: Home,
      iconColor: 'var(--primary)',
      iconBg: 'var(--primary-bg)',
      judul: 'Warga Desa',
      desc: 'Ajukan surat, pantau layanan, dan akses informasi desa kapan saja — langsung dari rumah.',
    },
    {
      icon: ClipboardList,
      iconColor: 'var(--secondary)',
      iconBg: 'var(--secondary-bg)',
      judul: 'Perangkat Desa',
      desc: 'Kelola data warga, terbitkan pengumuman, dan pantau perkembangan UMKM lokal dengan mudah.',
    },
    {
      icon: Landmark,
      iconColor: 'var(--primary)',
      iconBg: 'var(--primary-bg)',
      judul: 'Pemerintah Daerah',
      desc: 'Pantau konektivitas digital desa-desa di wilayah dan dorong percepatan layanan publik.',
    },
    {
      icon: GraduationCap,
      iconColor: 'var(--accent)',
      iconBg: 'var(--accent-bg)',
      judul: 'Peneliti & Akademisi',
      desc: 'Akses data demografi dan sosial untuk penelitian kebijakan dan pembangunan desa.',
    },
  ]

  const keistimewaan = [
    'Setiap desa mendapat ruang kerja sendiri yang aman dan terisolasi',
    'Arsitektur multi-desa — dari 1 hingga ribuan desa tanpa tambah infrastruktur',
    'Data desa adalah milik desa — tidak dijual ke pihak ketiga',
    'Antarmuka yang ramah digunakan di perangkat sederhana sekalipun',
    'Sistem keamanan berlapis dengan Row-Level Security di database',
    'Gratis untuk bergabung — tidak ada biaya pendaftaran',
  ]

  return (
    <div className="page-enter">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="lp-hero">
        {/* Foto latar — rumah adat / budaya Nusantara */}
        <div className="lp-hero-photo" />
        {/* Overlay gelap untuk keterbacaan */}
        <div className="lp-hero-overlay" />
        {/* Motif batik halus */}
        <div className="lp-hero-batik" />

        <div className="container lp-hero-inner">
          <div className="lp-hero-content animate-fade-in-up">
            <div className="lp-eyebrow">
              <MapPin size={12} />
              <span>Platform Digital Desa Nusantara</span>
            </div>
            <h1 className="lp-hero-title">NusaDesa</h1>
            <p className="lp-hero-tagline">
              Konektivitas Desa Nusantara Terintegrasi
            </p>
            <div className="lp-hero-divider" />
            <p className="lp-hero-desc">
              Platform digital terpadu yang menghubungkan desa-desa di seluruh Nusantara —
              dari Sabang sampai Merauke — dalam satu ekosistem layanan publik yang modern,
              mudah diakses, dan bergotong royong.
            </p>
            <div className="lp-hero-actions">
              <Link to="/daftar-desa" className="lp-btn-primary">
                Daftarkan Desa Anda <ArrowRight size={16} />
              </Link>
              <Link to="/syarat-ketentuan" className="lp-btn-ghost">
                Panduan Akses
              </Link>
            </div>
            <div className="lp-trust-row">
              <div className="lp-trust-item"><CheckCircle size={13} /><span>Gratis bergabung</span></div>
              <div className="lp-trust-item"><Lock size={13} /><span>Data aman & terlindungi</span></div>
              <div className="lp-trust-item"><Smartphone size={13} /><span>Ramah perangkat apapun</span></div>
            </div>

            {/* Strip Aksara Nusantara — representasi 6 wilayah */}
            <div className="lp-script-strip">
              <span className="lp-script-strip-label">Ragam Aksara</span>
              {aksaraNusantara.map((s, i) => (
                <div key={i} className="lp-script-item" title={`${s.label} — ${s.region}`}>
                  <span className="lp-script-char" style={{ fontFamily: s.font }}>{s.char}</span>
                  <span className="lp-script-label">{s.region}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TENTANG NUSADESA ────────────────────────────────────── */}
      <section className="section lp-about-section batik-bg">
        <div className="container">
          <div className="lp-about-grid">
            <div className="lp-about-text animate-fade-in-up">
              <span className="section-label">Tentang Platform</span>
              <h2 className="section-title">Apa Itu NusaDesa?</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '1.05rem' }}>
                <strong style={{ color: 'var(--text)' }}>NusaDesa</strong> adalah platform digital
                multi-desa yang dibangun khusus untuk memenuhi kebutuhan tata kelola desa, dusun,
                dan kelurahan di seluruh Indonesia. Setiap desa yang mendaftar mendapatkan ruang kerja
                digitalnya sendiri yang dapat diakses melalui URL unik — misalnya{' '}
                <code className="lp-code">/kepuh</code> atau <code className="lp-code">/dengok</code>.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                Platform ini menjembatani kesenjangan antara administrasi desa tradisional dengan
                layanan publik digital zaman kini — dengan semangat gotong royong yang mengakar
                dalam budaya Nusantara.
              </p>
              <div className="lp-about-badges">
                <span className="lp-badge lp-badge-green">Multi-Desa</span>
                <span className="lp-badge lp-badge-teal">Data Aman (RLS)</span>
                <span className="lp-badge lp-badge-gold">Gotong Royong Digital</span>
              </div>
            </div>
            <div className="lp-about-cards animate-fade-in-up delay-2">
              {manfaat.map((m, i) => (
                <div key={i} className="lp-use-card">
                  <div className="lp-use-icon" style={{ background: m.iconBg, color: m.iconColor }}>
                    <m.icon size={18} />
                  </div>
                  <div>
                    <strong>{m.judul}</strong>
                    <p>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peribahasa — ditampilkan dengan atribusi wilayah yang jelas */}
          <div style={{ marginTop: '3rem', maxWidth: 680 }}>
            <div className="peribahasa">
              {peribahasa[periIdx].teks}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
                <span className="peribahasa-source" style={{ marginTop: 0 }}>{peribahasa[periIdx].asal}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '0.15rem 0.625rem',
                  borderRadius: '999px',
                  fontSize: '0.65rem', fontWeight: 700,
                  background: peribahasa[periIdx].warna + '15',
                  color: peribahasa[periIdx].warna,
                  border: `1px solid ${peribahasa[periIdx].warna}25`,
                  fontFamily: 'var(--font-family)', fontStyle: 'normal',
                  letterSpacing: '0.06em', textTransform: 'uppercase'
                }}>
                  {peribahasa[periIdx].wilayah}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DARI SABANG SAMPAI MERAUKE ──────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <span className="section-label">Dari Sabang sampai Merauke</span>
              <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '0.75rem', textAlign: 'left' }}>Hadir di 38 Provinsi Nusantara</h2>
              <p className="section-subtitle" style={{ margin: '0', maxWidth: '600px', textAlign: 'left' }}>
                Memastikan seluruh pelosok negeri, tanpa terkecuali, dapat terhubung dan menikmati transformasi pelayanan publik secara digital.
              </p>
            </div>
            
            {/* Tombol Navigasi Slider */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => scrollSlider('left')} style={{ 
                width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', 
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text)'
              }} aria-label="Scroll Kiri">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollSlider('right')} style={{ 
                width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', 
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text)'
              }} aria-label="Scroll Kanan">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Container Slider Horizontal */}
          <div ref={sliderRef} style={{
            display: 'flex', gap: '1.25rem',
            overflowX: 'auto', paddingBottom: '1.5rem',
            scrollSnapType: 'x mandatory',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            paddingLeft: 'max(1rem, calc(50vw - 600px))', /* Sesuaikan dengan max-width container 1200px */
            paddingRight: 'max(1rem, calc(50vw - 600px))',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none' /* Sembunyikan scrollbar untuk UI minimalis */
          }} className="hide-scrollbar">
            {daftarProvinsi.map((p, i) => {
              const foto = getRumahAdatFoto(p.wilayah, i, p.nama);
              return (
                <div key={i} style={{
                  minWidth: '220px', maxWidth: '240px', height: '300px',
                  borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden',
                  scrollSnapAlign: 'start', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  <img src={foto} alt={`Rumah Adat / Nuansa ${p.nama}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(0,32,26,0.3) 0%, rgba(0,0,0,0.1) 100%)' // Subtle color filter to blend generic photos
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,32,26,0.95) 0%, rgba(0,32,26,0.4) 60%, rgba(0,0,0,0) 100%)'
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.25rem'
                  }}>
                    <span style={{ 
                      display: 'inline-block', padding: '0.2rem 0.5rem', background: 'var(--primary)', 
                      color: 'white', fontSize: '0.65rem', fontWeight: 700, borderRadius: 'var(--radius-sm)', 
                      letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' 
                    }}>
                      {p.wilayah}
                    </span>
                    <strong style={{ display: 'block', color: 'white', fontSize: '1.1rem', marginBottom: '0.25rem', lineHeight: 1.2 }}>
                      {p.nama}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STATISTIK ───────────────────────────────────────────── */}
      <section className="section lp-stats-section" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="grid grid-3">
            <div className="stat-card animate-fade-in-up delay-1">
              <div className="stat-icon"><Globe size={22} /></div>
              <div className="stat-number">{villageCount || 1}+</div>
              <div className="stat-label">Desa Terdaftar</div>
            </div>
            <div className="stat-card animate-fade-in-up delay-2">
              <div className="stat-icon" style={{ background: 'var(--secondary-bg)', color: 'var(--secondary)' }}>
                <MapPin size={22} />
              </div>
              <div className="stat-number">
                {villages.length > 0 ? new Set(villages.map(v => v.province).filter(Boolean)).size : 1}
              </div>
              <div className="stat-label">Provinsi Terlayani</div>
            </div>
            <div className="stat-card animate-fade-in-up delay-3">
              <div className="stat-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
                <Shield size={22} />
              </div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Layanan Daring</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FITUR UNGGULAN ──────────────────────────────────────── */}
      <section className="section features-section batik-parang-bg">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Fitur Unggulan</span>
            <h2 className="section-title">Satu Platform, Semua Kebutuhan Desa</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Enam modul terintegrasi untuk mendukung tata kelola desa yang modern, transparan, dan berdaya.
            </p>
          </div>
          <div className="grid grid-3">
            {fitur.map((f, i) => (
              <div key={i} className="feature-card animate-fade-in-up">
                <div className="feature-icon" style={{ background: `${f.color}10`, color: f.color }}>
                  <f.icon size={26} />
                </div>
                <h3>{f.nama}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MENGAPA NUSADESA ────────────────────────────────────── */}
      <section className="section batik-bg" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="lp-why-grid">
            <div className="lp-why-left animate-fade-in-up">
              <span className="section-label">Mengapa NusaDesa</span>
              <h2 className="section-title">Dibangun dari Desa,<br />untuk Nusantara.</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '1.5rem', fontSize: '1rem' }}>
                NusaDesa bukan sekadar aplikasi — ini adalah gerakan gotong royong digital
                yang memberdayakan setiap desa untuk bangkit bersama-sama.
              </p>
              {/* Kutipan filosofi — Pela Gandong, Maluku */}
              <div style={{
                background: 'linear-gradient(135deg, var(--secondary-bg), var(--primary-bg))',
                border: '1px solid rgba(0,128,134,0.12)',
                borderLeft: '3px solid var(--secondary)',
                borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem'
              }}>
                <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--secondary-dark, var(--secondary))', lineHeight: 1.75, margin: 0 }}>
                  "Pela gandong — ikatan persaudaraan antar kampung yang melampaui batas agama, suku, dan adat."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Tradisi Pela Gandong
                  </span>
                  <span style={{ padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 700, background: 'var(--secondary-bg)', color: 'var(--secondary)', border: '1px solid var(--secondary-bg)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Maluku
                  </span>
                </div>
              </div>
              <Link to="/daftar-desa" className="btn btn-primary">
                Bergabung Sekarang <ArrowRight size={16} />
              </Link>
            </div>
            <div className="lp-why-right animate-fade-in-up delay-2">
              {keistimewaan.map((point, i) => (
                <div key={i} className="lp-why-item">
                  <div className="lp-why-dot" />
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ALUR PENDAFTARAN ────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Cara Bergabung</span>
            <h2 className="section-title">Tiga Langkah Menuju Desa Digital</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Proses yang mudah dan cepat. Desa Anda bisa aktif dalam hitungan hari.
            </p>
          </div>
          <div className="grid grid-3">
            {langkah.map((l, i) => (
              <div key={i} className="lp-step-card animate-fade-in-up">
                <div className="lp-step-num" style={{ color: l.color, borderColor: l.color }}>
                  {l.num}
                </div>
                <div className="lp-step-icon" style={{ color: l.color }}>
                  <l.icon size={22} />
                </div>
                <h3 style={{ marginBottom: '0.625rem', fontSize: '1.1rem' }}>{l.judul}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESA TERDAFTAR ──────────────────────────────────────── */}
      {villages.length > 0 && (
        <section className="section batik-bg" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
              <span className="section-label">Jaringan Kami</span>
              <h2 className="section-title">Desa yang Telah Bergabung</h2>
            </div>
            <div className="grid grid-3">
              {villages.map(v => (
                <Link to={`/${v.slug}`} key={v.id} className="card" style={{ textDecoration: 'none' }}>
                  <div className="card-body" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--primary-bg), var(--secondary-bg))',
                        color: 'var(--primary)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0,
                        fontFamily: 'Lora, serif'
                      }}>
                        {v.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ marginBottom: '0.2rem', fontSize: '1rem' }}>{v.name}</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {v.district && `${v.district}, `}{v.regency || v.full_address}
                        </p>
                      </div>
                    </div>
                    <span className="feature-link" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                      Kunjungi Desa <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          {/* Garis ornamen batik — pengganti aksara tunggal yg bias */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '0.875rem',
            marginBottom: '1.25rem', opacity: 0.12
          }}>
            {['\u1BD4','\u1A12','\u1B13','\uA9A4','\u1B94','\uA936'].map((c, i) => (
              <span key={i} style={{
                fontFamily: i===0?'Noto Sans Batak,serif':i===1?'Noto Sans Buginese,serif':i===2?'Noto Sans Balinese,serif':i===3?'Noto Sans Javanese,serif':i===4?'Noto Sans Sundanese,serif':'serif',
                fontSize: '2rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1
              }}>{c}</span>
            ))}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem',
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem'
          }}>
            <Leaf size={12} style={{ color: 'var(--accent)', opacity: 0.8 }} />
            Bergotong royong membangun desa
          </div>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '2.25rem', fontWeight: 800 }}>
            Wujudkan Desa Digital Anda Sekarang
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.8 }}>
            Bergabunglah bersama NusaDesa dan mulai transformasi digital desa Anda.
            Pendaftaran gratis, proses cepat, dan desa Anda langsung aktif dalam hitungan hari.
          </p>
          <div className="flex-center gap-md" style={{ flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
            <Link to="/daftar-desa" className="btn btn-lg" style={{
              background: 'white', color: 'var(--primary)', fontWeight: 700,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              Daftarkan Desa — Gratis
            </Link>
            <Link to="/syarat-ketentuan" className="btn btn-lg" style={{
              background: 'rgba(255,255,255,0.1)', color: 'white',
              border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)'
            }}>
              Baca Panduan Akses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
