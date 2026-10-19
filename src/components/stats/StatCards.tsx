import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { StatItem } from '../../types';

interface StatCardsProps {
  stats: StatItem[];
  onStatClick?: (stat: StatItem) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, onStatClick }) => {
  const [activeStatId, setActiveStatId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-8 lg:gap-12 py-2">
      {stats.map((stat) => {
        const isUp = stat.trend === 'up';
        return (
          <div
            key={stat.id}
            onClick={() => {
              setActiveStatId(activeStatId === stat.id ? null : stat.id);
              if (onStatClick) onStatClick(stat);
            }}
            className="flex flex-col cursor-pointer group select-none"
          >
            {/* Stat Label & Trend Pill Indicator */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] md:text-[14px] text-neutral-500 font-normal">
                {stat.label}
              </span>
              <div
                className={"w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 " + 
                  (isUp ? 'bg-[#14B8A6]' : 'bg-[#EF4444]')
                }
              >
                {isUp ? (
                  <ArrowUp size={10} strokeWidth={3} />
                ) : (
                  <ArrowDown size={10} strokeWidth={3} />
                )}
              </div>
            </div>

            {/* Metric Value */}
            <div className="font-bold text-2xl md:text-3xl text-neutral-900 tracking-tight font-sans group-hover:text-[#DF886F] transition-colors">
              {stat.value}
            </div>

            {/* Subtle interactive subtitle */}
            {activeStatId === stat.id && stat.description && (
              <p className="text-[11px] text-neutral-400 mt-1 animate-fadeIn">
                {stat.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
