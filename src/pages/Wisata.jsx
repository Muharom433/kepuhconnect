import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useVillage } from '../contexts/VillageContext'
import { Map, MapPin, Phone } from 'lucide-react'

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

export default function Wisata() {
  const [wisata, setWisata] = useState([])
  const [search, setSearch] = useState('')
  const { villageId, villageName } = useVillage()

  useEffect(() => {
    if (!villageId) return
    async function fetch() {
      const { data } = await supabase.from('wisata_listings').select('*').eq('is_active', true).eq('village_id', villageId)
      if (data) setWisata(data)
    }
    fetch()
  }, [villageId])

  const filteredWisata = wisata.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Potensi Pariwisata</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Eksplorasi {villageName}</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Temukan keindahan alam, budaya, dan destinasi wisata terbaik di desa kami.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ position: 'relative', marginBottom: '3rem', maxWidth: 600, margin: '0 auto 3rem' }}>
            <input
              type="text"
              placeholder="Cari tempat wisata atau lokasi..."
              className="form-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '3rem', borderRadius: '100px', height: '3.5rem', fontSize: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            />
            <MapPin size={20} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          {filteredWisata.length === 0 ? (
            <div className="empty-state">
              <Map size={48} />
              <h3>Belum ada destinasi wisata</h3>
              <p>Data wisata sedang diperbarui atau tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {filteredWisata.map(item => (
                <div key={item.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div className="card-img" style={{ height: 220, position: 'relative', background: 'var(--primary-bg)' }}>
                    {item.image_url ? (
                      <img src={getDirectImageUrl(item.image_url)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex-center" style={{ height: '100%' }}>
                        <Map size={48} style={{ color: 'var(--primary-light)' }} />
                      </div>
                    )}
                    {item.ticket_price === 0 && (
                      <span style={{ position: 'absolute', top: 16, right: 16, background: 'var(--success)', color: 'white', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        Gratis
                      </span>
                    )}
                  </div>
                  <div className="card-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', lineHeight: 1.3 }}>{item.title}</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> 
                      {item.gmap_link ? (
                        <a href={item.gmap_link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', lineHeight: 1.4 }}>
                          {item.location}
                        </a>
                      ) : (
                        <span style={{ lineHeight: 1.4 }}>{item.location}</span>
                      )}
                    </div>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                      {item.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', marginTop: 'auto' }}>
                      {item.facilities && item.facilities.split(',').map((fac, i) => (
                        <span key={i} style={{ background: 'var(--bg-alt)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                          {fac.trim()}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Tiket Masuk</div>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.25rem' }}>
                          {item.ticket_price > 0 ? `Rp ${item.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}
                        </div>
                      </div>
                      
                      {item.contact && (
                        <a href={`https://wa.me/${item.contact}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ gap: '0.5rem', padding: '0.6rem 1rem' }}>
                          <Phone size={16} /> Hubungi
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
