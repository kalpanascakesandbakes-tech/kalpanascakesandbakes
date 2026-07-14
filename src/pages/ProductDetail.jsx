import { useState } from 'react';
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
  const [weight, setWeight] = useState('0.5 KG');
  const [isEggless, setIsEggless] = useState(true);
  const [nameOnCake, setNameOnCake] = useState('');
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Custom weight state
  const [isCustomWeight, setIsCustomWeight] = useState(false);
  const [customWeightValue, setCustomWeightValue] = useState(6);

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

  const standardWeights = ['0.5 KG', '1 KG', '1.5 KG', '2 KG', '3 KG', '4 KG', '5 KG'];
  
  const currentMultiplier = isCustomWeight 
    ? (customWeightValue * 2) // Assuming base price is 0.5kg, so 1kg = 2x multiplier
    : WEIGHT_MULTIPLIERS[weight];
    
  const currentPrice = cake.price * currentMultiplier;

  const handleAddToCart = () => {
    addToCart({
      id: cake.id,
      name: cake.name,
      basePrice: cake.price,
      image: cake.image,
      flavor: cake.category,
      weight: isCustomWeight ? `${customWeightValue} KG` : weight,
      weightMultiplier: currentMultiplier,
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
    // Actual WhatsApp logic is on checkout completion, or we can build a direct link here.
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
              <p className="text-xl text-bakery-brown/80 mb-4">{cake.category}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-bakery-darkBrown">₹{currentPrice}</span>
                <span className="text-sm text-bakery-brown/60">(Inclusive of all taxes)</span>
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
                  {!isCustomWeight && standardWeights.map(w => (
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
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-bakery-brown text-white rounded-full font-bold text-lg hover:bg-bakery-darkBrown transition-colors shadow-lg shadow-bakery-brown/30 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button 
                  onClick={handleOrderWhatsApp}
                  className="flex-1 py-4 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
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
