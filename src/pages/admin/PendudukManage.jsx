import { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { supabase } from '../../lib/supabase'
import {
  Users, Plus, Search, Edit2, X, CheckCircle, AlertCircle,
  User, Phone, MapPin, CreditCard, Home, Save, Trash2,
  ChevronDown, Filter
} from 'lucide-react'

const JABATAN_OPTIONS = [
  { value: '', label: '— Warga Biasa —' },
  { value: 'Dukuh', label: 'Dukuh (Kepala Padukuhan)' },
  { value: 'Sekretaris', label: 'Sekretaris' },
  { value: 'Bendahara', label: 'Bendahara' },
  { value: 'Ketua RT', label: 'Ketua RT' },
  { value: 'Ketua RW', label: 'Ketua RW' },
]

const STATUS_OPTIONS = [
  { value: 'aktif', label: 'Aktif', color: 'badge-success' },
  { value: 'tidak_aktif', label: 'Belum Aktif (Balita/Anak)', color: 'badge-warning' },
  { value: 'nonaktif', label: 'Nonaktif (Pindah/Meninggal)', color: 'badge-danger' },
]

const EMPTY_FORM = {
  first_name: '', last_name: '', nik: '', no_kk: '',
  tanggal_lahir: '', jenis_kelamin: 'L',
  email: '', whatsapp: '', country_code: '+62',
  address: '', rt: '', rw: '',
  jabatan: '', status: 'aktif',
  kepala_keluarga_id: '',
  avatar_url: '',
}

export default function PendudukManage() {
  const [penduduk, setPenduduk] = useState([])
  const [kkList, setKkList]     = useState([]) // list of KK for dropdown
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRt, setFilterRt] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [loading, setLoading]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [stats, setStats]       = useState(null)
  const avatarRef               = useRef()

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: pData }, { data: stData }] = await Promise.all([
      supabase.from('profiles').select('*').order('first_name'),
      supabase.from('statistik_kependudukan').select('*').single()
    ])
    if (pData) {
      setPenduduk(pData)
      setKkList(pData.filter(p => !p.kepala_keluarga_id && p.status !== 'nonaktif'))
    }
    if (stData) setStats(stData)
    setLoading(false)
  }

  function openAdd() {
    setEditData(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(p) {
    setEditData(p)
    setForm({
      first_name: p.first_name || '',
      last_name: p.last_name || '',
      nik: p.nik || '',
      no_kk: p.no_kk || '',
      tanggal_lahir: p.tanggal_lahir || '',
      jenis_kelamin: p.jenis_kelamin || 'L',
      email: p.email || '',
      whatsapp: p.whatsapp || '',
      country_code: p.country_code || '+62',
      address: p.address || '',
      rt: p.rt || '',
      rw: p.rw || '',
      jabatan: p.jabatan || '',
      status: p.status || 'aktif',
      kepala_keluarga_id: p.kepala_keluarga_id || '',
      avatar_url: p.avatar_url || '',
    })
    setShowModal(true)
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 1024 * 1024) {
      showAlert('error', 'Ukuran foto maksimal 1MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, avatar_url: reader.result }))
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!form.first_name.trim()) { showAlert('error', 'Nama depan wajib diisi'); return }

    setSaving(true)
    const payload = {
      first_name:          form.first_name.trim(),
      last_name:           form.last_name.trim(),
      nik:                 form.nik.trim() || null,
      no_kk:               form.no_kk.trim() || null,
      tanggal_lahir:       form.tanggal_lahir || null,
      jenis_kelamin:       form.jenis_kelamin,
      email:               form.email.trim() || null,
      whatsapp:            form.whatsapp.trim() || null,
      country_code:        form.country_code,
      address:             form.address.trim() || null,
      rt:                  form.rt.trim() || null,
      rw:                  form.rw.trim() || null,
      jabatan:             form.jabatan || null,
      status:              form.status,
      kepala_keluarga_id:  form.kepala_keluarga_id || null,
      avatar_url:          form.avatar_url || null,
    }

    if (editData) {
      // Update existing
      const { error } = await supabase.from('profiles').update(payload).eq('id', editData.id)
      if (error) { showAlert('error', 'Gagal menyimpan: ' + error.message); setSaving(false); return }
      showAlert('success', 'Data penduduk berhasil diperbarui')
    } else {
      // Insert baru (tanpa auth user — hanya data kependudukan)
      const newId = crypto.randomUUID()
      const { error } = await supabase.from('profiles').insert({
        id: newId,
        ...payload,
        role: 'pengguna',
        is_verified: form.status === 'aktif' ? false : false,
      })
      if (error) { showAlert('error', 'Gagal menambah: ' + error.message); setSaving(false); return }
      showAlert('success', 'Data penduduk berhasil ditambahkan')
    }

    setSaving(false)
    setShowModal(false)
    fetchData()
  }

  async function handleDelete(p) {
    const result = await Swal.fire({
      title: 'Hapus Penduduk?',
      text: `Hapus data ${p.first_name} ${p.last_name}? Ini hanya menghapus data profil, bukan akun auth.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })
    
    if (!result.isConfirmed) return
    
    const { error } = await supabase.from('profiles').delete().eq('id', p.id)
    if (error) { showAlert('error', 'Gagal hapus: ' + error.message); return }
    showAlert('success', 'Data berhasil dihapus')
    fetchData()
  }

  function showAlert(type, msg) {
    Swal.fire({
      icon: type,
      title: type === 'success' ? 'Berhasil' : 'Oops...',
      text: msg,
      timer: type === 'success' ? 2500 : undefined,
      showConfirmButton: type !== 'success'
    })
  }

  // Filter
  const filtered = penduduk.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = `${p.first_name} ${p.last_name} ${p.nik || ''} ${p.email || ''}`.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    const matchRt = !filterRt || p.rt === filterRt
    return matchSearch && matchStatus && matchRt
  })

  const rtList = [...new Set(penduduk.map(p => p.rt).filter(Boolean))].sort()

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem' }}>Manajemen Penduduk</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Kelola data kependudukan Padukuhan Kepuh</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Penduduk
        </button>
      </div>

      {/* Statistik cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Penduduk', val: stats.jumlah_penduduk, color: 'var(--primary)' },
            { label: 'Kepala Keluarga', val: stats.jumlah_kk, color: '#5B8FA8' },
            { label: 'Laki-laki', val: stats.laki_laki, color: '#3B6FA8' },
            { label: 'Perempuan', val: stats.perempuan, color: '#A85B8F' },
            { label: 'Pengguna Aktif', val: stats.pengguna_aktif, color: 'var(--success)' },
            { label: 'Belum Aktif', val: stats.belum_aktif, color: 'var(--warning)' },
          ].map(s => (
            <div key={s.label} className="card-flat" style={{ textAlign: 'center', padding: '1rem 0.75rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val ?? 0}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Cari nama, NIK, email..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Semua Status</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filterRt} onChange={e => setFilterRt(e.target.value)}>
          <option value="">Semua RT</option>
          {rtList.map(rt => <option key={rt} value={rt}>RT {rt}</option>)}
        </select>
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="empty-state"><div className="spinner" /><p>Memuat data...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><Users size={48} /><h3>Tidak ada data penduduk</h3><p>Tambahkan penduduk dengan tombol di atas</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Penduduk</th>
                <th>NIK</th>
                <th>RT/RW</th>
                <th>Jabatan</th>
                <th>Status</th>
                <th>WhatsApp</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const st = STATUS_OPTIONS.find(s => s.value === p.status)
                const isAnggota = !!p.kepala_keluarga_id
                const kkData = isAnggota ? penduduk.find(k => k.id === p.kepala_keluarga_id) : null
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <User size={14} color="var(--primary)" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.first_name} {p.last_name}</div>
                          {isAnggota && kkData && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              KK: {kkData.first_name} {kkData.last_name}
                            </div>
                          )}
                          {!isAnggota && <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>Kepala Keluarga</div>}
                          {p.email && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{p.nik || '—'}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {p.rt ? `RT ${p.rt}` : '—'}
                      {p.rw ? ` / RW ${p.rw}` : ''}
                    </td>
                    <td>
                      {p.jabatan
                        ? <span className="badge badge-info">{p.jabatan}</span>
                        : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                      }
                    </td>
                    <td>
                      <span className={`badge ${st?.color || 'badge-primary'}`}>{st?.label || p.status}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {p.whatsapp ? `${p.country_code}${p.whatsapp}` : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => openEdit(p)} title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button className="btn btn-sm btn-ghost" onClick={() => handleDelete(p)}
                          title="Hapus" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editData ? 'Edit Data Penduduk' : 'Tambah Penduduk Baru'}</h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

              {/* Foto */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={28} color="var(--text-muted)" />
                  </div>
                )}
                <div>
                  <button className="btn btn-sm btn-outline" onClick={() => avatarRef.current.click()}>
                    Upload Foto
                  </button>
                  {form.avatar_url && (
                    <button className="btn btn-sm btn-ghost" onClick={() => setForm(f => ({ ...f, avatar_url: '' }))}
                      style={{ color: 'var(--danger)', marginLeft: '0.5rem' }}>Hapus</button>
                  )}
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Max 1MB, JPG/PNG</p>
                  <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>
              </div>

              {/* Nama */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nama Depan *</label>
                  <input className="form-input" value={form.first_name}
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="Nama depan" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Belakang</label>
                  <input className="form-input" value={form.last_name}
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Nama belakang" />
                </div>
              </div>

              {/* NIK & No KK */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">NIK</label>
                  <input className="form-input" value={form.nik} maxLength={16}
                    onChange={e => setForm(f => ({ ...f, nik: e.target.value.replace(/\D/g, '') }))} placeholder="16 digit NIK" />
                </div>
                <div className="form-group">
                  <label className="form-label">No. KK</label>
                  <input className="form-input" value={form.no_kk} maxLength={16}
                    onChange={e => setForm(f => ({ ...f, no_kk: e.target.value.replace(/\D/g, '') }))} placeholder="16 digit No. KK" />
                </div>
              </div>

              {/* Tgl Lahir & JK */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tanggal Lahir</label>
                  <input type="date" className="form-input" value={form.tanggal_lahir}
                    onChange={e => setForm(f => ({ ...f, tanggal_lahir: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Kelamin</label>
                  <select className="form-select" value={form.jenis_kelamin}
                    onChange={e => setForm(f => ({ ...f, jenis_kelamin: e.target.value }))}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              {/* RT & RW */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">RT</label>
                  <input className="form-input" value={form.rt} maxLength={3}
                    onChange={e => setForm(f => ({ ...f, rt: e.target.value }))} placeholder="001" />
                </div>
                <div className="form-group">
                  <label className="form-label">RW</label>
                  <input className="form-input" value={form.rw} maxLength={3}
                    onChange={e => setForm(f => ({ ...f, rw: e.target.value }))} placeholder="001" />
                </div>
              </div>

              {/* Email & WA */}
              <div className="form-group">
                <label className="form-label">Email <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(kosongkan jika tidak punya)</span></label>
                <input type="email" className="form-input" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@contoh.com" />
              </div>

              <div className="form-group">
                <label className="form-label">Nomor WhatsApp</label>
                <div className="form-phone-row">
                  <select className="form-select" value={form.country_code}
                    onChange={e => setForm(f => ({ ...f, country_code: e.target.value }))}>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+60">🇲🇾 +60</option>
                  </select>
                  <input type="tel" className="form-input" value={form.whatsapp}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value.replace(/\D/g, '') }))}
                    placeholder="81234567890" />
                </div>
              </div>

              {/* Alamat */}
              <div className="form-group">
                <label className="form-label">Alamat</label>
                <textarea className="form-input" value={form.address} rows={2}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="RT/RW, Dusun Kepuh, Desa Pacarejo" />
              </div>

              {/* Kepala Keluarga */}
              <div className="form-group">
                <label className="form-label">Kepala Keluarga
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    (kosongkan jika ini adalah KK)
                  </span>
                </label>
                <select className="form-select" value={form.kepala_keluarga_id}
                  onChange={e => setForm(f => ({ ...f, kepala_keluarga_id: e.target.value }))}>
                  <option value="">— Ini adalah Kepala Keluarga —</option>
                  {kkList.filter(k => k.id !== editData?.id).map(k => (
                    <option key={k.id} value={k.id}>{k.first_name} {k.last_name} {k.no_kk ? `(KK: ${k.no_kk})` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Jabatan */}
              <div className="form-group">
                <label className="form-label">Jabatan di Struktur Organisasi</label>
                <select className="form-select" value={form.jabatan}
                  onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))}>
                  {JABATAN_OPTIONS.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                </select>
                {(form.jabatan === 'Ketua RT' || form.jabatan === 'Ketua RW') && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--info)', marginTop: '0.25rem' }}>
                    💡 Jabatan RT/RW akan memberi akses menu disposisi surat sesuai wilayah RT/RW pada profil ini.
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status Kependudukan</label>
                <select className="form-select" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                  {form.status === 'aktif' && '✅ Terhitung penduduk. Jika punya email, bisa login setelah diverifikasi admin.'}
                  {form.status === 'tidak_aktif' && '📊 Terhitung penduduk (untuk statistik), namun tidak bisa login ke website.'}
                  {form.status === 'nonaktif' && '❌ Tidak terhitung dalam statistik kependudukan (pindah/meninggal dll).'}
                </p>
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Menyimpan...</> : <><Save size={16} /> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
