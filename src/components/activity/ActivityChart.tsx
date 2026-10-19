import React, { useState } from 'react';
import type { ActivityDataPoint } from '../../types';
import { DateFilter } from './DateFilter';

interface ActivityChartProps {
  data: ActivityDataPoint[];
  selectedRange: string;
  onSelectRange: (range: string) => void;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  selectedRange,
  onSelectRange,
}) => {
  // Default hover to day 05 (matching screenshot)
  const defaultHoverIndex = data.findIndex((d) => d.isPeak) >= 0 
    ? data.findIndex((d) => d.isPeak) 
    : 4;
  const [hoverIndex, setHoverIndex] = useState<number>(defaultHoverIndex);

  const yLabels = ['40k', '30k', '20k', '10k', '0 k'];
  const maxY = 40000;
  
  // Coordinates mapping
  const width = 460;
  const height = 150;
  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + (1 - d.value / maxY) * chartHeight;
    return { x, y, ...d };
  });

  // Generate smooth SVG Catmull-Rom or cubic Bezier path
  const generateSmoothPath = (pts: typeof points) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const pathD = generateSmoothPath(points);
  const activePoint = points[hoverIndex] || points[4];

  return (
    <div className="flex flex-col">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight">
          Activity
        </h2>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[11px] text-neutral-400 font-normal">
            Data updates every 3 hours
          </span>
          <DateFilter selectedRange={selectedRange} onSelectRange={onSelectRange} />
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative w-full overflow-visible select-none py-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Horizontal Gridlines & Y-axis labels */}
          {yLabels.map((label, idx) => {
            const yPos = paddingTop + (idx / (yLabels.length - 1)) * chartHeight;
            return (
              <g key={label} className="opacity-90">
                <text
                  x={paddingLeft - 8}
                  y={yPos + 3.5}
                  textAnchor="end"
                  className="text-[11px] fill-neutral-400 font-sans font-normal"
                >
                  {label}
                </text>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={width - paddingRight}
                  y2={yPos}
                  stroke="#EFEBE6"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Smooth Golden Spline Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points on Hover */}
          {points.map((pt, idx) => (
            <g
              key={pt.day}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(idx)}
            >
              {/* Invisible touch target */}
              <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />
              
              {/* Point dot highlight */}
              {hoverIndex === idx && (
                <>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#F59E0B"
                    className="animate-pulse"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="2.5"
                    fill="#FFFFFF"
                  />
                </>
              )}
            </g>
          ))}

          {/* X-axis Labels */}
          {points.map((pt, idx) => (
            <text
              key={pt.day}
              x={pt.x}
              y={height - 2}
              textAnchor="middle"
              className={"text-[11px] font-sans transition-colors cursor-pointer " +
                (hoverIndex === idx
                  ? 'fill-neutral-900 font-bold'
                  : 'fill-neutral-400 font-normal')
              }
              onMouseEnter={() => setHoverIndex(idx)}
            >
              {pt.day}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip Box matching Screenshot */}
        {activePoint && (
          <div
            className="absolute pointer-events-none transition-all duration-200 z-20"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100 + 4}%`,
              transform: 'translate(-50%, 0)',
            }}
          >
            <div className="bg-white rounded-xl shadow-floating px-3.5 py-2 text-center border border-neutral-100/80 min-w-[90px]">
              <div className="font-bold text-[13px] text-neutral-900 leading-tight">
                {activePoint.isPeak ? '32 210' : activePoint.formattedValue}
              </div>
              <div className="text-[10px] text-neutral-400 font-normal tracking-tight whitespace-nowrap mt-0.5">
                {activePoint.ratePerHour || 'Views / hour'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
