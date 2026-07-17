import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCakes, getAllTags, getCategoryGroup, getCakeBaseName } from '../utils/mockData';
import CakeCard from '../components/ui/CakeCard';
import CakeQuickView from '../components/ui/CakeQuickView';
import { Filter, X, Menu as MenuIcon, Grid, Star } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const menuCategories = [
  {
    title: 'Chocolate Cakes',
    items: [
      { name: 'Chocolate Oreo', price: 500 },
      { name: 'Cafe Mocha', price: 500 },
      { name: 'Dutch Truffle', price: 580 },
      { name: 'Chocolate Blakcurrent', price: 580 },
      { name: 'Chocolate Blueberry', price: 580 },
      { name: 'Chocolate Mango', price: 580 },
      { name: 'Chocolate Strawberry', price: 580 },
      { name: 'Chocolate Truffle ★', price: 600, isStarred: true },
      { name: 'Chocolate Nutella', price: 700 },
    ]
  },
  {
    title: 'Classic Cakes',
    items: [
      { name: 'Plain Vanilla', price: 450 },
      { name: 'Black Forest', price: 500 },
      { name: 'Mango Cake', price: 500 },
      { name: 'Strawberry', price: 500 },
      { name: 'Pineapple', price: 500 },
      { name: 'Blackcurrent', price: 500 },
      { name: 'Butterscotch', price: 500 },
    ]
  },
  {
    title: 'Fusion Cakes',
    items: [
      { name: 'Rajbhog', price: 700 },
      { name: 'Rasmalai', price: 750 },
      { name: 'Gulab Jamun', price: 750 },
    ]
  },
  {
    title: 'Cheesecakes',
    items: [
      { name: 'Red Velvet Cheesecake', price: 700 },
      { name: 'Blueberry Cheesecake', price: 700 },
    ]
  },
  {
    title: 'Custom Cakes',
    items: [
      { name: 'Doll Cake', desc: 'Beautifully crafted custom doll cakes' },
      { name: 'Photo Cake', desc: 'Cakes with edible custom printed photos' },
      { name: 'Theme Cake', desc: 'Tailored for birthdays, anniversaries' },
      { name: 'Bento Cake', desc: 'Mini cute lunchbox cakes (4 inches)' },
    ]
  },
  {
    title: 'Brownies',
    items: [
      { name: 'Chocochip Brownie', price: '60/Pc' },
      { name: 'Walnut Brownie', price: '70/Pc' },
      { name: 'Nutella Brownie', price: '60/Pc' },
    ]
  },
  {
    title: 'Bento Cakes (Basic)',
    items: [
      { name: 'Vanilla', price: 300 },
      { name: 'Blueberry', price: 300 },
      { name: 'Black Forest', price: 300 },
      { name: 'White Forest', price: 300 },
      { name: 'Pineapple', price: 300 },
      { name: 'Butterscotch', price: 300 },
      { name: 'Strawberry', price: 300 }
    ]
  },
  {
    title: 'Bento Cakes (Premium)',
    items: [
      { name: 'Rasmalai', price: 380 },
      { name: 'Chocolate Truffle', price: 350 },
      { name: 'Red Velvet', price: 380 },
      { name: 'Oreo', price: 300 },
      { name: 'KitKat', price: 380 },
      { name: 'Nutella', price: 350 },
      { name: 'Biscoff', price: 380 }
    ]
  }
];

const categoriesWithIllustrations = [
  { name: 'Pastries', image: '/cakes/fruit_slice_1781772530489.png', desc: 'Fresh slices of signature cakes' },
  { name: 'Donuts', image: '/cakes/Cake/WhatsApp Image 2026-06-28 at 10.21.56 AM.jpeg', desc: 'Soft and glazed chocolate donuts' },
  { name: 'Jar Cakes', image: '/cakes/truffle_side_1781772143569.png', desc: 'Layered jar cakes in red velvet & chocolate' }
];

const Categories = () => {
  useDocumentMetadata(
    "Buy Cakes Online | Chocolate, Cheesecake & Fusion Cakes Menu",
    "Order eggless chocolate truffle, Rasmalai, and premium cheesecakes online. Select from our menu list or custom design cakes. Same day cake delivery in Mumbai."
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const tagParam = searchParams.get('tag');
  const categoryGroupParam = searchParams.get('categoryGroup');
  const cakeNameParam = searchParams.get('cakeName');

  const [activeTag, setActiveTag] = useState(tagParam || '');
  const [activeCategoryGroup, setActiveCategoryGroup] = useState(categoryGroupParam || '');
  const [activeCakeName, setActiveCakeName] = useState(cakeNameParam || '');
  const [selectedCake, setSelectedCake] = useState(null);
  const [viewMode, setViewMode] = useState(searchParams.get('viewMode') || 'catalog');

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
    
    const viewParam = searchParams.get('viewMode');
    if (viewParam) {
      setViewMode(viewParam);
    } else if (searchParams.get('tag') || searchParams.get('categoryGroup') || searchParams.get('cakeName')) {
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
            onClick={() => {
              setViewMode('menu');
              const newParams = new URLSearchParams(searchParams);
              newParams.set('viewMode', 'menu');
              setSearchParams(newParams);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-sm border ${viewMode === 'menu'
                ? 'bg-bakery-pink-vibrant border-bakery-pink-vibrant text-white'
                : 'bg-white border-bakery-peach text-bakery-darkBrown hover:bg-bakery-cream'
              }`}
          >
            <MenuIcon size={18} />
            Quick Menu List
          </button>
          <button
            onClick={() => {
              setViewMode('catalog');
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('viewMode');
              setSearchParams(newParams);
            }}
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
              className="bg-[#fdf6f6] border-4 border-bakery-pink/30 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
            >
              {/* Decorative Plaid/Gingham Header Banner */}
              <div 
                className="h-32 md:h-40 w-full relative flex items-center justify-center"
                style={{
                  backgroundColor: '#fff0f2',
                  backgroundImage: `
                    linear-gradient(90deg, rgba(244, 194, 194, 0.4) 50%, transparent 50%),
                    linear-gradient(rgba(244, 194, 194, 0.4) 50%, transparent 50%)
                  `,
                  backgroundSize: '40px 40px'
                }}
              >
                <div className="absolute -bottom-16 w-32 h-32 rounded-full border-4 border-[#fdf6f6] overflow-hidden shadow-xl bg-white flex items-center justify-center">
                  <img 
                    src="/cakeshoplogo.jpeg" 
                    alt="Kalpana's Cakes & Bakes Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Menu Header with Logo */}
              <div className="text-center pt-20 pb-8 px-4 border-b border-bakery-pink/20">
                <h2 className="text-4xl font-serif font-bold text-[#8b1e3f] mb-1">
                  Kalpana's Cakes & Bakes
                </h2>
                <p className="text-bakery-pink-dark font-cursive text-2xl font-semibold tracking-widest">
                  Homemade cakes
                </p>
                <div className="w-32 h-1 bg-bakery-pink-vibrant mx-auto mt-4 rounded-full"></div>
              </div>

              {/* Menu Grid */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                
                {/* Column 1: Chocolate Cakes */}
                <div className="bg-white p-6 rounded-3xl border border-bakery-peach/30 shadow-md flex flex-col">
                  <div className="bg-[#fbcfe8] text-[#be185d] px-5 py-2 rounded-full font-serif font-bold text-lg mb-6 shadow-sm text-center">
                    Chocolate Cakes
                  </div>
                  <ul className="space-y-4 flex-1">
                    {menuCategories[0].items.map((item, idx) => (
                      <li 
                        key={idx}
                        className="flex justify-between items-center py-2 px-3 rounded-2xl border border-transparent"
                      >
                        <span className="text-bakery-darkBrown font-semibold flex items-center gap-1.5 text-base">
                          {item.name.replace('★', '')}
                          {item.isStarred && <Star size={16} className="fill-bakery-gold text-bakery-gold shrink-0 animate-pulse" />}
                        </span>
                        <span className="text-bakery-pink-dark font-bold text-base shrink-0">
                          ₹{item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Classic Cakes & Cheesecakes */}
                <div className="space-y-8">
                  {/* Classic Cakes */}
                  <div className="bg-white p-6 rounded-3xl border border-bakery-peach/30 shadow-md flex flex-col">
                    <div className="bg-[#fbcfe8] text-[#be185d] px-5 py-2 rounded-full font-serif font-bold text-lg mb-6 shadow-sm text-center">
                      Classic Cakes
                    </div>
                    <ul className="space-y-4">
                      {menuCategories[1].items.map((item, idx) => (
                        <li 
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 rounded-2xl border border-transparent"
                        >
                          <span className="text-bakery-darkBrown font-semibold text-base">
                            {item.name}
                          </span>
                          <span className="text-bakery-pink-dark font-bold text-base shrink-0">
                            ₹{item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cheesecakes */}
                  <div className="bg-white p-6 rounded-3xl border border-bakery-peach/30 shadow-md flex flex-col">
                    <div className="bg-[#fbcfe8] text-[#be185d] px-5 py-2 rounded-full font-serif font-bold text-lg mb-6 shadow-sm text-center">
                      Cheesecakes
                    </div>
                    <ul className="space-y-4">
                      {menuCategories[3].items.map((item, idx) => (
                        <li 
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 rounded-2xl border border-transparent"
                        >
                          <span className="text-bakery-darkBrown font-semibold text-base">
                            {item.name}
                          </span>
                          <span className="text-bakery-pink-dark font-bold text-base shrink-0">
                            ₹{item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 3: Bento Cakes (Basic & Premium) */}
                <div className="space-y-8">
                  {/* Bento Cakes (Basic) */}
                  <div className="bg-white p-6 rounded-3xl border border-bakery-peach/30 shadow-md flex flex-col">
                    <div className="bg-[#fbcfe8] text-[#be185d] px-5 py-2 rounded-full font-serif font-bold text-lg mb-6 shadow-sm text-center">
                      Bento Cakes (Basic)
                    </div>
                    <ul className="space-y-4">
                      {menuCategories[6].items.map((item, idx) => (
                        <li 
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 rounded-2xl border border-transparent"
                        >
                          <span className="text-bakery-darkBrown font-semibold text-base">
                            {item.name}
                          </span>
                          <span className="text-bakery-pink-dark font-bold text-base shrink-0">
                            ₹{item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bento Cakes (Premium) */}
                  <div className="bg-white p-6 rounded-3xl border border-bakery-peach/30 shadow-md flex flex-col">
                    <div className="bg-[#fbcfe8] text-[#be185d] px-5 py-2 rounded-full font-serif font-bold text-lg mb-6 shadow-sm text-center">
                      Bento Cakes (Premium)
                    </div>
                    <ul className="space-y-4">
                      {menuCategories[7].items.map((item, idx) => (
                        <li 
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 rounded-2xl border border-transparent"
                        >
                          <span className="text-bakery-darkBrown font-semibold text-base">
                            {item.name}
                          </span>
                          <span className="text-bakery-pink-dark font-bold text-base shrink-0">
                            ₹{item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 4: Fusion, Custom Cakes & Brownies */}
                <div className="space-y-8">
                  {/* Fusion Cakes */}
                  <div className="bg-white p-6 rounded-3xl border border-bakery-peach/30 shadow-md flex flex-col">
                    <div className="bg-[#fbcfe8] text-[#be185d] px-5 py-2 rounded-full font-serif font-bold text-lg mb-6 shadow-sm text-center">
                      Fusion Cakes
                    </div>
                    <ul className="space-y-4">
                      {menuCategories[2].items.map((item, idx) => (
                        <li 
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 rounded-2xl border border-transparent"
                        >
                          <span className="text-bakery-darkBrown font-semibold text-base">
                            {item.name}
                          </span>
                          <span className="text-bakery-pink-dark font-bold text-base shrink-0">
                            ₹{item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Custom Cakes */}
                  <div className="bg-white p-6 rounded-3xl border border-bakery-peach/30 shadow-md flex flex-col">
                    <div className="bg-[#fbcfe8] text-[#be185d] px-5 py-2 rounded-full font-serif font-bold text-lg mb-6 shadow-sm text-center">
                      Custom Cakes
                    </div>
                    <ul className="space-y-4">
                      {menuCategories[4].items.map((item, idx) => (
                        <li 
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 rounded-2xl border border-transparent"
                        >
                          <div>
                            <span className="text-bakery-darkBrown font-semibold text-base block">
                              {item.name}
                            </span>
                            <span className="text-xs text-bakery-brown/60 block">{item.desc}</span>
                          </div>
                          <span className="text-[11px] font-bold text-[#be185d] uppercase bg-[#fbcfe8]/40 px-3 py-1.5 rounded-full shrink-0">Custom</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Brownies */}
                  <div className="bg-white p-6 rounded-3xl border border-bakery-peach/30 shadow-md flex flex-col">
                    <div className="bg-[#fbcfe8] text-[#be185d] px-5 py-2 rounded-full font-serif font-bold text-lg mb-6 shadow-sm text-center">
                      Brownies
                    </div>
                    <ul className="space-y-4">
                      {menuCategories[5].items.map((item, idx) => (
                        <li 
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 rounded-2xl border border-transparent"
                        >
                          <span className="text-bakery-darkBrown font-semibold text-base">
                            {item.name}
                          </span>
                          <span className="text-bakery-pink-dark font-bold text-base shrink-0">
                            ₹{item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Also Check Out Illustrations (Pastries, Donuts, Jar Cakes) */}
              <div className="bg-[#fff0f2]/60 px-6 py-12 md:px-12 border-t border-bakery-pink/20">
                <h3 className="text-2xl font-serif font-bold text-[#8b1e3f] text-center mb-8 font-serif">Also Check Out</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {categoriesWithIllustrations.map((cat, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white p-5 rounded-2xl shadow-sm border border-bakery-peach/20 flex items-center gap-4 hover:shadow-md transition-shadow duration-300"
                    >
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-bakery-pink shadow-sm shrink-0" 
                      />
                      <div>
                        <h4 className="font-bold text-bakery-darkBrown text-lg font-serif">{cat.name}</h4>
                        <p className="text-xs text-bakery-brown/70 leading-snug">{cat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gingham footer bar with WhatsApp Contact Details */}
              <div className="bg-[#f4c2c2] py-6 px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-bakery-darkBrown border-t border-bakery-pink/30">
                <span className="font-medium text-sm">Please place custom orders at least 1-2 days in advance.</span>
                <a 
                  href="https://wa.me/919004762873?text=Hi%2C%20I'd%20like%20to%20inquire%20about%20your%20cakes!" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 bg-green-500 text-white font-bold px-5 py-2.5 rounded-full hover:bg-green-600 shadow-md hover:shadow-lg transition-all transform hover:scale-105 select-none"
                >
                  <FaWhatsapp size={20} />
                  <span>+91 9004762873</span>
                </a>
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
                      <CakeCard cake={cake} onQuickView={setSelectedCake} showPrice={false} />
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
