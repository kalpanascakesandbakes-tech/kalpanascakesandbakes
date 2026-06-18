import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Award, Clock } from 'lucide-react';
import { getBestSellers, getFeaturedCakes } from '../utils/mockData';
import CakeCard from '../components/ui/CakeCard';
import CakeQuickView from '../components/ui/CakeQuickView';

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
  const featuredCakes = getFeaturedCakes();
  const bestSellers = getBestSellers();
  const [selectedCake, setSelectedCake] = useState(null);
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
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-bakery-darkBrown via-bakery-brown to-bakery-darkBrown text-white py-3 shadow-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-center">
          <span className="bg-bakery-gold text-bakery-darkBrown text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shrink-0">Limited Time</span>
          <p className="font-medium text-sm md:text-base">
            Get <span className="font-bold text-bakery-peach">10% OFF</span> on your first order! Use code: <span className="font-bold tracking-wider font-mono bg-white/20 px-2 py-0.5 rounded">SWEET10</span>
          </p>
        </div>
      </div>

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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
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
              { name: 'Chocolate Cakes', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600', link: '/categories?flavor=Chocolate' },
              { name: 'Birthday Cakes', image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=600', link: '/categories?tag=Birthday Cakes' },
              { name: 'Anniversary Cakes', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80', link: '/categories?tag=Anniversary Cakes' },
              { name: 'Trending Cakes', image: 'https://images.unsplash.com/photo-1578985545045-c18f41e1b327?auto=format&fit=crop&w=600&q=80', link: '/categories?tag=Trending Cakes' }
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Priya M.', review: 'The Rasmalai cake was an absolute hit at our anniversary party! So soft and flavorful.', rating: 5 },
              { name: 'Rahul S.', review: 'Best Chocolate Truffle cake I have ever had. The packaging was also very premium.', rating: 5 },
              { name: 'Anita K.', review: 'Ordered a custom Barbie cake for my daughter. It looked beautiful and tasted even better.', rating: 4 }
            ].map((test, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-bakery-peach/30 relative"
              >
                <div className="text-bakery-gold mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < test.rating ? 'fill-current' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-bakery-brown/80 mb-6 italic">"{test.review}"</p>
                <h4 className="font-bold text-bakery-darkBrown">- {test.name}</h4>
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
    </div>
  );
};

export default Home;
