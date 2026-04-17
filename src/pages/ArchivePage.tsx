import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARCHIVE_CATEGORIES, MOCK_ARCHIVE_ITEMS, ArchiveItem } from '../data/archiveData';
import logoCol from '../assets/sundargaan_logo_col.svg';
import { getArchiveItems, getArchiveFilters } from '../api/archive';

const MALE_PLACEHOLDER = 'https://res.cloudinary.com/drgb8w8ak/image/upload/v1775627147/sundargaan/images/civdwpyjq7nfbbhfdzjd.jpg';
const FEMALE_PLACEHOLDER = 'https://res.cloudinary.com/drgb8w8ak/image/upload/v1775627663/sundargaan/images/btkiflhui40kkn6p735b.jpg';

const guessGender = (name: string): 'Male' | 'Female' => {
  const femaleNames = ['sneha', 'anushka', 'indrakshi', 'mallika', 'nibha', 'niva', 'ankita', 'ankana', 'putul', 'aparana', 'aparna', 'lakshmi', 'saraswati', 'reka', 'rekha', 'pinky', 'tumpa', 'rita', 'gita', 'mita'];
  const n = name.toLowerCase();
  if (femaleNames.some(fn => n.includes(fn))) return 'Female';
  // Common feminine endings for Bengali names in transliteration
  if (n.endsWith('a') || n.endsWith('i') || n.endsWith('ee')) return 'Female';
  return 'Male';
};

const ArchivePage: React.FC = () => {
  const [activeCategory] = useState<string | null>('artists');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
        className="w-full mx-auto min-h-screen text-ink overflow-hidden flex flex-col relative z-20"
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
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0">

          {/* NEW: Top CTA Cards Row */}
          <div className="w-full px-8 sm:px-12 md:px-20 py-12 bg-white/40 border-b border-border/10 shrink-0 z-20 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[2000px] mx-auto">
              {ARCHIVE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="group relative h-48 sm:h-56 xl:h-64 rounded-[3rem] overflow-hidden border border-white bg-white/40 shadow-xl transition-all duration-700 hover:shadow-2xl hover:border-white/80"
                >
                  <div className="absolute inset-0">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover grayscale opacity-40 transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                    <span className="text-brand-primary text-[9px] font-bold uppercase tracking-[0.4em] mb-2 opacity-70">
                      Archive Category
                    </span>
                    <h3 className="text-ink font-display text-2xl xl:text-3xl leading-tight font-medium">
                      {cat.label}
                    </h3>
                    <p className="text-ink/40 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">
                      {cat.id === 'artists' ? 'Active Collection' : 'Coming Soon'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Body Wrapper */}
          <div className="flex flex-1 flex-col md:flex-row min-h-0 bg-white/20 relative z-10">
            {/* Sticky Sidebar */}
            <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border/10 bg-white/60 backdrop-blur-xl z-10 shrink-0 md:sticky md:top-0 md:self-start md:h-[calc(100vh-100px)]">
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
                    Filter by Region
                  </h3>
                  <div className="space-y-4">
                    <div
                      onClick={() => setActiveLocation(null)}
                      className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl border transition-all cursor-pointer ${activeLocation === null
                        ? 'bg-[#F7EAE5] border-[#CB460C]/40 text-[#CB460C] shadow-sm font-bold'
                        : 'bg-white border-[#e5d5cd] text-[#4a3b33] hover:bg-[#F7EAE5]'
                        }`}
                    >
                      <span className="text-sm tracking-wide">All Locations</span>
                    </div>

                    {locations.map((loc: string) => (
                      <div
                        key={loc}
                        onClick={() => setActiveLocation(loc)}
                        className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl border transition-all cursor-pointer ${activeLocation === loc
                          ? 'bg-[#F7EAE5] border-[#CB460C]/40 text-[#CB460C] shadow-sm font-bold'
                          : 'bg-white border-[#e5d5cd] text-[#4a3b33] hover:bg-[#F7EAE5]'
                          }`}
                      >
                        <span className="text-sm tracking-wide">{loc}</span>
                      </div>
                    ))}
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

              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-display font-medium text-ink flex items-center gap-4">
                  <span>Collections</span>
                  <span className="h-[1px] w-20 bg-border/40" />
                </h2>
                <div className="text-[10px] text-ink-subtle uppercase tracking-widest font-bold">
                  Showing {filteredItems.length} Records
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

                  <div className="flex items-center gap-3">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-brand-primary text-white' : 'hover:bg-white border border-transparent hover:border-border/40'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
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

                  {/* Bottom Row: Contextual Images */}
                  <div className="space-y-8 pt-12 border-t border-border/10">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[12px] text-ink-subtle uppercase tracking-[0.3em] font-bold">Contextual Documentation</h5>
                      <div className="h-[1px] flex-1 bg-border/20 mx-8 hidden sm:block" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="aspect-[4/3] bg-surface-warm rounded-[2rem] overflow-hidden group border border-border/10 cursor-zoom-in"
                        >
                          <img
                            src={`https://picsum.photos/seed/${selectedItem.id}-${i}/600`}
                            alt="related documentation"
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                          />
                        </motion.div>
                      ))}
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
