import React from 'react'
import Button from '../components/ui/Button'
import MediaGrid from '../components/ui/MediaGrid'

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FEFCFB', paddingTop: '64px' }}>
      {/* ——— Hero Section ——— */}
      <section className="relative flex" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* ── Left Panel: Content ── */}
        <div
          className="flex flex-col justify-end px-10 md:px-16 lg:px-24 py-24 w-full md:w-1/2"
        >
          {/* Headline */}
          <h1
            className="font-body animate-fade-in-up delay-100"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 500,
              lineHeight: 1,
              color: '#1a1005',
              letterSpacing: '-0.04em',
              marginBottom: '1rem',
            }}
          >
            Sundargaan
          </h1>

          {/* Body copy */}
          <div className="space-y-1 mb-12">
            <p
              className="font-body animate-fade-in-up delay-200"
              style={{
                fontSize: '1.1rem',
                fontWeight: 400,
                color: '#6b5b4f',
                letterSpacing: '-0.01em',
              }}
            >
              Where the land sings of mangroves and mud.
            </p>
            <p
              className="font-body animate-fade-in-up delay-300"
              style={{
                fontSize: '1.1rem',
                fontWeight: 400,
                color: '#6b5b4f',
                letterSpacing: '-0.01em',
              }}
            >
              Stories of soil, rhythm of the Ektara.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4 animate-fade-in-up delay-400">
            <Button variant="primary" size="lg" className="px-10">
              Join
            </Button>
            <Button variant="outline" size="lg" className="px-10">
              Know more
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
          className="hidden md:flex flex-1 animate-fade-in delay-200"
          style={{ backgroundColor: '#F7EAE5' }}
        >
          <MediaGrid />
        </div>
      </section>

      {/* ——— Scroll indicator ——— */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500"
        aria-hidden="true"
      >
        <span className="font-body text-xs tracking-widest uppercase" style={{ color: '#a89080' }}>
          Explore
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
