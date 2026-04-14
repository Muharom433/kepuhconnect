import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useVillage } from '../contexts/VillageContext'
import { FileText, ClipboardList, Info, AlertTriangle, CheckCircle, Lock } from 'lucide-react'

export default function Layanan() {
  const { isLoggedIn, isVerified } = useAuth()
  const { villageSlug } = useVillage()

  if (!isLoggedIn) {
    return (
      <div className="page-enter" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card-flat text-center" style={{ maxWidth: 440, padding: '3rem 2rem' }}>
          <Lock size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Login Diperlukan</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Anda harus masuk untuk mengakses layanan desa</p>
          <Link to={`/${villageSlug}/login`} className="btn btn-primary">Masuk</Link>
        </div>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="page-enter" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card-flat text-center" style={{ maxWidth: 480, padding: '3rem 2rem' }}>
          <AlertTriangle size={48} style={{ color: 'var(--warning)', marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Akun Belum Terverifikasi</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
            Akun Anda belum diverifikasi oleh admin. Silakan tunggu verifikasi untuk mengakses layanan persuratan dan fitur lainnya.
          </p>
          <div className="alert alert-info" style={{ textAlign: 'left' }}>
            Hubungi admin desa untuk mempercepat proses verifikasi.
          </div>
        </div>
      </div>
    )
  }

  const services = [
    { icon: FileText, title: 'Formulir Surat', desc: 'Ajukan permohonan surat administrasi secara online', path: `/${villageSlug}/layanan/surat`, color: 'var(--primary)' },
    { icon: ClipboardList, title: 'Status Permohonan', desc: 'Pantau status permohonan surat Anda', path: `/${villageSlug}/layanan/status`, color: 'var(--info)' },
    { icon: Info, title: 'Info Persyaratan', desc: 'Informasi persyaratan dokumen untuk setiap jenis surat', path: `/${villageSlug}/layanan/persyaratan`, color: 'var(--accent-dark)' },
  ]

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">E-Government</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Layanan Desa Digital</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Akses layanan administrasi desa secara online, cepat, dan mudah
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {services.map((s, i) => (
              <Link to={s.path} key={i} className="card" style={{ textDecoration: 'none' }}>
                <div className="card-body" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <s.icon size={28} />
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
