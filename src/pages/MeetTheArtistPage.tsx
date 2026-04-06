import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_ARTISTS, ARTIST_BLOCKS, ARTIST_CATEGORIES, Artist, SampleWork } from '../data/artistData';
import { getArtists } from '../api/artists';
import { createBooking } from '../api/bookings';

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

const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconPlay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
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

// ─── Event types ─────────────────────────────────────────────────────────────

const EVENT_TYPES_EN = ['Select event type...', 'Wedding Ceremony', 'Cultural Festival', 'School / College Program', 'Corporate Event', 'Private Concert', 'Community Gathering', 'Other'];
const EVENT_TYPES_BN = ['অনুষ্ঠানের ধরন নির্বাচন করুন...', 'বিবাহ অনুষ্ঠান', 'সাংস্কৃতিক উৎসব', 'স্কুল / কলেজ অনুষ্ঠান', 'কর্পোরেট ইভেন্ট', 'একক সঙ্গীতানুষ্ঠান', 'সম্প্রদায়িক সমাবেশ', 'অন্যান্য'];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ArtistCardProps {
  artist: Artist;
  language: string;
  onBook: (a: Artist) => void;
  onKnowMore: (a: Artist) => void;
  index: number;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, language, onBook, onKnowMore, index }) => {
  const category = ARTIST_CATEGORIES.find(c => c.id === artist.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-[2rem] border border-[#e5d5cd] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 flex flex-col"
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
        {/* Availability badge */}
        <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${artist.availability ? 'bg-green-50/90 text-green-700' : 'bg-gray-100/90 text-gray-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${artist.availability ? 'bg-green-500' : 'bg-gray-400'}`} />
          {artist.availability ? (language === 'EN' ? 'Available' : 'উপলব্ধ') : (language === 'EN' ? 'Busy' : 'ব্যস্ত')}
        </div>
        {/* Experience tag at bottom */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-xs font-semibold">
          <IconClock />
          {artist.experience} {language === 'EN' ? 'yrs exp.' : 'বছর অভিজ্ঞতা'}
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1 gap-4">
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
        <div className="space-y-2 text-sm text-[#6b5b4f]">
          <div className="flex items-start gap-2">
            <span className="text-[#CB460C] mt-0.5 shrink-0"><IconMusic /></span>
            <span className="italic">{language === 'EN' ? artist.famousSong : artist.famousSongBN}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#CB460C] mt-0.5 shrink-0"><IconPin /></span>
            <span>{language === 'EN' ? artist.address : artist.addressBN}</span>
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

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {(language === 'EN' ? artist.tags : artist.tagsBN).slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2.5 py-1 border border-[#e5d5cd] text-[#a89080] text-[11px] rounded-full font-medium uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onBook(artist)}
            className="flex-1 bg-[#CB460C] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95"
          >
            {language === 'EN' ? 'Book Artist' : 'শিল্পী বুক করুন'}
          </button>
          <button
            onClick={() => onKnowMore(artist)}
            className="flex-1 border border-[#CB460C] text-[#CB460C] py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#F7EAE5] transition-all active:scale-95"
          >
            {language === 'EN' ? 'Know More' : 'আরও জানুন'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Sample Work Card ─────────────────────────────────────────────────────────

const SampleWorkCard: React.FC<{ work: SampleWork; language: string }> = ({ work, language }) => {
  const isMedia = work.type === 'song' || work.type === 'video';

  return (
    <div className="group rounded-xl overflow-hidden border border-[#e5d5cd] bg-white hover:shadow-md transition-all cursor-pointer">
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
  const [activeModalTab, setActiveModalTab] = useState(0); // 0 = About, 1 = Works, 2 = Book
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', eventType: '', date: '', venue: '', message: '' });
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

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
      return matchesSearch && matchesBlock && matchesCategory;
    });
  }, [artists, searchTerm, selectedBlock, selectedCategory]);

  const openModal = (artist: Artist, tab: number) => {
    setSelectedArtist(artist);
    setActiveModalTab(tab);
    setIsBookingSuccess(false);
    setBookingForm({ name: '', phone: '', eventType: '', date: '', venue: '', message: '' });
  };

  const closeModal = () => {
    setSelectedArtist(null);
    setIsBookingSuccess(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtist) return;
    setIsBookingSubmitting(true);
    try {
      await createBooking({
        artistId: selectedArtist.id,
        requesterName: bookingForm.name,
        phone: bookingForm.phone,
        eventType: bookingForm.eventType,
        eventDate: bookingForm.date || undefined,
        venue: bookingForm.venue || undefined,
        message: bookingForm.message || undefined,
      });
      setIsBookingSuccess(true);
      setTimeout(() => {
        setIsBookingSuccess(false);
        closeModal();
      }, 3000);
    } catch {
      // keep form open so the user can retry
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const eventTypes = language === 'EN' ? EVENT_TYPES_EN : EVENT_TYPES_BN;
  const category = selectedArtist ? ARTIST_CATEGORIES.find(c => c.id === selectedArtist.category) : null;

  const MODAL_TABS = language === 'EN'
    ? ['About', 'Sample Works', 'Book & Contact']
    : ['সম্পর্কে', 'নমুনা কাজ', 'বুকিং ও যোগাযোগ'];

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
              ? 'Discover, connect with, and book the living voices of the Sundarbans.'
              : 'সুন্দরবনের জীবন্ত কণ্ঠস্বরগুলো আবিষ্কার করুন, যোগাযোগ করুন এবং বুক করুন।'}
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
            <span className="w-px h-4 bg-[#e5d5cd]" />
            <span><strong className="text-[#1a1005]">{artists.filter(a => a.availability).length}</strong> {language === 'EN' ? 'Available Now' : 'এখন উপলব্ধ'}</span>
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

          {/* Clear filters */}
          {(selectedBlock || selectedCategory || searchTerm) && (
            <button
              onClick={() => { setSelectedBlock(null); setSelectedCategory(null); setSearchTerm(''); }}
              className="w-full text-center text-xs text-[#CB460C] font-bold uppercase tracking-widest py-2 border border-[#CB460C]/30 rounded-full hover:bg-[#F7EAE5] transition-colors"
            >
              {language === 'EN' ? 'Clear all filters' : 'সব ফিল্টার মুছুন'}
            </button>
          )}
        </aside>

        {/* Artist grid */}
        <main className="flex-1 min-w-0">
          {/* Result count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-[#a89080]">
              <strong className="text-[#1a1005]">{filteredArtists.length}</strong>{' '}
              {language === 'EN' ? `artist${filteredArtists.length !== 1 ? 's' : ''} found` : 'জন শিল্পী পাওয়া গেছে'}
            </p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {filteredArtists.map((artist, idx) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  language={language}
                  onBook={(a) => openModal(a, 2)}
                  onKnowMore={(a) => openModal(a, 0)}
                  index={idx}
                />
              ))}
            </div>
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
                    <IconPin /> {language === 'EN' ? selectedArtist.address : selectedArtist.addressBN}
                  </p>
                </div>

                {/* Availability + exp badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedArtist.availability ? 'bg-green-50/95 text-green-700' : 'bg-white/80 text-gray-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${selectedArtist.availability ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {selectedArtist.availability ? (language === 'EN' ? 'Available' : 'উপলব্ধ') : (language === 'EN' ? 'Busy' : 'ব্যস্ত')}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/80 text-[#6b5b4f]">
                    <IconClock /> {selectedArtist.experience} {language === 'EN' ? 'yrs' : 'বছর'}
                  </div>
                </div>
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
                        <div className="bg-[#FEFCFB] border border-[#e5d5cd] rounded-xl p-4">
                          <p className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold mb-2">
                            {language === 'EN' ? 'Experience' : 'অভিজ্ঞতা'}
                          </p>
                          <p className="text-2xl font-display text-[#CB460C]">{selectedArtist.experience} <span className="text-base text-[#6b5b4f]">{language === 'EN' ? 'years' : 'বছর'}</span></p>
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

                      <button
                        onClick={() => setActiveModalTab(2)}
                        className="w-full bg-[#CB460C] text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all"
                      >
                        {language === 'EN' ? 'Book this Artist' : 'এই শিল্পীকে বুক করুন'}
                      </button>
                    </motion.div>
                  )}

                  {/* ── Tab 1: Sample Works ── */}
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
                          <SampleWorkCard key={work.id} work={work} language={language} />
                        ))}
                      </div>
                      <div className="mt-8 p-5 bg-[#F7EAE5]/50 rounded-xl border border-[#e5d5cd] text-center">
                        <p className="text-sm text-[#6b5b4f]">
                          {language === 'EN'
                            ? 'Interested in a custom performance? Book the artist for your event.'
                            : 'কাস্টম পারফরম্যান্সে আগ্রহী? আপনার অনুষ্ঠানের জন্য শিল্পীকে বুক করুন।'}
                        </p>
                        <button
                          onClick={() => setActiveModalTab(2)}
                          className="mt-4 bg-[#CB460C] text-white px-8 py-3 rounded-full font-bold text-sm hover:brightness-110 transition-all"
                        >
                          {language === 'EN' ? 'Make a Booking' : 'বুকিং করুন'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Tab 2: Book & Contact ── */}
                  {activeModalTab === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      {/* Contact info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a
                          href={`tel:${selectedArtist.phone}`}
                          className="flex items-center gap-3 p-4 bg-[#FEFCFB] border border-[#e5d5cd] rounded-xl hover:border-[#CB460C]/40 hover:bg-[#F7EAE5]/50 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#F7EAE5] flex items-center justify-center text-[#CB460C] group-hover:bg-[#CB460C] group-hover:text-white transition-colors">
                            <IconPhone />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold">{t('artist.modal.contact')}</p>
                            <p className="text-sm font-semibold text-[#1a1005]">{selectedArtist.phone}</p>
                          </div>
                        </a>
                        <a
                          href={`mailto:${selectedArtist.email}`}
                          className="flex items-center gap-3 p-4 bg-[#FEFCFB] border border-[#e5d5cd] rounded-xl hover:border-[#CB460C]/40 hover:bg-[#F7EAE5]/50 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#F7EAE5] flex items-center justify-center text-[#CB460C] group-hover:bg-[#CB460C] group-hover:text-white transition-colors">
                            <IconMail />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold">Email</p>
                            <p className="text-sm font-semibold text-[#1a1005] truncate max-w-[140px]">{selectedArtist.email}</p>
                          </div>
                        </a>
                      </div>

                      <div className="h-px bg-[#e5d5cd]" />

                      {/* Booking form */}
                      <div>
                        <h3 className="font-display text-xl text-[#1a1005] mb-5">{t('artist.modal.booking')}</h3>

                        {isBookingSuccess ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                          >
                            <div className="text-4xl mb-3">✓</div>
                            <p className="font-bold text-green-700 text-lg mb-1">{t('artist.modal.success')}</p>
                            <p className="text-green-600 text-sm">
                              {language === 'EN'
                                ? 'The artist will get back to you shortly.'
                                : 'শিল্পী শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'}
                            </p>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold block mb-1.5">
                                  {t('artist.modal.name')} *
                                </label>
                                <input
                                  required
                                  type="text"
                                  value={bookingForm.name}
                                  onChange={e => setBookingForm(f => ({ ...f, name: e.target.value }))}
                                  placeholder={language === 'EN' ? 'Your full name' : 'আপনার পুরো নাম'}
                                  className="w-full h-11 px-4 rounded-xl border border-[#e5d5cd] focus:border-[#CB460C] outline-none text-sm bg-[#FEFCFB] text-[#1a1005]"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold block mb-1.5">
                                  {language === 'EN' ? 'Phone Number' : 'ফোন নম্বর'} *
                                </label>
                                <input
                                  required
                                  type="tel"
                                  value={bookingForm.phone}
                                  onChange={e => setBookingForm(f => ({ ...f, phone: e.target.value }))}
                                  placeholder="+91 00000 00000"
                                  className="w-full h-11 px-4 rounded-xl border border-[#e5d5cd] focus:border-[#CB460C] outline-none text-sm bg-[#FEFCFB] text-[#1a1005]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold block mb-1.5">
                                  {language === 'EN' ? 'Event Type' : 'অনুষ্ঠানের ধরন'} *
                                </label>
                                <select
                                  required
                                  value={bookingForm.eventType}
                                  onChange={e => setBookingForm(f => ({ ...f, eventType: e.target.value }))}
                                  className="w-full h-11 px-4 rounded-xl border border-[#e5d5cd] focus:border-[#CB460C] outline-none text-sm bg-[#FEFCFB] text-[#1a1005] appearance-none"
                                >
                                  {eventTypes.map((et, i) => (
                                    <option key={i} value={i === 0 ? '' : et} disabled={i === 0}>{et}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold block mb-1.5">
                                  {language === 'EN' ? 'Preferred Date' : 'পছন্দের তারিখ'}
                                </label>
                                <input
                                  type="date"
                                  value={bookingForm.date}
                                  onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full h-11 px-4 rounded-xl border border-[#e5d5cd] focus:border-[#CB460C] outline-none text-sm bg-[#FEFCFB] text-[#1a1005]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold block mb-1.5">
                                {language === 'EN' ? 'Venue / Location' : 'স্থান / ভেন্যু'}
                              </label>
                              <input
                                type="text"
                                value={bookingForm.venue}
                                onChange={e => setBookingForm(f => ({ ...f, venue: e.target.value }))}
                                placeholder={language === 'EN' ? 'Event venue or address' : 'অনুষ্ঠানের ভেন্যু বা ঠিকানা'}
                                className="w-full h-11 px-4 rounded-xl border border-[#e5d5cd] focus:border-[#CB460C] outline-none text-sm bg-[#FEFCFB] text-[#1a1005]"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] uppercase tracking-widest text-[#a89080] font-bold block mb-1.5">
                                {t('artist.modal.message')}
                              </label>
                              <textarea
                                rows={3}
                                value={bookingForm.message}
                                onChange={e => setBookingForm(f => ({ ...f, message: e.target.value }))}
                                placeholder={language === 'EN' ? 'Tell the artist about your event, any special requests...' : 'শিল্পীকে আপনার অনুষ্ঠান সম্পর্কে বলুন, যেকোনো বিশেষ অনুরোধ...'}
                                className="w-full p-4 rounded-xl border border-[#e5d5cd] focus:border-[#CB460C] outline-none text-sm bg-[#FEFCFB] text-[#1a1005] resize-none"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={isBookingSubmitting}
                              className="w-full bg-[#CB460C] text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isBookingSubmitting
                                ? (language === 'EN' ? 'Sending...' : 'পাঠানো হচ্ছে...')
                                : t('artist.modal.send')}
                            </button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeetTheArtistPage;
