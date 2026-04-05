import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=1000&fit=crop"
];

// Build card stack from a flat image array
// Greedily groups into 3-image collages if available, otherwise single.
function buildCards(images) {
  if (!images || images.length === 0) return [];
  const cards = [];
  let id = 1;
  let i = 0;
  while (i < images.length) {
    if (images.length - i >= 3) {
      cards.push({ id: id++, type: 'collage', images: images.slice(i, i + 3) });
      i += 3;
    } else {
      cards.push({ id: id++, type: 'single', image: images[i] });
      i += 1;
    }
  }
  return cards;
}

export default function HeroStack({ onImageClick }) {
  const [heroImages, setHeroImages] = useState(FALLBACK_IMAGES);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHero = async () => {
      const { data, error } = await supabase.from('settings').select('value').eq('key', 'hero').single();
      let imgs = data?.value?.images || [];
      if (imgs.length === 0) {
        imgs = [...FALLBACK_IMAGES];
      }
      while (imgs.length < 3) {
        imgs.push(FALLBACK_IMAGES[imgs.length % 3]);
      }
      setHeroImages(imgs);
    };

    fetchHero();

    const channel = supabase.channel('public:settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings', filter: 'key=eq.hero' }, () => {
        fetchHero();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let builtCards = buildCards(heroImages);
    // ensure we have at least 3 cards total for the depth stack
    while (builtCards.length > 0 && builtCards.length < 3) {
      builtCards.push({ ...builtCards[builtCards.length % builtCards.length], id: Math.random() });
    }
    setCards(builtCards);
  }, [heroImages]);

  const handleNext = () => {
    setCards(prev => {
      const newCards = [...prev];
      newCards.push(newCards.shift());
      return newCards;
    });
  };

  const handlePrev = () => {
    setCards(prev => {
      const newCards = [...prev];
      newCards.unshift(newCards.pop());
      return newCards;
    });
  };

  const handleGridClick = (e) => {
    const clickX = e.clientX;
    const screenWidth = window.innerWidth;
    if (clickX > screenWidth / 2) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  if (cards.length === 0) return null;

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 px-[5%] overflow-hidden relative" onClick={handleGridClick}>
      {/* Original Architectural Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(var(--accent-rgb), 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto items-center z-10 pointer-events-none">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-block py-2 px-4 rounded-full bg-glassBg border border-glassBorder backdrop-blur text-sm font-semibold tracking-wide w-fit border-l-4 border-l-accent shadow-glass pointer-events-auto">
            MM Design Studio
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            Design Your <br />
            <span className="text-gradient">Dream Space</span>
          </h1>
          <p className="text-textMuted text-lg max-w-md">
            Where architectural excellence meets timeless elegance. We craft sophisticated spaces that inspire and endure for generations.
          </p>
          <div className="flex gap-8 mt-4">
            <div>
              <h2 className="text-3xl font-display font-bold text-accent">500+</h2>
              <span className="text-sm text-textMuted uppercase tracking-wider">Projects</span>
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-accent">15+</h2>
              <span className="text-sm text-textMuted uppercase tracking-wider">Years Exp.</span>
            </div>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); document.getElementById('portfolio').scrollIntoView({behavior: 'smooth'})}}
            className="mt-4 px-8 py-4 bg-accent text-white font-bold rounded-full w-fit hover:scale-105 hover:shadow-[0_10px_20px_rgba(var(--accent-rgb),0.4)] transition-all pointer-events-auto"
          >
            Explore Projects
          </button>
        </motion.div>

        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center [perspective:1400px]">
          <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            <AnimatePresence>
              {cards.slice(0, 3).map((card, index) => {
                const isFront = index === 0;
                const zIndex = 10 - index;
                // Perfect 3-card stack offset
                const translateX = index * 45;
                const translateY = index * -45;
                const scale = 1 - index * 0.1;
                const opacity = 1 - index * 0.3;

                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: 100 }}
                    animate={{
                      x: translateX,
                      y: translateY,
                      scale: scale,
                      opacity: opacity,
                      zIndex: zIndex
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: -100 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className="absolute w-[80%] h-[90%] rounded-[24px] p-3 bg-glassBg border border-glassBorder backdrop-blur-[20px] shadow-2xl overflow-visible pointer-events-auto cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isFront) {
                        handleNext();
                      }
                    }}
                  >
                    {card.type === 'single' ? (
                      <img
                        src={card.image}
                        alt="Project"
                        className="w-full h-full object-cover rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                        onClick={() => isFront && onImageClick && onImageClick(card.image, heroImages)}
                      />
                    ) : (
                      <div className="flex gap-2 h-full rounded-xl overflow-hidden">
                        <div className="flex-[1.1] flex flex-col gap-2">
                          <img
                            src={card.images[0]}
                            className="w-full h-[calc(50%-4px)] object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                            onClick={() => isFront && onImageClick && onImageClick(card.images[0], heroImages)}
                            alt=""
                          />
                          <img
                            src={card.images[1]}
                            className="w-full h-[calc(50%-4px)] object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                            onClick={() => isFront && onImageClick && onImageClick(card.images[1], heroImages)}
                            alt=""
                          />
                        </div>
                        <div className="flex-[0.9] overflow-hidden">
                          <img
                            src={card.images[2]}
                            className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                            onClick={() => isFront && onImageClick && onImageClick(card.images[2], heroImages)}
                            alt=""
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
