import React from 'react';
import { travelDestinations } from '../../data/portfolioData';
import { MapPin } from 'lucide-react';

export const TravelView: React.FC = () => {
  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Travel & Expeditions
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Places explored, planned journeys, and bucket-list destinations around the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {travelDestinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-[24px] overflow-hidden border border-neutral-200/70 shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-full h-44 overflow-hidden relative bg-neutral-100">
                <img
                  src={dest.coverUrl}
                  alt={dest.place}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={"absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold " +
                    (dest.status === 'Visited'
                      ? 'bg-emerald-500 text-white'
                      : dest.status === 'Planned'
                      ? 'bg-amber-500 text-white'
                      : 'bg-indigo-600 text-white')
                  }
                >
                  {dest.status}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1 text-[#DF886F] text-xs font-bold">
                    <MapPin size={13} />
                    <span>{dest.country}</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">{dest.year}</span>
                </div>

                <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-[#DF886F] transition-colors leading-snug">
                  {dest.place}
                </h3>

                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {dest.highlight}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
