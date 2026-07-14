import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { submitOrder } from '../utils/api';
import confetti from 'canvas-confetti';

const Checkout = () => {
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
          className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg mx-auto border border-bakery-peach"
        >
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-serif font-bold text-bakery-darkBrown mb-2">Order Placed!</h2>
          <p className="text-xl text-bakery-brown mb-4">Your Order ID is <span className="font-bold text-bakery-pink-dark">{orderId}</span></p>
          <p className="text-bakery-brown/80 mb-8">
            Thank you for your order! We are now redirecting you to WhatsApp to send all your order details automatically.
          </p>
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
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-bakery-peach">
              <h2 className="font-serif text-2xl font-bold text-bakery-darkBrown mb-4">Order Summary</h2>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-bakery-peach/50 pb-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1 text-sm">
                      <h3 className="font-bold text-bakery-darkBrown">{item.name}</h3>
                      <p className="text-bakery-brown/70">{item.flavor} | {item.weight}</p>
                      <p className="text-bakery-brown/70">Qty: {item.quantity}</p>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 mt-1 inline-block">Pure Veg</span>
                      {item.nameOnCake && <p className="text-bakery-brown/70 mt-1"><span className="font-semibold">Name:</span> {item.nameOnCake}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t-2 border-bakery-peach">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-bakery-brown">Subtotal</span>
                  <span className="font-bold">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-bakery-brown">Delivery</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between items-center text-xl">
                  <span className="font-serif font-bold text-bakery-darkBrown">Grand Total</span>
                  <span className="font-bold text-bakery-darkBrown">₹{getCartTotal()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-7">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-white rounded-xl font-bold text-lg transition-colors shadow-lg ${isSubmitting ? 'bg-bakery-brown/70 cursor-not-allowed' : 'bg-bakery-brown hover:bg-bakery-darkBrown'}`}
              >
                {isSubmitting ? 'Processing...' : `Place Order (₹${getCartTotal()})`}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
