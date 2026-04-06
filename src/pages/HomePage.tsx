import React from 'react'
import Button from '../components/ui/Button'
import MediaGrid from '../components/ui/MediaGrid'
import PremiumSundargaanText from '../components/ui/PremiumSundargaanText'
import { useLanguage } from '../context/LanguageContext'

const HomePage: React.FC = () => {
  const { t, language } = useLanguage()

  return (
    <main className="min-h-screen relative bg-[#FEFCFB]">
      {/* ——— Hero Section (Archive Split Layout) ——— */}
      <section className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden flex items-center pt-24 md:pt-32 pb-16 md:pb-24">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#F7EAE5] to-transparent z-0 opacity-40" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content Left */}
            <div className="max-w-xl">
              <div className="mb-6 overflow-hidden">
                <span className="inline-block text-[#CB460C] font-body text-[10px] md:text-xs uppercase tracking-[0.5em] animate-slide-in-left">
                  {language === 'EN' ? 'Cultural Heritage & Living Archives' : 'সাংস্কৃতিক ঐতিহ্য ও জীবন্ত সংরক্ষণাগার'}
                </span>
              </div>

              <div className="mb-4 sm:mb-8">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-[#1a1005] leading-[1.05] tracking-tight">
                  <PremiumSundargaanText
                    text={t('hero.title')}
                    duration={1}
                    stagger={0.04}
                  />
                </h1>
              </div>

              <div className="mb-10 space-y-4 opacity-0 animate-fade-in-up delay-400">
                <p className="text-[#6b5b4f] font-body text-lg md:text-xl leading-relaxed">
                  {t('hero.tagline1')}
                </p>
                <p className="text-[#6b5b4f]/70 font-body text-base md:text-lg">
                  {t('hero.tagline2')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 opacity-0 animate-fade-in-up delay-600">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-[#CB460C] hover:bg-[#E15012] border-none text-white px-8 sm:px-10 py-4 h-auto rounded-full shadow-[0_15px_30px_rgba(203,70,12,0.2)] transition-all hover:scale-105 active:scale-95 text-base sm:text-lg font-medium"
                >
                  {t('hero.btn.join')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-[#CB460C]/20 text-[#CB460C] hover:bg-[#CB460C]/5 px-8 sm:px-10 py-4 h-auto rounded-full transition-all text-base sm:text-lg font-medium"
                >
                  {t('hero.btn.more')}
                </Button>
              </div>
            </div>

            {/* Media Grid Right */}
            <div className="relative h-[500px] md:h-[600px] lg:h-[700px] opacity-0 animate-fade-in-up delay-300">
              <div className="absolute inset-0 bg-[#CB460C]/5 rounded-[48px] -rotate-3 blur-3xl scale-95" />
              <MediaGrid />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Living Archive */}
      <section id="archive" className="px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <div className="space-y-4 md:space-y-6 max-w-2xl">
              <h2 className="font-display font-normal text-4xl sm:text-5xl md:text-6xl text-[#1a1005] tracking-tight">
                {t('archive.title')}
              </h2>
              <p className="font-body text-[#6b5b4f] text-lg leading-relaxed">
                {t('archive.desc')}
              </p>
            </div>
            <Button variant="outline" className="h-14 px-10 w-full sm:w-auto">
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
          className="max-w-screen-2xl mx-auto bg-[#1a1005] rounded-[32px] md:rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
          style={{ minHeight: '600px' }}
        >
          {/* Artist Image/Visual */}
          <div className="lg:w-1/2 relative bg-[#CB460C]/10 flex items-center justify-center p-12 md:p-20">
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle, #CB460C 0%, transparent 70%)' }} />
            <div className="relative font-display text-[25vw] lg:text-[12vw] text-[#FEFCFB]/5 leading-none select-none">
              {t('artists.bg')}
            </div>
            <div className="absolute inset-20 border border-[#FEFCFB]/10 rounded-full animate-pulse" />
          </div>

          {/* Artist Content */}
          <div className="lg:w-1/2 p-10 md:p-16 lg:p-24 flex flex-col justify-center space-y-6 md:space-y-8">
            <h2 className="font-display font-normal text-4xl sm:text-5xl md:text-6xl text-[#FEFCFB] tracking-tight">
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
      <section id="impact" className="px-6 md:px-10 py-20 md:py-32">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-20">
          <div className="lg:w-1/3 text-center lg:text-left">
            <h2 className="font-display font-normal text-4xl text-[#1a1005] mb-6 md:mb-8 tracking-tight">
              {t('impact.title')}
            </h2>
            <div className="h-px w-20 bg-[#CB460C] mx-auto lg:mx-0" />
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-10">
            {[
              { val: t('impact.stat1.val'), label: t('impact.stat1.label') },
              { val: t('impact.stat2.val'), label: t('impact.stat2.label') },
              { val: t('impact.stat3.val'), label: t('impact.stat3.label') },
              { val: t('impact.stat4.val'), label: t('impact.stat4.label') },
            ].map((stat, i) => (
              <div key={i} className="space-y-2 md:space-y-4 text-center lg:text-left">
                <span className="block font-display font-normal text-4xl sm:text-5xl md:text-6xl text-[#CB460C]">
                  {stat.val}
                </span>
                <span className="block font-body text-[10px] md:text-xs uppercase tracking-widest text-[#a89080]">
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
