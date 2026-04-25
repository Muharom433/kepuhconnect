import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, Mail, Lock, AlertCircle, Clock, Shield } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('') // 'unverified' | 'invalid' | 'general'
  const [loading, setLoading] = useState(false)
  const { signIn, isLoggedIn, isSuperAdmin, profile } = useAuth()
  const navigate = useNavigate()
  const redirected = useRef(false)

  // ✅ Redirect setelah login — di dalam useEffect dengan guard agar tidak loop
  useEffect(() => {
    if (!isLoggedIn || !profile) return
    if (redirected.current) return   // sudah redirect, jangan ulangi
    redirected.current = true

    if (isSuperAdmin) {
      navigate('/superadmin', { replace: true })
      return
    }
    if (profile.villages?.slug) {
      if (profile.role === 'admin') {
        navigate(`/${profile.villages.slug}/admin`, { replace: true })
      } else {
        navigate(`/${profile.villages.slug}`, { replace: true })
      }
      return
    }
    navigate('/', { replace: true })
  }, [isLoggedIn, profile, isSuperAdmin])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrorType('')
    setLoading(true)
    try {
      await signIn({ email, password })
      // Redirect akan ditangani oleh useEffect di atas setelah profile ter-load
      // Tapi kita juga perlu handle immediate redirect utk UX
      // Profile akan di-fetch oleh AuthContext, lalu re-render komponen ini
    } catch (err) {
      if (err.message === 'BELUM_VERIFIKASI') {
        setErrorType('unverified')
        setError('unverified')
      } else if (err.message.includes('Email atau password salah') || err.message === 'Invalid login credentials') {
        setErrorType('invalid')
        setError('Email atau password salah. Silakan coba lagi.')
      } else if (err.message === 'Email not confirmed') {
        setErrorType('unverified')
        setError('unverified')
      } else {
        setErrorType('general')
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', background: 'var(--bg-alt)' }}>
      <div style={{ maxWidth: 440, width: '100%' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div className="navbar-logo" style={{ width: 56, height: 56, fontSize: '1.2rem', margin: '0 auto 1rem', background: 'linear-gradient(135deg, #1a6b3c, #2d9254)' }}>ND</div>
          <h2>Selamat Datang</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Masuk ke akun NusaDesa Anda</p>
        </div>

        <div className="card-flat" style={{ padding: '2rem' }}>

          {/* Error: belum diverifikasi admin */}
          {errorType === 'unverified' && (
            <div style={{
              background: '#FFF8E1', border: '1px solid #FFE082',
              borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                <Clock size={18} color="#F59E0B" />
                <strong style={{ color: '#92400E', fontSize: '0.9rem' }}>Akun Menunggu Verifikasi Admin</strong>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#78350F', lineHeight: 1.6, margin: 0 }}>
                Akun Anda sudah terdaftar, namun belum diverifikasi oleh admin.
                Harap tunggu konfirmasi dari admin sebelum bisa masuk.
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#92400E' }}>
                <Shield size={13} />
                Hubungi admin jika membutuhkan konfirmasi lebih cepat.
              </div>
            </div>
          )}

          {/* Error: password salah atau umum */}
          {errorType !== 'unverified' && error && (
            <div className="alert alert-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="loginEmail"
                  type="email"
                  className="form-input"
                  required
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); setErrorType('') }}
                  placeholder="email@contoh.com"
                  style={{ paddingLeft: '2.5rem' }}
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="loginPassword"
                  type="password"
                  className="form-input"
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); setErrorType('') }}
                  placeholder="Masukkan password"
                  style={{ paddingLeft: '2.5rem' }}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button
              id="btnMasuk"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Memeriksa...</>
                : <><LogIn size={18} /> Masuk</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
