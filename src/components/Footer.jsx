import { InstagramLogo, FacebookLogo, LinkedinLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="bg-bgSecondary py-12 px-[5%] border-t border-glassBorder mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
           <div className="bg-accent rounded-md flex items-center justify-center overflow-hidden">
             <img src="/images/new_logo.png" alt="Logo mark" className="h-[30px] w-auto object-cover" onError={(e) => e.target.style.display='none'} />  
           </div>
           <span className="text-xl font-display font-black leading-none text-textMuted tracking-tighter uppercase mt-0.5">
             DESIGN
           </span>
        </div>
        
        <p className="text-textMuted text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Massimo Mondo Design Studio. All rights reserved.
        </p>

        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full border border-glassBorder bg-glassBg flex items-center justify-center text-textMuted hover:text-accent hover:border-accent transition-all hover:-translate-y-1">
            <InstagramLogo size={20} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-glassBorder bg-glassBg flex items-center justify-center text-textMuted hover:text-accent hover:border-accent transition-all hover:-translate-y-1">
            <FacebookLogo size={20} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-glassBorder bg-glassBg flex items-center justify-center text-textMuted hover:text-accent hover:border-accent transition-all hover:-translate-y-1">
            <LinkedinLogo size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
