import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react';

export default function Lightbox({ isOpen, imageSrc, onClose, onNext, onPrev }) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button 
            className="absolute top-8 right-8 text-white hover:text-accent transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            <X size={40} />
          </button>

          <div 
            className="relative w-full max-w-7xl max-h-[90vh] flex items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
          >
            {onPrev && (
              <button 
                onClick={onPrev}
                className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-accent hover:scale-110 transition-all shrink-0 hidden sm:flex"
              >
                <CaretLeft size={32} />
              </button>
            )}

            <motion.img
              key={imageSrc} // Animate when src changes
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              src={imageSrc}
              alt="Fullscreen View"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {onNext && (
              <button 
                onClick={onNext}
                className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-accent hover:scale-110 transition-all shrink-0 hidden sm:flex"
              >
                <CaretRight size={32} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
