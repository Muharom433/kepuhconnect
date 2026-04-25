import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useVillage } from '../../contexts/VillageContext'
import { FileText, CheckCircle, XCircle, Clock, Loader, Eye, Filter } from 'lucide-react'

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', badge: 'badge-warning', icon: Clock },
  processing: { label: 'Diproses', badge: 'badge-info', icon: Loader },
  approved: { label: 'Disetujui', badge: 'badge-success', icon: CheckCircle },
  rejected: { label: 'Ditolak', badge: 'badge-danger', icon: XCircle },
}

export default function Persuratan() {
  const [submissions, setSubmissions] = useState([])
  const [suratTypes, setSuratTypes] = useState({})
  const [filter, setFilter] = useState('all')
  const [selectedSub, setSelectedSub] = useState(null)
  const [notes, setNotes] = useState('')
  const { villageId } = useVillage()

  useEffect(() => {
    if (villageId) fetchData()
  }, [villageId])

  async function fetchData() {
    const [subRes, typesRes] = await Promise.all([
      supabase.from('surat_submissions').select('*').eq('village_id', villageId).order('created_at', { ascending: false }),
      supabase.from('surat_types').select('*').eq('village_id', villageId),
    ])
    if (subRes.data) setSubmissions(subRes.data)
    if (typesRes.data) {
      const map = {}
      typesRes.data.forEach(t => { map[t.id] = t.name })
      setSuratTypes(map)
    }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('surat_submissions').update({ status, admin_notes: notes, updated_at: new Date().toISOString() }).eq('id', id)
    if (!error) { fetchData(); setSelectedSub(null); setNotes('') }
  }

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter)

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <div>
          <span className="admin-section-badge" style={{ marginBottom: '0.625rem', display: 'inline-flex' }}>
            <FileText size={10} /> Administrasi
          </span>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem', lineHeight: 1.2 }}>Kelola Persuratan</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kelola permohonan surat dari warga desa</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.78rem', fontWeight: 600, color: '#EF642C',
          background: 'rgba(239,100,44,0.08)', border: '1px solid rgba(239,100,44,0.2)',
          borderRadius: '999px', padding: '0.4rem 1rem'
        }}>
          {submissions.filter(s => s.status === 'pending').length} menunggu
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', flexWrap: 'wrap',
        padding: '0.5rem', background: 'var(--bg-alt)',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)'
      }}>
        {['all', 'pending', 'processing', 'approved', 'rejected'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 0.875rem', borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer',
              transition: 'var(--transition)',
              background: filter === f ? 'var(--surface)' : 'transparent',
              color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: filter === f ? '0 1px 4px rgba(0,132,79,0.1)' : 'none',
              borderBottom: filter === f ? '2px solid #EF642C' : '2px solid transparent'
            }}
          >
            {f === 'all' ? 'Semua' : STATUS_CONFIG[f]?.label}
            <span style={{ marginLeft: 4, opacity: 0.7 }}>({f === 'all' ? submissions.length : submissions.filter(s => s.status === f).length})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><FileText size={48} /><h3>Belum ada permohonan</h3></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Pemohon</th>
                <th>Jenis Surat</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => {
                const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending
                return (
                  <tr key={sub.id}>
                    <td>
                      <strong>{sub.data?.nama || '—'}</strong>
                      <br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.data?.email}</span>
                    </td>
                    <td>{suratTypes[sub.surat_type_id] || '—'}</td>
                    <td>{new Date(sub.created_at).toLocaleDateString('id-ID')}</td>
                    <td><span className={`badge ${cfg.badge}`}>{cfg.label}</span></td>
                    <td>
                      <button className="btn btn-sm btn-ghost" onClick={() => { setSelectedSub(sub); setNotes(sub.admin_notes || '') }}>
                        <Eye size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSub && (
        <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Permohonan</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setSelectedSub(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div><strong>Jenis:</strong> {suratTypes[selectedSub.surat_type_id]}</div>
                <div><strong>Pemohon:</strong> {selectedSub.data?.nama}</div>
                <div><strong>Email:</strong> {selectedSub.data?.email}</div>
                <div><strong>WhatsApp:</strong> {selectedSub.data?.whatsapp}</div>
                <div><strong>Alamat:</strong> {selectedSub.data?.alamat}</div>
                <div><strong>Keperluan:</strong> {selectedSub.data?.keperluan}</div>
                {selectedSub.data?.keterangan && <div><strong>Keterangan:</strong> {selectedSub.data?.keterangan}</div>}
                <div><strong>Status:</strong> <span className={`badge ${STATUS_CONFIG[selectedSub.status]?.badge}`}>{STATUS_CONFIG[selectedSub.status]?.label}</span></div>
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Catatan Admin</label>
                <textarea className="form-input" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Catatan untuk pemohon..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-sm btn-danger" onClick={() => updateStatus(selectedSub.id, 'rejected')}>
                <XCircle size={14} /> Tolak
              </button>
              <button className="btn btn-sm btn-outline" onClick={() => updateStatus(selectedSub.id, 'processing')}>
                <Loader size={14} /> Proses
              </button>
              <button className="btn btn-sm btn-success" onClick={() => updateStatus(selectedSub.id, 'approved')}>
                <CheckCircle size={14} /> Setujui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
