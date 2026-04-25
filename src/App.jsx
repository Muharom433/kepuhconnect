import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import Layout from './components/Layout'
import PlatformLayout from './components/PlatformLayout'
import AdminLayout from './components/AdminLayout'
import SuperAdminLayout from './components/SuperAdminLayout'

// Platform pages
import LandingPage from './pages/platform/LandingPage'
import AboutPage from './pages/platform/AboutPage'
import TermsConditions from './pages/platform/TermsConditions'
import RegisterVillage from './pages/platform/RegisterVillage'

// Super Admin pages
import SuperDashboard from './pages/superadmin/SuperDashboard'
import VillageManage from './pages/superadmin/VillageManage'
import AllUsersManage from './pages/superadmin/AllUsersManage'

// Village public pages
import Home from './pages/Home'
import Profil from './pages/Profil'
import Berita from './pages/Berita'
import BeritaDetail from './pages/BeritaDetail'
import Ekonomi from './pages/Ekonomi'
import Wisata from './pages/Wisata'
import Kontak from './pages/Kontak'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layanan from './pages/Layanan'
import FormulirSurat from './pages/FormulirSurat'
import StatusPermohonan from './pages/StatusPermohonan'
import Persyaratan from './pages/Persyaratan'
import EditProfile from './pages/EditProfile'

// Village admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminData from './pages/admin/ManajemenData'
import AdminPersuratan from './pages/admin/Persuratan'
import AdminUmkm from './pages/admin/UmkmManage'
import AdminKost from './pages/admin/KostManage'
import AdminWisata from './pages/admin/WisataManage'
import AdminBeranda from './pages/admin/BerandaManage'
import AdminBerita from './pages/admin/BeritaManage'
import AdminUsers from './pages/admin/UsersManage'
import AdminPenduduk from './pages/admin/PendudukManage'

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-secondary)' }}>Memuat...</p>
    </div>
  )
}

export default function App() {
  const { loading } = useAuth()

  if (loading) return <LoadingScreen />

  return (
    <Routes>
      {/* ══════ Platform Pages (NusaDesa root) ══════ */}
      <Route element={<PlatformLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/syarat-ketentuan" element={<TermsConditions />} />
        <Route path="/daftar-desa" element={<RegisterVillage />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ══════ Super Admin Panel ══════ */}
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperDashboard />} />
        <Route path="villages" element={<VillageManage />} />
        <Route path="users" element={<AllUsersManage />} />
      </Route>

      {/* ══════ Village Public Pages (/:villageSlug/*) ══════ */}
      <Route path="/:villageSlug" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profil" element={<Profil />} />
        <Route path="berita" element={<Berita />} />
        <Route path="berita/:slug" element={<BeritaDetail />} />
        <Route path="ekonomi" element={<Ekonomi />} />
        <Route path="wisata" element={<Wisata />} />
        <Route path="kontak" element={<Kontak />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        {/* Verified User Pages */}
        <Route path="layanan" element={<Layanan />} />
        <Route path="layanan/surat" element={<FormulirSurat />} />
        <Route path="layanan/status" element={<StatusPermohonan />} />
        <Route path="layanan/persyaratan" element={<Persyaratan />} />
        <Route path="profil/edit" element={<EditProfile />} />
      </Route>

      {/* ══════ Village Admin Panel (/:villageSlug/admin/*) ══════ */}
      <Route path="/:villageSlug/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="data" element={<AdminData />} />
        <Route path="persuratan" element={<AdminPersuratan />} />
        <Route path="umkm" element={<AdminUmkm />} />
        <Route path="kost" element={<AdminKost />} />
        <Route path="wisata" element={<AdminWisata />} />
        <Route path="beranda" element={<AdminBeranda />} />
        <Route path="berita" element={<AdminBerita />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="penduduk" element={<AdminPenduduk />} />
      </Route>
    </Routes>
  )
}
