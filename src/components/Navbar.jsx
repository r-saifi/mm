import { useState, useEffect } from 'react';
import { Sun, Moon } from '@phosphor-icons/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-[5%] py-6 transition-all duration-300 ${isScrolled ? 'py-4 glass shadow-glass' : 'bg-transparent'
        }`}
    >
      <a href="#home" className="flex flex-col tracking-wider font-display shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-accent rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/images/new_logo.png" alt="Logo mark" className="h-[50px] w-auto object-cover" onError={(e) => e.target.style.display = 'none'} />
          </div>
          <span className="text-2xl font-display font-black leading-none text-textMain tracking-tighter uppercase mt-0.5">
            DESIGN
          </span>
        </div>
      </a>

      <ul className="hidden md:flex gap-10 font-medium">
        <li><a href="#home" className="hover:text-accent transition-colors">Home</a></li>
        <li><a href="#about" className="hover:text-accent transition-colors">About</a></li>
        <li><a href="#services" className="hover:text-accent transition-colors">Services</a></li>
        <li><a href="#portfolio" className="hover:text-accent transition-colors">Our Work</a></li>
      </ul>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-glassBorder bg-glassBg backdrop-blur hover:bg-accent hover:text-white transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(var(--accent-rgb),0.3)]"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <a
          href="#contact"
          className="px-6 py-3 rounded-full bg-accent text-white font-medium hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(var(--accent-rgb),0.4)] transition-all hidden sm:block"
        >
          Let's Talk
        </a>
      </div>
    </nav>
  );
}
