import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateCustomCakeWhatsAppLink } from '../utils/whatsapp';
import confetti from 'canvas-confetti';

const CustomizedCake = () => {
  const [formData, setFormData] = useState({
    theme: '',
    flavor: 'Chocolate',
    weight: '1 KG',
    quantity: 1,
    notes: ''
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D97706', '#DB2777', '#F59E0B', '#EC4899']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D97706', '#DB2777', '#F59E0B', '#EC4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newRequestId = `CUST-${Date.now().toString().slice(-6)}`;
    setRequestId(newRequestId);

    const orderData = {
      requestId: newRequestId,
      ...formData,
      hasFile: !!file
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      triggerConfetti();

      const whatsappUrl = generateCustomCakeWhatsAppLink(orderData);
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 3000);
    }, 1200);
  };

  const flavors = ['Chocolate', 'Vanilla', 'Red Velvet', 'Pineapple', 'Butterscotch', 'Black Forest', 'Strawberry', 'Mango', 'Custom Flavor'];
  const weights = ['1 KG', '1.5 KG', '2 KG', '3 KG', '4 KG', '5 KG', 'Above 5 KG'];

  if (showSuccess) {
    const whatsappUrl = generateCustomCakeWhatsAppLink({
      requestId,
      ...formData,
      hasFile: !!file
    });

    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-bakery-cream px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-xl mx-auto border border-bakery-peach/60 relative overflow-hidden"
        >
          {/* Decorative Top Gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-bakery-gold via-bakery-pink-vibrant to-bakery-pink-dark"></div>

          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-inner">
            <svg className="w-12 h-12 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-bakery-darkBrown mb-3">
            Design Request Saved!
          </h2>
          
          <p className="text-lg text-bakery-brown mb-4 font-medium">
            Your Custom Request ID is: <span className="font-bold text-bakery-pink-vibrant">{requestId}</span>
          </p>

          <div className="bg-bakery-cream/70 rounded-2xl p-6 mb-8 text-left border border-bakery-peach/40">
            <h3 className="font-bold text-bakery-darkBrown text-base mb-2 flex items-center gap-2">
              <span>⚠️</span> IMPORTANT NEXT STEP
            </h3>
            <p className="text-sm text-bakery-brown/90 leading-relaxed mb-3">
              We are redirecting you to WhatsApp to connect directly with our bakers.
            </p>
            <p className="text-sm font-bold text-bakery-pink-dark leading-relaxed">
              👉 Please attach your uploaded reference design image in the WhatsApp chat window once it opens!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Open WhatsApp Now
            </a>
            <Link 
              to="/" 
              className="w-full sm:w-auto inline-block px-8 py-3.5 bg-bakery-brown text-white rounded-full font-bold text-lg hover:bg-bakery-darkBrown transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-xs text-bakery-brown/60 mt-6">
            If you aren't redirected automatically within 3 seconds, click the green button above.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-bakery-cream min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-bakery-darkBrown mb-4"
          >
            Design Your Dream Cake
          </motion.h1>
          <div className="w-24 h-1 bg-bakery-gold mx-auto rounded-full mb-6"></div>
          <p className="text-bakery-brown/80">
            Have a specific design in mind? Upload your reference images and let our expert bakers bring your imagination to life!
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-bakery-peach/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-bakery-peach rounded-2xl p-8 text-center bg-bakery-cream hover:bg-bakery-peach/20 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-bakery-brown shadow-sm">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="font-bold text-bakery-darkBrown text-lg">Click to upload reference design</p>
                  <p className="text-sm text-bakery-brown/60">Supports JPG, PNG, PDF up to 10MB</p>
                </div>
                {file && (
                  <div className="mt-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    Selected file: {file.name}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-bakery-darkBrown mb-2">Cake Theme / Occasion (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Spiderman Theme, 50th Anniversary"
                  className="w-full p-3 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none"
                  value={formData.theme}
                  onChange={(e) => setFormData({...formData, theme: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-bakery-darkBrown mb-2">Preferred Flavor *</label>
                <select 
                  className="w-full p-3 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none"
                  value={formData.flavor}
                  onChange={(e) => setFormData({...formData, flavor: e.target.value})}
                >
                  {flavors.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-bakery-darkBrown mb-2">Estimated Weight *</label>
                <select 
                  className="w-full p-3 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                >
                  {weights.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-bakery-darkBrown mb-2">Quantity *</label>
                <input 
                  required
                  type="number"
                  min="1"
                  className="w-full p-3 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-bakery-darkBrown mb-2">Additional Notes</label>
              <textarea 
                rows="4"
                placeholder="Describe your design requirements in detail..."
                className="w-full p-3 border border-bakery-peach rounded-lg focus:ring-2 focus:ring-bakery-brown outline-none resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-bakery-brown text-white rounded-xl font-bold text-lg hover:bg-bakery-darkBrown transition-colors shadow-lg shadow-bakery-brown/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving Design Request...
                </div>
              ) : (
                <>
                  <Send size={20} />
                  Submit Design Request
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomizedCake;

