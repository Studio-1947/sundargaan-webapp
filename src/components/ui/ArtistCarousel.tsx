import React, { useEffect, useState } from 'react';
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
      if (window.innerWidth < 640) setItemsPerPage(2);
      else if (window.innerWidth < 1024) setItemsPerPage(3);
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
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  const totalPages = Math.ceil(artists.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  // Auto-slide
  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const currentArtists = artists.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  if (artists.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden group/carousel">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="flex h-full w-full absolute inset-0"
        >
          {currentArtists.map((artist, idx) => (
            <div
              key={artist.id}
              className="relative flex-1 h-full group overflow-hidden border-r border-white/5 last:border-r-0"
            >
              {artist.imageUrl ? (
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-[#CB460C]/20" />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1005] via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
              
              {/* Vertical Name - Responsive positioning */}
              <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 pointer-events-none">
                <span className="block text-white/60 group-hover:text-white font-display text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] rotate-180 [writing-mode:vertical-lr] transition-all duration-500">
                  {language === 'EN' ? artist.name : artist.nameBn}
                </span>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shadow-[inset_0_0_50px_rgba(203,70,12,0.3)]" />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Controls - Visible on Hover or Mobile */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4 z-30 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-500 md:opacity-0">
         <div className="flex gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 transition-all duration-500 rounded-full ${
                i === currentIndex ? 'w-6 bg-[#CB460C]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistCarousel;
