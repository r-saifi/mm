import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Fallback images while Firestore loads or if no hero images set
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&h=800&fit=crop",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
];

// Build card stack from a flat image array
// Groups of 3 → collage, groups of 1 → single
function buildCards(images) {
  if (!images || images.length === 0) return [];
  const cards = [];
  let id = 1;
  let i = 0;
  while (i < images.length) {
    if (images.length - i >= 3 && cards.length % 2 === 0) {
      cards.push({ id: id++, type: 'collage', images: images.slice(i, i + 3) });
      i += 3;
    } else {
      cards.push({ id: id++, type: 'single', image: images[i] });
      i += 1;
    }
    if (cards.length >= 6) break; // cap at 6 cards
  }
  return cards;
}

export default function HeroStack({ onImageClick }) {
  const [heroImages, setHeroImages] = useState(FALLBACK_IMAGES);
  const [cards, setCards] = useState([]);
  const [direction, setDirection] = useState('next');

  // Fetch hero images from Firestore, fall back to hardcoded
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'hero'), (snap) => {
      if (snap.exists() && snap.data().images?.length > 0) {
        setHeroImages(snap.data().images);
      } else {
        setHeroImages(FALLBACK_IMAGES);
      }
    }, () => {
      setHeroImages(FALLBACK_IMAGES);
    });
    return unsub;
  }, []);

  useEffect(() => {
    setCards(buildCards(heroImages));
  }, [heroImages]);

  const handleNext = () => {
    setDirection('next');
    setCards(prev => {
      const newCards = [...prev];
      newCards.push(newCards.shift());
      return newCards;
    });
  };

  const handlePrev = () => {
    setDirection('prev');
    setCards(prev => {
      const newCards = [...prev];
      newCards.unshift(newCards.pop());
      return newCards;
    });
  };

  if (cards.length === 0) return null;

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 px-[5%] overflow-hidden relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto items-center z-10">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-block py-2 px-4 rounded-full bg-glassBg border border-glassBorder backdrop-blur text-sm font-semibold tracking-wide w-fit border-l-4 border-l-accent">
            Award-Winning Design Studio
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            Design Your <br />
            <span className="text-gradient">Dream Space</span>
          </h1>
          <p className="text-textMuted text-lg max-w-md">
            Where architectural excellence meets timeless elegance. We create sophisticated spaces that inspire and endure for generations.
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
            <div>
              <h2 className="text-3xl font-display font-bold text-accent">98%</h2>
              <span className="text-sm text-textMuted uppercase tracking-wider">Satisfaction</span>
            </div>
          </div>
        </motion.div>

        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center [perspective:1200px]">
          <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.15)_0%,transparent_70%)] rounded-full -z-10 pointer-events-none"></div>

          <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            {cards.map((card, index) => {
              const isFront = index === 0;
              const zIndex = 10 - index;
              const translateX = index * 35;
              const translateY = index * -35;
              const scale = 1 - index * 0.08;
              const opacity = 1 - index * 0.25;

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={false}
                  animate={{
                    x: translateX,
                    y: translateY,
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="absolute w-[80%] h-[80%] rounded-[24px] p-3 bg-glassBg border border-glassBorder backdrop-blur-[20px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden"
                  style={{ pointerEvents: isFront ? 'auto' : 'none' }}
                >
                  {card.type === 'single' ? (
                    <img
                      src={card.image}
                      alt="Project"
                      className="w-full h-full object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-500"
                      onClick={() => onImageClick(card.image)}
                    />
                  ) : (
                    <div className="flex gap-2 h-full rounded-xl overflow-hidden">
                      <div className="flex-[1.1] flex flex-col gap-2">
                        <img
                          src={card.images[0]}
                          className="w-full h-[calc(50%-4px)] object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                          onClick={() => onImageClick(card.images[0])}
                          alt=""
                        />
                        <img
                          src={card.images[1]}
                          className="w-full h-[calc(50%-4px)] object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                          onClick={() => onImageClick(card.images[1])}
                          alt=""
                        />
                      </div>
                      <div className="flex-[0.9] overflow-hidden">
                        <img
                          src={card.images[2]}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                          onClick={() => onImageClick(card.images[2])}
                          alt=""
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="absolute -bottom-10 flex gap-4 z-20">
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="w-11 h-11 rounded-full bg-glassBg border border-glassBorder text-textMain flex items-center justify-center backdrop-blur hover:bg-accent hover:text-white transition-all hover:-translate-y-1 shadow-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="w-11 h-11 rounded-full bg-glassBg border border-glassBorder text-textMain flex items-center justify-center backdrop-blur hover:bg-accent hover:text-white transition-all hover:-translate-y-1 shadow-lg"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
