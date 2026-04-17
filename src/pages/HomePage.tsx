import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import MediaGrid from '../components/ui/MediaGrid'
import VideoModal from '../components/ui/VideoModal'
import PremiumSundargaanText from '../components/ui/PremiumSundargaanText'
import { useLanguage } from '../context/LanguageContext'
import ArtistCarousel from '../components/ui/ArtistCarousel'

// Import Artist Images
import bishnupadaImg from '../assets/stories/bisnu_pada_sarkar.jpg'
import savitaImg from '../assets/stories/sabita_badya.jpeg'
import atiyarImg from '../assets/stories/Artist 06 - Atiyar Gazi.jpg'

const HomePage: React.FC = () => {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  return (
    <main className="min-h-screen relative bg-[#FEFCFB]">
      {/* ——— Hero Section (Archive Split Layout) ——— */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] w-full overflow-hidden flex items-center pt-16 md:pt-24 pb-16 md:pb-24">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#F7EAE5] to-transparent z-0 opacity-40" />

        <div className="w-full max-w-screen-xl mx-auto px-6 md:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            {/* Content Left */}
            <div className="max-w-4xl">
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

              <div className="mb-8 space-y-4 opacity-0 animate-fade-in-up delay-400">
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
                  {t('Support Us')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-[#CB460C]/20 text-[#CB460C] hover:bg-[#CB460C]/5 px-8 sm:px-10 py-4 h-auto rounded-full transition-all text-base sm:text-lg font-medium"
                  onClick={() => navigate('/about')}
                >
                  {t('hero.btn.more')}
                </Button>
              </div>
            </div>

            {/* Media Grid Right */}
            <div className="relative h-auto animate-in fade-in duration-1000 delay-300 fill-mode-forwards">
              <div className="absolute inset-0 bg-[#CB460C]/5 rounded-[48px] -rotate-3 blur-3xl scale-95" />
              <MediaGrid onVideoClick={(src) => setSelectedVideo(src)} />
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
            {/* <Button variant="outline" className="h-14 px-10 w-full sm:w-auto">
              {t('archive.btn.explore')}
            </Button> */}
          </div>

          {/* Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t('archive.item1'), category: t('archive.cat1'), image: bishnupadaImg },
              { title: t('archive.item2'), category: t('archive.cat2'), image: savitaImg },
              { title: t('archive.item3'), category: t('archive.cat3'), image: atiyarImg },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-[#F7EAE5] rounded-[32px] overflow-hidden aspect-[4/5] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Background Image */}
                <img 
                  src={item.image} 
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1005]/90 via-[#1a1005]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#FEFCFB]/10 backdrop-blur-md border border-white/20 h-7 px-4 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] uppercase tracking-widest font-medium leading-none pt-[1px]">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-white font-display font-normal text-3xl md:text-4xl">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Section 3: Meet the Artists (Integrated Carousel) ——— */}
      <section id="artists" className="px-6 md:px-10 py-20">
        <div
          className="max-w-screen-2xl mx-auto bg-[#1a1005] rounded-[32px] md:rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
          style={{ minHeight: '650px' }}
        >
          {/* Left: Integrated Artist Carousel */}
          <div className="h-[400px] lg:h-auto lg:w-1/2 relative bg-[#CB460C]/5 flex items-center justify-center overflow-hidden">
            {/* Background Decorative Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <span className="font-display text-[25vw] lg:text-[12vw] text-[#FEFCFB]/5 leading-none select-none">
                {t('artists.bg')}
              </span>
            </div>
            
            {/* The Carousel */}
            <div className="absolute inset-0 z-10">
              <ArtistCarousel />
            </div>

            {/* Pulsing circle decoration (under carousel but over bg text) */}
            <div className="absolute inset-20 border border-[#FEFCFB]/5 rounded-full animate-pulse pointer-events-none" />
          </div>

          {/* Right: Artist Content */}
          <div className="lg:w-1/2 p-10 md:p-16 lg:p-24 flex flex-col justify-center space-y-6 md:space-y-8 bg-gradient-to-br from-[#1a1005] to-[#2a1a0a]">
            <h2 className="font-display font-normal text-4xl sm:text-5xl md:text-6xl text-[#FEFCFB] tracking-tight">
              {t('artists.title')}
            </h2>
            <p className="font-body text-[#a89080] text-lg leading-relaxed max-w-xl">
              {t('artists.desc')}
            </p>
            <div className="pt-6">
              <Button
                variant="primary"
                size="lg"
                className="px-12 bg-[#CB460C] !border-[#CB460C] hover:scale-105 transition-transform"
                onClick={() => navigate('/artists')}
              >
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
      {/* <div
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
      </div> */}
      {/* Global Video Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoSrc={selectedVideo || ''}
      />
    </main>
  )
}

export default HomePage
