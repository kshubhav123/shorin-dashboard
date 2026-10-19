import React from 'react';
import { clientTestimonials } from '../../data/portfolioData';
import { Star } from 'lucide-react';

export const CommentsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn py-2">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Client Feedback & Endorsements
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Direct recommendations from founders, design directors, and tech executives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clientTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-[24px] p-6 border border-neutral-200/70 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic mb-6">
                "{testimonial.content}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-neutral-200">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-neutral-900 leading-snug">
                  {testimonial.name}
                </h4>
                <p className="text-[11px] text-neutral-400 font-normal">
                  {testimonial.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
