import React from 'react';
import { ArrowUp, Building2 } from 'lucide-react';

export const AboutStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 py-2">
      {/* 1. Profession */}
      <div className="flex flex-col select-none group cursor-default">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[13px] md:text-[14px] text-neutral-500 font-normal">
            Profession
          </span>
          <div className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-xs">
            <ArrowUp size={10} strokeWidth={3} />
          </div>
        </div>
        <div className="font-bold text-xl sm:text-2xl lg:text-[25px] text-neutral-900 tracking-tight leading-tight group-hover:text-[#DF886F] transition-colors">
          Software Developer
        </div>
      </div>

      {/* 2. Experience */}
      <div className="flex flex-col select-none group cursor-default">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[13px] md:text-[14px] text-neutral-500 font-normal">
            Experience
          </span>
          <div className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-xs">
            <ArrowUp size={10} strokeWidth={3} />
          </div>
        </div>
        <div className="font-bold text-xl sm:text-2xl lg:text-[25px] text-neutral-900 tracking-tight leading-tight group-hover:text-[#DF886F] transition-colors">
          3+ Years
        </div>
      </div>

      {/* 3. Company with Company Icon */}
      <div className="flex flex-col select-none group cursor-default">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[13px] md:text-[14px] text-neutral-500 font-normal">
            Company
          </span>
          <div className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-xs">
            <ArrowUp size={10} strokeWidth={3} />
          </div>
        </div>
        <div className="flex items-center gap-2 font-bold text-xl sm:text-2xl lg:text-[25px] text-neutral-900 tracking-tight leading-tight group-hover:text-[#DF886F] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-[#F5EEEA] border border-[#EFE5DC] flex items-center justify-center text-[#DF886F] shrink-0 shadow-2xs">
            <Building2 size={16} strokeWidth={2.2} />
          </div>
          <span>Aurum Analytica</span>
        </div>
      </div>
    </div>
  );
};

