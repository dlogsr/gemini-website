import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SectionId, SkillMetric } from '../types';

const data: SkillMetric[] = [
  { subject: 'Strategy', A: 90, fullMark: 100 },
  { subject: 'Software', A: 85, fullMark: 100 },
  { subject: 'Hardware', A: 95, fullMark: 100 },
  { subject: 'Analytics', A: 80, fullMark: 100 },
  { subject: 'Leadership', A: 85, fullMark: 100 },
  { subject: 'Research', A: 75, fullMark: 100 },
];

const Skills: React.FC = () => {
  return (
    <section id={SectionId.SKILLS} className="py-24 bg-slate-950 border-y-4 border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text Content */}
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

          {/* Right: Chart */}
          <div className="order-1 md:order-2 h-[450px] w-full bg-slate-900 border-4 border-slate-700 p-6 relative shadow-[8px_8px_0px_0px_#1e293b]">
            <div className="absolute -top-4 -right-4 bg-slate-800 border-2 border-slate-600 px-4 py-1 z-10 font-['VT323'] text-lg font-bold text-blue-400">
              SKILL_MATRIX
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
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

export default Skills;