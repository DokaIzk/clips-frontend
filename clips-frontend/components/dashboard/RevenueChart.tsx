"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

type Range = "7D" | "30D" | "90D";

interface DataPoint {
  label: string;
  value: number; // in dollars
}

const DATA: Record<Range, DataPoint[]> = {
  "7D": [
    { label: "MON", value: 820 },
    { label: "TUE", value: 940 },
    { label: "WED", value: 880 },
    { label: "THU", value: 1240 },
    { label: "FRI", value: 1100 },
    { label: "SAT", value: 1380 },
    { label: "SUN", value: 1290 },
  ],
  "30D": [
    { label: "W1", value: 3200 },
    { label: "W2", value: 4100 },
    { label: "W3", value: 3750 },
    { label: "W4", value: 5400 },
  ],
  "90D": [
    { label: "JAN", value: 9800 },
    { label: "FEB", value: 12400 },
    { label: "MAR", value: 11200 },
  ],
};

const RANGE_LABELS: Record<Range, string> = {
  "7D": "Last 7 Days",
  "30D": "Last 30 Days",
  "90D": "Last 90 Days",
};

// SVG viewport dimensions
const W = 700;
const H = 180;
const PAD_X = 10;
const PAD_Y = 20;

function buildPaths(points: DataPoint[]) {
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const n = points.length;
  const xs = points.map((_, i) =>
    PAD_X + (i / (n - 1)) * (W - PAD_X * 2)
  );
  const ys = values.map(
    (v) => PAD_Y + (1 - (v - min) / range) * (H - PAD_Y * 2)
  );

  // Build smooth cubic bezier line
  let line = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < n; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    line += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }

  // Fill: close the line path down to the baseline
  const fill =
    line +
    ` L ${xs[n - 1]} ${H} L ${xs[0]} ${H} Z`;

  return { line, fill, xs, ys, min, max };
}

export default function RevenueChart() {
  const [range, setRange] = useState<Range>("7D");
  const [open, setOpen] = useState(false);

  const data = DATA[range];
  const { line, fill, xs, ys, min, max } = buildPaths(data);

  // Highlight the peak point
  const peakIdx = ys.indexOf(Math.min(...ys)); // lowest y = highest value

  const formatValue = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;

  return (
    <div className="bg-[#111111] border border-white/5 rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-brand/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-[18px] font-bold text-white tracking-tight">Revenue Trend</h3>
          <p className="text-[#5A6F65] text-[12px] font-medium">
            Peak: <span className="text-brand">{formatValue(Math.max(...data.map((d) => d.value)))}</span>
          </p>
        </div>

        {/* Range Picker */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-white/5 rounded-xl text-[13px] text-[#8e9895] hover:text-white transition-colors"
          >
            {RANGE_LABELS[range]}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden z-20 min-w-[140px] shadow-xl">
              {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors ${
                    r === range
                      ? "text-brand bg-brand/5"
                      : "text-[#8e9895] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {RANGE_LABELS[r]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full" style={{ minHeight: 200 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 160 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E58F" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00E58F" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="revLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00E58F" stopOpacity="0.2" />
              <stop offset="40%" stopColor="#00E58F" stopOpacity="1" />
              <stop offset="100%" stopColor="#00E58F" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Fill area */}
          <path d={fill} fill="url(#revFill)" />

          {/* Line */}
          <path
            d={line}
            fill="none"
            stroke="url(#revLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {xs.map((x, i) => (
            <g key={i}>
              <circle
                cx={x}
                cy={ys[i]}
                r={i === peakIdx ? 5 : 3}
                fill={i === peakIdx ? "#00E58F" : "#1A1A1A"}
                stroke="#00E58F"
                strokeWidth={i === peakIdx ? 0 : 1.5}
                opacity={i === peakIdx ? 1 : 0.5}
              />
              {/* Dashed vertical drop on peak */}
              {i === peakIdx && (
                <line
                  x1={x}
                  y1={ys[i] + 6}
                  x2={x}
                  y2={H}
                  stroke="#00E58F"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.25"
                />
              )}
            </g>
          ))}
        </svg>

        {/* X-axis labels */}
        <div
          className="flex justify-between w-full mt-3 px-[10px]"
          style={{ paddingLeft: PAD_X, paddingRight: PAD_X }}
        >
          {data.map((d, i) => (
            <span
              key={d.label}
              className={`text-[11px] font-bold tracking-wider ${
                i === peakIdx ? "text-brand" : "text-[#4A5D54]"
              }`}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom glow bar on hover */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}
