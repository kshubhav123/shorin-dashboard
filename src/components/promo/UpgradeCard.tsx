import React from 'react';
import confetti from 'canvas-confetti';
import type { UserProfile } from '../../types';

interface UpgradeCardProps {
  profile: UserProfile;
  onHireClick: () => void;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({ profile, onHireClick }) => {
  const handleNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#DF886F', '#F59E0B', '#14B8A6', '#EF4444'],
      });
    } catch (err) {
      // ignore
    }
    onHireClick();
  };

  return (
    <div 
      onClick={onHireClick}
      className="relative overflow-hidden bg-[#F6EFEA] rounded-[24px] p-5 md:p-6 flex items-center justify-between shadow-soft border border-[#EFE5DC]/80 hover:shadow-card transition-all duration-300 group cursor-pointer"
    >
      {/* Top soft curve decoration badge */}
      <div className="absolute top-2 right-28 w-14 h-4 rounded-full bg-[#3FB5A8]/30 -rotate-12 blur-[1px] pointer-events-none" />

      {/* Left Content Area */}
      <div className="flex flex-col justify-between z-10 max-w-[170px] sm:max-w-[200px]">
        {/* Miniature Avatar badge at top */}
        <div className="w-6 h-6 rounded-full overflow-hidden border border-white shadow-xs mb-3">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 leading-snug tracking-tight">
          Upgrade <span className="text-neutral-900">Your</span>
          <br />
          <span className="text-neutral-900">Crowd</span>
        </h3>

        {/* Subtitle */}
        <p className="text-[11px] sm:text-[12px] text-neutral-500 font-normal mt-1 tracking-tight">
          Pro plan for better results
        </p>
      </div>

      {/* Right Concentric Radial Arcs Graphic + NOW button */}
      <div className="relative shrink-0 flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full transform transition-transform duration-500 group-hover:rotate-6"
        >
          {/* Outer Arc (Teal) */}
          <path
            d="M 20 60 A 40 40 0 0 1 100 60"
            fill="none"
            stroke="#44A99D"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Middle Arc (Brownish Slate) */}
          <path
            d="M 30 60 A 30 30 0 0 1 90 60"
            fill="none"
            stroke="#8A7366"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Inner Arc (Golden Yellow/Orange) */}
          <path
            d="M 40 60 A 20 20 0 0 1 80 60"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Left arc extension for subtle design flair matching screenshot */}
          <path
            d="M 35 60 A 25 25 0 0 1 35 85"
            fill="none"
            stroke="#44A99D"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 45 60 A 15 15 0 0 1 45 80"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>

        {/* Center circular red NOW button */}
        <button
          onClick={handleNowClick}
          className="absolute right-2 bottom-4 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E84E36] hover:bg-[#D43F29] text-white font-bold text-[11px] tracking-wider uppercase flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 active:scale-95 z-20"
        >
          NOW
        </button>
      </div>
    </div>
  );
};
