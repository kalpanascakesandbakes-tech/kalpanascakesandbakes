import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Info } from 'lucide-react';
import { mockCakes } from '../utils/mockData';
import useCartStore, { WEIGHT_MULTIPLIERS } from '../store/useCartStore';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cake = mockCakes.find(c => c.id === id);
  const addToCart = useCartStore(state => state.addToCart);

  useDocumentMetadata(
    cake ? `${cake.name} | Order Online in Mumbai` : "Order Cake Online",
    cake ? `${cake.name} - Delicious eggless ${cake.flavor} cake from Kalpana's Cakes & Bakes. Order now for fresh delivery in Vikhroli East, Mumbai.` : "Order fresh, premium homemade cakes online."
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [isEggless, setIsEggless] = useState(true);
  const [nameOnCake, setNameOnCake] = useState('');
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Custom weight state
  const [isCustomWeight, setIsCustomWeight] = useState(false);
  const [customWeightValue, setCustomWeightValue] = useState(6);

  // Determine available weights dynamically based on prices database
  const availableWeights = (() => {
    if (!cake) return ['0.5 KG', '1 KG', '1.5 KG', '2 KG', '3 KG', '4 KG', '5 KG'];
    if (!cake.prices) return ['0.5 KG', '1 KG', '1.5 KG', '2 KG', '3 KG', '4 KG', '5 KG'];
    
    const list = [];
    if (cake.prices['0.5 KG'] !== null && cake.prices['0.5 KG'] !== undefined) list.push('0.5 KG');
    if (cake.prices['1 KG'] !== null && cake.prices['1 KG'] !== undefined) list.push('1 KG');
    if (cake.prices['1.5 KG'] !== null && cake.prices['1.5 KG'] !== undefined) list.push('1.5 KG');
    
    const hasBaseWeight = (cake.prices['1 KG'] !== null && cake.prices['1 KG'] !== undefined) || 
                          (cake.prices['0.5 KG'] !== null && cake.prices['0.5 KG'] !== undefined);
    if (hasBaseWeight || cake.id === 'c135') {
      list.push('2 KG', '3 KG', '4 KG', '5 KG');
    }
    return list;
  })();

  const [weight, setWeight] = useState('1 KG');

  // Reset states when ID or cake changes
  useEffect(() => {
    if (cake) {
      setNameOnCake('');
      setMessage('');
      setInstructions('');
      setIsCustomWeight(false);
      setSelectedImage(0);
      
      if (cake.id === 'c135') {
        setWeight('2 KG');
      } else if (cake.prices) {
        const valid = ['0.5 KG', '1 KG', '1.5 KG'].filter(w => cake.prices[w] !== null && cake.prices[w] !== undefined);
        setWeight(valid.length > 0 ? valid[0] : '1 KG');
      } else {
        setWeight('0.5 KG');
      }
    }
  }, [id, cake]);

  if (!cake) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h2 className="text-2xl font-serif text-bakery-darkBrown">Cake not found!</h2>
      </div>
    );
  }

  const hasImages = cake.images && cake.images.length === 4;
  const galleryImages = hasImages ? cake.images : [cake.image, cake.image, cake.image, cake.image];
  const galleryViews = hasImages ? [
    { classes: 'object-center' },
    { classes: 'object-center' },
    { classes: 'object-center' },
    { classes: 'object-center' }
  ] : [
    { classes: 'object-center scale-100' },
    { classes: 'object-left scale-150 origin-left' },
    { classes: 'object-right scale-150 origin-right' },
    { classes: 'object-top scale-150 origin-top' }
  ];

  // Calculate current price dynamically
  const currentPrice = (() => {
    if (isCustomWeight) {
      if (cake.prices) {
        const baseKgPrice = cake.prices['1 KG'] || (cake.prices['0.5 KG'] ? cake.prices['0.5 KG'] * 2 : cake.price * 2);
        return customWeightValue * baseKgPrice;
      }
      return cake.price * (customWeightValue * 2);
    }
    
    if (cake.prices) {
      if (cake.prices[weight] !== undefined && cake.prices[weight] !== null) {
        return cake.prices[weight];
      }
      // Proportional pricing for weights above 1.5 KG
      const numericWeight = parseFloat(weight);
      if (cake.prices['1 KG']) {
        return numericWeight * cake.prices['1 KG'];
      }
      if (cake.prices['0.5 KG']) {
        return (numericWeight / 0.5) * cake.prices['0.5 KG'];
      }
    }
    
    // Fallback using legacy multipliers
    const currentMultiplier = WEIGHT_MULTIPLIERS[weight] || 1;
    return cake.price * currentMultiplier;
  })();

  const handleAddToCart = () => {
    addToCart({
      id: cake.id,
      name: cake.name,
      basePrice: cake.price,
      price: currentPrice, // Dynamic unit price based on weight/size
      image: cake.image,
      flavor: cake.flavor || cake.category,
      weight: isCustomWeight ? `${customWeightValue} KG` : weight,
      eggless: isEggless,
      quantity: 1,
      nameOnCake,
      message,
      instructions
    });
  };

  const handleOrderWhatsApp = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Image & Preview */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-bakery-cream border-2 border-bakery-peach/30 shadow-lg">
              <img 
                src={galleryImages[selectedImage]} 
                alt={cake.name} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${galleryViews[selectedImage].classes}`}
              />
              
              {/* Live Preview Text overlay */}
              {nameOnCake && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                >
                  <span className="font-cursive text-5xl md:text-6xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] bg-black/20 px-6 py-2 rounded-xl backdrop-blur-sm">
                    {nameOnCake}
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {galleryImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${selectedImage === i ? 'border-bakery-gold' : 'border-transparent hover:border-bakery-gold/50'}`}
                >
                  <img src={img} className={`w-full h-full object-cover ${galleryViews[i].classes}`} alt={`Thumbnail ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details & Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-bakery-darkBrown mb-2">{cake.name}</h1>
              <p className="text-xl text-bakery-brown/80 mb-3">{cake.flavor || cake.category}</p>
              
              <div className="flex items-baseline gap-4 mb-4 bg-bakery-cream/35 p-3 rounded-xl border border-bakery-peach/20 w-fit">
                <span className="text-3xl font-sans font-bold text-bakery-pink-dark">₹{currentPrice}</span>
                {!isCustomWeight && (
                  <span className="text-sm text-bakery-brown/60">for {weight}</span>
                )}
              </div>

              <p className="text-bakery-brown/80 leading-relaxed">
                Indulge in our exquisite {cake.name}. Handcrafted with premium ingredients, 
                this beautiful creation is perfect for making your special moments even sweeter.
              </p>
            </div>

            <div className="space-y-6">
              {/* Pure Veg Badge */}
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200 text-green-800">
                <span className="w-5 h-5 rounded-md border-2 border-green-600 flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                </span>
                <span className="font-bold text-sm">100% Pure Vegetarian / Eggless Cake</span>
              </div>

              {/* Weight Selection */}
              <div>
                <label className="block font-bold text-bakery-darkBrown mb-3">Select Weight</label>
                <div className="flex flex-wrap gap-3">
                  {!isCustomWeight && availableWeights.map(w => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        weight === w 
                        ? 'border-bakery-brown bg-bakery-brown text-white' 
                        : 'border-bakery-peach text-bakery-brown hover:border-bakery-brown'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCustomWeight(!isCustomWeight)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      isCustomWeight 
                      ? 'border-bakery-gold bg-bakery-gold text-white' 
                      : 'border-bakery-peach text-bakery-brown hover:border-bakery-gold'
                    }`}
                  >
                    Custom (Above 5kg)
                  </button>
                </div>
                
                {isCustomWeight && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 flex items-center gap-4"
                  >
                    <input 
                      type="number" 
                      min="6" 
                      value={customWeightValue}
                      onChange={(e) => setCustomWeightValue(Math.max(6, Number(e.target.value)))}
                      className="w-24 p-2 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none"
                    />
                    <span className="text-bakery-brown font-medium">KG</span>
                    <span className="text-sm text-bakery-brown/60 ml-2"><Info size={14} className="inline mr-1"/>Minimum 6 KG for custom</span>
                  </motion.div>
                )}
              </div>

              {/* Personalization */}
              <div className="space-y-4 pt-6 border-t border-bakery-peach">
                <h3 className="font-serif font-bold text-xl text-bakery-darkBrown">Personalize Your Cake</h3>
                
                <div>
                  <label className="block text-sm text-bakery-brown mb-1">Name on Cake (Live Preview)</label>
                  <input 
                    type="text" 
                    maxLength={15}
                    value={nameOnCake}
                    onChange={(e) => setNameOnCake(e.target.value.toUpperCase())}
                    placeholder="e.g. YASH"
                    className="w-full p-3 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none uppercase font-bold"
                  />
                 </div>
              </div>

              {/* Actions */}
              <div className="pt-6 space-y-4">
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-bakery-pink-vibrant text-white rounded-full font-bold text-lg hover:bg-bakery-pink-dark transition-colors shadow-lg shadow-bakery-pink-vibrant/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>

                <button 
                  onClick={handleOrderWhatsApp}
                  className="w-full py-4 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={20} />
                  Order on WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
