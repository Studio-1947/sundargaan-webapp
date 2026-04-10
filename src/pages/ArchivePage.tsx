import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARCHIVE_CATEGORIES, MOCK_ARCHIVE_ITEMS, ArchiveItem } from '../data/archiveData';
import logoCol from '../assets/sundargaan_logo_col.svg';
import PremiumSundargaanText from '../components/ui/PremiumSundargaanText';
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch Items based on Category, Location, and Subcategory
  useEffect(() => {
    if (!activeCategory) return;
    setIsLoading(true);
    getArchiveItems({ 
      category: 'artists', // Unified pool for all digital archive views
      location: activeLocation || undefined,
      subcategory: activeSubcategory || undefined,
      limit: 100 
    })
      .then(res => {
        if (res.data.length > 0) {
          setArchiveItems(res.data);
        } else {
          // fall back to mock data
          let filtered = MOCK_ARCHIVE_ITEMS.filter(i => i.category === activeCategory);
          if (activeLocation) filtered = filtered.filter(i => i.subcategory === activeLocation); // Mock uses subcategory for location
          setArchiveItems(filtered);
        }
      })
      .catch(() => {
         let filtered = MOCK_ARCHIVE_ITEMS.filter(i => i.category === activeCategory);
         if (activeLocation) filtered = filtered.filter(i => i.subcategory === activeLocation);
         setArchiveItems(filtered);
      })
      .finally(() => setIsLoading(false));
  }, [activeCategory, activeLocation, activeSubcategory]);

  const filteredItems = archiveItems; // Filtering is done on server now

  const currentCategory = ARCHIVE_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#F7EAE5] text-[#1A1005] font-body overflow-x-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#E5D5CD]/20 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!activeCategory ? (
          /* SECTION 1: Premium Light Category Selection View */
          <motion.section
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center"
          >
            <div className="text-center space-y-6 mb-24 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block px-5 py-2 rounded-full border border-[#CB460C]/20 bg-white/40 backdrop-blur-md text-[10px] uppercase tracking-[0.4em] text-brand-primary font-bold mb-4 shadow-sm"
              >
                The Digital Archives
              </motion.div>

              <PremiumSundargaanText
                text="Immersive Portal to Sundarbans' Heritage"
                className="text-4xl md:text-7xl font-display text-ink font-light justify-center text-center leading-[1.1]"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-ink/60 text-sm md:text-lg font-body tracking-wider leading-relaxed max-w-2xl mx-auto"
              >
                Explore a curated collection of artefacts, meet the master craftsmen, and witness the sacred art forms that define the soul of the delta.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full px-4">
              {ARCHIVE_CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -15 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group cursor-pointer relative h-[550px] rounded-[3.5rem] overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl transition-all duration-700 hover:border-brand-primary/40 shadow-[0_20px_50px_rgba(203,70,12,0.05)] hover:shadow-[0_40px_80px_rgba(203,70,12,0.12)]"
                >
                  {/* Image Container with Parallax Effect */}
                  <div className="absolute inset-0">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-12 flex flex-col justify-end h-1/2">
                    <span className="text-brand-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      Explore Collection
                    </span>
                    <h3 className="text-ink font-display text-3xl md:text-4xl leading-tight font-light transition-all duration-500 group-hover:text-brand-primary">
                      {cat.label}
                    </h3>
                    <div className="h-0 group-hover:h-12 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 pt-6">
                      <p className="text-ink/40 text-xs font-body tracking-[0.1em] line-clamp-1 italic">
                        {cat.subcategories.join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-10 right-10 w-14 h-14 rounded-full border border-[#CB460C]/10 flex items-center justify-center backdrop-blur-md bg-white/20 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-700 shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-28 flex flex-col items-center gap-6"
            >
              {/* <div className="w-[1px] h-16 bg-gradient-to-b from-brand-primary to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.6em] font-bold text-ink/30">Scroll to immerse</span> */}
            </motion.div>
          </motion.section>
        ) : (
          /* SECTION 2: Singular Dashboard View */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.02, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mx-auto min-h-screen text-ink overflow-hidden flex flex-col relative z-20"
          >
            {/* Integrated Header */}
            <header className="px-6 sm:px-12 py-8 flex flex-col gap-6 sm:flex-row items-center justify-between bg-white relative z-30 border-b border-border/20">
              <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                <button
                  onClick={() => { 
                    setActiveCategory(null); 
                    setActiveSubcategory(null); 
                    setActiveLocation(null);
                    setArchiveItems([]); 
                  }}
                  aria-label="Back to selection"
                  className="w-12 h-12 flex items-center justify-center hover:bg-surface-warm rounded-full transition-all group shrink-0 border border-border/40"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div className="flex items-center gap-4">
                  <img src={logoCol} alt="Sundargaan" className="h-10 w-auto" />
                  <div className="h-8 w-[1px] bg-border mr-2" />
                  <div>
                    <span className="text-[10px] text-brand-primary uppercase tracking-[0.3em] font-bold block opacity-60 leading-none mb-1">Archive</span>
                    <span className="text-lg font-display font-medium text-ink tracking-tight leading-none capitalize">{activeCategory?.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Centered Filter Tabs for Subcategories (Art Forms / Genres) */}
              <nav className="flex items-center gap-2 p-1.5 bg-surface-warm/50 rounded-full border border-border/30 max-w-[50%] overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveSubcategory(null)}
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 px-8 py-2.5 rounded-full shrink-0 ${activeSubcategory === null ? 'bg-white text-brand-primary shadow-sm border border-border/40' : 'text-ink-subtle/50 hover:text-ink'
                    }`}
                >
                  All Genres
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 px-8 py-2.5 rounded-full shrink-0 ${activeSubcategory === sub ? 'bg-white text-brand-primary shadow-sm border border-border/40' : 'text-ink-subtle/50 hover:text-ink'
                      }`}
                  >
                    {sub}
                  </button>
                ))}
              </nav>

              <div className="hidden lg:flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-warm border border-border/40 flex items-center justify-center cursor-help" title="Archive Information">
                  <span className="text-xs font-bold text-brand-primary">i</span>
                </div>
              </div>
            </header>

            {/* Content Body - Mobile Header Nav + Grid */}
            <div className="flex flex-1 flex-col md:flex-row border-t border-border/40 min-h-0">
              {/* Fixed Sidebar for Desktop / Horizontal Strip for Mobile */}
              <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-border/30 bg-white/40 backdrop-blur-md z-10 overflow-hidden shrink-0">
                <div className="p-4 sm:p-6 md:p-12 md:h-full">
                  <ul className="flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar gap-2 sm:gap-4 md:space-y-6 px-2 md:px-0">
                    <li
                      onClick={() => setActiveLocation(null)}
                      className={`cursor-pointer text-xs sm:text-[15px] transition-all duration-300 flex items-center gap-3 shrink-0 px-4 py-2 rounded-full border md:border-none ${activeLocation === null ? 'text-black font-bold bg-surface-warm border-border/40 md:bg-transparent' : 'text-[#BBBBBB] border-transparent hover:text-ink'
                        }`}
                    >
                      <span>All Locations</span>
                    </li>
                    {locations.map((loc: string) => (
                      <li
                        key={loc}
                        onClick={() => setActiveLocation(loc)}
                        className={`cursor-pointer text-xs sm:text-[15px] transition-all duration-300 flex items-center gap-3 shrink-0 px-4 py-2 rounded-full border md:border-none ${activeLocation === loc ? 'text-black font-bold bg-surface-warm border-border/40 md:bg-transparent' : 'text-[#BBBBBB] border-transparent hover:text-ink'
                          }`}
                      >
                        <span>{loc} <span className="text-[10px] opacity-40 ml-1">GP</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Grid Content Area */}
              <main className="flex-1 p-6 sm:p-10 md:p-14 bg-[#F7EAE5]/60 overflow-y-auto h-full max-h-screen">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                               <span className="text-[9px] text-white/60 uppercase tracking-widest font-bold mb-1 block">
                                 {item.subcategory} {item.location ? `• ${item.location}` : ''}
                               </span>
                               <h4 className="text-white font-medium text-sm line-clamp-1">{item.title}</h4>
                             </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {!isLoading && filteredItems.length === 0 && (
                  <div className="h-64 sm:h-96 flex flex-col items-center justify-center p-12 text-ink-subtle/40 italic font-display text-center">
                    Exploring the collection...
                  </div>
                )}
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
