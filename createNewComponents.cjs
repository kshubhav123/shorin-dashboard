const fs = require('fs');

// 1. AboutStats.tsx
const aboutStatsCode = `import React from 'react';
import { ArrowUp, Briefcase, Award, Building2 } from 'lucide-react';

interface AboutStatsProps {
  onStatClick?: (field: string) => void;
}

export const AboutStats: React.FC<AboutStatsProps> = () => {
  const items = [
    {
      id: 'profession',
      label: 'Profession',
      value: 'Software Developer',
      tag: 'Full Stack',
      icon: <Briefcase size={12} className="text-white" />,
      description: 'Building modern web apps & scalable backend services',
    },
    {
      id: 'experience',
      label: 'Experience',
      value: '3+ Years',
      tag: 'Industry Exp',
      icon: <Award size={12} className="text-white" />,
      description: 'Production software engineering & systems development',
    },
    {
      id: 'company',
      label: 'Company',
      value: 'Aurum Analytica',
      tag: 'Current Role',
      icon: <Building2 size={12} className="text-white" />,
      description: 'Analytics, data intelligence & software engineering',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 py-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col select-none group cursor-default"
        >
          {/* Label + Teal Upward Indicator */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[13px] md:text-[14px] text-neutral-500 font-normal">
              {item.label}
            </span>
            <div className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-xs">
              <ArrowUp size={10} strokeWidth={3} />
            </div>
          </div>

          {/* Bold Main Text Value */}
          <div className="font-bold text-xl sm:text-2xl lg:text-[26px] text-neutral-900 tracking-tight leading-tight group-hover:text-[#DF886F] transition-colors">
            {item.value}
          </div>

          {/* Subtitle description */}
          <p className="text-[11px] text-neutral-400 font-normal mt-1 leading-tight">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};
`;

// 2. SkillsCard.tsx
const skillsCardCode = `import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export const SkillsCard: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const skills = [
    {
      name: 'Next.js',
      category: 'Framework',
      bg: 'bg-black text-white border-neutral-800',
      icon: (
        <svg viewBox="0 0 180 180" className="w-4 h-4 fill-current">
          <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0">
            <circle cx="90" cy="90" fill="black" r="90"/>
          </mask>
          <g mask="url(#mask0_next)">
            <circle cx="90" cy="90" fill="black" r="90"/>
            <path d="M149.508 157.438L69.147 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z" fill="white"/>
            <path d="M115.003 54H127.116V126H115.003V54Z" fill="white"/>
          </g>
        </svg>
      ),
    },
    {
      name: 'React',
      category: 'UI Library',
      bg: 'bg-[#20232A] text-[#61DAFB] border-[#303846]',
      icon: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-4 h-4 fill-[#61DAFB]">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      ),
    },
    {
      name: 'MongoDB',
      category: 'Database',
      bg: 'bg-[#132A1D] text-[#13AA52] border-[#1C422E]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#13AA52]">
          <path d="M12 0C11.66 0 11.37.17 11.23.44 9.87 3.12 5.5 12.16 5.5 16.5c0 4.14 2.91 7.5 6.5 7.5s6.5-3.36 6.5-7.5c0-4.34-4.37-13.38-5.73-16.06A.92.92 0 0 0 12 0zm.04 1.77c.88 1.83 4.96 10.45 4.96 14.73 0 3.14-2.19 5.7-5 5.7v-20.43z"/>
        </svg>
      ),
    },
    {
      name: 'Node.js',
      category: 'Runtime',
      bg: 'bg-[#182C1B] text-[#5FA04E] border-[#25462A]',
      icon: (
        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-[#5FA04E]">
          <path d="M16 2.5L3.5 9.7v14.6L16 31.5l12.5-7.2V9.7L16 2.5zm0 3.3l9.6 5.5v11L16 27.8l-9.6-5.5v-11L16 5.8z"/>
        </svg>
      ),
    },
    {
      name: 'Express.js',
      category: 'Backend',
      bg: 'bg-[#222226] text-white border-[#383840]',
      icon: (
        <span className="font-bold text-[11px] font-mono tracking-tighter leading-none">
          ex
        </span>
      ),
    },
  ];

  const handleCardClick = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#61DAFB', '#5FA04E', '#13AA52', '#F59E0B'],
      });
    } catch {}
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative overflow-hidden bg-[#F6EFEA] rounded-[24px] p-5 sm:p-6 flex flex-col justify-between shadow-soft border border-[#EFE5DC]/80 hover:shadow-card transition-all duration-300 group cursor-pointer min-h-[160px]"
    >
      {/* Top soft curve decoration badge */}
      <div className="absolute top-2 right-28 w-14 h-4 rounded-full bg-[#3FB5A8]/30 -rotate-12 blur-[1px] pointer-events-none" />

      {/* Header & Title */}
      <div className="flex items-start justify-between z-10">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 leading-snug tracking-tight">
            Skill Set
          </h3>
          <p className="text-[11px] sm:text-[12px] text-neutral-500 font-normal mt-0.5 tracking-tight">
            Core Production Tech Stack
          </p>
        </div>

        {/* Small Pill Tag */}
        <span className="px-2.5 py-0.5 bg-[#44A99D] text-white text-[10px] font-bold rounded-full shadow-xs">
          5 Core Skills
        </span>
      </div>

      {/* 5 Requested Skill Icons (Next.js, React, MongoDB, Node.js, Express.js) */}
      <div className="flex flex-wrap items-center gap-2 pt-3 z-10">
        {skills.map((skill) => (
          <div
            key={skill.name}
            onMouseEnter={() => setActiveSkill(skill.name)}
            onMouseLeave={() => setActiveSkill(null)}
            className={"flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-xs transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 cursor-pointer " + skill.bg}
            title={skill.name + " (" + skill.category + ")"}
          >
            <div className="shrink-0 flex items-center justify-center">
              {skill.icon}
            </div>
            <span className="font-bold text-[12px] tracking-tight">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/stats/AboutStats.tsx', aboutStatsCode, 'utf8');
fs.writeFileSync('src/components/promo/SkillsCard.tsx', skillsCardCode, 'utf8');
console.log('Created AboutStats.tsx and SkillsCard.tsx');
