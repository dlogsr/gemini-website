import React, { useState } from 'react';
import { Menu, X, Github, Linkedin } from 'lucide-react';
import { SectionId } from '../types';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Experience', href: `#${SectionId.EXPERIENCE}` },
    { label: 'Education', href: `#${SectionId.EDUCATION}` },
    { label: 'Portfolio', href: `#${SectionId.PROJECTS}` },
    { label: 'Photography', href: `#${SectionId.PHOTOGRAPHY}` },
    { label: 'Press', href: `#${SectionId.PRESS}` },
    { label: 'Skills', href: `#${SectionId.SKILLS}` },
    { label: 'Contact', href: `#${SectionId.CONTACT}` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-sm border-b-4 border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-blue-600 border-4 border-slate-200 flex items-center justify-center transition-transform group-hover:rotate-3">
            <span className="text-white font-bold text-lg font-['Press_Start_2P']">R</span>
          </div>
          <span className="hidden sm:inline text-slate-100 text-sm font-['Press_Start_2P'] tracking-tight group-hover:text-blue-500 transition-colors">
            RYAN.DUMLAO
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-8">
          {navItems.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              className="text-xl text-slate-400 hover:text-blue-500 font-['VT323'] uppercase tracking-wide hover:underline decoration-2 decoration-blue-500 underline-offset-4 transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Socials & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 border-l-4 border-slate-800 pl-4">
            <a href="http://www.github.com/dlogsr/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="http://www.linkedin.com/pub/ryan-dumlao/19/442/876/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><Linkedin size={20} /></a>
          </div>

          <button 
            className="xl:hidden text-slate-100 p-2 border-2 border-slate-700 hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 right-0 bg-slate-950 border-b-4 border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
          {navItems.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl text-slate-100 font-['VT323'] py-3 border-b-2 border-slate-800 last:border-0 hover:pl-4 transition-all hover:text-blue-500"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;