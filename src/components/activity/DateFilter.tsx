import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DateFilterProps {
  selectedRange: string;
  onSelectRange: (range: string) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ selectedRange, onSelectRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const ranges = [
    '01-07 May',
    '08-14 May',
    '15-21 May',
    '22-28 May',
    'Last 30 Days',
    'All Time',
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E5DFD9] rounded-full text-xs font-medium text-neutral-800 shadow-2xs hover:border-neutral-400 transition-colors"
      >
        <span>{selectedRange}</span>
        <ChevronDown size={13} className={"text-neutral-500 transition-transform " + (isOpen ? 'rotate-180' : '')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white border border-[#EFE8E2] rounded-xl shadow-card py-1.5 z-30 animate-fadeIn">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => {
                onSelectRange(range);
                setIsOpen(false);
              }}
              className={"w-full text-left px-3 py-1.5 text-xs font-medium transition-colors " +
                (selectedRange === range
                  ? 'bg-[#F6EFEA] text-neutral-900 font-bold'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900')
              }
            >
              {range}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
