import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARCHIVE_CATEGORIES, MOCK_ARCHIVE_ITEMS, ArchiveItem } from '../data/archiveData';
import Logo from '../components/ui/Logo';

const ArchivePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState('Artist');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return [];
    return MOCK_ARCHIVE_ITEMS.filter((item: ArchiveItem) => {
      const matchesCategory = item.category === activeCategory;
      const matchesSubcategory = activeSubcategory ? item.subcategory === activeSubcategory : true;
      return matchesCategory && matchesSubcategory;
    });
  }, [activeCategory, activeSubcategory]);

  const currentCategory = ARCHIVE_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#DEDDDD] pt-12 pb-24 px-4 sm:px-6 md:px-12 lg:px-24 font-body overflow-x-hidden">
      
      <AnimatePresence mode="wait">
        {!activeCategory ? (
          /* SECTION 1: Category Selection View */
          <motion.section
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto space-y-12 sm:space-y-16"
          >
            <div className="text-center space-y-4 pt-10">
              <h2 className="text-[#4A4A4A] text-2xl md:text-3xl font-display font-normal opacity-80 leading-snug">
                Overall Content about this archive
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 px-0 sm:px-4">
              {ARCHIVE_CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -12 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className="cursor-pointer group overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <div className="h-40 sm:h-48 relative group">
                    <img 
                      src={cat.image} 
                      alt={cat.label} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-8 sm:p-10 h-32 sm:h-36 flex flex-col justify-center">
                    <h3 className="text-ink font-display text-lg sm:text-xl leading-tight font-medium group-hover:text-brand-primary transition-colors">
                      {cat.label}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : (
          /* SECTION 2: Singular Dashboard View */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col min-h-[600px] sm:min-h-[800px] border border-white/20"
          >
            {/* Integrated Header */}
            <header className="px-6 sm:px-12 py-6 sm:py-10 flex flex-col gap-6 sm:flex-row items-center justify-between bg-white relative z-30 border-b border-border/10 sm:border-none">
              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <button 
                  onClick={() => setActiveCategory(null)}
                  aria-label="Back to selection"
                  className="p-3 hover:bg-surface-warm rounded-full transition-colors group shrink-0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div className="flex items-center gap-2 sm:gap-3 mr-auto">
                   <Logo variant="color" height={36} />
                   <div className="ml-1 sm:ml-2">
                      <span className="text-[9px] sm:text-[10px] text-brand-primary uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold block opacity-40">Sundargaan</span>
                      <span className="text-xs sm:text-sm font-display font-bold text-ink tracking-tight opacity-80 italic leading-none">Archives</span>
                   </div>
                </div>
              </div>

              {/* Centered Filter Tabs - Horizontal Scroll on Mobile */}
              <nav className="flex items-center gap-3 sm:gap-14 overflow-x-auto no-scrollbar w-full sm:w-auto justify-center px-4 sm:px-0">
                {['Artist', 'Artefacts', 'Genre'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border shrink-0 ${
                      filterTab === tab ? 'text-[#FF4B4B] border-[#FF4B4B] bg-[#FF4B4B]/5 font-black' : 'text-ink-subtle/30 border-transparent hover:text-ink'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>

              <div className="w-12 h-12 hidden lg:block" />
            </header>

            {/* Content Body - Mobile Header Nav + Grid */}
            <div className="flex flex-1 flex-col md:flex-row border-t border-border/40 min-h-0">
               {/* Fixed Sidebar for Desktop / Horizontal Strip for Mobile */}
               <aside className="w-full md:w-72 border-r border-border/30 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.01)] z-10 overflow-hidden shrink-0">
                 <div className="p-4 sm:p-12 md:h-full">
                    <ul className="flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar gap-4 sm:gap-6 md:space-y-6 px-4 md:px-0">
                      <li 
                        onClick={() => setActiveSubcategory(null)}
                        className={`cursor-pointer text-sm sm:text-[15px] transition-all duration-300 flex items-center gap-4 shrink-0 px-4 py-2 md:p-0 rounded-full md:rounded-none ${
                          activeSubcategory === null ? 'text-black font-bold bg-surface-warm md:bg-transparent' : 'text-[#BBBBBB] hover:text-ink'
                        }`}
                      >
                         <span>All Areas</span>
                      </li>
                      {currentCategory?.subcategories.map((sub: string) => (
                        <li
                          key={sub}
                          onClick={() => setActiveSubcategory(sub)}
                          className={`cursor-pointer text-sm sm:text-[15px] transition-all duration-300 flex items-center gap-4 shrink-0 px-4 py-2 md:p-0 rounded-full md:rounded-none ${
                            activeSubcategory === sub ? 'text-black font-bold bg-surface-warm md:bg-transparent' : 'text-[#BBBBBB] hover:text-ink'
                          }`}
                        >
                           <span>Block {sub}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
               </aside>

               {/* Grid Content Area */}
               <main className="flex-1 p-6 sm:p-10 md:p-14 bg-[#FAFAFA]/60 overflow-y-auto h-full max-h-screen">
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
                         <div className="aspect-square bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden transition-all duration-700 shadow-sm border border-border/40 group-hover:shadow-2xl group-hover:-translate-y-1 sm:group-hover:-translate-y-2 relative">
                           <img 
                            src={item.mediaUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                           />
                           <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
                 
                 {filteredItems.length === 0 && (
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
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            />
            
            <motion.div
              layoutId={`detail-${selectedItem.id}`}
              className="relative w-full h-full sm:h-fit max-w-7xl bg-white rounded-none sm:rounded-[3rem] md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col max-h-[100vh] sm:max-h-[90vh]"
            >
               {/* Close Button - Sticky/Fixed for Mobile */}
               <button 
                  onClick={() => setSelectedItem(null)}
                  aria-label="Close detail view"
                  className="absolute top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-surface-warm/80 backdrop-blur text-ink hover:bg-brand-primary hover:text-white transition-all shadow-lg sm:shadow-none"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>

               {/* Detail Header - Horizontal Scroll Pills */}
               <header className="flex items-center justify-center mt-12 sm:mt-16 mb-8 sm:mb-12 px-6 overflow-x-auto no-scrollbar shrink-0">
                  <nav className="flex items-center gap-4 sm:gap-6">
                    {['Artist', 'Artefacts', 'Genre'].map((tab) => (
                      <div
                        key={tab}
                        className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border transition-all duration-500 shrink-0 ${
                          tab === 'Artist' ? 'text-[#FF4B4B] border-[#FF4B4B] bg-[#FF4B4B]/5' : 'text-[#BBBBBB] border-transparent'
                        }`}
                      >
                        {tab}
                      </div>
                    ))}
                  </nav>
               </header>

               <div className="flex flex-1 min-h-0 overflow-y-auto">
                  {/* Sidebar within Detail - Hidden on Mobile */}
                  <aside className="w-64 px-8 border-r border-border/10 hidden md:block shrink-0">
                     <ul className="space-y-4">
                        {currentCategory?.subcategories.map(sub => (
                          <li 
                            key={sub} 
                            className={`text-sm tracking-wide font-medium transition-colors ${
                              selectedItem.subcategory === sub ? 'text-black font-bold' : 'text-[#BBBBBB]'
                            }`}
                          >
                            Block {sub}
                          </li>
                        ))}
                     </ul>
                  </aside>

                  {/* Main Gallery Area */}
                  <div className="flex-1 flex flex-col px-6 sm:px-12 space-y-8 sm:space-y-12 pb-12 sm:pb-20">
                    {/* Top Row: Hero Image + Description (Vertical on Mobile) */}
                    <div className="flex flex-col xl:flex-row gap-8 sm:gap-16 items-start">
                       <div className="w-full xl:w-[480px] aspect-square sm:aspect-[4/5] bg-[#EEEEEE] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-lg shrink-0">
                          <img 
                            src={selectedItem.mediaUrl} 
                            alt={selectedItem.title} 
                            className="w-full h-full object-cover" 
                          />
                       </div>
                       
                       <div className="flex-1 space-y-4 sm:space-y-6">
                          <h2 className="text-2xl sm:text-3xl font-display font-bold text-black border-b border-border/10 pb-4">
                            {selectedItem.title}
                          </h2>
                          
                          <div className="grid grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-6 sm:gap-x-12 py-6 sm:py-8 border-b border-border/10">
                             <div className="space-y-1">
                                <span className="text-[9px] sm:text-[10px] text-[#BBBBBB] uppercase tracking-widest font-bold">Archive ID</span>
                                <p className="text-xs sm:text-sm font-medium text-black">#SG-{selectedItem.id.toUpperCase()}</p>
                             </div>
                             <div className="space-y-1">
                                <span className="text-[9px] sm:text-[10px] text-[#BBBBBB] uppercase tracking-widest font-bold">Category</span>
                                <p className="text-xs sm:text-sm font-medium text-black">{selectedItem.subcategory}</p>
                             </div>
                             <div className="space-y-1">
                                <span className="text-[9px] sm:text-[10px] text-[#BBBBBB] uppercase tracking-widest font-bold">Medium</span>
                                <p className="text-xs sm:text-sm font-medium text-black">{selectedItem.mediaType === 'image' ? 'Photography' : 'Video'}</p>
                             </div>
                             <div className="space-y-1">
                                <span className="text-[9px] sm:text-[10px] text-[#BBBBBB] uppercase tracking-widest font-bold">Collection</span>
                                <p className="text-xs sm:text-sm font-medium text-black">Sundargram</p>
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                             {selectedItem.tags.map(tag => (
                               <span key={tag} className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#F5F5F5] text-[9px] sm:text-[10px] font-bold text-[#888888] rounded-full uppercase tracking-widest border border-border/10">
                                 {tag}
                               </span>
                             ))}
                          </div>

                          <p className="text-[#666666] leading-relaxed text-base sm:text-lg font-body pt-4 sm:pt-6 italic">
                            "{selectedItem.description}"
                          </p>
                       </div>
                    </div>

                    {/* Bottom Row: Related Content */}
                    <div className="space-y-4">
                        <span className="text-[9px] sm:text-[10px] text-[#BBBBBB] uppercase tracking-widest font-bold block opacity-40">Related Observations</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="aspect-[4/3] bg-[#E5E5E5] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden group">
                                 <img 
                                  src={`https://picsum.photos/seed/${selectedItem.id}-${i}/400`} 
                                  alt="related" 
                                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                                 />
                              </div>
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
