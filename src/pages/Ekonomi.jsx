import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useVillage } from '../contexts/VillageContext'
import { Store, Home, Search, MapPin, Phone, Filter } from 'lucide-react'

// Fungsi helper: Mengubah GDrive url ke format yang bisa di-embed
const getDirectImageUrl = (url) => {
  if (!url) return '';
  let id = '';
  const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD) id = matchD[1];
  else {
    const matchId = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (matchId) id = matchId[1];
  }
  return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
}

export default function Ekonomi() {
  const [tab, setTab] = useState('umkm')
  const [umkm, setUmkm] = useState([])
  const [kost, setKost] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { villageId } = useVillage()

  useEffect(() => {
    if (!villageId) return
    async function fetch() {
      const [umkmRes, kostRes] = await Promise.all([
        supabase.from('umkm_products').select('*').eq('is_active', true).eq('village_id', villageId),
        supabase.from('kost_listings').select('*').eq('is_active', true).eq('village_id', villageId),
      ])
      if (umkmRes.data) setUmkm(umkmRes.data)
      if (kostRes.data) setKost(kostRes.data)
    }
    fetch()
  }, [villageId])

  const displayUmkm = umkm
  const displayKost = kost

  const categories = ['all', ...new Set(displayUmkm.map(p => p.category))]

  const filteredUmkm = displayUmkm.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                       item.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter
    return matchSearch && matchCat
  })

  const filteredKost = displayKost.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--accent-light), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Ekonomi Desa</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Marketplace Padukuhan Kepuh</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Temukan produk UMKM unggulan dan informasi hunian di Padukuhan Kepuh
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-alt)', padding: '0.375rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
            <button className={`btn btn-sm ${tab === 'umkm' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('umkm')}>
              <Store size={16} /> Katalog UMKM
            </button>
            <button className={`btn btn-sm ${tab === 'kost' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('kost')}>
              <Home size={16} /> Info Kost/Hunian
            </button>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder={tab === 'umkm' ? 'Cari produk UMKM...' : 'Cari kost/hunian...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            {tab === 'umkm' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {categories.map(cat => (
                  <button key={cat} className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCategoryFilter(cat)}>
                    {cat === 'all' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* UMKM Tab */}
          {tab === 'umkm' && (
            filteredUmkm.length === 0 ? (
              <div className="empty-state">
                <Store size={48} /><h3>Produk tidak ditemukan</h3>
              </div>
            ) : (
              <div className="grid grid-3">
                {filteredUmkm.map(product => (
                  <div key={product.id} className="card">
                    <div className="card-img" style={{ background: 'var(--primary-bg)', height: 180 }}>
                      {product.image_url ? (
                        <img src={getDirectImageUrl(product.image_url)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                      ) : (
                        <div className="flex-center" style={{ height: '100%' }}>
                          <Store size={36} style={{ color: 'var(--primary-light)' }} />
                        </div>
                      )}
                    </div>
                    <div className="card-body">
                      <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{product.category}</span>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{product.name}</h4>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>{product.description}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>oleh {product.owner_name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                        <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                          Rp {product.price?.toLocaleString('id-ID')}
                        </p>
                        {product.contact && (
                          <a href={`https://wa.me/${product.contact}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                            <Phone size={12} /> Hubungi
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Kost Tab */}
          {tab === 'kost' && (
            filteredKost.length === 0 ? (
              <div className="empty-state">
                <Home size={48} /><h3>Kost tidak ditemukan</h3>
              </div>
            ) : (
              <div className="grid grid-2">
                {filteredKost.map(item => (
                  <div key={item.id} className="card-flat" style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ width: 140, height: 140, borderRadius: 'var(--radius-md)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {item.image_url ? (
                        <img src={getDirectImageUrl(item.image_url)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                      ) : (
                        <Home size={32} style={{ color: 'var(--primary-light)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: '0.375rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{item.description}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                        <MapPin size={14} /> 
                        {item.gmap_link ? (
                          <a href={item.gmap_link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                            {item.location} <span style={{ fontSize: '0.7rem' }}>(Lihat Peta)</span>
                          </a>
                        ) : (
                          item.location
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Fasilitas: {item.facilities}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                          Rp {item.price?.toLocaleString('id-ID')}/bulan
                        </p>
                        <a href={`https://wa.me/${item.contact}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                          <Phone size={12} /> Hubungi
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  )
}
