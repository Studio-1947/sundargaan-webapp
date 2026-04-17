import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARCHIVE_CATEGORIES, MOCK_ARCHIVE_ITEMS, ArchiveItem } from '../data/archiveData';
import logoCol from '../assets/sundargaan_logo_col.svg';
import { getArchiveItems, getArchiveFilters } from '../api/archive';

import malePlaceholder from '../assets/thumbnails/Thumbnail_1_male.jpeg';
import femalePlaceholder from '../assets/thumbnails/Thumbnail_2_female.jpeg';

const MALE_PLACEHOLDER = malePlaceholder;
const FEMALE_PLACEHOLDER = femalePlaceholder;

const guessGender = (name: string): 'Male' | 'Female' => {
  const femaleNames = ['sneha', 'anushka', 'indrakshi', 'mallika', 'nibha', 'niva', 'ankita', 'ankana', 'putul', 'aparana', 'aparna', 'lakshmi', 'saraswati', 'reka', 'rekha', 'pinky', 'tumpa', 'rita', 'gita', 'mita'];
  const n = name.toLowerCase();
  if (femaleNames.some(fn => n.includes(fn))) return 'Female';
  // Common feminine endings for Bengali names in transliteration
  if (n.endsWith('a') || n.endsWith('i') || n.endsWith('ee')) return 'Female';
  return 'Male';
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'artefacts': 'Explore physical objects, instruments, and traditional tools from the delta.',
  'artists': 'Discover the master craftsmen, performers, and bearers of our traditions.',
  'art-forms': 'Dive into the sacred music, dance, and rituals that define the culture.'
};

const IconChevronDown = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ArchivePage: React.FC = () => {
  const [activeCategory] = useState<string | null>('artists');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeBlock, setActiveBlock] = useState<string | null>('Hingalganj');
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboardFullscreen, setIsDashboardFullscreen] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12; // 4-4-4 grid

  // Fetch Filters based on Category (Unified to artists for now as per user request)
  useEffect(() => {
    if (!activeCategory) return;
    getArchiveFilters('artists')
      .then(res => {
        setLocations(res.locations);
        setSubcategories(res.subcategories);
      })
      .catch(err => console.error('Failed to fetch filters:', err));
  }, [activeCategory]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeLocation, activeSubcategory]);

  // Fetch Items based on Category, Location, and Subcategory
  useEffect(() => {
    if (!activeCategory) return;
    setIsLoading(true);
    getArchiveItems({
      category: 'artists', // Unified pool for all digital archive views
      location: activeLocation || undefined,
      subcategory: activeSubcategory || undefined,
      page: currentPage,
      limit: itemsPerPage
    })
      .then(res => {
        if (res.data.length > 0) {
          setArchiveItems(res.data);
          setTotalPages(res.meta.totalPages);
        } else {
          // fall back to mock data
          let filtered = MOCK_ARCHIVE_ITEMS.filter(i => i.category === activeCategory);
          if (activeLocation) filtered = filtered.filter(i => i.subcategory === activeLocation);
          setArchiveItems(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
          setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        }
      })
      .catch(() => {
        let filtered = MOCK_ARCHIVE_ITEMS.filter(i => i.category === activeCategory);
        if (activeLocation) filtered = filtered.filter(i => i.subcategory === activeLocation);
        setArchiveItems(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      })
      .finally(() => setIsLoading(false));
  }, [activeCategory, activeLocation, activeSubcategory, currentPage]);

  const filteredItems = archiveItems; // Filtering is done on server now

  const getPaginationGroup = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isDashboardFullscreen && !hasAutoTriggered && e.currentTarget.scrollTop > 350) {
      setHasAutoTriggered(true);
      setIsDashboardFullscreen(true);
    }
  };

  const handleExitFullscreen = () => {
    setIsDashboardFullscreen(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  return (
    <div className="min-h-screen bg-[#F7EAE5] text-[#1A1005] font-body overflow-x-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#E5D5CD]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* SECTION 2: Singular Dashboard View (Now Always On) */}
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full mx-auto min-h-screen text-ink overflow-hidden flex flex-col relative ${isDashboardFullscreen ? 'z-[100]' : 'z-20'}`}
      >
        {/* Integrated Header */}
        <header className="px-6 sm:px-12 pt-28 pb-10 flex flex-col gap-8 sm:flex-row items-center justify-between bg-white relative z-30 border-b border-border/10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <img src={logoCol} alt="Sundargaan" className="h-10 w-auto" />
              <div className="h-8 w-[1px] bg-border/40 mx-2" />
              <div>
                <span className="text-[10px] text-brand-primary uppercase tracking-[0.4em] font-bold block opacity-60 leading-none mb-1">The Digital</span>
                <span className="text-xl font-display font-medium text-ink tracking-tight leading-none uppercase">Archives</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-warm border border-border/40 flex items-center justify-center cursor-help group" title="Archive Information">
              <span className="text-xs font-bold text-brand-primary group-hover:scale-110 transition-transform">i</span>
            </div>
          </div>
        </header>

        {/* Scrollable Container for Top Cards + Dashboard Split */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0"
        >

          {/* NEW: Top CTA Cards Row */}
          <div className="w-full px-8 sm:px-12 md:px-20 py-12 bg-white/40 border-b border-border/10 shrink-0 z-20 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[2000px] mx-auto">
              {ARCHIVE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="group flex flex-col bg-white/60 backdrop-blur-sm rounded-[2.5rem] border border-border/20 shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  {/* Artwork */}
                  <div className="w-full aspect-video overflow-hidden relative shrink-0">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Text & About */}
                  <div className="flex flex-col gap-3 p-8 sm:p-10 grow">
                    <h3 className="text-ink font-display text-2xl xl:text-3xl font-medium tracking-tight group-hover:text-brand-primary transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-ink/60 text-sm font-body leading-relaxed">
                      {CATEGORY_DESCRIPTIONS[cat.id]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Body Wrapper */}
          <div className={`flex flex-col md:flex-row transition-all duration-500 ease-in-out ${isDashboardFullscreen ? 'fixed inset-0 z-[100] bg-[#F7EAE5] overflow-y-auto' : 'flex-1 min-h-0 bg-white/20 relative z-10'}`}>
            {/* Sticky Sidebar */}
            <aside className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-border/10 bg-white/60 backdrop-blur-xl z-10 shrink-0 md:sticky md:top-0 md:self-start ${isDashboardFullscreen ? 'md:h-screen' : 'md:h-[calc(100vh-100px)]'}`}>
              <div className="p-8 sm:p-10 md:p-14 h-full flex flex-col overflow-y-auto no-scrollbar space-y-10">
                {/* Clear Filters */}
                {(activeLocation !== null || activeSubcategory !== null) && (
                  <button
                    onClick={() => { setActiveLocation(null); setActiveSubcategory(null); }}
                    className="w-full text-center text-xs text-[#CB460C] font-bold uppercase tracking-widest py-3 border border-[#CB460C]/30 rounded-full hover:bg-[#CB460C] hover:text-white transition-all shadow-sm"
                  >
                    Clear all filters
                  </button>
                )}

                {/* Location Filter */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#a89080] px-2 mb-2">
                    Location
                  </h3>
                  <div className="space-y-6">
                    {['Hingalganj'].map(block => {
                      const isActive = activeBlock === block;

                      return (
                        <div key={block} className="space-y-3">
                          {/* Block Header / Dropdown Trigger */}
                          <div
                            onClick={() => setActiveBlock(isActive ? null : block)}
                            className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border bg-[#F7EAE5] border-[#CB460C]/20 text-[#CB460C] shadow-sm relative group/block cursor-pointer hover:bg-[#F7EAE5]/80 transition-all"
                          >
                            <span className="font-bold text-sm tracking-wide">{block}</span>

                            <div className="relative flex items-center group/arrow">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#CB460C]/10 transition-all duration-300 ${isActive ? 'rotate-180' : ''}`}
                              >
                                <IconChevronDown className="text-[#CB460C]" />
                              </div>

                              <div className="absolute right-0 top-full mt-3 opacity-0 group-hover/arrow:opacity-100 transition-all duration-300 pointer-events-none z-50">
                                <div className="bg-[#1a1005] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#CB460C] animate-pulse" />
                                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                                    Other blocks coming soon
                                  </span>
                                </div>
                                <div className="absolute bottom-full right-3 w-2 h-2 bg-[#1a1005] rotate-45 border-t border-l border-white/10 -mb-1" />
                              </div>
                            </div>
                          </div>

                          {/* Locations List (Always show for the active block) */}
                          {isActive && locations.length > 0 && (
                            <div className="pl-6 space-y-1 relative mt-3">
                              <div className="absolute left-[35.5px] top-4 bottom-4 w-px bg-[#CB460C]/20" />
                              {locations.map((loc, i) => (
                                <button
                                  key={i}
                                  onClick={() => setActiveLocation(activeLocation === loc ? null : loc)}
                                  className="group flex items-center gap-4 py-2 text-left w-full focus:outline-none"
                                >
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border transition-all ${activeLocation === loc ? 'bg-[#CB460C] border-[#CB460C]' : 'bg-[#F7EAE5] border-[#CB460C]/20 group-hover:bg-[#CB460C]/10'}`}>
                                    <div className={`w-2 h-2 rounded-full ${activeLocation === loc ? 'bg-white' : 'bg-[#CB460C]'}`} />
                                  </div>
                                  <span className={`text-sm tracking-wide transition-colors ${activeLocation === loc ? 'text-[#CB460C] font-semibold' : 'text-[#a89080] group-hover:text-[#6b5b4f]'}`}>
                                    {loc}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Genre Filter */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#a89080] px-2 mb-2">
                    Select Genre
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveSubcategory(null)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border transition-all ${activeSubcategory === null
                        ? 'bg-[#CB460C] border-[#CB460C] text-white shadow-md'
                        : 'bg-white border-[#e5d5cd] text-[#4a3b33] hover:bg-[#F7EAE5]'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${activeSubcategory === null ? 'border-white' : 'border-[#CB460C]'}`}>
                        {activeSubcategory === null && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-[10px] font-bold truncate uppercase tracking-wider">All Genres</span>
                    </button>

                    {subcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setActiveSubcategory(sub)}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl border transition-all ${activeSubcategory === sub
                          ? 'bg-[#CB460C] border-[#CB460C] text-white shadow-md'
                          : 'bg-white border-[#e5d5cd] text-[#4a3b33] hover:bg-[#F7EAE5]'
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${activeSubcategory === sub ? 'border-white' : 'border-[#CB460C]'}`}>
                          {activeSubcategory === sub && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-[10px] font-bold truncate uppercase tracking-wider">{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-10 hidden md:block">
                  <div className="p-8 rounded-[2.5rem] bg-brand-primary/5 border border-brand-primary/10">
                    <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.2em] mb-4">Support the Archive</p>
                    <p className="text-xs text-ink/60 leading-relaxed mb-6">Your contributions help us document and preserve the vanishing heritage of the delta.</p>
                    <button className="w-full py-3 bg-brand-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-secondary transition-colors">Donate Now</button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Grid Content Area */}
            <main className="flex-1 p-8 sm:p-12 md:p-20 bg-[#F7EAE5]/30">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
                <h2 className="text-2xl font-display font-medium text-ink flex items-center gap-4">
                  <span>Collections</span>
                  <span className="h-[1px] w-12 sm:w-20 bg-border/40" />
                </h2>
                
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-[10px] text-ink-subtle uppercase tracking-widest font-bold hidden md:block">
                    Showing {filteredItems.length} Records
                  </div>
                  
                  {/* Fullscreen Mode Toggle */}
                  <button
                    onClick={isDashboardFullscreen ? handleExitFullscreen : () => setIsDashboardFullscreen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#CB460C]/20 text-[#CB460C] hover:bg-[#CB460C] hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest bg-white shadow-sm"
                  >
                    {isDashboardFullscreen ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
                        <span>Exit Full Screen</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                        <span>Full Screen</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-white rounded-[1.5rem] sm:rounded-[2rem] animate-pulse border border-border/40" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item: ArchiveItem, idx: number) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        onClick={() => setSelectedItem(item)}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-[3/4] bg-white rounded-[2rem] overflow-hidden transition-all duration-700 shadow-sm border border-border/40 group-hover:shadow-2xl group-hover:-translate-y-2 relative">
                          <img
                            src={item.mediaUrl && item.mediaUrl !== '' ? item.mediaUrl : (guessGender(item.title) === 'Female' ? FEMALE_PLACEHOLDER : MALE_PLACEHOLDER)}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          {/* Hover Overlay - keep for effects but remove text */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Permanent Text Below Card */}
                        <div className="mt-4 px-2">
                          <h4 className="text-ink font-medium text-sm line-clamp-1 group-hover:text-brand-primary transition-colors">{item.title}</h4>
                          <p className="text-[10px] text-ink-subtle uppercase tracking-widest font-bold mt-1">
                            {item.subcategory} {item.location ? `• ${item.location}` : ''}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination Controls */}
              {!isLoading && totalPages > 1 && (
                <div className="mt-16 pt-8 border-t border-border/20 flex items-center justify-center gap-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-2 rounded-full border border-border/40 hover:bg-white text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 transition-all flex items-center gap-2 group"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Prev
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                    {getPaginationGroup().map((page, i) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-ink-subtle/50 text-xs font-bold font-display">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${currentPage === page ? 'bg-[#CB460C] text-white shadow-md' : 'text-[#6b5b4f] hover:bg-white border border-transparent hover:border-[#CB460C]/20 hover:text-[#CB460C]'}`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-2 rounded-full border border-border/40 hover:bg-white text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 transition-all flex items-center gap-2 group"
                  >
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              )}


              {!isLoading && filteredItems.length === 0 && (
                <div className="h-64 sm:h-96 flex flex-col items-center justify-center p-12 text-ink-subtle/40 italic font-display text-center">
                  Exploring the collection...
                </div>
              )}
            </main>
          </div>
        </div>
      </motion.div>



      {/* Item Detail Overlay - MOBILE OPTIMIZED */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 md:p-12 lg:p-24 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white/60 backdrop-blur-xl"
              onClick={() => setSelectedItem(null)}
            />

            <motion.div
              layoutId={`detail-${selectedItem.id}`}
              className="relative w-full h-full sm:h-fit max-w-7xl bg-white/90 backdrop-blur-2xl text-ink rounded-none sm:rounded-[4rem] shadow-[0_40px_100px_rgba(203,70,12,0.15)] border border-white overflow-hidden flex flex-col max-h-[100vh] sm:max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                aria-label="Close detail view"
                className="absolute top-10 right-10 z-[110] w-14 h-14 flex items-center justify-center rounded-full bg-surface-warm/80 backdrop-blur text-ink hover:bg-brand-primary hover:text-white transition-all shadow-xl"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="flex flex-1 min-h-0 overflow-y-auto">
                {/* Main Gallery Area */}
                <div className="flex-1 flex flex-col px-8 sm:px-20 space-y-12 sm:space-y-20 py-20">
                  {/* Top Row: Hero Image + Description */}
                  <div className="flex flex-col xl:flex-row gap-12 sm:gap-24 items-start">
                    <div className="w-full xl:w-[540px] aspect-[4/5] bg-surface-warm rounded-[3rem] overflow-hidden shadow-2xl shrink-0 border border-border/20">
                      <img
                        src={selectedItem.mediaUrl && selectedItem.mediaUrl !== '' ? selectedItem.mediaUrl : (guessGender(selectedItem.title) === 'Female' ? FEMALE_PLACEHOLDER : MALE_PLACEHOLDER)}
                        alt={selectedItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-10">
                      <div className="space-y-4">
                        <span className="text-[10px] text-brand-primary uppercase tracking-[0.4em] font-bold">Documented Heritage</span>
                        <h2 className="text-4xl sm:text-6xl font-display font-light text-ink leading-tight">
                          {selectedItem.title}
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-y-10 py-10 border-y border-border/20">
                        <div className="space-y-2">
                          <span className="text-[10px] text-ink-subtle uppercase tracking-widest font-bold">Archive ID</span>
                          <p className="text-base font-medium text-ink">#SG-{selectedItem.id.toUpperCase()}</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] text-ink-subtle uppercase tracking-widest font-bold">Category</span>
                          <p className="text-base font-medium text-brand-primary">{selectedItem.subcategory}</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] text-ink-subtle uppercase tracking-widest font-bold">Medium</span>
                          <p className="text-base font-medium text-ink">Physical & Oral Tradition</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] text-ink-subtle uppercase tracking-widest font-bold">Collection</span>
                          <p className="text-base font-medium text-ink">Sundargram Archives</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <p className="text-ink-muted leading-relaxed text-xl font-body font-light italic">
                          "{selectedItem.description}"
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {selectedItem.tags.map(tag => (
                            <span key={tag} className="px-5 py-2 bg-surface-warm text-[10px] font-bold text-ink-subtle rounded-full uppercase tracking-widest border border-border/40">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchivePage;
