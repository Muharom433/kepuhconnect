import { Link } from 'react-router-dom'
import {
  Globe, Shield, Target, Eye, ArrowRight,
  ChevronRight, Zap, Users, CheckCircle,
  Layers, Lock, Leaf, TrendingUp, Heart, BookOpen
} from 'lucide-react'

export default function AboutPage() {

  const pilar = [
    {
      icon: Globe,
      judul: 'Desa Terhubung',
      desc: 'Setiap desa yang mendaftar mendapatkan kehadiran digital permanen — dapat diakses dari mana saja, dikelola oleh warga setempat.',
      color: 'var(--primary)',
      bg: 'var(--primary-bg)',
    },
    {
      icon: Shield,
      judul: 'Infrastruktur Terpercaya',
      desc: 'Ditenagai Supabase dengan Row-Level Security — data desa Anda terisolasi, terenkripsi, dan sepenuhnya berdaulat.',
      color: 'var(--secondary)',
      bg: 'var(--secondary-bg)',
    },
    {
      icon: Heart,
      judul: 'Gotong Royong Digital',
      desc: 'Dibangun dengan semangat gotong royong — memenuhi kebutuhan nyata komunitas desa, dari persuratan hingga pemberdayaan ekonomi lokal.',
      color: 'var(--primary)',
      bg: 'var(--primary-bg)',
    },
    {
      icon: TrendingUp,
      judul: 'Scalable & Berkelanjutan',
      desc: 'Arsitektur multi-desa yang tumbuh bersama — dari 1 hingga ribuan desa tanpa perubahan infrastruktur.',
      color: 'var(--accent)',
      bg: 'var(--accent-bg)',
    },
  ]

  const teknologi = [
    { label: 'Frontend', nilai: 'React + Vite' },
    { label: 'Desain', nilai: 'Vanilla CSS Custom Design System' },
    { label: 'Database', nilai: 'Supabase (PostgreSQL)' },
    { label: 'Autentikasi', nilai: 'Supabase Auth (JWT)' },
    { label: 'Keamanan', nilai: 'Row-Level Security (RLS)' },
    { label: 'Routing', nilai: 'React Router v6 (slug per desa)' },
  ]

  const penggunaUtama = [
    {
      icon: Users,
      kelompok: 'Warga Desa',
      desc: 'Warga yang ingin mengakses layanan pemerintah desa, mengikuti kabar kampung, dan mendukung produk UMKM lokal tanpa harus keluar rumah.',
    },
    {
      icon: BookOpen,
      kelompok: 'Perangkat & Pamong Desa',
      desc: 'Kepala Dusun, RT, RW, dan staf desa yang membutuhkan alat modern untuk mengelola data, melayani warga, dan menerbitkan pengumuman.',
    },
    {
      icon: Globe,
      kelompok: 'Diaspora & Perantau',
      desc: 'Putra-putri desa yang merantau dan ingin tetap terhubung dengan kampung halaman, mengikuti perkembangan, dan mendukung UMKM lokal.',
    },
    {
      icon: Layers,
      kelompok: 'Pemerintah & Peneliti',
      desc: 'Instansi pemerintah daerah dan akademisi yang ingin memantau perkembangan layanan digital desa dan melakukan kajian kebijakan.',
    },
  ]

  const fakta = [
    { angka: 'Multi-Desa', label: 'Arsitektur Platform', color: 'var(--primary)' },
    { angka: 'Gratis', label: 'Pendaftaran Desa', color: 'var(--secondary)' },
    { angka: '24/7', label: 'Ketersediaan Layanan', color: 'var(--accent)' },
    { angka: 'RLS', label: 'Keamanan Tingkat Database', color: 'var(--primary)' },
  ]

  const keunggulan = [
    'Setiap desa mendapat URL unik sendiri: /nama-desa',
    'Warga bisa mengajukan dan memantau status surat administrasi secara daring',
    'Produk UMKM lokal dipromosikan lewat katalog digital yang terintegrasi',
    'Perangkat desa tidak perlu keahlian teknis untuk mengelola platform',
    'Pembaruan platform otomatis berlaku untuk semua desa yang terdaftar',
    'Dirancang untuk bekerja optimal di koneksi internet yang terbatas',
  ]

  return (
    <div className="page-enter">

      {/* ─── HEADER ────────────────────────────────────────── */}
      <section className="batik-dark-bg" style={{
        background: 'linear-gradient(160deg, #0B2318 0%, #0E3325 60%, #0C3530 100%)',
        padding: '6rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 70% at 80% 30%, rgba(0,128,134,0.1), transparent), radial-gradient(ellipse 50% 60% at 10% 70%, rgba(0,132,79,0.08), transparent)',
        }} />
        {/* Aksara dekoratif - Ornamen Pola Garis Halus */}
        <div style={{
          position: 'absolute', right: '5%', top: '10%', bottom: '10%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem',
          opacity: 0.05, pointerEvents: 'none', userSelect: 'none'
        }}>
          {['\u1BD4','\u1A12','\u1B13','\uA936'].map((c, i) => (
            <div key={i} style={{ 
              fontFamily: i===0?'Noto Sans Batak,serif':i===1?'Noto Sans Buginese,serif':i===2?'Noto Sans Balinese,serif':'serif', 
              fontSize: '4.5rem', lineHeight: 1 
            }}>
              {c}
            </div>
          ))}
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>NusaDesa</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Tentang Kami</span>
          </div>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,132,79,0.15)', border: '1px solid rgba(0,132,79,0.25)', borderRadius: 'var(--radius-full)', padding: '0.35rem 1rem', fontSize: '0.75rem', color: 'rgba(150,220,180,0.9)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
              ✦ Tentang NusaDesa
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.1 }}>
              Menyatukan Desa-Desa<br />di Seluruh Nusantara
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
              NusaDesa adalah platform digital multi-desa yang memungkinkan desa, dusun, dan
              kelurahan di Indonesia untuk memberikan layanan publik modern, mengelola komunitas,
              dan tumbuh bersama dalam ekosistem digital Nusantara.
            </p>
            {/* Peribahasa dalam header */}
            <div style={{
              borderLeft: '2px solid var(--accent)', paddingLeft: '1rem',
              marginTop: '1.5rem', marginBottom: '2rem'
            }}>
              <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                "Bersatu kita teguh, bercerai kita runtuh."
              </p>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginTop: '0.375rem' }}>
                Peribahasa Nusantara
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/daftar-desa" className="btn btn-primary">
                Daftarkan Desa <ArrowRight size={15} />
              </Link>
              <Link to="/syarat-ketentuan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: 'transparent', color: 'rgba(255,255,255,0.6)', borderRadius: 'var(--radius-md)', fontWeight: 500, fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none' }}>
                Panduan Akses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── APA ITU NUSADESA ──────────────────────────────── */}
      <section className="section batik-bg" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              <span className="section-label">Apa Itu NusaDesa</span>
              <h2 className="section-title">Platform Satu untuk Semua Desa Indonesia</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '1rem' }}>
                Indonesia memiliki lebih dari <strong style={{ color: 'var(--text)' }}>83.000 desa</strong> yang tersebar
                di 17.000 kepulauan Nusantara. Setiap desa — dari Aceh hingga Papua —
                berhak mendapatkan layanan pemerintahan digital yang setara dengan kota.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '1rem' }}>
                NusaDesa menyediakan platform <strong style={{ color: 'var(--text)' }}>multi-desa (multi-tenant)</strong> di
                mana setiap desa mendapat ruang kerja digital yang terisolasi dan aman —
                dapat diakses melalui URL unik seperti <code style={{ background: 'var(--bg-alt)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.875em', border: '1px solid var(--border)' }}>/kepuh</code> atau{' '}
                <code style={{ background: 'var(--bg-alt)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.875em', border: '1px solid var(--border)' }}>/dengok</code>.
              </p>
              {/* Kutipan kearifan lokal — Dayak, Kalimantan */}
              <div style={{ marginTop: '1.5rem', padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, var(--secondary-bg), var(--primary-bg))', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,128,134,0.1)' }}>
                <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'var(--secondary)', fontSize: '0.975rem', lineHeight: 1.75, margin: 0 }}>
                  "Belom bahadat — hidup yang bermakna adalah hidup yang berpedoman pada adat dan nilai leluhur."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Falsafah Dayak</span>
                  <span style={{ padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 700, background: 'var(--secondary-bg)', color: 'var(--secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Kalimantan</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {keunggulan.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{pt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAKTA PLATFORM ────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="grid grid-4">
            {fakta.map((f, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', background: 'var(--surface)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: f.color, marginBottom: '0.4rem', fontFamily: 'Lora, serif' }}>{f.angka}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PILAR PLATFORM ────────────────────────────────── */}
      <section className="section features-section batik-parang-bg">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Prinsip Kami</span>
            <h2 className="section-title">Empat Pilar NusaDesa</h2>
          </div>
          <div className="grid grid-4">
            {pilar.map((p, i) => (
              <div key={i} className="feature-card" style={{ cursor: 'default' }}>
                <div className="feature-icon" style={{ background: p.bg, color: p.color }}>
                  <p.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1rem' }}>{p.judul}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PENGGUNA UTAMA ────────────────────────────────── */}
      <section className="section batik-bg" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Siapa yang Menggunakannya</span>
            <h2 className="section-title">NusaDesa untuk Siapa?</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Dirancang untuk berbagai lapisan masyarakat dalam ekosistem tata kelola desa.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {penggunaUtama.map((u, i) => (
              <div key={i} style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', background: 'var(--surface)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: i % 2 === 0 ? 'var(--primary-bg)' : 'var(--secondary-bg)', color: i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <u.icon size={22} />
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.4rem', fontSize: '1rem' }}>{u.kelompok}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEKNOLOGI ─────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container" style={{ maxWidth: 780, margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">Teknologi</span>
            <h2 className="section-title">Dibangun dengan Fondasi Kokoh</h2>
            <p className="section-subtitle" style={{ margin: '0 auto', fontSize: '0.95rem' }}>
              NusaDesa menggunakan tumpukan teknologi modern dan terbuka yang dioptimalkan untuk keandalan,
              keamanan, dan kemudahan pengembangan.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
            {teknologi.map((t, i) => (
              <div key={i} style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>{t.label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{t.nilai}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VISI & MISI ───────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Arah & Tujuan</span>
            <h2 className="section-title">Visi & Misi NusaDesa</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
              {/* Aksara dekoratif Nusantara */}
              <div style={{ position: 'absolute', bottom: -10, right: 10, fontFamily: 'Noto Sans Balinese, serif', fontSize: '5rem', color: 'rgba(255,255,255,0.06)', lineHeight: 1, pointerEvents: 'none', fontWeight: 700 }}>{'\u1B13'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', opacity: 0.7 }}>
                <Eye size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Visi</span>
              </div>
              <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.9, margin: 0 }}>
                "Indonesia yang terhubung secara digital, di mana setiap desa memiliki akses setara
                terhadap infrastruktur tata kelola yang baik, tanpa memandang letak geografis atau kondisi ekonomi."
              </p>
            </div>
            <div style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
              {/* Aksara dekoratif Nusantara */}
              <div style={{ position: 'absolute', bottom: -10, right: 10, fontFamily: 'Noto Sans Buginese, serif', fontSize: '4.5rem', color: 'rgba(255,255,255,0.06)', lineHeight: 1, pointerEvents: 'none', fontWeight: 700 }}>{'\u1A12'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', opacity: 0.7 }}>
                <Target size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Misi</span>
              </div>
              <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.9, margin: 0 }}>
                "Membangun dan memelihara platform digital yang terbuka, aman, dan berkelanjutan —
                sehingga desa-desa di seluruh Nusantara dapat memberikan layanan publik modern dan
                berpartisipasi penuh dalam ekonomi digital."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Apakah Desa Anda Sudah Siap?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 500, margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.75 }}>
            Bergabunglah dalam gerakan desa digital Nusantara. Pendaftaran gratis dan proses aktivasi
            berlangsung hanya dalam beberapa hari.
          </p>
          <div className="flex-center gap-md">
            <Link to="/daftar-desa" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
              Daftarkan Desa — Gratis
            </Link>
            <Link to="/syarat-ketentuan" className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              Panduan Akses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
