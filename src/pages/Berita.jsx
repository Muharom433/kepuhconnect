import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useVillage } from '../contexts/VillageContext'
import { Newspaper, Search } from 'lucide-react'

export default function Berita() {
  const [news, setNews] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const { villageId, villageSlug } = useVillage()

  useEffect(() => {
    if (!villageId) return
    async function fetch() {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .eq('village_id', villageId)
        .order('published_at', { ascending: false })
      if (data) setNews(data)
    }
    fetch()
  }, [villageId])

  const defaultNews = [
    { id: '1', title: 'Program Digitalisasi Desa Kepuh Resmi Diluncurkan', slug: 'program-digitalisasi-desa-kepuh', excerpt: 'Desa Kepuh meluncurkan program digitalisasi untuk meningkatkan pelayanan publik.', category: 'pengumuman', published_at: new Date().toISOString() },
    { id: '2', title: 'Pelatihan UMKM Digital untuk Warga', slug: 'pelatihan-umkm-digital', excerpt: 'Pelatihan UMKM digital diadakan untuk meningkatkan kemampuan pemasaran online.', category: 'kegiatan', published_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: '3', title: 'Gotong Royong Pembersihan Sungai', slug: 'gotong-royong-pembersihan-sungai', excerpt: 'Ratusan warga berpartisipasi dalam gotong royong pembersihan sungai desa.', category: 'kegiatan', published_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  ]

  const displayNews = news.length > 0 ? news : defaultNews
  const filtered = displayNews.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'all' || item.category === category
    return matchSearch && matchCategory
  })

  const categories = ['all', ...new Set(displayNews.map(n => n.category))]

  return (
    <div className="page-enter">
      <section style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--bg))', padding: '5rem 0 3rem' }}>
        <div className="container text-center">
          <span className="section-label">Informasi</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Berita Terkini</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Berita dan informasi terbaru seputar kegiatan dan pengumuman Padukuhan Kepuh
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Cari berita..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCategory(cat)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {cat === 'all' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Newspaper size={48} />
              <h3>Belum ada berita</h3>
              <p>Berita akan muncul di sini saat sudah dipublikasikan</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {filtered.map(item => (
                <Link to={`/${villageSlug}/berita/${item.slug}`} key={item.id} className="card">
                  <div className="card-img" style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--primary-lighter))' }}>
                    <div className="flex-center" style={{ height: '100%' }}>
                      <Newspaper size={40} style={{ color: 'var(--primary-light)' }} />
                    </div>
                  </div>
                  <div className="card-body">
                    <span className="badge badge-primary" style={{ marginBottom: '0.75rem', textTransform: 'capitalize' }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{item.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.excerpt}</p>
                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
