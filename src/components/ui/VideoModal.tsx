import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Reset loading state when video source changes
  useEffect(() => {
    setIsLoading(true)
  }, [videoSrc])

  // Auto-play when open, pause when closed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.error("Playback error", err))
      }
    } else {
      document.body.style.overflow = 'unset'
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-3xl"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-fit max-w-[95vw] max-h-[90vh] rounded-2xl md:rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(203,70,12,0.3)] border border-white/10 bg-black z-10 flex items-center justify-center font-display"
          >
            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-t-[#CB460C] border-white/10 rounded-full animate-spin" />
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-[#CB460C] hover:border-[#CB460C] transition-all z-40"
              aria-label="Close modal"
            >
              <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Video Player */}
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              autoPlay
              onCanPlay={() => setIsLoading(false)}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              className={`max-h-[90vh] w-auto object-contain transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Aesthetic Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#CB460C]/20 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VideoModal
