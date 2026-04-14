import { Outlet } from 'react-router-dom'
import { VillageProvider } from '../contexts/VillageContext'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <VillageProvider>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </VillageProvider>
  )
}
