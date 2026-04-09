import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_ARTISTS, ARTIST_BLOCKS, ARTIST_CATEGORIES, Artist, SampleWork } from '../data/artistData';
import { getArtists } from '../api/artists';

// ─── Icon helpers ────────────────────────────────────────────────────────────

const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconMusic = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);



const IconPlay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconPause = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
  </svg>
);

const IconVolume = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const IconVolumeMute = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
);

const IconLoader = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtTime(s: number): string {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Audio Player Modal ───────────────────────────────────────────────────────

interface PlayerProps {
  work: SampleWork;
  artistName: string;
  onClose: () => void;
}

const AudioPlayerModal: React.FC<PlayerProps> = ({ work, artistName, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const hasMedia = !!work.mediaUrl;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoad = () => { setDuration(el.duration); setLoading(false); };
    const onTime = () => setCurrentTime(el.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => { setIsPlaying(false); setCurrentTime(0); };
    const onErr = () => { setError(true); setLoading(false); };
    const onWait = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    el.addEventListener('loadedmetadata', onLoad);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnd);
    el.addEventListener('error', onErr);
    el.addEventListener('waiting', onWait);
    el.addEventListener('canplay', onCanPlay);
    return () => {
      el.removeEventListener('loadedmetadata', onLoad);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('error', onErr);
      el.removeEventListener('waiting', onWait);
      el.removeEventListener('canplay', onCanPlay);
      el.pause();
    };
  }, []);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el || error) return;
    if (isPlaying) el.pause();
    else el.play().catch(() => setError(true));
  }, [isPlaying, error]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v === 0) setMuted(true);
    else setMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !muted;
    setMuted(next);
    audioRef.current.muted = next;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Blurred thumbnail background */}
        <div className="absolute inset-0">
          <img src={work.thumbnail} alt="" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-[#1a1005]/75 backdrop-blur-xl" />
        </div>

        <div className="relative p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#CB460C] bg-[#CB460C]/15 px-3 py-1 rounded-full">
              ♪ Song
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <IconClose />
            </button>
          </div>

          {/* Thumbnail + Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-lg ring-2 ring-white/10">
              <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-display text-lg leading-tight truncate">{work.title}</p>
              <p className="text-white/50 text-sm mt-0.5 truncate">{artistName}</p>
              {work.duration && (
                <p className="text-[#CB460C] text-xs font-mono mt-1">{work.duration}</p>
              )}
            </div>
          </div>

          {/* Audio element */}
          {hasMedia && (
            <audio ref={audioRef} src={work.mediaUrl} preload="metadata" />
          )}

          {/* No media state */}
          {!hasMedia && (
            <div className="text-center py-2 text-white/40 text-sm">
              Audio preview not available
            </div>
          )}

          {/* Seek bar */}
          {hasMedia && (
            <div className="space-y-1.5">
              <div className="relative h-2 rounded-full bg-white/15">
                <div
                  className="absolute inset-y-0 left-0 bg-[#CB460C] rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={error}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-white/40 text-[11px] font-mono">
                <span>{fmtTime(currentTime)}</span>
                <span>{fmtTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Play / Pause */}
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlay}
              disabled={!hasMedia || error}
              className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: '#CB460C' }}
            >
              {loading && hasMedia
                ? <IconLoader />
                : isPlaying
                  ? <IconPause />
                  : <IconPlay />
              }
            </button>
          </div>

          {/* Volume */}
          {hasMedia && (
            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors shrink-0">
                {muted || volume === 0 ? <IconVolumeMute /> : <IconVolume />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="flex-1 h-1 accent-[#CB460C] cursor-pointer"
              />
            </div>
          )}

          {error && (
            <p className="text-center text-red-400 text-xs">Could not load audio. Check the media URL.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Video Player Modal ───────────────────────────────────────────────────────

const VideoPlayerModal: React.FC<PlayerProps> = ({ work, onClose }) => {
  const hasMedia = !!work.mediaUrl;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-black"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1005]/90">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-red-400 bg-red-400/15 px-2.5 py-0.5 rounded-full">
              ▶ Video
            </span>
            <span className="text-white/80 text-sm font-medium truncate max-w-[260px]">{work.title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <IconClose />
          </button>
        </div>

        {/* Video */}
        {hasMedia ? (
          <video
            src={work.mediaUrl}
            controls
            autoPlay
            className="w-full max-h-[70vh] bg-black"
            style={{ display: 'block' }}
          />
        ) : (
          <div className="relative aspect-video bg-[#0d0a07] flex flex-col items-center justify-center gap-3">
            <img src={work.thumbnail} alt={work.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="relative text-white/40 text-sm">Video preview not available</div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ArtistCardProps {
  artist: Artist;
  language: string;
  onKnowMore: (a: Artist, tab?: number) => void;
  index: number;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, language, onKnowMore, index }) => {
  const category = ARTIST_CATEGORIES.find(c => c.id === artist.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onKnowMore(artist)}
      className="group bg-white rounded-[2rem] border border-[#e5d5cd] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-square w-full relative overflow-hidden bg-[#f0e8e4]">
        <img
          src={artist.image}
          alt={language === 'EN' ? artist.name : artist.nameBN}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Block badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#CB460C]">
          {artist.block}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Name + category */}
        <div>
          <h3 className="text-2xl font-display text-[#1a1005] leading-tight mb-1">
            {language === 'EN' ? artist.name : artist.nameBN}
          </h3>
          <span className="text-[11px] text-[#CB460C] font-bold uppercase tracking-widest">
            {language === 'EN' ? category?.en : category?.bn}
          </span>
        </div>

        {/* Famous song + address */}
        <div className="space-y-1 text-sm text-[#6b5b4f]">
          <div 
            onClick={(e) => { if (artist.sampleWorks.length > 0) { e.stopPropagation(); onKnowMore(artist, 1); } }}
            className={`flex items-start gap-2 ${artist.sampleWorks.length > 0 ? 'cursor-pointer hover:text-[#CB460C] transition-colors group/song' : ''}`}
          >
            <div className="relative text-[#CB460C] mt-0.5 shrink-0">
              <IconMusic />
              {artist.sampleWorks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#CB460C] text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold border border-white group-hover/song:scale-110 transition-transform">
                  {artist.sampleWorks.length}
                </span>
              )}
            </div>
            <span className="italic">{language === 'EN' ? artist.famousSong : artist.famousSongBN}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#CB460C] mt-0.5 shrink-0"><IconPin /></span>
            <span className="truncate">
              {language === 'EN' 
                ? `Village: ${artist.village || ''}, Post: ${artist.post || ''}`
                : `গ্রাম: ${artist.villageBN || ''}, পোস্ট: ${artist.postBN || ''}`
              }
            </span>
          </div>
        </div>

        {/* Instruments */}
        <div className="flex flex-wrap gap-1.5">
          {(language === 'EN' ? artist.instruments : artist.instrumentsBN).map((inst, i) => (
            <span key={i} className="px-2.5 py-1 bg-[#F7EAE5] text-[#8b5e3c] text-xs rounded-lg font-medium">
              {inst}
            </span>
          ))}
        </div>



        {/* Tags (only if no portfolio to save space, or just keep them) */}
        {!artist.sampleWorks.length && (
          <div className="flex flex-wrap gap-1.5">
            {(language === 'EN' ? artist.tags : artist.tagsBN).slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2.5 py-1 border border-[#e5d5cd] text-[#a89080] text-[11px] rounded-full font-medium uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex pt-2 mt-auto">
          <button
            onClick={(e) => { e.stopPropagation(); onKnowMore(artist); }}
             className="w-full border border-[#CB460C] text-[#CB460C] py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#F7EAE5] transition-all active:scale-95"
          >
            {language === 'EN' ? 'Know More' : 'আরও জানুন'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Sample Work Card ─────────────────────────────────────────────────────────

const SampleWorkCard: React.FC<{ work: SampleWork; language: string; onClick?: () => void }> = ({ work, language, onClick }) => {
  const isMedia = work.type === 'song' || work.type === 'video';

  return (
    <div
      onClick={isMedia ? onClick : undefined}
      className={`group rounded-xl overflow-hidden border border-[#e5d5cd] bg-white hover:shadow-md transition-all ${isMedia ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="relative aspect-video overflow-hidden bg-[#f0e8e4]">
        <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {isMedia && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[#CB460C] shadow-lg group-hover:scale-110 transition-transform">
              <IconPlay />
            </div>
          </div>
        )}
        {work.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
            {work.duration}
          </div>
        )}
        {work.type === 'craft' && (
          <div className="absolute top-2 left-2 bg-[#CB460C]/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
            {language === 'EN' ? 'Craft' : 'শিল্পকর্ম'}
          </div>
        )}
        {work.type === 'song' && (
          <div className="absolute top-2 left-2 bg-[#1a1005]/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
            {language === 'EN' ? 'Song' : 'গান'}
          </div>
        )}
        {work.type === 'video' && (
          <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
            {language === 'EN' ? 'Video' : 'ভিডিও'}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-[#1a1005] leading-snug">
          {language === 'EN' ? work.title : work.titleBN}
        </p>
      </div>
    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────

const MeetTheArtistPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [activeModalTab, setActiveModalTab] = useState(0); // 0 = About, 1 = Works
  const [onlyWithPortfolio, setOnlyWithPortfolio] = useState(false);

  const [activeWork, setActiveWork] = useState<SampleWork | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getArtists({ limit: 100 })
      .then(res => setArtists(res.data.length > 0 ? res.data : MOCK_ARTISTS))
      .catch(() => setArtists(MOCK_ARTISTS))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        artist.name.toLowerCase().includes(q) ||
        artist.nameBN.includes(searchTerm) ||
        artist.famousSong.toLowerCase().includes(q) ||
        artist.famousSongBN.includes(searchTerm) ||
        artist.address.toLowerCase().includes(q) ||
        artist.instruments.some(i => i.toLowerCase().includes(q)) ||
        artist.tags.some(t => t.toLowerCase().includes(q));
      const matchesBlock = selectedBlock ? artist.block === selectedBlock : true;
      const matchesCategory = selectedCategory ? artist.category === selectedCategory : true;
      const matchesPortfolio = onlyWithPortfolio ? artist.sampleWorks.length > 0 : true;
      return matchesSearch && matchesBlock && matchesCategory && matchesPortfolio;
    });
  }, [artists, searchTerm, selectedBlock, selectedCategory, onlyWithPortfolio]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedBlock, selectedCategory, onlyWithPortfolio]);

  const totalPages = Math.ceil(filteredArtists.length / PAGE_SIZE);
  const pagedArtists = filteredArtists.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openModal = (artist: Artist, tab: number) => {
    setSelectedArtist(artist);
    setActiveModalTab(tab);
  };

  const closeModal = () => {
    setSelectedArtist(null);
    setActiveWork(null);
  };

  const handleClearFilters = () => {
    setSelectedBlock(null);
    setSelectedCategory(null);
    setSearchTerm('');
    setOnlyWithPortfolio(false);
    setCurrentPage(1);
  };

  const category = selectedArtist ? ARTIST_CATEGORIES.find(c => c.id === selectedArtist.category) : null;

  const MODAL_TABS = language === 'EN'
    ? ['About', 'Artistic Portfolio']
    : ['সম্পর্কে', 'আর্টিস্টিক পোর্টফোলিও'];

  return (
    <div className="min-h-screen bg-[#FEFCFB] pb-24 font-body text-[#1a1005]">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-14 pb-16 md:pt-24 md:pb-20 border-b border-[#e5d5cd] bg-[#F7EAE5]/50 overflow-hidden">
        {/* Decorative bg text */}
        <span className="absolute inset-0 flex items-center justify-center text-[16vw] font-display font-bold text-[#CB460C]/5 select-none pointer-events-none leading-none whitespace-nowrap">
          {language === 'EN' ? 'ARTISTS' : 'শিল্পী'}
        </span>
        <div className="container mx-auto px-6 md:px-12 text-center relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.35em] text-[#CB460C] font-bold mb-4"
          >
            {language === 'EN' ? 'Sundarbans Living Heritage' : 'সুন্দরবনের জীবন্ত ঐতিহ্য'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-5xl md:text-7xl font-display mb-6 tracking-tight leading-[1.05]"
          >
            {t('artist.page.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-[#6b5b4f] max-w-xl mx-auto mb-10 leading-relaxed"
          >
            {language === 'EN'
              ? 'Discover and connect with the living voices of the Sundarbans.'
              : 'সুন্দরবনের জীবন্ত কণ্ঠস্বরগুলো আবিষ্কার করুন এবং তাদের সাথে যোগাযোগ করুন।'}
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-2xl mx-auto relative h-14 shadow-lg"
          >
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a89080]">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder={t('artist.page.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-12 pr-32 rounded-full bg-white border border-[#CB460C]/25 focus:border-[#CB460C] outline-none text-base shadow-sm"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-[#CB460C] text-white px-6 rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">
              {t('artist.search.btn')}
            </button>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-8 text-sm text-[#a89080]"
          >
            <span><strong className="text-[#1a1005]">{artists.length}</strong> {language === 'EN' ? 'Artists' : 'শিল্পী'}</span>
            <span className="w-px h-4 bg-[#e5d5cd]" />
            <span><strong className="text-[#1a1005]">{ARTIST_CATEGORIES.length}</strong> {language === 'EN' ? 'Art Forms' : 'শিল্পরূপ'}</span>
          </motion.div>
        </div>
      </section>

      {/* ── Main layout ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-10">

        {/* Sidebar filters */}
        <aside className="lg:w-60 shrink-0 space-y-8 lg:sticky lg:top-28 lg:self-start">
          {/* Category filter */}
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#a89080]">
              {t('artist.filter.category')}
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl text-sm text-left font-medium transition-colors ${!selectedCategory ? 'bg-[#CB460C] text-white' : 'hover:bg-[#F7EAE5] text-[#4a3b33]'}`}
              >
                {language === 'EN' ? 'All Categories' : 'সব বিভাগ'}
              </button>
              {ARTIST_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm text-left font-medium transition-colors flex items-center justify-between gap-2 ${selectedCategory === cat.id ? 'bg-[#CB460C] text-white' : 'hover:bg-[#F7EAE5] text-[#4a3b33]'}`}
                >
                  <span>{language === 'EN' ? cat.en : cat.bn}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-[#F7EAE5] text-[#CB460C]'}`}>
                    {artists.filter(a => a.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Block filter */}
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#a89080]">
              {t('artist.filter.all')}
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2 max-h-72 overflow-y-auto no-scrollbar">
              <button
                onClick={() => setSelectedBlock(null)}
                className={`px-4 py-2 rounded-xl text-sm text-left font-medium transition-colors ${!selectedBlock ? 'bg-[#CB460C] text-white' : 'hover:bg-[#F7EAE5] text-[#4a3b33]'}`}
              >
                {language === 'EN' ? 'All Blocks' : 'সব ব্লক'}
              </button>
              {ARTIST_BLOCKS.map(block => (
                <button
                  key={block}
                  onClick={() => setSelectedBlock(block)}
                  className={`px-4 py-2 rounded-xl text-sm text-left font-medium transition-colors ${selectedBlock === block ? 'bg-[#CB460C] text-white' : 'hover:bg-[#F7EAE5] text-[#4a3b33]'}`}
                >
                  {block}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio filter */}
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#a89080]">
               {language === 'EN' ? 'Portfolio' : 'পোর্টফোলিও'}
            </h3>
            <button
              onClick={() => setOnlyWithPortfolio(!onlyWithPortfolio)}
              className={`w-full px-4 py-2 rounded-xl text-sm text-left font-medium transition-colors flex items-center justify-between gap-2 ${onlyWithPortfolio ? 'bg-[#CB460C] text-white shadow-md' : 'bg-white border border-[#e5d5cd] text-[#4a3b33] hover:bg-[#F7EAE5]'}`}
            >
              <span>{language === 'EN' ? 'Only with Portfolio' : 'শুধুমাত্র পোর্টফোলিও সহ'}</span>
              <div className={`w-4 h-4 rounded shadow-inner flex items-center justify-center ${onlyWithPortfolio ? 'bg-white' : 'bg-[#f0e8e4]'}`}>
                {onlyWithPortfolio && <div className="w-2 h-2 bg-[#CB460C] rounded-sm" />}
              </div>
            </button>
          </div>

          {/* Clear filters */}
          {(selectedBlock || selectedCategory || searchTerm || onlyWithPortfolio) && (
            <button
              onClick={handleClearFilters}
              className="w-full text-center text-xs text-[#CB460C] font-bold uppercase tracking-widest py-2 border border-[#CB460C]/30 rounded-full hover:bg-[#F7EAE5] transition-colors"
            >
              {language === 'EN' ? 'Clear all filters' : 'সব ফিল্টার মুছুন'}
            </button>
          )}
        </aside>

        {/* Artist grid */}
        <main className="flex-1 min-w-0">
          {/* Result count + page info */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-[#a89080]">
              <strong className="text-[#1a1005]">{filteredArtists.length}</strong>{' '}
              {language === 'EN' ? `artist${filteredArtists.length !== 1 ? 's' : ''} found` : 'জন শিল্পী পাওয়া গেছে'}
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-[#a89080]">
                {language === 'EN' ? `Page ${currentPage} of ${totalPages}` : `পৃষ্ঠা ${currentPage} / ${totalPages}`}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-[2rem] border border-[#e5d5cd] overflow-hidden bg-white animate-pulse">
                  <div className="aspect-square w-full bg-[#f0e8e4]" />
                  <div className="p-7 space-y-3">
                    <div className="h-6 bg-[#f0e8e4] rounded w-2/3" />
                    <div className="h-4 bg-[#f0e8e4] rounded w-1/3" />
                    <div className="h-4 bg-[#f0e8e4] rounded w-full" />
                    <div className="h-4 bg-[#f0e8e4] rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArtists.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {pagedArtists.map((artist, idx) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    language={language}
                    onKnowMore={(a, tab) => openModal(a, tab ?? 0)}
                    index={idx}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {/* Prev */}
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e5d5cd] text-[#6b5b4f] hover:border-[#CB460C] hover:text-[#CB460C] hover:bg-[#F7EAE5] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous page"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>

                  {/* Page numbers */}
                  {(() => {
                    const pages: (number | '…')[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (currentPage > 3) pages.push('…');
                      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
                      if (currentPage < totalPages - 2) pages.push('…');
                      pages.push(totalPages);
                    }
                    return pages.map((p, i) =>
                      p === '…' ? (
                        <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-[#a89080] text-sm select-none">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => { setCurrentPage(p as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${currentPage === p ? 'bg-[#CB460C] text-white shadow-md' : 'border border-[#e5d5cd] text-[#6b5b4f] hover:border-[#CB460C] hover:text-[#CB460C] hover:bg-[#F7EAE5]'}`}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}

                  {/* Next */}
                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e5d5cd] text-[#6b5b4f] hover:border-[#CB460C] hover:text-[#CB460C] hover:bg-[#F7EAE5] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Next page"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center">
              <div className="text-5xl mb-4 opacity-30">♪</div>
              <p className="text-lg text-[#a89080] italic">
                {language === 'EN'
                  ? 'No artists found matching your search.'
                  : 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো শিল্পী পাওয়া যায়নি।'}
              </p>
              <button
                onClick={() => { setSelectedBlock(null); setSelectedCategory(null); setSearchTerm(''); }}
                className="mt-6 text-[#CB460C] font-bold text-sm underline underline-offset-4"
              >
                {language === 'EN' ? 'Clear filters' : 'ফিল্টার মুছুন'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── Artist Detail Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white w-full max-w-5xl rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden flex flex-col md:flex-row max-h-[92vh] shadow-2xl"
            >
              {/* ── Left image panel ── */}
              <div className="md:w-[38%] md:min-h-full relative flex-shrink-0 bg-[#f0e8e4]">
                <img
                  src={selectedArtist.image}
                  alt={language === 'EN' ? selectedArtist.name : selectedArtist.nameBN}
                  className="w-full h-56 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Name + category overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[11px] text-[#CB460C] font-bold uppercase tracking-widest mb-1 bg-white/90 inline-block px-2.5 py-0.5 rounded-full">
                    {language === 'EN' ? category?.en : category?.bn}
                  </p>
                  <h2 className="text-3xl font-display text-white leading-tight mt-2">
                    {language === 'EN' ? selectedArtist.name : selectedArtist.nameBN}
                  </h2>
                  <p className="text-white/70 text-sm mt-1 flex items-center gap-1.5">
                    <IconPin /> 
                    {language === 'EN' 
                      ? `Village: ${selectedArtist.village || ''}, Post: ${selectedArtist.post || ''}`
                      : `গ্রাম: ${selectedArtist.villageBN || ''}, পোস্ট: ${selectedArtist.postBN || ''}`
                    }
                  </p>
                </div>

                {/* Availability removed */}
              </div>

              {/* ── Right content panel ── */}
              <div className="md:w-[62%] flex flex-col overflow-hidden min-h-0">
                {/* Header row with tabs + close */}
                <div className="flex items-center justify-between px-4 md:px-8 pt-5 md:pt-7 pb-0 border-b border-[#f0e8e4] shrink-0 gap-2">
                  <div className="flex gap-0.5 overflow-x-auto no-scrollbar flex-1 min-w-0">
                    {MODAL_TABS.map((tab, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveModalTab(i)}
                        className={`shrink-0 px-3 md:px-4 py-3 text-xs md:text-sm font-bold rounded-t-lg transition-all relative whitespace-nowrap ${activeModalTab === i ? 'text-[#CB460C]' : 'text-[#a89080] hover:text-[#6b5b4f]'}`}
                      >
                        {tab}
                        {activeModalTab === i && (
                          <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CB460C] rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#a89080] hover:bg-[#F7EAE5] hover:text-[#CB460C] transition-colors shrink-0"
                  >
                    <IconClose />
                  </button>
                </div>

                {/* Scrollable tab content */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-7">

                  {/* ── Tab 0: About ── */}
                  {activeModalTab === 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      {/* Description */}
                      <p className="text-[#4a3b33] leading-relaxed text-[15px]">
                        {language === 'EN' ? selectedArtist.description : selectedArtist.descriptionBN}
                      </p>

                      {/* Famous song */}
                      <div className="bg-[#F7EAE5]/60 rounded-xl p-5 flex items-center gap-4 border border-[#e5d5cd]">
                        <div className="w-10 h-10 rounded-full bg-[#CB460C] flex items-center justify-center text-white shrink-0">
                          <IconMusic />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold">{t('artist.card.famousSong')}</p>
                          <p className="font-display text-lg text-[#1a1005]">
                            {language === 'EN' ? selectedArtist.famousSong : selectedArtist.famousSongBN}
                          </p>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#FEFCFB] border border-[#e5d5cd] rounded-xl p-4">
                          <p className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold mb-2">
                            {language === 'EN' ? 'Instruments' : 'বাদ্যযন্ত্র'}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(language === 'EN' ? selectedArtist.instruments : selectedArtist.instrumentsBN).map((inst, i) => (
                              <span key={i} className="px-2.5 py-1 bg-[#F7EAE5] text-[#8b5e3c] text-xs rounded-lg font-medium">{inst}</span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Tags */}
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold mb-3">
                          {language === 'EN' ? 'Specializations' : 'বিশেষত্ব'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(language === 'EN' ? selectedArtist.tags : selectedArtist.tagsBN).map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 border border-[#e5d5cd] text-[#6b5b4f] text-xs rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Booking CTA removed */}
                    </motion.div>
                  )}

                  {/* ── Tab 1: Artistic Portfolio ── */}
                  {activeModalTab === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="text-sm text-[#a89080] mb-6">
                        {language === 'EN'
                          ? `A selection of ${selectedArtist.name}'s recorded work and performances.`
                          : `${selectedArtist.nameBN}-এর রেকর্ড করা কাজ এবং পরিবেশনার একটি নির্বাচন।`}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedArtist.sampleWorks.map(work => (
                          <SampleWorkCard
                            key={work.id}
                            work={work}
                            language={language}
                            onClick={() => setActiveWork(work)}
                          />
                        ))}
                      </div>
                      <div className="mt-8 p-5 bg-[#F7EAE5]/50 rounded-xl border border-[#e5d5cd] text-center">
                        <p className="text-sm text-[#6b5b4f]">
                          {language === 'EN'
                            ? 'Interested in the cultural heritage? Explore more artists from the collection.'
                            : 'সাংস্কৃতিক ঐতিহ্যে আগ্রহী? সংগ্রহ থেকে আরও শিল্পী অন্বেষণ করুন।'}
                        </p>
                      </div>
                    </motion.div>
                  )}



                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Media Player Modals ───────────────────────────────────── */}
      <AnimatePresence>
        {activeWork && activeWork.type === 'song' && (
          <AudioPlayerModal
            key="audio-player"
            work={activeWork}
            artistName={selectedArtist ? (language === 'EN' ? selectedArtist.name : selectedArtist.nameBN) : ''}
            onClose={() => setActiveWork(null)}
          />
        )}
        {activeWork && activeWork.type === 'video' && (
          <VideoPlayerModal
            key="video-player"
            work={activeWork}
            artistName={selectedArtist ? (language === 'EN' ? selectedArtist.name : selectedArtist.nameBN) : ''}
            onClose={() => setActiveWork(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeetTheArtistPage;
