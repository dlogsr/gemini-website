import React, { useEffect, useState } from 'react';
import { ArrowRight, Download, Bot, Search, Sparkles } from 'lucide-react';
import { SectionId } from '../types.ts';
import { useChat } from '../contexts/ChatContext.tsx';

const Hero: React.FC = () => {
  const [pixelatedSrc, setPixelatedSrc] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState("");
  const [imgError, setImgError] = useState(false);
  
  const { triggerChat } = useChat();
  
  const imgSrc = "./assets/img/profile.jpg";

  useEffect(() => {
    if (imgError) return;

    const generatePixelatedVersion = () => {
        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const size = 64; 
                
                const aspect = img.naturalWidth / img.naturalHeight;
                const canvasWidth = size;
                const canvasHeight = size / aspect;

                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                    setPixelatedSrc(canvas.toDataURL());
                }
            } catch (e) {
                console.warn("Could not generate pixel art version:", e);
            }
        };
        img.onerror = () => { };
    };

    generatePixelatedVersion();
  }, [imgSrc, imgError]);

  const handlePromptSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    triggerChat(promptInput);
    setPromptInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    triggerChat(suggestion);
  };

  return (
    <section id={SectionId.HERO} className="min-h-screen flex flex-col justify-center pt-24 relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0 opacity-[0.05]" 
           style={{
             backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col gap-12 pb-12">
        
        {/* TOP: Search Bar Section */}
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 text-blue-400 font-bold font-['VT323'] text-xl animate-pulse">
                    <Bot size={24} />
                    <span>RYAN DUMLAO AMA BOT</span>
                </div>
            </div>

            <form onSubmit={handlePromptSubmit} className="relative group mb-6">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                    <Search className="text-slate-500 group-focus-within:text-blue-400 transition-colors" size={28} />
                </div>
                <input 
                    type="text" 
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Ask me about my product management experience, engineering background, or hobbies..." 
                    className="w-full bg-slate-900/80 backdrop-blur-sm border-2 border-slate-700 rounded-full py-5 pl-16 pr-16 text-slate-100 font-['VT323'] text-2xl shadow-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-900/50 transition-all placeholder-slate-600"
                />
                <button 
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-full transition-all"
                >
                    <ArrowRight size={24} />
                </button>
            </form>

            <div className="flex flex-wrap justify-center gap-3">
                {[
                    "Summarize his PM experience",
                    "What technologies does he know?",
                    "Tell me about Pokémon Abode",
                    "How does he blend engineering & product?"
                ].map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(suggestion);
                        }}
                        className="px-4 py-2 text-base font-['VT323'] bg-slate-900/50 text-slate-400 border border-slate-700 rounded-full hover:border-blue-500 hover:text-blue-400 hover:bg-slate-900 transition-all cursor-pointer"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>

        {/* BOTTOM: Split Content */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Image */}
            <div className="relative order-1 md:order-1 flex justify-center md:justify-end">
                <div className="relative w-full aspect-square max-w-md">
                    <div className="w-full h-full bg-slate-900 border-4 border-slate-600 p-3 shadow-[12px_12px_0px_0px_#1e293b] relative z-10 hover:border-blue-500 transition-colors">
                        <div className="w-full h-full border-2 border-slate-700 overflow-hidden relative group">
                            {!imgError ? (
                                <img 
                                    src={imgSrc} 
                                    alt="Ryan Dumlao" 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                    <span className="text-6xl font-['Press_Start_2P'] text-blue-500">RD</span>
                                </div>
                            )}
                            {pixelatedSrc && !imgError && (
                                <img 
                                    src={pixelatedSrc}
                                    alt="Ryan Dumlao Pixel Art"
                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            )}
                             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 p-1 rounded-sm shadow-lg">
                                <Sparkles className="text-white w-5 h-5 animate-pulse" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-blue-600 -z-0"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-blue-600 -z-0"></div>
                </div>
            </div>

            {/* Right Column: Text */}
            <div className="order-2 md:order-2">
                <div className="inline-block px-3 py-1 bg-slate-800 text-blue-400 font-bold font-['VT323'] text-lg mb-6 tracking-wide border-2 border-slate-700">
                    CREATIVE PRODUCT MANAGEMENT
                </div>
                
                <h1 className="text-4xl md:text-6xl text-slate-100 leading-none mb-6 font-['Press_Start_2P']">
                    RYAN<br/>DUMLAO
                </h1>
                
                <h2 className="text-xl md:text-2xl text-blue-500 font-['VT323'] mb-8 block border-l-4 border-blue-600 pl-4">
                    GROUP PRODUCT MANAGER @ ADOBE
                </h2>
                
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-['VT323'] mb-10 text-justify">
                    Hi! I’m Ryan, an electrical engineer turned product leader bridging the gap between complex technical constraints and user-centric strategy.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                    <a 
                    href={`#${SectionId.EXPERIENCE}`}
                    className="px-8 py-4 bg-blue-600 text-white font-bold font-['VT323'] text-xl border-4 border-transparent hover:bg-white hover:text-slate-900 hover:border-white transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-none"
                    >
                    VIEW RESUME <ArrowRight size={20} />
                    </a>
                    <a 
                    href="/rdumlao_resume.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-transparent text-slate-100 font-bold font-['VT323'] text-xl border-4 border-slate-100 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                    >
                    DOWNLOAD CV <Download size={20} />
                    </a>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;