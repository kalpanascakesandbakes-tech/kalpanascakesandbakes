import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCakes, getAllTags, getCategoryGroup, getCakeBaseName } from '../utils/mockData';
import CakeCard from '../components/ui/CakeCard';
import CakeQuickView from '../components/ui/CakeQuickView';
import { Filter, X, Menu as MenuIcon, Grid } from 'lucide-react';

const menuCategories = [
  {
    title: 'Chocolate Cakes',
    items: [
      { name: 'Royal Chocolate Drip Cake', flavor: 'Chocolate' },
      { name: 'Classic Chocolate Truffle', flavor: 'Chocolate', isStarred: true },
      { name: 'Ferrero Rocher Truffle Cake', flavor: 'Chocolate' },
      { name: 'Double Chocolate Shavings Cake', flavor: 'Chocolate' },
      { name: 'Dark Glaze Chocolate Truffle', flavor: 'Chocolate' },
      { name: 'Luxury Golden Chocolate Shards', flavor: 'Chocolate' },
      { name: 'Classic Chocolate Drip Crown Cake', flavor: 'Chocolate' },
      { name: 'Papa Chocolate Rocher Cake', flavor: 'Chocolate' },
      { name: 'Choco Crunch Shavings Cake', flavor: 'Chocolate' },
      { name: 'Imperial Chocolate Crown Cake', flavor: 'Chocolate' },
      { name: 'Chocolate Pink Butterfly Delight', flavor: 'Chocolate' }
    ]
  },
  {
    title: 'Theme Cakes',
    items: [
      { name: 'Princess Pink Doll Cake', flavor: 'Vanilla' },
      { name: 'Lavender Royale Crown Cake', flavor: 'Vanilla' },
      { name: 'Welcome Baby Pink Cake', flavor: 'Vanilla' },
      { name: 'Frozen Princess Elsa Cake', flavor: 'Vanilla' },
      { name: 'Grand Rose Anniversary Cake', flavor: 'Vanilla' },
      { name: 'Racing Cars Birthday Cake', flavor: 'Chocolate' },
      { name: 'Red Rose Heart Anniversary Cake', flavor: 'Red Velvet' },
      { name: 'Sweet 18 Heart Crown Cake', flavor: 'Vanilla' },
      { name: 'Elegant Holy Cross Cake', flavor: 'Vanilla' },
      { name: 'Golden Butterfly Birthday Cake', flavor: 'Vanilla' },
      { name: 'Magical Frozen Snow Cake', flavor: 'Vanilla' },
      { name: 'Jungle Safari Animals Cake', flavor: 'Chocolate', isStarred: true },
      { name: 'Super Dad Chocolate Butterscotch', flavor: 'Butterscotch' },
      { name: 'Baby Boy or Girl Shower Cake', flavor: 'Vanilla' },
      { name: 'Spiderman City Adventure Cake', flavor: 'Chocolate' },
      { name: 'Elegant Barbie Doll Blue Gown', flavor: 'Vanilla' },
      { name: 'Spiderman Hero Web Cake', flavor: 'Vanilla' },
      { name: 'Purple Swirl Cream Cake', flavor: 'Vanilla' },
      { name: 'Pink Drip Princess Castle Cake', flavor: 'Vanilla' }
    ]
  },
  {
    title: 'Fusion Cakes',
    items: [
      { name: 'Royal Gulab Jamun Cake', flavor: 'Vanilla' },
      { name: 'Classic Rasmalai Cake', flavor: 'Vanilla', isStarred: true },
      { name: 'Traditional Rajbhog Cake', flavor: 'Mango' }
    ]
  },
  {
    title: 'Cheesecakes',
    items: [
      { name: 'Red Velvet Crumbs Cake', flavor: 'Red Velvet' }
    ]
  },
  {
    title: 'Bento Cakes',
    items: [
      { name: 'Mini Chocolate Bento Cake', flavor: 'Chocolate' }
    ]
  }
];

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tagParam = searchParams.get('tag');
  const categoryGroupParam = searchParams.get('categoryGroup');
  const cakeNameParam = searchParams.get('cakeName');

  const [activeTag, setActiveTag] = useState(tagParam || '');
  const [activeCategoryGroup, setActiveCategoryGroup] = useState(categoryGroupParam || '');
  const [activeCakeName, setActiveCakeName] = useState(cakeNameParam || '');
  const [selectedCake, setSelectedCake] = useState(null);
  const [viewMode, setViewMode] = useState('catalog');

  const allTags = useMemo(() => getAllTags(), []);

  const availableCakeNames = useMemo(() => {
    const names = new Set();
    mockCakes.forEach(cake => {
      if (!activeCategoryGroup || getCategoryGroup(cake) === activeCategoryGroup) {
        names.add(getCakeBaseName(cake));
      }
    });
    return Array.from(names).sort();
  }, [activeCategoryGroup]);

  useEffect(() => {
    setActiveTag(searchParams.get('tag') || '');
    setActiveCategoryGroup(searchParams.get('categoryGroup') || '');
    setActiveCakeName(searchParams.get('cakeName') || '');
    if (searchParams.get('tag') || searchParams.get('categoryGroup') || searchParams.get('cakeName')) {
      setViewMode('catalog');
    }
  }, [searchParams]);

  const filteredCakes = mockCakes.filter(cake => {
    if (activeTag && !cake.tags.includes(activeTag)) return false;
    if (activeCategoryGroup && getCategoryGroup(cake) !== activeCategoryGroup) return false;
    if (activeCakeName && getCakeBaseName(cake) !== activeCakeName) return false;
    return true;
  });

  const updateFilters = (type, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }

    if (type === 'categoryGroup') {
      const allowedNames = !value ? mockCakes.map(getCakeBaseName) : mockCakes.filter(c => getCategoryGroup(c) === value).map(getCakeBaseName);
      const currentCakeName = searchParams.get('cakeName');
      if (currentCakeName && !allowedNames.includes(currentCakeName)) {
        newParams.delete('cakeName');
      }
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleCakeClick = (item) => {
    // Find the category group that contains this item
    const category = menuCategories.find(cat => cat.items.some(i => i.name === item.name));
    const categoryTitle = category ? category.title : '';
    
    // Switch to catalog view, filter by category group and cake name
    const newParams = new URLSearchParams(searchParams);
    if (categoryTitle) {
      newParams.set('categoryGroup', categoryTitle);
    } else {
      newParams.delete('categoryGroup');
    }
    newParams.set('cakeName', item.name);
    newParams.delete('tag');
    
    setSearchParams(newParams);
    setViewMode('catalog');

    // Also show in Quick View if a match is found
    const matchedCake = mockCakes.find(cake => getCakeBaseName(cake) === item.name);
    if (matchedCake) {
      setSelectedCake(matchedCake);
    }
  };

  return (
    <div className="bg-bakery-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-bakery-darkBrown mb-4"
          >
            {activeCakeName || activeCategoryGroup || activeTag || "Our Cake Collection"}
          </motion.h1>
          <div className="w-24 h-1 bg-bakery-gold mx-auto rounded-full mb-6"></div>
          <p className="text-bakery-brown/80 max-w-2xl mx-auto">
            Browse our extensive collection of handcrafted cakes. Perfect for birthdays, anniversaries, or just to satisfy your sweet tooth.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setViewMode('menu')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-sm border ${viewMode === 'menu'
                ? 'bg-bakery-pink-vibrant border-bakery-pink-vibrant text-white'
                : 'bg-white border-bakery-peach text-bakery-darkBrown hover:bg-bakery-cream'
              }`}
          >
            <MenuIcon size={18} />
            Quick Menu List
          </button>
          <button
            onClick={() => setViewMode('catalog')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-sm border ${viewMode === 'catalog'
                ? 'bg-bakery-pink-vibrant border-bakery-pink-vibrant text-white'
                : 'bg-white border-bakery-peach text-bakery-darkBrown hover:bg-bakery-cream'
              }`}
          >
            <Grid size={18} />
            Interactive Catalog
          </button>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#fef2f2] border-2 border-bakery-peach rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden"
            >
              {/* Background decorative blur shapes */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-bakery-peach/25 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-bakery-pink/25 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

              {/* Menu Header with Logo */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 pb-8 border-b border-bakery-peach/60 relative z-10">
                <img
                  src="/cakeshoplogo.jpeg"
                  alt="Kalpana's Cakes & Bakes Logo"
                  className="h-24 w-24 object-contain rounded-full border-2 border-bakery-pink shadow-md"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-bakery-brown mb-1">
                    Kalpana's Cakes & Bakes
                  </h2>
                  <p className="text-bakery-pink-dark font-cursive text-2xl font-semibold tracking-wide">
                    Homemade cakes
                  </p>
                </div>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {menuCategories.map((category, idx) => (
                  <div key={idx} className="flex flex-col items-center sm:items-start">
                    {/* Category pill header (matches image box badge styling) */}
                    <div className="bg-[#fbcfe8] text-[#be185d] px-6 py-2.5 rounded-full font-serif font-bold text-lg mb-6 shadow-sm w-full text-center sm:text-left inline-flex justify-center sm:justify-start items-center">
                      {category.title}
                    </div>

                    {/* Items List */}
                    <ul className="space-y-3.5 w-full">
                      {category.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          onClick={() => handleCakeClick(item)}
                          className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white transition-all duration-300 cursor-pointer border border-transparent hover:border-bakery-peach/30 shadow-sm hover:shadow-md"
                        >
                          <span className="text-bakery-darkBrown font-medium group-hover:text-bakery-pink-dark transition-colors flex items-center gap-2">
                            {item.name}
                            {item.isStarred && <span className="text-bakery-gold text-lg">★</span>}
                          </span>

                          <span className="text-xs text-bakery-pink-dark opacity-0 group-hover:opacity-100 font-bold transition-all duration-300 uppercase tracking-wider shrink-0">
                            View
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters Area */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-bakery-peach mb-12">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center gap-2 text-bakery-darkBrown font-bold">
                    <Filter size={20} />
                    <span>Filter By:</span>
                  </div>                  <div className="flex flex-wrap gap-4 w-full md:w-auto justify-center md:justify-end">
                    <select
                      value={activeCategoryGroup}
                      onChange={(e) => updateFilters('categoryGroup', e.target.value)}
                      className="p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-bakery-cream min-w-[180px]"
                    >
                      <option value="">All Categories</option>
                      <option value="Chocolate Cakes">Chocolate Cakes</option>
                      <option value="Cheesecakes">Cheesecakes</option>
                      <option value="Fusion Cakes">Fusion Cakes</option>
                      <option value="Theme Cakes">Theme Cakes</option>
                      <option value="Bento Cakes">Bento Cakes</option>
                    </select>

                    <select
                      value={activeCakeName}
                      onChange={(e) => updateFilters('cakeName', e.target.value)}
                      className="p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-bakery-cream min-w-[180px]"
                    >
                      <option value="">All Cakes</option>
                      {availableCakeNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>

                    {(activeCakeName || activeTag || activeCategoryGroup) && (
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
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
            </motion.div>
          )}
        </AnimatePresence>

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
