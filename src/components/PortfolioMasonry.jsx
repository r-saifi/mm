import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ["All", "Residential", "Commercial", "Interior"];

const PORTFOLIO_DATA = [
    { id: 1, src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=1200&fit=crop", cat: "Residential" },
    { id: 2, src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=800&fit=crop", cat: "Interior" },
    { id: 3, src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=1000&fit=crop", cat: "Commercial" },
    { id: 4, src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=800&fit=crop", cat: "Residential" },
    { id: 5, src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=1200&fit=crop", cat: "Interior" },
    { id: 6, src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=800&fit=crop", cat: "Commercial" },
    { id: 7, src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&h=800&fit=crop", cat: "Residential" },
    { id: 8, src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=1000&fit=crop", cat: "Commercial" }
];

export default function PortfolioMasonry({ onImageClick }) {
  const [filter, setFilter] = useState("All");

  const filteredImages = filter === "All" 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(img => img.cat === filter);

  return (
    <section id="portfolio" className="py-24 px-[5%] bg-bgSecondary">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">Our Work</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Selected <span className="text-gradient">Projects</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === cat 
                    ? 'bg-accent text-white shadow-lg' 
                    : 'bg-glassBg border border-glassBorder hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => onImageClick(img.src)}
              >
                <img 
                  src={img.src} 
                  alt={img.cat} 
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-display text-lg tracking-wider border border-white/30 px-6 py-2 rounded-full backdrop-blur-sm">
                    View Project
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
