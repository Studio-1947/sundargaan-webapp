import React from 'react'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { useLanguage } from '../../context/LanguageContext'

const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const IconFacebook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const IconYouTube = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.42 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.489h2.039L6.486 3.24H4.298l13.311 17.402z"/>
  </svg>
);

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
              {[
                { name: 'Instagram', icon: <IconInstagram />, href: '#' },
                { name: 'Facebook', icon: <IconFacebook />, href: '#' },
                { name: 'YouTube', icon: <IconYouTube />, href: '#' },
                { name: 'X', icon: <IconX />, href: '#' },
              ].map((social) => (
                <a 
                  key={social.name} 
                  href={social.href}
                  className="w-12 h-12 rounded-full border border-[#e5d5cd] flex items-center justify-center text-[#6b5b4f] hover:bg-[#CB460C] hover:text-white hover:border-[#CB460C] transition-all duration-300 bg-white/50"
                  aria-label={social.name}
                >
                  {social.icon}
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
            <Button 
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[10px] uppercase tracking-widest border-[#CB460C]/20 hover:border-[#CB460C]"
            >
              {t('footer.top')} ↑
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
