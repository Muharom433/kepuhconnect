import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Profil from './pages/Profil'
import Berita from './pages/Berita'
import BeritaDetail from './pages/BeritaDetail'
import Ekonomi from './pages/Ekonomi'
import Kontak from './pages/Kontak'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layanan from './pages/Layanan'
import FormulirSurat from './pages/FormulirSurat'
import StatusPermohonan from './pages/StatusPermohonan'
import Persyaratan from './pages/Persyaratan'
import AdminDashboard from './pages/admin/Dashboard'
import AdminData from './pages/admin/ManajemenData'
import AdminPersuratan from './pages/admin/Persuratan'
import AdminUmkm from './pages/admin/UmkmManage'
import AdminBeranda from './pages/admin/BerandaManage'
import AdminUsers from './pages/admin/UsersManage'
import AdminPenduduk from './pages/admin/PendudukManage'
import EditProfile from './pages/EditProfile'

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
      {/* Public Pages */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:slug" element={<BeritaDetail />} />
        <Route path="/ekonomi" element={<Ekonomi />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Verified User Pages */}
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/layanan/surat" element={<FormulirSurat />} />
        <Route path="/layanan/status" element={<StatusPermohonan />} />
        <Route path="/layanan/persyaratan" element={<Persyaratan />} />
        <Route path="/profil/edit" element={<EditProfile />} />
      </Route>
      {/* Admin Pages */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="data" element={<AdminData />} />
        <Route path="persuratan" element={<AdminPersuratan />} />
        <Route path="umkm" element={<AdminUmkm />} />
        <Route path="beranda" element={<AdminBeranda />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="penduduk" element={<AdminPenduduk />} />
      </Route>
    </Routes>
  )
}
