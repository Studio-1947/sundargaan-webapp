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
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };
    fetchArtists();
  }, []);

  // Move one by one
  const nextSlide = () => {
    if (artists.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % artists.length);
  };

  const prevSlide = () => {
    if (artists.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + artists.length) % artists.length);
  };

  // Auto-slide faster
  useEffect(() => {
    if (artists.length <= 1) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [artists.length]);

  if (artists.length === 0) return null;

  // Get visible items with wrapping
  const getVisibleArtists = () => {
    const visible = [];
    for (let i = 0; i < itemsPerPage; i++) {
      visible.push(artists[(currentIndex + i) % artists.length]);
    }
    return visible;
  };

  const visibleArtists = getVisibleArtists();

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center group/carousel">
      {/* Container for the single-item-slide strips */}
      <div className="flex w-full h-full relative">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleArtists.map((artist, idx) => (
            <motion.div
              key={`${artist.id}-${currentIndex + idx}`}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                ease: "circOut",
              }}
              className="relative h-full flex-1 border-r border-white/5 last:border-r-0 overflow-hidden"
              style={{ flex: `0 0 ${100 / itemsPerPage}%` }}
            >
              {artist.imageUrl ? (
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-[#CB460C]/20" />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1005] via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
              
              {/* Vertical Name */}
              <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 pointer-events-none">
                <span className="block text-white/40 group-hover:text-white font-display text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] rotate-180 [writing-mode:vertical-lr] transition-all duration-500">
                  {language === 'EN' ? artist.name : artist.nameBn}
                </span>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shadow-[inset_0_0_60px_rgba(203,70,12,0.4)]" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtistCarousel;
