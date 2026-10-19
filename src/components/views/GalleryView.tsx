import React from 'react';
import { galleryItems } from '../../data/portfolioData';
import { Calendar } from 'lucide-react';

export const GalleryView: React.FC = () => {
  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Life & Tech Gallery
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Moments captured from developer setups, mountain travels, community hackathons, and celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[24px] overflow-hidden border border-neutral-200/70 shadow-soft hover:shadow-card transition-all group flex flex-col"
          >
            <div className="w-full h-52 sm:h-60 overflow-hidden bg-neutral-100 relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                {item.category}
              </span>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1.5">
                  <Calendar size={12} />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-[#DF886F] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
