import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { VillageProvider, useVillage } from '../contexts/VillageContext'
import {
  LayoutDashboard, Database, FileText, Store,
  Home, Users, LogOut, Menu, X, ChevronLeft, UserSquare, Map
} from 'lucide-react'
import { useState } from 'react'
import './AdminLayout.css'

function AdminLayoutInner() {
  const { isAdmin, isSuperAdmin, profile, signOut, loading } = useAuth()
  const { villageSlug, villageName, village, villageId, loading: villageLoading, isNotFound } = useVillage()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const base = `/${villageSlug}/admin`

  const sidebarLinks = [
    { label: 'Dashboard', path: base, icon: LayoutDashboard, exact: true },
    { label: 'Manajemen Data', path: `${base}/data`, icon: Database },
    { label: 'Kelola Persuratan', path: `${base}/persuratan`, icon: FileText },
    { label: 'Kelola UMKM', path: `${base}/umkm`, icon: Store },
    { label: 'Kelola Kost', path: `${base}/kost`, icon: Home },
    { label: 'Kelola Wisata', path: `${base}/wisata`, icon: Map },
    { label: 'Kelola Berita', path: `${base}/berita`, icon: FileText },
    { label: 'Kelola Beranda', path: `${base}/beranda`, icon: Home },
    { label: 'Kependudukan', path: `${base}/penduduk`, icon: UserSquare },
    { label: 'Kelola Users', path: `${base}/users`, icon: Users },
  ]

  // Tunggu KEDUANYA selesai load sebelum cek akses
  // Ini mencegah redirect prematur saat villageId masih null
  if (loading || villageLoading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  // Jika desa tidak ditemukan (atau tidak aktif), jangan redirect ke login, tampilkan pesan error
  if (isNotFound) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h2>Desa Tidak Ditemukan</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Desa ini mungkin tidak aktif atau tidak ada.</p>
        <button className="btn btn-primary" onClick={signOut}>Keluar</button>
      </div>
    )
  }

  // Super admin bisa akses admin panel desa manapun
  // Gunakan loose equality (==) untuk menghindari masalah tipe data (number vs string)
  const canAccess = isSuperAdmin || (isAdmin && profile?.village_id == villageId)
  
  if (!canAccess) {
    console.warn('Access denied: role=', profile?.role, 'profile.village_id=', profile?.village_id, 'context.villageId=', villageId)
    return <Navigate to={`/${villageSlug}/login`} replace />
  }

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  // Singkatan logo desa
  const logoText = villageName
    ? villageName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'ND'

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to={`/${villageSlug}`} className="admin-logo">
            <img src="/img/logo nusadesa.png" alt="Logo" style={{ height: 36, objectFit: 'contain', borderRadius: '6px' }} />
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>{villageName || 'NusaDesa'}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Admin Panel</div>
              </div>
            )}
          </Link>
          <button className="admin-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="admin-nav">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`admin-nav-link ${isActive(link.path, link.exact) ? 'active' : ''}`}
            >
              <link.icon size={20} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="navbar-avatar" style={{ width: 32, height: 32 }}>
              <Users size={16} />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'white' }}>
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </div>
              </div>
            )}
          </div>
          <button className="admin-nav-link" onClick={signOut} style={{ marginTop: '0.5rem' }}>
            <LogOut size={20} />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}

// Wrap dengan VillageProvider karena AdminLayout hidup di route /:villageSlug/admin
export default function AdminLayout() {
  return (
    <VillageProvider>
      <AdminLayoutInner />
    </VillageProvider>
  )
}
