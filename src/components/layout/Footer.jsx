import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import LicenseModal from './LicenseModal';

const Footer = () => {
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  return (
    <footer className="bg-bakery-darkBrown text-bakery-peach pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-cursive text-3xl font-bold text-bakery-gold mb-4">
              Kalpana's Cakes & Bakes
            </h2>
            <p className="text-sm text-bakery-peach/80 mb-4">
              Premium homemade cakes baked with love. Delivering joy for all your special occasions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-bakery-gold transition-colors"><FaFacebook size={20} /></a>
              <a
                href="https://www.instagram.com/kalpanascakesandbakes?utm_source=qr&igsh=dHQzNml4NHg1cHFz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bakery-gold transition-colors"
                title="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-bakery-gold transition-colors"><FaTwitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categories?viewMode=menu" className="hover:text-bakery-gold transition-colors font-semibold text-bakery-gold">Our Menu Card</Link></li>
              <li><Link to="/categories" className="hover:text-bakery-gold transition-colors">Our Cakes</Link></li>
              <li><Link to="/custom-cake" className="hover:text-bakery-gold transition-colors">Custom Orders</Link></li>
              <li><Link to="/bulk-order" className="hover:text-bakery-gold transition-colors">Bulk Orders</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categories?categoryGroup=Chocolate%20Cakes" className="hover:text-bakery-gold transition-colors">Chocolate Cakes</Link></li>
              <li><Link to="/categories?categoryGroup=Cheesecakes" className="hover:text-bakery-gold transition-colors">Cheesecakes</Link></li>
              <li><Link to="/categories?categoryGroup=Fusion%20Cakes" className="hover:text-bakery-gold transition-colors">Fusion Cakes</Link></li>
              <li><Link to="/categories?tag=Trending Cakes" className="hover:text-bakery-gold transition-colors">Trending Cakes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-bakery-gold shrink-0 mt-0.5" />
                <span>2/A/501, Om Sai CHS Ltd, Jain Upashray Marg, Opposite Ayyappa Temple, Tagore Nagar, Vikhroli - East, Mumbai - 400083, Maharashtra, India.</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-bakery-gold shrink-0" />
                <span> +91-9004762873</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-bakery-gold shrink-0" />
                <span>kalpanascakesandbakes@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaInstagram size={18} className="text-bakery-gold shrink-0" />
                <a
                  href="https://www.instagram.com/kalpanascakesandbakes?utm_source=qr&igsh=dHQzNml4NHg1cHFz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bakery-gold transition-colors"
                >
                  Kalpanascakesandbakes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-bakery-peach/20 pt-8 flex flex-col items-center justify-center gap-4 text-center">
          {/* FSSAI Badge (Refined) */}
          <div
            onClick={() => setIsLicenseOpen(true)}
            className="flex items-center gap-3 bg-bakery-darkBrown/40 text-bakery-peach px-4 py-2.5 rounded-xl border border-bakery-peach/15 cursor-pointer hover:border-bakery-gold/40 hover:bg-bakery-darkBrown/60 transition-all duration-300 select-none group"
            title="Click to view registration certificate"
          >
            <img
              src="/cakes/fssai-logo.png"
              alt="FSSAI Logo"
              className="h-7 w-auto object-contain brightness-95 contrast-105 group-hover:brightness-100 transition-all"
            />
            <div className="text-left leading-tight">
              <div className="text-[9px] uppercase tracking-wider text-bakery-peach/60 font-semibold font-sans">Registered Food Business</div>
              <div className="text-xs font-bold font-mono text-bakery-gold group-hover:text-bakery-pink transition-colors">Lic. No. 21526013000741</div>
            </div>
          </div>

          <p className="text-sm text-bakery-peach/50">&copy; {new Date().getFullYear()} Kalpana's Cakes & Bakes. All rights reserved.</p>
        </div>

        {/* License Modal */}
        <LicenseModal isOpen={isLicenseOpen} onClose={() => setIsLicenseOpen(false)} />
      </div>
    </footer>
  );
};

export default Footer;
