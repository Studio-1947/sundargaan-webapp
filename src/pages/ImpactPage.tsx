import React, { useRef, useState, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import PremiumSundargaanText from '../components/ui/PremiumSundargaanText'
import Button from '../components/ui/Button'
import groupPhoto from '../assets/impact_page-.jpeg'

// ——— Icons ———
const IconHeart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const IconYoutube = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const IconSpotify = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.378 0 0 5.378 0 12c0 6.627 5.378 12 12 12 6.627 0 12-5.373 12-12 0-6.622-5.373-12-12-12zm5.502 17.31c-.215.352-.674.463-1.025.248-2.85-1.742-6.438-2.136-10.666-1.17-.4.092-.796-.157-.887-.557-.092-.4.157-.796.557-.887 4.629-1.059 8.59-.61 11.77 1.336.353.215.464.673.25 1.025zm1.47-3.258c-.27.44-.848.58-1.288.31-3.262-2.003-8.23-2.585-12.087-1.415-.497.15-1.022-.13-1.173-.627-.152-.497.13-1.022.627-1.173 4.407-1.337 9.887-.69 13.623 1.605.439.27.579.848.309 1.288l-.01.012zm.126-3.39c-3.913-2.325-10.366-2.538-14.137-1.393-.601.183-1.238-.166-1.42-.767-.183-.601.166-1.238.767-1.42 4.316-1.31 11.438-1.066 15.955 1.618.54.32.714 1.018.393 1.558-.321.54-1.019.714-1.558.404z" />
  </svg>
)

const IconFestival = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 19h19" /><path d="M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" /><path d="M9 19v-4a3 3 0 0 1 6 0v4" />
  </svg>
)

const ImpactPage: React.FC = () => {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Refs for nodes
  const sourceRefs = useRef<(HTMLDivElement | null)[]>([])
  const hubRef = useRef<HTMLDivElement>(null)
  const outputRefs = useRef<(HTMLDivElement | null)[]>([])

  const [paths, setPaths] = useState<{
    sources: string[];
    outputs: string[];
  }>({ sources: [], outputs: [] })

  const calculatePaths = () => {
    if (!containerRef.current || !hubRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    
    const getPoint = (el: HTMLElement | null) => {
      if (!el) return { x: 0, y: 0 }
      const rect = el.getBoundingClientRect()
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
      }
    }

    const hubCenter = getPoint(hubRef.current)

    // Calculate source to hub
    const newSourcePaths = sourceRefs.current.map(ref => {
      if (!ref) return ''
      const center = getPoint(ref)
      const cp1x = center.x + (hubCenter.x - center.x) * 0.6
      return `M ${center.x} ${center.y} C ${cp1x} ${center.y} ${cp1x} ${hubCenter.y} ${hubCenter.x} ${hubCenter.y}`
    })

    // Calculate hub to output
    const newOutputPaths = outputRefs.current.map(ref => {
      if (!ref) return ''
      const center = getPoint(ref)
      const cp1x = hubCenter.x + (center.x - hubCenter.x) * 0.4
      return `M ${hubCenter.x} ${hubCenter.y} C ${cp1x} ${hubCenter.y} ${cp1x} ${center.y} ${center.x} ${center.y}`
    })

    setPaths({ sources: newSourcePaths, outputs: newOutputPaths })
  }

  useLayoutEffect(() => {
    calculatePaths()
    
    const timers = [
      setTimeout(calculatePaths, 100),
      setTimeout(calculatePaths, 500),
      setTimeout(calculatePaths, 1500),
      setTimeout(calculatePaths, 3000)
    ]
    
    const observer = new ResizeObserver(calculatePaths)
    if (containerRef.current) observer.observe(containerRef.current)
    
    window.addEventListener('resize', calculatePaths)
    window.addEventListener('scroll', calculatePaths, { passive: true })
    
    return () => {
      timers.forEach(t => clearTimeout(t))
      observer.disconnect()
      window.removeEventListener('resize', calculatePaths)
      window.removeEventListener('scroll', calculatePaths)
    }
  }, [])

  return (
    <div className="bg-[#FEFCFB] min-h-screen">
      {/* ——— Hero Section ——— */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-screen-xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <PremiumSundargaanText
              text={t('impact.page.hero.title')}
              className="justify-center mb-6"
              style={{
                fontSize: 'clamp(1.75rem, 8vw, 4.5rem)',
                fontWeight: 400,
                color: '#1a1005',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-body text-xl md:text-2xl text-[#6b5b4f] max-w-2xl mx-auto leading-relaxed"
          >
            {t('impact.page.hero.desc')}
          </motion.p>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none bg-[var(--bg-radial-hero)]" />
      </section>

      {/* ——— The Interactive Flow Story ——— */}
      <section className="py-16 md:py-24 px-6 relative bg-[#F7EAE5]/20 overflow-hidden">
        <div className="max-w-screen-xl mx-auto relative h-full">
          
          <div className="text-center mb-24 md:mb-48">
            <h2 className="font-display text-4xl md:text-6xl text-[#1a1005] mb-6">
              {t('impact.page.flow.title')}
            </h2>
            <p className="font-body text-lg md:text-xl text-[#6b5b4f] max-w-2xl mx-auto leading-relaxed">
              {t('impact.page.flow.desc')}
            </p>
          </div>

          <div ref={containerRef} className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-start pb-16 lg:pb-64">
            
            {/* Column 1: Sources */}
            <div className="space-y-10 lg:space-y-16 lg:pt-12 relative z-20">
              <h3 className="font-display text-xl md:text-2xl text-[#1a1005]/40 uppercase tracking-widest text-center lg:text-left mb-8">Revenue Sources</h3>
              {[
                { id: 'contribution', label: t('impact.flow.source.contribution'), color: 'bg-[#CB460C]', Icon: IconHeart },
                { id: 'youtube', label: t('impact.flow.source.youtube'), color: 'bg-[#FF0000]', Icon: IconYoutube },
                { id: 'spotify', label: t('impact.flow.source.spotify'), color: 'bg-[#1DB954]', Icon: IconSpotify },
                { id: 'festival', label: t('impact.flow.source.festival'), color: 'bg-[#1a1005]', Icon: IconFestival },
              ].map((src, i) => (
                <motion.div
                  key={src.id}
                  ref={el => { sourceRefs.current[i] = el }}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 md:gap-6 group"
                >
                  <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full ${src.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 text-white`}>
                    <src.Icon />
                  </div>
                  <span className="font-display text-xl text-[#1a1005] drop-shadow-sm">{src.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Column 2: Center Hub */}
            <div className="flex flex-col items-center justify-center pt-0 lg:pt-72 relative z-30">
              <motion.div
                ref={hubRef}
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', damping: 12, delay: 0.5 }}
                className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#1a1005] flex items-center justify-center text-center p-6 md:p-8 shadow-[0_0_100px_rgba(203,70,12,0.15)] outline outline-1 outline-white/5"
              >
                <div className="relative z-10 transition-transform hover:scale-110 duration-500">
                  <span className="font-display text-white text-3xl leading-tight select-none">
                    {t('impact.flow.hub.overall')}
                  </span>
                </div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-[-20%] rounded-full border border-dashed border-[#CB460C]/20" />
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 rounded-full bg-[#CB460C] blur-2xl pointer-events-none" />
              </motion.div>
            </div>

            {/* Column 3: Outputs & Deep-dive */}
            <div className="space-y-12 lg:space-y-16 lg:pt-12 relative z-20 px-6 md:px-0">
              <h3 className="font-display text-xl md:text-2xl text-[#1a1005]/40 uppercase tracking-widest text-center lg:text-right mb-8">Impact Funnels</h3>
              {[
                { id: 'security', label: t('impact.flow.output.security'), color: 'bg-ink' },
                { id: 'community', label: t('impact.flow.output.community'), color: 'bg-brand-3' },
                { id: 'ops', label: t('impact.flow.output.ops'), color: 'bg-ink-muted' },
                { id: 'artist', label: t('impact.flow.output.artist'), color: 'bg-brand-primary' },
              ].map((out, i) => (
                <div key={out.id} className="flex flex-col items-end">
                  <motion.div
                    id={`output-${out.id}`}
                    ref={el => { outputRefs.current[i] = el }}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="flex items-center gap-4 md:gap-6 justify-end group cursor-pointer"
                  >
                    <span className="font-display text-lg md:text-xl text-[#1a1005] text-right drop-shadow-sm">{out.label}</span>
                    <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl ${out.color} flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-all duration-500`}>
                       <span className="font-display text-xl md:text-2xl">
                          {out.id === 'security' ? '5%' : out.id === 'community' ? '20%' : out.id === 'ops' ? '15%' : '60%'}
                       </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Connection Lines (Desktop SVG Layer) */}
            <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
               <defs>
                 <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#CB460C" stopOpacity="0.05" />
                   <stop offset="50%" stopColor="#CB460C" stopOpacity="0.5" />
                   <stop offset="100%" stopColor="#CB460C" stopOpacity="0.05" />
                 </linearGradient>
                 <mask id="glow-mask">
                    <rect width="100%" height="100%" fill="white" />
                 </mask>
               </defs>

               {/* Source -> Hub Paths */}
               {paths.sources.map((d, i) => (
                 <g key={`src-g-${i}`}>
                   <motion.path 
                     d={d} 
                     stroke="#CB460C" 
                     strokeWidth="1.5" 
                     strokeOpacity="0.2" 
                     fill="none" 
                     initial={{ pathLength: 0 }} 
                     whileInView={{ pathLength: 1 }} 
                     transition={{ duration: 2, delay: i * 0.1 }} 
                   />
                   <motion.path 
                     d={d} 
                     stroke="url(#flow-gradient)" 
                     strokeWidth="4" 
                     fill="none" 
                     className="blur-[8px]" 
                     initial={{ pathLength: 0 }} 
                     whileInView={{ pathLength: 1 }} 
                     transition={{ duration: 2, delay: i * 0.1 }} 
                   />
                 </g>
               ))}

               {/* Hub -> Output Paths */}
               {paths.outputs.map((d, i) => (
                 <g key={`out-g-${i}`}>
                   <motion.path 
                     d={d} 
                     stroke="#CB460C" 
                     strokeWidth="1.5" 
                     strokeOpacity="0.2" 
                     fill="none" 
                     initial={{ pathLength: 0 }} 
                     whileInView={{ pathLength: 1 }} 
                     transition={{ duration: 2, delay: 1 + (i * 0.1) }} 
                   />
                   <motion.path 
                     d={d} 
                     stroke="url(#flow-gradient)" 
                     strokeWidth="4" 
                     fill="none" 
                     className="blur-[8px]" 
                     initial={{ pathLength: 0 }} 
                     whileInView={{ pathLength: 1 }} 
                     transition={{ duration: 2, delay: 1 + (i * 0.1) }} 
                   />
                 </g>
               ))}
            </svg>
          </div>
        </div>
      </section>

      {/* ——— Mission Statement Section ——— */}
      <section className="py-32 px-6 bg-white relative z-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-[40px] md:rounded-[64px] overflow-hidden aspect-square bg-[#F7EAE5] border border-[#e5d5cd] flex items-center justify-center p-0 shadow-2xl relative group transition-all duration-700"
              >
                <img 
                  src={groupPhoto} 
                  alt="Sundargaan Impact" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#CB460C]/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 border-[20px] md:border-[40px] border-white/10 pointer-events-none" />
              </motion.div>
            </div>
            <div className="order-1 lg:order-2 space-y-10">
              <div>
                <span className="font-body text-[#CB460C] uppercase tracking-widest text-sm font-semibold mb-3 inline-block">Our Mission</span>
                <h2 className="font-display text-5xl md:text-6xl text-[#1a1005] leading-tight">{t('impact.page.story.title')}</h2>
              </div>
              <p className="font-body text-xl text-[#6b5b4f] leading-relaxed">{t('impact.page.story.desc')}</p>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-10 border-t border-[#e5d5cd]">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-1">
                    <span className="block font-display text-4xl text-[#1a1005]">
                      {t(`impact.stat${num}.val`)}
                    </span>
                    <span className="block font-body text-[10px] md:text-xs text-[#a89080] uppercase tracking-[0.2em] font-bold">
                      {t(`impact.stat${num}.label`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— CTA Section ——— */}
      <section className="pb-32 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-screen-xl mx-auto bg-[#1a1005] rounded-[64px] p-12 md:p-24 text-center space-y-12 shadow-2xl overflow-hidden relative">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#CB460C] opacity-10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#E86228] opacity-10 rounded-full blur-3xl" />
          <h2 className="relative z-10 font-display text-5xl md:text-7xl text-white tracking-tight">Ready to make an <span className="text-[#CB460C]">Impact?</span></h2>
          <p className="relative z-10 font-body text-xl text-[#a89080] max-w-2xl mx-auto">Every contribution helps us preserve the living musical heritage of the Sundarbans.</p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Button variant="primary" size="lg" className="h-16 px-12 text-xl bg-[#CB460C] !border-[#CB460C]">{t('nav.join')}</Button>
            <Button variant="outline" size="lg" className="h-16 px-12 text-xl text-white !border-white/20 hover:!border-white">Watch Our Story</Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default ImpactPage
