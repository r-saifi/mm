import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroStack from './components/HeroStack';
import About from './components/About';
import Services from './components/Services';
import PortfolioMasonry from './components/PortfolioMasonry';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetail from './pages/ProjectDetail';
import ProtectedRoute from './components/ProtectedRoute';

// Hero images for global lightbox (hero-specific)
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&h=800&fit=crop",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&h=800&fit=crop",
];

function HomePage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState(HERO_IMAGES);

  const openLightbox = (src, imageSet) => {
    const images = imageSet || HERO_IMAGES;
    setLightboxImages(images);
    let index = images.indexOf(src);
    if (index === -1) index = 0;
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-grow">
        <HeroStack onImageClick={(src) => openLightbox(src, HERO_IMAGES)} />
        <About />
        <Services />
        <PortfolioMasonry />
        <Contact />
      </main>
      <Footer />
      <Lightbox
        isOpen={lightboxOpen}
        imageSrc={lightboxImages[currentImageIndex]}
        onClose={closeLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
