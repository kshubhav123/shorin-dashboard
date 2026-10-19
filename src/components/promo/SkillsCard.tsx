import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export const SkillsCard: React.FC = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skills = [
    {
      name: 'Next.js',
      category: 'Framework',
      bg: 'bg-black text-white border-neutral-800 hover:border-neutral-500',
      icon: (
        <svg viewBox="0 0 180 180" className="w-5 h-5 fill-current">
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
      bg: 'bg-[#20232A] text-[#61DAFB] border-[#303846] hover:border-[#61DAFB]/50',
      icon: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5 fill-[#61DAFB]">
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
      bg: 'bg-[#132A1D] text-[#13AA52] border-[#1C422E] hover:border-[#13AA52]/50',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#13AA52]">
          <path d="M12 0C11.66 0 11.37.17 11.23.44 9.87 3.12 5.5 12.16 5.5 16.5c0 4.14 2.91 7.5 6.5 7.5s6.5-3.36 6.5-7.5c0-4.34-4.37-13.38-5.73-16.06A.92.92 0 0 0 12 0zm.04 1.77c.88 1.83 4.96 10.45 4.96 14.73 0 3.14-2.19 5.7-5 5.7v-20.43z"/>
        </svg>
      ),
    },
    {
      name: 'Node.js',
      category: 'Runtime',
      bg: 'bg-[#182C1B] text-[#5FA04E] border-[#25462A] hover:border-[#5FA04E]/50',
      icon: (
        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-[#5FA04E]">
          <path d="M16 2.5L3.5 9.7v14.6L16 31.5l12.5-7.2V9.7L16 2.5zm0 3.3l9.6 5.5v11L16 27.8l-9.6-5.5v-11L16 5.8z"/>
        </svg>
      ),
    },
    {
      name: 'Express.js',
      category: 'Backend',
      bg: 'bg-[#222226] text-white border-[#383840] hover:border-neutral-400',
      icon: (
        <span className="font-bold text-[13px] font-mono tracking-tighter leading-none">
          ex
        </span>
      ),
    },
  ];

  const handleIconClick = () => {
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#61DAFB', '#5FA04E', '#13AA52', '#F59E0B'],
      });
    } catch {}
  };

  return (
    <div className="flex flex-col items-start lg:items-end justify-center py-2">
      {/* Subtle small section label */}
      <span className="text-[12px] text-neutral-400 font-medium uppercase tracking-wider mb-2">
        Skill Set
      </span>

      {/* 5 Standalone Skill Icons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {skills.map((skill) => (
          <div
            key={skill.name}
            onClick={handleIconClick}
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border shadow-xs transition-all duration-300 hover:scale-115 hover:-translate-y-1 cursor-pointer select-none group ${skill.bg}`}
            title={`${skill.name} (${skill.category})`}
          >
            {skill.icon}

            {/* Hover Tooltip */}
            {hoveredSkill === skill.name && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-semibold rounded-md shadow-md whitespace-nowrap pointer-events-none z-30 animate-in fade-in zoom-in-95">
                {skill.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

