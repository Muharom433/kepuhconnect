import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard, Database, FileText, Store,
  Home, Users, LogOut, Menu, X, ChevronLeft, UserSquare
} from 'lucide-react'
import { useState } from 'react'
import './AdminLayout.css'

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Manajemen Data', path: '/admin/data', icon: Database },
  { label: 'Kelola Persuratan', path: '/admin/persuratan', icon: FileText },
  { label: 'Kelola UMKM', path: '/admin/umkm', icon: Store },
  { label: 'Kelola Beranda', path: '/admin/beranda', icon: Home },
  { label: 'Kependudukan', path: '/admin/penduduk', icon: UserSquare },
  { label: 'Kelola Users', path: '/admin/users', icon: Users },
]

export default function AdminLayout() {
  const { isAdmin, profile, signOut, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">
            <div className="navbar-logo">KC</div>
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>KepuhConnect</div>
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
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>Admin</div>
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
