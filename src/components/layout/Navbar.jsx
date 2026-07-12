import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { getCartCount, openCart } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
  }, [location]);

  const categories = {
    chocolate: {
      title: 'Chocolate Cakes',
      links: [
        { name: 'Royal Chocolate Drip Cake', path: '/categories?cakeName=Royal%20Chocolate%20Drip%20Cake' },
        { name: 'Classic Chocolate Truffle', path: '/categories?cakeName=Classic%20Chocolate%20Truffle' },
        { name: 'Ferrero Rocher Truffle Cake', path: '/categories?cakeName=Ferrero%20Rocher%20Truffle%20Cake' },
        { name: 'Double Chocolate Shavings Cake', path: '/categories?cakeName=Double%20Chocolate%20Shavings%20Cake' },
        { name: 'Dark Glaze Chocolate Truffle', path: '/categories?cakeName=Dark%20Glaze%20Chocolate%20Truffle' },
        { name: 'Luxury Golden Chocolate Shards', path: '/categories?cakeName=Luxury%20Golden%20Chocolate%20Shards' },
        { name: 'Classic Chocolate Drip Crown Cake', path: '/categories?cakeName=Classic%20Chocolate%20Drip%20Crown%20Cake' },
        { name: 'Papa Chocolate Rocher Cake', path: '/categories?cakeName=Papa%20Chocolate%20Rocher%20Cake' },
        { name: 'Choco Crunch Shavings Cake', path: '/categories?cakeName=Choco%20Crunch%20Shavings%20Cake' },
        { name: 'Imperial Chocolate Crown Cake', path: '/categories?cakeName=Imperial%20Chocolate%20Crown%20Cake' },
        { name: 'Chocolate Pink Butterfly Delight', path: '/categories?cakeName=Chocolate%20Pink%20Butterfly%20Delight' }
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
        { name: 'Grand Rose Anniversary Cake', path: '/categories?cakeName=Grand%20Rose%20Anniversary%20Cake' },
        { name: 'Racing Cars Birthday Cake', path: '/categories?cakeName=Racing%20Cars%20Birthday%20Cake' },
        { name: 'Red Rose Heart Anniversary Cake', path: '/categories?cakeName=Red%20Rose%20Heart%20Anniversary%20Cake' },
        { name: 'Sweet 18 Heart Crown Cake', path: '/categories?cakeName=Sweet%2018%20Heart%20Crown%20Cake' },
        { name: 'Elegant Holy Cross Cake', path: '/categories?cakeName=Elegant%20Holy%20Cross%20Cake' },
        { name: 'Golden Butterfly Birthday Cake', path: '/categories?cakeName=Golden%20Butterfly%20Birthday%20Cake' },
        { name: 'Magical Frozen Snow Cake', path: '/categories?cakeName=Magical%20Frozen%20Snow%20Cake' },
        { name: 'Jungle Safari Animals Cake', path: '/categories?cakeName=Jungle%20Safari%20Animals%20Cake' },
        { name: 'Super Dad Chocolate Butterscotch', path: '/categories?cakeName=Super%20Dad%20Chocolate%20Butterscotch' },
        { name: 'Baby Boy or Girl Shower Cake', path: '/categories?cakeName=Baby%20Boy%20or%20Girl%20Shower%20Cake' },
        { name: 'Spiderman City Adventure Cake', path: '/categories?cakeName=Spiderman%20City%20Adventure%20Cake' },
        { name: 'Elegant Barbie Doll Blue Gown', path: '/categories?cakeName=Elegant%20Barbie%20Doll%20Blue%20Gown' },
        { name: 'Spiderman Hero Web Cake', path: '/categories?cakeName=Spiderman%20Hero%20Web%20Cake' },
        { name: 'Purple Swirl Cream Cake', path: '/categories?cakeName=Purple%20Swirl%20Cream%20Cake' },
        { name: 'Pink Drip Princess Castle Cake', path: '/categories?cakeName=Pink%20Drip%20Princess%20Castle%20Cake' }
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
                        {categories.chocolate.links.length > 6 && (
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
                        {categories.theme.links.length > 6 && (
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



            <button 
              onClick={openCart}
              className="relative p-2 text-bakery-brown hover:text-bakery-darkBrown transition-colors ml-4 focus:outline-none"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 10, 0] }}
                animate={animateCart ? { scale: [1, 1.25, 0.95, 1.05, 1], rotate: [0, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center"
              >
                <ShoppingBag size={24} />
              </motion.div>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-extrabold text-white bg-bakery-pink-vibrant rounded-full transform translate-x-1/4 -translate-y-1/4 shadow-md select-none border border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex lg:hidden items-center gap-4">
            <button 
              onClick={openCart}
              className="relative p-2 text-bakery-brown focus:outline-none"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 10, 0] }}
                animate={animateCart ? { scale: [1, 1.25, 0.95, 1.05, 1], rotate: [0, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center"
              >
                <ShoppingBag size={24} />
              </motion.div>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-extrabold text-white bg-bakery-pink-vibrant rounded-full transform translate-x-1/4 -translate-y-1/4 shadow-md select-none border border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
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
            
            {/* Mobile Accordions */}
            {Object.entries(categories).map(([key, category]) => {
              const categoryGroupMap = {
                chocolate: 'Chocolate Cakes',
                cheesecakes: 'Cheesecakes',
                fusion: 'Fusion Cakes',
                theme: 'Theme Cakes',
                bento: 'Bento Cakes'
              };
              return (
                <div key={key} className="border-b border-bakery-peach">
                  <button 
                    onClick={() => handleMobileAccordion(key)}
                    className="flex justify-between items-center w-full px-3 py-3 text-base font-bold text-bakery-darkBrown"
                  >
                    {category.title}
                    <ChevronDown size={20} className={`transform transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === key && (
                    <div className="bg-bakery-cream px-6 py-2 space-y-3">
                      <Link 
                        to={`/categories?categoryGroup=${encodeURIComponent(categoryGroupMap[key])}`}
                        className="block text-sm font-bold text-bakery-pink-dark py-1 border-b border-bakery-peach/30"
                      >
                        View All {category.title}
                      </Link>
                      {category.links.map(link => (
                        <Link 
                          key={link.name} 
                          to={link.path} 
                          className="block text-sm text-bakery-brown py-1"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

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
