import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore, { WEIGHT_MULTIPLIERS } from '../store/useCartStore';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { submitOrder } from '../utils/api';
import confetti from 'canvas-confetti';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const Checkout = () => {
  useDocumentMetadata(
    "Secure Checkout | Kalpana's Cakes & Bakes",
    "Complete your cake order online. Same-day and midnight doorstep cake delivery in Vikhroli East, Mumbai."
  );

  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placedOrderData, setPlacedOrderData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    notes: ''
  });

  useEffect(() => {
    if (cart.length === 0 && !showSuccess) {
      navigate('/categories');
    }
  }, [cart, navigate, showSuccess]);

  useEffect(() => {
    if (showSuccess) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [showSuccess]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4A2C2A', '#F4C2C2', '#D4AF37']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4A2C2A', '#F4C2C2', '#D4AF37']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Generate Order ID
      const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderId(newOrderId);

      const orderData = {
        orderId: newOrderId,
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}${formData.landmark ? `, Landmark: ${formData.landmark}` : ''}`,
        notes: formData.notes,
        totalAmount: getCartTotal(),
        cart: cart
      };

      setPlacedOrderData(orderData);

      // 2. Submit to Google Sheets
      await submitOrder(orderData);

      // 3. Show Success & Confetti
      setShowSuccess(true);
      triggerConfetti();

      // 4. Clear Cart
      clearCart();

      // 5. Open WhatsApp after a short delay in a new tab
      setTimeout(() => {
        window.open(generateWhatsAppLink(orderData), '_blank');
      }, 2500);

    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-bakery-cream">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-5 sm:p-10 rounded-3xl shadow-xl text-center max-w-lg mx-auto border border-bakery-peach"
        >
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-bakery-darkBrown mb-1">Order Placed!</h2>
          <p className="text-base sm:text-lg text-bakery-brown mb-4">Your Order ID is <span className="font-bold text-bakery-pink-dark">{orderId}</span></p>
          
          {/* Combined Warning & Payment Info Box */}
          <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left space-y-3 shadow-sm text-sm">
            <div className="flex gap-2.5">
              <span className="text-amber-600 text-lg">⚠️</span>
              <div>
                <span className="font-extrabold text-amber-950 text-sm block">Action Required: Confirm on WhatsApp</span>
                <p className="text-xs text-amber-900 font-medium">
                  Your order is <span className="font-bold text-[#be185d]">NOT CONFIRMED</span> yet. You <strong>MUST</strong> click the <strong>"Send to WhatsApp Now"</strong> button below to send your order details.
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-amber-200/50 space-y-2">
              <span className="font-bold text-amber-950 text-xs block uppercase tracking-wider">💳 GPay / UPI Payment</span>
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                Pay using GPay to <strong className="font-mono font-bold text-base text-bakery-darkBrown select-all">+91 90047 62873</strong> and share the payment screenshot in the WhatsApp chat.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {placedOrderData && (
              <a
                href={generateWhatsAppLink(placedOrderData)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full font-bold text-lg transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Send to WhatsApp Now
              </a>
            )}
            <Link to="/" className="w-full sm:w-auto inline-block px-8 py-3 bg-bakery-brown text-white rounded-full font-bold text-lg hover:bg-bakery-darkBrown transition-colors">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-bakery-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-bakery-darkBrown mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Side - Cart Summary */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-bakery-peach">
              <h2 className="font-serif text-2xl font-bold text-bakery-darkBrown mb-4">Order Summary</h2>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {cart.map((item, idx) => {
                  const isCustom = item.isCustomPricing;
                  const itemUnitPrice = isCustom ? null : (item.price !== undefined && item.price !== null
                    ? item.price
                    : item.basePrice * (WEIGHT_MULTIPLIERS[item.weight] || 1));
                  const itemSubtotal = isCustom ? null : (itemUnitPrice * item.quantity);
                  
                  return (
                    <div key={idx} className="flex gap-4 border-b border-bakery-peach/50 pb-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1 text-sm">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-bakery-darkBrown">{item.name}</h3>
                          <span className="font-sans font-bold text-bakery-pink-dark">
                            {isCustom ? "Price on Request" : `₹${itemSubtotal}`}
                          </span>
                        </div>
                        <p className="text-bakery-brown/70">{item.flavor ? `${item.flavor} | ` : ''}{item.weight}</p>
                        <div className="flex justify-between items-center text-bakery-brown/70 mt-1">
                          <span>Qty: {item.quantity}</span>
                          <span className="text-xs">
                            {isCustom ? "Price on Request" : `₹${itemUnitPrice} each`}
                          </span>
                        </div>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 mt-1 inline-block">Pure Veg</span>
                        {item.nameOnCake && <p className="text-bakery-brown/70 mt-1"><span className="font-semibold">Name:</span> {item.nameOnCake}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-bakery-peach/50 pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg font-bold text-bakery-darkBrown">Total Amount:</span>
                  <span className="font-sans text-xl font-bold text-bakery-pink-dark">
                    {cart.some(item => item.isCustomPricing) ? (
                      getCartTotal() > 0 ? `₹${getCartTotal()} + Price on Request` : 'Price on Request'
                    ) : (
                      `₹${getCartTotal()}`
                    )}
                  </span>
                </div>
              </div>


            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <form onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-2xl shadow-sm border border-bakery-peach space-y-6">
              <h2 className="font-serif text-2xl font-bold text-bakery-darkBrown mb-6">Delivery Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Full Name *</label>
                  <input required type="text" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none"
                    value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Phone Number *</label>
                  <input 
                    required 
                    type="tel" 
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none"
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Email Address (Optional)</label>
                <input type="email" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Full Delivery Address *</label>
                <textarea required rows="3" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none resize-none"
                  value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Landmark (Optional)</label>
                  <input type="text" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none"
                    value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} />
                </div>
              </div>

              <div className="p-4 bg-[#fdf6f6] rounded-xl border border-bakery-pink/20 space-y-2">
                <h4 className="font-serif font-bold text-[#8b1e3f] text-sm flex items-center gap-1.5">
                  💳 Payment Method: UPI / Google Pay (GPay)
                </h4>
                <p className="text-xs text-bakery-brown/80 leading-relaxed">
                  After placing the order, you will be redirected to WhatsApp to send your order details. Please complete the payment to our GPay number: <strong className="text-[#be185d] font-mono font-bold">+91 90047 62873</strong> and share the screenshot in the chat.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-white rounded-xl font-bold text-lg transition-colors shadow-lg ${isSubmitting ? 'bg-bakery-brown/70 cursor-not-allowed' : 'bg-bakery-brown hover:bg-bakery-darkBrown'}`}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
