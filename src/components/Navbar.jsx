import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { gsap } from "gsap";
import { X, Menu, Eye, EyeOff, User, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleNavigate = (path) => {
    if (path.startsWith('#')) {
      if (isHome) {
        setIsMobileMenuOpen(false);
        const el = document.querySelector(path);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + path);
      }
    } else {
      navigate(path);
      setIsMobileMenuOpen(false);
    }
    
    // Smooth fade out effect for UI if any (mimicking the user's snippet logic)
    gsap.to("#hero-content", {
      opacity: 0.8,
      duration: 0.4,
      onComplete: () => {
        gsap.to("#hero-content", { opacity: 1, duration: 0.4 });
      },
    });
  };

  // Navigation Items
  const navItems = [
    { name: 'HOME', path: '#home' },
    { name: 'ABOUT', path: '#about' },
    { name: 'SERVICES', path: '#services' },
    { name: 'PROJECTS', path: '#portfolio' },
    { name: 'CONTACT', path: '#contact' },
  ];

  // Mobile Navbar
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return (
      <>
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-bgMain/95 backdrop-blur-xl border-b border-accent/20"
              : "bg-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="overflow-hidden rounded-md shadow-md shadow-accent/20 border border-accent/20">
                <img src="/images/new_logo.png" alt="MM Design" className={`w-auto transition-all duration-500 ${isScrolled ? "h-8" : "h-10"}`} />
              </div>
              <div className="flex flex-col border-l-2 border-accent/40 pl-3">
                <span className="text-textMain font-display font-black tracking-[0.2em] text-base leading-none uppercase">Design</span>
                <span className="text-accent text-[9px] font-bold tracking-[0.3em] uppercase mt-1">Studio</span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-glassBorder bg-glassBg text-textMain"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <button
                className="relative z-50 p-2 rounded-lg transition-all duration-200"
                style={{
                  background: isMobileMenuOpen
                    ? "rgba(var(--accent-rgb), 0.1)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(var(--accent-rgb), 0.2)",
                }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-accent" />
                ) : (
                  <Menu size={20} className="text-textMain/80" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-bgMain/95 backdrop-blur-xl flex flex-col items-center justify-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative flex flex-col items-center space-y-8 px-4 text-center">
              <div className="mb-4">
                <h2 className="text-2xl font-display font-light text-textMain tracking-[0.2em]">NAVIGATION</h2>
                <div className="w-12 h-0.5 bg-accent mx-auto mt-2"></div>
              </div>

              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className="text-2xl font-light text-textMain/90 tracking-[0.15em] transition-all hover:text-accent hover:scale-110"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    opacity: isMobileMenuOpen ? 1 : 0,
                  }}
                >
                  {item.name}
                </button>
              ))}

              <Link
                to={currentUser ? "/admin/dashboard" : "/admin"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-light text-textMuted tracking-[0.1em] flex items-center gap-2 hover:text-accent"
              >
                <User size={20} />
                ADMIN PANEL
              </Link>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Navbar
  return (
    <nav
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out flex items-center justify-between ${
        isScrolled
          ? "bg-bgMain/80 backdrop-blur-xl rounded-full border border-glassBorder shadow-2xl px-10 py-3 w-[90%] max-w-5xl"
          : "bg-transparent border-transparent px-6 py-4 w-full max-w-7xl"
      }`}
    >
      <div className="flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="overflow-hidden rounded-md transition-transform duration-500 group-hover:scale-105 shadow-md shadow-accent/20 border border-accent/20">
            <img src="/images/new_logo.png" alt="MM Design" className="h-10 w-auto" />
          </div>
          <div className="flex flex-col justify-center border-l-2 border-accent/40 pl-3">
            <span className="text-textMain font-display font-black tracking-[0.2em] text-xl leading-none uppercase">Design</span>
            <span className="text-accent text-[10px] font-bold tracking-[0.35em] uppercase mt-1">Studio</span>
          </div>
        </Link>
      </div>

      <div className={`flex items-center transition-all duration-500 ${isScrolled ? "space-x-6" : "space-x-10"}`}>
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigate(item.path)}
            className={`tracking-wide transition-all hover:text-accent ${
              isScrolled ? "text-xs text-textMain font-bold" : "text-sm text-textMain font-semibold"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center rounded-full border border-glassBorder transition-all hover:bg-accent hover:text-white ${
            isScrolled ? "w-8 h-8" : "w-10 h-10"
          }`}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={isScrolled ? 16 : 18} /> : <Moon size={isScrolled ? 16 : 18} />}
        </button>

        <Link
          to={currentUser ? "/admin/dashboard" : "/admin"}
          className={`flex items-center justify-center rounded-full border border-glassBorder transition-all hover:bg-accent hover:text-white ${
            isScrolled ? "w-8 h-8" : "w-10 h-10"
          }`}
          title="Admin Panel"
        >
          <User size={isScrolled ? 16 : 18} weight={currentUser ? 'fill' : 'regular'} />
        </Link>

        {!isScrolled && (
          <button
            onClick={() => handleNavigate('#contact')}
            className="px-6 py-2.5 bg-accent text-white rounded-full font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            LET'S TALK
          </button>
        )}
      </div>
    </nav>
  );
}
