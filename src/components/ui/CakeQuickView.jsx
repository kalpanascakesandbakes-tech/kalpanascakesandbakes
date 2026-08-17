import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import {
  getDefaultFlavor,
  getResolvedFlavor,
  getDefaultWeight,
  calculateCakePrice
} from '../../utils/cakeHelpers';

const CakeQuickView = ({ cake, isOpen, onClose }) => {
  const { addToCart, openCart } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(0);
    }
  }, [isOpen, cake]);

  if (!isOpen || !cake) return null;

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

  const handleAddToCart = () => {
    const defFlavor = getDefaultFlavor(cake);
    const resolvedFlavor = getResolvedFlavor(cake, defFlavor);
    const defWeight = getDefaultWeight(cake);
    const resolvedPrice = calculateCakePrice(cake, defFlavor, defWeight);

    addToCart({
      id: cake.id,
      name: cake.name,
      cakeNumber: cake.cakeNumber,
      price: resolvedPrice,
      basePrice: cake.price,
      flavor: resolvedFlavor,
      weight: defWeight,
      quantity: 1,
      eggless: true,
      image: cake.image,
      nameOnCake: '',
      message: '',
      isCustomPricing: false
    });
    onClose();
    openCart();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-bakery-darkBrown transition-colors shadow-sm backdrop-blur-md"
          >
            <X size={24} />
          </button>

          {/* Left: Image & Thumbnails */}
          <div className="md:w-1/2 p-6 flex flex-col gap-4 bg-bakery-peach/10">
            <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-bakery-peach/30">
              <img
                src={galleryImages[selectedImage]}
                alt={cake.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${galleryViews[selectedImage].classes}`}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
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

          {/* Right: Content */}
          <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-center">
            {cake.flavor && (
              <div className="uppercase tracking-widest text-sm text-bakery-brown/60 font-bold mb-2">
                {cake.flavor}
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-bakery-darkBrown mb-4">
              {cake.name}
            </h2>

            {cake.rating && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-bakery-gold/20 text-bakery-darkBrown px-3 py-1 rounded-full text-sm font-bold">
                  <span>★</span>
                  <span>{cake.rating}</span>
                </div>
              </div>
            )}

            <p className="text-bakery-brown/80 mb-8 leading-relaxed">
              Experience the rich taste of our premium {cake.name}. Freshly baked with love and the finest ingredients. Perfect for your special moments.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-bakery-pink-vibrant text-white rounded-xl font-bold text-lg hover:bg-bakery-pink-dark transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <a
                href={`/cake/${cake.id}`}
                className="w-full py-4 bg-bakery-cream text-bakery-darkBrown border-2 border-bakery-peach rounded-xl font-bold text-lg hover:bg-bakery-peach/50 transition-colors flex items-center justify-center"
              >
                View Full Details
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CakeQuickView;
