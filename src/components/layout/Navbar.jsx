import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
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
    trending: {
      title: 'Trending Cakes',
      links: ['Mango Cakes', 'Fresh Drops', 'Football Cakes', 'Fire Cakes', 'Bento Cakes', 'Drip Cakes', 'Gourmet Cakes', 'Ribbon Cakes', 'Anime Cakes', '60 Minutes Delivery']
    },
    flavors: {
      title: 'By Flavours',
      links: ['Chocolate', 'Pineapple', 'Mango', 'Fruit', 'Butterscotch', 'Blueberry', 'Black Forest', 'Vanilla', 'Red Velvet', 'Kit Kat', 'Oreo']
    },
    birthday: {
      title: 'Birthday Cakes',
      links: ['Birthday Cakes', 'Birthday Photo Cakes', 'Half Birthday Cakes', '1st Birthday Cakes', '2nd Birthday Cakes', '18th Birthday Cakes', '40th Birthday Cakes', '50th Birthday Cakes']
    },
    anniversary: {
      title: 'Anniversary Cakes',
      links: ['All Anniversary Cakes', 'Anniversary Photo Cakes', 'Anniversary Cakes For Parents', '1st Anniversary Cakes', '5th Anniversary Cakes', '10th Anniversary Cakes', '25th Anniversary Cakes', '50th Anniversary Cakes']
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
                      <h3 className="font-serif font-bold text-lg text-bakery-darkBrown mb-4 pb-2 border-b-2 border-bakery-gold/30">{categories.trending.title}</h3>
                      <ul className="space-y-3">
                        {categories.trending.links.map(link => (
                          <li key={link}>
                            <Link to={`/categories?tag=${link}`} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Column 2 */}
                    <div>
                      <h3 className="font-serif font-bold text-lg text-bakery-darkBrown mb-4 pb-2 border-b-2 border-bakery-gold/30">{categories.flavors.title}</h3>
                      <ul className="space-y-3">
                        {categories.flavors.links.map(link => (
                          <li key={link}>
                            <Link to={`/categories?flavor=${link}`} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Column 3 */}
                    <div>
                      <h3 className="font-serif font-bold text-lg text-bakery-darkBrown mb-4 pb-2 border-b-2 border-bakery-gold/30">{categories.birthday.title}</h3>
                      <ul className="space-y-3">
                        {categories.birthday.links.map(link => (
                          <li key={link}>
                            <Link to={`/categories?tag=${link}`} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Column 4 */}
                    <div>
                      <h3 className="font-serif font-bold text-lg text-bakery-darkBrown mb-4 pb-2 border-b-2 border-bakery-gold/30">{categories.anniversary.title}</h3>
                      <ul className="space-y-3">
                        {categories.anniversary.links.map(link => (
                          <li key={link}>
                            <Link to={`/categories?tag=${link}`} className="text-sm text-bakery-brown hover:text-bakery-gold transition-colors block">{link}</Link>
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
            {Object.entries(categories).map(([key, category]) => (
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
                    {category.links.map(link => (
                      <Link 
                        key={link} 
                        to={`/categories?${key === 'flavors' ? 'flavor' : 'tag'}=${link}`} 
                        className="block text-sm text-bakery-brown py-1"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

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
