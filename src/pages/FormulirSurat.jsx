import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Link, Navigate } from 'react-router-dom'
import { FileText, Send, CheckCircle, Lock } from 'lucide-react'

export default function FormulirSurat() {
  const { isLoggedIn, isVerified, profile } = useAuth()
  const [suratTypes, setSuratTypes] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState({ keperluan: '', keterangan: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('surat_types').select('*').eq('is_active', true)
      if (data) setSuratTypes(data)
    }
    fetch()
  }, [])

  if (!isLoggedIn) return <Navigate to="/login" />
  if (!isVerified) return <Navigate to="/layanan" />

  const defaultTypes = [
    { id: '1', name: 'Surat Keterangan Domisili' },
    { id: '2', name: 'Surat Keterangan Tidak Mampu' },
    { id: '3', name: 'Surat Keterangan Usaha' },
    { id: '4', name: 'Surat Pengantar SKCK' },
    { id: '5', name: 'Surat Keterangan Kelahiran' },
    { id: '6', name: 'Surat Keterangan Kematian' },
  ]
  const displayTypes = suratTypes.length > 0 ? suratTypes : defaultTypes

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('surat_submissions').insert({
        surat_type_id: selectedType,
        user_id: profile.id,
        data: {
          nama: `${profile.first_name} ${profile.last_name}`,
          email: profile.email,
          whatsapp: `${profile.country_code}${profile.whatsapp}`,
          alamat: profile.address,
          keperluan: formData.keperluan,
          keterangan: formData.keterangan,
        },
        status: 'pending',
      })
      if (error) throw error
      setSuccess(true)
    } catch (err) {
      alert('Gagal mengirim permohonan: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page-enter" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div className="card-flat text-center" style={{ maxWidth: 480, padding: '3rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8F5E8', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={32} />
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Permohonan Terkirim!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Permohonan surat Anda telah dikirim. Silakan pantau status di halaman Status Permohonan.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/layanan/status" className="btn btn-primary">Lihat Status</Link>
            <button className="btn btn-outline" onClick={() => { setSuccess(false); setSelectedType(''); setFormData({ keperluan: '', keterangan: '' }) }}>
              Ajukan Lagi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Layanan E-Gov</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Formulir Surat</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Ajukan permohonan surat administrasi secara online
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="card-flat" style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Jenis Surat *</label>
                <select className="form-select" required value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                  <option value="">Pilih jenis surat</option>
                  {displayTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                <strong>Data pemohon:</strong> {profile?.first_name} {profile?.last_name} — {profile?.email}
              </div>

              <div className="form-group">
                <label className="form-label">Keperluan *</label>
                <input type="text" className="form-input" required value={formData.keperluan} onChange={e => setFormData({ ...formData, keperluan: e.target.value })} placeholder="Jelaskan keperluan surat ini" />
              </div>

              <div className="form-group">
                <label className="form-label">Keterangan Tambahan</label>
                <textarea className="form-input" value={formData.keterangan} onChange={e => setFormData({ ...formData, keterangan: e.target.value })} placeholder="Keterangan tambahan (opsional)" rows={4} />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading || !selectedType}>
                {loading ? <span className="spinner" style={{ width: 20, height: 20 }}></span> : <><Send size={18} /> Kirim Permohonan</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
