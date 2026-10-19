import React from 'react';

interface HeroBannerProps {
  name?: string;
  onExploreClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ name = 'Shubhav Kumar' }) => {
  // Determine dynamic greeting based on client time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  return (
    <div className="relative w-full rounded-[26px] overflow-hidden bg-gradient-to-r from-[#E5F5F2] via-[#E2F3F0] to-[#CFEBE7] border border-[#D5ECE8] shadow-soft min-h-[175px] md:min-h-[190px] flex flex-col justify-center p-6 sm:p-7 md:p-8">
      {/* Right Background Scenic Image with Smooth Gradient Blend */}
      <div 
        className="absolute inset-y-0 right-0 w-full sm:w-2/3 md:w-1/2 lg:w-3/5 pointer-events-none opacity-90 mix-blend-multiply sm:mix-blend-normal"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')`,
          backgroundPosition: 'right 25% center',
          backgroundSize: 'cover',
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.95) 60%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.95) 60%, black 100%)',
        }}
      >
        {/* Subtle sun overlay glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#E2F3F0]/20 to-transparent" />
      </div>

      {/* Content Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-full">
        {/* Left Side: Greeting & Headline */}
        <div className="flex flex-col max-w-lg">
          <div className="flex items-center gap-1.5 text-neutral-600 text-[13px] sm:text-[14px] font-medium tracking-tight">
            <span>👋</span>
            <span>{getGreeting()}</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-[34px] text-neutral-900 tracking-tight leading-tight mt-0.5">
            {name}
          </h1>

          <p className="text-[13px] sm:text-[14px] text-neutral-600 font-normal mt-1 flex items-center gap-1.5">
            <span>Always building something better.</span>
            <span>💡</span>
          </p>
        </div>

        {/* Center / Right Quote in Desktop View */}
        <div className="hidden md:flex flex-col items-start lg:items-center justify-center lg:pr-24 lg:pl-6 bg-white/40 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-3 sm:p-0 rounded-2xl">
          <p className="italic font-serif text-[13.5px] lg:text-[14.5px] text-neutral-700 tracking-tight leading-snug">
            “Small steps every day<br className="hidden sm:inline" /> lead to big results.”
          </p>
          <div className="w-7 h-[3px] rounded-full bg-[#14B8A6] mt-1.5" />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
