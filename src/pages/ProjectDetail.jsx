import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CaretLeft, CaretRight, X, MagnifyingGlassPlus } from '@phosphor-icons/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', id));
        if (snap.exists()) {
          setProject({ id: snap.id, ...snap.data() });
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error(e);
        setNotFound(true);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % project.images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + project.images.length) % project.images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, project]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (loading) return (
    <div className="min-h-screen bg-bgMain flex items-center justify-center">
      <span className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-bgMain flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-display font-bold text-textMain mb-4">404</h1>
      <p className="text-textMuted text-lg mb-8">This project doesn't exist.</p>
      <Link to="/#portfolio" className="flex items-center gap-2 text-accent hover:underline font-medium">
        <ArrowLeft size={18} /> Back to Portfolio
      </Link>
    </div>
  );

  const images = project.images || [];

  return (
    <div className="min-h-screen bg-bgMain flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-24 px-[5%]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/#portfolio"
              className="inline-flex items-center gap-2 text-textMuted hover:text-accent transition-colors text-sm font-medium group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* ─── Image Gallery ─── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div
                className="relative rounded-3xl overflow-hidden aspect-[4/3] cursor-zoom-in group"
                onClick={() => { setLightboxIndex(selectedImage); setLightboxOpen(true); }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={project.title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <MagnifyingGlassPlus
                    size={40}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                  />
                </div>
                {/* Nav arrows over main image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(i => (i - 1 + images.length) % images.length); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-accent transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                    >
                      <CaretLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(i => (i + 1) % images.length); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-accent transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                    >
                      <CaretRight size={20} />
                    </button>
                  </>
                )}
                {/* Photo counter */}
                {images.length > 1 && (
                  <span className="absolute bottom-4 right-4 text-xs text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    {selectedImage + 1} / {images.length}
                  </span>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all snap-start ${
                        selectedImage === i
                          ? 'border-accent scale-105 shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ─── Project Info ─── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-6 lg:sticky lg:top-32"
            >
              <div>
                <span className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">
                  {project.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-textMain leading-tight">
                  {project.title}
                </h1>
              </div>

              {project.description && (
                <div className="glass p-6 rounded-2xl border border-glassBorder">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-textMuted mb-3">About this project</h2>
                  <p className="text-textMain leading-relaxed whitespace-pre-wrap">{project.description}</p>
                </div>
              )}

              <div className="flex gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-textMuted mb-1">Photos</p>
                  <p className="text-2xl font-display font-bold text-accent">{images.length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-textMuted mb-1">Category</p>
                  <p className="text-2xl font-display font-bold text-textMain">{project.category}</p>
                </div>
              </div>

              <Link
                to="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(var(--accent-rgb),0.35)] transition-all w-full text-center"
              >
                Enquire About This Project
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-accent transition-colors z-50"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={36} />
            </button>
            <div
              className="relative w-full max-w-6xl flex items-center justify-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxIndex(i => (i - 1 + images.length) % images.length)}
                className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-accent transition-all shrink-0"
              >
                <CaretLeft size={28} />
              </button>
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={images[lightboxIndex]}
                alt={project.title}
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
              <button
                onClick={() => setLightboxIndex(i => (i + 1) % images.length)}
                className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-accent transition-all shrink-0"
              >
                <CaretRight size={28} />
              </button>
            </div>
            <span className="absolute bottom-6 text-white/50 text-sm">
              {lightboxIndex + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
