import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send } from 'lucide-react';

const CustomizedCake = () => {
  const [formData, setFormData] = useState({
    theme: '',
    flavor: 'Chocolate',
    weight: '1 KG',
    quantity: 1,
    notes: ''
  });
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, upload file first, get URL, then save to Google Sheets
    alert('Custom Cake Request Submitted! We will contact you shortly.');
  };

  const flavors = ['Chocolate', 'Vanilla', 'Red Velvet', 'Pineapple', 'Butterscotch', 'Black Forest', 'Strawberry', 'Mango', 'Custom Flavor'];
  const weights = ['1 KG', '1.5 KG', '2 KG', '3 KG', '4 KG', '5 KG', 'Above 5 KG'];

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
              className="w-full py-4 bg-bakery-brown text-white rounded-xl font-bold text-lg hover:bg-bakery-darkBrown transition-colors shadow-lg shadow-bakery-brown/30 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit Design Request
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomizedCake;
