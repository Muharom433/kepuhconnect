import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { FileText, CheckCircle, XCircle, Clock, Loader, Eye } from 'lucide-react'

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

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [subRes, typesRes] = await Promise.all([
      supabase.from('surat_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('surat_types').select('*'),
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Kelola Persuratan</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Kelola permohonan surat dari warga</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'processing', 'approved', 'rejected'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
            {f === 'all' ? 'Semua' : STATUS_CONFIG[f]?.label}
            {f !== 'all' && <span style={{ marginLeft: 4 }}>({submissions.filter(s => s.status === f).length})</span>}
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
