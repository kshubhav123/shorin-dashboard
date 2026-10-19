import React from 'react';
import type { VideoPlatform } from '../../types';

export const YouTubeIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-4 h-4',
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-4 h-4',
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-4 h-4',
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export interface PlatformConfig {
  platform: VideoPlatform;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
  icon: (size?: number) => React.ReactNode;
}

export const PLATFORM_CONFIGS: Record<VideoPlatform, PlatformConfig> = {
  YouTube: {
    platform: 'YouTube',
    label: 'YouTube',
    color: '#FF0000',
    bgColor: 'bg-[#FF0000]/15',
    borderColor: 'border-[#FF0000]/30',
    badgeBg: 'bg-[#FF0000] text-white',
    textColor: 'text-[#FF0000]',
    icon: (size = 15) => <YouTubeIcon size={size} className="text-[#FF0000]" />,
  },
  Instagram: {
    platform: 'Instagram',
    label: 'Instagram',
    color: '#E1306C',
    bgColor: 'bg-[#E1306C]/15',
    borderColor: 'border-[#E1306C]/30',
    badgeBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white',
    textColor: 'text-[#E1306C]',
    icon: (size = 15) => <InstagramIcon size={size} className="text-[#E1306C]" />,
  },
  Facebook: {
    platform: 'Facebook',
    label: 'Facebook',
    color: '#1877F2',
    bgColor: 'bg-[#1877F2]/15',
    borderColor: 'border-[#1877F2]/30',
    badgeBg: 'bg-[#1877F2] text-white',
    textColor: 'text-[#1877F2]',
    icon: (size = 15) => <FacebookIcon size={size} className="text-[#1877F2]" />,
  },
};

export const PlatformBadge: React.FC<{ platform: VideoPlatform; showIcon?: boolean }> = ({
  platform,
  showIcon = true,
}) => {
  const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS.YouTube;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs ${config.badgeBg}`}
    >
      {showIcon && (
        <span className="shrink-0 flex items-center justify-center">
          {platform === 'YouTube' ? (
            <YouTubeIcon size={13} className="text-white" />
          ) : platform === 'Instagram' ? (
            <InstagramIcon size={13} className="text-white" />
          ) : (
            <FacebookIcon size={13} className="text-white" />
          )}
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
};

export const VideoStatusBadge: React.FC<{ status?: 'Pending' | 'In Progress' | 'Completed'; size?: 'sm' | 'md' }> = ({
  status = 'Pending',
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[9.5px]' : 'px-2.5 py-1 text-[10.5px]';

  if (status === 'Completed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0 ${padding}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Completed</span>
      </span>
    );
  }

  if (status === 'In Progress') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 shrink-0 ${padding}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>In Progress</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0 ${padding}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      <span>Pending</span>
    </span>
  );
};

