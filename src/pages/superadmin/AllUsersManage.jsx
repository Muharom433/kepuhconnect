import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Users, Search, Shield, CheckCircle, XCircle, Globe } from 'lucide-react'

export default function AllUsersManage() {
  const [users, setUsers] = useState([])
  const [villages, setVillages] = useState({})
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [usersRes, villagesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('villages').select('id, name, slug'),
    ])
    if (usersRes.data) setUsers(usersRes.data)
    if (villagesRes.data) {
      const map = {}
      villagesRes.data.forEach(v => { map[v.id] = v })
      setVillages(map)
    }
  }

  async function updateRole(userId, newRole) {
    const villageId = newRole === 'super_admin' ? null : undefined
    const updateData = { role: newRole }
    if (villageId === null) updateData.village_id = null
    await supabase.from('profiles').update(updateData).eq('id', userId)
    fetchData()
  }

  async function toggleVerified(userId, current) {
    await supabase.from('profiles').update({ is_verified: !current }).eq('id', userId)
    fetchData()
  }

  const filtered = users.filter(u => {
    const matchSearch = `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const roleBadge = (role) => {
    const map = { super_admin: 'badge-info', admin: 'badge-primary', pengguna: 'badge-success', pengunjung: 'badge-warning' }
    return map[role] || 'badge-primary'
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Kelola Semua Users</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Kelola semua pengguna di seluruh desa</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-input" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {['all', 'super_admin', 'admin', 'pengguna', 'pengunjung'].map(r => (
            <button key={r} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRoleFilter(r)}>
              {r === 'all' ? 'Semua' : r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><Users size={48} /><h3>Tidak ada user ditemukan</h3></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Nama</th><th>Email</th><th>Desa</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.first_name} {u.last_name}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {u.village_id && villages[u.village_id]
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Globe size={12} /> {villages[u.village_id].name}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>
                    }
                  </td>
                  <td><span className={`badge ${roleBadge(u.role)}`}>{u.role?.replace('_', ' ')}</span></td>
                  <td>
                    <span className={`badge ${u.is_verified ? 'badge-success' : 'badge-warning'}`}>
                      {u.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-sm btn-ghost" onClick={() => toggleVerified(u.id, u.is_verified)} title={u.is_verified ? 'Unverify' : 'Verify'}>
                        {u.is_verified ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      </button>
                      {u.role !== 'super_admin' && (
                        <select
                          className="form-select"
                          value={u.role}
                          onChange={e => updateRole(u.id, e.target.value)}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', minWidth: 'auto' }}
                        >
                          <option value="pengunjung">pengunjung</option>
                          <option value="pengguna">pengguna</option>
                          <option value="admin">admin</option>
                          <option value="super_admin">super_admin</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
