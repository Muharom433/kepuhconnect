import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useVillage } from '../../contexts/VillageContext'
import { Users, FileText, Store, Eye, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

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
    { icon: Users, label: 'Total Users', value: stats.users, color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { icon: FileText, label: 'Surat Pending', value: stats.pendingSurat, color: 'var(--warning)', bg: '#FFF8E1' },
    { icon: Store, label: 'Produk UMKM', value: stats.umkm, color: 'var(--info)', bg: '#E3F2FD' },
    { icon: Eye, label: 'Berita Published', value: stats.news, color: 'var(--success)', bg: '#E8F5E8' },
  ]

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', processing: 'badge-info', approved: 'badge-success', rejected: 'badge-danger' }
    return map[status] || 'badge-primary'
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Selamat datang di panel admin {villageName || 'NusaDesa'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <div key={i} className="card-flat" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={22} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-2">
        {/* Recent Surat */}
        <div className="card-flat">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Permohonan Terbaru
          </h3>
          {recentSurat.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Belum ada permohonan</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentSurat.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.data?.nama || 'User'}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(s.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className={`badge ${statusBadge(s.status)}`} style={{ textTransform: 'capitalize' }}>{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card-flat">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} /> Pengguna Terbaru
          </h3>
          {recentUsers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Belum ada pengguna</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentUsers.map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{u.first_name} {u.last_name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</p>
                  </div>
                  <span className={`badge ${u.is_verified ? 'badge-success' : 'badge-warning'}`}>
                    {u.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
