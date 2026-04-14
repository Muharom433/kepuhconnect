import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, LogIn, LayoutDashboard, User, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'
import './Footer.css'

export default function PlatformLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isLoggedIn, isSuperAdmin, profile, signOut } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang', path: '/tentang' },
    { label: 'Syarat & Ketentuan', path: '/syarat-ketentuan' },
    { label: 'Daftarkan Desa', path: '/daftar-desa' },
  ]

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner container-lg">
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo" style={{ background: 'linear-gradient(135deg, #1a6b3c, #2d9254)' }}>ND</div>
            <div className="navbar-brand-text">
              <span className="navbar-brand-name">NusaDesa</span>
              <span className="navbar-brand-sub">Platform Desa Digital</span>
            </div>
          </Link>

          <div className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
            <div className="navbar-links">
              {navLinks.map((link) => (
                <div key={link.path} className="navbar-item">
                  <Link
                    to={link.path}
                    className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            <div className="navbar-actions">
              {isLoggedIn ? (
                <div className="navbar-user">
                  {isSuperAdmin && (
                    <Link to="/superadmin" className="btn btn-sm btn-outline" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard size={14} /> Super Admin
                    </Link>
                  )}
                  <button className="btn btn-sm btn-ghost" onClick={() => { signOut(); setMobileOpen(false) }}>
                    <LogOut size={14} /> Keluar
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-sm btn-primary" onClick={() => setMobileOpen(false)}>
                  <LogIn size={14} /> Masuk
                </Link>
              )}
            </div>
          </div>

          <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container-lg">
          <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: '2rem' }}>
            <p>&copy; {new Date().getFullYear()} NusaDesa — Platform Desa Digital Indonesia. All rights reserved.</p>
            <p className="footer-credit">Dibuat dengan ❤️ untuk kemajuan desa di seluruh Indonesia</p>
          </div>
        </div>
      </footer>
    </>
  )
}
