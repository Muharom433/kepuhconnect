import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useVillage } from '../contexts/VillageContext'
import {
  Users, MapPin, Home as HomeIcon, Building2,
  ArrowRight, Newspaper, Store, FileText,
  Shield, Wifi, Clock, ChevronRight, Map
} from 'lucide-react'
import './Home.css'

// Fungsi helper: Mengubah GDrive url ke format yang bisa di-embed
const getDirectImageUrl = (url) => {
  if (!url) return '';
  let id = '';
  const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD) id = matchD[1];
  else {
    const matchId = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (matchId) id = matchId[1];
  }
  return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
}

function useInView(ref) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return inView
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef()
  const inView = useInView(ref)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end, duration])
  return <span ref={ref}>{count.toLocaleString('id-ID')}{suffix}</span>
}

export default function Home() {
  const [news, setNews] = useState([])
  const [umkm, setUmkm] = useState([])
  const [wisata, setWisata] = useState([])
  const [villageInfo, setVillageInfo] = useState({})
  const { villageId, villageSlug, villageName } = useVillage()
  const statsRef = useRef()

  useEffect(() => {
    if (villageId) fetchData()
  }, [villageId])

  async function fetchData() {
    try {
      const [newsRes, umkmRes, wisataRes, infoRes, structRes, statRes] = await Promise.all([
        supabase.from('news').select('*').eq('is_published', true).eq('village_id', villageId).order('published_at', { ascending: false }).limit(3),
        supabase.from('umkm_products').select('*').eq('is_active', true).eq('village_id', villageId).limit(6),
        supabase.from('wisata_listings').select('*').eq('is_active', true).eq('village_id', villageId).limit(3),
        supabase.from('village_info').select('*').eq('village_id', villageId),
        supabase.from('village_structure').select('*, profiles(first_name, last_name, avatar_url)').eq('village_id', villageId),
        supabase.from('statistik_kependudukan').select('*').eq('village_id', villageId).single()
      ])
      if (newsRes.data) setNews(newsRes.data)
      if (umkmRes.data) setUmkm(umkmRes.data)
      if (wisataRes.data) setWisata(wisataRes.data)
      if (infoRes.data) {
        const info = {}
        infoRes.data.forEach(item => { info[item.key] = item.value })
        
        // Auto-inject stats
        if (statRes.data) {
          info.jumlah_penduduk = statRes.data.jumlah_penduduk
          info.jumlah_kk = statRes.data.jumlah_kk
        }
        if (structRes.data) {
          info.jumlah_rt = structRes.data.filter(r => r.position.toUpperCase().includes('RT')).length
          info.jumlah_rw = structRes.data.filter(r => r.position.toUpperCase().includes('RW')).length
          
          // Cari Kepala Desa / Dusun, jangan sampai kena "Kepala Keluarga"
          const head = structRes.data.find(r => 
            (r.position.toLowerCase().includes('dukuh') || r.position.toLowerCase().includes('kepala')) &&
            !r.position.toLowerCase().includes('keluarga')
          )
          
          if (head?.profiles) {
            info.auto_nama_dukuh = `${head.profiles.first_name} ${head.profiles.last_name || ''}`.trim()
            info.auto_foto_dukuh = head.profiles.avatar_url
            info.auto_jabatan_dukuh = head.position
          } else if (head?.name) {
            // Fallback kalau pakai kolom statis name (meski relasi profiles diutamakan)
            info.auto_nama_dukuh = head.name
            info.auto_jabatan_dukuh = head.position
          }
        }
        setVillageInfo(info)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const stats = [
    { icon: Users, number: parseInt(villageInfo.jumlah_penduduk) || 4523, label: 'Jumlah Penduduk', suffix: '' },
    { icon: HomeIcon, number: parseInt(villageInfo.jumlah_kk) || 1205, label: 'Kepala Keluarga', suffix: '' },
    { icon: MapPin, number: parseInt(villageInfo.jumlah_rt) || 12, label: 'Rukun Tetangga', suffix: '' },
    { icon: Building2, number: parseInt(villageInfo.luas_wilayah) || 325, label: 'Luas Wilayah (Ha)', suffix: '' },
  ]

  const features = [
    {
      icon: FileText,
      title: 'Layanan Persuratan Digital',
      desc: 'Ajukan surat-surat administrasi secara online tanpa perlu datang ke kantor padukuhan.',
      link: `/${villageSlug}/layanan/surat`,
      color: '#00844F'
    },
    {
      icon: Store,
      title: 'Katalog UMKM',
      desc: 'Temukan produk-produk unggulan dari UMKM Padukuhan Kepuh dalam satu platform.',
      link: `/${villageSlug}/ekonomi`,
      color: '#EF642C'
    },
    {
      icon: Newspaper,
      title: 'Berita & Informasi',
      desc: 'Dapatkan berita terkini dan informasi penting seputar Padukuhan Kepuh.',
      link: `/${villageSlug}/berita`,
      color: '#008086'
    },
  ]

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(10, 34, 24, 0.85), rgba(0, 132, 79, 0.65), rgba(0, 128, 134, 0.6)), url('${villageInfo.hero_image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1920&auto=format&fit=crop'}')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0, zIndex: 0
        }}>
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-in-up" style={{ maxWidth: '800px' }}>
            <span className="hero-badge">
              <Shield size={14} />
              Website Resmi Padukuhan Kepuh
            </span>
            <h1>{villageInfo.hero_title || 'Padukuhan Kepuh'}</h1>
            <p className="hero-subtitle">
              {villageInfo.hero_subtitle || 'Transformasi Digital Padukuhan Kepuh, Desa Pacarejo, Kapanewon Semanu, Gunung Kidul'}
            </p>
            <div className="hero-actions">
              <Link to={`/${villageSlug}/layanan`} className="btn btn-primary btn-lg">
                Akses Layanan
                <ArrowRight size={18} />
              </Link>
              <Link to={`/${villageSlug}/profil`} className="btn btn-outline btn-lg">
                Profil Desa
              </Link>
            </div>
            <div className="hero-highlights">
              <div className="hero-highlight">
                <Wifi size={16} />
                <span>Layanan Online 24/7</span>
              </div>
              <div className="hero-highlight">
                <Clock size={16} />
                <span>Proses Cepat</span>
              </div>
              <div className="hero-highlight">
                <Shield size={16} />
                <span>Data Aman</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sambutan Dukuh */}
      <section className="section sambutan-section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Subtle batik background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='32' fill='none' stroke='rgba(0,132,79,0.05)' stroke-width='1'/%3E%3Ccircle cx='40' cy='40' r='18' fill='none' stroke='rgba(0,132,79,0.035)' stroke-width='1'/%3E%3Ccircle cx='0' cy='0' r='20' fill='none' stroke='rgba(0,132,79,0.035)' stroke-width='1'/%3E%3Ccircle cx='80' cy='80' r='20' fill='none' stroke='rgba(0,132,79,0.035)' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sambutan-grid">
            <div className="sambutan-photo animate-fade-in-up">
              <div className="sambutan-photo-frame" style={{ 
                backgroundImage: `url(${villageInfo.auto_foto_dukuh || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                borderRadius: 'var(--radius-xl)'
              }}>
                <div className="sambutan-photo-placeholder" style={{ background: 'transparent' }}>
                </div>
              </div>
              <div className="sambutan-nama">
                <h4>{villageInfo.auto_nama_dukuh || villageInfo.nama_dukuh || 'H. Ahmad Sutrisno'}</h4>
                <p>{villageInfo.auto_jabatan_dukuh || 'Kepala Desa Kepuh'}</p>
              </div>
            </div>
            <div className="sambutan-text animate-fade-in-up delay-2">
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#EF642C',
                background: 'rgba(239,100,44,0.08)', border: '1px solid rgba(239,100,44,0.18)',
                borderRadius: '999px', padding: '0.3rem 0.875rem', marginBottom: '1rem'
              }}>Sambutan Kepala Desa</span>
              <h2 className="section-title">Selamat Datang di Website Padukuhan Kepuh</h2>
              <p className="sambutan-content">
                {villageInfo.sambutan_dukuh || 'Selamat datang di Website Padukuhan Kepuh, Desa Pacarejo, Kapanewon Semanu, Kabupaten Gunung Kidul. Kami berkomitmen untuk memberikan pelayanan terbaik kepada seluruh masyarakat melalui transformasi digital. Semoga website ini dapat memudahkan akses informasi dan layanan bagi seluruh warga.'}
              </p>
              <Link to={`/${villageSlug}/profil`} className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
                Selengkapnya tentang kami
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats-section" ref={statsRef}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#EF642C',
              background: 'rgba(239,100,44,0.08)', border: '1px solid rgba(239,100,44,0.18)',
              borderRadius: '999px', padding: '0.3rem 0.875rem', marginBottom: '1rem',
              display: 'inline-flex'
            }}>Data Desa</span>
            <h2 className="section-title">Statistik Padukuhan Kepuh</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Data kependudukan dan informasi umum Padukuhan Kepuh
            </p>
          </div>
          <div className="grid grid-4">
            {stats.map((stat, i) => (
              <div key={i} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
                <div className="stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className="stat-number">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--primary)',
              background: 'var(--primary-bg)', border: '1px solid rgba(0,132,79,0.15)',
              borderRadius: '999px', padding: '0.3rem 0.875rem', marginBottom: '1rem',
              display: 'inline-flex'
            }}>Fitur Unggulan</span>
            <h2 className="section-title">Layanan Desa Digital</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Akses berbagai layanan desa secara online dengan mudah dan cepat
            </p>
          </div>
          <div className="grid grid-3">
            {features.map((f, i) => (
              <Link to={f.link} key={i} className="feature-card animate-fade-in-up delay-${i + 1}">
                <div className="feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-link">
                  Selengkapnya <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Berita Terkini */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div>
              <span className="section-label">Informasi Terkini</span>
              <h2 className="section-title">Berita Desa</h2>
            </div>
            <Link to={`/${villageSlug}/berita`} className="btn btn-outline hide-mobile">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-3">
            {news.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-xl)' }}>
                <Newspaper size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                <h3 style={{ color: 'var(--text-secondary)' }}>Belum ada berita</h3>
                <p style={{ color: 'var(--text-muted)' }}>Berita desa akan tampil di sini saat diterbitkan.</p>
              </div>
            ) : (
              news.map((item) => (
                <Link to={`/${villageSlug}/berita/${item.slug}`} key={item.id} className="card">
                  <div className="card-img" style={{ 
                    background: 'var(--primary-bg)', 
                    height: 180 
                  }}>
                    {item.image_url ? (
                      <img src={getDirectImageUrl(item.image_url)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex-center" style={{ height: '100%', background: 'rgba(0,0,0,0.05)' }}>
                        <Newspaper size={36} style={{ color: 'var(--primary-light)' }} />
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
                      {item.category}
                    </span>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', lineHeight: 1.4 }}>{item.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.excerpt}</p>
                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-xl)' }}>
            <Link to="/berita" className="btn btn-outline" style={{ display: 'none' }}>
              Lihat Semua Berita <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* UMKM Preview */}
      <section className="section">
        <div className="container">
          <div className="flex-between" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div>
              <span className="section-label">Ekonomi Desa</span>
              <h2 className="section-title">Produk UMKM Unggulan</h2>
            </div>
            <Link to={`/${villageSlug}/ekonomi`} className="btn btn-outline hide-mobile">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-3">
            {umkm.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-xl)' }}>
                <Store size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                <h3 style={{ color: 'var(--text-secondary)' }}>Belum ada UMKM</h3>
                <p style={{ color: 'var(--text-muted)' }}>Produk UMKM akan tampil di sini saat ditambahkan.</p>
              </div>
            ) : (
              umkm.slice(0, 3).map((product) => (
                <div key={product.id} className="card">
                  <div className="card-img" style={{ background: 'var(--primary-bg)', height: 180 }}>
                    {product.image_url ? (
                      <img src={getDirectImageUrl(product.image_url)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex-center" style={{ height: '100%', background: 'rgba(0,0,0,0.05)' }}>
                        <Store size={36} style={{ color: 'var(--primary-light)' }} />
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{product.category}</span>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{product.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>oleh {product.owner_name}</p>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                      Rp {product.price?.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Wisata Preview */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div>
              <span className="section-label">Pariwisata</span>
              <h2 className="section-title">Destinasi Wisata Pilihan</h2>
            </div>
            <Link to={`/${villageSlug}/wisata`} className="btn btn-outline hide-mobile">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-3">
            {wisata.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-xl)' }}>
                <Map size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                <h3 style={{ color: 'var(--text-secondary)' }}>Belum ada Destinasi Wisata</h3>
                <p style={{ color: 'var(--text-muted)' }}>Destinasi wisata akan tampil di sini saat ditambahkan.</p>
              </div>
            ) : (
              wisata.slice(0, 3).map((item) => (
                <div key={item.id} className="card">
                  <div className="card-img" style={{ background: 'var(--primary-bg)', height: 200, position: 'relative' }}>
                    {item.image_url ? (
                      <img src={getDirectImageUrl(item.image_url)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex-center" style={{ height: '100%', background: 'rgba(0,0,0,0.05)' }}>
                        <Map size={36} style={{ color: 'var(--primary-light)' }} />
                      </div>
                    )}
                    {item.ticket_price === 0 && (
                      <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--success)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>
                        Gratis
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.375rem', lineHeight: 1.3 }}>{item.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      <MapPin size={14} /> 
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.location}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Tiket Masuk</div>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                          {item.ticket_price > 0 ? `Rp ${item.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          {/* Aksara strip tipis — oranye */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '0.875rem',
            marginBottom: '1.25rem', opacity: 0.12
          }}>
            {['ᯔ', 'ᨒ', 'ᬓ', 'ꦤ', 'ᮔ', 'ꤶ'].map((c, i) => (
              <span key={i} style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>{c}</span>
            ))}
          </div>
          {/* Badge atas */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '999px', padding: '0.4rem 1rem',
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF642C', display: 'inline-block' }} />
            Bergotong royong membangun desa
          </div>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '2rem', fontWeight: 800 }}>Mulai Gunakan Layanan Digital Desa Kepuh</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.8 }}>
            Daftarkan diri Anda untuk mengakses layanan persuratan dan fitur lainnya di Padukuhan Kepuh
          </p>
          <div className="flex-center gap-md">
            <Link to={`/${villageSlug}/signup`} className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              Daftar Sekarang
            </Link>
            <Link to={`/${villageSlug}/kontak`} className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' }}>
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
