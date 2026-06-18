import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, IndianRupee, Users } from 'lucide-react';

const BulkOrder = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    quantity: '',
    deliveryDate: '',
    budget: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // API logic here
    alert('Bulk Order Request Submitted! Our corporate team will reach out soon.');
  };

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
                  <input required type="text" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Company / Organization</label>
                  <input type="text" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none" onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Email Address *</label>
                  <input required type="email" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Phone Number *</label>
                  <input required type="tel" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Quantity *</label>
                  <input required type="number" min="5" placeholder="Min. 5" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none" onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Expected Delivery Date / Deadline *</label>
                  <input required type="date" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none" onChange={e => setFormData({...formData, deliveryDate: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-bakery-darkBrown mb-1">Specific Requirements</label>
                <textarea rows="3" className="w-full p-3 rounded-lg border border-bakery-peach focus:ring-2 focus:ring-bakery-brown outline-none resize-none" onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-bakery-brown text-white rounded-xl font-bold text-lg hover:bg-bakery-darkBrown transition-colors shadow-lg">
                Submit Request
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BulkOrder;
