import React from 'react'
import Logo from '../ui/Logo'
import { useLanguage } from '../../context/LanguageContext'

const Footer: React.FC = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: t('footer.nav'),
      links: [
        { label: t('nav.about'), href: '/about' },
        { label: t('nav.archive'), href: '#archive' },
        { label: t('nav.artists'), href: '#artists' },
        { label: t('nav.impact'), href: '/impact' },
      ],
    },
    {
      title: t('footer.community'),
      links: [
        { label: t('footer.join'), href: '#join' },
        { label: t('footer.support'), href: '#support' },
        { label: t('footer.newsletter'), href: '#newsletter' },
        { label: t('footer.events'), href: '#events' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.privacy'), href: '#privacy' },
        { label: t('footer.terms'), href: '#terms' },
        { label: t('footer.cookies'), href: '#cookies' },
      ],
    },
  ]

  return (
    <footer className="bg-[#F7EAE5] border-t border-[#e5d5cd] pt-12 pb-10 md:pt-20 mt-12">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12 md:mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Logo variant="color" height={56} />
            <p className="font-body text-[#6b5b4f] max-w-sm leading-relaxed">
              {t('footer.brand')}
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'YouTube'].map((social) => (
                <a 
                  key={social} 
                  href={`#${social.toLowerCase()}`}
                  className="w-12 h-12 rounded-full border border-[#e5d5cd] flex items-center justify-center text-[#6b5b4f] hover:bg-[#CB460C] hover:text-white hover:border-[#CB460C] transition-all duration-300 bg-white/50"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-current" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="font-body font-normal text-[#1a1005] uppercase tracking-[0.2em] text-[10px]">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="font-body text-[#6b5b4f] hover:text-[#CB460C] transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#e5d5cd] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-body text-xs text-[#a89080]">
            © {currentYear} Sundargaan. {t('footer.rights')}
          </p>
          <div className="flex gap-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-body text-xs font-semibold uppercase tracking-widest text-[#CB460C] hover:opacity-70 transition-opacity"
            >
              {t('footer.top')} ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
