import { Link } from 'react-router-dom'
import {
  FileText, Shield, AlertTriangle, CheckCircle,
  Globe, Users, Lock, Key, ArrowRight, ChevronRight,
  Info, List, BookOpen, Zap
} from 'lucide-react'

export default function TermsConditions() {

  const navigasi = [
    { anchor: '#tentang', label: 'Tentang Platform' },
    { anchor: '#akses', label: 'Panduan Akses' },
    { anchor: '#peran', label: 'Peran Pengguna' },
    { anchor: '#ketentuan', label: 'Syarat Penggunaan' },
    { anchor: '#privasi', label: 'Data & Privasi' },
    { anchor: '#larangan', label: 'Larangan' },
    { anchor: '#tanggung-jawab', label: 'Tanggung Jawab' },
    { anchor: '#perubahan', label: 'Perubahan Kebijakan' },
  ]

  const langkahAkses = [
    {
      langkah: '01',
      judul: 'Jelajahi Platform',
      desc: 'Kunjungi halaman utama NusaDesa untuk mengenal fitur dan melihat desa-desa yang telah terdaftar. Tidak diperlukan akun untuk mengakses halaman publik.',
      icon: Globe,
      color: 'var(--primary)',
    },
    {
      langkah: '02',
      judul: 'Temukan Portal Desa Anda',
      desc: 'Akses portal desa melalui URL unik — contoh: /kepuh, /dengok, atau nama-desa-anda. Setiap desa memiliki halaman publik sendiri berisi berita, UMKM, dan kontak.',
      icon: ChevronRight,
      color: 'var(--secondary)',
    },
    {
      langkah: '03',
      judul: 'Daftar sebagai Warga',
      desc: 'Buat akun di /nama-desa/signup dengan mengisi nama, NIK, nomor HP, dan email. Setelah diverifikasi oleh admin desa, Anda dapat mengakses layanan persuratan digital.',
      icon: Users,
      color: 'var(--primary)',
    },
    {
      langkah: '04',
      judul: 'Ajukan Akses Admin',
      desc: 'Perangkat desa (admin, RT, RW, Dukuh) mendapatkan peran lebih tinggi yang diberikan oleh Super Admin NusaDesa. Hubungi tim kami untuk mendaftarkan perangkat desa Anda.',
      icon: Key,
      color: 'var(--accent)',
    },
  ]

  const peran = [
    {
      nama: 'Warga / Penduduk',
      warna: 'var(--primary)',
      bgWarna: 'var(--primary-bg)',
      deskripsi: 'Warga desa yang telah diverifikasi dan dapat mengakses layanan persuratan serta informasi komunitas.',
      hak: ['Ajukan permohonan surat', 'Pantau status permohonan', 'Jelajahi katalog UMKM', 'Baca berita & pengumuman desa'],
    },
    {
      nama: 'Admin Desa',
      warna: 'var(--secondary)',
      bgWarna: 'var(--secondary-bg)',
      deskripsi: 'Perangkat desa yang berwenang mengelola data, layanan, dan komunitas desanya masing-masing.',
      hak: ['Kelola data warga', 'Proses permohonan surat', 'Terbitkan berita & pengumuman', 'Kelola katalog UMKM', 'Verifikasi dan kelola pengguna'],
    },
    {
      nama: 'Super Admin',
      warna: 'var(--accent-dark)',
      bgWarna: 'var(--accent-bg)',
      deskripsi: 'Tim NusaDesa yang mengawasi seluruh operasional platform secara menyeluruh.',
      hak: ['Daftarkan & nonaktifkan desa', 'Kelola seluruh admin desa', 'Konfigurasi platform', 'Pantau performa & penggunaan'],
    },
  ]

  const seksi = [
    {
      id: 'tentang',
      icon: Info,
      judul: '1. Tentang NusaDesa',
      isi: `NusaDesa adalah platform digital multi-desa (multi-tenant) yang dirancang khusus untuk desa, dusun, dan kelurahan di seluruh Indonesia. Setiap desa yang terdaftar mendapatkan ruang kerja digital yang terisolasi dan dapat diakses melalui URL unik — misalnya /kepuh atau /dengok. Platform ini dikembangkan untuk mendukung transformasi digital di tingkat pemerintahan desa, dengan semangat gotong royong dan pelayanan publik yang setara bagi seluruh Nusantara.

Platform ini dikelola oleh tim NusaDesa dan tersedia secara gratis bagi semua desa yang terdaftar secara resmi di Indonesia. NusaDesa bersifat independen dari partai politik maupun lembaga pemerintah tertentu.`
    },
    {
      id: 'akses',
      icon: Key,
      judul: '2. Akses Platform & Struktur URL',
      isi: `NusaDesa menggunakan arsitektur berbasis URL untuk multi-tenancy. Halaman utama (/) merupakan landing page publik platform. Setiap desa dapat diakses melalui /[slug-desa] (contoh: /kepuh, /dengok). Panel admin desa berada di /[slug-desa]/admin. Panel super admin berada di /superadmin.

Halaman publik (beranda desa, berita, katalog UMKM) dapat diakses tanpa autentikasi. Halaman khusus warga (pengajuan surat, pantau status) memerlukan akun yang telah diverifikasi. Panel admin memerlukan autentikasi berbasis peran.`
    },
    {
      id: 'ketentuan',
      icon: FileText,
      judul: '3. Syarat Penggunaan',
      isi: `Dengan mengakses atau menggunakan NusaDesa, Anda menyatakan setuju dengan seluruh syarat ini. Anda wajib memberikan informasi yang benar dan akurat saat mendaftar. Anda bertanggung jawab menjaga kerahasiaan kredensial akun Anda. Akun tidak boleh dibagikan kepada pihak lain.

Admin Desa bertanggung jawab atas kebenaran dan legalitas seluruh data serta konten yang diterbitkan di ruang kerja desanya. Setiap desa hanya boleh mendaftarkan satu akun. Penggunaan data platform untuk keperluan komersial tanpa izin tertulis dari NusaDesa dilarang.`
    },
    {
      id: 'privasi',
      icon: Lock,
      judul: '4. Data & Privasi',
      isi: `NusaDesa hanya mengumpulkan data minimum yang diperlukan untuk operasional platform. Data pribadi (NIK, nomor HP, email) disimpan secara aman dan tidak dijual kepada pihak ketiga. Data desa adalah milik desa yang bersangkutan. NusaDesa berperan sebagai pemroses data, bukan pemilik.

Data disimpan di infrastruktur Supabase dengan enkripsi end-to-end saat transit maupun saat diam (at rest). Pengguna dapat meminta penghapusan data dengan menghubungi tim NusaDesa. Platform ini mematuhi Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022) Republik Indonesia.`
    },
    {
      id: 'larangan',
      icon: AlertTriangle,
      judul: '5. Tindakan yang Dilarang',
      isi: `Tindakan-tindakan berikut secara tegas dilarang: mengunggah atau menyebarkan konten yang melanggar hukum, bersifat SARA, pornografi, atau merugikan pihak lain; mencoba akses tidak sah ke sistem atau eskalasi hak istimewa; mengunduh data platform secara massal (scraping); menyamar sebagai pengguna, desa, atau organisasi lain; menggunakan platform untuk iklan komersial tanpa izin; mengajukan dokumen administrasi atau data warga yang dipalsukan.

Pelanggaran dapat berakibat pada suspensi akun segera, penonaktifan desa, dan pelimpahan kepada pihak berwenang yang relevan.`
    },
    {
      id: 'tanggung-jawab',
      icon: Shield,
      judul: '6. Ketersediaan Layanan & Tanggung Jawab',
      isi: `NusaDesa berupaya menyediakan layanan 24/7 namun tidak menjamin ketersediaan tanpa gangguan. Pemeliharaan terjadwal akan diumumkan minimal 24 jam sebelumnya. Pemeliharaan darurat yang memerlukan tindakan segera dapat dilakukan tanpa pemberitahuan sebelumnya.

NusaDesa tidak bertanggung jawab atas: keputusan yang diambil perangkat desa berdasarkan data platform; akibat dari data yang dimasukkan secara tidak akurat oleh pengguna; layanan pihak ketiga yang ditautkan dari portal desa; atau gangguan layanan yang disebabkan oleh penyedia infrastruktur (Supabase, dll.).`
    },
    {
      id: 'perubahan',
      icon: BookOpen,
      judul: '7. Perubahan Kebijakan',
      isi: `NusaDesa berhak mengubah Syarat & Ketentuan, ketersediaan fitur, dan kebijakan platform kapan saja. Perubahan signifikan akan dikomunikasikan melalui email kepada admin desa yang terdaftar dan melalui pemberitahuan di platform, paling lambat 14 hari sebelum berlaku.

Penggunaan platform secara berkelanjutan setelah perubahan kebijakan dianggap sebagai persetujuan atas ketentuan baru. Jika Anda tidak setuju atas perubahan yang ada, Anda dapat meminta penonaktifan akun atau desa dengan menghubungi tim kami.`
    },
  ]

  return (
    <div className="page-enter">

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <section className="batik-dark-bg" style={{
        background: 'linear-gradient(160deg, #0B2318 0%, #0E3325 100%)',
        padding: '5rem 0 3.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
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
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 20% 80%, rgba(0,132,79,0.12), transparent)',
          pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>NusaDesa</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Syarat, Ketentuan & Panduan Akses</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,100,44,0.15)', border: '1px solid rgba(239,100,44,0.2)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.875rem', fontSize: '0.72rem', color: 'rgba(239,100,44,0.8)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '1rem', textTransform: 'uppercase' }}>
            <FileText size={11} /> Dokumen Hukum & Panduan
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15 }}>
            Syarat, Ketentuan<br />& Panduan Akses
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 620 }}>
            Semua yang perlu Anda ketahui tentang cara menggunakan NusaDesa — struktur platform,
            peran pengguna, kebijakan data, dan panduan akses langkah demi langkah
            untuk warga, perangkat desa, maupun pemangku kepentingan lainnya.
          </p>
          {/* Peribahasa */}
          <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '1rem', marginTop: '1.5rem' }}>
            <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
              "Adat basandi syarak, syarak basandi kitabullah."
            </p>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginTop: '0.375rem' }}>
              Falsafah Minangkabau — Tata aturan berlandaskan nilai yang benar
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', marginTop: '1.5rem' }}>
            Terakhir diperbarui: April 2026 · Berlaku segera
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '0 var(--space-xl)' }}>

        {/* ─── NAVIGASI CEPAT ────────────────────────────────── */}
        <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 2rem', margin: '3rem 0 2rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>
            <List size={13} style={{ display: 'inline', marginRight: '0.3rem' }} /> Daftar Isi
          </span>
          {navigasi.map((n, i) => (
            <a key={i} href={n.anchor} style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--primary)'}>
              {n.label}
            </a>
          ))}
        </div>

        {/* ─── PANDUAN AKSES ──────────────────────────────────── */}
        <div id="akses" style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label">Mulai Gunakan</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)' }}>
              Cara Mengakses NusaDesa
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '0.5rem' }}>
              Ikuti langkah-langkah berikut sesuai peran Anda — apakah Anda pengunjung biasa,
              warga desa, perangkat desa, atau pemangku kepentingan lainnya.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {langkahAkses.map((s, i) => (
              <div key={i} style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, opacity: 0.7 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--bg-alt)', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <s.icon size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Langkah {s.langkah}</div>
                    <strong style={{ fontSize: '0.925rem', color: 'var(--text)' }}>{s.judul}</strong>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PERAN PENGGUNA ─────────────────────────────────── */}
        <div id="peran" style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label">Peran Pengguna</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)' }}>
              Siapa Saja yang Dapat Menggunakan NusaDesa?
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {peran.map((r, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--surface)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-alt)' }}>
                  <span style={{ display: 'inline-flex', padding: '0.2rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, background: r.bgWarna, color: r.warna }}>
                    {r.nama}
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{r.deskripsi}</p>
                </div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {r.hak.map((h, j) => (
                    <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-alt)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', padding: '0.25rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={11} style={{ color: 'var(--primary)' }} /> {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SEKSI HUKUM ────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
          {seksi.map((s, i) => (
            <div key={i} id={s.id} className="card-flat" style={{ padding: '1.75rem 2rem' }}>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '1.05rem' }}>
                <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--accent-bg)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.icon size={15} />
                </span>
                {s.judul}
              </h3>
              {s.isi.split('\n\n').map((para, j) => (
                <p key={j} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.9, marginBottom: j < s.isi.split('\n\n').length - 1 ? '0.875rem' : 0 }}>
                  {para.trim()}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* ─── PERSETUJUAN / CTA ──────────────────────────────── */}
        <div className="batik-bg" style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--secondary-bg))', borderRadius: 'var(--radius-xl)', padding: '2.5rem', textAlign: 'center', marginBottom: '4rem', border: '1px solid rgba(0,132,79,0.1)' }}>
          <div style={{ fontFamily: 'Noto Sans Buginese, serif', fontSize: '4rem', color: 'var(--primary)', opacity: 0.1, marginBottom: '0.5rem', lineHeight: 1 }}>
            {'\u1A12'}
          </div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: 'var(--shadow-md)' }}>
            <CheckCircle size={26} />
          </div>
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>Siap Bergabung?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 480, margin: '0 auto 1.75rem', lineHeight: 1.8 }}>
            Dengan mendaftarkan desa Anda, Anda menyatakan telah membaca, memahami, dan menyetujui
            seluruh syarat, ketentuan, dan kebijakan privasi yang tercantum di atas.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/daftar-desa" className="btn btn-primary btn-lg">
              Setuju & Daftarkan Desa <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn btn-outline btn-lg">
              Kembali ke Beranda
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
