import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useVillage } from '../contexts/VillageContext'
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react'

const COUNTRY_CODES = [
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
]

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  countryCode: '+62', whatsapp: '', address: ''
}

// Terjemahkan pesan error Supabase ke Bahasa Indonesia
function translateError(msg) {
  if (!msg) return 'Terjadi kesalahan, coba lagi.'
  if (msg.includes('after') && msg.includes('seconds')) {
    const match = msg.match(/(\d+)\s*seconds?/)
    const secs = match ? match[1] : 'beberapa'
    return `Terlalu banyak percobaan. Harap tunggu ${secs} detik sebelum mencoba lagi.`
  }
  if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('User already registered'))
    return 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.'
  if (msg.includes('invalid email') || msg.includes('Invalid email'))
    return 'Format email tidak valid.'
  if (msg.includes('Password should be at least'))
    return 'Password minimal 6 karakter.'
  if (msg.includes('network') || msg.includes('fetch'))
    return 'Gagal terhubung ke server. Periksa koneksi internet Anda.'
  return msg
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!re.test(email)) return 'Format email tidak valid'
  const disposable = ['tempmail.com', 'throwaway.email', 'guerrillamail.com', 'yopmail.com', 'mailinator.com', 'trashmail.com']
  const domain = email.split('@')[1]?.toLowerCase()
  if (disposable.includes(domain)) return 'Email domain ini tidak diperbolehkan'
  return null
}

// Modal sukses pendaftaran
function SuccessModal({ email, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem', backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg)', borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem', maxWidth: 420, width: '100%',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          animation: 'scaleIn 0.25s ease',
          textAlign: 'center'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon berhasil */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(34,197,94,0.2)'
        }}>
          <CheckCircle size={36} color="#16a34a" />
        </div>

        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>Data Berhasil Terkirim!</h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.85, marginBottom: '1.75rem' }}>
          Pendaftaran Anda telah kami terima. Tunggu konfirmasi dari admin —
          admin akan memberitahu melalui email jika pendaftaran sudah disetujui,
          setelah itu Anda baru bisa login.
          <br /><br />
          Terima kasih! 🙏
        </p>

        <button
          id="btnTutupModal"
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  )
}

export default function Signup() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const { villageId, villageSlug, villageName } = useVillage()

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'Nama depan wajib diisi'
    if (!form.lastName.trim()) errs.lastName = 'Nama belakang wajib diisi'

    const emailErr = validateEmail(form.email)
    if (emailErr) errs.email = emailErr

    if (form.password.length < 6) errs.password = 'Password minimal 6 karakter'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Password tidak cocok'

    if (!form.whatsapp.trim()) errs.whatsapp = 'Nomor WhatsApp wajib diisi'
    else if (!/^\d{8,15}$/.test(form.whatsapp.replace(/\s/g, ''))) errs.whatsapp = 'Nomor WhatsApp tidak valid (8-15 digit)'

    if (!form.address.trim()) errs.address = 'Alamat wajib diisi'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return

    setLoading(true)
    try {
      await signUp({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        whatsapp: form.whatsapp,
        countryCode: form.countryCode,
        address: form.address,
        villageId: villageId,
      })
      // Berhasil: simpan email, tampilkan modal, reset form
      setRegisteredEmail(form.email)
      setForm(EMPTY_FORM)
      setErrors({})
      setShowModal(true)
    } catch (err) {
      setGlobalError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: null })
    if (globalError) setGlobalError('')
  }

  return (
    <>
      {/* Modal sukses */}
      {showModal && (
        <SuccessModal
          email={registeredEmail}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="page-enter" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', background: 'var(--bg-alt)' }}>
        <div style={{ maxWidth: 520, width: '100%' }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <div className="navbar-logo" style={{ width: 56, height: 56, fontSize: '1.2rem', margin: '0 auto 1rem', background: 'linear-gradient(135deg, #1a6b3c, #2d9254)' }}>ND</div>
            <h2>Daftar Akun Baru</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Buat akun untuk mengakses layanan {villageName || 'desa'}</p>
          </div>

          <div className="card-flat" style={{ padding: '2rem' }}>
            {globalError && (
              <div className="alert alert-error" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{globalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nama Depan *</label>
                  <input id="firstName" type="text" className={`form-input ${errors.firstName ? 'form-input-error' : ''}`} value={form.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="Nama depan" autoComplete="given-name" />
                  {errors.firstName && <p className="form-error">{errors.firstName}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Belakang *</label>
                  <input id="lastName" type="text" className={`form-input ${errors.lastName ? 'form-input-error' : ''}`} value={form.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Nama belakang" autoComplete="family-name" />
                  {errors.lastName && <p className="form-error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input id="email" type="email" className={`form-input ${errors.email ? 'form-input-error' : ''}`} value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="email@contoh.com" autoComplete="email" />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input id="password" type="password" className={`form-input ${errors.password ? 'form-input-error' : ''}`} value={form.password} onChange={e => updateField('password', e.target.value)} placeholder="Minimal 6 karakter" autoComplete="new-password" />
                  {errors.password && <p className="form-error">{errors.password}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Konfirmasi Password *</label>
                  <input id="confirmPassword" type="password" className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`} value={form.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} placeholder="Ulangi password" autoComplete="new-password" />
                  {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nomor WhatsApp *</label>
                <div className="form-phone-row">
                  <select id="countryCode" className="form-select" value={form.countryCode} onChange={e => updateField('countryCode', e.target.value)}>
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code} {c.country}</option>
                    ))}
                  </select>
                  <input id="whatsapp" type="tel" className={`form-input ${errors.whatsapp ? 'form-input-error' : ''}`} value={form.whatsapp} onChange={e => updateField('whatsapp', e.target.value.replace(/\D/g, ''))} placeholder="81234567890" />
                </div>
                {errors.whatsapp && <p className="form-error">{errors.whatsapp}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Lengkap *</label>
                <textarea id="address" className={`form-input ${errors.address ? 'form-input-error' : ''}`} value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="Masukkan alamat lengkap (RT/RW, Desa, Kecamatan)" rows={3} />
                {errors.address && <p className="form-error">{errors.address}</p>}
              </div>

              <button id="btnDaftar" type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading
                  ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Memproses...</>
                  : <><UserPlus size={18} /> Daftar Sekarang</>
                }
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Sudah punya akun? <Link to={`/${villageSlug}/login`} style={{ color: 'var(--primary)', fontWeight: 600 }}>Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
