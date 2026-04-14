import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useVillage } from '../../contexts/VillageContext'
import { Store, Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react'

export default function UmkmManage() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', owner_name: '', contact: '' })
  const { villageId } = useVillage()

  useEffect(() => { if (villageId) fetchData() }, [villageId])

  async function fetchData() {
    const { data } = await supabase
      .from('umkm_products')
      .select('*')
      .eq('village_id', villageId)
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  async function handleSave() {
    const payload = { ...form, price: parseInt(form.price) || 0, is_active: true, village_id: villageId }
    if (editing && editing !== 'new') {
      await supabase.from('umkm_products').update(payload).eq('id', editing)
    } else {
      await supabase.from('umkm_products').insert(payload)
    }
    setEditing(null)
    setForm({ name: '', description: '', price: '', category: '', owner_name: '', contact: '' })
    fetchData()
  }

  async function toggleActive(id, current) {
    await supabase.from('umkm_products').update({ is_active: !current }).eq('id', id)
    fetchData()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus produk ini?')) return
    await supabase.from('umkm_products').delete().eq('id', id)
    fetchData()
  }

  function startEdit(product) {
    setEditing(product.id)
    setForm({
      name: product.name, description: product.description || '',
      price: product.price?.toString() || '', category: product.category || '',
      owner_name: product.owner_name || '', contact: product.contact || '',
    })
  }

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Kelola UMKM</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Kelola produk dan layanan UMKM desa</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing('new'); setForm({ name: '', description: '', price: '', category: '', owner_name: '', contact: '' }) }}>
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {/* Add/Edit Form */}
      {editing && (
        <div className="card-flat" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editing === 'new' ? 'Tambah Produk Baru' : 'Edit Produk'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Produk</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nama produk" />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <input className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Makanan, Kerajinan, dll" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Deskripsi produk" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Harga (Rp)</label>
              <input className="form-input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Pemilik</label>
              <input className="form-input" value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} placeholder="Nama pemilik" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">No. Kontak (WhatsApp)</label>
            <input className="form-input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="081234567890" />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Simpan</button>
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>Batal</button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Pemilik</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td><span className="badge badge-primary">{p.category}</span></td>
                <td>Rp {p.price?.toLocaleString('id-ID')}</td>
                <td>{p.owner_name}</td>
                <td>
                  <button className="btn btn-sm btn-ghost" onClick={() => toggleActive(p.id, p.is_active)} style={{ color: p.is_active ? 'var(--success)' : 'var(--text-muted)' }}>
                    {p.is_active ? <><ToggleRight size={18} /> Aktif</> : <><ToggleLeft size={18} /> Nonaktif</>}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => startEdit(p)}><Edit2 size={14} /></button>
                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
