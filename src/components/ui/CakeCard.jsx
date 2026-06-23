import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const CakeCard = ({ cake, onQuickView }) => {
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: cake.id,
      name: cake.name,
      price: cake.price,
      basePrice: cake.price,
      image: cake.image,
      flavor: cake.flavor || cake.category,
      weight: '0.5 KG', // default
      eggless: true, // default
      quantity: 1,
      nameOnCake: '',
      message: ''
    });
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-bakery-peach/30"
    >
      <div className="relative overflow-hidden aspect-square">
        <Link to={`/cake/${cake.id}`} className="block w-full h-full cursor-pointer">
          <img 
            src={cake.image} 
            alt={cake.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        
        {/* Quick actions on hover (outside the Link to prevent event capturing) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto">
          <button 
            onClick={handleAddToCart}
            className="p-3 bg-white text-bakery-brown rounded-full hover:bg-bakery-gold hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto cursor-pointer"
            title="Quick Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
          <Link 
            to={`/cake/${cake.id}`}
            className="p-3 bg-white text-bakery-brown rounded-full hover:bg-bakery-gold hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 flex items-center justify-center pointer-events-auto cursor-pointer"
            title="View Details"
          >
            <Eye size={20} />
          </Link>
        </div>
      </div>

      <div className="p-3 sm:p-5">
        <div className="flex justify-between items-start mb-1 sm:mb-2 min-w-0">
          <Link to={`/cake/${cake.id}`} className="min-w-0 flex-1">
            <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg text-bakery-darkBrown hover:text-bakery-brown transition-colors line-clamp-2 leading-tight">
              {cake.name}
            </h3>
          </Link>
          <div className="flex items-center text-yellow-500 text-xs sm:text-sm shrink-0 ml-1.5 sm:ml-2 mt-0.5">
            <Star size={12} className="fill-current sm:w-[14px] sm:h-[14px]" />
            <span className="ml-0.5 sm:ml-1 text-bakery-brown font-medium">{cake.rating}</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-bakery-brown/70 mb-2 sm:mb-4">{cake.category}</p>
        
        <div className="flex items-center justify-between gap-1">
          <p className="font-sans font-bold text-xs sm:text-sm md:text-base text-bakery-darkBrown whitespace-nowrap">
            <span className="text-[10px] sm:text-xs text-bakery-brown/60 font-normal">Starting </span>
            ₹{cake.price}
          </p>
          <button 
            onClick={(e) => { e.preventDefault(); handleAddToCart(e); }}
            className="text-xs sm:text-sm font-bold text-bakery-brown hover:text-bakery-gold transition-colors whitespace-nowrap cursor-pointer"
          >
            <span className="hidden sm:inline">Add to Cart +</span>
            <span className="sm:hidden">Add +</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CakeCard;
