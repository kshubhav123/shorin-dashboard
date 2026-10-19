import React from 'react';
import { X } from 'lucide-react';
import type { UserProfile } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSwitchProfile: (profileKey: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSwitchProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-[28px] w-full max-w-md shadow-card border border-neutral-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#F5EEEA] p-5 flex items-center justify-between border-b border-[#EFE5DC]/80">
          <h3 className="font-display font-bold text-lg text-neutral-900">
            Portfolio Profile Switcher
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-neutral-500">
            Switch profile persona or preview portfolio custom attributes:
          </p>

          <div className="space-y-2.5">
            <div
              onClick={() => {
                onSwitchProfile('robert');
                onClose();
              }}
              className={"p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all " +
                (currentProfile.name === 'Robert Grant'
                  ? 'border-[#DF886F] bg-[#FAF4EF]'
                  : 'border-neutral-200 hover:border-neutral-300')
              }
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Robert"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-display font-bold text-sm text-neutral-900">Robert Grant</h4>
                  <p className="text-xs text-neutral-400">Marketing Director & Strategist</p>
                </div>
              </div>
              {currentProfile.name === 'Robert Grant' && (
                <span className="w-5 h-5 rounded-full bg-[#DF886F] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
              )}
            </div>

            <div
              onClick={() => {
                onSwitchProfile('shorin');
                onClose();
              }}
              className={"p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all " +
                (currentProfile.name === 'Shorin'
                  ? 'border-[#14B8A6] bg-[#E4F4F1]'
                  : 'border-neutral-200 hover:border-neutral-300')
              }
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Shorin"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-display font-bold text-sm text-neutral-900">Shorin</h4>
                  <p className="text-xs text-neutral-400">Full Stack Engineer & Designer</p>
                </div>
              </div>
              {currentProfile.name === 'Shorin' && (
                <span className="w-5 h-5 rounded-full bg-[#14B8A6] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
