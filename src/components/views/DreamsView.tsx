import React from 'react';
import { dreamsList } from '../../data/portfolioData';

export const DreamsView: React.FC = () => {
  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Dreams & Vision Board
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Long-term aspirations, tech breakthroughs, and life milestones being pursued.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {dreamsList.map((dream) => (
          <div
            key={dream.id}
            className="bg-white rounded-[24px] p-6 border border-neutral-200/70 shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#DF886F] uppercase tracking-wider">
                  {dream.category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E4F4F1] text-[#14B8A6]">
                  Target: {dream.targetDate}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-[#DF886F] transition-colors leading-snug">
                {dream.title}
              </h3>

              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                {dream.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-500 font-medium">Milestone Progress</span>
                <span className="font-bold text-neutral-900">{dream.progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#DF886F] to-[#F59E0B] rounded-full transition-all duration-500"
                  style={{ width: dream.progressPercent + '%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
