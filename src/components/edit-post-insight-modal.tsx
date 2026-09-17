import React, { useState } from "react";
import {
  X,
  Sparkles,
  BarChart2,
  TrendingUp,
  PieChart,
  Users,
  Plus,
  Trash2,
  Zap,
  Layers,
  Edit3,
} from "lucide-react";
import {
  type PostInsightsData,
  type GraphPoint,
  type CountryData,
  GraphSplineMath,
} from "@/lib/insight-store";
import { InteractiveGraphEditor } from "./interactive-graph-editor";

interface EditPostInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PostInsightsData;
  onSave: (updated: PostInsightsData) => void;
}

type ModalTab = "metrics" | "views_graph" | "rates" | "retention" | "audience";

export function EditPostInsightModal({
  isOpen,
  onClose,
  data: initialData,
  onSave,
}: EditPostInsightModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<PostInsightsData>(() =>
    JSON.parse(JSON.stringify(initialData))
  );
  const [activeTab, setActiveTab] = useState<ModalTab>("metrics");

  // State for interactive curve modal popup
  const [interactiveGraphTarget, setInteractiveGraphTarget] = useState<
    "this_reel" | "typical_reel" | "retention" | "likes" | null
  >(null);

  // Handlers for metrics
  const handleNumberChange = (
    field:
      | "likes"
      | "comments"
      | "reposts"
      | "shares"
      | "saves"
      | "views"
      | "viewers"
      | "followsSummary"
      | "followsEngagement"
      | "profileVisits",
    val: string
  ) => {
    const parsed = GraphSplineMath.parseViews(val);
    setFormData((prev) => ({ ...prev, [field]: parsed }));
  };

  // Preset generators for Views Graph
  const applyPresetToThisReel = (type: "viral" | "scurve" | "linear" | "steady") => {
    const maxVal = formData.views || 12910;
    let newPts: GraphPoint[] = [];

    if (type === "viral") {
      newPts = [
        { time: 0, value: 0 },
        { time: 45, value: Math.round(maxVal * 0.45) },
        { time: 120, value: Math.round(maxVal * 0.82) },
        { time: 240, value: Math.round(maxVal * 0.95) },
        { time: 360, value: maxVal },
      ];
    } else if (type === "scurve") {
      newPts = [
        { time: 0, value: 0 },
        { time: 90, value: Math.round(maxVal * 0.12) },
        { time: 180, value: Math.round(maxVal * 0.65) },
        { time: 270, value: Math.round(maxVal * 0.9) },
        { time: 360, value: maxVal },
      ];
    } else if (type === "steady") {
      newPts = [
        { time: 0, value: 0 },
        { time: 90, value: Math.round(maxVal * 0.25) },
        { time: 180, value: Math.round(maxVal * 0.5) },
        { time: 270, value: Math.round(maxVal * 0.75) },
        { time: 360, value: maxVal },
      ];
    } else {
      newPts = [
        { time: 0, value: 0 },
        { time: 180, value: Math.round(maxVal * 0.5) },
        { time: 360, value: maxVal },
      ];
    }

    setFormData((prev) => ({
      ...prev,
      viewsThisReelPoints: newPts,
    }));
  };

  // Auto calculate rates from counts
  const autoCalculateRates = () => {
    const v = formData.views || 1;
    const l = formData.likes || 0;
    const c = formData.comments || 0;
    const s = formData.shares || 0;
    const r = formData.reposts || 0;
    const sv = formData.saves || 0;

    const likeRate = Number(((l / v) * 100).toFixed(1));
    const commentRate = Number(((c / v) * 100).toFixed(1));
    const shareRate = Number(((s / v) * 100).toFixed(1));
    const repostRate = Number(((r / v) * 100).toFixed(1));
    const saveRate = Number(((sv / v) * 100).toFixed(1));

    setFormData((prev) => ({
      ...prev,
      rates: {
        ...prev.rates,
        like: { ...prev.rates.like, rate: likeRate },
        comment: { ...prev.rates.comment, rate: commentRate },
        share: { ...prev.rates.share, rate: shareRate },
        repost: { ...prev.rates.repost, rate: repostRate },
        save: { ...prev.rates.save, rate: saveRate },
      },
    }));
  };

  // Normalize Top Sources to 100%
  const normalizeSources = () => {
    const s = formData.sources;
    const sum = s.reelsTab + s.explore + s.feed + s.profile + s.search;
    if (sum <= 0) return;
    setFormData((prev) => ({
      ...prev,
      sources: {
        reelsTab: Number(((s.reelsTab / sum) * 100).toFixed(1)),
        explore: Number(((s.explore / sum) * 100).toFixed(1)),
        feed: Number(((s.feed / sum) * 100).toFixed(1)),
        profile: Number(((s.profile / sum) * 100).toFixed(1)),
        search: Number(((s.search / sum) * 100).toFixed(1)),
      },
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <>
      <div
        className="clone-modal-overlay select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="clone-modal-dialog max-w-[500px] w-full max-h-[92vh] flex flex-col overflow-hidden bg-white text-[#1a1a1a] rounded-2xl shadow-2xl border border-[#dbdbdb]"
          role="dialog"
          aria-modal="true"
        >
          <div className="clone-modal-drag-bar !bg-gray-300" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#ededed] bg-[#fbfbfb]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-50 text-[#bc1888] flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111]">
                  Edit Reel Insights & Graphs
                </h2>
                <p className="text-[11px] text-[#737373]">
                  Customize metrics, spline curves, rates, and audience data
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

          {/* Navigation Tabs Bar */}
          <div className="flex border-b border-[#ededed] bg-[#f5f5f7] text-xs font-semibold overflow-x-auto no-scrollbar">
            {[
              { id: "metrics", label: "Metrics & Summary", icon: BarChart2 },
              { id: "views_graph", label: "Views Graph", icon: TrendingUp },
              { id: "rates", label: "Rates & Reach", icon: Zap },
              { id: "retention", label: "Watch Retention", icon: PieChart },
              { id: "audience", label: "Audience & Sources", icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id as ModalTab)}
                className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === id
                    ? "border-[#bc1888] text-[#bc1888] font-bold bg-white"
                    : "border-transparent text-[#737373] hover:text-[#111]"
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Scrollable Tab Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-[#262626] bg-white">
            {/* ================= TAB 1: METRICS & SUMMARY ================= */}
            {activeTab === "metrics" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">
                    Interaction Counts (Under Thumbnail)
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Likes
                      </label>
                      <input
                        type="text"
                        value={formData.likes.toLocaleString()}
                        onChange={(e) => handleNumberChange("likes", e.target.value)}
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Comments
                      </label>
                      <input
                        type="text"
                        value={formData.comments.toLocaleString()}
                        onChange={(e) => handleNumberChange("comments", e.target.value)}
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Reposts
                      </label>
                      <input
                        type="text"
                        value={formData.reposts.toLocaleString()}
                        onChange={(e) => handleNumberChange("reposts", e.target.value)}
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Shares
                      </label>
                      <input
                        type="text"
                        value={formData.shares.toLocaleString()}
                        onChange={(e) => handleNumberChange("shares", e.target.value)}
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Saves (Bookmarks)
                      </label>
                      <input
                        type="text"
                        value={formData.saves.toLocaleString()}
                        onChange={(e) => handleNumberChange("saves", e.target.value)}
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#ededed]" />

                <div>
                  <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">
                    Summary Cards
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Total Views
                      </label>
                      <input
                        type="text"
                        value={formData.views.toLocaleString()}
                        onChange={(e) => handleNumberChange("views", e.target.value)}
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Viewers / Accounts Reached
                      </label>
                      <input
                        type="text"
                        value={formData.viewers.toLocaleString()}
                        onChange={(e) => handleNumberChange("viewers", e.target.value)}
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Average Watch Time
                      </label>
                      <input
                        type="text"
                        value={formData.averageWatchTime}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, averageWatchTime: e.target.value }))
                        }
                        placeholder="e.g. 13s"
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-1">
                        Follows (Summary)
                      </label>
                      <input
                        type="number"
                        value={formData.followsSummary}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            followsSummary: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-full bg-white text-[#111] border border-[#dbdbdb] rounded-lg px-3 py-2 font-bold text-xs outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: VIEWS OVER TIME GRAPH ================= */}
            {activeTab === "views_graph" && (
              <div className="space-y-4">
                {/* Visual Curve Editor Trigger Card */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 border border-pink-200 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-xs text-[#bc1888] flex items-center gap-1.5">
                      <TrendingUp size={15} /> Visual Graph Line Drag Editor
                    </h4>
                    <p className="text-[11px] text-[#555] mt-0.5 leading-tight">
                      Touch & drag points directly on the graph to draw the exact views curve!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInteractiveGraphTarget("this_reel")}
                    className="px-3 py-2 rounded-xl bg-[#bc1888] hover:bg-[#a01372] text-white font-bold text-xs border-none cursor-pointer shrink-0 shadow-sm shadow-pink-500/25 flex items-center gap-1"
                  >
                    <Edit3 size={13} /> Edit Curve
                  </button>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">
                    X-Axis Dates Milestones
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={formData.viewsGraphDates[0]}
                      onChange={(e) => {
                        const next: [string, string, string] = [...formData.viewsGraphDates];
                        next[0] = e.target.value;
                        setFormData((prev) => ({ ...prev, viewsGraphDates: next }));
                      }}
                      placeholder="Date 1 (Aug 8)"
                      className="bg-white text-ink border border-[#dbdbdb] rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={formData.viewsGraphDates[1]}
                      onChange={(e) => {
                        const next: [string, string, string] = [...formData.viewsGraphDates];
                        next[1] = e.target.value;
                        setFormData((prev) => ({ ...prev, viewsGraphDates: next }));
                      }}
                      placeholder="Date 2 (Aug 15)"
                      className="bg-white text-ink border border-[#dbdbdb] rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={formData.viewsGraphDates[2]}
                      onChange={(e) => {
                        const next: [string, string, string] = [...formData.viewsGraphDates];
                        next[2] = e.target.value;
                        setFormData((prev) => ({ ...prev, viewsGraphDates: next }));
                      }}
                      placeholder="Date 3 (Aug 22)"
                      className="bg-white text-ink border border-[#dbdbdb] rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-1.5">
                    Quick Curve Presets:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => applyPresetToThisReel("viral")}
                      className="px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-pink-100 text-[#111] font-bold text-[11px] border border-gray-200 transition-colors cursor-pointer"
                    >
                      🔥 Viral Surge
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetToThisReel("scurve")}
                      className="px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-pink-100 text-[#111] font-bold text-[11px] border border-gray-200 transition-colors cursor-pointer"
                    >
                      📈 S-Curve
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetToThisReel("steady")}
                      className="px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-pink-100 text-[#111] font-bold text-[11px] border border-gray-200 transition-colors cursor-pointer"
                    >
                      ⚖️ Steady
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetToThisReel("linear")}
                      className="px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-pink-100 text-[#111] font-bold text-[11px] border border-gray-200 transition-colors cursor-pointer"
                    >
                      📏 Linear
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider">
                      Coordinate Points Table ({formData.viewsThisReelPoints.length} points)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const pts = formData.viewsThisReelPoints;
                        const lastTime = pts.length > 0 ? pts[pts.length - 1].time : 0;
                        const newPt: GraphPoint = {
                          time: lastTime + 60,
                          value: Math.round(formData.views * 0.5),
                        };
                        setFormData((prev) => ({
                          ...prev,
                          viewsThisReelPoints: [...prev.viewsThisReelPoints, newPt],
                        }));
                      }}
                      className="flex items-center gap-1 text-[11px] text-[#0095f6] hover:underline bg-transparent border-none cursor-pointer p-0 font-bold"
                    >
                      <Plus size={13} /> Add Point
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {formData.viewsThisReelPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1.5 rounded-lg"
                      >
                        <span className="text-[#737373] font-bold text-[11px] w-5">#{idx + 1}</span>
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-[11px] text-[#737373]">T:</span>
                          <input
                            type="number"
                            value={pt.time}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const pts = [...formData.viewsThisReelPoints];
                              pts[idx].time = val;
                              setFormData((prev) => ({ ...prev, viewsThisReelPoints: pts }));
                            }}
                            className="w-16 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[#111] text-xs font-semibold"
                          />
                        </div>
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-[11px] text-[#737373]">Views:</span>
                          <input
                            type="text"
                            value={GraphSplineMath.formatViews(pt.value)}
                            onChange={(e) => {
                              const val = GraphSplineMath.parseViews(e.target.value);
                              const pts = [...formData.viewsThisReelPoints];
                              pts[idx].value = val;
                              setFormData((prev) => ({ ...prev, viewsThisReelPoints: pts }));
                            }}
                            className="w-20 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[#bc1888] text-xs font-bold"
                          />
                        </div>
                        {formData.viewsThisReelPoints.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                viewsThisReelPoints: prev.viewsThisReelPoints.filter(
                                  (_, i) => i !== idx
                                ),
                              }));
                            }}
                            className="p-1 text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: WHAT IMPACTS YOUR VIEWS ================= */}
            {activeTab === "rates" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11.5px] text-[#737373] leading-tight">
                    Customize reach impact rates and comparison status tags.
                  </p>
                  <button
                    type="button"
                    onClick={autoCalculateRates}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-bold border-none cursor-pointer shrink-0 shadow-sm"
                  >
                    Auto-Calculate
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(
                    [
                      { key: "skip", label: "Skip Rate" },
                      { key: "share", label: "Share Rate" },
                      { key: "like", label: "Like Rate" },
                      { key: "save", label: "Save Rate" },
                      { key: "repost", label: "Repost Rate" },
                      { key: "comment", label: "Comment Rate" },
                    ] as const
                  ).map(({ key, label }) => {
                    const current = formData.rates[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-200"
                      >
                        <span className="font-bold text-xs text-[#111]">{label}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              value={current.rate}
                              onChange={(e) => {
                                const r = parseFloat(e.target.value) || 0;
                                setFormData((prev) => ({
                                  ...prev,
                                  rates: {
                                    ...prev.rates,
                                    [key]: { ...prev.rates[key], rate: r },
                                  },
                                }));
                              }}
                              className="w-16 bg-white border border-gray-300 rounded-lg px-2 py-1 text-right text-xs text-[#111] font-bold"
                            />
                            <span className="text-[#737373] text-xs font-bold">%</span>
                          </div>

                          <select
                            value={current.status}
                            onChange={(e) => {
                              const st = e.target.value as any;
                              setFormData((prev) => ({
                                ...prev,
                                rates: {
                                  ...prev.rates,
                                  [key]: { ...prev.rates[key], status: st },
                                },
                              }));
                            }}
                            className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs text-[#111] font-medium outline-none cursor-pointer"
                          >
                            <option value="Auto">Auto</option>
                            <option value="Higher">Higher</option>
                            <option value="Lower">Lower</option>
                            <option value="Typical">Typical</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= TAB 4: WATCH RETENTION & LIKES ================= */}
            {activeTab === "retention" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#555] mb-1">
                    Reel Duration (Seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.reelDurationSeconds}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reelDurationSeconds: parseInt(e.target.value) || 13,
                      }))
                    }
                    className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-3 py-2 font-bold text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider">
                      Watch Retention Points (Time vs % Watched)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const pts = formData.watchRetentionPoints;
                        const last = pts.length > 0 ? pts[pts.length - 1] : { time: 0, value: 50 };
                        setFormData((prev) => ({
                          ...prev,
                          watchRetentionPoints: [
                            ...prev.watchRetentionPoints,
                            { time: last.time + 2, value: Math.max(0, last.value - 15) },
                          ],
                        }));
                      }}
                      className="flex items-center gap-1 text-[11px] text-[#0095f6] hover:underline bg-transparent border-none cursor-pointer p-0 font-bold"
                    >
                      <Plus size={13} /> Add Point
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {formData.watchRetentionPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1.5 rounded-lg"
                      >
                        <span className="text-[#737373] font-bold text-[11px] w-5">#{idx + 1}</span>
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-[11px] text-[#737373]">Sec:</span>
                          <input
                            type="number"
                            value={pt.time}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const pts = [...formData.watchRetentionPoints];
                              pts[idx].time = val;
                              setFormData((prev) => ({ ...prev, watchRetentionPoints: pts }));
                            }}
                            className="w-16 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[#111] text-xs font-semibold"
                          />
                        </div>
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-[11px] text-[#737373]">Retention %:</span>
                          <input
                            type="number"
                            value={pt.value}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const pts = [...formData.watchRetentionPoints];
                              pts[idx].value = val;
                              setFormData((prev) => ({ ...prev, watchRetentionPoints: pts }));
                            }}
                            className="w-16 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[#bc1888] text-xs font-bold"
                          />
                        </div>
                        {formData.watchRetentionPoints.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                watchRetentionPoints: prev.watchRetentionPoints.filter(
                                  (_, i) => i !== idx
                                ),
                              }));
                            }}
                            className="p-1 text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 5: AUDIENCE & SOURCES ================= */}
            {activeTab === "audience" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider">
                      Top Sources of Views (%)
                    </h3>
                    <button
                      type="button"
                      onClick={normalizeSources}
                      className="text-[11px] text-[#0095f6] hover:underline bg-transparent border-none cursor-pointer p-0 font-bold"
                    >
                      Normalize to 100%
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-0.5">
                        Reels tab %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.sources.reelsTab}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sources: {
                              ...prev.sources,
                              reelsTab: parseFloat(e.target.value) || 0,
                            },
                          }))
                        }
                        className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-0.5">
                        Explore %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.sources.explore}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sources: {
                              ...prev.sources,
                              explore: parseFloat(e.target.value) || 0,
                            },
                          }))
                        }
                        className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-0.5">
                        Feed %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.sources.feed}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sources: {
                              ...prev.sources,
                              feed: parseFloat(e.target.value) || 0,
                            },
                          }))
                        }
                        className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-0.5">
                        Profile %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.sources.profile}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sources: {
                              ...prev.sources,
                              profile: parseFloat(e.target.value) || 0,
                            },
                          }))
                        }
                        className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#ededed]" />

                <div>
                  <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">
                    Followers vs Non-Followers
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-0.5">
                        Followers %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.followersPct}
                        onChange={(e) => {
                          const f = parseFloat(e.target.value) || 0;
                          setFormData((prev) => ({
                            ...prev,
                            followersPct: f,
                            nonFollowersPct: Number((100 - f).toFixed(1)),
                          }));
                        }}
                        className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-0.5">
                        Non-Followers %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.nonFollowersPct}
                        onChange={(e) => {
                          const nf = parseFloat(e.target.value) || 0;
                          setFormData((prev) => ({
                            ...prev,
                            nonFollowersPct: nf,
                            followersPct: Number((100 - nf).toFixed(1)),
                          }));
                        }}
                        className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#ededed]" />

                <div>
                  <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">
                    Gender Split
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-0.5">
                        Men %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.gender.men}
                        onChange={(e) => {
                          const m = parseFloat(e.target.value) || 0;
                          setFormData((prev) => ({
                            ...prev,
                            gender: { men: m, women: Number((100 - m).toFixed(1)) },
                          }));
                        }}
                        className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#555] mb-0.5">
                        Women %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.gender.women}
                        onChange={(e) => {
                          const w = parseFloat(e.target.value) || 0;
                          setFormData((prev) => ({
                            ...prev,
                            gender: { women: w, men: Number((100 - w).toFixed(1)) },
                          }));
                        }}
                        className="w-full bg-white text-[#111] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#ededed]" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider">
                      Top Countries
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newC: CountryData = {
                          id: `c_${Date.now()}`,
                          name: "New Country",
                          percentage: 5.0,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          countries: [...prev.countries, newC],
                        }));
                      }}
                      className="flex items-center gap-1 text-[11px] text-[#0095f6] hover:underline bg-transparent border-none cursor-pointer p-0 font-bold"
                    >
                      <Plus size={13} /> Add Country
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {formData.countries.map((c, idx) => (
                      <div
                        key={c.id || idx}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1.5 rounded-lg"
                      >
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => {
                            const countries = [...formData.countries];
                            countries[idx].name = e.target.value;
                            setFormData((prev) => ({ ...prev, countries }));
                          }}
                          className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-[#111] text-xs font-medium"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.1"
                            value={c.percentage}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const countries = [...formData.countries];
                              countries[idx].percentage = val;
                              setFormData((prev) => ({ ...prev, countries }));
                            }}
                            className="w-16 bg-white border border-gray-300 rounded px-2 py-1 text-[#111] text-xs font-bold text-right"
                          />
                          <span className="text-[#737373] text-xs font-bold">%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              countries: prev.countries.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1 text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer with Clean Visible Buttons */}
          <div className="p-3 border-t border-[#ededed] flex items-center justify-between bg-[#fbfbfb]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-[#111] font-bold text-xs border-none cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs border-none cursor-pointer hover:opacity-95 shadow-md shadow-pink-500/25"
            >
              Save Insights
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Visual Graph Line Editor Popup */}
      <InteractiveGraphEditor
        isOpen={interactiveGraphTarget !== null}
        onClose={() => setInteractiveGraphTarget(null)}
        title={
          interactiveGraphTarget === "this_reel"
            ? "Edit Views Curve (This Reel)"
            : interactiveGraphTarget === "typical_reel"
            ? "Edit Typical Reel Curve"
            : "Edit Graph Curve"
        }
        initialPoints={
          interactiveGraphTarget === "this_reel"
            ? formData.viewsThisReelPoints
            : formData.viewsTypicalPoints
        }
        totalViews={formData.views}
        onSave={(newPoints, newTotal) => {
          if (interactiveGraphTarget === "this_reel") {
            setFormData((prev) => ({
              ...prev,
              views: newTotal,
              viewsThisReelPoints: newPoints,
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              viewsTypicalPoints: newPoints,
            }));
          }
          setInteractiveGraphTarget(null);
        }}
      />
    </>
  );
}
