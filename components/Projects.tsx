import React, { useState } from 'react';
import { SectionId, Project } from '../types';
import { Camera, CircuitBoard, Layout, Database, ImageOff } from 'lucide-react';

const projects: Project[] = [
  {
    id: '1',
    title: 'IONSYS Web App',
    role: 'Full Stack',
    description: 'A responsive web application developed for The Medicines Company, used as a primary sales and educational tool for hospital representatives globally.',
    tags: ['JavaScript', 'Responsive', 'Sales Tool'],
    // Using image proxy for HTTPS compatibility with explicit http protocol
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

const Projects: React.FC = () => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
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
              
              {/* Image */}
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
              
              {/* Content */}
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

export default Projects;