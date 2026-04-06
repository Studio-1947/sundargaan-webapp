import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'

interface MediaTileProps {
  delay?: number
  index?: number
  image?: string
  onClick?: () => void
}

// One playable media tile with premium animations
const MediaTile: React.FC<MediaTileProps> = ({ delay = 0, index = 0, image, onClick }) => {
  const { t } = useLanguage()
  // Subtle warm gradient backgrounds for demo tiles
  const gradients = [
    'linear-gradient(135deg, #EDC6B5 0%, #E89F80 100%)',
    'linear-gradient(135deg, #F1D8CD 0%, #EAB39B 100%)',
    'linear-gradient(135deg, #E89F80 0%, #E77746 100%)',
    'linear-gradient(135deg, #EAB39B 0%, #E86228 100%)',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="h-full w-full"
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full overflow-hidden rounded-3xl cursor-pointer group shadow-2xl border border-white/5"
        whileHover="hover"
      >
        {/* Thumbnail Image */}
        {image && (
          <img 
            src={image} 
            alt="Thumbnail" 
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
        )}

        {/* Fallback Gradient */}
        {!image && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ background: gradients[index % gradients.length] }}
          />
        )}
        <motion.div
          className="absolute inset-0 bg-black/5"
          variants={{
            hover: { backgroundColor: 'rgba(203,70,12,0.15)' }
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Bottom label hint */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/60 to-transparent"
          initial={{ opacity: 0, y: 10 }}
          variants={{
            hover: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-[11px] font-body font-bold tracking-[0.2em] uppercase text-white">
            {t('media.explore')}
          </p>
        </motion.div>

        {/* Subtle shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
          variants={{
            hover: { x: ['-100%', '100%'], opacity: 1 }
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}

interface MediaGridProps {
  onTileClick?: () => void
}

const MediaGrid: React.FC<MediaGridProps> = ({ onTileClick }) => {
  const assets = [
    {
      img: '/src/assets/thumbnails/1 (1).jpeg',
    },
    {
      img: '/src/assets/thumbnails/1 (2).jpeg',
    },
    {
      img: '/src/assets/archive/landscape_thumb.png',
    },
    {
      img: '/src/assets/archive/performing_art_thumb.png',
    },
  ]

  return (
    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:p-8">
      {/* Column 1 */}
      <div className="flex flex-col gap-4 aspect-[4/5] sm:aspect-auto h-full">
        <div className="flex-[1.6]">
          <MediaTile index={0} delay={100} image={assets[0].img} onClick={onTileClick} />
        </div>
        <div className="flex-[1]">
          <MediaTile index={2} delay={300} image={assets[2].img} onClick={onTileClick} />
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-4 aspect-[4/5] sm:aspect-auto h-full">
        <div className="flex-[1]">
          <MediaTile index={1} delay={200} image={assets[1].img} onClick={onTileClick} />
        </div>
        <div className="flex-[1.4]">
          <MediaTile index={3} delay={400} image={assets[3].img} onClick={onTileClick} />
        </div>
      </div>
    </div>
  )
}

export default MediaGrid
