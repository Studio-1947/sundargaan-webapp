import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import LanguageToggle from '../ui/LanguageToggle'
import { useLanguage } from '../../context/LanguageContext'

import { Link, useLocation } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, language } = useLanguage()
  const location = useLocation()

  const navLinks = [
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.archive'), href: '/archive' },
    { label: t('nav.artists'), href: '/artists' },
    { label: t('nav.impact'), href: '/impact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      <header
        style={{
          borderBottom: isMenuOpen ? 'none' : (scrolled ? '1px solid #e5d5cd' : '1px solid #ede0da'),
          backgroundColor: isMenuOpen ? 'transparent' : (scrolled ? 'rgba(254,252,251,0.92)' : '#FEFCFB'),
          backdropFilter: isMenuOpen ? 'none' : (scrolled ? 'blur(12px)' : 'none'),
          WebkitBackdropFilter: isMenuOpen ? 'none' : (scrolled ? 'blur(12px)' : 'none'),
          boxShadow: isMenuOpen ? 'none' : (scrolled ? '0 2px 20px rgba(203,70,12,0.06)' : 'none'),
        }}
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isMenuOpen ? 'z-[110]' : 'z-50'}`}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-24 md:h-32 flex items-center pt-8 md:pt-12 pb-2 md:pb-4 justify-between relative z-50">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center" aria-label="Sundargaan Home">
            <Logo variant="color" className="h-14 md:h-18 lg:h-20" />
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`font-body text-base font-medium tracking-wide transition-colors duration-200 whitespace-nowrap ${location.pathname === link.href ? 'text-brand-primary' : ''
                  }`}
                style={{ color: location.pathname === link.href ? '#CB460C' : '#4a3b33' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#CB460C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = location.pathname === link.href ? '#CB460C' : '#4a3b33')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            <Button variant="primary" size="lg" className="!hidden md:!inline-flex px-6 lg:px-10">
              {t('Support Us')}
            </Button>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden flex flex-col gap-1.5 p-3 rounded-full transition-all duration-300 relative z-[110] overflow-hidden ${isMenuOpen ? 'bg-[#FEFCFB] border border-[#CB460C]/30 shadow-md' : 'hover:bg-[#F7EAE5]'
                }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <motion.span
                className="block w-6 h-0.5 rounded"
                style={{ backgroundColor: '#CB460C' }}
                animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="block w-6 h-0.5 rounded"
                style={{ backgroundColor: '#CB460C' }}
                animate={isMenuOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
              />
              <motion.span
                className="block w-4 h-0.5 rounded"
                style={{ backgroundColor: '#CB460C' }}
                animate={isMenuOpen ? { rotate: -45, y: -7, width: '24px' } : { rotate: 0, y: 0, width: '16px' }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Outside Header */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#FEFCFB] z-[100] md:hidden flex flex-col pt-32 px-10 h-screen w-screen overflow-y-auto"
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <nav className="flex flex-col gap-6 mb-12 relative z-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-4xl font-normal text-[#1a1005] hover:text-brand-primary transition-colors py-2 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto pb-12 space-y-8 relative z-10">
              <div className="flex flex-col gap-3">
                <span className="text-[#a89080] font-body text-[10px] uppercase tracking-[0.3em] font-bold">{language === 'BN' ? 'ভাষা' : 'Language'}</span>
                <LanguageToggle />
              </div>

              <Button variant="primary" size="lg" className="w-full text-xl h-16 rounded-2xl shadow-lg shadow-brand-primary/10" onClick={() => setIsMenuOpen(false)}>
                {t('nav.join')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
