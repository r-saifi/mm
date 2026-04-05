import { InstagramLogo, WhatsappLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="bg-bgSecondary py-12 px-[5%] border-t border-glassBorder mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-all">
           <div className="rounded-md overflow-hidden shadow-md shadow-accent/20 border border-accent/20">
             <img src="/images/new_logo.png" alt="MM Design Logo" className="h-[36px] w-auto object-cover" onError={(e) => e.target.style.display='none'} />  
           </div>
           <div className="flex flex-col border-l-2 border-accent/40 pl-3">
             <span className="text-textMain font-display font-black tracking-[0.2em] text-lg leading-none uppercase">Design</span>
             <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Studio</span>
           </div>
        </div>
        
        <p className="text-textMuted text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Massimo Mondo Design Studio. All rights reserved.
        </p>

        <div className="flex gap-4">
          <a href="https://wa.me/919780893934" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-glassBorder bg-glassBg flex items-center justify-center text-textMuted hover:text-[#25D366] hover:border-[#25D366] transition-all hover:-translate-y-1">
            <WhatsappLogo size={20} />
          </a>
          <a href="https://www.instagram.com/mmdesignstudio.ind?igsh=MTIxbTl5a25leXlscQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-glassBorder bg-glassBg flex items-center justify-center text-textMuted hover:text-[#E1306C] hover:border-[#E1306C] transition-all hover:-translate-y-1">
            <InstagramLogo size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
