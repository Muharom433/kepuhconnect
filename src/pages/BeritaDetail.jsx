import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useVillage } from '../contexts/VillageContext'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'

export default function BeritaDetail() {
  const { slug } = useParams()
  const { villageSlug } = useVillage()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .single()
      if (data) setArticle(data)
    }
    fetch()
  }, [slug])

  if (!article) {
    return (
      <div className="page-enter">
        <section style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
            <Link to={`/${villageSlug}/berita`} className="btn btn-ghost" style={{ marginBottom: '2rem' }}>
              <ArrowLeft size={16} /> Kembali ke Berita
            </Link>
            <div className="empty-state">
              <h3>Artikel tidak ditemukan</h3>
              <p>Artikel yang Anda cari tidak tersedia</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section style={{ padding: '5rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <Link to={`/${villageSlug}/berita`} className="btn btn-ghost" style={{ marginBottom: '2rem' }}>
            <ArrowLeft size={16} /> Kembali ke Berita
          </Link>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>
            <Tag size={12} /> {article.category}
          </span>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '1rem', lineHeight: 1.3 }}>{article.title}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Calendar size={14} />
              {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div style={{ fontSize: '1.05rem', lineHeight: 1.9, color: 'var(--text-secondary)' }}>
            {article.content?.split('\n').map((p, i) => <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>)}
          </div>
        </div>
      </section>
    </div>
  )
}
