import React from 'react'
import Button from '../components/ui/Button'
import MediaGrid from '../components/ui/MediaGrid'
import PremiumSundargaanText from '../components/ui/PremiumSundargaanText'
import { useLanguage } from '../context/LanguageContext'

const HomePage: React.FC = () => {
  const { t, language } = useLanguage()

  return (
    <main className="min-h-screen relative" style={{ backgroundColor: '#FEFCFB', paddingTop: '96px' }}>
      {/* ——— Hero Section (Centered Card) ——— */}
      <section className="px-6 md:px-10 py-6 md:py-10">
        <div
          className="relative flex flex-col md:flex-row overflow-hidden border border-[#e5d5cd] shadow-[0_24px_80px_rgba(203,70,12,0.08)] bg-white mx-auto max-w-screen-2xl"
          style={{
            minHeight: 'calc(100vh - 176px)',
            borderRadius: '48px'
          }}
        >
          {/* ── Left Panel: Content ── */}
          <div
            className="flex flex-col justify-center px-10 md:px-16 lg:px-24 py-24 w-full md:w-1/2"
          >
            {/* Headline */}
            <PremiumSundargaanText 
              text={t('hero.title')}
              className="font-body"
              style={{
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                fontWeight: 400,
                lineHeight: 1,
                color: '#1a1005',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            />

            {/* Body copy */}
            <div className="space-y-1 mb-12">
              <p
                className="font-body animate-fade-in-up delay-200"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: '#6b5b4f',
                  letterSpacing: '-0.01em',
                }}
              >
                {t('hero.tagline1')}
              </p>
              <p
                className="font-body animate-fade-in-up delay-300"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: '#6b5b4f',
                  letterSpacing: '-0.01em',
                }}
              >
                {t('hero.tagline2')}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4 animate-fade-in-up delay-400">
              <Button variant="primary" size="lg" className="px-10">
                {t('hero.btn.join')}
              </Button>
              <Button variant="outline" size="lg" className="px-10">
                {t('hero.btn.more')}
              </Button>
            </div>
          </div>

          {/* ── Center Divider ── */}
          <div
            className="hidden md:block absolute top-0 bottom-0 w-px"
            style={{
              left: '50%',
              background: 'linear-gradient(to bottom, transparent 0%, #CB460C 20%, #CB460C 80%, transparent 100%)',
              opacity: 0.35,
            }}
          />

          {/* ── Right Panel: Media Grid ── */}
          <div
            className="flex w-full md:flex-1 animate-fade-in delay-200 overflow-hidden"
            style={{ 
              backgroundColor: '#F7EAE5',
              minHeight: '400px'
            }}
          >
            <MediaGrid />
          </div>
        </div>
      </section>

      {/* ——— Section 2: The Living Archive ——— */}
      <section id="archive" className="px-6 md:px-10 py-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-display font-normal text-5xl md:text-6xl text-[#1a1005] tracking-tight">
                {t('archive.title')}
              </h2>
              <p className="font-body text-[#6b5b4f] text-lg leading-relaxed">
                {t('archive.desc')}
              </p>
            </div>
            <Button variant="outline" className="h-14 px-10">
              {t('archive.btn.explore')}
            </Button>
          </div>

          {/* Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t('archive.item1'), category: t('archive.cat1') },
              { title: t('archive.item2'), category: t('archive.cat2') },
              { title: t('archive.item3'), category: t('archive.cat3') },
            ].map((item, i) => (
              <div 
                key={i} 
                className="group relative bg-[#F7EAE5] rounded-[32px] overflow-hidden aspect-[4/5] cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1005]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-white/80 font-body text-xs uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {item.category}
                  </span>
                  <h3 className="text-white font-display font-normal text-3xl opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                    {item.title}
                  </h3>
                </div>
                {/* Placeholder visual */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#CB460C]/20 font-display text-8xl">
                  {language === 'EN' ? i + 1 : (i + 1).toLocaleString('bn-BD')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Section 3: Meet the Artists (Asymmetric Card) ——— */}
      <section id="artists" className="px-6 md:px-10 py-20">
        <div 
          className="max-w-screen-2xl mx-auto bg-[#1a1005] rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
          style={{ minHeight: '600px' }}
        >
          {/* Artist Image/Visual */}
          <div className="lg:w-1/2 relative bg-[#CB460C]/10 flex items-center justify-center p-20">
             <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle, #CB460C 0%, transparent 70%)' }} />
             <div className="relative font-display text-[12vw] text-[#FEFCFB]/5 leading-none select-none">
                {t('artists.bg')}
             </div>
             <div className="absolute inset-20 border border-[#FEFCFB]/10 rounded-full animate-pulse" />
          </div>

          {/* Artist Content */}
          <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center space-y-8">
            <h2 className="font-display font-normal text-5xl md:text-6xl text-[#FEFCFB] tracking-tight">
              {t('artists.title')}
            </h2>
            <p className="font-body text-[#a89080] text-lg leading-relaxed max-w-xl">
              {t('artists.desc')}
            </p>
            <div className="pt-6">
              <Button variant="primary" size="lg" className="px-12 bg-[#CB460C] !border-[#CB460C]">
                {t('artists.btn')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Section 4: Our Impact (Editorial Layout) ——— */}
      <section id="impact" className="px-6 md:px-10 py-32">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="font-display font-normal text-4xl text-[#1a1005] mb-8 tracking-tight">
              {t('impact.title')}
            </h2>
            <div className="h-px w-20 bg-[#CB460C] mx-auto md:mx-0" />
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-10">
            {[
              { val: t('impact.stat1.val'), label: t('impact.stat1.label') },
              { val: t('impact.stat2.val'), label: t('impact.stat2.label') },
              { val: t('impact.stat3.val'), label: t('impact.stat3.label') },
              { val: t('impact.stat4.val'), label: t('impact.stat4.label') },
            ].map((stat, i) => (
              <div key={i} className="space-y-4">
                <span className="block font-display font-normal text-6xl text-[#CB460C]">
                  {stat.val}
                </span>
                <span className="block font-body text-sm uppercase tracking-widest text-[#a89080]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Scroll indicator ——— */}
      <div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500"
        aria-hidden="true"
      >
        <span className="font-body text-xs tracking-widest uppercase" style={{ color: '#a89080' }}>
          {t('hero.scroll')}
        </span>
        <div
          className="w-px h-10"
          style={{
            background: 'linear-gradient(to bottom, #CB460C, transparent)',
            opacity: 0.5,
          }}
        />
      </div>
    </main>
  )
}

export default HomePage
