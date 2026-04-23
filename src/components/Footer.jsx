import { Link } from 'react-router-dom'
import { useVillage } from '../contexts/VillageContext'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  const { villageSlug, villageName, village } = useVillage()
  const base = `/${villageSlug}`

  // Singkatan untuk logo
  const logoText = villageName
    ? villageName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'ND'

  return (
    <footer className="footer">
      <div className="container-lg">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="flex gap-sm" style={{ marginBottom: '1rem' }}>
              <img src="/img/logo nusadesa.png" alt="Logo NusaDesa" style={{ height: 48, objectFit: 'contain', borderRadius: '8px' }} />
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>{villageName || 'NusaDesa'}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{village?.village_type || 'Konektivitas Desa Nusantara'}</p>
              </div>
            </div>
            <p className="footer-desc">
              {village?.full_address
                ? `Website resmi ${villageName}. ${village.full_address}.`
                : 'Transformasi digital untuk pelayanan masyarakat yang lebih baik.'
              }
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Navigasi</h4>
            <ul>
              <li><Link to={base}>Beranda</Link></li>
              <li><Link to={`${base}/profil`}>Profil Desa</Link></li>
              <li><Link to={`${base}/berita`}>Berita</Link></li>
              <li><Link to={`${base}/ekonomi`}>Ekonomi</Link></li>
              <li><Link to={`${base}/kontak`}>Kontak</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Layanan</h4>
            <ul>
              <li><Link to={`${base}/layanan/surat`}>Formulir Surat</Link></li>
              <li><Link to={`${base}/layanan/status`}>Status Permohonan</Link></li>
              <li><Link to={`${base}/layanan/persyaratan`}>Info Persyaratan</Link></li>
              <li><Link to={`${base}/ekonomi`}>Katalog UMKM</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-title">Platform</h4>
            <ul>
              <li><Link to="/">Tentang NusaDesa</Link></li>
              <li><Link to="/syarat-ketentuan">Syarat & Ketentuan</Link></li>
              <li><Link to="/daftar-desa">Daftarkan Desa</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NusaDesa — {villageName || 'Konektivitas Desa Nusantara Terintegrasi'}. All rights reserved.</p>
          <p className="footer-credit">
            Dibuat dengan ❤️ untuk kemajuan desa
          </p>
        </div>
      </div>
    </footer>
  )
}
