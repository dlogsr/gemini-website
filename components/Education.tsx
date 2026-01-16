import React from 'react';
import { SectionId, EducationItem } from '../types.ts';
import { GraduationCap } from 'lucide-react';

const educationData: EducationItem[] = [
  {
    id: '1',
    school: 'UCLA Anderson School of Management',
    degree: 'Master of Business Administration (MBA)',
    period: '2016 — 2018',
    logo: './assets/img/logos/anderson.png',
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
    logo: './assets/img/logos/ucla.png',
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
    logo: './assets/img/logos/ucsd.png',
    description: [
      'Focus: Photonics',
      'Minor: Japanese Studies',
      'Provost Honors'
    ]
  }
];

const Education: React.FC = () => {
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

export default Education;