import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Globe, Shield, FileText, Store, Users, ArrowRight,
  CheckCircle, Newspaper, Building2, MapPin, ChevronRight
} from 'lucide-react'

export default function LandingPage() {
  const [villageCount, setVillageCount] = useState(0)
  const [villages, setVillages] = useState([])

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

  const features = [
    { icon: FileText, title: 'Persuratan Digital', desc: 'Layanan surat administrasi online tanpa perlu datang ke kantor desa.', color: '#2d9254' },
    { icon: Store, title: 'Katalog UMKM', desc: 'Promosikan produk unggulan UMKM desa dalam satu platform digital.', color: '#c9944a' },
    { icon: Newspaper, title: 'Berita & Informasi', desc: 'Publikasi berita terkini dan pengumuman penting desa.', color: '#4a8fc9' },
    { icon: Users, title: 'Kependudukan', desc: 'Kelola data penduduk, KK, dan statistik desa secara real-time.', color: '#9254c9' },
    { icon: Building2, title: 'Struktur Organisasi', desc: 'Tampilkan perangkat desa dalam bagan interaktif.', color: '#c94a6e' },
    { icon: Shield, title: 'Multi-Role & Aman', desc: 'Sistem role admin desa, RT, RW, dan Dukuh dengan keamanan RLS.', color: '#4ac9a1' },
  ]

  const steps = [
    { num: '1', title: 'Isi Formulir Pendaftaran', desc: 'Lengkapi data desa, alamat, dan kontak penanggung jawab.' },
    { num: '2', title: 'Verifikasi oleh Tim NusaDesa', desc: 'Tim kami akan memverifikasi data dan dokumen pendaftaran.' },
    { num: '3', title: 'Desa Aktif & Siap Digunakan', desc: 'Setelah disetujui, desa Anda langsung bisa diakses melalui URL unik.' },
  ]

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{
          backgroundImage: `linear-gradient(135deg, rgba(17, 34, 25, 0.85), rgba(10, 50, 30, 0.9)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0
        }}>
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-in-up" style={{ maxWidth: '800px' }}>
            <span className="hero-badge">
              <Globe size={14} /> Platform Desa Digital Indonesia
            </span>
            <h1>NusaDesa</h1>
            <p className="hero-subtitle">
              Platform digital terpadu untuk mengelola informasi, layanan persuratan, dan UMKM
              desa di seluruh penjuru Indonesia.
            </p>
            <div className="hero-actions">
              <Link to="/daftar-desa" className="btn btn-primary btn-lg">
                Daftarkan Desa Anda <ArrowRight size={18} />
              </Link>
              <Link to="/tentang" className="btn btn-outline btn-lg">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik Platform */}
      <section className="section stats-section">
        <div className="container">
          <div className="grid grid-3">
            <div className="stat-card animate-fade-in-up delay-1">
              <div className="stat-icon"><Globe size={24} /></div>
              <div className="stat-number">{villageCount || 1}</div>
              <div className="stat-label">Desa Terdaftar</div>
            </div>
            <div className="stat-card animate-fade-in-up delay-2">
              <div className="stat-icon"><MapPin size={24} /></div>
              <div className="stat-number">{villages.length > 0 ? new Set(villages.map(v => v.province).filter(Boolean)).size : 1}</div>
              <div className="stat-label">Provinsi Terlayani</div>
            </div>
            <div className="stat-card animate-fade-in-up delay-3">
              <div className="stat-icon"><Shield size={24} /></div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Layanan Online</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section className="section features-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Fitur Platform</span>
            <h2 className="section-title">Satu Platform, Semua Kebutuhan Desa</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              NusaDesa menyediakan berbagai fitur digital untuk mendukung tata kelola desa yang modern.
            </p>
          </div>
          <div className="grid grid-3">
            {features.map((f, i) => (
              <div key={i} className="feature-card animate-fade-in-up" style={{ cursor: 'default' }}>
                <div className="feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="section-label">Cara Bergabung</span>
            <h2 className="section-title">Alur Pendaftaran Desa</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Proses pendaftaran mudah dan cepat, hanya 3 langkah sederhana.
            </p>
          </div>
          <div className="grid grid-3">
            {steps.map((step, i) => (
              <div key={i} className="card-flat animate-fade-in-up" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--primary-bg)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem', fontSize: '1.5rem', fontWeight: 800
                }}>
                  {step.num}
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desa Terdaftar */}
      {villages.length > 0 && (
        <section className="section">
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
                        width: 48, height: 48, borderRadius: 'var(--radius-md)',
                        background: 'var(--primary-bg)', color: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
                      }}>
                        {v.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ marginBottom: '0.25rem' }}>{v.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {v.district && `${v.district}, `}{v.regency || v.full_address}
                        </p>
                      </div>
                    </div>
                    <span className="feature-link" style={{ marginTop: '1rem' }}>
                      Kunjungi <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Wujudkan Desa Digital Anda Sekarang</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Bergabunglah dengan NusaDesa dan mulai transformasi digital desa Anda hari ini.
          </p>
          <div className="flex-center gap-md">
            <Link to="/daftar-desa" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
              Daftarkan Desa
            </Link>
            <Link to="/syarat-ketentuan" className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
