import React from 'react';

export interface TechDefinition {
  name: string;
  brandColor: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  icon: (props: { className?: string; size?: number }) => React.JSX.Element;
}

export const TECHNOLOGIES_LIST: TechDefinition[] = [
  // 1. HTML
  {
    name: 'HTML',
    brandColor: '#E34F26',
    badgeBg: 'rgba(227, 79, 38, 0.12)',
    borderColor: 'rgba(227, 79, 38, 0.3)',
    textColor: '#E34F26',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2L5.8 20.2L12 22L18.2 20.2L20 2H4Z" fill="#E34F26" />
        <path d="M12 3.8V20.2L16.8 18.8L18.3 3.8H12Z" fill="#EF652A" />
        <path d="M12 7.7H7.7L8.1 11.5H12V7.7ZM12 14.5L10.2 14L10 12.6H8.2L8.5 15.6L12 16.6V14.5Z" fill="#EBEBEB" />
        <path d="M12 7.7V11.5H15.9L15.6 14.5L12 15.5V16.6L15.5 15.6L16.3 7.7H12Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  // 2. CSS
  {
    name: 'CSS',
    brandColor: '#1572B6',
    badgeBg: 'rgba(21, 114, 182, 0.12)',
    borderColor: 'rgba(21, 114, 182, 0.3)',
    textColor: '#1572B6',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2L5.8 20.2L12 22L18.2 20.2L20 2H4Z" fill="#1572B6" />
        <path d="M12 3.8V20.2L16.8 18.8L18.3 3.8H12Z" fill="#33A9DC" />
        <path d="M12 7.7H7.7L8.1 11.5H12V7.7ZM12 14.5L10.2 14L10 12.6H8.2L8.5 15.6L12 16.6V14.5Z" fill="#EBEBEB" />
        <path d="M12 7.7V11.5H15.9L15.6 14.5L12 15.5V16.6L15.5 15.6L16.3 7.7H12Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  // 3. JavaScript
  {
    name: 'JavaScript',
    brandColor: '#F7DF1E',
    badgeBg: 'rgba(247, 223, 30, 0.15)',
    borderColor: 'rgba(247, 223, 30, 0.4)',
    textColor: '#CA8A04',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M7 13.5V17C7 18.1 7.7 18.7 8.7 18.7C9.7 18.7 10.3 18.1 10.3 17V13.5H9V16.8C9 17.2 8.8 17.4 8.6 17.4C8.4 17.4 8.2 17.2 8.2 16.8V13.5H7ZM12 17.8C12.4 18.4 13.3 18.8 14.3 18.8C15.8 18.8 16.8 18 16.8 16.7C16.8 15.3 15.8 14.7 14.4 14.1C13.5 13.7 13.1 13.4 13.1 12.8C13.1 12.3 13.6 11.9 14.3 11.9C15 11.9 15.6 12.2 16 12.7L16.9 11.6C16.2 10.8 15.3 10.5 14.3 10.5C12.8 10.5 11.8 11.4 11.8 12.7C11.8 14 12.7 14.6 14.1 15.2C15 15.6 15.5 16 15.5 16.6C15.5 17.2 14.9 17.6 14.2 17.6C13.3 17.6 12.7 17.1 12.3 16.5L12 17.8Z" fill="#1A1A1A" />
      </svg>
    ),
  },
  // 4. TypeScript
  {
    name: 'TypeScript',
    brandColor: '#3178C6',
    badgeBg: 'rgba(49, 120, 198, 0.12)',
    borderColor: 'rgba(49, 120, 198, 0.35)',
    textColor: '#3178C6',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M5.5 8.5H12.5V10.2H9.8V18H8.1V10.2H5.5V8.5ZM13.8 16.8C14.3 17.4 15.2 18 16.4 18C18.1 18 19.3 17.1 19.3 15.5C19.3 13.9 18.1 13.3 16.6 12.6C15.6 12.2 15.2 11.8 15.2 11.2C15.2 10.6 15.7 10.2 16.5 10.2C17.3 10.2 17.9 10.5 18.4 11.1L19.4 9.8C18.7 8.9 17.7 8.5 16.5 8.5C14.8 8.5 13.6 9.5 13.6 11.1C13.6 12.6 14.6 13.3 16.1 14C17.1 14.4 17.7 14.9 17.7 15.5C17.7 16.2 17 16.7 16.2 16.7C15.3 16.7 14.6 16.2 14.1 15.5L13.8 16.8Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  // 5. Tailwind CSS
  {
    name: 'Tailwind CSS',
    brandColor: '#06B6D4',
    badgeBg: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
    textColor: '#0891B2',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6C8.8 6 6.8 7.6 6 10.8C7.2 9.2 8.6 8.6 10.2 9C11.1 9.2 11.8 9.9 12.5 10.6C13.7 11.8 15.1 13.2 18 13.2C21.2 13.2 23.2 11.6 24 8.4C22.8 10 21.4 10.6 19.8 10.2C18.9 10 18.2 9.3 17.5 8.6C16.3 7.4 14.9 6 12 6ZM6 13.2C2.8 13.2 0.8 14.8 0 18C1.2 16.4 2.6 15.8 4.2 16.2C5.1 16.4 5.8 17.1 6.5 17.8C7.7 19 9.1 20.4 12 20.4C15.2 20.4 17.2 18.8 18 15.6C16.8 17.2 15.4 17.8 13.8 17.4C12.9 17.2 12.2 16.5 11.5 15.8C10.3 14.6 8.9 13.2 6 13.2Z" fill="#06B6D4" />
      </svg>
    ),
  },
  // 6. Bootstrap
  {
    name: 'Bootstrap',
    brandColor: '#7952B3',
    badgeBg: 'rgba(121, 82, 179, 0.12)',
    borderColor: 'rgba(121, 82, 179, 0.35)',
    textColor: '#7952B3',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5" fill="#7952B3" />
        <path d="M7 6.5H12.5C14.7 6.5 16 7.6 16 9.2C16 10.4 15.2 11.3 14.1 11.6C15.5 11.9 16.5 13 16.5 14.5C16.5 16.3 15 17.5 12.7 17.5H7V6.5ZM9.6 8.7V11H12.2C13.2 11 13.8 10.4 13.8 9.8C13.8 9.2 13.2 8.7 12.2 8.7H9.6ZM9.6 13V15.3H12.6C13.7 15.3 14.3 14.7 14.3 14.1C14.3 13.5 13.7 13 12.6 13H9.6Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  // 7. shadcn/ui
  {
    name: 'shadcn/ui',
    brandColor: '#000000',
    badgeBg: 'rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    textColor: '#18181B',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#18181B" />
        <line x1="6" y1="18" x2="18" y2="6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="17.5" cy="17.5" r="1.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  // 8. Next.js
  {
    name: 'Next.js',
    brandColor: '#000000',
    badgeBg: 'rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    textColor: '#09090B',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#000000" />
        <path d="M15.5 8.5V15.5M8.5 8.5V15.5L16.2 16.2L8.5 8.5Z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  // 9. React
  {
    name: 'React',
    brandColor: '#087EA4',
    badgeBg: 'rgba(97, 218, 251, 0.15)',
    borderColor: 'rgba(97, 218, 251, 0.45)',
    textColor: '#087EA4',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#087EA4" strokeWidth="1.6" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#087EA4" strokeWidth="1.6" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#087EA4" strokeWidth="1.6" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#087EA4" />
      </svg>
    ),
  },
  // 10. Angular
  {
    name: 'Angular',
    brandColor: '#DD0031',
    badgeBg: 'rgba(221, 0, 49, 0.12)',
    borderColor: 'rgba(221, 0, 49, 0.35)',
    textColor: '#DD0031',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 5.3L4.4 17.5L12 22L19.6 17.5L21 5.3L12 2Z" fill="#DD0031" />
        <path d="M12 2V22L19.6 17.5L21 5.3L12 2Z" fill="#C3002F" />
        <path d="M12 6.5L7.8 16.5H9.8L10.6 14.5H13.4L14.2 16.5H16.2L12 6.5ZM12.8 12.8H11.2L12 10.7L12.8 12.8Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  // 11. Node.js
  {
    name: 'Node.js',
    brandColor: '#5FA04E',
    badgeBg: 'rgba(95, 160, 78, 0.12)',
    borderColor: 'rgba(95, 160, 78, 0.35)',
    textColor: '#3C7030',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.5L20 7.1V16.9L12 21.5L4 16.9V7.1L12 2.5Z" fill="#5FA04E" />
        <path d="M12 6V18M8 8.5L12 11L16 8.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  // 12. Express.js
  {
    name: 'Express.js',
    brandColor: '#303030',
    badgeBg: 'rgba(48, 48, 48, 0.1)',
    borderColor: 'rgba(48, 48, 48, 0.25)',
    textColor: '#262626',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#2E2E2E" />
        <path d="M5.5 8H10V9.6H7.3V11.2H9.5V12.8H7.3V14.4H10V16H5.5V8ZM11.5 16L14 12L11.7 8H13.6L14.9 10.4L16.2 8H18.1L15.8 12L18.3 16H16.4L14.9 13.5L13.4 16H11.5Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  // 13. MongoDB
  {
    name: 'MongoDB',
    brandColor: '#47A248',
    badgeBg: 'rgba(71, 162, 72, 0.12)',
    borderColor: 'rgba(71, 162, 72, 0.35)',
    textColor: '#2E7D32',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C11.5 3 6 8.8 6 13.6C6 17.5 8.7 20.8 11.5 21.8L12 22L12.5 21.8C15.3 20.8 18 17.5 18 13.6C18 8.8 12.5 3 12 2Z" fill="#47A248" />
        <path d="M12 2V22C12.5 21.8 18 17.5 18 13.6C18 8.8 12.5 3 12 2Z" fill="#3FA037" />
        <path d="M12 4.5V19.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  // 14. Supabase
  {
    name: 'Supabase',
    brandColor: '#3ECF8E',
    badgeBg: 'rgba(62, 207, 142, 0.14)',
    borderColor: 'rgba(62, 207, 142, 0.4)',
    textColor: '#059669',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12.8 2.3C12.4 1.8 11.6 1.9 11.4 2.6L8.1 11.6C7.9 12.2 8.4 12.8 9.1 12.8H15.2L11.2 21.7C10.8 22.2 11.6 22.8 12 22.3L20.5 13C21 12.4 20.6 11.5 19.8 11.5H13.7L16.2 3.8C16.4 3.2 15.9 2.6 15.2 2.6L12.8 2.3Z" fill="#3ECF8E" />
      </svg>
    ),
  },
  // 15. Editor.js
  {
    name: 'Editor.js',
    brandColor: '#388AE5',
    badgeBg: 'rgba(56, 138, 229, 0.12)',
    borderColor: 'rgba(56, 138, 229, 0.35)',
    textColor: '#2563EB',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5" fill="#388AE5" />
        <path d="M6 7H18V9H6V7ZM6 11H14V13H6V11ZM6 15H18V17H6V15Z" fill="#FFFFFF" />
        <path d="M16 11L18 13L16 15" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  // 16. Quill.js
  {
    name: 'Quill.js',
    brandColor: '#F15025',
    badgeBg: 'rgba(241, 80, 37, 0.12)',
    borderColor: 'rgba(241, 80, 37, 0.35)',
    textColor: '#EA580C',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 3.5C18 3 13 4 9 9C6.5 12.1 6 15.5 6 18L4 20.5H7.5C10 20.5 13.5 20 16.5 17C21 12.5 21.5 6.5 19.5 3.5Z" fill="#F15025" />
        <path d="M6 18L13 11" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  // 17. React-Quill
  {
    name: 'React-Quill',
    brandColor: '#0EA5E9',
    badgeBg: 'rgba(14, 165, 233, 0.12)',
    borderColor: 'rgba(14, 165, 233, 0.35)',
    textColor: '#0284C7',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#0EA5E9" />
        <path d="M17 5C15.8 4.5 11.5 5.5 8 9.5C5.8 12 5.5 15 5.5 17L4 19H7C9.5 19 12.5 18.5 15 16C18.5 12.5 19 7.5 17 5Z" fill="#FFFFFF" />
        <circle cx="16" cy="16" r="2" fill="#38BDF8" />
      </svg>
    ),
  },
  // 18. Vercel
  {
    name: 'Vercel',
    brandColor: '#000000',
    badgeBg: 'rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    textColor: '#171717',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L22 20.5H2L12 3Z" fill="#171717" />
      </svg>
    ),
  },
  // 19. Render
  {
    name: 'Render',
    brandColor: '#46E3B7',
    badgeBg: 'rgba(70, 227, 183, 0.15)',
    borderColor: 'rgba(70, 227, 183, 0.45)',
    textColor: '#0D9488',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5" fill="#1E293B" />
        <path d="M7 16V8C7 7.4 7.4 7 8 7H12C14.2 7 16 8.8 16 11C16 13.2 14.2 15 12 15H9V17H16" stroke="#46E3B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Quick lookup map for performance
export const TECH_MAP: Record<string, TechDefinition> = TECHNOLOGIES_LIST.reduce(
  (acc, item) => {
    acc[item.name.toLowerCase()] = item;
    return acc;
  },
  {} as Record<string, TechDefinition>
);

export function getTechInfo(name: string): TechDefinition {
  const normalized = name.toLowerCase().trim();
  if (TECH_MAP[normalized]) {
    return TECH_MAP[normalized];
  }
  // Generic fallback with clean code icon
  return {
    name,
    brandColor: '#64748B',
    badgeBg: 'rgba(100, 116, 139, 0.12)',
    borderColor: 'rgba(100, 116, 139, 0.3)',
    textColor: '#475569',
    icon: ({ className = 'w-3.5 h-3.5' }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
}

interface TechBadgeProps {
  name: string;
  onRemove?: () => void;
  size?: 'sm' | 'md';
  isDarkTheme?: boolean;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  name,
  onRemove,
  size = 'md',
  isDarkTheme = false,
}) => {
  const tech = getTechInfo(name);
  const IconComponent = tech.icon;

  if (isDarkTheme) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium tracking-tight transition-colors ${
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
        } bg-white/10 text-white/90 border border-white/15 backdrop-blur-xs`}
      >
        <span className="shrink-0 flex items-center justify-center">
          <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        </span>
        <span className="truncate">{tech.name}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-0.5 text-white/60 hover:text-white p-0.5 rounded hover:bg-white/20 transition-colors"
          >
            ×
          </button>
        )}
      </span>
    );
  }

  return (
    <span
      style={{
        backgroundColor: tech.badgeBg,
        borderColor: tech.borderColor,
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium tracking-tight ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className="shrink-0 flex items-center justify-center">
        <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </span>
      <span style={{ color: tech.textColor }} className="font-semibold truncate">
        {tech.name}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 text-neutral-400 hover:text-neutral-700 p-0.5 rounded hover:bg-black/5 transition-colors leading-none"
        >
          ×
        </button>
      )}
    </span>
  );
};
