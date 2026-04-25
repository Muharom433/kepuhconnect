import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useVillage } from '../../contexts/VillageContext'
import {
  Users, FileText, Store, Eye,
  TrendingUp, Clock, CheckCircle, XCircle,
  AlertCircle, ArrowUpRight, Activity
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, pendingSurat: 0, umkm: 0, news: 0 })
  const [recentSurat, setRecentSurat] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const { villageId, villageName } = useVillage()

  useEffect(() => {
    if (!villageId) return
    async function fetch() {
      const [usersRes, suratRes, umkmRes, newsRes, recentSuratRes, recentUsersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('village_id', villageId),
        supabase.from('surat_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending').eq('village_id', villageId),
        supabase.from('umkm_products').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('village_id', villageId),
        supabase.from('news').select('id', { count: 'exact', head: true }).eq('is_published', true).eq('village_id', villageId),
        supabase.from('surat_submissions').select('*').eq('village_id', villageId).order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('*').eq('village_id', villageId).order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        users: usersRes.count || 0,
        pendingSurat: suratRes.count || 0,
        umkm: umkmRes.count || 0,
        news: newsRes.count || 0,
      })
      if (recentSuratRes.data) setRecentSurat(recentSuratRes.data)
      if (recentUsersRes.data) setRecentUsers(recentUsersRes.data)
    }
    fetch()
  }, [villageId])

  const statCards = [
    {
      icon: Users,
      label: 'Total Pengguna',
      value: stats.users,
      color: 'var(--primary)',
      bg: 'var(--primary-bg)',
      glow: 'rgba(0,132,79,0.15)',
      accent: 'var(--primary)',
      trend: '+12%'
    },
    {
      icon: FileText,
      label: 'Surat Pending',
      value: stats.pendingSurat,
      color: '#EF642C',
      bg: 'rgba(239,100,44,0.1)',
      glow: 'rgba(239,100,44,0.15)',
      accent: '#EF642C',
      trend: 'perlu diproses'
    },
    {
      icon: Store,
      label: 'Produk UMKM',
      value: stats.umkm,
      color: 'var(--secondary)',
      bg: 'var(--secondary-bg)',
      glow: 'rgba(0,128,134,0.15)',
      accent: 'var(--secondary)',
      trend: 'aktif'
    },
    {
      icon: Eye,
      label: 'Berita Terbit',
      value: stats.news,
      color: 'var(--primary)',
      bg: 'var(--primary-bg)',
      glow: 'rgba(0,132,79,0.12)',
      accent: 'var(--primary)',
      trend: 'published'
    },
  ]

  const statusMap = {
    pending:    { label: 'Menunggu',  cls: 'badge-warning',  icon: Clock },
    processing: { label: 'Diproses',  cls: 'badge-info',     icon: Activity },
    approved:   { label: 'Disetujui', cls: 'badge-success',  icon: CheckCircle },
    rejected:   { label: 'Ditolak',   cls: 'badge-danger',   icon: XCircle },
  }

  return (
    <div className="page-enter">

      {/* ─── PAGE HEADER ───────────────────────────── */}
      <div className="admin-page-header">
        <div>
          <span className="admin-section-badge" style={{ marginBottom: '0.625rem', display: 'inline-flex' }}>
            <Activity size={10} />
            Panel Admin
          </span>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem', lineHeight: 1.2 }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Selamat datang kembali di panel admin&nbsp;
            <strong style={{ color: 'var(--primary)' }}>{villageName || 'NusaDesa'}</strong>
          </p>
        </div>
        {/* Mini status indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(0,132,79,0.08)', border: '1px solid rgba(0,132,79,0.18)',
          borderRadius: '999px', padding: '0.4rem 1rem',
          fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)'
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
          Sistem Aktif
        </div>
      </div>

      {/* ─── STAT CARDS ────────────────────────────── */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <div key={i} className="admin-stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
            {/* Glow blob */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`,
              pointerEvents: 'none'
            }} />
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: s.bg, color: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 4px 12px ${s.glow}`
            }}>
              <s.icon size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '1.75rem', fontWeight: 800,
                color: s.color, lineHeight: 1, marginBottom: '0.2rem'
              }}>{s.value}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</p>
            </div>
            {/* Trend pill */}
            <div style={{
              position: 'absolute', top: '0.75rem', right: '0.875rem',
              fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em',
              color: s.color, background: s.bg,
              borderRadius: '999px', padding: '0.15rem 0.45rem',
              border: `1px solid ${s.bg}`
            }}>{s.trend}</div>
          </div>
        ))}
      </div>

      {/* ─── RECENT TABLES ─────────────────────────── */}
      <div className="grid grid-2">

        {/* Recent Surat */}
        <div className="admin-card animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <div className="admin-card-header">
            <div className="admin-card-title">
              <FileText size={16} />
              Permohonan Terbaru
            </div>
            <span className="admin-section-badge">
              {stats.pendingSurat} pending
            </span>
          </div>
          {recentSurat.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '2rem 1rem',
              color: 'var(--text-muted)', fontSize: '0.875rem'
            }}>
              <FileText size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.25 }} />
              <p>Belum ada permohonan surat</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentSurat.map(s => {
                const st = statusMap[s.status] || { label: s.status, cls: 'badge-primary', icon: AlertCircle }
                return (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg)',
                    border: '1px solid var(--border-light)',
                    transition: 'var(--transition)'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,132,79,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                  >
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.1rem' }}>
                        {s.data?.nama || 'Pemohon'}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`badge ${st.cls}`} style={{ textTransform: 'capitalize', fontSize: '0.68rem' }}>
                      {st.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="admin-card animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
          <div className="admin-card-header">
            <div className="admin-card-title">
              <Users size={16} />
              Pengguna Terbaru
            </div>
            <span className="admin-section-badge">
              {stats.users} total
            </span>
          </div>
          {recentUsers.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '2rem 1rem',
              color: 'var(--text-muted)', fontSize: '0.875rem'
            }}>
              <Users size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.25 }} />
              <p>Belum ada pengguna terdaftar</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentUsers.map(u => (
                <div key={u.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg)',
                  border: '1px solid var(--border-light)',
                  transition: 'var(--transition)'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,132,79,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    {/* Avatar inisial */}
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary-bg), var(--secondary-bg))',
                      color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                      border: '1px solid rgba(0,132,79,0.15)'
                    }}>
                      {(u.first_name?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.1rem' }}>
                        {u.first_name} {u.last_name}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</p>
                    </div>
                  </div>
                  <span className={`badge ${u.is_verified ? 'badge-success' : 'badge-warning'}`}
                    style={{ fontSize: '0.68rem' }}>
                    {u.is_verified ? 'Terverifikasi' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── QUICK INFO BANNER ─────────────────────── */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(0,132,79,0.06) 0%, rgba(0,128,134,0.04) 100%)',
        border: '1px solid rgba(0,132,79,0.12)',
        borderLeft: '3px solid var(--primary)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
      }}>
        <TrendingUp size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.15rem' }}>
            Panduan Admin NusaDesa
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Kelola konten beranda, data kependudukan, permohonan surat, dan produk UMKM melalui menu di sidebar kiri.
          </p>
        </div>
      </div>

    </div>
  )
}
