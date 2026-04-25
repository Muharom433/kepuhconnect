import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useVillage } from '../../contexts/VillageContext'
import { Newspaper, Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight, Image as ImageIcon } from 'lucide-react'

// Fungsi untuk convert Google Drive Share Link ke format raw image yang support embed (CDN Google)
const transformGdriveUrl = (url) => {
  if (!url) return '';
  let id = '';
  // Coba cari ID dari format /d/ID/view atau /d/ID
  const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD) id = matchD[1];
  else {
    // Coba cari ID dari parameter id=ID
    const matchId = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (matchId) id = matchId[1];
  }

  if (id) {
    // Endpoint lh3.googleusercontent.com adalah cara paling stabil untuk embed gambar GDrive saat ini
    return `https://lh3.googleusercontent.com/d/${id}`;
  }
  return url;
}

export default function BeritaManage() {
  const [news, setNews] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', category: '', image_url: '', is_published: true })
  const { villageId } = useVillage()

  useEffect(() => { if (villageId) fetchData() }, [villageId])

  async function fetchData() {
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('village_id', villageId)
      .order('created_at', { ascending: false })
    if (data) setNews(data)
  }

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    setForm({ ...form, title, slug })
  }

  async function handleSave() {
    // Transform GDrive link
    const finalImageUrl = transformGdriveUrl(form.image_url)
    
    const payload = { 
      ...form, 
      image_url: finalImageUrl,
      village_id: villageId,
      published_at: form.is_published ? new Date().toISOString() : null
    }
    
    if (editing && editing !== 'new') {
      await supabase.from('news').update(payload).eq('id', editing)
    } else {
      await supabase.from('news').insert(payload)
    }
    setEditing(null)
    setForm({ title: '', slug: '', excerpt: '', content: '', category: '', image_url: '', is_published: true })
    fetchData()
  }

  async function togglePublish(id, current) {
    await supabase.from('news').update({ 
      is_published: !current,
      published_at: !current ? new Date().toISOString() : null
    }).eq('id', id)
    fetchData()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus berita ini secara permanen?')) return
    await supabase.from('news').delete().eq('id', id)
    fetchData()
  }

  function startEdit(item) {
    setEditing(item.id)
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || '',
      image_url: item.image_url || '',
      is_published: item.is_published
    })
  }

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <div>
          <span className="admin-section-badge" style={{ marginBottom: '0.625rem', display: 'inline-flex' }}>
            <Newspaper size={10} /> Informasi Desa
          </span>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem', lineHeight: 1.2 }}>Manajemen Berita</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kelola artikel, pengumuman, dan kegiatan desa</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing('new'); setForm({ title: '', slug: '', excerpt: '', content: '', category: '', image_url: '', is_published: true }) }}>
          <Plus size={16} /> Tulis Berita
        </button>
      </div>

      {/* Add/Edit Form */}
      {editing && (
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Newspaper size={18} />
              {editing === 'new' ? 'Tulis Berita Baru' : 'Edit Berita'}
            </h3>
          </div>
          <div className="form-group">
            <label className="form-label">Judul Berita</label>
            <input className="form-input" value={form.title} onChange={handleTitleChange} placeholder="Masukkan judul..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <input className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Kegiatan, Pengumuman, dll" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug URL</label>
              <input className="form-input" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="judul-berita-url" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Link Foto (Google Drive Share Link)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <ImageIcon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://drive.google.com/file/d/.../view?usp=sharing" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              * Pastikan link Google Drive sudah diatur ke <strong>"Anyone with the link can view"</strong> (Siapa saja yang memiliki link dapat melihat).
            </p>
          </div>
          <div className="form-group">
            <label className="form-label">Ringkasan (Excerpt)</label>
            <textarea className="form-input" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Ringkasan singkat artikel..." />
          </div>
          <div className="form-group">
            <label className="form-label">Konten Lengkap</label>
            <textarea className="form-input" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} placeholder="Tulis isi berita di sini..." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Simpan Berita</button>
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>Batal</button>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="table-wrapper admin-card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Berita</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.image_url ? (
                      <div style={{ width: 48, height: 48, borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                        <img src={transformGdriveUrl(item.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: '6px', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                        <Newspaper size={20} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-primary">{item.category || '-'}</span></td>
                <td>
                  <button className="btn btn-sm btn-ghost" onClick={() => togglePublish(item.id, item.is_published)} style={{ color: item.is_published ? 'var(--success)' : 'var(--text-muted)' }}>
                    {item.is_published ? <><ToggleRight size={18} /> Publik</> : <><ToggleLeft size={18} /> Draft</>}
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
            {news.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center" style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Belum ada berita. Klik "Tulis Berita" untuk menambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
