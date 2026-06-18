import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCakes, FLAVORS, getAllTags } from '../utils/mockData';
import CakeCard from '../components/ui/CakeCard';
import CakeQuickView from '../components/ui/CakeQuickView';
import { Filter, X } from 'lucide-react';

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const flavorParam = searchParams.get('flavor');
  const tagParam = searchParams.get('tag');

  const [activeFlavor, setActiveFlavor] = useState(flavorParam || '');
  const [activeTag, setActiveTag] = useState(tagParam || '');
  const [selectedCake, setSelectedCake] = useState(null);

  const allTags = useMemo(() => getAllTags(), []);

  useEffect(() => {
    setActiveFlavor(searchParams.get('flavor') || '');
    setActiveTag(searchParams.get('tag') || '');
  }, [searchParams]);

  const filteredCakes = mockCakes.filter(cake => {
    if (activeFlavor && cake.flavor !== activeFlavor) return false;
    if (activeTag && !cake.tags.includes(activeTag)) return false;
    return true;
  });

  const updateFilters = (type, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-bakery-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-bakery-darkBrown mb-4"
          >
            {activeTag || activeFlavor ? `${activeTag || activeFlavor}` : 'Our Cake Collection'}
          </motion.h1>
          <div className="w-24 h-1 bg-bakery-gold mx-auto rounded-full mb-6"></div>
          <p className="text-bakery-brown/80 max-w-2xl mx-auto">
            Browse our extensive collection of handcrafted cakes. Perfect for birthdays, anniversaries, or just to satisfy your sweet tooth.
          </p>
        </div>

        {/* Filters Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-bakery-peach mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-2 text-bakery-darkBrown font-bold">
              <Filter size={20} />
              <span>Filter By:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <select 
                value={activeFlavor}
                onChange={(e) => updateFilters('flavor', e.target.value)}
                className="p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-bakery-cream min-w-[200px]"
              >
                <option value="">All Flavors</option>
                {FLAVORS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <select 
                value={activeTag}
                onChange={(e) => updateFilters('tag', e.target.value)}
                className="p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-bakery-cream min-w-[200px]"
              >
                <option value="">All Categories/Tags</option>
                {allTags.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {(activeFlavor || activeTag) && (
                <button 
                  onClick={clearFilters}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <X size={18} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-bakery-brown font-medium">
          Showing {filteredCakes.length} result{filteredCakes.length !== 1 ? 's' : ''}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredCakes.map((cake) => (
              <motion.div
                key={cake.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <CakeCard cake={cake} onQuickView={setSelectedCake} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCakes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-bakery-peach"
          >
            <div className="text-bakery-gold mb-4 flex justify-center">
              <X size={48} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-bakery-darkBrown mb-2">No Cakes Found</h2>
            <p className="text-bakery-brown/80 mb-6">We couldn't find any cakes matching your selected filters.</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 bg-bakery-brown text-white rounded-full font-bold hover:bg-bakery-darkBrown transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

      </div>

      <CakeQuickView 
        cake={selectedCake} 
        isOpen={!!selectedCake} 
        onClose={() => setSelectedCake(null)} 
      />
    </div>
  );
};

export default Categories;
