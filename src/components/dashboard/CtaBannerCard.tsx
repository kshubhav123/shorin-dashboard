import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CtaBannerCardProps {
  onContactClick?: () => void;
}

export const CtaBannerCard: React.FC<CtaBannerCardProps> = ({ onContactClick }) => {
  return (
    <div className="relative w-full rounded-[26px] overflow-hidden bg-gradient-to-r from-[#E7F6F3] via-[#E2F4F0] to-[#D5EFEA] border border-[#D5ECE8] shadow-soft p-6 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 select-none">
      {/* Background Soft Wave / Ripple Artwork */}
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#3FB5A8]/10 blur-2xl pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#14B8A6]/10 blur-3xl pointer-events-none" />

      {/* Left Content */}
      <div className="relative z-10 flex flex-col items-start max-w-lg">
        <h3 className="font-display font-bold text-2xl sm:text-[26px] lg:text-[28px] text-neutral-900 tracking-tight leading-snug">
          Let's build something amazing together.
        </h3>

        <p className="text-[13px] sm:text-[14px] text-neutral-600 font-normal mt-2 leading-relaxed">
          Open to new opportunities, collaborations and exciting projects.
        </p>

        <button
          onClick={onContactClick}
          className="mt-5 px-6 py-2.5 rounded-full bg-[#0F3B37] hover:bg-[#164E48] text-white text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 shadow-soft hover:shadow-card hover:scale-103 active:scale-98 transition-all duration-200 cursor-pointer group"
        >
          <span>Get in Touch</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Right Modern Desk / Laptop Workspace Illustration */}
      <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end shrink-0">
        <div className="relative w-64 h-36 sm:w-72 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-tr from-white/60 to-white/90 backdrop-blur-xs border border-white/80 p-3 shadow-soft flex items-center justify-center">
          {/* Desk illustration setup with SVG elements */}
          <div className="relative flex items-center justify-center gap-3">
            {/* Potted Plant */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-emerald-700">
                🌿
              </div>
              <div className="w-5 h-4 bg-[#DF886F]/40 rounded-b-md mt-0.5" />
            </div>

            {/* Laptop in Center */}
            <div className="relative w-28 h-20 bg-neutral-900 rounded-t-lg border-2 border-neutral-700 p-1.5 shadow-md flex flex-col justify-between">
              {/* Code Screen Mockup */}
              <div className="bg-[#1E2029] w-full h-full rounded p-1 flex flex-col gap-1 overflow-hidden">
                <div className="flex gap-1 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <div className="w-4/5 h-1 bg-[#14B8A6]/70 rounded" />
                <div className="w-3/5 h-1 bg-[#61DAFB]/70 rounded" />
                <div className="w-1/2 h-1 bg-amber-400/70 rounded" />
              </div>
              {/* Keyboard base */}
              <div className="absolute -bottom-2 -left-2 -right-2 h-2 bg-neutral-300 rounded-b-md shadow-xs" />
            </div>

            {/* Coffee Mug & Notebook */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px]">
                ☕
              </div>
              <div className="w-6 h-7 rounded bg-blue-100 border border-blue-200 shadow-2xs rotate-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaBannerCard;
