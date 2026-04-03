import { motion } from 'framer-motion';
import { House, CompassTool, SketchLogo, Tree } from '@phosphor-icons/react';

const SERVICES = [
  {
    icon: <House size={48} weight="light" />,
    title: "Architectural Design",
    description: "From concept to completion, we create innovative architectural solutions."
  },
  {
    icon: <CompassTool size={48} weight="light" />,
    title: "Interior Design",
    description: "Transforming empty spaces into beautiful, functional, and living environments."
  },
  {
    icon: <SketchLogo size={48} weight="light" />,
    title: "Project Management",
    description: "Expert oversight to ensure your project is delivered on time and within budget."
  },
  {
    icon: <Tree size={48} weight="light" />,
    title: "Landscape Design",
    description: "Creating harmonious outdoor spaces that connect naturally with your architecture."
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-[5%] relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Comprehensive <span className="text-gradient">Services</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-2xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(var(--accent-rgb),0.2)] transition-all duration-300 group"
            >
              <div className="text-accent group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-display font-semibold">{service.title}</h3>
              <p className="text-textMuted">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
