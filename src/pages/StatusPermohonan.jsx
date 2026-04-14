import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useVillage } from '../contexts/VillageContext'
import { supabase } from '../lib/supabase'
import { ClipboardList, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', badge: 'badge-warning', icon: Clock },
  processing: { label: 'Diproses', badge: 'badge-info', icon: Loader },
  approved: { label: 'Disetujui', badge: 'badge-success', icon: CheckCircle },
  rejected: { label: 'Ditolak', badge: 'badge-danger', icon: XCircle },
}

export default function StatusPermohonan() {
  const { isLoggedIn, isVerified, profile } = useAuth()
  const { villageId, villageSlug } = useVillage()
  const [submissions, setSubmissions] = useState([])
  const [suratTypes, setSuratTypes] = useState({})

  useEffect(() => {
    async function fetch() {
      if (!profile) return
      const [subRes, typesRes] = await Promise.all([
        supabase.from('surat_submissions').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('surat_types').select('*'),
      ])
      if (subRes.data) setSubmissions(subRes.data)
      if (typesRes.data) {
        const map = {}
        typesRes.data.forEach(t => { map[t.id] = t.name })
        setSuratTypes(map)
      }
    }
    fetch()
  }, [profile])

  if (!isLoggedIn) return <Navigate to={`/${villageSlug}/login`} />
  if (!isVerified) return <Navigate to={`/${villageSlug}/layanan`} />

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Layanan E-Gov</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Status Permohonan</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>Pantau status permohonan surat Anda</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          {submissions.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={48} />
              <h3>Belum ada permohonan</h3>
              <p>Anda belum mengajukan permohonan surat</p>
              <Link to={`/${villageSlug}/layanan/surat`} className="btn btn-primary" style={{ marginTop: '1rem' }}>Ajukan Surat</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissions.map(sub => {
                const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending
                const Icon = cfg.icon
                return (
                  <div key={sub.id} className="card-flat" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                        {suratTypes[sub.surat_type_id] || 'Surat'}
                      </h4>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        Diajukan: {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {sub.admin_notes && (
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                          <strong>Catatan:</strong> {sub.admin_notes}
                        </p>
                      )}
                    </div>
                    <span className={`badge ${cfg.badge}`} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Icon size={14} /> {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
