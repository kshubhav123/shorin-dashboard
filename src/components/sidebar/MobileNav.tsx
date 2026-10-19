import React from 'react';
import type { NavTab } from '../../types';
import { LayoutDashboard, Folder, Video, Music2, StickyNote } from 'lucide-react';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, badge: '7' },
    { id: 'Projects', label: 'Projects', icon: <Folder size={16} /> },
    { id: 'Videos', label: 'Videos', icon: <Video size={16} /> },
    { id: 'Music', label: 'Music', icon: <Music2 size={16} /> },
    { id: 'Notepad', label: 'Notepad', icon: <StickyNote size={16} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5EEEA]/95 backdrop-blur-md border-t border-[#EFE5DC] px-2 py-1.5 flex items-center justify-around shadow-lg overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={"relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors shrink-0 " +
              (isActive ? 'text-neutral-900 font-bold' : 'text-neutral-400 font-medium')
            }
          >
            <div className="relative">
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
