import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard, Globe, Users, LogOut, Menu, ChevronLeft, Settings, Shield
} from 'lucide-react'
import { useState } from 'react'
import './AdminLayout.css'

const sidebarLinks = [
  { label: 'Dashboard', path: '/superadmin', icon: LayoutDashboard, exact: true },
  { label: 'Kelola Desa', path: '/superadmin/villages', icon: Globe },
  { label: 'Semua Users', path: '/superadmin/users', icon: Users },
]

export default function SuperAdminLayout() {
  const { isSuperAdmin, profile, signOut, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  if (!isSuperAdmin) {
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
            <img src="/img/logo nusadesa.png" alt="Logo" style={{ height: 36, objectFit: 'contain', borderRadius: '6px' }} />
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>NusaDesa</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Super Admin</div>
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
              <Shield size={16} />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'white' }}>
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>Super Admin</div>
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
