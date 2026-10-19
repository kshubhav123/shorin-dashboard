import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 fill-current' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.2.302-.777.98-.953 1.18-.175.201-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.235-.244-.587-.493-.507-.677-.517l-.578-.01c-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.482 1.079 2.912 1.23 3.113.15.201 2.123 3.242 5.144 4.547.719.311 1.28.497 1.718.636.722.23 1.379.197 1.9.12.58-.087 1.78-.727 2.03-1.43.25-.704.25-1.307.175-1.43-.075-.126-.276-.201-.577-.352zM12.04 2C6.544 2 2.08 6.464 2.08 11.96c0 1.838.499 3.56 1.365 5.043L2 22l5.138-1.347a9.914 9.914 0 0 0 4.902 1.267c5.496 0 9.96-4.464 9.96-9.96 0-5.496-4.464-9.96-9.96-9.96z" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 fill-current' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 fill-current' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 1 0 0 3.32 1.66 1.66 0 0 0 0-3.32z" />
  </svg>
);

const UpworkIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 fill-current' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-3.882 0-6.04 2.658-6.666 4.954-1.258-1.87-2.096-4.103-2.42-5.972H5.704v6.945c0 1.936-1.575 3.51-3.51 3.51H1.5v3.42h.694c3.826 0 6.93-3.104 6.93-6.93v-2.07c.361 1.547 1.055 3.518 2.257 5.253l-1.92 9.079h3.793l1.196-5.655c1.193.754 2.651 1.246 4.111 1.246 3.883 0 7.039-3.156 7.039-7.039s-3.156-7.721-7.039-7.721z"/>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 fill-none stroke-current' }) => (
  <svg viewBox="0 0 24 24" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export interface SocialAccount {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  handle: string;
  badgeBg: string;
  tag: string;
}

const socialAccounts: SocialAccount[] = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/6395320368',
    icon: WhatsAppIcon,
    handle: '+91 63953 20368',
    badgeBg: '#25D366',
    tag: 'Quick Chat',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/kshubhav123',
    icon: GithubIcon,
    handle: 'kshubhav123',
    badgeBg: '#24292E',
    tag: 'Repositories',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/shubhav-kumar-936b4a1a4/',
    icon: LinkedinIcon,
    handle: 'shubhav-kumar',
    badgeBg: '#0A66C2',
    tag: 'Professional',
  },
  {
    label: 'Upwork',
    href: 'https://www.upwork.com/freelancers/~015c875459fdbe0d21?mp_source=share',
    icon: UpworkIcon,
    handle: 'Freelancer',
    badgeBg: '#14A800',
    tag: 'Hire Me',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/its_shubhav',
    icon: InstagramIcon,
    handle: '@its_shubhav',
    badgeBg: '#E1306C',
    tag: 'Personal',
  },
];

interface ChannelsSectionProps {
  onAccountClick?: (account: SocialAccount) => void;
}

export const ChannelsSection: React.FC<ChannelsSectionProps> = ({ onAccountClick }) => {
  const handleItemClick = (account: SocialAccount) => {
    if (onAccountClick) {
      onAccountClick(account);
    } else {
      window.open(account.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="py-3">
      {/* Subtle Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[12px] text-neutral-400 font-medium uppercase tracking-wider">
          Social Media Links
        </span>
      </div>

      {/* 5 Social Media Link Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {socialAccounts.map((account) => {
          const IconComponent = account.icon;
          return (
            <a
              key={account.label}
              href={account.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (onAccountClick) {
                  e.preventDefault();
                  handleItemClick(account);
                }
              }}
              className="bg-[#FAF6F3] hover:bg-[#F5EEEA] border border-[#EFE5DC] rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 group no-underline select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Round Icon Badge */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform shrink-0"
                  style={{ backgroundColor: account.badgeBg }}
                >
                  <IconComponent className="w-4 h-4 text-white" />
                </div>

                {/* Name & Handle */}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[14px] text-neutral-900 leading-tight group-hover:text-[#DF886F] transition-colors truncate">
                    {account.label}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-normal mt-0.5 truncate">
                    {account.handle}
                  </span>
                </div>
              </div>

              {/* External Arrow Indicator */}
              <div className="w-6 h-6 rounded-full bg-white border border-[#EFE5DC] flex items-center justify-center text-neutral-400 group-hover:text-[#DF886F] group-hover:border-[#DF886F]/40 transition-colors shrink-0 ml-2">
                <ArrowUpRight size={13} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

