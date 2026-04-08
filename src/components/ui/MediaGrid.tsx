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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
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
        {/* Background Image or Video */}
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : image ? (
          <img
            src={image}
            alt="Thumbnail"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : null}
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
      video: "https://res.cloudinary.com/drgb8w8ak/video/upload/hero_video_1_upf9ro.mp4"
    },
    {
      img: thumb2,
      video: "https://res.cloudinary.com/drgb8w8ak/video/upload/Hero_video_3_wwx3sy.mp4"
    },
    {
      img: landscapeThumb,
      video: "https://res.cloudinary.com/drgb8w8ak/video/upload/Hero_video_4_sn34k5.mp4"
    },
    {
      img: "https://res.cloudinary.com/drgb8w8ak/image/upload/v1775566166/sundargaan/images/k6yqrrwy1kwmy1zloj3k.jpg",
      video: "https://res.cloudinary.com/drgb8w8ak/video/upload/hero_video_2_axdq88.mp4"
    },
  ]

  return (
    <div className="w-full aspect-square max-w-[700px] mx-auto grid grid-cols-2 gap-4 p-4 md:p-8">
      {/* Column 1 */}
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-[1.4]">
          <MediaTile delay={100} image={assets[0].img} videoSrc={assets[0].video} onClick={() => assets[0].video && onVideoClick?.(assets[0].video)} />
        </div>
        <div className="flex-[1.1]">
          <MediaTile delay={300} image={assets[2].img} videoSrc={assets[2].video} onClick={() => assets[2].video && onVideoClick?.(assets[2].video)} />
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-[1.1]">
          <MediaTile delay={200} image={assets[1].img} videoSrc={assets[1].video} onClick={() => assets[1].video && onVideoClick?.(assets[1].video)} />
        </div>
        <div className="flex-[1.4]">
          <MediaTile delay={400} image={assets[3].img} videoSrc={assets[3].video} onClick={() => assets[3].video && onVideoClick?.(assets[3].video)} />
        </div>
      </div>
    </div>
  )
}

export default MediaGrid
