import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <HomePage />
      <Footer />
    </LanguageProvider>
  )
}

export default App
