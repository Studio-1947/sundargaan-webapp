import React, { useRef, useState } from 'react'

interface HeroVideoProps {
  src: string
  poster?: string
}

const HeroVideo: React.FC<HeroVideoProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [hasError, setHasError] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoError = (e: any) => {
    console.error('Video loading error:', e)
    setHasError(true)
  }

  return (
    <div className="relative w-full h-full group overflow-hidden bg-[#1a1005]">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-30 blur-3xl scale-110 pointer-events-none" 
           style={{ background: 'radial-gradient(circle at center, #CB460C 0%, transparent 70%)' }} />

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-[#a89080] font-body text-sm mb-4">Unable to load the private video securely.</p>
          <p className="text-white/20 text-[10px] uppercase tracking-widest">Check if local server (vercel dev) is running</p>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        onError={handleVideoError}
        className={`w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105 ${hasError ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1005]/60 md:from-[#1a1005]/40 via-transparent to-transparent z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1005] via-transparent to-transparent z-20 opacity-0 md:opacity-100 hidden md:block" style={{ width: '40%' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1005]/30 md:from-[#1a1005]/20 via-transparent to-transparent z-20" />
      
      {/* Text/Brand Overlay (Subtle) */}
      <div className="absolute top-8 left-8 z-30 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
         <span className="font-body text-[10px] uppercase tracking-[0.6em] text-white/40">Sundargaan Visuals</span>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#CB460C] hover:border-[#CB460C] transition-all"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#CB460C] hover:border-[#CB460C] transition-all"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
          )}
        </button>
      </div>

      {/* Interactive Border (Aesthetic) */}
      <div className="absolute inset-0 border border-white/5 group-hover:border-white/20 transition-colors duration-500 z-40 pointer-events-none" />
    </div>
  )
}

export default HeroVideo
