import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ArchivePage from './pages/ArchivePage'
import ImpactPage from './pages/ImpactPage'
import MeetTheArtistPage from './pages/MeetTheArtistPage'
import AboutPage from './pages/AboutPage'
import AdminUploadsPage from './pages/AdminUploadsPage'
import { LanguageProvider } from './context/LanguageContext'

function SiteLayout() {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-28 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/artists" element={<MeetTheArtistPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function AppRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin-uploads')

  if (isAdmin) return <AdminUploadsPage />
  return <SiteLayout />
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LanguageProvider>
  )
}

export default App
