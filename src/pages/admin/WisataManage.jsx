import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useVillage } from '../../contexts/VillageContext'
import { Map, Plus, Edit2, Trash2, Save, ToggleLeft, ToggleRight, Image as ImageIcon, MapPin } from 'lucide-react'

// Fungsi untuk convert Google Drive Share Link ke format raw image yang support embed (CDN Google)
const transformGdriveUrl = (url) => {
  if (!url) return '';
  let id = '';
  const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD) id = matchD[1];
  else {
    const matchId = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (matchId) id = matchId[1];
  }
  if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  return url;
}

export default function WisataManage() {
  const [wisata, setWisata] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', ticket_price: '', location: '', facilities: '', contact: '', image_url: '', gmap_link: '' })
  const { villageId } = useVillage()

  useEffect(() => { if (villageId) fetchData() }, [villageId])

  async function fetchData() {
    const { data } = await supabase
      .from('wisata_listings')
      .select('*')
      .eq('village_id', villageId)
      .order('created_at', { ascending: false })
    if (data) setWisata(data)
  }

  async function handleSave() {
    const finalImageUrl = transformGdriveUrl(form.image_url)
    const payload = { 
      ...form, 
      ticket_price: parseInt(form.ticket_price) || 0, 
      image_url: finalImageUrl,
      is_active: true, 
      village_id: villageId 
    }
    
    if (editing && editing !== 'new') {
      await supabase.from('wisata_listings').update(payload).eq('id', editing)
    } else {
      await supabase.from('wisata_listings').insert(payload)
    }
    setEditing(null)
    setForm({ title: '', description: '', ticket_price: '', location: '', facilities: '', contact: '', image_url: '', gmap_link: '' })
    fetchData()
  }

  async function toggleActive(id, current) {
    await supabase.from('wisata_listings').update({ is_active: !current }).eq('id', id)
    fetchData()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus data potensi wisata ini?')) return
    await supabase.from('wisata_listings').delete().eq('id', id)
    fetchData()
  }

  function startEdit(item) {
    setEditing(item.id)
    setForm({
      title: item.title || '', 
      description: item.description || '',
      ticket_price: item.ticket_price?.toString() || '', 
      location: item.location || '',
      facilities: item.facilities || '', 
      contact: item.contact || '',
      image_url: item.image_url || '',
      gmap_link: item.gmap_link || ''
    })
  }

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <div>
          <span className="admin-section-badge" style={{ marginBottom: '0.625rem', display: 'inline-flex' }}>
            <Map size={10} /> Potensi Desa
          </span>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem', lineHeight: 1.2 }}>Kelola Wisata</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manajemen data potensi wisata dan rekreasi desa</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing('new'); setForm({ title: '', description: '', ticket_price: '', location: '', facilities: '', contact: '', image_url: '', gmap_link: '' }) }}>
          <Plus size={16} /> Tambah Wisata
        </button>
      </div>

      {editing && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Map size={18} />
              {editing === 'new' ? 'Tambah Wisata Baru' : 'Edit Wisata'}
            </h3>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Tempat Wisata</label>
              <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Cth: Telaga Kepuh" />
            </div>
            <div className="form-group">
              <label className="form-label">Harga Tiket (Rp)</label>
              <input className="form-input" type="number" value={form.ticket_price} onChange={e => setForm({ ...form, ticket_price: e.target.value })} placeholder="0 (Kosongkan jika gratis)" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Wisata</label>
            <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Ceritakan keindahan dan daya tarik wisata ini..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fasilitas Tersedia</label>
              <input className="form-input" value={form.facilities} onChange={e => setForm({ ...form, facilities: e.target.value })} placeholder="Parkir, Toilet, Warung Makan, dll" />
            </div>
            <div className="form-group">
              <label className="form-label">Alamat / Lokasi</label>
              <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Jln. Desa Kepuh..." />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Link Foto (Google Drive)</label>
              <div style={{ position: 'relative' }}>
                <ImageIcon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://drive.google.com/file/d/..." style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Link Google Maps</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" value={form.gmap_link} onChange={e => setForm({ ...form, gmap_link: e.target.value })} placeholder="https://maps.google.com/..." style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">No. Kontak Pengelola</label>
            <input className="form-input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="081234567890" />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Simpan Data</button>
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>Batal</button>
          </div>
        </div>
      )}

      <div className="table-wrapper admin-card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Tempat Wisata</th>
              <th>Lokasi</th>
              <th>Harga Tiket</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {wisata.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.image_url ? (
                      <div style={{ width: 48, height: 48, borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                        <img src={transformGdriveUrl(item.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: '6px', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                        <Map size={20} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fasilitas: {item.facilities}</div>
                    </div>
                  </div>
                </td>
                <td>{item.location}</td>
                <td>{item.ticket_price > 0 ? `Rp ${item.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}</td>
                <td>
                  <button className="btn btn-sm btn-ghost" onClick={() => toggleActive(item.id, item.is_active)} style={{ color: item.is_active ? 'var(--success)' : 'var(--text-muted)' }}>
                    {item.is_active ? <><ToggleRight size={18} /> Aktif</> : <><ToggleLeft size={18} /> Nonaktif</>}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => startEdit(item)}><Edit2 size={14} /></button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {wisata.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center" style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Belum ada data wisata.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
