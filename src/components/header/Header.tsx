import React from 'react';
import { Bell, Settings, Sun, Menu, Sparkles } from 'lucide-react';
import type { NavTab } from '../../types';

interface HeaderProps {
  currentTab: NavTab;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenAIAssistant?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  unreadCount,
  onOpenNotifications,
  onOpenSettings,
  onOpenAIAssistant,
  onToggleMobileMenu,
}) => {
  return (
    <div className="flex items-center justify-between pt-1 pb-1 w-full gap-3">
      {/* Left Area: Mobile Menu Hamburger + Brand / Tab Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button (Visible only on screens < md) */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-neutral-700 hover:text-neutral-900 bg-[#FAF7F4] hover:bg-[#F2ECE5] border border-[#EAE2D9] transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          title="Open Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu size={19} strokeWidth={2.2} />
        </button>

        {/* Brand Icon & Name on Mobile */}
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4 items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight text-neutral-900">
            Crowz
          </span>
          <span className="text-neutral-300">/</span>
        </div>

        {/* Tab Title */}
        <div className="min-w-0">
          <h1 className="font-display font-bold text-lg sm:text-2xl md:text-3xl text-neutral-900 tracking-tight truncate">
            {currentTab}
          </h1>
        </div>
      </div>

      {/* Top Right Header Controls: AI Assistant, Bell, Settings, Theme */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
        {/* Crowz AI Voice Assistant Trigger */}
        {onOpenAIAssistant && (
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#14B8A6]/10 to-[#DF886F]/10 hover:from-[#14B8A6]/20 hover:to-[#DF886F]/20 text-[#0F766E] border border-[#14B8A6]/30 transition-all cursor-pointer shadow-2xs active:scale-95 group"
            title="Open Crowz AI Voice Assistant"
          >
            <Sparkles size={15} className="text-[#14B8A6] group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-xs tracking-tight">AI Voice</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse hidden sm:inline-block" />
          </button>
        )}

        {/* Notification Bell with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          title={`${unreadCount} notifications`}
        >
          <Bell size={18} strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Settings Gear */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings size={18} strokeWidth={1.8} />
        </button>

        {/* Theme Icon */}
        <button
          onClick={() => {}}
          className="p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Theme Toggle"
        >
          <Sun size={18} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
};

export default Header;
