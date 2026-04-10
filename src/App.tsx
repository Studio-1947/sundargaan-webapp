import { useState } from 'react'
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
import { clearAdminToken, getAdminToken, setAdminToken } from './lib/adminAuth'

function AdminGate() {
  const [tokenInput, setTokenInputValue] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(Boolean(getAdminToken()))

  if (isUnlocked) return <AdminUploadsPage />

  return (
    <main className="min-h-screen bg-[#F7EAE5] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[2rem] bg-white border border-[#e5d5cd] shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-[#1a1005]">Admin Access</h1>
        <p className="mt-2 text-sm text-[#6b5b4f]">
          Enter the admin API token to unlock uploads and content editing.
        </p>
        <input
          type="password"
          value={tokenInput}
          onChange={(e) => setTokenInputValue(e.target.value)}
          className="mt-6 w-full rounded-xl border border-[#e5d5cd] px-4 py-3 outline-none focus:border-[#CB460C]"
          placeholder="Admin API token"
        />
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              const token = tokenInput.trim()
              setAdminToken(token)
              setIsUnlocked(Boolean(token))
            }}
            className="flex-1 rounded-xl bg-[#CB460C] px-4 py-3 text-sm font-semibold text-white"
          >
            Unlock
          </button>
          <button
            onClick={() => {
              clearAdminToken()
              setTokenInputValue('')
              setIsUnlocked(false)
            }}
            className="rounded-xl border border-[#e5d5cd] px-4 py-3 text-sm font-semibold text-[#6b5b4f]"
          >
            Clear
          </button>
        </div>
      </div>
    </main>
  )
}

function SiteLayout() {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen">
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

  if (isAdmin) return <AdminGate />
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
