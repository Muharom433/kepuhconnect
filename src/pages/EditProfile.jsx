import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Save, AlertCircle, CheckCircle, Phone, MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react'

const COUNTRY_CODES = [
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+1',  country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
]

export default function EditProfile() {
  const { profile, user } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', whatsapp: '', countryCode: '+62', address: '' })
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [error, setError] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    if (profile) {
      setForm({
        firstName:   profile.first_name  || '',
        lastName:    profile.last_name   || '',
        whatsapp:    profile.whatsapp    || '',
        countryCode: profile.country_code || '+62',
        address:     profile.address     || '',
      })
    }
  }, [profile])

  /* ── Update profil ── */
  async function handleSaveProfile(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Nama depan dan belakang wajib diisi.'); return
    }
    if (!form.whatsapp.trim()) { setError('Nomor WhatsApp wajib diisi.'); return }

    setLoading(true)
    const { error: err } = await supabase.from('profiles').update({
      first_name:   form.firstName.trim(),
      last_name:    form.lastName.trim(),
      whatsapp:     form.whatsapp.trim(),
      country_code: form.countryCode,
      address:      form.address.trim(),
    }).eq('id', user.id)

    setLoading(false)
    if (err) { setError('Gagal menyimpan: ' + err.message); return }
    setSuccess('Profil berhasil diperbarui!')
    setTimeout(() => setSuccess(''), 3000)
  }

  /* ── Ganti password ── */
  async function handleChangePassword(e) {
    e.preventDefault()
    setPwError(''); setPwSuccess('')
    if (pwForm.newPassword.length < 6) { setPwError('Password minimal 6 karakter.'); return }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Konfirmasi password tidak cocok.'); return }

    setPwLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password: pwForm.newPassword })
    setPwLoading(false)
    if (err) { setPwError('Gagal ganti password: ' + err.message); return }
    setPwSuccess('Password berhasil diubah!')
    setPwForm({ newPassword: '', confirmPassword: '' })
    setTimeout(() => setPwSuccess(''), 3000)
  }

  return (
    <div className="page-enter" style={{ minHeight: '80vh', padding: '3rem 1rem', background: 'var(--bg-alt)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--primary-bg)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={24} />
            </div>
            <div>
              <h2 style={{ marginBottom: '0.1rem' }}>Edit Profil</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* ── Card: Data Diri ── */}
        <div className="card-flat" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary)" /> Data Diri
          </h3>

          {error   && <div className="alert alert-error"  ><AlertCircle size={16} /> {error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={16} /> {success}</div>}

          <form onSubmit={handleSaveProfile}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nama Depan *</label>
                <input type="text" className="form-input" value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Nama depan" />
              </div>
              <div className="form-group">
                <label className="form-label">Nama Belakang *</label>
                <input type="text" className="form-input" value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Nama belakang" />
              </div>
            </div>

            {/* Info email - tidak bisa diubah */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Mail size={14} /> Email
                <span style={{ fontSize: '0.72rem', background: 'var(--bg-alt)', padding: '0.1rem 0.5rem', borderRadius: '999px', color: 'var(--text-muted)' }}>
                  tidak bisa diubah
                </span>
              </label>
              <input type="email" className="form-input" value={user?.email || ''} disabled
                style={{ background: 'var(--bg-alt)', color: 'var(--text-muted)', cursor: 'not-allowed' }} />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Phone size={14} /> Nomor WhatsApp *
              </label>
              <div className="form-phone-row">
                <select className="form-select" value={form.countryCode}
                  onChange={e => setForm({ ...form, countryCode: e.target.value })}>
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input type="tel" className="form-input" value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, '') })}
                  placeholder="81234567890" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <MapPin size={14} /> Alamat Lengkap
              </label>
              <textarea className="form-input" value={form.address} rows={3}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="RT/RW, Dusun, Desa, Kecamatan" />
            </div>

            <button id="btnSimpanProfil" type="submit" className="btn btn-primary btn-lg"
              style={{ width: '100%' }} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Menyimpan...</>
                : <><Save size={18} /> Simpan Perubahan</>
              }
            </button>
          </form>
        </div>

        {/* ── Card: Ganti Password ── */}
        <div className="card-flat" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--primary)" /> Ganti Password
          </h3>

          {pwError   && <div className="alert alert-error"  ><AlertCircle size={16} /> {pwError}</div>}
          {pwSuccess && <div className="alert alert-success"><CheckCircle size={16} /> {pwSuccess}</div>}

          <form onSubmit={handleChangePassword}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password Baru *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} className="form-input"
                    value={pwForm.newPassword}
                    onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    style={{ paddingRight: '2.75rem' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Konfirmasi Password *</label>
                <input type={showPw ? 'text' : 'password'} className="form-input"
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  placeholder="Ulangi password baru" />
              </div>
            </div>

            <button id="btnGantiPassword" type="submit" className="btn btn-outline btn-lg"
              style={{ width: '100%' }} disabled={pwLoading}>
              {pwLoading
                ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Memproses...</>
                : <><Lock size={18} /> Ganti Password</>
              }
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
