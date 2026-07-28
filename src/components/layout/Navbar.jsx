import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { getCartCount, openCart } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const location = useLocation();

  const cartCount = getCartCount();
  const [animateCart, setAnimateCart] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsCategoriesOpen(false);
    setActiveSubDropdown(null);
  }, [location]);

  const categories = {
    chocolate: {
      title: 'Chocolate Cakes',
      links: [
        { name: 'Royal Chocolate Drip Cake', path: '/categories?cakeName=Royal%20Chocolate%20Drip%20Cake' },
        { name: 'Dutch Truffle', path: '/categories?cakeName=Dutch%20Truffle' },
        { name: 'Chocolate Truffle cake', path: '/categories?cakeName=Chocolate%20Truffle%20cake' },
        { name: 'Chocolate Chocochips cake', path: '/categories?cakeName=Chocolate%20Chocochips%20cake' },
        { name: 'Dark Glaze Chocolate Truffle', path: '/categories?cakeName=Dark%20Glaze%20Chocolate%20Truffle' },
        { name: 'Classic Chocolate Drip Crown Cake', path: '/categories?cakeName=Classic%20Chocolate%20Drip%20Crown%20Cake' }
      ]
    },
    cheesecakes: {
      title: 'Cheesecakes',
      links: [
        { name: 'Red Velvet Crumbs Cake', path: '/categories?cakeName=Red%20Velvet%20Crumbs%20Cake' }
      ]
    },
    fusion: {
      title: 'Fusion Cakes',
      links: [
        { name: 'Royal Gulab Jamun Cake', path: '/categories?cakeName=Royal%20Gulab%20Jamun%20Cake' },
        { name: 'Classic Rasmalai Cake', path: '/categories?cakeName=Classic%20Rasmalai%20Cake' },
        { name: 'Traditional Rajbhog Cake', path: '/categories?cakeName=Traditional%20Rajbhog%20Cake' }
      ]
    },
    theme: {
      title: 'Theme Cakes',
      links: [
        { name: 'Princess Pink Doll Cake', path: '/categories?cakeName=Princess%20Pink%20Doll%20Cake' },
        { name: 'Lavender Royale Crown Cake', path: '/categories?cakeName=Lavender%20Royale%20Crown%20Cake' },
        { name: 'Welcome Baby Pink Cake', path: '/categories?cakeName=Welcome%20Baby%20Pink%20Cake' },
        { name: 'Frozen Princess Elsa Cake', path: '/categories?cakeName=Frozen%20Princess%20Elsa%20Cake' },
        { name: 'Red Rose Heart Anniversary Cake', path: '/categories?cakeName=Red%20Rose%20Heart%20Anniversary%20Cake' },
        { name: 'Elegant Holy Cross Cake', path: '/categories?cakeName=Elegant%20Holy%20Cross%20Cake' }
      ]
    },
    bento: {
      title: 'Bento Cakes',
      links: [
        { name: 'Mini Chocolate Bento Cake', path: '/categories?cakeName=Mini%20Chocolate%20Bento%20Cake' }
      ]
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Customized Cake', path: '/custom-cake' },
    { name: 'Bulk Order', path: '/bulk-order' }
  ];

  const handleMobileAccordion = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <nav className="bg-bakery-cream shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/cakeshoplogo.jpeg" 
                alt="Kalpana's Cakes & Bakes Logo" 
                className="h-16 w-auto object-contain rounded-full border border-bakery-peach/30"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-6 items-center h-full">
            <Link to="/" className="text-bakery-darkBrown hover:text-bakery-brown font-medium transition-colors">Home</Link>
            
            {/* Mega Menu Trigger */}
            <div className="group h-full flex items-center">
              <Link to="/categories" className="text-bakery-darkBrown group-hover:text-bakery-brown font-medium transition-colors flex items-center gap-1 h-full">
                Categories <ChevronDown size={16} />
              </Link>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-[80px] left-4 right-4 bg-white shadow-2xl rounded-3xl border border-bakery-peach/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="px-8 py-8">
                  <div className="grid grid-cols-3 xl:grid-cols-5 gap-8">
                    {/* Column 1 */}
                    <div>
                      <Link to="/categories?categoryGroup=Chocolate%20Cakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.chocolate.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.chocolate.links.slice(0, 6).map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
                        {categories.chocolate.links.length >= 6 && (
                          <li>
                            <Link to="/categories?categoryGroup=Chocolate%20Cakes" className="text-sm font-bold text-bakery-pink-dark hover:text-bakery-gold transition-colors block mt-1">View All Chocolate →</Link>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* Column 2 */}
                    <div>
                      <Link to="/categories?categoryGroup=Cheesecakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.cheesecakes.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.cheesecakes.links.slice(0, 6).map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
                        {categories.cheesecakes.links.length > 6 && (
                          <li>
                            <Link to="/categories?categoryGroup=Cheesecakes" className="text-sm font-bold text-bakery-pink-dark hover:text-bakery-gold transition-colors block mt-1">View All Cheesecakes →</Link>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* Column 3 */}
                    <div>
                      <Link to="/categories?categoryGroup=Fusion%20Cakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.fusion.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.fusion.links.slice(0, 6).map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
                        {categories.fusion.links.length > 6 && (
                          <li>
                            <Link to="/categories?categoryGroup=Fusion%20Cakes" className="text-sm font-bold text-bakery-pink-dark hover:text-bakery-gold transition-colors block mt-1">View All Fusion →</Link>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* Column 4 */}
                    <div>
                      <Link to="/categories?categoryGroup=Theme%20Cakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.theme.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.theme.links.slice(0, 6).map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
                        {categories.theme.links.length >= 6 && (
                          <li>
                            <Link to="/categories?categoryGroup=Theme%20Cakes" className="text-sm font-bold text-bakery-pink-dark hover:text-bakery-gold transition-colors block mt-1">View All Theme →</Link>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* Column 5 */}
                    <div>
                      <Link to="/categories?categoryGroup=Bento%20Cakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.bento.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.bento.links.slice(0, 6).map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
                        {categories.bento.links.length > 6 && (
                          <li>
                            <Link to="/categories?categoryGroup=Bento%20Cakes" className="text-sm font-bold text-bakery-pink-dark hover:text-bakery-gold transition-colors block mt-1">View All Bento →</Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-bakery-darkBrown hover:text-bakery-brown font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Cart Button */}
            <motion.button
              onClick={openCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={animateCart ? {
                scale: [1, 1.25, 0.9, 1.15, 0.95, 1.02, 1],
                rotate: [0, -8, 8, -4, 4, 0],
                backgroundColor: ['#ffffff', '#fff0f2', '#ffffff'],
                borderColor: ['#f4c2c2', '#ff007f', '#f4c2c2']
              } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative p-2.5 bg-white text-bakery-darkBrown rounded-full hover:bg-bakery-peach/30 transition-shadow duration-300 flex items-center justify-center border border-bakery-peach/30 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-300 text-bakery-darkBrown" />
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 bg-bakery-pink-vibrant text-white text-[11px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex lg:hidden items-center gap-4">
            {/* Mobile Cart Button */}
            <motion.button
              onClick={openCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={animateCart ? {
                scale: [1, 1.25, 0.9, 1.15, 0.95, 1.02, 1],
                rotate: [0, -8, 8, -4, 4, 0],
                backgroundColor: ['#ffffff', '#fff0f2', '#ffffff'],
                borderColor: ['#f4c2c2', '#ff007f', '#f4c2c2']
              } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative p-2 bg-white text-bakery-darkBrown rounded-full flex items-center justify-center border border-bakery-peach/30 shadow-sm"
            >
              <ShoppingBag size={20} className="text-bakery-darkBrown" />
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 bg-bakery-pink-vibrant text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-white border shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-bakery-brown"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-bakery-peach overflow-y-auto max-h-[80vh]">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" className="block px-3 py-3 text-base font-bold text-bakery-darkBrown border-b border-bakery-peach">Home</Link>
            
            {/* Categories Accordion (Level 1) */}
            <div className="border-b border-bakery-peach">
              <div className="flex items-center justify-between w-full px-3 py-1">
                <Link 
                  to="/categories" 
                  className="text-base font-bold text-bakery-darkBrown py-2 flex-grow"
                >
                  Categories
                </Link>
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="p-2 text-bakery-brown/70 hover:text-bakery-brown"
                >
                  <ChevronDown size={20} className={`transform transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {isCategoriesOpen && (
                <div className="bg-bakery-cream/35 pl-4 border-l-2 border-bakery-peach/30 transition-all duration-300">
                  {Object.entries(categories).map(([key, category]) => {
                    const categoryGroupMap = {
                      chocolate: 'Chocolate Cakes',
                      cheesecakes: 'Cheesecakes',
                      fusion: 'Fusion Cakes',
                      theme: 'Theme Cakes',
                      bento: 'Bento Cakes'
                    };
                    const isSubOpen = activeSubDropdown === key;
                    const groupName = categoryGroupMap[key];
                    return (
                      <div key={key} className="border-b border-bakery-peach/30 last:border-0">
                        <div className="flex items-center justify-between w-full px-3 py-0.5">
                          <Link 
                            to={`/categories?categoryGroup=${encodeURIComponent(groupName)}`}
                            className="text-sm font-bold text-bakery-darkBrown/90 py-2 flex-grow"
                          >
                            {category.title}
                          </Link>
                          <button 
                            onClick={() => setActiveSubDropdown(isSubOpen ? null : key)}
                            className="p-2 text-bakery-brown/60 hover:text-bakery-brown"
                          >
                            <ChevronDown size={16} className={`transform transition-transform ${isSubOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        
                        {isSubOpen && (
                          <div className="bg-white/50 pl-4 pr-3 py-1.5 space-y-2 border-l border-bakery-peach/20">
                            <Link 
                              to={`/categories?categoryGroup=${encodeURIComponent(categoryGroupMap[key])}`}
                              className="block text-xs font-bold text-bakery-pink-dark py-1.5 border-b border-bakery-peach/10"
                            >
                              View All {category.title}
                            </Link>
                            {category.links.map(link => (
                              <Link 
                                key={link.name} 
                                to={link.path} 
                                className="block text-xs text-bakery-brown/90 py-1 hover:text-bakery-gold transition-colors"
                              >
                                {link.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-3 text-base font-bold text-bakery-darkBrown border-b border-bakery-peach"
              >
                {link.name}
              </Link>
            ))}


          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
