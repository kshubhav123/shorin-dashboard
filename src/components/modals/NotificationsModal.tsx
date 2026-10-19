import React from 'react';
import { X, Bell } from 'lucide-react';
import type { NotificationItem } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-[28px] w-full max-w-md shadow-card border border-neutral-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#F5EEEA] p-5 flex items-center justify-between border-b border-[#EFE5DC]/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#EF4444] text-white flex items-center justify-center">
              <Bell size={14} />
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-900">
              Activity & Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 divide-y divide-neutral-100 max-h-[360px] overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={"p-3 rounded-xl transition-colors " + (notif.unread ? 'bg-[#FAF4EF]' : 'hover:bg-neutral-50')}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs text-neutral-900 leading-snug">
                  {notif.title}
                </h4>
                <span className="text-[10px] text-neutral-400 shrink-0 font-sans">
                  {notif.time}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 leading-normal">
                {notif.description}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#DF886F] text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
