import React from 'react';
import { Briefcase, Calendar, Building2, Target } from 'lucide-react';

export const MetricCards: React.FC = () => {
  const cards = [
    {
      id: 'profession',
      category: 'Profession',
      value: 'Software Developer',
      subtext: 'Turning ideas into real products.',
      icon: <Briefcase size={18} className="text-[#14B8A6]" strokeWidth={2} />,
      badgeBg: 'bg-[#E3F5F2]',
    },
    {
      id: 'experience',
      category: 'Experience',
      value: '3+ Years',
      subtext: 'Learning · Building · Growing',
      icon: <Calendar size={18} className="text-[#3B82F6]" strokeWidth={2} />,
      badgeBg: 'bg-[#E8F2FF]',
    },
    {
      id: 'company',
      category: 'Company',
      value: 'Aurum Analytica',
      subtext: 'Data × Analytics × Impact',
      icon: <Building2 size={18} className="text-[#8B5CF6]" strokeWidth={2} />,
      badgeBg: 'bg-[#F2ECFB]',
    },
    {
      id: 'goal',
      category: 'Goal',
      value: 'Full Stack Developer',
      subtext: 'React.js | Node.js | Beyond',
      icon: <Target size={18} className="text-[#F97316]" strokeWidth={2} />,
      badgeBg: 'bg-[#FFF1E8]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-[22px] p-5 sm:p-5.5 flex flex-col justify-between border border-[#EFE5DC]/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 group select-none min-h-[145px]"
        >
          {/* Top Row: Icon Badge & Category */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl ${card.badgeBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
            >
              {card.icon}
            </div>
            <span className="text-[13px] text-neutral-500 font-medium tracking-tight">
              {card.category}
            </span>
          </div>

          {/* Bottom: Main Value & Subtext */}
          <div className="flex flex-col">
            <h3 className="font-bold text-[17px] sm:text-[18px] text-neutral-900 tracking-tight leading-snug group-hover:text-[#DF886F] transition-colors">
              {card.value}
            </h3>
            <p className="text-[11.5px] text-neutral-400 font-normal mt-1 leading-tight tracking-tight">
              {card.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
