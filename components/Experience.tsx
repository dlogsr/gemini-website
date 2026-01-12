import React from 'react';
import { SectionId, ExperienceItem } from '../types';
import { Briefcase } from 'lucide-react';

const experiences: ExperienceItem[] = [
  {
    id: '0',
    role: 'Group Product Manager',
    company: 'Adobe',
    period: '2018 — Present',
    description: [
      'Group PM (2023-Present): Leading product strategy for Photoshop on the Web and Mobile ecosystems. Managing a team of PMs driving growth and retention.',
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
    description: [
      'Founded one of the internet’s largest and longest-running Pokémon fan communities.',
      'Designed and developed the full stack (LAMP) from scratch, managing high-traffic server infrastructure.',
      'Negotiated advertising partnerships and managed a distributed team of content creators.'
    ]
  }
];

const Experience: React.FC = () => {
  return (
    <section id={SectionId.EXPERIENCE} className="py-24 max-w-5xl mx-auto px-6 bg-slate-950">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-3xl text-slate-100 mb-4">PROFESSIONAL HISTORY</h2>
        <div className="w-24 h-1 bg-blue-600"></div>
      </div>

      <div className="relative space-y-12">
        {/* Center Line */}
        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-800"></div>

        {experiences.map((exp, index) => (
          <div key={exp.id} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Icon Node */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-900 border-4 border-slate-700 z-10 flex items-center justify-center shadow-md">
               <Briefcase size={20} className="text-slate-400" />
            </div>

            {/* Content Card */}
            <div className="pl-24 md:pl-0 w-full md:w-[45%] group">
              <div className="bg-slate-900 border-2 border-slate-800 p-6 hover:border-blue-500 transition-colors shadow-sm hover:shadow-lg hover:shadow-blue-900/20">
                
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
            
            {/* Empty side for layout balance */}
            <div className="hidden md:block w-[45%]"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;