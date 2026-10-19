import React from 'react';
import { channelsData } from '../../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';

export const ChannelsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Social Channels & Platform Presence
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Explore code repositories, design portfolios, visual logs, and creative work across the web.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channelsData.map((channel) => (
          <a
            key={channel.id}
            href={channel.url}
            target="_blank"
            rel="noreferrer"
            className="bg-white rounded-[24px] p-5 border border-neutral-200/70 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                  style={{ background: channel.iconBg }}
                >
                  {channel.name.slice(0, 2)}
                </div>
                <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-500 transition-colors">
                  <ArrowUpRight size={14} />
                </div>
              </div>

              <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-[#DF886F] transition-colors">
                {channel.name}
              </h3>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">{channel.handle}</p>
              <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                {channel.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100 text-xs">
              <span className="font-semibold text-neutral-700">{channel.followers}</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {channel.change}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
