import React from 'react';
import { Bell, Settings, Sun } from 'lucide-react';
import type { NavTab } from '../../types';

interface HeaderProps {
  currentTab: NavTab;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  unreadCount,
  onOpenNotifications,
  onOpenSettings,
}) => {
  return (
    <div className="flex items-center justify-between pt-1 pb-1 w-full">
      <div>
        {currentTab !== 'Dashboard' && (
          <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 tracking-tight">
            {currentTab}
          </h1>
        )}
      </div>

      {/* Top Right Header Controls: Bell (with 1 badge), Settings, Sun */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notification Bell with Red Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          title={`${unreadCount} notifications`}
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs">
            1
          </span>
        </button>

        {/* Settings Gear */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings size={18} strokeWidth={1.8} />
        </button>

        {/* Sun / Theme Icon */}
        <button
          onClick={() => {}}
          className="p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Toggle Light/Dark Mode"
        >
          <Sun size={18} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
};

