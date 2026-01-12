import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { SectionId } from '../types';

const Hero: React.FC = () => {
  return (
    <section id={SectionId.HERO} className="min-h-screen flex items-center pt-20 relative overflow-hidden bg-slate-950">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" 
           style={{
             backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Column: Image */}
        <div className="relative order-1 md:order-1">
          <div className="relative w-full aspect-square max-w-md mx-auto">
             {/* Main Image Frame */}
             <div className="w-full h-full bg-slate-900 border-4 border-slate-600 p-3 shadow-[12px_12px_0px_0px_#1e293b] relative z-10">
                <div className="w-full h-full border-2 border-slate-700 overflow-hidden relative">
                  <img 
                    src="http://www.ryandumlao.com/headshot3.jpg" 
                    alt="Ryan Dumlao" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-blue-600 -z-0"></div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-blue-600 -z-0"></div>
          </div>
        </div>

        {/* Right Column: Text */}
        <div className="order-2 md:order-2">
          <div className="inline-block px-3 py-1 bg-slate-800 text-blue-400 font-bold font-['VT323'] text-lg mb-6 tracking-wide border-2 border-slate-700">
             BAY AREA NATIVE
          </div>
          
          <h1 className="text-3xl md:text-5xl text-slate-100 leading-tight mb-8">
            RYAN DUMLAO<br/>
            <span className="text-blue-500 text-2xl md:text-4xl mt-2 block">MBA CANDIDATE & ENGINEER</span>
          </h1>
          
          <div className="border-l-4 border-blue-600 pl-6 py-2 mb-10">
            <p className="text-xl text-slate-300 leading-relaxed font-['VT323']">
              Hi! I’m Ryan, an MBA candidate, aspiring product manager, electrical engineer, freelance web developer, world traveler, amateur photographer, avid snowboarder, and motorcycle enthusiast.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed font-['VT323'] mt-4">
               From running a massive Pokémon website to assembling optical satellites for NASA and launching medical devices, I bridge the gap between complex engineering and strategic product development.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <a 
              href={`#${SectionId.EXPERIENCE}`}
              className="px-8 py-4 bg-blue-600 text-white font-bold font-['VT323'] text-xl border-4 border-transparent hover:bg-white hover:text-slate-900 hover:border-white transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-none"
            >
              VIEW RESUME <ArrowRight size={20} />
            </a>
            <a 
              href="/rdumlao_resume.pdf" 
              className="px-8 py-4 bg-transparent text-slate-100 font-bold font-['VT323'] text-xl border-4 border-slate-100 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
            >
              DOWNLOAD CV <Download size={20} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;