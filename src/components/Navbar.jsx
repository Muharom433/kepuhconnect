import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useVillage } from '../contexts/VillageContext'
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Settings } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const { isLoggedIn, isAdmin, isSuperAdmin, profile, signOut } = useAuth()
  const { villageSlug, villageName, village } = useVillage()
  const location = useLocation()
  const navigate = useNavigate()

  const base = `/${villageSlug}`

  const navLinks = [
    { label: 'Beranda', path: base },
    { label: 'Profil Desa', path: `${base}/profil` },
    { label: 'Berita', path: `${base}/berita` },
    {
      label: 'Layanan',
      path: `${base}/layanan`,
      children: [
        { label: 'Formulir Surat', path: `${base}/layanan/surat` },
        { label: 'Status Permohonan', path: `${base}/layanan/status` },
        { label: 'Info Persyaratan', path: `${base}/layanan/persyaratan` },
      ],
    },
    { label: 'Ekonomi', path: `${base}/ekonomi` },
    { label: 'Kontak', path: `${base}/kontak` },
  ]

  const isActive = (path) => {
    if (path === base) return location.pathname === base || location.pathname === `${base}/`
    return location.pathname.startsWith(path)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Singkatan untuk logo
  const logoText = villageName
    ? villageName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'ND'

  return (
    <nav className="navbar">
      <div className="navbar-inner container-lg">
        <Link to={base} className="navbar-brand">
          <div className="navbar-logo">{logoText}</div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">{villageName || 'NusaDesa'}</span>
            <span className="navbar-brand-sub">{village?.village_type || 'Desa Digital'}</span>
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
                  <Link to={`${base}/admin`} className="btn btn-sm btn-outline" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard size={14} />
                    Admin
                  </Link>
                )}
                {isSuperAdmin && (
                  <Link to="/superadmin" className="btn btn-sm btn-outline" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard size={14} />
                    Super Admin
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
                    <Link to={`${base}/profil/edit`} className="navbar-dropdown-link"
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
                <Link to={`${base}/login`} className="btn btn-sm btn-ghost" onClick={() => setMobileOpen(false)}>
                  Masuk
                </Link>
                <Link to={`${base}/signup`} className="btn btn-sm btn-primary" onClick={() => setMobileOpen(false)}>
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
