import React, { useState } from 'react';
import { SectionId } from '../types.ts';
import { Mail, MapPin, ImageOff } from 'lucide-react';

const Contact: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id={SectionId.CONTACT} className="py-24 bg-slate-950 text-white border-t-8 border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text & Contact */}
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
              LET'S CONNECT
            </h2>
            <p className="text-slate-400 mb-12 text-xl font-['VT323'] leading-relaxed">
              Always open to discussing Product Management, Engineering, or just trading travel stories. 
              Check out my photography or drop me a line.
            </p>

            <a 
              href="mailto:ryan.dumlao@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold font-['VT323'] text-xl border-4 border-white hover:bg-white hover:text-blue-900 transition-colors"
            >
              <Mail size={24} />
              ryan.dumlao@gmail.com
            </a>

            <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col gap-2 text-slate-500 font-['VT323'] text-lg">
               <div className="flex items-center gap-2 text-slate-400">
                 <MapPin size={18} />
                 <span>SAN FRANCISCO BAY AREA</span>
               </div>
               <p>© 2024 RYAN DUMLAO. ALL RIGHTS RESERVED.</p>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
             <div className="w-full aspect-[4/3] bg-slate-900 border-4 border-slate-700 p-2 shadow-[8px_8px_0px_0px_#1e293b]">
                <div className="w-full h-full border-2 border-slate-800 overflow-hidden flex items-center justify-center bg-slate-800">
                   {!imgError ? (
                       <img 
                          src="./assets/img/contact.jpg" 
                          alt="Travel & Links" 
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                          onError={() => setImgError(true)}
                       />
                   ) : (
                       <div className="flex flex-col items-center justify-center text-slate-600">
                           <ImageOff size={48} className="mb-2" />
                           <span className="font-['VT323']">Image Offline</span>
                       </div>
                   )}
                </div>
             </div>
             {/* Decorative element */}
             <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-4 border-l-4 border-blue-600"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;