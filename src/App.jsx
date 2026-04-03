import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroStack from './components/HeroStack';
import About from './components/About';
import Services from './components/Services';
import PortfolioMasonry from './components/PortfolioMasonry';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';

// Extracted from PortfolioMasonry for Lightbox logic
const PORTFOLIO_DATA = [
    { id: 1, src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=1200&fit=crop" },
    { id: 2, src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=800&fit=crop" },
    { id: 3, src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=1000&fit=crop" },
    { id: 4, src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=800&fit=crop" },
    { id: 5, src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=1200&fit=crop" },
    { id: 6, src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=800&fit=crop" },
    { id: 7, src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&h=800&fit=crop" },
    { id: 8, src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=1000&fit=crop" }
];

export default function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Global images list for lightbox browsing
  const allImages = PORTFOLIO_DATA.map(img => img.src);

  const openLightbox = (src) => {
    // If not found in the array (e.g. hero unique image), let's just show it.
    let index = allImages.indexOf(src);
    if (index === -1) {
        allImages.unshift(src);
        index = 0;
    }
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  
  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      
      <main className="flex-grow">
        <HeroStack onImageClick={openLightbox} />
        <About />
        <Services />
        <PortfolioMasonry onImageClick={openLightbox} />
        <Contact />
      </main>

      <Footer />

      <Lightbox 
        isOpen={lightboxOpen} 
        imageSrc={allImages[currentImageIndex]} 
        onClose={closeLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
