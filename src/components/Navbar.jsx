import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Settings } from 'lucide-react'
import './Navbar.css'

const navLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Profil Desa', path: '/profil' },
  { label: 'Berita', path: '/berita' },
  {
    label: 'Layanan',
    path: '/layanan',
    children: [
      { label: 'Formulir Surat', path: '/layanan/surat' },
      { label: 'Status Permohonan', path: '/layanan/status' },
      { label: 'Info Persyaratan', path: '/layanan/persyaratan' },
    ],
  },
  { label: 'Ekonomi', path: '/ekonomi' },
  { label: 'Kontak', path: '/kontak' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const { isLoggedIn, isAdmin, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container-lg">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">KC</div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">KepuhConnect</span>
            <span className="navbar-brand-sub">Padukuhan Kepuh</span>
          </div>
        </Link>

        <div className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="navbar-item"
                onMouseEnter={() => link.children && setDropdownOpen(link.path)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  to={link.children ? '#' : link.path}
                  className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={(e) => {
                    if (link.children) e.preventDefault()
                    else setMobileOpen(false)
                  }}
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} />}
                </Link>
                {link.children && dropdownOpen === link.path && (
                  <div className="navbar-dropdown">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="navbar-dropdown-link"
                        onClick={() => {
                          setMobileOpen(false)
                          setDropdownOpen(null)
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="navbar-actions">
            {isLoggedIn ? (
              <div className="navbar-user">
                {isAdmin && (
                  <Link to="/admin" className="btn btn-sm btn-outline" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard size={14} />
                    Admin
                  </Link>
                )}
              <div
                className="navbar-user-info"
                style={{ position: 'relative' }}
                onMouseEnter={() => setDropdownOpen('user')}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <div className="navbar-avatar" style={{ cursor: 'pointer' }}>
                  <User size={16} />
                </div>
                <span className="navbar-user-name hide-mobile" style={{ cursor: 'pointer' }}>
                  {profile?.first_name}
                </span>
                {dropdownOpen === 'user' && (
                  <div className="navbar-dropdown" style={{ right: 0, left: 'auto', minWidth: 160 }}>
                    <Link to="/profil/edit" className="navbar-dropdown-link"
                      onClick={() => { setMobileOpen(false); setDropdownOpen(null) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Settings size={14} /> Edit Profil
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setDropdownOpen(null) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--danger)', fontFamily: 'inherit', textAlign: 'left' }}
                    >
                      <LogOut size={14} /> Keluar
                    </button>
                  </div>
                )}
              </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-ghost" onClick={() => setMobileOpen(false)}>
                  Masuk
                </Link>
                <Link to="/signup" className="btn btn-sm btn-primary" onClick={() => setMobileOpen(false)}>
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>

        <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}
