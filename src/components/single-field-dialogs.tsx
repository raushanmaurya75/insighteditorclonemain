import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Plus, Trash2, Sliders, ChevronDown } from "lucide-react";
import { GraphSplineMath } from "@/lib/insight-store";

// ==========================================
// Smooth Touch-Optimized Slider Component
// ==========================================
export interface SmoothRateSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  unit?: string;
  presets?: number[];
  steppers?: number[];
}

export function SmoothRateSlider({
  value,
  min = 0,
  max = 100,
  step = 0.1,
  onChange,
  unit = "%",
  presets = [0.5, 1.2, 2.5, 5.0, 10, 25, 50, 80],
  steppers = [-5, -1, -0.1, 0.1, 1, 5],
}: SmoothRateSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const clamp = (v: number) => {
    const rounded = Math.round((v - min) / step) * step + min;
    const clamped = Math.max(min, Math.min(max, rounded));
    return Number(clamped.toFixed(step < 1 ? 1 : 0));
  };

  const updateFromClientX = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const nextVal = min + ratio * (max - min);
    onChange(clamp(nextVal));
  };

  // Pointer events with PointerCapture for 100% reliable touch & mouse dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Direct native non-passive touch listeners for mobile WebView resilience
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      setIsDragging(true);
      if (e.touches.length > 0) {
        updateFromClientX(e.touches[0].clientX);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.touches.length > 0) {
        updateFromClientX(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    track.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  });

  const percentProgress = Math.max(0, Math.min(100, ((value - min) / (max - min || 1)) * 100));

  return (
    <div
      className="space-y-3 select-none"
      style={{ touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* Visual Touch Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        className="relative h-12 w-full rounded-2xl bg-gray-100 p-1 flex items-center cursor-pointer border border-[#dbdbdb] active:border-[#bc1888] shadow-inner transition-colors"
      >
        {/* Filled active track */}
        <div
          style={{ width: `${percentProgress}%` }}
          className="h-full rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] transition-[width] duration-75 ease-out shadow-sm pointer-events-none"
        />

        {/* Thumb handle */}
        <div
          style={{
            left: `${percentProgress}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className={`absolute w-8 h-8 rounded-full bg-white border-2 border-[#bc1888] shadow-md flex items-center justify-center transition-transform pointer-events-none ${
            isDragging ? "scale-125 shadow-lg shadow-pink-500/30" : "hover:scale-110"
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-[#bc1888]" />
        </div>
      </div>

      {/* Stepper Increment/Decrement Buttons */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-0.5">
        {steppers.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => onChange(clamp(value + st))}
            className="flex-1 min-w-[42px] py-1.5 px-1 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 text-[#262626] font-bold text-[11px] border border-gray-200 cursor-pointer transition-all text-center"
          >
            {st > 0 ? `+${st}` : st}
          </button>
        ))}
      </div>

      {/* Quick Preset Chips */}
      {presets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10.5px] font-bold text-[#737373] mr-1">Presets:</span>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(clamp(p))}
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border transition-colors cursor-pointer ${
                value === p
                  ? "bg-[#bc1888] text-white border-transparent shadow-xs"
                  : "bg-white text-[#555] border-gray-200 hover:border-gray-400"
              }`}
            >
              {p}
              {unit}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. Single Text / Numeric Count Edit Dialog
// ==========================================
export interface TextEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  initialValue: string | number;
  isNumeric?: boolean;
  onSave: (val: string) => void;
}

export function SingleTextEditDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  initialValue,
  isNumeric = false,
  onSave,
}: TextEditDialogProps) {
  if (!isOpen) return null;

  const [val, setVal] = useState<string>(
    isNumeric && typeof initialValue === "number"
      ? initialValue.toLocaleString()
      : String(initialValue || "")
  );

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(val);
    onClose();
  };

  return (
    <div
      className="clone-modal-overlay select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="clone-modal-dialog max-w-[360px] w-full bg-white text-[#262626] rounded-2xl p-5 shadow-2xl border border-[#dbdbdb] animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-3 border-b border-[#ededed] pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-[#111]">{title}</h3>
            {subtitle && <p className="text-[11px] text-[#737373] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#737373] hover:text-[#111] bg-transparent border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Enter value (e.g. 50K, 1.2M, 13s)"
              className="w-full bg-[#f9f9f9] text-[#111] border border-[#dbdbdb] rounded-xl px-3.5 py-2.5 text-base font-bold outline-none focus:border-[#bc1888] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#262626] font-bold text-xs border-none cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs border-none cursor-pointer hover:opacity-95 shadow-md shadow-pink-500/25"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. Single Rate & Status Edit Dialog
// ==========================================
export interface RateEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  metricLabel: string;
  initialRate: number;
  initialStatus: "Auto" | "Higher" | "Lower" | "Typical";
  onSave: (rate: number, status: "Auto" | "Higher" | "Lower" | "Typical") => void;
}

export function SingleRateEditDialog({
  isOpen,
  onClose,
  metricLabel,
  initialRate,
  initialStatus,
  onSave,
}: RateEditDialogProps) {
  if (!isOpen) return null;

  const [rate, setRate] = useState<number>(initialRate);
  const [status, setStatus] = useState<"Auto" | "Higher" | "Lower" | "Typical">(initialStatus || "Auto");

  const handleConfirm = () => {
    onSave(rate, status);
    onClose();
  };

  return (
    <div
      className="clone-modal-overlay select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="clone-modal-dialog max-w-[380px] w-full bg-white text-[#262626] rounded-2xl p-5 shadow-2xl border border-[#dbdbdb] animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-3 border-b border-[#ededed] pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-[#111]">Edit {metricLabel}</h3>
            <p className="text-[11px] text-[#737373] mt-0.5">
              Set percentage and comparison status
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#737373] hover:text-[#111] bg-transparent border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Rate Percentage Input & Smooth Slider */}
          <div>
            <label className="block text-[11px] font-bold text-[#737373] mb-1.5">
              Rate Percentage:
            </label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-24 bg-[#f9f9f9] text-[#111] border border-[#dbdbdb] rounded-xl px-3 py-2 text-base font-bold outline-none focus:border-[#bc1888] focus:bg-white"
              />
              <span className="text-sm font-bold text-[#737373]">%</span>
            </div>

            {/* Silky Smooth Touch Slider */}
            <SmoothRateSlider
              value={rate}
              min={0}
              max={50}
              step={0.1}
              onChange={setRate}
              presets={[0.5, 1.2, 2.4, 4.8, 8.0, 15, 25, 40]}
            />
          </div>

          {/* Comparison Status Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#737373] mb-1.5">
              Comparison Status:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["Auto", "Higher", "Lower", "Typical"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    status === st
                      ? "bg-[#bc1888] text-white border-transparent shadow-sm"
                      : "bg-[#f9f9f9] text-[#555] border-[#dbdbdb] hover:border-gray-400"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ededed]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#262626] font-bold text-xs border-none cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs border-none cursor-pointer hover:opacity-95 shadow-md shadow-pink-500/25"
            >
              Save Rate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. Single Percentage Slider Edit Dialog
// ==========================================
export interface PercentageEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValue: number;
  onSave: (val: number) => void;
}

export function SinglePercentageEditDialog({
  isOpen,
  onClose,
  title,
  initialValue,
  onSave,
}: PercentageEditDialogProps) {
  if (!isOpen) return null;

  const [val, setVal] = useState<number>(initialValue);

  const handleConfirm = () => {
    onSave(val);
    onClose();
  };

  return (
    <div
      className="clone-modal-overlay select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="clone-modal-dialog max-w-[360px] w-full bg-white text-[#262626] rounded-2xl p-5 shadow-2xl border border-[#dbdbdb] animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-3 border-b border-[#ededed] pb-2.5">
          <h3 className="text-sm font-bold text-[#111]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#737373] hover:text-[#111] bg-transparent border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={val}
              onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
              className="w-24 bg-[#f9f9f9] text-[#111] border border-[#dbdbdb] rounded-xl px-3 py-2 text-base font-bold outline-none focus:border-[#bc1888] focus:bg-white"
            />
            <span className="text-sm font-bold text-[#737373]">%</span>
          </div>

          <SmoothRateSlider
            value={val}
            min={0}
            max={100}
            step={0.1}
            onChange={setVal}
            presets={[5, 10, 25, 50, 75, 90, 100]}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ededed]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#262626] font-bold text-xs border-none cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs border-none cursor-pointer hover:opacity-95 shadow-md shadow-pink-500/25"
            >
              Save %
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. Y-Axis Scale Edit Dialog
// ==========================================
export interface YAxisEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  maxLabel: string;
  midLabel: string;
  startLabel: string;
  onSave: (max: string, mid: string, start: string) => void;
}

export function YAxisEditDialog({
  isOpen,
  onClose,
  maxLabel: initMax,
  midLabel: initMid,
  startLabel: initStart,
  onSave,
}: YAxisEditDialogProps) {
  if (!isOpen) return null;

  const [maxVal, setMaxVal] = useState(initMax);
  const [midVal, setMidVal] = useState(initMid);
  const [startVal, setStartVal] = useState(initStart);

  const handleConfirm = () => {
    onSave(maxVal, midVal, startVal);
    onClose();
  };

  return (
    <div
      className="clone-modal-overlay select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="clone-modal-dialog max-w-[360px] w-full bg-white text-[#262626] rounded-2xl p-5 shadow-2xl border border-[#dbdbdb] animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-3 border-b border-[#ededed] pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-[#111]">Edit Y-Axis Labels</h3>
            <p className="text-[11px] text-[#737373] mt-0.5">
              Customize top, middle, and starting graph axis values
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#737373] hover:text-[#111] bg-transparent border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#737373] mb-1">
              Top Y Label (Max)
            </label>
            <input
              type="text"
              value={maxVal}
              onChange={(e) => setMaxVal(e.target.value)}
              placeholder="e.g. 100K or 50K"
              className="w-full bg-[#f9f9f9] text-[#111] border border-[#dbdbdb] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#bc1888] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#737373] mb-1">
              Middle Y Label (Mid)
            </label>
            <input
              type="text"
              value={midVal}
              onChange={(e) => setMidVal(e.target.value)}
              placeholder="e.g. 50K or 25K"
              className="w-full bg-[#f9f9f9] text-[#111] border border-[#dbdbdb] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#bc1888] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#737373] mb-1">
              Bottom Y Label (Start)
            </label>
            <input
              type="text"
              value={startVal}
              onChange={(e) => setStartVal(e.target.value)}
              placeholder="e.g. 0"
              className="w-full bg-[#f9f9f9] text-[#111] border border-[#dbdbdb] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#bc1888] focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ededed]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#262626] font-bold text-xs border-none cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs border-none cursor-pointer hover:opacity-95 shadow-md shadow-pink-500/25"
            >
              Save Labels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
