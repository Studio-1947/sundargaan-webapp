import React, { useState, useEffect } from 'react'
import Logo from '../ui/Logo'
import Button from '../ui/Button'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Archive', href: '#archive' },
  { label: 'Meet the artists', href: '#artists' },
  { label: 'Impact', href: '#impact' },
]

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        borderBottom: scrolled ? '1px solid #e5d5cd' : '1px solid #ede0da',
        backgroundColor: scrolled ? 'rgba(254,252,251,0.92)' : '#FEFCFB',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(203,70,12,0.06)' : 'none',
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-24 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex items-center" aria-label="Sundargaan Home">
          <Logo variant="color" height={64} />
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-base font-medium tracking-wide transition-colors duration-200"
              style={{ color: '#4a3b33' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#CB460C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#4a3b33')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-10">
          <Button variant="primary" size="lg" className="px-10">
            Join
          </Button>

          {/* Language Toggle */}
          <div
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-full transition-colors duration-200"
              style={{ backgroundColor: '#D9D9D9' }}
            />
            <span className="font-body text-base font-medium" style={{ color: '#4a3b33' }}>
              BE
            </span>
          </div>

          {/* Mobile hamburger (placeholder) */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5 rounded"
            aria-label="Open menu"
            style={{ color: '#CB460C' }}
          >
            <span className="block w-5 h-0.5 rounded" style={{ backgroundColor: '#CB460C' }} />
            <span className="block w-5 h-0.5 rounded" style={{ backgroundColor: '#CB460C' }} />
            <span className="block w-3 h-0.5 rounded" style={{ backgroundColor: '#CB460C' }} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
