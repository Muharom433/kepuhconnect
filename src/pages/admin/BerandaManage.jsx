import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useVillage } from '../../contexts/VillageContext'
import { Save, Edit2, ExternalLink, RefreshCw } from 'lucide-react'

export default function BerandaManage() {
  const [villageInfo, setVillageInfo] = useState([])
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const { villageId, villageSlug } = useVillage()
  
  // Ref array untuk iframe preview
  const iframeRef = useRef()

  const berandaKeys = ['hero_image', 'hero_title', 'hero_subtitle', 'sambutan_dukuh']
  const labels = {
    hero_image: 'Foto Latar Belakang',
    hero_title: 'Judul Hero',
    hero_subtitle: 'Sub Judul Hero',
    sambutan_dukuh: 'Teks Sambutan Kepala Desa',
  }

  const defaultHeroImage = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1920&auto=format&fit=crop'

  useEffect(() => { if (villageId) fetchData() }, [villageId])

  async function fetchData() {
    const { data } = await supabase.from('village_info').select('*').eq('village_id', villageId)
    if (data) setVillageInfo(data.filter(i => berandaKeys.includes(i.key)))
  }

  async function handleSave(key, id) {
    setSaving(true)
    if (id) {
      await supabase.from('village_info').update({ value: editValue, updated_at: new Date().toISOString() }).eq('id', id)
    } else {
      await supabase.from('village_info').insert({ key, value: editValue, village_id: villageId })
    }
    await fetchData()
    setEditing(null)
    setSaving(false)
    // Reload preview iframe
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <div>
          <span className="admin-section-badge" style={{ marginBottom: '0.625rem', display: 'inline-flex' }}>
            <Edit2 size={10} /> Konten
          </span>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem', lineHeight: 1.2 }}>Kelola Beranda</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Edit konten yang ditampilkan di halaman utama</p>
        </div>
        <button className="btn btn-outline" onClick={() => iframeRef.current && (iframeRef.current.src = `/${villageSlug}`)}>
          <RefreshCw size={14} /> Segarkan Preview
        </button>
      </div>

      {/* ── Preview Halaman Beranda ── */}
      <div className="card-flat" style={{ marginBottom: '1.5rem', padding: '0.5rem', background: '#e0e0e0', border: '2px solid var(--border-light)' }}>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.5rem 0.5rem' }}>
           <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Preview Beranda</span>
           <a href={`/${villageSlug}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 600 }}>
             Buka Tab Baru <ExternalLink size={12} />
           </a>
         </div>
         <iframe 
           ref={iframeRef}
           src={villageSlug ? `/${villageSlug}` : '/'} 
           title="Preview"
           style={{
             width: '100%',
             height: '450px',
             border: 'none',
             borderRadius: '8px',
             background: '#fff',
             boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
           }}
         />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {berandaKeys.map(key => {
          const item = villageInfo.find(i => i.key === key) || { key, value: '', id: null }
          return (
            <div key={key} className="card-flat">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: editing === key ? '1rem' : 0 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                    {labels[key] || key}
                  </p>
                  {editing !== key && (
                    key === 'hero_image' ? (
                      <div style={{ marginTop: '0.5rem' }}>
                        <img 
                          src={item.value || defaultHeroImage} 
                          alt="Hero Background" 
                          style={{ height: 120, width: 220, objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--border-light)' }} 
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                          {item.value ? 'Foto Kustom Aktif' : 'Memakai Foto Default'}
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.7, wordBreak: 'break-all' }}>
                        {item.value || '—'}
                      </p>
                    )
                  )}
                </div>
                {editing !== key && (
                  <button className="btn btn-sm btn-ghost" onClick={() => { setEditing(key); setEditValue(item.value || '') }}>
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>
              {editing === key && (
                <div>
                  {key === 'hero_image' ? (
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Unggah file gambar berukuran landscape (direkomendasikan 1920x1080). Gambar akan otomatis disesuaikan ukurannya.
                      </p>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="form-input"
                        onChange={e => {
                          const file = e.target.files[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            const img = new Image()
                            img.onload = () => {
                              const canvas = document.createElement('canvas')
                              const MAX_WIDTH = 1920
                              const MAX_HEIGHT = 1080
                              let width = img.width
                              let height = img.height

                              if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                                const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
                                width = width * ratio
                                height = height * ratio
                              }
                              
                              canvas.width = width
                              canvas.height = height
                              const ctx = canvas.getContext('2d')
                              ctx.drawImage(img, 0, 0, width, height)
                              // compress to jpeg 70% quality
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
                              setEditValue(dataUrl)
                            }
                            img.src = event.target.result
                          }
                          reader.readAsDataURL(file)
                        }}
                      />
                      {editValue && editValue.startsWith('data:image') && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <img src={editValue} alt="Preview Upload" style={{ height: 100, borderRadius: 8, objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <textarea
                      className="form-input"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      rows={key === 'sambutan_dukuh' ? 5 : 2}
                    />
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button className="btn btn-sm btn-primary" onClick={() => handleSave(key, item.id)} disabled={saving}>
                      <Save size={14} /> Simpan
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditing(null)}>Batal</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
