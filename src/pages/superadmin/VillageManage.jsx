import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Globe, CheckCircle, XCircle, Pause, Eye, Search, Plus } from 'lucide-react'

export default function VillageManage() {
  const [villages, setVillages] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [tab, setTab] = useState('villages')
  const [search, setSearch] = useState('')
  const [selectedReg, setSelectedReg] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [vRes, rRes] = await Promise.all([
      supabase.from('villages').select('*').order('created_at', { ascending: false }),
      supabase.from('village_registrations').select('*').order('created_at', { ascending: false }),
    ])
    if (vRes.data) setVillages(vRes.data)
    if (rRes.data) setRegistrations(rRes.data)
  }

  async function updateVillageStatus(id, status) {
    await supabase.from('villages').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function approveRegistration(reg) {
    // 1. Buat desa baru dari data registrasi
    const { data: newVillage, error } = await supabase.from('villages').insert({
      name: reg.village_name,
      slug: reg.slug,
      full_address: reg.full_address,
      province: reg.province,
      regency: reg.regency,
      district: reg.district,
      village_type: reg.village_type,
      status: 'active',
      approved_at: new Date().toISOString(),
    }).select().single()

    if (error) { alert('Gagal membuat desa: ' + error.message); return }

    // 2. Update status registrasi
    await supabase.from('village_registrations').update({
      status: 'approved',
      admin_notes: notes,
      reviewed_at: new Date().toISOString(),
    }).eq('id', reg.id)

    setSelectedReg(null)
    setNotes('')
    fetchData()
  }

  async function rejectRegistration(regId) {
    await supabase.from('village_registrations').update({
      status: 'rejected',
      admin_notes: notes,
      reviewed_at: new Date().toISOString(),
    }).eq('id', regId)
    setSelectedReg(null)
    setNotes('')
    fetchData()
  }

  const filteredVillages = villages.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.slug.toLowerCase().includes(search.toLowerCase())
  )

  const filteredRegs = registrations.filter(r =>
    r.village_name.toLowerCase().includes(search.toLowerCase()) ||
    r.contact_email.toLowerCase().includes(search.toLowerCase())
  )

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', reviewing: 'badge-info', approved: 'badge-success', rejected: 'badge-danger', active: 'badge-success', suspended: 'badge-danger' }
    return map[status] || 'badge-primary'
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Kelola Desa</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Kelola desa terdaftar dan review pendaftaran baru</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button className={`btn btn-sm ${tab === 'villages' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('villages')}>
          <Globe size={16} /> Desa ({villages.length})
        </button>
        <button className={`btn btn-sm ${tab === 'registrations' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('registrations')}>
          <Plus size={16} /> Pendaftaran ({registrations.filter(r => r.status === 'pending').length} pending)
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: 400 }}>
        <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" className="form-input" placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
      </div>

      {/* Villages Tab */}
      {tab === 'villages' && (
        filteredVillages.length === 0 ? (
          <div className="empty-state"><Globe size={48} /><h3>Belum ada desa</h3></div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Nama Desa</th><th>Slug</th><th>Lokasi</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>
                {filteredVillages.map(v => (
                  <tr key={v.id}>
                    <td><strong>{v.name}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.village_type}</span></td>
                    <td><code>/{v.slug}</code></td>
                    <td style={{ fontSize: '0.85rem' }}>{v.district && `${v.district}, `}{v.regency || '—'}</td>
                    <td><span className={`badge ${statusBadge(v.status)}`} style={{ textTransform: 'capitalize' }}>{v.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        {v.status !== 'active' && (
                          <button className="btn btn-sm btn-outline" onClick={() => updateVillageStatus(v.id, 'active')} title="Aktifkan">
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {v.status !== 'suspended' && (
                          <button className="btn btn-sm btn-ghost" onClick={() => updateVillageStatus(v.id, 'suspended')} title="Suspend" style={{ color: 'var(--danger)' }}>
                            <Pause size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Registrations Tab */}
      {tab === 'registrations' && (
        filteredRegs.length === 0 ? (
          <div className="empty-state"><Plus size={48} /><h3>Belum ada pendaftaran</h3></div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Nama Desa</th><th>Slug</th><th>Kontak</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>
                {filteredRegs.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.village_name}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.full_address}</span></td>
                    <td><code>/{r.slug}</code></td>
                    <td><span style={{ fontSize: '0.85rem' }}>{r.contact_person}</span><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.contact_email}</span></td>
                    <td><span className={`badge ${statusBadge(r.status)}`} style={{ textTransform: 'capitalize' }}>{r.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-ghost" onClick={() => { setSelectedReg(r); setNotes(r.admin_notes || '') }}>
                        <Eye size={14} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Review Modal */}
      {selectedReg && (
        <div className="modal-overlay" onClick={() => setSelectedReg(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Review Pendaftaran</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setSelectedReg(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div><strong>Nama Desa:</strong> {selectedReg.village_name}</div>
                <div><strong>Slug:</strong> /{selectedReg.slug}</div>
                <div><strong>Tipe:</strong> {selectedReg.village_type}</div>
                <div><strong>Alamat:</strong> {selectedReg.full_address}</div>
                <div><strong>Provinsi:</strong> {selectedReg.province || '—'}</div>
                <div><strong>Kabupaten:</strong> {selectedReg.regency || '—'}</div>
                <div><strong>Kecamatan:</strong> {selectedReg.district || '—'}</div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />
                <div><strong>Kontak:</strong> {selectedReg.contact_person}</div>
                <div><strong>Email:</strong> {selectedReg.contact_email}</div>
                <div><strong>Telepon:</strong> {selectedReg.contact_phone || '—'}</div>
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Catatan Admin</label>
                <textarea className="form-input" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Catatan untuk pendaftar..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-sm btn-danger" onClick={() => rejectRegistration(selectedReg.id)}>
                <XCircle size={14} /> Tolak
              </button>
              <button className="btn btn-sm btn-success" onClick={() => approveRegistration(selectedReg)}>
                <CheckCircle size={14} /> Setujui & Aktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
