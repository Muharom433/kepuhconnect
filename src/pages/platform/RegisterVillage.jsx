import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Globe, Send, CheckCircle, AlertCircle } from 'lucide-react'

const EMPTY_FORM = {
  villageName: '', slug: '', fullAddress: '', province: '', regency: '', district: '',
  villageType: 'dusun', contactPerson: '', contactEmail: '', contactPhone: '',
}

export default function RegisterVillage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState(null)

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: null })
    if (globalError) setGlobalError('')
  }

  // Auto-generate slug dari nama desa
  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Cek ketersediaan slug
  const checkSlug = async (slug) => {
    if (!slug || slug.length < 3) { setSlugAvailable(null); return }
    const { data } = await supabase.from('villages').select('id').eq('slug', slug).limit(1)
    const { data: regData } = await supabase.from('village_registrations').select('id').eq('slug', slug).eq('status', 'pending').limit(1)
    setSlugAvailable(!data?.length && !regData?.length)
  }

  const validate = () => {
    const errs = {}
    if (!form.villageName.trim()) errs.villageName = 'Nama desa wajib diisi'
    if (!form.slug.trim() || form.slug.length < 3) errs.slug = 'Slug minimal 3 karakter'
    if (slugAvailable === false) errs.slug = 'Slug sudah digunakan'
    if (!form.fullAddress.trim()) errs.fullAddress = 'Alamat wajib diisi'
    if (!form.contactPerson.trim()) errs.contactPerson = 'Nama kontak wajib diisi'
    if (!form.contactEmail.trim()) errs.contactEmail = 'Email kontak wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const { error } = await supabase.from('village_registrations').insert({
        village_name: form.villageName,
        slug: form.slug,
        full_address: form.fullAddress,
        province: form.province,
        regency: form.regency,
        district: form.district,
        village_type: form.villageType,
        contact_person: form.contactPerson,
        contact_email: form.contactEmail,
        contact_phone: form.contactPhone,
      })
      if (error) throw error
      setSuccess(true)
    } catch (err) {
      setGlobalError('Gagal mengirim pendaftaran: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page-enter" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div className="card-flat text-center" style={{ maxWidth: 500, padding: '3rem 2rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E8F5E8', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={36} />
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Pendaftaran Terkirim!</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Pendaftaran desa <strong>{form.villageName}</strong> telah kami terima.
            Tim NusaDesa akan memverifikasi data Anda. Pemberitahuan akan dikirim ke <strong>{form.contactEmail}</strong>.
          </p>
          <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Bergabung</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            Daftarkan Desa Anda
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Isi formulir berikut untuk mendaftarkan desa Anda di platform NusaDesa
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="card-flat" style={{ padding: '2rem' }}>
            {globalError && (
              <div className="alert alert-error" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{globalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Data Desa</h3>

              <div className="form-group">
                <label className="form-label">Nama Desa/Dusun *</label>
                <input type="text" className={`form-input ${errors.villageName ? 'form-input-error' : ''}`}
                  value={form.villageName}
                  onChange={e => {
                    updateField('villageName', e.target.value)
                    const slug = generateSlug(e.target.value)
                    setForm(f => ({ ...f, villageName: e.target.value, slug }))
                    checkSlug(slug)
                  }}
                  placeholder="Contoh: Padukuhan Kepuh" />
                {errors.villageName && <p className="form-error">{errors.villageName}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    nusadesa.co.id/
                  </span>
                  <input type="text" className={`form-input ${errors.slug ? 'form-input-error' : ''}`}
                    value={form.slug}
                    onChange={e => { updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); checkSlug(e.target.value) }}
                    placeholder="kepuh"
                    style={{ paddingLeft: '8rem' }} />
                </div>
                {errors.slug && <p className="form-error">{errors.slug}</p>}
                {slugAvailable === true && form.slug.length >= 3 && (
                  <p style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '0.25rem' }}>✓ Slug tersedia</p>
                )}
                {slugAvailable === false && (
                  <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>✗ Slug sudah digunakan</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Jenis *</label>
                <select className="form-select" value={form.villageType} onChange={e => updateField('villageType', e.target.value)}>
                  <option value="dusun">Dusun/Padukuhan</option>
                  <option value="desa">Desa</option>
                  <option value="kelurahan">Kelurahan</option>
                  <option value="nagari">Nagari</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Lengkap *</label>
                <textarea className={`form-input ${errors.fullAddress ? 'form-input-error' : ''}`}
                  value={form.fullAddress} onChange={e => updateField('fullAddress', e.target.value)}
                  placeholder="Jl. Raya, Desa/Kel, Kecamatan" rows={2} />
                {errors.fullAddress && <p className="form-error">{errors.fullAddress}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Provinsi</label>
                  <input type="text" className="form-input" value={form.province} onChange={e => updateField('province', e.target.value)} placeholder="DI Yogyakarta" />
                </div>
                <div className="form-group">
                  <label className="form-label">Kabupaten/Kota</label>
                  <input type="text" className="form-input" value={form.regency} onChange={e => updateField('regency', e.target.value)} placeholder="Gunung Kidul" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kecamatan</label>
                <input type="text" className="form-input" value={form.district} onChange={e => updateField('district', e.target.value)} placeholder="Semanu" />
              </div>

              <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Data Kontak</h3>

              <div className="form-group">
                <label className="form-label">Nama Penanggung Jawab *</label>
                <input type="text" className={`form-input ${errors.contactPerson ? 'form-input-error' : ''}`}
                  value={form.contactPerson} onChange={e => updateField('contactPerson', e.target.value)}
                  placeholder="Nama lengkap" />
                {errors.contactPerson && <p className="form-error">{errors.contactPerson}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className={`form-input ${errors.contactEmail ? 'form-input-error' : ''}`}
                    value={form.contactEmail} onChange={e => updateField('contactEmail', e.target.value)}
                    placeholder="admin@desa.id" />
                  {errors.contactEmail && <p className="form-error">{errors.contactEmail}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Telepon/WA</label>
                  <input type="tel" className="form-input"
                    value={form.contactPhone} onChange={e => updateField('contactPhone', e.target.value.replace(/\D/g, ''))}
                    placeholder="081234567890" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading
                  ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Mengirim...</>
                  : <><Send size={18} /> Kirim Pendaftaran</>
                }
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Dengan mengirim formulir ini, Anda menyetujui{' '}
              <Link to="/syarat-ketentuan" style={{ color: 'var(--primary)' }}>Syarat & Ketentuan</Link> NusaDesa.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
