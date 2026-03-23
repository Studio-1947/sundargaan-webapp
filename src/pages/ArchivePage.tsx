import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARCHIVE_CATEGORIES, MOCK_ARCHIVE_ITEMS, ArchiveItem } from '../data/archiveData';

const ArchivePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(ARCHIVE_CATEGORIES[0].id);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState('Artist');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  const filteredItems = useMemo(() => {
    return MOCK_ARCHIVE_ITEMS.filter(item => {
      const matchesCategory = item.category === activeCategory;
      const matchesSubcategory = activeSubcategory ? item.subcategory === activeSubcategory : true;
      // In a real app, filterTab would filter by tags or other metadata
      return matchesCategory && matchesSubcategory;
    });
  }, [activeCategory, activeSubcategory]);

  const currentCategory = ARCHIVE_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar - Left */}
      <aside className="w-full md:w-80 lg:w-96 bg-surface-warm/30 border-r border-border p-8 flex flex-col gap-12 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto hidden md:flex">
        <div className="space-y-6">
          <h2 className="text-[#a89080] font-body text-xs uppercase tracking-[0.2em] font-bold">Categories</h2>
          <nav className="flex flex-col gap-4">
            {ARCHIVE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveSubcategory(null);
                }}
                className={`text-left font-display text-xl transition-all duration-300 hover:translate-x-1 ${
                  activeCategory === cat.id ? 'text-brand-primary font-medium' : 'text-ink-muted'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        {currentCategory && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-[#a89080] font-body text-xs uppercase tracking-[0.2em] font-bold">Sub-categories</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSubcategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                  activeSubcategory === null ? 'bg-brand-primary text-white' : 'bg-white border border-border text-ink-muted hover:border-brand-primary/50'
                }`}
              >
                All
              </button>
              {currentCategory.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                    activeSubcategory === sub ? 'bg-brand-primary text-white' : 'bg-white border border-border text-ink-muted hover:border-brand-primary/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header Section */}
        <section className="p-8 md:p-12 bg-white/50 border-b border-border">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-medium text-ink leading-tight">
              {currentCategory?.label}
            </h1>
            <p className="text-ink-muted text-lg max-w-2xl leading-relaxed">
              Explore the rich cultural tapestry and heritage of the Sundarbans. 
              {activeSubcategory && ` Showing results for ${activeSubcategory}.`}
            </p>
          </div>
        </section>

        {/* Filter Tabs & Grid Header */}
        <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {['Artist', 'Artefacts', 'Genre'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`font-body text-sm font-bold tracking-widest uppercase transition-colors relative py-2 ${
                  filterTab === tab ? 'text-brand-primary' : 'text-ink-subtle hover:text-ink'
                }`}
              >
                {tab}
                {filterTab === tab && (
                  <motion.div
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                  />
                )}
              </button>
            ))}
          </div>
          <p className="text-ink-subtle text-xs font-body font-bold">{filteredItems.length} ITEMS FOUND</p>
        </div>

        {/* The Grid */}
        <div className="p-6 md:p-10 flex-1 bg-[#fdfaf8]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item: ArchiveItem, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-border shadow-sm group-hover:shadow-xl transition-all duration-500 relative">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <p className="text-white font-body font-bold text-[10px] tracking-[0.2em] uppercase mb-1">{item.subcategory}</p>
                    <h3 className="text-white font-display text-lg font-medium">{item.title}</h3>
                  </div>
                </div>
                <div className="mt-4 px-2">
                  <h3 className="text-ink font-display text-base font-semibold group-hover:text-brand-primary transition-colors">{item.title}</h3>
                  <p className="text-ink-subtle text-xs font-body mt-1">{item.subcategory}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-ink-subtle space-y-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <p className="font-body text-sm font-medium">No items found in this section yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* Item Detail Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              layoutId={`item-${selectedItem.id}`}
              className="relative w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-full"
            >
              <button
                onClick={() => setSelectedItem(null)}
                aria-label="Close details"
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="w-full md:w-1/2 h-80 md:h-auto bg-ink-muted/10 relative">
                <img
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>

              <div className="flex-1 p-8 md:p-16 flex flex-col justify-center overflow-y-auto">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="text-brand-primary font-body text-sm font-bold tracking-[0.2em] uppercase">
                      {selectedItem.subcategory}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-medium text-ink leading-tight">
                      {selectedItem.title}
                    </h2>
                  </div>
                  
                  <p className="text-ink-muted text-lg md:text-xl leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {selectedItem.tags.map((tag: string) => (
                      <span key={tag} className="px-4 py-2 bg-surface-warm rounded-full text-xs font-body font-bold text-ink-muted border border-border">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <button className="px-10 py-5 bg-brand-primary text-white rounded-full font-body font-bold text-sm tracking-widest uppercase hover:bg-brand-1 transition-all shadow-lg hover:shadow-brand-primary/30">
                      Learn More
                    </button>
                    <button className="px-10 py-5 border border-border text-ink rounded-full font-body font-bold text-sm tracking-widest uppercase hover:bg-surface-warm transition-all">
                      Share Artefact
                    </button>
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
