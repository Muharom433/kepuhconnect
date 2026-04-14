import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Globe, Users, FileText, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function SuperDashboard() {
  const [stats, setStats] = useState({ villages: 0, activeVillages: 0, pendingRegistrations: 0, totalUsers: 0 })
  const [recentRegistrations, setRecentRegistrations] = useState([])
  const [recentVillages, setRecentVillages] = useState([])

  useEffect(() => {
    async function fetch() {
      const [villagesRes, activeRes, pendingRes, usersRes, regRes, recentVillRes] = await Promise.all([
        supabase.from('villages').select('id', { count: 'exact', head: true }),
        supabase.from('villages').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('village_registrations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('village_registrations').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('villages').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        villages: villagesRes.count || 0,
        activeVillages: activeRes.count || 0,
        pendingRegistrations: pendingRes.count || 0,
        totalUsers: usersRes.count || 0,
      })
      if (regRes.data) setRecentRegistrations(regRes.data)
      if (recentVillRes.data) setRecentVillages(recentVillRes.data)
    }
    fetch()
  }, [])

  const statCards = [
    { icon: Globe, label: 'Total Desa', value: stats.villages, color: '#2d9254', bg: '#E8F5E8' },
    { icon: CheckCircle, label: 'Desa Aktif', value: stats.activeVillages, color: '#16a34a', bg: '#dcfce7' },
    { icon: Clock, label: 'Pendaftaran Pending', value: stats.pendingRegistrations, color: '#d97706', bg: '#FFF8E1' },
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#4a8fc9', bg: '#E3F2FD' },
  ]

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', reviewing: 'badge-info', approved: 'badge-success', rejected: 'badge-danger', active: 'badge-success', suspended: 'badge-danger' }
    return map[status] || 'badge-primary'
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Super Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Platform NusaDesa — Kelola semua desa dari satu tempat</p>
      </div>

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

      <div className="grid grid-2">
        {/* Recent Registrations */}
        <div className="card-flat">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Pendaftaran Terbaru
          </h3>
          {recentRegistrations.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Belum ada pendaftaran</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentRegistrations.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.village_name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.contact_email}</p>
                  </div>
                  <span className={`badge ${statusBadge(r.status)}`} style={{ textTransform: 'capitalize' }}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Villages */}
        <div className="card-flat">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} /> Desa Terdaftar
          </h3>
          {recentVillages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Belum ada desa</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentVillages.map(v => (
                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{v.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{v.slug}</p>
                  </div>
                  <span className={`badge ${statusBadge(v.status)}`} style={{ textTransform: 'capitalize' }}>{v.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
