import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Award, Clock, ShieldCheck, BookOpen, Download } from 'lucide-react';
import { getBestSellers, getFeaturedCakes } from '../utils/mockData';
import CakeCard from '../components/ui/CakeCard';
import CakeQuickView from '../components/ui/CakeQuickView';
import LicenseModal from '../components/layout/LicenseModal';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const heroSlides = [
  {
    image: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=1920', // Whole chocolate drip cake
    title: 'Handcrafted with Love',
    subtitle: 'Premium homemade cakes delivered fresh to your door.'
  },
  {
    image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1920', // Strawberry/Fruit cake
    title: 'Rich & Flavorful',
    subtitle: 'Experience our signature fruit creations.'
  },
  {
    image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=1920', // Tiered wedding cake
    title: 'Celebrate Every Moment',
    subtitle: 'Make your special occasions unforgettable.'
  }
];

const Home = () => {
  useDocumentMetadata(
    "Best Cake Shop in Vikhroli, Mumbai | Homemade Cakes & Bakery",
    "Order delicious, freshly baked homemade cakes in Vikhroli East, Mumbai. Eggless cakes, custom birthday cakes, and cheesecakes delivered fresh to your door."
  );

  const featuredCakes = getFeaturedCakes();
  const bestSellers = getBestSellers();
  const [selectedCake, setSelectedCake] = useState(null);
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-bakery-cream overflow-hidden">


      {/* Hero Carousel Section */}
      <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Opaque Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroSlides[currentSlide].image}')` }}
            />
            {/* Dark gradient overlay so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-left">
                  <motion.h1 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-white/90 font-medium mb-10 drop-shadow-lg"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Link to="/categories" className="px-8 py-4 bg-bakery-gold text-bakery-darkBrown rounded-full font-bold text-lg hover:bg-white transition-colors shadow-xl flex items-center justify-center gap-2">
                      Order Now <ArrowRight size={20} />
                    </Link>
                    <Link to="/custom-cake" className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm">
                      Customize a Cake
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-bakery-gold scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div {...fadeInUp} className="flex flex-col items-center p-6 bg-bakery-cream rounded-2xl border border-bakery-peach">
              <div className="w-16 h-16 bg-bakery-peach rounded-full flex items-center justify-center mb-4 text-bakery-brown">
                <Truck size={32} />
              </div>
              <h3 className="font-serif font-bold text-xl mb-2 text-bakery-darkBrown">Fast Delivery</h3>
              <p className="text-bakery-brown/80">Fresh cakes delivered securely to your doorstep.</p>
            </motion.div>
            <motion.div {...fadeInUp} className="flex flex-col items-center p-6 bg-bakery-cream rounded-2xl border border-bakery-peach" transition={{ delay: 0.2 }}>
              <div className="w-16 h-16 bg-bakery-peach rounded-full flex items-center justify-center mb-4 text-bakery-brown">
                <Award size={32} />
              </div>
              <h3 className="font-serif font-bold text-xl mb-2 text-bakery-darkBrown">Premium Quality</h3>
              <p className="text-bakery-brown/80">Only the finest ingredients go into our homemade bakes.</p>
            </motion.div>
            <motion.div {...fadeInUp} className="flex flex-col items-center p-6 bg-bakery-cream rounded-2xl border border-bakery-peach" transition={{ delay: 0.4 }}>
              <div className="w-16 h-16 bg-bakery-peach rounded-full flex items-center justify-center mb-4 text-bakery-brown">
                <Clock size={32} />
              </div>
              <h3 className="font-serif font-bold text-xl mb-2 text-bakery-darkBrown">Freshly Baked</h3>
              <p className="text-bakery-brown/80">Every order is baked fresh just for you.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FSSAI Trust Banner */}
      <section className="py-12 bg-gradient-to-r from-bakery-peach/10 via-bakery-cream to-bakery-peach/20 border-y border-bakery-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-bakery-peach/20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-20 h-20 bg-bakery-peach/30 rounded-2xl flex items-center justify-center shrink-0 border border-bakery-peach/40 shadow-inner">
                <img 
                  src="/cakes/fssai-logo.png" 
                  alt="FSSAI Logo" 
                  className="h-14 w-auto object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 justify-center md:justify-start">
                  <span className="bg-bakery-gold/20 text-bakery-brown px-3.5 py-1 rounded-full text-xs font-bold font-sans tracking-wide uppercase flex items-center gap-1.5 justify-center">
                    <ShieldCheck size={14} className="text-bakery-gold shrink-0" />
                    FSSAI Registered
                  </span>
                  <span className="font-mono text-sm text-bakery-brown/70 font-semibold">
                    Lic. No. 21526013000741
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-bakery-darkBrown mb-2">
                  Baked with Love, Crafted with Care
                </h3>
                <p className="text-bakery-brown/85 max-w-2xl leading-relaxed">
                  We are a fully licensed and registered food business under the Food Safety and Standards Authority of India (FSSAI). Every cake is baked with the highest standards of hygiene, sanitation, and premium quality ingredients to ensure you get nothing but safe, fresh, and delicious bakes.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsLicenseOpen(true)}
              className="px-8 py-4 bg-bakery-brown text-white hover:bg-bakery-darkBrown rounded-full font-bold text-base transition-all duration-300 shadow-md hover:shadow-lg shrink-0 cursor-pointer flex items-center gap-2 hover:scale-105"
            >
              <ShieldCheck size={18} />
              View Certificate
            </button>
          </div>
        </div>
      </section>

      {/* Menu Card Promo Section */}
      <section className="py-16 bg-gradient-to-br from-white via-bakery-peach/10 to-bakery-pink/10 border-b border-bakery-peach/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Card Mockup (Float Animation) */}
            <motion.div 
              {...fadeInUp}
              className="lg:col-span-5 flex justify-center order-2 lg:order-1"
            >
              <Link to="/categories?viewMode=menu" className="group relative block w-full max-w-[340px] aspect-[1/1.5] bg-[#fdf6f6] border-2 border-bakery-pink/30 rounded-[2rem] shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-500 cursor-pointer">
                {/* Gingham Mock Header */}
                <div 
                  className="h-16 w-full relative flex items-center justify-center"
                  style={{
                    backgroundColor: '#fff0f2',
                    backgroundImage: `
                      linear-gradient(90deg, rgba(244, 194, 194, 0.4) 50%, transparent 50%),
                      linear-gradient(rgba(244, 194, 194, 0.4) 50%, transparent 50%)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                >
                  <div className="absolute -bottom-8 w-16 h-16 rounded-full border-2 border-[#fdf6f6] overflow-hidden shadow-md bg-white">
                    <img src="/cakeshoplogo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                {/* Mock List Content */}
                <div className="pt-10 px-5 pb-5 space-y-4">
                  <div className="text-center">
                    <h4 className="font-serif font-bold text-base text-[#8b1e3f]">Kalpana's Cakes & Bakes</h4>
                    <span className="text-[10px] text-bakery-pink-dark font-cursive">Homemade cakes</span>
                  </div>
                  
                  {/* Mock Categories & Items */}
                  <div className="space-y-3">
                    <div className="bg-[#fbcfe8] text-[#be185d] text-[10px] font-serif font-bold px-2 py-0.5 rounded-full inline-block">Chocolate Cakes</div>
                    <div className="space-y-1 text-[11px] text-bakery-darkBrown font-medium">
                      <div className="flex justify-between"><span>Chocolate Oreo</span><span>₹500</span></div>
                      <div className="flex justify-between"><span>Dutch Truffle</span><span>₹580</span></div>
                      <div className="flex justify-between font-bold text-bakery-pink-dark"><span>Chocolate Truffle ★</span><span>₹600</span></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#fbcfe8] text-[#be185d] text-[10px] font-serif font-bold px-2 py-0.5 rounded-full inline-block">Classic Cakes</div>
                    <div className="space-y-1 text-[11px] text-bakery-darkBrown font-medium">
                      <div className="flex justify-between"><span>Plain Vanilla</span><span>₹450</span></div>
                      <div className="flex justify-between"><span>Butterscotch</span><span>₹500</span></div>
                    </div>
                  </div>
                </div>

                {/* Overlap Hover Banner */}
                <div className="absolute inset-0 bg-[#be185d]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-white/95 text-[#be185d] font-bold px-5 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <BookOpen size={16} /> Open Menu Card
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Promo Text Section */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left order-1 lg:order-2">
              <span className="bg-bakery-pink-vibrant/10 text-bakery-pink-dark px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                Digital & Print Menu
              </span>
              
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-bakery-darkBrown leading-tight">
                Our Exquisite Menu Card is Here!
              </h2>
              
              <p className="text-lg text-bakery-brown/90 leading-relaxed max-w-2xl">
                Browse our complete selection of homemade bakes. From rich Dutch Truffle cakes to custom theme doll cakes, brownies, and pastries, we have something to sweeten every occasion. Check out exact pricing and order directly!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-bakery-peach/30 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-bakery-peach flex items-center justify-center text-bakery-brown font-bold shrink-0">₹</div>
                  <span className="font-semibold text-sm text-bakery-darkBrown text-left">Exact & Transparent Pricing</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-bakery-peach/30 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-bakery-peach flex items-center justify-center text-bakery-brown shrink-0"><Star size={18} className="fill-current" /></div>
                  <span className="font-semibold text-sm text-bakery-darkBrown text-left">Best Seller Highlights</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/categories?viewMode=menu" 
                  className="px-8 py-4 bg-bakery-pink-vibrant text-white hover:bg-bakery-pink-dark rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <BookOpen size={20} /> View Menu Card
                </Link>
                <a 
                  href="/cakes/menu-card.jpeg" 
                  download="Kalpanas_Cakes_Bakes_Menu.jpeg"
                  className="px-8 py-4 bg-transparent text-bakery-brown border-2 border-bakery-brown/40 hover:border-bakery-brown rounded-full font-bold text-lg hover:bg-bakery-cream transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download PDF Card
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="py-20 bg-bakery-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-bakery-darkBrown mb-4">Our Specials</h2>
            <div className="w-24 h-1 bg-bakery-gold mx-auto rounded-full mb-4"></div>
            <p className="text-bakery-brown">Handpicked delights that everyone loves</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {featuredCakes.map(cake => (
              <motion.div key={cake.id} variants={fadeInUp}>
                <CakeCard cake={cake} onQuickView={setSelectedCake} />
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Link to="/categories" className="inline-block px-6 py-3 border-2 border-bakery-brown text-bakery-brown font-bold rounded-full hover:bg-bakery-brown hover:text-white transition-colors">
              View All Cakes
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-bakery-peach/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-4xl font-serif font-bold text-bakery-darkBrown mb-4">Best Sellers</h2>
              <div className="w-24 h-1 bg-bakery-gold rounded-full mb-4"></div>
              <p className="text-bakery-brown">Our most loved creations</p>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {bestSellers.map(cake => (
              <motion.div key={cake.id} variants={fadeInUp}>
                <CakeCard cake={cake} onQuickView={setSelectedCake} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-bakery-darkBrown mb-4">Shop by Category</h2>
            <div className="w-24 h-1 bg-bakery-gold mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Chocolate Cakes', image: '/cakes/truffle_whole_1781772121847.png', link: '/categories?categoryGroup=Chocolate%20Cakes' },
              { name: 'Theme Cakes', image: '/cakes/Cake/WhatsApp Image 2026-06-28 at 10.21.51 AM.jpeg', link: '/categories?categoryGroup=Theme%20Cakes' },
              { name: 'Cheesecakes', image: '/cakes/cheesecake.png', link: '/categories?categoryGroup=Cheesecakes' },
              { name: 'Fusion Cakes', image: '/cakes/fusion.png', link: '/categories?categoryGroup=Fusion%20Cakes' }
            ].map((cat, idx) => (
              <Link to={cat.link} key={idx} className="group relative rounded-2xl overflow-hidden h-64 shadow-md">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-serif text-2xl font-bold tracking-wider">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-bakery-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-bakery-darkBrown mb-4">Happy Customers</h2>
            <div className="w-24 h-1 bg-bakery-gold mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: 'Dipti Sawant', 
                review: 'Thank you from the bottom if my heart you nade our morning very sweet and happy on this special day.the cake tastes very yummy 😋 and quantity is too good 👍 next birthday cake 🎂 order coming December with you only😊😇😘 cake decorations #@ ⭐⭐⭐⭐⭐.👍🏻✌🏻', 
                rating: 5 
              },
              { 
                name: 'Dipti Sawant', 
                review: 'Thanks dear they all liked the cake it was soft and tasty 😀😊👍🏻👍🏻😇😇', 
                rating: 5 
              },
              { 
                name: 'Dipti Sawant', 
                review: 'Too much Lovely 😍 dear OSM my friend and her hubby and everyone enjoyed it very tasty and delicious and superb looking cake👍🏻👍🏻👍🏻👍🏻👍🏻', 
                rating: 5 
              },
              { 
                name: 'Dipti Sawant', 
                review: 'Both cakes very very nice and yummy all of us enjoyed its suoer delicious and truly amazing 10/10 for both these cakes 👆🏻👌🏻👌🏻❤️🌹🌹🌹🌹🌹 special thank you for the cat cake😇😊😄💓💓', 
                rating: 5 
              }
            ].map((test, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-bakery-peach/30 relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-bakery-gold mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className={i < test.rating ? 'fill-current' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-bakery-brown/85 mb-6 italic leading-relaxed text-sm sm:text-base">"{test.review}"</p>
                </div>
                <h4 className="font-bold text-bakery-darkBrown text-sm sm:text-base">- {test.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CakeQuickView 
        cake={selectedCake} 
        isOpen={!!selectedCake} 
        onClose={() => setSelectedCake(null)} 
      />

      <LicenseModal 
        isOpen={isLicenseOpen} 
        onClose={() => setIsLicenseOpen(false)} 
      />
    </div>
  );
};

export default Home;
