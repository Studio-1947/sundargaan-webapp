import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

interface Artist {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  imageUrl?: string;
  famousSong?: string;
}

const ArtistCarousel: React.FC = () => {
  const { language } = useLanguage();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) setItemsPerPage(3);
      else if (window.innerWidth < 1024) setItemsPerPage(4);
      else setItemsPerPage(6);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
        const response = await fetch(`${baseUrl}/artists?limit=50`);
        const result = await response.json();
        if (result.data) {
          setArtists(result.data);
          // Preload images
          result.data.forEach((artist: Artist) => {
            if (artist.imageUrl) {
              const img = new Image();
              img.src = artist.imageUrl;
            }
          });
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };
    fetchArtists();
  }, []);

  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide logic
  useEffect(() => {
    if (artists.length <= itemsPerPage || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artists.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [artists.length, itemsPerPage, isPaused]);

  // For seamless loop, we prepare a list where we can always see 'itemsPerPage' items
  const displayArtists = useMemo(() => {
    if (artists.length === 0) return [];
    // If we have fewer artists than itemsPerPage, repeat them
    let list = [...artists];
    while (list.length < itemsPerPage * 2) {
      list = [...list, ...artists];
    }
    // Double for the slide transition
    return [...list, ...list];
  }, [artists, itemsPerPage]);

  if (artists.length === 0) return null;

  return (
    <div 
      className="relative w-full h-full overflow-hidden flex items-center group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div 
        className="flex h-full w-full"
        initial={false}
        animate={{ 
          x: `-${currentIndex * (100 / itemsPerPage)}%` 
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.32, 0.72, 0, 1], // Premium "Apple-style" quint easing
          type: "tween"
        }}
      >
        {displayArtists.map((artist, idx) => (
          <div
            key={`${artist.id}-${idx}`}
            className="group relative h-full flex-shrink-0 border-r border-white/5 last:border-r-0 overflow-hidden"
            style={{ width: `${100 / itemsPerPage}%` }}
          >
            {artist.imageUrl ? (
              <img
                src={artist.imageUrl}
                alt={artist.name}
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter,transform] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
                style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)', willChange: 'filter, transform' }}
              />
            ) : (
              <div className="absolute inset-0 bg-[#CB460C]/20" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1005] via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]" />

            {/* Vertical Name */}
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 pointer-events-none">
              <span className="block text-white/40 group-hover:text-white font-display text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] rotate-180 [writing-mode:vertical-lr] transition-all duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]">
                {language === 'EN' ? artist.name : artist.nameBn}
              </span>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] pointer-events-none shadow-[inset_0_0_60px_rgba(203,70,12,0.4)]" />
          </div>
        ))}
      </motion.div>

      {/* Edge Fades for extra smoothness */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1a1005] to-transparent z-20 pointer-events-none opacity-50" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#1a1005] to-transparent z-20 pointer-events-none opacity-50" />
    </div>
  );
};

export default ArtistCarousel;
