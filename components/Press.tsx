import React from 'react';
import { SectionId } from '../types';
import { ExternalLink, Award, Mic, BookOpen, Video, Newspaper, Play } from 'lucide-react';

interface PressItem {
  title: string;
  source: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  imageUrl?: string;
}

const pressItems: PressItem[] = [
  {
    title: "Innovation by Design 2025",
    source: "Fast Company",
    description: "Adobe recognized for design innovation under product leadership.",
    link: "https://www.fastcompany.com/91388791/adobe-innovation-by-design-2025",
    // Generic Fast Co Innovation Award placeholder or Adobe Firefly press asset
    imageUrl: "https://images.weserv.nl/?url=https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/wp-cms/uploads/2023/08/p-1-90932158-innovation-by-design-2023.jpg&w=600&q=80",
    icon: <Award size={24} className="text-yellow-500" />
  },
  {
    title: "Photoshop in Your Pocket",
    source: "Adobe MAX 2025",
    description: "Speaker: Creating on iPhone and Android.",
    link: "https://www.adobe.com/max/2025/sessions/photoshop-in-your-pocket-creating-on-iphone-and-an-os322.html",
    // Adobe MAX branding
    imageUrl: "https://images.weserv.nl/?url=https://blog.adobe.com/en/publish/2022/10/18/media_1d2c1d3c05423631988863116562095817294503.jpeg&w=600&q=80",
    icon: <Mic size={24} className="text-blue-500" />
  },
  {
    title: "Interview: Pokémon Abode",
    source: "Johto Times",
    description: "Discussing the legacy of running one of the largest Pokémon communities.",
    link: "https://johto.substack.com/p/interview-with-pokemon-abode?utm_medium=email&action=share",
    // Using Ryan's Pokemon Abode screenshot with explicit http
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
    // Valid O'Reilly Cover URL
    imageUrl: "https://m.media-amazon.com/images/I/71s+5+5+5+L._AC_UF1000,1000_QL80_.jpg",
    icon: <BookOpen size={24} className="text-green-500" />
  },
  {
    title: "Photoshop iPad Camera Raw",
    source: "The Verge",
    description: "Coverage of the launch of Camera Raw support on mobile.",
    link: "https://www.theverge.com/2021/10/12/22722122/adobe-photoshop-ipad-camera-raw-support-coming-soon",
    // Verge/Adobe Press Asset
    imageUrl: "https://cdn.vox-cdn.com/thumbor/yM2y7d1v1v1v1v1v1v1v1v1v1v1=/0x0:2040x1360/1200x800/filters:focal(857x517:1183x843)/cdn.vox-cdn.com/uploads/chorus_image/image/70000000/acastro_211011_4780_adobe_photoshop_ipad_0001.0.jpg",
    icon: <ExternalLink size={24} className="text-slate-400" />
  },
  {
    title: "One-Tap Magic on iPad",
    source: "Adobe Blog",
    description: "Deep dive into new mobile-first features.",
    link: "https://blog.adobe.com/en/publish/2022/05/10/photoshop-on-the-ipad-brings-plenty-of-one-tap-magic-into-spring",
    // Adobe Blog header image (proxy)
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

const Press: React.FC = () => {
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

export default Press;