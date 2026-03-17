import React, { useState } from 'react'

interface MediaTileProps {
  aspectRatio?: 'square' | 'tall' | 'wide'
  delay?: number
  index?: number
}

// One playable media tile
const MediaTile: React.FC<MediaTileProps> = ({ delay = 0, index = 0 }) => {
  const [hovered, setHovered] = useState(false)

  // Subtle warm gradient backgrounds for demo tiles
  const gradients = [
    'linear-gradient(135deg, #EDC6B5 0%, #E89F80 100%)',
    'linear-gradient(135deg, #F1D8CD 0%, #EAB39B 100%)',
    'linear-gradient(135deg, #E89F80 0%, #E77746 100%)',
    'linear-gradient(135deg, #EAB39B 0%, #E86228 100%)',
  ]

  return (
    <div
      className="animate-fade-in-up h-full"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-xl cursor-pointer"
        style={{
          background: gradients[index % gradients.length],
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease',
          transform: hovered ? 'scale(1.025)' : 'scale(1)',
          boxShadow: hovered
            ? '0 16px 48px rgba(203,70,12,0.22), 0 4px 12px rgba(0,0,0,0.08)'
            : '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: hovered ? 'rgba(203,70,12,0.18)' : 'rgba(0,0,0,0.06)',
          }}
        >
          {/* Play button */}
          <div
            className="flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: 48,
              height: 48,
              backgroundColor: hovered ? '#CB460C' : 'rgba(254,252,251,0.85)',
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              boxShadow: hovered ? '0 4px 20px rgba(203,70,12,0.5)' : '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              style={{ marginLeft: 2 }}
            >
              <path
                d="M1 1.5L15 9L1 16.5V1.5Z"
                fill={hovered ? '#FEFCFB' : '#CB460C'}
                stroke={hovered ? '#FEFCFB' : '#CB460C'}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Bottom label hint */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2 transition-all duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(26,16,5,0.5) 0%, transparent 100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          <p className="text-[10px] font-body font-medium tracking-wider uppercase" style={{ color: '#F7EAE5' }}>
            Watch
          </p>
        </div>
      </div>
    </div>
  )
}

// Asymmetric 2-column media grid matching the screenshot
const MediaGrid: React.FC = () => {
  return (
    <div className="w-full h-full flex gap-3 p-6">
      {/* Left column — one large tile */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1" style={{ minHeight: 0 }}>
          <MediaTile index={0} delay={300} />
        </div>
        <div className="mt-3" style={{ height: '38%' }}>
          <MediaTile index={2} delay={500} />
        </div>
      </div>

      {/* Right column — two stacked tiles */}
      <div className="flex-1 flex flex-col gap-3">
        <div style={{ height: '45%' }}>
          <MediaTile index={1} delay={400} />
        </div>
        <div className="flex-1">
          <MediaTile index={3} delay={600} />
        </div>
      </div>
    </div>
  )
}

export default MediaGrid
