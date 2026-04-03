import { motion } from 'framer-motion';
import { CheckCircle } from '@phosphor-icons/react';

export default function About() {
  return (
    <section id="about" className="py-24 px-[5%] bg-bgSecondary">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">About Us</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Crafting spaces that <span className="text-gradient">inspire</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden glass aspect-video relative"
          >
            {/* Fallback to image if video not found */}
            <video src="/images/video.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover"></video>
            <div className="absolute inset-0 bg-black/10"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h3 className="text-3xl font-display font-semibold">Excellence in Architecture & Design</h3>
            <p className="text-textMuted text-lg leading-relaxed">
              Massimo Mondo Design Studio is a young architecture firm looking to transform lives by creating spaces for families, couples, singles or anybody who is looking for a change in their homes or workspaces.
            </p>
            <p className="text-textMuted text-lg leading-relaxed">
              We enrich the life of our users in a luxurious way, believing in the visual impacts of interior and the echo of material on productivity and greater creativity.
            </p>
            <ul className="flex flex-col gap-4 mt-4">
              <li className="flex items-center gap-3 text-lg font-medium">
                <CheckCircle size={24} weight="fill" className="text-accent" />
                Conceptual & Execution Design
              </li>
              <li className="flex items-center gap-3 text-lg font-medium">
                <CheckCircle size={24} weight="fill" className="text-accent" />
                Interior Detailing & Material Selection
              </li>
              <li className="flex items-center gap-3 text-lg font-medium">
                <CheckCircle size={24} weight="fill" className="text-accent" />
                Landscape & Garden Design
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
