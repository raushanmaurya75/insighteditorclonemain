import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  X,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Zap,
  Layers,
  Lock,
  Plus,
  Minus,
  Clock,
  Percent,
  Eye,
  Pencil,
} from "lucide-react";
import {
  type GraphPoint,
  GraphSplineMath,
} from "@/lib/insight-store";

export type GraphEditorMode =
  | "views_this_reel"
  | "views_typical"
  | "watch_retention"
  | "likes_retention";

interface InteractiveGraphEditorProps {
  isOpen: boolean;
  onClose: () => void;
  mode: GraphEditorMode;
  title?: string;
  initialPoints: GraphPoint[];
  totalViews?: number;
  durationSeconds?: number;
  onSave: (points: GraphPoint[], totalVal: number, durationSeconds?: number) => void;
}

function formatSec(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function InteractiveGraphEditor({
  isOpen,
  onClose,
  mode,
  title: customTitle,
  initialPoints,
  totalViews: initTotalViews = 12910,
  durationSeconds: initDurationSeconds = 13,
  onSave,
}: InteractiveGraphEditorProps) {
  if (!isOpen) return null;

  const isRetention = mode === "watch_retention";
  const isLikes = mode === "likes_retention";
  const isPercentage = isRetention || isLikes;
  const isTimeX = isRetention || isLikes;

  const [duration, setDuration] = useState<number>(initDurationSeconds || 13);
  const maxX = isTimeX ? Math.max(3, duration) : 360;

  const [totalVal, setTotalVal] = useState<number>(() => {
    if (isRetention) {
      return initialPoints?.[initialPoints.length - 1]?.value ?? 12;
    }
    if (isLikes) {
      return initialPoints?.[initialPoints.length - 1]?.value ?? 0;
    }
    return initTotalViews || 12910;
  });

  const [totalInputText, setTotalInputText] = useState<string>(() => {
    if (isRetention) {
      const v = initialPoints?.[initialPoints.length - 1]?.value ?? 12;
      return `${v}%`;
    }
    if (isLikes) {
      const v = initialPoints?.[initialPoints.length - 1]?.value ?? 0;
      return `${v}%`;
    }
    return GraphSplineMath.formatViews(initTotalViews || 12910);
  });

  // Initialize points based on mode
  const [points, setPoints] = useState<GraphPoint[]>(() => {
    if (initialPoints && initialPoints.length >= 2) {
      const copy = initialPoints.map((p) => ({ ...p }));
      copy.sort((a, b) => a.time - b.time);
      if (!isRetention && !isLikes) {
        copy[copy.length - 1].value = initTotalViews || 12910;
      }
      return copy;
    }

    if (isRetention) {
      return [
        { time: 0, value: 100 },
        { time: Math.round(duration * 0.15), value: 85 },
        { time: Math.round(duration * 0.38), value: 68 },
        { time: Math.round(duration * 0.62), value: 45 },
        { time: Math.round(duration * 0.85), value: 20 },
        { time: duration, value: 12 },
      ];
    }

    if (isLikes) {
      return [
        { time: 0, value: 15 },
        { time: Math.round(duration * 0.25), value: 15 },
        { time: Math.round(duration * 0.5), value: 0 },
        { time: Math.round(duration * 0.7), value: 15 },
        { time: duration, value: 0 },
      ];
    }

    return [
      { time: 0, value: 0 },
      { time: 90, value: Math.round((initTotalViews || 12910) * 0.2) },
      { time: 180, value: Math.round((initTotalViews || 12910) * 0.6) },
      { time: 360, value: initTotalViews || 12910 },
    ];
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [statusHint, setStatusHint] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const minY = 0;

  const maxY = useMemo(() => {
    if (isRetention) return 100;
    if (isLikes) {
      let maxPt = 20;
      points.forEach((p) => {
        if (p.value > maxPt) maxPt = p.value;
      });
      return Math.max(20, Math.ceil(maxPt / 5) * 5);
    }
    let maxPt = totalVal;
    points.forEach((p) => {
      if (p.value > maxPt) maxPt = p.value;
    });
    return GraphSplineMath.computeMilestoneCeiling(Math.max(maxPt, 2000));
  }, [totalVal, points, isRetention, isLikes]);

  // Handle total change
  const handleTotalInputChange = (valStr: string) => {
    setTotalInputText(valStr);
    const parsed = isPercentage
      ? parseFloat(valStr.replace(/%/g, "")) || 0
      : GraphSplineMath.parseViews(valStr);
    if (parsed >= 0) {
      setTotalVal(parsed);
      if (!isRetention) {
        setPoints((prev) => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1].value = parsed;
          }
          return next;
        });
      }
    }
  };

  // Handle duration change for retention / likes
  const handleDurationChange = (newSec: number) => {
    const s = Math.max(3, Math.min(300, newSec));
    const oldMax = maxX;
    setDuration(s);
    // Scale existing points horizontally
    setPoints((prev) =>
      prev.map((pt) => ({
        ...pt,
        time: Number(((pt.time / oldMax) * s).toFixed(1)),
      }))
    );
  };

  // Preset curves
  const applyPreset = (presetKey: string) => {
    const n = points.length;

    if (isRetention) {
      const newPts: GraphPoint[] = [];
      for (let i = 0; i < n; i++) {
        const progress = n > 1 ? i / (n - 1) : 1;
        const t = Number((progress * duration).toFixed(1));
        let v = 100;

        if (presetKey === "high") {
          // High retention: stays above 70%
          v = 100 - progress * 28;
        } else if (presetKey === "hook") {
          // Hook & Drop: sharp drop early then flat
          v = 100 * Math.exp(-2.2 * progress) * 0.75 + 15 * (1 - progress);
        } else if (presetKey === "steady") {
          // Steady exponential drop from 100 to 12
          v = 12 + 88 * Math.pow(1 - progress, 1.8);
        } else if (presetKey === "linear") {
          // Linear 100 to 10
          v = 100 - progress * 90;
        } else if (presetKey === "viral_loop") {
          // Drops to 55 then rises to 75 at end (rewatches)
          v = progress < 0.5 ? 100 - progress * 90 : 55 + (progress - 0.5) * 40;
        }

        newPts.push({ time: t, value: Math.max(0, Math.min(100, Math.round(v))) });
      }
      setPoints(newPts);
      setStatusHint(`Applied ${presetKey.toUpperCase().replace("_", " ")} retention preset`);
      setTimeout(() => setStatusHint(null), 2500);
      return;
    }

    if (isLikes) {
      const newPts: GraphPoint[] = [];
      for (let i = 0; i < n; i++) {
        const progress = n > 1 ? i / (n - 1) : 1;
        const t = Number((progress * duration).toFixed(1));
        let v = 0;

        if (presetKey === "front") {
          v = progress < 0.3 ? 20 - progress * 40 : Math.max(0, 5 - progress * 5);
        } else if (presetKey === "steady") {
          v = 15;
        } else if (presetKey === "end_spike") {
          v = progress > 0.7 ? (progress - 0.7) * 60 : 5;
        } else if (presetKey === "wave") {
          v = Math.abs(Math.sin(progress * Math.PI * 2.5)) * 18;
        }

        newPts.push({ time: t, value: Math.max(0, Math.min(maxY, Math.round(v))) });
      }
      setPoints(newPts);
      setStatusHint(`Applied ${presetKey.toUpperCase().replace("_", " ")} likes preset`);
      setTimeout(() => setStatusHint(null), 2500);
      return;
    }

    // Views Mode Presets
    const startVal = points[0]?.value || 0;
    const newPts: GraphPoint[] = [];

    for (let i = 0; i < n; i++) {
      const progress = n > 1 ? i / (n - 1) : 1;
      const t = progress * maxX;
      let factor = progress;

      if (presetKey === "viral") {
        factor =
          progress === 0
            ? 0
            : progress === 1
            ? 1
            : (1 - Math.exp(-3.5 * progress)) / (1 - Math.exp(-3.5));
      } else if (presetKey === "scurve") {
        factor = progress * progress * (3 - 2 * progress);
      } else if (presetKey === "late") {
        factor = Math.pow(progress, 2.5);
      } else {
        factor = progress;
      }

      newPts.push({ time: t, value: Math.round(startVal + factor * (totalVal - startVal)) });
    }

    setPoints(newPts);
    setStatusHint(`Applied ${presetKey.toUpperCase()} curve preset`);
    setTimeout(() => setStatusHint(null), 2500);
  };

  // Change number of points
  const setNumPoints = (count: number) => {
    const n = Math.max(2, Math.min(20, count));
    if (n === points.length) return;

    const newPts: GraphPoint[] = [];
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? Number(((i / (n - 1)) * maxX).toFixed(1)) : 0;
      let v: number;
      if (i === n - 1 && !isRetention && !isLikes) {
        v = totalVal;
      } else if (i === 0 && !isRetention) {
        v = points[0]?.value || 0;
      } else {
        v = GraphSplineMath.interpolateSplineY(t, points);
      }
      newPts.push({ time: t, value: Math.max(minY, Math.min(maxY, Math.round(v))) });
    }
    setPoints(newPts);
  };

  // SVG Spline Path
  const svgSplinePath = useMemo(() => {
    return GraphSplineMath.buildSvgPath(points, {
      maxX,
      maxY,
      minY,
      width: 360,
      height: 180,
      paddingTop: 15,
      paddingBottom: 25,
      paddingLeft: 36,
      paddingRight: 20,
      samples: 120,
    });
  }, [points, maxX, maxY, minY]);

  // Coordinate mapper for SVG
  const plotLeft = 36;
  const plotRight = 360 - 20;
  const plotTop = 15;
  const plotBottom = 180 - 25;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const rangeY = maxY - minY > 0 ? maxY - minY : 1;

  const getPointCoords = (pt: GraphPoint) => {
    const px = plotLeft + (pt.time / maxX) * plotWidth;
    const py = plotBottom - ((pt.value - minY) / rangeY) * plotHeight;
    return { px, py };
  };

  // Mouse / Touch Dragging Handler on SVG
  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);

    if (idx === points.length - 1 && !isRetention && !isLikes) {
      setStatusHint(`🔒 Last point is locked to ${GraphSplineMath.formatViews(totalVal)} (Edit below)`);
      setTimeout(() => setStatusHint(null), 2500);
      return;
    }

    setDraggedIndex(idx);
    const pt = points[idx];
    const timeLabel = isTimeX ? formatSec(pt.time) : `${Math.round(pt.time)}m`;
    const valLabel = isPercentage ? `${pt.value}%` : GraphSplineMath.formatViews(pt.value);
    setStatusHint(`Dragging Point #${idx + 1} (${timeLabel}, ${valLabel})`);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (draggedIndex === null || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Map from pixel to viewBox coordinates (360 x 180)
      const scaleX = 360 / rect.width;
      const scaleY = 180 / rect.height;
      const svgX = clientX * scaleX;
      const svgY = clientY * scaleY;

      const normY = Math.max(0, Math.min(1, (plotBottom - svgY) / plotHeight));
      const newVal = Math.round(minY + normY * rangeY);

      setPoints((prev) => {
        const next = [...prev];
        if (draggedIndex === 0) {
          next[0] = { ...next[0], value: Math.max(0, Math.min(maxY, newVal)) };
        } else if (draggedIndex === next.length - 1) {
          // Last point in retention or likes mode
          next[draggedIndex] = { ...next[draggedIndex], value: Math.max(0, Math.min(maxY, newVal)) };
        } else {
          const minT = next[draggedIndex - 1].time + maxX * 0.02;
          const maxT = next[draggedIndex + 1].time - maxX * 0.02;
          const normX = Math.max(0, Math.min(1, (svgX - plotLeft) / plotWidth));
          const newTime = Number(Math.max(minT, Math.min(maxT, normX * maxX)).toFixed(1));

          next[draggedIndex] = {
            time: newTime,
            value: Math.max(0, Math.min(maxY, newVal)),
          };
        }
        return next;
      });
    },
    [draggedIndex, plotLeft, plotBottom, plotWidth, plotHeight, rangeY, minY, maxY, maxX]
  );

  const handlePointerUp = () => {
    setDraggedIndex(null);
    setStatusHint(null);
  };

  const handleConfirm = () => {
    onSave(points, totalVal, isTimeX ? duration : undefined);
    onClose();
  };

  const dialogTitle =
    customTitle ||
    (isRetention
      ? "Edit Watch Retention Curve"
      : isLikes
      ? "Edit Likes Retention Curve"
      : mode === "views_typical"
      ? "Edit Typical Reel Curve (Dashed)"
      : "Edit Views Over Time Curve");

  return (
    <div
      className="clone-modal-overlay select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="clone-modal-dialog max-w-[480px] w-full max-h-[92vh] flex flex-col overflow-hidden bg-white text-[#262626] rounded-2xl shadow-2xl border border-[#dbdbdb]"
        role="dialog"
        aria-modal="true"
      >
        <div className="clone-modal-drag-bar !bg-gray-300" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#ededed] bg-[#fbfbfb]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-50 text-[#bc1888] flex items-center justify-center">
              {isPercentage ? <Percent size={17} strokeWidth={2.4} /> : <TrendingUp size={18} strokeWidth={2.4} />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111]">{dialogTitle}</h2>
              <p className="text-[11px] text-[#737373]">
                Drag the circular points directly on the graph to shape your curve!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#737373] hover:text-[#111] bg-transparent border-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Total Views Card at top of Graph Dialog */}
          {!isPercentage && (
            <div className="p-3 rounded-2xl bg-[#fafafa] border border-[#ededed] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-[#bc1888] flex items-center justify-center">
                  <Eye size={17} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider block">
                    TOTAL VIEWS COUNT
                  </span>
                  <strong className="text-base font-extrabold text-[#111]">
                    {typeof totalVal === "number" ? totalVal.toLocaleString() : totalVal}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <input
                    type="text"
                    value={totalInputText}
                    onChange={(e) => handleTotalInputChange(e.target.value)}
                    className="w-32 bg-white text-[#111] border border-gray-300 focus:border-[#bc1888] rounded-xl px-2.5 py-1.5 text-xs font-bold outline-none transition-colors shadow-sm"
                    placeholder="e.g. 95,200,000"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Pencil size={11} />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status / Hint Banner */}
          {statusHint && (
            <div className="p-2 rounded-xl bg-pink-50 text-[#bc1888] border border-pink-200 text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
              <Sparkles size={14} />
              <span>{statusHint}</span>
            </div>
          )}

          {/* Interactive SVG Canvas */}
          <div className="bg-[#121417] rounded-2xl p-3 border border-gray-800 shadow-inner overflow-hidden relative">
            <div className="flex items-center justify-between text-[11px] text-white/60 mb-1 px-1">
              <span className="flex items-center gap-1">
                <span>Touch & Drag Points</span>
              </span>
              <span className="text-[#bc1888] font-bold">
                Max Y: {isPercentage ? `${maxY}%` : GraphSplineMath.formatViews(maxY)}
              </span>
            </div>

            <svg
              ref={svgRef}
              viewBox="0 0 360 180"
              className="w-full h-[200px] touch-none cursor-crosshair select-none"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Background grid lines */}
              <line x1="36" y1="15" x2="340" y2="15" stroke="#2c3240" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="36" y1="53" x2="340" y2="53" stroke="#2c3240" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="36" y1="92" x2="340" y2="92" stroke="#2c3240" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="36" y1="131" x2="340" y2="131" stroke="#2c3240" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="36" y1="155" x2="340" y2="155" stroke="#3a4050" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="30" y="19" fill="#737373" fontSize="9" textAnchor="end">
                {isPercentage ? `${maxY}%` : GraphSplineMath.formatViews(maxY)}
              </text>
              <text x="30" y="96" fill="#737373" fontSize="9" textAnchor="end">
                {isPercentage ? `${(maxY / 2).toFixed(0)}%` : GraphSplineMath.formatViews(maxY / 2)}
              </text>
              <text x="30" y="158" fill="#737373" fontSize="9" textAnchor="end">
                0
              </text>

              {/* Area gradient under spline */}
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bc1888" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#bc1888" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {svgSplinePath && (
                <>
                  {/* Fill area */}
                  <path
                    d={`${svgSplinePath} L 340 155 L 36 155 Z`}
                    fill="url(#curveGradient)"
                  />
                  {/* Spline curve stroke */}
                  <path
                    d={svgSplinePath}
                    fill="none"
                    stroke="#bc1888"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Interactive Draggable Points */}
              {points.map((pt, idx) => {
                const { px, py } = getPointCoords(pt);
                const isLast = idx === points.length - 1;
                const isFirst = idx === 0;
                const isDragging = draggedIndex === idx;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onPointerDown={(e) => handlePointerDown(idx, e)}
                  >
                    {/* Outer touch target ring */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isDragging ? 18 : 14}
                      fill="transparent"
                    />
                    {/* Halo ring when active */}
                    {isDragging && (
                      <circle
                        cx={px}
                        cy={py}
                        r={12}
                        fill="#bc1888"
                        fillOpacity="0.3"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    )}
                    {/* Main point dot */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isLast ? 6.5 : isFirst ? 5.5 : 5}
                      fill={
                        isRetention
                          ? isFirst
                            ? "#0095f6"
                            : isLast
                            ? "#bc1888"
                            : "#ffffff"
                          : isLast
                          ? "#ffb800"
                          : isFirst
                          ? "#0095f6"
                          : "#ffffff"
                      }
                      stroke="#bc1888"
                      strokeWidth={2.5}
                    />
                    {/* Value badge text */}
                    <text
                      x={px}
                      y={Math.max(12, py - 9)}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow-md"
                    >
                      {isPercentage ? `${pt.value}%` : GraphSplineMath.formatViews(pt.value)}
                    </text>
                  </g>
                );
              })}

              {/* X Axis milestones */}
              <text x="36" y="172" fill="#737373" fontSize="9" textAnchor="start">
                {isTimeX ? "0:00" : "Start"}
              </text>
              <text x="188" y="172" fill="#737373" fontSize="9" textAnchor="middle">
                {isTimeX ? formatSec(duration / 2) : "Mid Time"}
              </text>
              <text x="340" y="172" fill="#737373" fontSize="9" textAnchor="end">
                {isTimeX ? formatSec(duration) : "End"}
              </text>
            </svg>
          </div>

          {/* Quick Curve Presets */}
          <div>
            <label className="block text-[11px] font-bold text-[#737373] uppercase tracking-wider mb-2">
              Curve Presets:
            </label>
            {isRetention ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("high")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  📉 High Retention
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("hook")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  🎣 Hook & Drop
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("steady")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  📉 Steady Drop
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("linear")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  📏 Linear Drop
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("viral_loop")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1 col-span-2 sm:col-span-1"
                >
                  ⚡ Viral Rewatch
                </button>
              </div>
            ) : isLikes ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("front")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  ⚡ Front Loaded
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("steady")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  📈 Steady Likes
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("end_spike")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  🎯 End Spike
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("wave")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  🌊 Wave Spike
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("viral")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  🔥 Viral Surge
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("scurve")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  📈 S-Curve
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("late")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  ⚡ Late Boom
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("linear")}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-pink-50 text-[#111] hover:text-[#bc1888] font-bold text-xs border border-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  📏 Linear
                </button>
              </div>
            )}
          </div>

          {/* Points Stepper and Secondary Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            {isTimeX ? (
              /* Reel Duration Control */
              <div>
                <label className="block text-[11px] font-bold text-[#737373] mb-1">
                  Reel Duration (Seconds)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={duration <= 3}
                    onClick={() => handleDurationChange(duration - 1)}
                    className="w-9 h-8 rounded-lg bg-white border border-gray-300 text-ink flex items-center justify-center font-bold text-sm cursor-pointer disabled:opacity-40 hover:bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-300 py-1 rounded-lg">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => handleDurationChange(parseInt(e.target.value) || 3)}
                      className="w-12 text-center font-bold text-sm bg-transparent border-none outline-none text-[#111]"
                    />
                    <span className="text-xs text-[#737373] font-semibold">sec ({formatSec(duration)})</span>
                  </div>
                  <button
                    type="button"
                    disabled={duration >= 180}
                    onClick={() => handleDurationChange(duration + 1)}
                    className="w-9 h-8 rounded-lg bg-white border border-gray-300 text-ink flex items-center justify-center font-bold text-sm cursor-pointer disabled:opacity-40 hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Total Views Input */
              <div>
                <label className="block text-[11px] font-bold text-[#737373] mb-1">
                  Total Views (Last Point)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={totalInputText}
                    onChange={(e) => handleTotalInputChange(e.target.value)}
                    className="w-full bg-white text-ink border border-gray-300 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-black transition-colors"
                    placeholder="e.g. 50K, 1.2M"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={13} />
                  </span>
                </div>
              </div>
            )}

            {/* Points count stepper */}
            <div>
              <label className="block text-[11px] font-bold text-[#737373] mb-1">
                Number of Points ({points.length})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={points.length <= 2}
                  onClick={() => setNumPoints(points.length - 1)}
                  className="w-9 h-8 rounded-lg bg-white border border-gray-300 text-ink flex items-center justify-center font-bold text-sm cursor-pointer disabled:opacity-40 hover:bg-gray-100"
                >
                  <Minus size={14} />
                </button>
                <div className="flex-1 text-center font-bold text-sm bg-white border border-gray-300 py-1 rounded-lg">
                  {points.length} Points
                </div>
                <button
                  type="button"
                  disabled={points.length >= 15}
                  onClick={() => setNumPoints(points.length + 1)}
                  className="w-9 h-8 rounded-lg bg-white border border-gray-300 text-ink flex items-center justify-center font-bold text-sm cursor-pointer disabled:opacity-40 hover:bg-gray-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Clean Visible Buttons */}
        <div className="p-3 border-t border-[#ededed] flex items-center justify-between bg-[#fbfbfb]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-ink font-bold text-xs border-none cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs border-none cursor-pointer hover:opacity-95 shadow-md shadow-pink-500/25"
          >
            Save Graph Curve
          </button>
        </div>
      </div>
    </div>
  );
}
