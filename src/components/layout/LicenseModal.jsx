import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';

const LicenseModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-bakery-cream rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-bakery-peach/30"
        >
          {/* Header */}
          <div className="p-6 border-b border-bakery-peach/20 bg-bakery-brown text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-bakery-gold" size={28} />
              <div>
                <h3 className="font-serif text-xl font-bold tracking-wide">
                  FSSAI Registration
                </h3>
                <p className="text-xs text-bakery-peach/85 font-mono">
                  Lic. No. 21526013000741
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Certificate View Area */}
          <div className="p-6 overflow-y-auto bg-bakery-cream flex-1 relative flex justify-center items-start">
            <div className="relative w-full max-w-md border-2 border-bakery-peach/40 rounded-xl overflow-hidden shadow-inner bg-white select-none">
              
              {/* Security Overlay to block right click and dragging */}
              <div 
                className="absolute inset-0 z-10 cursor-default select-none bg-transparent"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              
              <img
                src="/cakes/License_redacted.png"
                alt="FSSAI Registration Certificate"
                className="w-full h-auto pointer-events-none select-none"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>

          {/* Secure Footer Notice */}
          <div className="p-4 bg-bakery-peach/10 border-t border-bakery-peach/20 text-center text-xs text-bakery-brown/70 font-sans tracking-wide shrink-0">
            🛡️ Secured document viewer. Right-click, saving, and copy-pasting are disabled.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LicenseModal;
