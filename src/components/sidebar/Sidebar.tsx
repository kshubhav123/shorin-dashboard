import React from 'react';
import type { NavTab, UserProfile } from '../../types';
import {
  LayoutDashboard,
  Folder,
  Video,
  Music2,
  StickyNote,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile;
  onOpenContact: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenContact,
  onOpenSettings,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, badge: '7' },
    { id: 'Projects', label: 'Projects', icon: <Folder size={16} /> },
    { id: 'Videos', label: 'Videos', icon: <Video size={16} /> },
    { id: 'Music', label: 'Music', icon: <Music2 size={16} /> },
    { id: 'Notepad', label: 'Notepad', icon: <StickyNote size={16} /> },
  ];

  return (
    <aside className="w-full md:w-56 lg:w-60 bg-[#F4EFEA] p-5 lg:p-6 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-[#EAE2D9] min-h-screen select-none">
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2.5 mb-7 cursor-pointer group" 
          onClick={() => onSelectTab('Dashboard')}
        >
          <div className="grid grid-cols-2 gap-1 w-4.5 h-4.5 items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-neutral-900 group-hover:text-[#DF886F] transition-colors">
            Crowz
          </span>
        </div>

        {/* Profile Card */}
        <div 
          onClick={onOpenSettings}
          className="flex flex-col items-center text-center mb-7 group cursor-pointer"
          title="Click to customize profile"
        >
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#F97316] to-[#F59E0B] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            {profile.availableForWork && (
              <span 
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10B981] border-2 border-[#F4EFEA] rounded-full" 
                title="Online / Available"
              />
            )}
          </div>
          <h2 className="font-display font-bold text-[15px] sm:text-[16px] text-neutral-900 tracking-tight leading-snug group-hover:text-[#DF886F] transition-colors">
            {profile.name}
          </h2>
          <p className="text-[12px] text-neutral-400 font-medium mt-0.5 tracking-tight">
            {profile.role}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={"flex items-center justify-between text-left px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer " + 
                  (isActive
                    ? 'text-neutral-900 font-semibold bg-[#E3F3EF] shadow-2xs'
                    : 'text-neutral-500 font-normal hover:text-neutral-900 hover:bg-[#EFE7E0]/60')
                }
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#14B8A6]' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span className="text-[13.5px] tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-[#EAE2D9] mt-6">
        <button
          onClick={onOpenContact}
          className="flex items-center gap-2.5 text-neutral-500 hover:text-neutral-900 transition-colors group text-sm font-medium w-full text-left cursor-pointer px-1 py-1"
        >
          <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center transition-transform group-hover:scale-110">
            <LogOut size={12} className="rotate-180" />
          </div>
          <span className="text-[13px] text-neutral-600 group-hover:text-neutral-900 transition-colors">
            Log out
          </span>
        </button>
      </div>
    </aside>
  );
};
