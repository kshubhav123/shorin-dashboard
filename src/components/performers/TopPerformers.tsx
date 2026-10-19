import React from 'react';
import type { TopPerformer } from '../../types';

interface TopPerformersProps {
  performers: TopPerformer[];
  onSelectPerformer: (performer: TopPerformer) => void;
  onViewMore: () => void;
}

export const TopPerformers: React.FC<TopPerformersProps> = ({
  performers,
  onSelectPerformer,
  onViewMore,
}) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight mb-4">
          Top perfrormers
        </h2>

        <div className="flex flex-col space-y-3.5">
          {performers.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPerformer(item)}
              className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F6EFEA]/60 transition-all duration-200 cursor-pointer group"
            >
              {/* Avatar + Name + Handle */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-200/80 group-hover:scale-105 transition-transform">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-3 md:gap-5">
                  <span className="font-bold text-[13.5px] text-neutral-900 group-hover:text-[#DF886F] transition-colors whitespace-nowrap">
                    {item.name}
                  </span>
                  <span className="text-[12px] text-neutral-400 font-normal">
                    {item.handle}
                  </span>
                </div>
              </div>

              {/* Metric Percentage */}
              <div className="font-bold text-[14px] text-neutral-900 shrink-0 pl-2">
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View More Action */}
      <div className="mt-4 pt-1">
        <button
          onClick={onViewMore}
          className="flex items-center gap-1 font-bold text-[13px] text-neutral-900 hover:text-[#DF886F] transition-colors group"
        >
          <span>View More</span>
          <span className="group-hover:translate-x-1 transition-transform">›</span>
        </button>
      </div>
    </div>
  );
};
