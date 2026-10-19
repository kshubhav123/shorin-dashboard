import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkillSetCardProps {
  onViewAll?: () => void;
}

export const SkillSetCard: React.FC<SkillSetCardProps> = ({ onViewAll }) => {
  const skills = [
    {
      name: 'React',
      bg: 'bg-[#0A2E36] border-[#13444F]',
      icon: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-6 h-6 fill-[#61DAFB]">
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
      name: 'Next.js',
      bg: 'bg-[#111111] border-neutral-800',
      icon: (
        <svg viewBox="0 0 180 180" className="w-5 h-5 fill-current">
          <mask height="180" id="mask_next_skill" maskUnits="userSpaceOnUse" width="180" x="0" y="0">
            <circle cx="90" cy="90" fill="black" r="90"/>
          </mask>
          <g mask="url(#mask_next_skill)">
            <circle cx="90" cy="90" fill="black" r="90"/>
            <path d="M149.508 157.438L69.147 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z" fill="white"/>
            <path d="M115.003 54H127.116V126H115.003V54Z" fill="white"/>
          </g>
        </svg>
      ),
    },
    {
      name: 'Node.js',
      bg: 'bg-[#12311A] border-[#1B4626]',
      icon: (
        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-[#5FA04E]">
          <path d="M16 2.5L3.5 9.7v14.6L16 31.5l12.5-7.2V9.7L16 2.5zm0 3.3l9.6 5.5v11L16 27.8l-9.6-5.5v-11L16 5.8z"/>
        </svg>
      ),
    },
    {
      name: 'MongoDB',
      bg: 'bg-[#0E2B1D] border-[#153F2B]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#13AA52]">
          <path d="M12 0C11.66 0 11.37.17 11.23.44 9.87 3.12 5.5 12.16 5.5 16.5c0 4.14 2.91 7.5 6.5 7.5s6.5-3.36 6.5-7.5c0-4.34-4.37-13.38-5.73-16.06A.92.92 0 0 0 12 0zm.04 1.77c.88 1.83 4.96 10.45 4.96 14.73 0 3.14-2.19 5.7-5 5.7v-20.43z"/>
        </svg>
      ),
    },
    {
      name: 'Git',
      bg: 'bg-[#3A1410] border-[#521E19]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#F05032]">
          <path d="M21.62 10.44L13.56 2.38a1.95 1.95 0 0 0-2.76 0L8.74 4.44l3.5 3.5a2.32 2.32 0 0 1 2.94 2.94l3.37 3.37a2.32 2.32 0 0 1 2.35 3.86 2.32 2.32 0 0 1-3.28-3.28l-3.23-3.23v-5.2l-3.37 3.37a2.32 2.32 0 0 1-2.94 2.94l-3.68-3.68-2 2a1.95 1.95 0 0 0 0 2.76l8.06 8.06a1.95 1.95 0 0 0 2.76 0l8.06-8.06a1.95 1.95 0 0 0 0-2.76z"/>
        </svg>
      ),
    },
    {
      name: 'VS Code',
      bg: 'bg-[#0B253D] border-[#11385C]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#007ACC]">
          <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.27a.997.997 0 0 0-.005 1.415L4.82 12 .322 15.317a.997.997 0 0 0 .005 1.414l1.322 1.212a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63c.47.43 1.135.545 1.705.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.94a1.5 1.5 0 0 0-.85-1.353zm-4.94 15.02L8.98 12l9.23-5.607v11.214z"/>
        </svg>
      ),
    },
  ];

  const handleTriggerConfetti = () => {
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.65 },
        colors: ['#61DAFB', '#5FA04E', '#13AA52', '#F05032', '#007ACC'],
      });
    } catch {}
  };

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-[#EFE5DC]/80 shadow-soft select-none h-full">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              SKILL SET
            </span>
            <h3 className="font-display font-bold text-[18px] text-neutral-900 tracking-tight leading-snug">
              Technologies & Tools
            </h3>
          </div>

          <button
            onClick={onViewAll}
            className="text-[12px] font-semibold text-[#14B8A6] hover:text-[#0D9488] flex items-center gap-1 transition-colors group cursor-pointer pt-1"
          >
            <span>View All Skills</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 7 Skill Icon Squircles with labels */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-2 items-center justify-between pt-1">
          {skills.map((skill) => (
            <div
              key={skill.name}
              onClick={handleTriggerConfetti}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${skill.bg} border flex items-center justify-center text-white shadow-2xs group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-200`}
                title={skill.name}
              >
                {skill.icon}
              </div>
              <span className="text-[11px] text-neutral-600 font-medium mt-1.5 tracking-tight group-hover:text-neutral-900 transition-colors truncate max-w-[56px] text-center">
                {skill.name}
              </span>
            </div>
          ))}

          {/* +3 More Badge */}
          <div
            onClick={onViewAll}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E8F6F3] border border-[#D5ECE8] text-[#14B8A6] font-bold text-[13px] flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-200">
              +3
            </div>
            <span className="text-[11px] text-neutral-600 font-medium mt-1.5 tracking-tight group-hover:text-neutral-900 transition-colors">
              More
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Lightbulb Tip Callout */}
      <div className="bg-[#EAF7F4] border border-[#D5ECE8] rounded-xl p-3 flex items-center gap-2.5 mt-5 shadow-2xs">
        <div className="w-6 h-6 rounded-full bg-[#14B8A6]/15 flex items-center justify-center shrink-0">
          <Lightbulb size={14} className="text-[#14B8A6]" />
        </div>
        <p className="text-[11.5px] text-neutral-600 font-normal leading-tight tracking-tight">
          Always exploring new technologies and tools to build better solutions.
        </p>
      </div>
    </div>
  );
};

export default SkillSetCard;
