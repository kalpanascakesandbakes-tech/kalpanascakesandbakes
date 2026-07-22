import { X, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useCartStore, { WEIGHT_MULTIPLIERS } from '../../store/useCartStore';

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-bakery-peach">
              <h2 className="text-2xl font-serif text-bakery-darkBrown">Your Cart</h2>
              <button 
                onClick={closeCart}
                className="p-2 text-bakery-brown hover:bg-bakery-peach rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-bakery-brown/60">
                  <p className="text-lg">Your cart is empty</p>
                  <button 
                    onClick={() => { closeCart(); navigate('/categories'); }}
                    className="mt-4 px-6 py-2 bg-bakery-brown text-white rounded-full hover:bg-bakery-darkBrown transition-colors"
                  >
                    Browse Cakes
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, index) => {
                    const isCustom = item.isCustomPricing;
                    const itemUnitPrice = isCustom ? null : (item.price !== undefined && item.price !== null
                      ? item.price
                      : item.basePrice * (WEIGHT_MULTIPLIERS[item.weight] || 1));
                    const itemSubtotal = isCustom ? null : (itemUnitPrice * item.quantity);
                    
                    return (
                      <div key={`${item.id}-${index}`} className="flex gap-4 border-b border-bakery-peach/50 pb-6">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif font-bold text-bakery-darkBrown">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(index)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-sm text-bakery-brown/80">{item.flavor ? `${item.flavor} | ` : ''}{item.weight}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block">Pure Veg</span>
                            {isCustom ? (
                              <span className="text-xs text-bakery-pink-dark font-semibold">Price on Request</span>
                            ) : (
                              <span className="text-xs text-bakery-brown/60">₹{itemUnitPrice}/each</span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-bakery-peach rounded-md">
                              <button 
                                onClick={() => updateQuantity(index, -1)}
                                className="p-1 hover:bg-bakery-peach text-bakery-brown"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(index, 1)}
                                className="p-1 hover:bg-bakery-peach text-bakery-brown"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <span className="text-base font-sans font-bold text-bakery-pink-dark">
                              {isCustom ? (
                                <span className="text-xs font-semibold text-bakery-pink-dark font-serif">Price on Request</span>
                              ) : (
                                `₹${itemSubtotal}`
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-bakery-peach p-6 bg-bakery-cream">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-serif text-lg font-bold text-bakery-darkBrown">Total Amount:</span>
                  <span className="font-sans text-xl font-bold text-bakery-pink-dark">
                    {cart.some(item => item.isCustomPricing) ? (
                      getCartTotal() > 0 ? `₹${getCartTotal()} + Price on Request` : 'Price on Request'
                    ) : (
                      `₹${getCartTotal()}`
                    )}
                  </span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-bakery-brown text-white rounded-full font-bold text-lg hover:bg-bakery-darkBrown transition-colors shadow-lg shadow-bakery-brown/30"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
