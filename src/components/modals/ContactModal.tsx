import React, { useState } from 'react';
import { X, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '../../types';
import confetti from 'canvas-confetti';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, profile }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#DF886F', '#F59E0B', '#14B8A6'],
      });
    } catch (err) {}
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-[28px] w-full max-w-lg shadow-card border border-neutral-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with background accent */}
        <div className="bg-[#F5EEEA] p-6 pb-5 flex items-center justify-between border-b border-[#EFE5DC]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-xs">
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 leading-tight">
                Get In Touch with {profile.name}
              </h3>
              <p className="text-xs text-neutral-500 font-normal">
                {profile.availableForWork ? '🟢 Currently available for projects' : profile.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors shadow-2xs"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="font-display font-bold text-xl text-neutral-900">Message Sent!</h4>
              <p className="text-sm text-neutral-500 mt-1 max-w-xs">
                Thanks for reaching out! I will review your proposal and reply within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Project Details</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your product vision, timeline, and goals..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 focus:border-[#DF886F] focus:outline-hidden transition-colors resize-none"
                />
              </div>

              {/* Direct Info Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1 bg-[#F6EFEA] px-2.5 py-1 rounded-full">
                  <Mail size={12} className="text-[#DF886F]" /> {profile.email}
                </span>
                <span className="flex items-center gap-1 bg-[#F6EFEA] px-2.5 py-1 rounded-full">
                  <MapPin size={12} className="text-[#14B8A6]" /> {profile.location}
                </span>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-[#DF886F] text-white font-bold text-sm tracking-tight flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <span>Send Message</span>
                  <Send size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
