import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import thumb2 from '../../assets/thumbnails/1 (2).jpeg'
import landscapeThumb from '../../assets/archive/landscape_thumb.png'

interface MediaTileProps {
  delay?: number
  index?: number
  image?: string
  videoSrc?: string
  onClick?: () => void
}

// One playable media tile with premium animations
const MediaTile: React.FC<MediaTileProps> = ({ delay = 0, image, videoSrc, onClick }) => {
  const { t } = useLanguage()

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
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {/* Play Button Overlay for Videos */}
        {videoSrc && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-500">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white scale-90 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_50px_rgba(203,70,12,0.3)]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                 <path d="M8 5v14l11-7z" />
               </svg>
            </div>
          </div>
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
  onVideoClick?: (src: string) => void
}

const MediaGrid: React.FC<MediaGridProps> = ({ onVideoClick }) => {
  const assets = [
    { 
      img: "https://res.cloudinary.com/drgb8w8ak/image/upload/v1775564860/sundargaan/images/gughdsliizqlagvntjhl.jpg", 
      video: "https://712vsvopahcsqllv.public.blob.vercel-storage.com/hero_video_1-SYsQdTu8bw2gRoXixPC5rPhUhJAkF7.mp4" 
    },
    { img: thumb2 },
    { img: landscapeThumb },
    { 
      img: "https://res.cloudinary.com/drgb8w8ak/image/upload/v1775566166/sundargaan/images/k6yqrrwy1kwmy1zloj3k.jpg", 
      video: "https://712vsvopahcsqllv.public.blob.vercel-storage.com/hero_video_2-hrApTjHsIXqjPpwCGWjSKyIKMXpOcy.mp4" 
    },
  ]

  return (
    <div className="w-full h-full grid grid-cols-2 gap-3 p-4 md:p-8">
      {/* Column 1 */}
      <div className="flex flex-col gap-3 h-full">
        <div className="flex-[1.6]">
          <MediaTile delay={100} image={assets[0].img} videoSrc={assets[0].video} onClick={() => assets[0].video && onVideoClick?.(assets[0].video)} />
        </div>
        <div className="flex-[1]">
          <MediaTile delay={300} image={assets[2].img} />
        </div>
      </div>

      {/* Column 2 — offset down slightly for visual stagger */}
      <div className="flex flex-col gap-3 h-full pt-6 md:pt-10">
        <div className="flex-[1]">
          <MediaTile delay={200} image={assets[1].img} />
        </div>
        <div className="flex-[1.4]">
          <MediaTile delay={400} image={assets[3].img} videoSrc={assets[3].video} onClick={() => assets[3].video && onVideoClick?.(assets[3].video)} />
        </div>
      </div>
    </div>
  )
}

export default MediaGrid
