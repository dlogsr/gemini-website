import React, { useEffect, useState } from 'react';
import { SectionId } from '../types.ts';
import { ExternalLink, Image as ImageIcon, Loader2, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FlickrPhoto {
  title: string;
  link: string;
  media: { m: string };
  date_taken: string;
  description: string;
  author: string;
  tags: string;
}

const Photography: React.FC = () => {
  const [photos, setPhotos] = useState<FlickrPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Album Configuration
  const FLICKR_USER = 'dlogsr';
  const FLICKR_ALBUM_ID = '72157633423617771';
  const FLICKR_NSID = '92316068@N00'; 

  // Fallback photos using Ryan's existing site assets if Flickr API fails
  // This avoids generic stock imagery
  const FALLBACK_PHOTOS: FlickrPhoto[] = [
    { title: "Portfolio Profile", link: "#", media: { m: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/profile.jpg&w=800&q=80" }, date_taken: "", description: "", author: "", tags: "" },
    { title: "Travel & Contact", link: "#", media: { m: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/contact.jpg&w=800&q=80" }, date_taken: "", description: "", author: "", tags: "" },
    // Reusing project images as photographic samples if API fails
    { title: "Pokémon Abode Legacy", link: "#", media: { m: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/pa.jpg&w=800&q=80" }, date_taken: "", description: "", author: "", tags: "" },
    { title: "Engineering Research", link: "#", media: { m: "https://images.weserv.nl/?url=http://www.ryandumlao.com/img/portfolio/gaas.jpg&w=800&q=80" }, date_taken: "", description: "", author: "", tags: "" },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    const callbackName = `flickrCallback_${Date.now()}`;
    const script = document.createElement('script');
    
    // Use standard www.flickr.com endpoint which is often more reliable for public feeds
    script.src = `https://www.flickr.com/services/feeds/photoset.gne?set=${FLICKR_ALBUM_ID}&nsid=${FLICKR_NSID}&lang=en-us&format=json&jsoncallback=${callbackName}`;
    script.async = true;

    (window as any)[callbackName] = (data: any) => {
      if (!mounted) {
        cleanup();
        return;
      }
      
      if (data && data.items) {
        setPhotos(data.items);
        setLoading(false);
      } else {
        console.warn("Invalid Flickr response, using personal fallback.");
        setPhotos(FALLBACK_PHOTOS);
        setLoading(false);
      }
      cleanup();
    };

    script.onerror = (e) => {
      console.warn("Failed to load Flickr script, using personal fallback.", e);
      if (mounted) {
        setPhotos(FALLBACK_PHOTOS);
        setLoading(false);
      }
      cleanup();
    };

    document.body.appendChild(script);

    const cleanup = () => {
      delete (window as any)[callbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  const getHighResUrl = (url: string) => {
    if (!url) return '';
    // Unsplash urls don't use this logic, so check if it's a Flickr URL
    if (url.includes('staticflickr.com')) {
        return url.replace('_m.jpg', '_b.jpg');
    }
    return url; // Return as is for fallbacks
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
    const handleKeyDown = (e: KeyboardEvent) => {
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

      {/* Lightbox Modal */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-50"
          >
            <X size={40} />
          </button>
          
          <button 
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors hidden sm:block z-50"
          >
            <ChevronLeft size={48} />
          </button>

          <button 
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors hidden sm:block z-50"
          >
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

export default Photography;