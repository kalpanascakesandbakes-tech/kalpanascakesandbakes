import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { getCartCount, openCart } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const categories = {
    chocolate: {
      title: 'Chocolate Cakes',
      links: [
        { name: 'Chocolate Oreo', path: '/categories?cakeName=Chocolate%20Oreo' },
        { name: 'Cafe Mocha', path: '/categories?cakeName=Cafe%20Mocha' },
        { name: 'Dutch Truffle', path: '/categories?cakeName=Dutch%20Truffle' },
        { name: 'Chocolate Blakcurrent', path: '/categories?cakeName=Chocolate%20Blakcurrent' },
        { name: 'Chocolate Blueberry', path: '/categories?cakeName=Chocolate%20Blueberry' },
        { name: 'Chocolate Mango', path: '/categories?cakeName=Chocolate%20Mango' },
        { name: 'Chocolate Strawberry', path: '/categories?cakeName=Chocolate%20Strawberry' },
        { name: 'Chocolate Truffle', path: '/categories?cakeName=Chocolate%20Truffle' },
        { name: 'Chocolate Nutella', path: '/categories?cakeName=Chocolate%20Nutella' }
      ]
    },
    regular: {
      title: 'Regular Cakes',
      links: [
        { name: 'Plain Vanilla', path: '/categories?cakeName=Plain%20Vanilla' },
        { name: 'Black Forest', path: '/categories?cakeName=Black%20Forest' },
        { name: 'Mango Cake', path: '/categories?cakeName=Mango%20Cake' },
        { name: 'Strawberry', path: '/categories?cakeName=Strawberry' },
        { name: 'Pineapple', path: '/categories?cakeName=Pineapple' },
        { name: 'Blackcurrent', path: '/categories?cakeName=Blackcurrent' },
        { name: 'Butterscotch', path: '/categories?cakeName=Butterscotch' }
      ]
    },
    cheesecakes: {
      title: 'Cheesecakes',
      links: [
        { name: 'Red Velvet Cheesecake', path: '/categories?cakeName=Red%20Velvet%20Cheesecake' },
        { name: 'Blueberry Cheesecake', path: '/categories?cakeName=Blueberry%20Cheesecake' }
      ]
    },
    fusion: {
      title: 'Fusion Cakes',
      links: [
        { name: 'Rajbhog', path: '/categories?cakeName=Rajbhog' },
        { name: 'Rasmalai', path: '/categories?cakeName=Rasmalai' },
        { name: 'Gulab Jamun', path: '/categories?cakeName=Gulab%20Jamun' }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <button className="text-bakery-darkBrown group-hover:text-bakery-brown font-medium transition-colors flex items-center gap-1 h-full">
                Categories <ChevronDown size={16} />
              </button>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-20 left-0 w-full bg-white shadow-xl border-t border-bakery-peach opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="max-w-7xl mx-auto px-8 py-10">
                  <div className="grid grid-cols-4 gap-8">
                    {/* Column 1 */}
                    <div>
                      <Link to="/categories?categoryGroup=Chocolate%20Cakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.chocolate.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.chocolate.links.map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Column 2 */}
                    <div>
                      <Link to="/categories?categoryGroup=Regular%20Cakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.regular.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.regular.links.map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Column 3 */}
                    <div>
                      <Link to="/categories?categoryGroup=Cheesecakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.cheesecakes.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.cheesecakes.links.map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Column 4 */}
                    <div>
                      <Link to="/categories?categoryGroup=Fusion%20Cakes" className="hover:text-bakery-gold block group/header">
                        <h3 className="font-serif font-bold text-lg text-bakery-darkBrown group-hover/header:text-bakery-gold mb-4 pb-2 border-b-2 border-bakery-gold/30 group-hover/header:border-bakery-gold transition-all duration-300">
                          {categories.fusion.title}
                        </h3>
                      </Link>
                      <ul className="space-y-3">
                        {categories.fusion.links.map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link.name}</Link>
                          </li>
                        ))}
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

            <Link 
              to="/categories" 
              className="px-6 py-2.5 bg-bakery-pink-vibrant hover:bg-bakery-pink-dark text-white rounded-full font-bold text-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 shrink-0 shadow-sm ml-2"
            >
              Order Now <ArrowRight size={16} />
            </Link>

            <button 
              onClick={openCart}
              className="relative p-2 text-bakery-brown hover:text-bakery-darkBrown transition-colors ml-4"
            >
              <ShoppingBag size={24} />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-bakery-brown rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex lg:hidden items-center gap-4">
            <button 
              onClick={openCart}
              className="relative p-2 text-bakery-brown"
            >
              <ShoppingBag size={24} />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-bakery-brown rounded-full">
                  {getCartCount()}
                </span>
              )}
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
                regular: 'Regular Cakes',
                cheesecakes: 'Cheesecakes',
                fusion: 'Fusion Cakes'
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

            <div className="px-3 py-4">
              <Link 
                to="/categories" 
                className="w-full px-6 py-3 bg-bakery-pink-vibrant hover:bg-bakery-pink-dark text-white rounded-full font-bold text-base hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                Order Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
