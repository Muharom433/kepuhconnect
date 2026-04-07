import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Users, Shield, Search, UserCheck, UserX, ShieldAlert } from 'lucide-react'

export default function UsersManage() {
  const { profile: currentAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setUsers(data)
  }

  async function verifyUser(id) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', id)
    if (error) {
      console.error('Gagal verifikasi:', error)
      alert('Gagal memverifikasi user. Pastikan RLS policy sudah diset dengan benar di Supabase.')
      return
    }
    fetchData()
  }

  async function unverifyUser(id) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: false })
      .eq('id', id)
    if (error) {
      console.error('Gagal batalkan verifikasi:', error)
      alert('Gagal membatalkan verifikasi user.')
      return
    }
    fetchData()
  }

  async function changeRole(id, role) {
    // Cegah admin mengubah role akun dirinya sendiri
    if (id === currentAdmin?.id) {
      alert('Anda tidak dapat mengubah role akun Anda sendiri.')
      return
    }
    await supabase.from('profiles').update({ role }).eq('id', id)
    fetchData()
  }

  const filtered = users.filter(u => {
    const matchSearch = `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    if (filter === 'verified') return matchSearch && u.is_verified
    if (filter === 'pending') return matchSearch && !u.is_verified
    if (filter === 'admin') return matchSearch && u.role === 'admin'
    return matchSearch
  })

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Kelola Pengguna</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Verifikasi dan kelola akun pengguna</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-input" placeholder="Cari pengguna..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'verified', 'admin'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
              {f === 'all' ? 'Semua' : f === 'pending' ? 'Pending' : f === 'verified' ? 'Terverifikasi' : 'Admin'}
              <span style={{ marginLeft: 4 }}>
                ({f === 'all' ? users.length :
                  f === 'pending' ? users.filter(u => !u.is_verified).length :
                  f === 'verified' ? users.filter(u => u.is_verified).length :
                  users.filter(u => u.role === 'admin').length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><Users size={48} /><h3>Tidak ada pengguna</h3></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.first_name} {u.last_name}</strong>
                    <br /><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ fontSize: '0.85rem' }}>{u.country_code}{u.whatsapp}</td>
                  <td>
                    {u.id === currentAdmin?.id ? (
                      // Akun sendiri: tidak bisa ubah role
                      <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: 'fit-content' }}>
                        <ShieldAlert size={12} /> Admin (Anda)
                      </span>
                    ) : (
                      <select
                        className="form-select"
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value)}
                        style={{ padding: '0.375rem 0.625rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="pengunjung">Pengunjung</option>
                        <option value="pengguna">Pengguna</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${u.is_verified ? 'badge-success' : 'badge-warning'}`}>
                      {u.is_verified ? 'Terverifikasi' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {u.id === currentAdmin?.id ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                    ) : u.is_verified ? (
                      <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => unverifyUser(u.id)}>
                        <UserX size={14} /> Batalkan
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-success" onClick={() => verifyUser(u.id)}>
                        <UserCheck size={14} /> Verifikasi
                      </button>
                    )}
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
