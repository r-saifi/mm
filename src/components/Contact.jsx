import { useState } from 'react';
import { MapPin, Phone, EnvelopeSimple } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Import Firestore functions dynamically or at top (we use standard import above but need to define it)
    try {
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        project: formData.get('project'),
        message: formData.get('message'),
        status: 'unread',
        createdAt: new Date()
      };
      
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      
      await addDoc(collection(db, 'messages'), data);
      
      setSubmitted(true);
      e.target.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-[5%] relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-14 rounded-3xl"
          >
            <span className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">Get in Touch</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Let's bring your <span className="text-gradient">vision</span> to life.
            </h2>
            <p className="text-textMuted text-lg mb-12">
              Our team of highly skilled architects and designers are ready to work with you.
            </p>
            
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-glassBg border border-glassBorder flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                  <MapPin size={24} weight="fill" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-semibold mb-1">Address</h4>
                  <p className="text-textMuted leading-relaxed">P-53, 3rd Floor, South City 1<br/>Gurgaon, Haryana 122001</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-glassBg border border-glassBorder flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                  <Phone size={24} weight="fill" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-semibold mb-1">Phone / WhatsApp</h4>
                  <p className="text-textMuted">+91 9780893934</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-glassBg border border-glassBorder flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                  <EnvelopeSimple size={24} weight="fill" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-semibold mb-1">Email</h4>
                  <p className="text-textMuted break-all">shaifali.mmdesignstudio@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <form onSubmit={handleSubmit} className="glass p-10 md:p-12 rounded-3xl flex flex-col gap-6 relative">
              {submitted && (
                <div className="absolute inset-0 bg-glassBg backdrop-blur-md rounded-3xl flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Message Sent</h3>
                  <p className="text-textMuted text-center max-w-[80%]">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-textMuted uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="e.g. John Doe"
                    required 
                    className="w-full bg-transparent border border-glassBorder rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted/70 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-textMuted uppercase tracking-wider">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="john@example.com"
                    required 
                    className="w-full bg-transparent border border-glassBorder rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted/70 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="project" className="text-sm font-semibold text-textMuted uppercase tracking-wider">Project Type</label>
                <select 
                  id="project" 
                  name="project" 
                  className="w-full bg-transparent border border-glassBorder rounded-xl px-4 py-3 text-textMain focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="architecture" className="text-bgMain">Architecture</option>
                  <option value="interior" className="text-bgMain">Interior Design</option>
                  <option value="landscape" className="text-bgMain">Landscape</option>
                  <option value="other" className="text-bgMain">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-textMuted uppercase tracking-wider">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  placeholder="Tell us about your project requirements..."
                  rows="5" 
                  required
                  className="w-full bg-transparent border border-glassBorder rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted/70 focus:outline-none focus:border-accent transition-colors resize-y"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="mt-4 w-full bg-accent text-white font-semibold py-4 rounded-xl hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(var(--accent-rgb),0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
