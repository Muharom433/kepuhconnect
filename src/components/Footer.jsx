import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-lg">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="flex gap-sm" style={{ marginBottom: '1rem' }}>
              <div className="navbar-logo" style={{ width: 44, height: 44 }}>KC</div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>KepuhConnect</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Padukuhan Kepuh</p>
              </div>
            </div>
            <p className="footer-desc">
              Transformasi digital untuk pelayanan masyarakat yang lebih baik.
              Website resmi Padukuhan Kepuh, Desa Pacarejo, Kapanewon Semanu, Gunung Kidul.
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Navigasi</h4>
            <ul>
              <li><Link to="/">Beranda</Link></li>
              <li><Link to="/profil">Profil Desa</Link></li>
              <li><Link to="/berita">Berita</Link></li>
              <li><Link to="/ekonomi">Ekonomi</Link></li>
              <li><Link to="/kontak">Kontak</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Layanan</h4>
            <ul>
              <li><Link to="/layanan/surat">Formulir Surat</Link></li>
              <li><Link to="/layanan/status">Status Permohonan</Link></li>
              <li><Link to="/layanan/persyaratan">Info Persyaratan</Link></li>
              <li><Link to="/ekonomi">Katalog UMKM</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Kontak</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={16} />
                <span>Padukuhan Kepuh, Desa Pacarejo, Kapanewon Semanu, Gunung Kidul, D.I. Yogyakarta</span>
              </li>
              <li>
                <Phone size={16} />
                <span>(0231) 123456</span>
              </li>
              <li>
                <Mail size={16} />
                <span>info@desakepuh.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} KepuhConnect — Website Padukuhan Kepuh. All rights reserved.</p>
          <p className="footer-credit">
            Dibuat dengan ❤️ untuk kemajuan desa
          </p>
        </div>
      </div>
    </footer>
  )
}
