import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ArchivePage from './pages/ArchivePage'
import ImpactPage from './pages/ImpactPage'
import MeetTheArtistPage from './pages/MeetTheArtistPage'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <main className="pt-24 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/artists" element={<MeetTheArtistPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </LanguageProvider>
  )
}

export default App
