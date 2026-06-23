import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, IndianRupee, Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitBulkOrder } from '../utils/api';
import { generateBulkOrderWhatsAppLink } from '../utils/whatsapp';
import confetti from 'canvas-confetti';

const BulkOrder = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    quantity: '',
    deliveryDate: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [placedRequestData, setPlacedRequestData] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Generate Request ID
      const newRequestId = `REQ-${Date.now().toString().slice(-6)}`;
      setRequestId(newRequestId);

      const requestData = {
        requestId: newRequestId,
        ...formData
      };

      setPlacedRequestData(requestData);

      // 2. Submit to Google Sheets via Apps Script
      await submitBulkOrder(requestData);

      // 3. Show Success and trigger Confetti
      setShowSuccess(true);
      triggerConfetti();

      // 4. Redirect to WhatsApp after short delay
      setTimeout(() => {
        window.location.href = generateBulkOrderWhatsAppLink(requestData);
      }, 2500);

    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-bakery-cream py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl text-center max-w-lg mx-auto border border-bakery-peach"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-bakery-darkBrown mb-2 font-serif">Request Submitted!</h2>
          <p className="text-xl text-bakery-brown mb-4">Request ID: <span className="font-bold text-bakery-pink-dark">{requestId}</span></p>
          <p className="text-bakery-brown/80 mb-8">
            Thank you for your bulk order inquiry! We are now redirecting you to WhatsApp to send all your request details to our corporate team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {placedRequestData && (
              <a
                href={generateBulkOrderWhatsAppLink(placedRequestData)}
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
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Info */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-bakery-darkBrown mb-6"
            >
              Corporate & Bulk Orders
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-bakery-brown/80 mb-8"
            >
              Make your corporate events, weddings, school functions, and large gatherings memorable with our premium handcrafted cakes and desserts.
            </motion.p>

            <div className="space-y-6">
              {[
                { icon: <Building2 className="text-bakery-gold" />, title: 'Corporate Events', desc: 'Customized branding available' },
                { icon: <Users className="text-bakery-gold" />, title: 'Weddings & Parties', desc: 'Tiered cakes and dessert tables' },
                { icon: <Calendar className="text-bakery-gold" />, title: 'Scheduled Deliveries', desc: 'On-time delivery guaranteed' },
                { icon: <IndianRupee className="text-bakery-gold" />, title: 'Special Pricing', desc: 'Discounted rates for large volumes' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-bakery-cream border border-bakery-peach/50"
                >
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-bakery-darkBrown">{item.title}</h3>
                    <p className="text-sm text-bakery-brown/70">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-bakery-cream p-8 rounded-3xl shadow-lg border border-bakery-peach"
          >
            <h2 className="text-2xl font-serif font-bold text-bakery-darkBrown mb-6 text-center">Request a Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Full Name *</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-white" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Company / Organization</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-white" 
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Email Address *</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-white" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Phone Number *</label>
                  <input 
                    required 
                    type="tel" 
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-white" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Quantity *</label>
                  <input 
                    required 
                    type="number" 
                    min="5" 
                    placeholder="Min. 5" 
                    className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-white" 
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Expected Delivery Date / Deadline *</label>
                  <input 
                    required 
                    type="date" 
                    className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none bg-white" 
                    value={formData.deliveryDate}
                    onChange={e => setFormData({...formData, deliveryDate: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Specific Requirements</label>
                <textarea 
                  rows="3" 
                  className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none resize-none bg-white" 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 text-white rounded-xl font-bold text-lg transition-colors shadow-lg ${isSubmitting ? 'bg-bakery-brown/70 cursor-not-allowed' : 'bg-bakery-brown hover:bg-bakery-darkBrown'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BulkOrder;
