import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Info, X } from 'lucide-react';
import { mockCakes } from '../utils/mockData';
import useCartStore, { WEIGHT_MULTIPLIERS } from '../store/useCartStore';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const FLAVOR_BASE_PRICES = {
  'Pineapple': 500,
  'Chocolate Truffle': 600,
  'Vanilla': 450,
  'Black Forest': 500,
  'Butter Scotch': 500,
  'Strawberry': 500,
  'Blueberry': 580,
  'Red Velvet': 700
};

const BENTO_FLAVOR_BASE_PRICES = {
  'Pineapple': 300,
  'Chocolate Truffle': 350,
  'Vanilla': 300,
  'Black Forest': 300,
  'Butter Scotch': 300,
  'Strawberry': 300,
  'Blueberry': 300,
  'Red Velvet': 380
};

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
  const [customWeightValue, setCustomWeightValue] = useState(4);

  // Check if Bento Cake
  const isBento = cake && (cake.categoryGroup === 'Bento Cakes' || (cake.tags && cake.tags.includes('Bento Cakes')));
  const flavorPrices = isBento ? BENTO_FLAVOR_BASE_PRICES : FLAVOR_BASE_PRICES;

  // Always enable flavor selection
  const priceDependsOnFlavor = true;

  // Retrieve the default flavor choice matching reference descriptions
  const getDefaultFlavor = () => {
    if (!cake) return 'Chocolate Truffle';
    
    if (cake.flavor) {
      const f = cake.flavor.toLowerCase();
      if (f.includes('butterscotch') || f.includes('butter scotch')) return 'Butter Scotch';
      if (f.includes('vanilla')) return 'Vanilla';
      if (f.includes('pineapple')) return 'Pineapple';
      if (f.includes('strawberry')) return 'Strawberry';
      if (f.includes('black forest')) return 'Black Forest';
      if (f.includes('blueberry')) return 'Blueberry';
      if (f.includes('red velvet')) return 'Red Velvet';
      if (f.includes('chocolate')) return 'Chocolate Truffle';
    }

    if (cake.description) {
      const desc = cake.description.toLowerCase();
      if (desc.includes('butterscotch')) return 'Butter Scotch';
      if (desc.includes('vanilla')) return 'Vanilla';
      if (desc.includes('pineapple')) return 'Pineapple';
      if (desc.includes('strawberry')) return 'Strawberry';
      if (desc.includes('black forest')) return 'Black Forest';
      if (desc.includes('blueberry')) return 'Blueberry';
      if (desc.includes('red velvet')) return 'Red Velvet';
    }
    return 'Chocolate Truffle';
  };

  // Calculate the design premium fee for any cake based on default flavor base price
  const designPremium = (() => {
    if (!cake) return 0;
    const defaultFlavorName = getDefaultFlavor();
    const refBasePrice = flavorPrices[defaultFlavorName] || 600;

    const halfKgPrice = cake.prices && cake.prices['0.5 KG'] ? cake.prices['0.5 KG'] : cake.price;
    return Math.max(0, halfKgPrice - refBasePrice);
  })();

  const [selectedFlavor, setSelectedFlavor] = useState('Chocolate Truffle');

  // Parse minimum weight limit from description if present (e.g. "Minimum 2 Kg")
  const getMinWeightLimit = () => {
    if (!cake || !cake.description) return 0.5;
    const desc = cake.description.toLowerCase();
    const match = desc.match(/minimum\s+(\d+(?:\.\d+)?)\s*kg/i);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0.5;
  };

  // Determine available weights dynamically based on prices database and minimum limits
  const availableWeights = (() => {
    const minLimit = getMinWeightLimit();
    if (!cake) return ['0.5 KG', '1 KG', '1.5 KG', '2 KG', '3 KG'].filter(w => parseFloat(w) >= minLimit);
    if (!cake.prices) return ['0.5 KG', '1 KG', '1.5 KG', '2 KG', '3 KG'].filter(w => parseFloat(w) >= minLimit);
    
    const list = [];
    if (cake.prices['0.5 KG'] !== null && cake.prices['0.5 KG'] !== undefined) list.push('0.5 KG');
    if (cake.prices['1 KG'] !== null && cake.prices['1 KG'] !== undefined) list.push('1 KG');
    if (cake.prices['1.5 KG'] !== null && cake.prices['1.5 KG'] !== undefined) list.push('1.5 KG');
    
    const hasBaseWeight = (cake.prices['1 KG'] !== null && cake.prices['1 KG'] !== undefined) || 
                          (cake.prices['0.5 KG'] !== null && cake.prices['0.5 KG'] !== undefined);
    if (hasBaseWeight || cake.id === 'c135') {
      list.push('2 KG', '3 KG');
    }
    return list.filter(w => parseFloat(w) >= minLimit);
  })();

  const [weight, setWeight] = useState('1 KG');

  // Check if cake is a Photo Cake or Semi-Fondant
  const isSemiFondant = (() => {
    if (!cake || !cake.description) return false;
    const desc = cake.description.toLowerCase();
    return desc.includes('semi fondant') || desc.includes('semi-fondant');
  })();

  const isPhotoCake = (() => {
    if (!cake) return false;
    if (cake.categoryGroup === 'Photo Cakes' || (cake.tags && cake.tags.includes('Photo Cakes'))) return true;
    if (cake.description && cake.description.toLowerCase().includes('photo cake')) return true;
    return false;
  })();

  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Reset states when ID or cake changes
  useEffect(() => {
    if (cake) {
      setNameOnCake('');
      setMessage('');
      setInstructions('');
      setIsCustomWeight(false);
      setSelectedImage(0);
      setUploadedPhoto(null);
      setPhotoPreview(null);
      setSelectedFlavor(getDefaultFlavor());
      
      const minLimit = getMinWeightLimit();
      let defaultWeight = '1 KG';

      if (cake.id === 'c135') {
        defaultWeight = '2 KG';
      } else if (cake.prices) {
        const valid = ['0.5 KG', '1 KG', '1.5 KG', '2 KG', '3 KG'].filter(w => {
          return cake.prices[w] !== null && cake.prices[w] !== undefined && parseFloat(w) >= minLimit;
        });
        defaultWeight = valid.length > 0 ? valid[0] : `${minLimit} KG`;
      } else {
        defaultWeight = minLimit >= 1 ? `${minLimit} KG` : '0.5 KG';
      }
      setWeight(defaultWeight);
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
      let baseKgPrice;
      const flavorHalfKgPrice = flavorPrices[selectedFlavor] || 600;
      baseKgPrice = (flavorHalfKgPrice + designPremium) * 2;
      return customWeightValue * baseKgPrice;
    }
    
    let discountFactor = 1;
    const halfKgBasePrice = cake.prices && cake.prices['0.5 KG'] ? cake.prices['0.5 KG'] : cake.price;
    if (cake.prices && cake.prices[weight]) {
      discountFactor = cake.prices[weight] / halfKgBasePrice;
    } else {
      const currentMultiplier = WEIGHT_MULTIPLIERS[weight] || 1;
      const halfKgMultiplier = WEIGHT_MULTIPLIERS['0.5 KG'] || 1;
      discountFactor = currentMultiplier / halfKgMultiplier;
    }
    const flavorHalfKgPrice = flavorPrices[selectedFlavor] || 600;
    const calculatedPrice = (flavorHalfKgPrice + designPremium) * discountFactor;
    return Math.round(calculatedPrice / 10) * 10;
  })();

  const handleAddToCart = () => {
    addToCart({
      id: cake.id,
      name: cake.name,
      basePrice: cake.price,
      price: currentPrice,
      image: cake.image,
      flavor: selectedFlavor,
      weight: isCustomWeight ? `${customWeightValue} KG` : weight,
      eggless: isEggless,
      quantity: 1,
      nameOnCake,
      message,
      instructions: isPhotoCake && uploadedPhoto 
        ? `[Custom Photo: ${uploadedPhoto.name}] ${instructions}`
        : instructions
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
                    Custom (Above 3kg)
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
                      min="4" 
                      value={customWeightValue}
                      onChange={(e) => setCustomWeightValue(Math.max(4, Number(e.target.value)))}
                      className="w-24 p-2 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none"
                    />
                    <span className="text-bakery-brown font-medium">KG</span>
                    <span className="text-sm text-bakery-brown/60 ml-2"><Info size={14} className="inline mr-1"/>Minimum 4 KG for custom</span>
                  </motion.div>
                )}
              </div>

              {/* Flavor Selection (if depends on flavor) */}
              {priceDependsOnFlavor && (
                <div className="pt-6 border-t border-bakery-peach">
                  <label className="block font-bold text-bakery-darkBrown mb-3">Select Flavor</label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full p-3.5 rounded-lg border-2 border-bakery-peach focus:border-bakery-brown outline-none bg-bakery-cream font-bold text-bakery-darkBrown cursor-pointer shadow-sm"
                  >
                    {Object.keys(flavorPrices).map(f => {
                      let flavorPrice;
                      if (isCustomWeight) {
                        flavorPrice = (flavorPrices[f] + designPremium) * 2 * customWeightValue;
                      } else {
                        let factor = 1;
                        const halfKgBase = cake.prices && cake.prices['0.5 KG'] ? cake.prices['0.5 KG'] : cake.price;
                        if (cake.prices && cake.prices[weight]) {
                          factor = cake.prices[weight] / halfKgBase;
                        } else {
                          factor = (WEIGHT_MULTIPLIERS[weight] || 1) / (WEIGHT_MULTIPLIERS['0.5 KG'] || 1);
                        }
                        flavorPrice = Math.round((flavorPrices[f] + designPremium) * factor / 10) * 10;
                      }
                      return (
                        <option key={f} value={f}>
                          {f} (₹{flavorPrice})
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

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

              {/* Customizations & Advisories */}
              {(isPhotoCake || isSemiFondant) && (
                <div className="space-y-4 pt-6 border-t border-bakery-peach">
                  {isPhotoCake && (
                    <div className="p-4 rounded-xl border-2 border-dashed border-bakery-peach bg-bakery-cream/25">
                      <label className="block text-sm font-bold text-bakery-darkBrown mb-2">Upload Photo for Printing</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="block w-full text-sm text-bakery-brown file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bakery-pink-vibrant file:text-white hover:file:bg-bakery-pink-dark cursor-pointer"
                      />
                      {photoPreview && (
                        <div className="mt-3 relative w-24 h-24 rounded-lg overflow-hidden border border-bakery-peach shadow-sm">
                          <img src={photoPreview} alt="Custom Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => { setUploadedPhoto(null); setPhotoPreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {isSemiFondant && (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 flex gap-2">
                      <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <span className="font-bold block mb-1">Cake Care & Storage</span>
                        This is a semi-fondant cake. Please store in an air-conditioned room (not a refrigerator) prior to celebration to protect fondant decorations.
                      </div>
                    </div>
                  )}
                </div>
              )}

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
