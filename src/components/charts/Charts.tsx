import type { ReactNode } from "react";

const PALETTE = {
  brand: "#16a37c",
  sky: "#3f86f5",
  amber: "#f0a441",
  violet: "#8367f0",
  rose: "#ef6f7b",
} as const;

export type ChartTone = keyof typeof PALETTE;

function buildPath(values: number[], width: number, height: number, padding = 4) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const stepX = (width - padding * 2) / Math.max(values.length - 1, 1);

  const points = values.map((value, index) => {
    const x = padding + index * stepX;
    const y = padding + (1 - (value - min) / span) * (height - padding * 2);
    return [x, y] as const;
  });

  // Smooth the polyline with a light cardinal-style interpolation.
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(2)} ${y0.toFixed(2)}, ${cx.toFixed(2)} ${y1.toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  return { d, points };
}

export function AreaTrend({
  values,
  tone = "brand",
  height = 180,
  width = 560,
  showGrid = true,
  showDots = false,
  className = "",
  uid,
}: {
  values: number[];
  tone?: ChartTone;
  height?: number;
  width?: number;
  showGrid?: boolean;
  showDots?: boolean;
  className?: string;
  uid: string;
}) {
  const color = PALETTE[tone];
  const { d, points } = buildPath(values, width, height, 8);
  const areaPath = `${d} L ${width - 8} ${height} L 8 ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label="Trend chart"
    >
      <defs>
        <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showGrid &&
        [0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            x2={width}
            y1={height * ratio}
            y2={height * ratio}
            stroke="#e3ebec"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}
      <path d={areaPath} fill={`url(#area-${uid})`} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ ["--dash" as string]: "1600", strokeDasharray: 1600 }}
        className="animate-draw"
      />
      {showDots &&
        points.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="3" fill="#fff" stroke={color} strokeWidth="2" />
        ))}
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="4.5"
        fill={color}
        stroke="#fff"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function Sparkline({
  values,
  tone = "brand",
  className = "",
  uid,
}: {
  values: number[];
  tone?: ChartTone;
  className?: string;
  uid: string;
}) {
  const color = PALETTE[tone];
  const { d } = buildPath(values, 120, 36, 3);
  return (
    <svg viewBox="0 0 120 36" className={className} role="img" aria-label="Sparkline" data-uid={uid}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BarSeries({
  values,
  labels,
  tone = "brand",
  height = 150,
  className = "",
}: {
  values: number[];
  labels?: string[];
  tone?: ChartTone;
  height?: number;
  className?: string;
}) {
  const color = PALETTE[tone];
  const max = Math.max(...values);
  return (
    <div className={className}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {values.map((value, index) => (
          <div key={index} className="group/bar flex h-full flex-1 flex-col justify-end">
            <div
              className="bar-grow w-full rounded-t-[5px] transition-opacity duration-200 group-hover/bar:opacity-80"
              style={{
                height: `${Math.max((value / max) * 100, 4)}%`,
                background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
                animationDelay: `${index * 55}ms`,
              }}
              title={String(value)}
            />
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-2 flex gap-1.5">
          {labels.map((label, index) => (
            <span
              key={index}
              className="flex-1 text-center text-[0.6rem] font-medium uppercase tracking-wide text-ink-400"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function DonutGauge({
  value,
  max = 100,
  tone = "brand",
  size = 118,
  label,
  caption,
}: {
  value: number;
  max?: number;
  tone?: ChartTone;
  size?: number;
  label?: ReactNode;
  caption?: string;
}) {
  const color = PALETTE[tone];
  const radius = size / 2 - 9;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(value / max, 1);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={caption ?? "Gauge"}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef3f3" strokeWidth="9" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold text-ink-950">{label ?? value}</span>
        {caption && <span className="text-[0.62rem] uppercase tracking-wide text-ink-400">{caption}</span>}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "brand",
  className = "",
}: {
  value: number;
  tone?: ChartTone;
  className?: string;
}) {
  const color = PALETTE[tone];
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-ink-100 ${className}`}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, background: color }}
      />
    </div>
  );
}

export function MiniColumns({ values, tone = "brand" }: { values: number[]; tone?: ChartTone }) {
  const color = PALETTE[tone];
  const max = Math.max(...values);
  return (
    <div className="flex h-8 items-end gap-[3px]">
      {values.map((value, index) => (
        <span
          key={index}
          className="bar-grow w-[5px] rounded-sm"
          style={{
            height: `${Math.max((value / max) * 100, 8)}%`,
            backgroundColor: color,
            opacity: 0.35 + (index / values.length) * 0.65,
            animationDelay: `${index * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}
