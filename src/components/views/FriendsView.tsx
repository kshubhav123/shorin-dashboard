import React from 'react';
import { friendsList } from '../../data/portfolioData';
import { MessageSquare } from 'lucide-react';

export const FriendsView: React.FC = () => {
  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
            Friend List & Network
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Close friends, co-developers, collaborators, and mentors in the developer circle.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {friendsList.map((friend) => (
          <div
            key={friend.id}
            className="bg-white rounded-[24px] p-5 border border-neutral-200/70 shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-neutral-200">
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                  <span
                    className={"absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white " +
                      (friend.status === 'Online'
                        ? 'bg-emerald-500'
                        : friend.status === 'In Code Session'
                        ? 'bg-amber-500'
                        : friend.status === 'Traveling'
                        ? 'bg-cyan-500'
                        : 'bg-neutral-300')
                    }
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-neutral-900 group-hover:text-[#DF886F] transition-colors leading-snug">
                    {friend.name}
                  </h3>
                  <span className="text-xs text-neutral-400 font-normal block">{friend.socialHandle}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Role:</span>
                  <span className="font-medium text-neutral-800">{friend.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Connection:</span>
                  <span className="px-2 py-0.5 bg-[#FAF4EF] text-[#DF886F] font-bold text-[10px] rounded-md">
                    {friend.connectionType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Status:</span>
                  <span className="font-medium text-neutral-800">{friend.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-medium">
                {friend.mutualProjects} mutual projects
              </span>
              <button className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 transition-colors">
                <MessageSquare size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
