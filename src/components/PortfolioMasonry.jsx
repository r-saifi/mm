import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const CATEGORIES = ["All", "Residential", "Commercial", "Interior", "Landscape"];

export default function PortfolioMasonry() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = filter === "All"
    ? projects
    : projects.filter(p => p.category === filter);

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

        {/* Loading skeleton */}
        {loading && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl bg-glassBg animate-pulse" style={{ height: `${180 + i * 30}px` }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 text-textMuted">
            <p className="text-lg">No projects in this category yet.</p>
          </div>
        )}

        {/* Masonry Grid — layout preserved exactly */}
        {!loading && filtered.length > 0 && (
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group rounded-2xl overflow-hidden cursor-pointer break-inside-avoid"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <img
                    src={project.coverImage || project.images?.[0]}
                    alt={project.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="text-white/70 text-xs uppercase tracking-widest mb-1">{project.category}</p>
                    <h3 className="text-white font-display font-semibold text-lg leading-tight">{project.title}</h3>
                    <span className="mt-3 inline-block text-white text-sm font-medium border border-white/30 px-4 py-1.5 rounded-full backdrop-blur-sm w-fit">
                      View Project →
                    </span>
                  </div>
                  {/* Photo count badge */}
                  {project.images?.length > 1 && (
                    <span className="absolute top-3 right-3 text-xs text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.images.length} photos
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
