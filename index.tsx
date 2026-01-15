import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'https://esm.sh/react@19.2.3';
import ReactDOM from 'https://esm.sh/react-dom@19.2.3/client';
import { GoogleGenAI } from 'https://esm.sh/@google/genai@1.35.0';
import { 
  ArrowRight, Download, Loader2, Sparkles, Bot, Search, 
  Menu, X, Github, Linkedin, Briefcase, Camera, 
  CircuitBoard, Layout, Database, Image as ImageIcon, 
  Maximize2, ChevronLeft, ChevronRight, Mail, MapPin, 
  GraduationCap, ExternalLink, Award, Mic, BookOpen, 
  Video, Newspaper, Play, User, Send, ImageOff, MessageCircle 
} from 'https://esm.sh/lucide-react@0.562.0';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'https://esm.sh/recharts@3.6.0';

// --- TYPES & CONSTANTS ---

export enum SectionId {
  HERO = 'hero',
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  PRESS = 'press',
  PHOTOGRAPHY = 'photography',
  CONTACT = 'contact'
}

// --- SERVICES: GEMINI ---

const RESUME_CONTEXT = `
You are the professional AI Assistant for Ryan Dumlao, hosted on his personal portfolio website. 
Your goal is to answer visitor questions about Ryan professionally, highlighting his unique blend of Engineering and Business expertise.

Here is Ryan's profile data based on his resume and background:

**Profile Summary**:
- **Current Role**: Group Product Manager at Adobe (Photoshop).
- **Background**: Electrical Engineer turned Product Manager. Bay Area native.
- **Fun Fact**: Formerly ran one of the internet's largest Pokémon websites ("Pokémon Abode") and recently interviewed about it in Johto Times.

**Education**:
- **UCLA Anderson School of Management**: MBA (2018). Fellowships: Collins Family Fellow, Student Investment Fund. Leadership: Anderson Brand Management Chair, VP Marketing (Asian Management Student Association).
- **UCLA**: MS in Electrical Engineering (Solid State & Photonics). Research on GaAs nanopillars.
- **UCSD**: BS in Electrical Engineering (Photonics), Minor in Japanese Studies.

**Work Experience**:
- **Adobe (2018-Present)**: Group Product Manager (2023-Present) leading Photoshop on Mobile (iOS, Android). Previously Senior PM (2021-2023) and PM (2018-2021). Led strategy for mobile ecosystems, launched Camera Raw support, and "One-Tap" actions.
- **ChowNow (2018)**: Product Manager. Focused on restaurant partner retention and consumer checkout optimization.
- **Juniper Networks (MBA Intern)**: Product Manager for Cloud Strategy (AWS/Azure/GCP).
- **TeleSign (MBA Intern)**: Associate Product Manager. Established roadmap for strategy pivot; created pricing model projecting $3M revenue.
- **The Medicines Company (Senior EE)**: Developed IONSYS™ fentanyl iontophoretic system. Managed FDA/EU regulatory approvals. Built web/mobile sales tools.
- **Raytheon (EE II)**: Engineering Rotation Program (Optical Engineer, Quality Manager, Financial Analyst). Worked on F/A-18 Radar and VIIRS.
- **Space Micro Inc. (2009-2010)**: Electrical Engineer. Designed radiation-hardened satellite communication systems and performed flight hardware testing.
- **Pokémon Abode (1999-Present)**: Founder & Lead Developer. Built and maintained a massive fan community, managing LAMP stack infrastructure and content teams.

**Key Skills**:
- **Technical**: HTML5, CSS3, JavaScript, jQuery, Ruby on Rails, C/C++, VHDL.
- **Hardware**: FPGAs, Optical Systems, Class 1000+ Cleanrooms, Oscilloscopes.
- **Product**: Market Analysis, Pricing Strategy, Regulatory Approval (FDA), Roadmap Development, Mobile/Web Product Strategy.

**Media & Recognition**:
- Speaker at Adobe MAX 2025 ("Photoshop in Your Pocket").
- Featured in Fast Company (Innovation by Design 2025).
- Featured in The Verge, Adobe Blog, and cited in O'Reilly's "Photoshop on the iPad" book.
- Interviewed by Johto Times regarding Pokémon Abode legacy.

Guidelines:
- **FORMATTING REQUIREMENT**: You must answer in a bulleted list format.
- **EMOJIS**: Start every bullet point with a relevant emoji.
- Keep answers concise, professional, and polite.
- If asked about "Pokemon", mention his experience running "Pokémon Abode" as a testament to his early web dev leadership.
- Focus on his transition from deep technical engineering (Raytheon/Medicines Co) to strategic product management (Adobe/Juniper).
`;

let chatSession = null;

const initializeChat = () => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY missing. Chat functionality will be limited.");
    return null; 
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: RESUME_CONTEXT,
      temperature: 0.7,
    },
  });
  return chatSession;
};

const sendMessageToGemini = async function* (message) {
  try {
    const chat = initializeChat();
    if (!chat) {
        yield "I'm sorry, I'm not fully configured right now (Missing API Key).";
        return;
    }
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
        if (chunk.text) {
            yield chunk.text;
        }
    }
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    yield "I'm having trouble connecting right now. Please try again later.";
  }
};

// --- CONTEXT: CHAT CONTEXT ---

const ChatContext = createContext(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);

  const triggerChat = useCallback((message) => {
    setIsOpen(true);
    setPendingMessage(message);
  }, []);

  const clearPendingMessage = useCallback(() => {
    setPendingMessage(null);
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, setIsOpen, triggerChat, pendingMessage, clearPendingMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// --- COMPONENT: HEADER ---

const Header = () => {
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
        <a href="#" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-blue-600 border-4 border-slate-200 flex items-center justify-center transition-transform group-hover:rotate-3">
            <span className="text-white font-bold text-lg font-['Press_Start_2P']">R</span>
          </div>
          <span className="hidden sm:inline text-slate-100 text-sm font-['Press_Start_2P'] tracking-tight group-hover:text-blue-500 transition-colors">
            RYAN.DUMLAO
          </span>
        </a>

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

// --- COMPONENT: HERO ---

const Hero = () => {
  const [pixelatedSrc, setPixelatedSrc] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [imgError, setImgError] = useState(false);
  
  const { triggerChat } = useChat();
  
  const imgSrc = "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/profile.jpg&w=800&q=80&output=jpg";
  const fallbackSrc = "https://ui-avatars.com/api/?name=Ryan+Dumlao&background=1e293b&color=3b82f6&size=512&font-size=0.33&bold=true";

  useEffect(() => {
    if (imgError) return;

    const generatePixelatedVersion = () => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
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

  const getBase64Image = async (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context failed'));
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
      };
      img.onerror = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(0, 0, 512, 512);
            ctx.fillStyle = "#3b82f6";
            ctx.font = "bold 120px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("RD", 256, 256);
            const dataURL = canvas.toDataURL('image/jpeg');
            resolve(dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
        } else {
            reject(new Error("Failed to load image and failed to generate fallback"));
        }
      };
      img.src = url;
    });
  };

  const handleEasterEgg = async () => {
    if (videoUrl || isGenerating) return;

    try {
        const win = window;
        if (win.aistudio && typeof win.aistudio.hasSelectedApiKey === 'function') {
            if (!win.aistudio.hasSelectedApiKey()) {
                await win.aistudio.openSelectKey();
            }
        }

        setIsGenerating(true);
        setGenerationStatus("Preparing the stage...");

        const base64Data = await getBase64Image(imgError ? fallbackSrc : imgSrc);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        setGenerationStatus("Generating dance moves (this takes ~1-2 mins)...");

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: 'A photorealistic video of this person dancing energetically and happily in a professional setting, keeping the same lighting and attire. High quality.',
            image: {
                imageBytes: base64Data,
                mimeType: 'image/jpeg',
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation });
            setGenerationStatus("Still dancing... (Veo is thinking)");
        }

        if (operation.error) {
            throw operation.error; 
        }

        setGenerationStatus("Downloading performance...");
        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("No video URI returned");

        const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        setVideoUrl(url);

    } catch (e) {
        console.error("Easter egg failed:", e);
        
        const errorBody = JSON.stringify(e);
        const isPermissionError = errorBody.includes("403") || errorBody.includes("PERMISSION_DENIED");
        const isNotFoundError = errorBody.includes("Requested entity was not found");
        
        const win = window;

        if ((isPermissionError || isNotFoundError) && win.aistudio) {
             try {
                 await win.aistudio.openSelectKey();
                 alert("The previously selected API Key was invalid or lacked permissions. Please select a valid Paid API Key to try again.");
             } catch (k) {
                 console.error("Failed to open key selector", k);
             }
        } else {
             let errorMessage = "Could not generate the dance video.";
             if (e?.message) errorMessage += `\n\n${e.message}`;
             else errorMessage += `\n\n${String(e)}`;
             alert(errorMessage);
        }
    } finally {
        setIsGenerating(false);
    }
  };

  const handlePromptSubmit = (e) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;
    triggerChat(promptInput);
    setPromptInput("");
  };

  const handleSuggestionClick = (suggestion) => {
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

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-1 md:order-1 flex justify-center md:justify-end">
                <div className="relative w-full aspect-square max-w-md">
                    <div 
                        className={`w-full h-full bg-slate-900 border-4 border-slate-600 p-3 shadow-[12px_12px_0px_0px_#1e293b] relative z-10 ${!videoUrl ? 'cursor-pointer hover:border-blue-500 transition-colors' : ''}`}
                        onClick={handleEasterEgg}
                    >
                        <div className="w-full h-full border-2 border-slate-700 overflow-hidden relative group">
                        {videoUrl ? (
                            <video 
                                src={videoUrl} 
                                autoPlay 
                                loop 
                                controls 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <>
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
                                {pixelatedSrc && !isGenerating && !imgError && (
                                    <img 
                                        src={pixelatedSrc}
                                        alt="Ryan Dumlao Pixel Art"
                                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                )}
                                {!isGenerating && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 p-1 rounded-sm shadow-lg">
                                        <Sparkles className="text-white w-5 h-5 animate-pulse" />
                                    </div>
                                )}
                                {isGenerating && (
                                    <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4 text-center">
                                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                        <p className="text-white font-['VT323'] text-xl animate-pulse">
                                            {generationStatus}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                        </div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-blue-600 -z-0"></div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-blue-600 -z-0"></div>
                </div>
            </div>

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

// --- COMPONENT: SKILLS ---

const skillsData = [
  { subject: 'Strategy', A: 90, fullMark: 100 },
  { subject: 'Software', A: 85, fullMark: 100 },
  { subject: 'Hardware', A: 95, fullMark: 100 },
  { subject: 'Analytics', A: 80, fullMark: 100 },
  { subject: 'Leadership', A: 85, fullMark: 100 },
  { subject: 'Research', A: 75, fullMark: 100 },
];

const Skills = () => {
  return (
    <section id={SectionId.SKILLS} className="py-24 bg-slate-950 border-y-4 border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl text-slate-100 mb-8 border-b-4 border-blue-900 pb-4 inline-block">
              TECHNICAL & STRATEGIC TOOLKIT
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed font-['VT323'] text-justify">
              My background is grounded in hardcore engineering—designing FPGAs, optical systems, and circuit boards—but my passion lies in product development. 
              I have maintained my development skills (HTML5, CSS3, JS, Ruby on Rails) to adjust to the changing web landscape while sharpening my business acumen through my MBA.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 'Product Management', 
                 'HTML5 / CSS3 / JS', 
                 'Ruby on Rails', 
                 'C/C++ & VHDL',
                 'Circuit Design',
                 'Market Analysis'
               ].map((item) => (
                 <div key={item} className="flex items-center gap-3 p-3 bg-slate-900 border-2 border-slate-800 hover:border-blue-500 transition-colors">
                    <div className="w-2 h-2 bg-blue-500"></div>
                    <span className="text-slate-300 font-bold text-lg font-['VT323'] uppercase tracking-wide">{item}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="order-1 md:order-2 h-[450px] w-full bg-slate-900 border-4 border-slate-700 p-6 relative shadow-[8px_8px_0px_0px_#1e293b]">
            <div className="absolute -top-4 -right-4 bg-slate-800 border-2 border-slate-600 px-4 py-1 z-10 font-['VT323'] text-lg font-bold text-blue-400">
              SKILL_MATRIX
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                <PolarGrid stroke="#475569" strokeWidth={1} />
                <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#94a3b8', fontSize: 14, fontFamily: 'VT323', fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  isAnimationActive={true}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- COMPONENT: EXPERIENCE ---

const experiences = [
  {
    id: '0',
    role: 'Group Product Manager',
    company: 'Adobe',
    period: '2018 — Present',
    logo: 'https://logo.clearbit.com/adobe.com',
    description: [
      'Group PM (2023-Present): Leading product strategy for Photoshop on Mobile (iOS, Android). Managing a team of PMs driving growth and retention.',
      'Senior PM (2021-2023): Spearheaded the launch of Camera Raw support and "One-Tap" actions on iPad, bringing desktop-class power to touch devices.',
      'Product Manager (2018-2021): Defined the MVP and long-term vision for Photoshop on iPad, navigating v1.0 launch challenges to eventual product-market fit.',
      'Key Achievements: 2025 Fast Company Innovation by Design Award winner, Adobe MAX Speaker, and cited in O\'Reilly\'s "Photoshop on the iPad".'
    ]
  },
  {
    id: 'chownow',
    role: 'Product Manager',
    company: 'ChowNow',
    period: '2018',
    logo: 'https://logo.clearbit.com/chownow.com',
    description: [
      'Led product initiatives for the online ordering platform, focusing on restaurant partner retention and consumer conversion.',
      'Collaborated with engineering to optimize the "Order Ahead" checkout flow, reducing friction for hungry users.',
      'Defined requirements for restaurant-facing dashboard improvements.'
    ]
  },
  {
    id: '1',
    role: 'Product Manager, MBA Intern',
    company: 'Juniper Networks',
    period: '2017',
    logo: 'https://logo.clearbit.com/juniper.net',
    description: [
      'Pioneered product strategy for public cloud (AWS, Azure, GCP).',
      'Developed use cases and joint integrations with cloud start-ups.',
      'Conducted market and customer analysis for new product lines.'
    ]
  },
  {
    id: '2',
    role: 'Associate Product Manager Intern',
    company: 'TeleSign',
    period: '2017',
    logo: 'https://logo.clearbit.com/telesign.com',
    description: [
      'Established new product roadmap during strategy pivot.',
      'Substantiated underserved use cases through user interviews.',
      'Created bundled pricing model projecting $3M revenue opportunity.'
    ]
  },
  {
    id: '3',
    role: 'Senior Electrical Engineer',
    company: 'The Medicines Company',
    period: '2013 — 2016',
    logo: 'https://logo.clearbit.com/novartis.com',
    description: [
      'Developed IONSYS™ fentanyl iontophoretic transdermal system.',
      'Completed regulatory efforts for US FDA and EU MAA approvals.',
      'Developed web and iOS/Android mobile apps for hospital sales tools.'
    ]
  },
  {
    id: '4',
    role: 'Electrical Engineer II',
    company: 'Raytheon',
    period: '2010 — 2013',
    logo: 'https://logo.clearbit.com/rtx.com',
    description: [
      'Engineering Rotation: Optical Engineer (VIIRS), Quality Manager, Finance.',
      'Designed Radar Special Test Equipment for F/A-18 & F-15.',
      'FPGA VXI Board Design Group.'
    ]
  },
  {
    id: 'spacemicro',
    role: 'Electrical Engineer',
    company: 'Space Micro Inc.',
    period: '2009 — 2010',
    logo: 'https://logo.clearbit.com/spacemicro.com',
    description: [
      'Designed radiation-hardened satellite communication systems.',
      'Performed thermal and vibration testing for flight hardware.',
      'Assisted in the development of TT&C (Telemetry, Tracking, and Command) transponders.'
    ]
  },
  {
    id: 'pokemon',
    role: 'Founder & Lead Developer',
    company: 'Pokémon Abode',
    period: '1999 — Present',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg',
    description: [
      'Founded one of the internet’s largest and longest-running Pokémon fan communities.',
      'Designed and developed the full stack (LAMP) from scratch, managing high-traffic server infrastructure.',
      'Negotiated advertising partnerships and managed a distributed team of content creators.'
    ]
  }
];

const Experience = () => {
  const [imgErrors, setImgErrors] = useState({});

  const handleImgError = (id) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  return (
    <section id={SectionId.EXPERIENCE} className="py-24 max-w-5xl mx-auto px-6 bg-slate-950">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-3xl text-slate-100 mb-4">PROFESSIONAL HISTORY</h2>
        <div className="w-24 h-1 bg-blue-600"></div>
      </div>

      <div className="relative space-y-16">
        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-800 z-0"></div>
        {experiences.map((exp, index) => (
          <div key={exp.id} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-slate-700 z-10 flex items-center justify-center shadow-lg rounded-full overflow-hidden">
               {exp.logo && !imgErrors[exp.id] ? (
                 <img 
                    src={exp.logo} 
                    alt={exp.company} 
                    className="w-10 h-10 object-contain" 
                    onError={() => handleImgError(exp.id)}
                 />
               ) : (
                 <Briefcase size={24} className="text-slate-900" />
               )}
            </div>
            <div className="pl-24 md:pl-0 w-full md:w-[45%] group z-20 relative">
              <div className="bg-slate-900 border-2 border-slate-800 p-6 hover:border-blue-500 transition-colors shadow-sm hover:shadow-lg hover:shadow-blue-900/20 relative">
                <div className={`hidden md:block absolute top-6 w-4 h-4 bg-slate-900 border-t-2 border-l-2 border-slate-800 group-hover:border-blue-500 transition-colors rotate-45 ${index % 2 === 0 ? '-right-2.5 border-t-2 border-r-2 border-l-0 border-b-0' : '-left-2.5'}`}></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <h3 className="text-xl text-slate-100 font-bold tracking-tight font-['Press_Start_2P'] text-sm leading-6">{exp.role}</h3>
                    <span className="self-start inline-block px-2 py-1 bg-slate-800 text-blue-400 text-sm font-bold font-['VT323'] border border-slate-700 whitespace-nowrap">
                        {exp.period}
                    </span>
                </div>
                <div className="text-lg text-blue-500 mb-4 font-['VT323'] uppercase font-bold tracking-wide">{exp.company}</div>
                <ul className="space-y-3">
                  {exp.description.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-400 text-lg font-['VT323'] leading-tight">
                      <span className="mt-2 w-1.5 h-1.5 bg-slate-600 flex-shrink-0 square"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="hidden md:block w-[45%]"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- COMPONENT: EDUCATION ---

const educationData = [
  {
    id: '1',
    school: 'UCLA Anderson School of Management',
    degree: 'Master of Business Administration (MBA)',
    period: '2016 — 2018',
    logo: 'https://logo.clearbit.com/anderson.ucla.edu',
    description: [
      'Collins Family Fellow ($40k Merit Fellowship)',
      'Student Investment Fund Fellow',
      'Anderson Brand Management Chair',
      'VP Marketing, Asian Management Student Association'
    ]
  },
  {
    id: '2',
    school: 'UCLA',
    degree: 'M.S. Electrical Engineering',
    period: '2008 — 2010',
    logo: 'https://logo.clearbit.com/ucla.edu',
    description: [
      'Focus: Solid State & Photonics',
      'Research: Surface State Density in GaAs Nanopillars',
      'Teaching Assistant: Analog Circuit Design'
    ]
  },
  {
    id: '3',
    school: 'UC San Diego',
    degree: 'B.S. Electrical Engineering',
    period: '2004 — 2008',
    logo: 'https://logo.clearbit.com/ucsd.edu',
    description: [
      'Focus: Photonics',
      'Minor: Japanese Studies',
      'Provost Honors'
    ]
  }
];

const Education = () => {
  return (
    <section id={SectionId.EDUCATION} className="py-24 bg-slate-900 border-t-4 border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl text-slate-100 mb-4">EDUCATION</h2>
          <div className="w-24 h-1 bg-blue-600"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {educationData.map((edu) => (
            <div key={edu.id} className="bg-slate-950 border-2 border-slate-800 p-6 hover:border-blue-500 transition-all hover:-translate-y-2 shadow-[8px_8px_0px_0px_#1e293b]">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 border-4 border-slate-800 overflow-hidden">
                   <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain" />
                </div>
                <GraduationCap className="text-slate-600" size={24} />
              </div>
              <div className="mb-4">
                  <div className="text-sm font-['VT323'] text-blue-500 font-bold mb-1 tracking-wider">{edu.period}</div>
                  <h3 className="text-slate-100 font-bold font-['Press_Start_2P'] text-xs leading-5 min-h-[40px] mb-2">
                    {edu.school}
                  </h3>
                  <div className="text-slate-300 font-bold font-['VT323'] text-lg leading-tight">
                    {edu.degree}
                  </div>
              </div>
              <div className="border-t border-slate-800 my-4"></div>
              <ul className="space-y-2">
                {edu.description.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-400 text-base font-['VT323'] leading-tight">
                    <span className="mt-1.5 w-1 h-1 bg-blue-500 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- COMPONENT: PROJECTS ---

const projects = [
  {
    id: '1',
    title: 'IONSYS Web App',
    role: 'Full Stack',
    description: 'A responsive web application developed for The Medicines Company, used as a primary sales and educational tool for hospital representatives globally.',
    tags: ['JavaScript', 'Responsive', 'Sales Tool'],
    imageUrl: 'https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/ionsys.jpg&w=800&q=80',
    link: '#'
  },
  {
    id: '2',
    title: 'Pokémon Abode',
    role: 'Founder / Dev',
    description: 'Founded and maintained one of the internet’s largest Pokémon fansites. Managed community, content strategy, and server infrastructure.',
    tags: ['Web Dev', 'Community', 'Legacy'],
    imageUrl: 'https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/pa.jpg&w=800&q=80',
    link: '#'
  },
  {
    id: '3',
    title: 'GaAs Nanopillars',
    role: 'Research',
    description: 'Master\'s research on modeling the Surface State Density and Resistivity in n-doped GaAs nanopillars for potential optoelectronic applications.',
    tags: ['Research', 'Physics', 'Modeling'],
    imageUrl: 'https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/gaas.jpg&w=800&q=80',
    link: '#'
  },
  {
    id: '4',
    title: 'Mach Brothers Games',
    role: 'Web Design',
    description: 'Designed a responsive site for an indie game studio using SCSS/Sass. Focused on clean aesthetics and mobile compatibility.',
    tags: ['SCSS', 'Responsive', 'Gaming'],
    imageUrl: 'https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/mbg.jpg&w=800&q=80',
    link: '#'
  }
];

const Projects = () => {
  const [imgErrors, setImgErrors] = useState({});

  const handleImgError = (id) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  return (
    <section id={SectionId.PROJECTS} className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl text-slate-100 mb-4">SELECTED WORKS</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-['VT323']">
             A mix of web development, product initiatives, and technical research.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project) => (
            <div key={project.id} className="group border-4 border-slate-800 hover:border-blue-600 transition-colors bg-slate-900">
              <div className="aspect-video w-full overflow-hidden relative border-b-4 border-slate-800 group-hover:border-blue-600 transition-colors bg-slate-800">
                 <div className="absolute top-0 right-0 p-3 bg-slate-900 border-b-4 border-l-4 border-slate-800 z-10">
                    {project.tags.includes('Research') ? <Database size={20} className="text-slate-400" /> : 
                     project.tags.includes('Hardware') ? <CircuitBoard size={20} className="text-slate-400" /> : <Layout size={20} className="text-slate-400" />}
                 </div>
                 {imgErrors[project.id] ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <div className="text-center">
                            <ImageOff size={48} className="text-slate-700 mx-auto mb-2" />
                            <span className="text-slate-600 font-['VT323']">Image Offline</span>
                        </div>
                    </div>
                 ) : (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100"
                      onError={() => handleImgError(project.id)}
                    />
                 )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-500 font-bold font-['VT323'] text-lg uppercase tracking-wider">{project.role}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3 font-['Press_Start_2P'] text-sm leading-6">{project.title}</h3>
                <p className="text-slate-400 mb-6 text-xl font-['VT323'] leading-tight">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-slate-800">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm font-['VT323'] font-bold border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- COMPONENT: PHOTOGRAPHY ---

const Photography = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const FLICKR_USER = 'dlogsr';
  const FLICKR_ALBUM_ID = '72157633423617771';
  const FLICKR_NSID = '92316068@N00'; 

  const FALLBACK_PHOTOS = [
    { title: "Portfolio Profile", link: "#", media: { m: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/profile.jpg&w=800&q=80" }, date_taken: "", description: "", author: "", tags: "" },
    { title: "Travel & Contact", link: "#", media: { m: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/contact.jpg&w=800&q=80" }, date_taken: "", description: "", author: "", tags: "" },
    { title: "Pokémon Abode Legacy", link: "#", media: { m: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/pa.jpg&w=800&q=80" }, date_taken: "", description: "", author: "", tags: "" },
    { title: "Engineering Research", link: "#", media: { m: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/gaas.jpg&w=800&q=80" }, date_taken: "", description: "", author: "", tags: "" },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    const callbackName = `flickrCallback_${Date.now()}`;
    const script = document.createElement('script');
    script.src = `https://www.flickr.com/services/feeds/photoset.gne?set=${FLICKR_ALBUM_ID}&nsid=${FLICKR_NSID}&lang=en-us&format=json&jsoncallback=${callbackName}`;
    script.async = true;

    window[callbackName] = (data) => {
      if (!mounted) {
        cleanup();
        return;
      }
      if (data && data.items) {
        setPhotos(data.items);
        setLoading(false);
      } else {
        setPhotos(FALLBACK_PHOTOS);
        setLoading(false);
      }
      cleanup();
    };

    script.onerror = (e) => {
      if (mounted) {
        setPhotos(FALLBACK_PHOTOS);
        setLoading(false);
      }
      cleanup();
    };

    document.body.appendChild(script);

    const cleanup = () => {
      delete window[callbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  const getHighResUrl = (url) => {
    if (!url) return '';
    if (url.includes('staticflickr.com')) {
        return url.replace('_m.jpg', '_b.jpg');
    }
    return url;
  };

  const nextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  const closeLightbox = () => setLightboxIndex(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <section id={SectionId.PHOTOGRAPHY} className="py-24 bg-slate-950 border-t-8 border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl text-slate-100 mb-4">PHOTOGRAPHY</h2>
          <div className="w-24 h-1 bg-blue-600 mb-6"></div>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-['VT323']">
             When I'm not building products, I'm usually behind a lens. Exploring the world through analog and digital formats.
          </p>
          <a 
            href={`https://www.flickr.com/photos/${FLICKR_USER}/sets/${FLICKR_ALBUM_ID}`} 
            target="_blank" 
            rel="noreferrer"
            className="mt-6 flex items-center gap-2 text-blue-500 hover:text-white transition-colors font-['VT323'] text-lg"
          >
            VIEW ON FLICKR <ExternalLink size={16} />
          </a>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-['VT323'] text-xl">Developing photos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 border-2 border-red-900 bg-red-900/10 p-8">
            <ImageIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 font-['VT323'] text-xl">Could not load photo stream.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div 
                key={index} 
                className="group relative aspect-square bg-slate-900 border-2 border-slate-800 cursor-pointer overflow-hidden hover:border-blue-500 transition-colors"
                onClick={() => setLightboxIndex(index)}
              >
                <img 
                  src={photo.media.m} 
                  alt={photo.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="text-white drop-shadow-md" size={32} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-50">
            <X size={40} />
          </button>
          
          <button onClick={prevPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors hidden sm:block z-50">
            <ChevronLeft size={48} />
          </button>

          <button onClick={nextPhoto} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors hidden sm:block z-50">
            <ChevronRight size={48} />
          </button>

          <div className="max-w-5xl max-h-[85vh] relative flex flex-col items-center">
            <img 
              src={getHighResUrl(photos[lightboxIndex].media.m)} 
              alt={photos[lightboxIndex].title} 
              className="max-w-full max-h-[75vh] object-contain border-4 border-slate-800 shadow-2xl"
            />
            <div className="mt-4 text-center max-w-2xl">
                <h3 className="text-white font-['VT323'] text-2xl">{photos[lightboxIndex].title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// --- COMPONENT: PRESS ---

const pressItems = [
  {
    title: "Innovation by Design 2025",
    source: "Fast Company",
    description: "Adobe recognized for design innovation under product leadership.",
    link: "https://www.fastcompany.com/91388791/adobe-innovation-by-design-2025",
    imageUrl: "https://images.weserv.nl/?url=https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/wp-cms/uploads/2023/08/p-1-90932158-innovation-by-design-2023.jpg&w=600&q=80",
    icon: <Award size={24} className="text-yellow-500" />
  },
  {
    title: "Photoshop in Your Pocket",
    source: "Adobe MAX 2025",
    description: "Speaker: Creating on iPhone and Android.",
    link: "https://www.adobe.com/max/2025/sessions/photoshop-in-your-pocket-creating-on-iphone-and-an-os322.html",
    imageUrl: "https://images.weserv.nl/?url=https://blog.adobe.com/en/publish/2022/10/18/media_1d2c1d3c05423631988863116562095817294503.jpeg&w=600&q=80",
    icon: <Mic size={24} className="text-blue-500" />
  },
  {
    title: "Interview: Pokémon Abode",
    source: "Johto Times",
    description: "Discussing the legacy of running one of the largest Pokémon communities.",
    link: "https://johto.substack.com/p/interview-with-pokemon-abode?utm_medium=email&action=share",
    imageUrl: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/pa.jpg&w=600&q=80",
    icon: <Newspaper size={24} className="text-purple-500" />
  },
  {
    title: "Photoshop Web Demo",
    source: "YouTube",
    description: "Official demo of Photoshop running in the browser.",
    link: "https://www.youtube.com/watch?v=G_f_1U1edBI",
    imageUrl: "https://img.youtube.com/vi/G_f_1U1edBI/hqdefault.jpg",
    icon: <Video size={24} className="text-red-500" />
  },
  {
    title: "Adobe Live Feature Showcase",
    source: "YouTube",
    description: "Live demonstration of new creative workflows.",
    link: "https://www.youtube.com/watch?v=MDKplRRu0y4&t=6775s",
    imageUrl: "https://img.youtube.com/vi/MDKplRRu0y4/hqdefault.jpg",
    icon: <Video size={24} className="text-red-500" />
  },
  {
    title: "Photoshop on the iPad Book",
    source: "O'Reilly Media",
    description: "Cited in the forward for product contributions.",
    link: "https://www.oreilly.com/library/view/photoshop-on-the/9780138213923/",
    imageUrl: "https://m.media-amazon.com/images/I/71s+5+5+5+L._AC_UF1000,1000_QL80_.jpg",
    icon: <BookOpen size={24} className="text-green-500" />
  },
  {
    title: "Photoshop iPad Camera Raw",
    source: "The Verge",
    description: "Coverage of the launch of Camera Raw support on mobile.",
    link: "https://www.theverge.com/2021/10/12/22722122/adobe-photoshop-ipad-camera-raw-support-coming-soon",
    imageUrl: "https://cdn.vox-cdn.com/thumbor/yM2y7d1v1v1v1v1v1v1v1v1v1v1=/0x0:2040x1360/1200x800/filters:focal(857x517:1183x843)/cdn.vox-cdn.com/uploads/chorus_image/image/70000000/acastro_211011_4780_adobe_photoshop_ipad_0001.0.jpg",
    icon: <ExternalLink size={24} className="text-slate-400" />
  },
  {
    title: "One-Tap Magic on iPad",
    source: "Adobe Blog",
    description: "Deep dive into new mobile-first features.",
    link: "https://blog.adobe.com/en/publish/2022/05/10/photoshop-on-the-ipad-brings-plenty-of-one-tap-magic-into-spring",
    imageUrl: "https://blog.adobe.com/en/publish/2022/05/10/media_1495c25e865f17109789c93717208764268393551.jpeg",
    icon: <ExternalLink size={24} className="text-slate-400" />
  },
  {
    title: "Photoshop Web Announcement",
    source: "YouTube",
    description: "Showcasing the power of Photoshop on the web.",
    link: "https://www.youtube.com/watch?v=mvpN-8Ve3TU",
    imageUrl: "https://img.youtube.com/vi/mvpN-8Ve3TU/hqdefault.jpg",
    icon: <Video size={24} className="text-red-500" />
  },
  {
    title: "Photoshop iPad Updates",
    source: "YouTube",
    description: "Review of key updates and features.",
    link: "https://www.youtube.com/watch?v=TR-CShNslf8",
    imageUrl: "https://img.youtube.com/vi/TR-CShNslf8/hqdefault.jpg",
    icon: <Video size={24} className="text-red-500" />
  }
];

const Press = () => {
  return (
    <section id={SectionId.PRESS} className="py-24 bg-slate-900 border-t-4 border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl text-slate-100 mb-4">PRESS & RECOGNITION</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-['VT323']">
             Selected talks, interviews, and media coverage of my work.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pressItems.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noreferrer"
              className="group block bg-slate-950 border-2 border-slate-800 hover:border-blue-500 transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_#1e293b] hover:shadow-[6px_6px_0px_0px_#2563eb] flex flex-col h-full overflow-hidden"
            >
              <div className="relative w-full aspect-video overflow-hidden border-b-2 border-slate-800 bg-slate-900">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-700">
                        {item.icon}
                    </div>
                  )}
                  {item.source.includes('YouTube') && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-red-600 rounded-full p-2 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                              <Play fill="white" className="text-white ml-1" size={20} />
                          </div>
                      </div>
                  )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                     <div className="text-blue-500 font-['VT323'] uppercase font-bold text-sm tracking-wider">
                        {item.source}
                     </div>
                     <ExternalLink size={16} className="text-slate-600 group-hover:text-blue-500" />
                </div>
                <h3 className="text-slate-100 font-bold mb-3 font-['Press_Start_2P'] text-xs leading-5">
                  {item.title}
                </h3>
                <p className="text-slate-400 font-['VT323'] text-lg leading-tight mt-auto">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- COMPONENT: CONTACT ---

const Contact = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id={SectionId.CONTACT} className="py-24 bg-slate-950 text-white border-t-8 border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
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
          <div className="relative">
             <div className="w-full aspect-[4/3] bg-slate-900 border-4 border-slate-700 p-2 shadow-[8px_8px_0px_0px_#1e293b]">
                <div className="w-full h-full border-2 border-slate-800 overflow-hidden flex items-center justify-center bg-slate-800">
                   {!imgError ? (
                       <img 
                          src="https://images.weserv.nl/?url=http://www.ryandumlao.com/img/contact.jpg&w=800&q=80" 
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
             <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-4 border-l-4 border-blue-600"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- COMPONENT: AIChat ---

const AIChat = () => {
  const { isOpen, setIsOpen, pendingMessage, clearPendingMessage } = useChat();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'model', text: "👋 Hello! I'm Ryan's portfolio assistant.\n\n🤖 I can help you learn more about his background.\n\n❓ Ask me anything!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const processUserMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;

    const userMsgId = Date.now().toString();
    const userMessage = { id: userMsgId, role: 'user', text: text };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', isLoading: true }]);

    try {
      const stream = sendMessageToGemini(userMessage.text);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === modelMsgId 
              ? { ...msg, text: fullText, isLoading: false } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input;
    setInput('');
    await processUserMessage(text);
  };

  useEffect(() => {
    if (pendingMessage && !isTyping) {
      processUserMessage(pendingMessage);
      clearPendingMessage();
    }
  }, [pendingMessage, isTyping, processUserMessage, clearPendingMessage]);

  const formatMessage = (text) => {
    if (!text) return null;
    return text.split('**').map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="text-white font-bold">{part}</strong> : part
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div 
        className={`bg-slate-900 border-4 border-slate-700 shadow-xl w-[95vw] md:w-[50vw] mb-4 transition-all duration-200 origin-bottom-right pointer-events-auto ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-slate-950 p-3 border-b-4 border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-bold font-['VT323'] text-xl">
            <Bot size={20} />
            <span>RYAN DUMLAO AMA</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-[50vh] overflow-y-auto p-4 bg-slate-900 scrollbar-thin">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div 
                  className={`w-8 h-8 border-2 border-slate-700 flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div 
                  className={`max-w-[80%] border-2 border-slate-700 p-3 text-lg font-['VT323'] shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {msg.text ? formatMessage(msg.text) : (msg.isLoading && <span className="animate-pulse">Thinking...</span>)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t-4 border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-slate-950 text-slate-100 text-xl font-['VT323'] px-3 py-2 focus:outline-none border-2 border-slate-700 focus:border-blue-600 placeholder-slate-600"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 border-2 border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </form>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto shadow-lg group flex items-center justify-center w-14 h-14 transition-all duration-200 border-4 border-slate-700 ${
          isOpen ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

// --- APP & ROOT ---

function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
        <Header />
        <main className="relative z-10">
          <Hero />
          <Experience />
          <Education />
          <Projects />
          <Photography />
          <Press />
          <Skills />
          <Contact />
        </main>
        <AIChat />
      </div>
    </ChatProvider>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}