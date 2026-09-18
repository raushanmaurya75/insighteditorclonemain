import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  TrendingUp,
  Pencil,
  Sparkles,
  Check,
  Edit3,
  Sliders,
  Eye,
  X,
  RotateCcw,
  MoreVertical,
} from "lucide-react";
import {
  IgHeart,
  IgComment,
  IgRepost,
  IgShare,
  IgBookmark,
  IgClock,
  IgMore,
  IgBackArrow,
  IgSkipRate,
} from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import reelMachine from "@/assets/reel-machine.jpg";
import { useProfile, formatCompactNumber } from "@/lib/profile-store";
import {
  loadPostInsights,
  savePostInsights,
  getDefaultPostInsights,
  calculateMetricStatus,
  GraphSplineMath,
  type PostInsightsData,
  type GraphPoint,
} from "@/lib/insight-store";
import { EditPostInsightModal } from "@/components/edit-post-insight-modal";
import { InteractiveGraphEditor } from "@/components/interactive-graph-editor";
import {
  SingleTextEditDialog,
  SingleRateEditDialog,
  SinglePercentageEditDialog,
  YAxisEditDialog,
} from "@/components/single-field-dialogs";

export const Route = createFileRoute("/insight-view")({
  head: () => ({
    meta: [
      { title: "Reel insights — Instagram" },
      {
        name: "description",
        content: "Detailed reel performance, engagement, and audience insights.",
      },
      { property: "og:title", content: "Reel insights — Instagram" },
      {
        property: "og:description",
        content: "Detailed reel performance, engagement, and audience insights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InsightViewPage,
});

type Tab = "overview" | "engagement" | "audience";
type ViewsFilter = "all" | "followers" | "non-followers";
type AudienceDetailTab = "country" | "age" | "gender";

function InfoTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="iv-title flex items-center gap-1.5">
      <span>{children}</span>
      <Info size={16} className="iv-info-icon" aria-hidden="true" />
    </h2>
  );
}

function InsightHeader({
  isEditMode,
  onToggleEditMode,
  onOpenFullModal,
  onResetInsights,
}: {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenFullModal: () => void;
  onResetInsights: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="iv-header">
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            aria-label="Back to profile"
            title="Back to profile"
            className="iv-back-btn"
          >
            <IgBackArrow size={24} />
          </Link>
          <h1 className="iv-header-title">Reel insights</h1>
        </div>

        {/* Top Right: TrendingUp graph icon + Three vertical dots */}
        <div className="iv-header-actions">
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="iv-icon-btn"
            aria-label="Trending stats"
            title="About Reel Insights"
          >
            <TrendingUp size={22} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={() => setShowMenu(true)}
            className={`iv-icon-btn ${isEditMode ? "text-[#e1306c]" : ""}`}
            aria-label="More options"
            title="Options & Edit Mode"
          >
            <MoreVertical size={22} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* Options Menu Bottom Sheet */}
      {showMenu && (
        <div
          className="clone-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMenu(false);
          }}
        >
          <div className="profile-menu-dialog" role="dialog" aria-modal="true">
            <div className="clone-modal-drag-bar" />

            <div className="clone-modal-header">
              <h3>Insight Options</h3>
              <button
                type="button"
                className="clone-modal-close-btn"
                onClick={() => setShowMenu(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile-menu-list">
              {/* Toggle Edit Mode */}
              <button
                type="button"
                className={`profile-menu-item ${isEditMode ? "bg-[#e1306c]/10" : ""}`}
                onClick={() => {
                  onToggleEditMode();
                  setShowMenu(false);
                }}
              >
                <div className={`profile-menu-item-icon ${isEditMode ? "bg-[#e1306c] text-white" : "clone-grad"}`}>
                  <Pencil size={18} />
                </div>
                <div className="profile-menu-item-text">
                  <b>{isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}</b>
                  <span>{isEditMode ? "Currently active — tap to lock metrics" : "Tap on any metric, percentage, or graph curve to edit"}</span>
                </div>
              </button>

              {/* Advanced Editor Modal */}
              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  setShowMenu(false);
                  onOpenFullModal();
                }}
              >
                <div className="profile-menu-item-icon">
                  <Sliders size={18} />
                </div>
                <div className="profile-menu-item-text">
                  <b>All-In-One Insights Editor</b>
                  <span>Configure all views, retention points, and audience percentages</span>
                </div>
              </button>

              {/* Reset to Default */}
              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  onResetInsights();
                  setShowMenu(false);
                }}
              >
                <div className="profile-menu-item-icon">
                  <RotateCcw size={18} />
                </div>
                <div className="profile-menu-item-text">
                  <b>Reset Insights to Default</b>
                  <span>Restore original realistic numbers for this reel</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div
          className="clone-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInfoModal(false);
          }}
        >
          <div className="profile-menu-dialog p-6" role="dialog" aria-modal="true">
            <div className="clone-modal-drag-bar" />
            <div className="clone-modal-header mb-3">
              <h3>About Reel Insights</h3>
              <button
                type="button"
                className="clone-modal-close-btn"
                onClick={() => setShowInfoModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-subtle leading-relaxed mb-4">
              Reel insights help you understand how your reel is performing. View metrics such as total views over time, retention rate, accounts reached, and follower vs. non-follower breakdown.
            </p>
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 bg-ink text-page font-semibold rounded-lg text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ReelPreviewAndMetrics({
  insights,
  displayImage,
  isEditMode,
  onEditField,
}: {
  insights: PostInsightsData;
  displayImage: string;
  isEditMode: boolean;
  onEditField: (field: "likes" | "comments" | "reposts" | "shares" | "saves", currentVal: number) => void;
}) {
  const reelMetrics: Array<{
    field: "likes" | "comments" | "reposts" | "shares" | "saves";
    Icon: any;
    value: string;
    numVal: number;
  }> = [
    { field: "likes", Icon: IgHeart, value: GraphSplineMath.formatViews(insights.likes), numVal: insights.likes },
    { field: "comments", Icon: IgComment, value: GraphSplineMath.formatViews(insights.comments), numVal: insights.comments },
    { field: "reposts", Icon: IgRepost, value: GraphSplineMath.formatViews(insights.reposts), numVal: insights.reposts },
    { field: "shares", Icon: IgShare, value: GraphSplineMath.formatViews(insights.shares), numVal: insights.shares },
    { field: "saves", Icon: IgBookmark, value: GraphSplineMath.formatViews(insights.saves), numVal: insights.saves },
  ];

  return (
    <section className="iv-top-strip relative">
      <Link
        to="/post-view"
        className="iv-thumb-wrap"
        aria-label="View Reel post"
        title="Watch Reel"
      >
        <img
          src={insights.customThumbnailUrl || displayImage}
          alt="Reel preview"
          width={118}
          height={210}
          className="iv-thumb-img object-cover"
        />
      </Link>

      <div className="iv-metric-icons">
        {reelMetrics.map(({ field, Icon, value, numVal }) => (
          <button
            key={field}
            type="button"
            onClick={() => onEditField(field, numVal)}
            className={`flex flex-col items-center p-1 rounded-xl transition-all cursor-pointer bg-transparent border-none ${
              isEditMode
                ? "hover:bg-pink-50 hover:text-[#bc1888] ring-1 ring-dashed ring-[#bc1888]/40"
                : "text-inherit"
            }`}
            title={`Click to edit ${field}`}
          >
            <Icon size={24} />
            <b className="text-xs font-bold mt-1 flex items-center gap-0.5">
              {value}
              {isEditMode && <Pencil size={9} className="text-[#bc1888]" />}
            </b>
          </button>
        ))}
      </div>
    </section>
  );
}

function Tabs({ current, onChange }: { current: Tab; onChange: (tab: Tab) => void }) {
  return (
    <div className="iv-tabs" role="tablist">
      {(["overview", "engagement", "audience"] as const).map((tab) => (
        <button
          type="button"
          role="tab"
          aria-selected={current === tab}
          className={current === tab ? "active font-bold" : ""}
          onClick={() => onChange(tab)}
          key={tab}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}

function OverviewTab({
  insights,
  imgUrl,
  isEditMode,
  onEditText,
  onEditRate,
  onEditPercentage,
  onEditYAxis,
  onOpenGraphEditor,
}: {
  insights: PostInsightsData;
  imgUrl: string;
  isEditMode: boolean;
  onEditText: (title: string, currentVal: string | number, onSave: (v: string) => void) => void;
  onEditRate: (
    key: "skip" | "share" | "like" | "save" | "repost" | "comment",
    label: string,
    currentRate: number,
    currentStatus: "Auto" | "Higher" | "Lower" | "Typical"
  ) => void;
  onEditPercentage: (title: string, currentVal: number, onSave: (v: number) => void) => void;
  onEditYAxis: () => void;
  onOpenGraphEditor: (target: "this_reel" | "typical_reel" | "watch_retention") => void;
}) {
  const [viewsFilter, setViewsFilter] = useState<ViewsFilter>("all");

  const impactRates = [
    {
      key: "skip" as const,
      Icon: IgSkipRate,
      label: "Skip rate",
      rate: `${insights.rates.skip.rate.toFixed(1)}%`,
      numRate: insights.rates.skip.rate,
      statusSetting: insights.rates.skip.status,
      status: calculateMetricStatus("Skip rate", insights.rates.skip.rate, insights.rates.skip.status),
    },
    {
      key: "share" as const,
      Icon: IgShare,
      label: "Share rate",
      rate: `${insights.rates.share.rate.toFixed(1)}%`,
      numRate: insights.rates.share.rate,
      statusSetting: insights.rates.share.status,
      status: calculateMetricStatus("Share rate", insights.rates.share.rate, insights.rates.share.status),
    },
    {
      key: "like" as const,
      Icon: IgHeart,
      label: "Like rate",
      rate: `${insights.rates.like.rate.toFixed(1)}%`,
      numRate: insights.rates.like.rate,
      statusSetting: insights.rates.like.status,
      status: calculateMetricStatus("Like rate", insights.rates.like.rate, insights.rates.like.status),
    },
    {
      key: "save" as const,
      Icon: IgBookmark,
      label: "Save rate",
      rate: `${insights.rates.save.rate.toFixed(1)}%`,
      numRate: insights.rates.save.rate,
      statusSetting: insights.rates.save.status,
      status: calculateMetricStatus("Save rate", insights.rates.save.rate, insights.rates.save.status),
    },
    {
      key: "repost" as const,
      Icon: IgRepost,
      label: "Repost rate",
      rate: `${insights.rates.repost.rate.toFixed(1)}%`,
      numRate: insights.rates.repost.rate,
      statusSetting: insights.rates.repost.status,
      status: calculateMetricStatus("Repost rate", insights.rates.repost.rate, insights.rates.repost.status),
    },
    {
      key: "comment" as const,
      Icon: IgComment,
      label: "Comment rate",
      rate: `${insights.rates.comment.rate.toFixed(1)}%`,
      numRate: insights.rates.comment.rate,
      statusSetting: insights.rates.comment.status,
      status: calculateMetricStatus("Comment rate", insights.rates.comment.rate, insights.rates.comment.status),
    },
  ];

  const viewSources: Array<{ key: keyof typeof insights.sources; label: string; pct: string; width: number }> = [
    { key: "reelsTab", label: "Reels tab", pct: `${insights.sources.reelsTab.toFixed(1)}%`, width: insights.sources.reelsTab },
    { key: "explore", label: "Explore", pct: `${insights.sources.explore.toFixed(1)}%`, width: insights.sources.explore },
    { key: "feed", label: "Feed", pct: `${insights.sources.feed.toFixed(1)}%`, width: insights.sources.feed },
    { key: "profile", label: "Profile", pct: `${insights.sources.profile.toFixed(1)}%`, width: insights.sources.profile },
    { key: "search", label: "Search", pct: `${insights.sources.search.toFixed(1)}%`, width: insights.sources.search },
  ];

  // Dynamic Views Spline SVG calculations
  const maxViewsCeiling = useMemo(() => {
    let maxVal = insights.views;
    insights.viewsThisReelPoints.forEach((p) => {
      if (p.value > maxVal) maxVal = p.value;
    });
    insights.viewsTypicalPoints.forEach((p) => {
      if (p.value > maxVal) maxVal = p.value;
    });
    return GraphSplineMath.computeMilestoneCeiling(maxVal, 2000);
  }, [insights]);

  const thisReelSvgPath = useMemo(() => {
    return GraphSplineMath.buildSvgPath(insights.viewsThisReelPoints, {
      maxX: 360,
      maxY: maxViewsCeiling,
      minY: 0,
      width: 340,
      height: 120,
      paddingTop: 12,
      paddingBottom: 15,
      paddingLeft: 5,
      paddingRight: 5,
    });
  }, [insights.viewsThisReelPoints, maxViewsCeiling]);

  const typicalReelSvgPath = useMemo(() => {
    return GraphSplineMath.buildSvgPath(insights.viewsTypicalPoints, {
      maxX: 360,
      maxY: maxViewsCeiling,
      minY: 0,
      width: 340,
      height: 120,
      paddingTop: 12,
      paddingBottom: 15,
      paddingLeft: 5,
      paddingRight: 5,
    });
  }, [insights.viewsTypicalPoints, maxViewsCeiling]);

  // Watch Retention Spline SVG
  const watchRetentionSvgPath = useMemo(() => {
    const maxSec = insights.reelDurationSeconds || 13;
    return GraphSplineMath.buildSvgPath(insights.watchRetentionPoints, {
      maxX: maxSec,
      maxY: 100,
      minY: 0,
      width: 340,
      height: 100,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 5,
      paddingRight: 5,
    });
  }, [insights.watchRetentionPoints, insights.reelDurationSeconds]);

  return (
    <div className="iv-tab-content">
      {/* Summary with 4 Stat Cards */}
      <section className="iv-section">
        <InfoTitle>Summary</InfoTitle>
        <div className="iv-summary-grid">
          {/* Card 1: Views */}
          <div
            onClick={
              isEditMode
                ? () =>
                    onEditText("Edit Views Count", insights.views, (v) => {
                      const parsed = GraphSplineMath.parseViews(v);
                      if (parsed >= 0) {
                        insights.views = parsed;
                        if (insights.viewsThisReelPoints.length > 0) {
                          insights.viewsThisReelPoints[insights.viewsThisReelPoints.length - 1].value = parsed;
                        }
                      }
                    })
                : undefined
            }
            className={`iv-card ${
              isEditMode ? "cursor-pointer hover:border-[#bc1888] ring-1 ring-dashed ring-[#bc1888]/40" : ""
            }`}
            title={isEditMode ? "Click to edit Views" : undefined}
          >
            <span className="iv-card-label flex items-center justify-between">
              <span>Views</span>
              {isEditMode && <Pencil size={11} className="text-[#bc1888]" />}
            </span>
            <strong className="iv-card-val">{insights.views.toLocaleString()}</strong>
          </div>

          {/* Card 2: Viewers */}
          <div
            onClick={
              isEditMode
                ? () =>
                    onEditText("Edit Viewers / Reach", insights.viewers, (v) => {
                      const parsed = GraphSplineMath.parseViews(v);
                      if (parsed >= 0) insights.viewers = parsed;
                    })
                : undefined
            }
            className={`iv-card ${
              isEditMode ? "cursor-pointer hover:border-[#bc1888] ring-1 ring-dashed ring-[#bc1888]/40" : ""
            }`}
            title={isEditMode ? "Click to edit Viewers" : undefined}
          >
            <span className="iv-card-label flex items-center justify-between">
              <span>Viewers</span>
              {isEditMode && <Pencil size={11} className="text-[#bc1888]" />}
            </span>
            <strong className="iv-card-val">{insights.viewers.toLocaleString()}</strong>
          </div>

          {/* Card 3: Avg watch time */}
          <div
            onClick={
              isEditMode
                ? () =>
                    onEditText("Edit Average Watch Time", insights.averageWatchTime || "13s", (v) => {
                      insights.averageWatchTime = v.trim() || "13s";
                    })
                : undefined
            }
            className={`iv-card ${
              isEditMode ? "cursor-pointer hover:border-[#bc1888] ring-1 ring-dashed ring-[#bc1888]/40" : ""
            }`}
            title={isEditMode ? "Click to edit Average Watch Time" : undefined}
          >
            <span className="iv-card-label flex items-center justify-between">
              <span>Average watch time</span>
              {isEditMode && <Pencil size={11} className="text-[#bc1888]" />}
            </span>
            <strong className="iv-card-val">{insights.averageWatchTime || "13s"}</strong>
          </div>

          {/* Card 4: Follows */}
          <div
            onClick={
              isEditMode
                ? () =>
                    onEditText("Edit Follows (Summary)", insights.followsSummary, (v) => {
                      const parsed = parseInt(v) || 0;
                      insights.followsSummary = parsed;
                    })
                : undefined
            }
            className={`iv-card ${
              isEditMode ? "cursor-pointer hover:border-[#bc1888] ring-1 ring-dashed ring-[#bc1888]/40" : ""
            }`}
            title={isEditMode ? "Click to edit Follows" : undefined}
          >
            <span className="iv-card-label flex items-center justify-between">
              <span>Follows</span>
              {isEditMode && <Pencil size={11} className="text-[#bc1888]" />}
            </span>
            <strong className="iv-card-val">{insights.followsSummary.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      {/* Views Over Time Graph */}
      <section className="iv-section">
        <div className="flex items-center justify-between mb-2">
          <InfoTitle>Views over time</InfoTitle>
          {isEditMode && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenGraphEditor("this_reel")}
                className="px-2 py-0.5 rounded-full bg-pink-50 text-[#bc1888] hover:bg-pink-100 font-bold text-[11px] border border-pink-200 cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
                title="Edit This Reel curve"
              >
                <i className="dot magenta" />
                <span>This reel</span>
                <Pencil size={10} />
              </button>
              <button
                type="button"
                onClick={() => onOpenGraphEditor("typical_reel")}
                className="px-2 py-0.5 rounded-full bg-gray-50 text-[#555] hover:bg-gray-100 font-bold text-[11px] border border-gray-200 cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
                title="Edit Typical Reel curve"
              >
                <i className="dot dashed" />
                <span>Typical</span>
                <Pencil size={10} />
              </button>
            </div>
          )}
        </div>

        <div className="iv-filter-pills" role="tablist">
          <button
            type="button"
            className={viewsFilter === "all" ? "active" : ""}
            onClick={() => setViewsFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={viewsFilter === "followers" ? "active" : ""}
            onClick={() => setViewsFilter("followers")}
          >
            Followers
          </button>
          <button
            type="button"
            className={viewsFilter === "non-followers" ? "active" : ""}
            onClick={() => setViewsFilter("non-followers")}
          >
            Non-followers
          </button>
        </div>

        <div className="iv-chart-container relative group">
          {/* Y-Axis scale (Clickable in edit mode to customize Max/Mid/Start values) */}
          <div
            onClick={isEditMode ? onEditYAxis : undefined}
            className={`iv-chart-y-axis ${isEditMode ? "cursor-pointer hover:text-[#bc1888]" : ""} transition-colors`}
            title={isEditMode ? "Click to edit Y-Axis values" : undefined}
          >
            <span className="font-bold">
              {insights.viewsGraphMax || GraphSplineMath.formatViews(maxViewsCeiling)}
            </span>
            <span className="font-bold">
              {insights.viewsGraphMid || GraphSplineMath.formatViews(maxViewsCeiling / 2)}
            </span>
            <span className="font-bold">{insights.viewsGraphStart || "0"}</span>
          </div>

          <div
            className={`iv-chart-area ${isEditMode ? "cursor-pointer" : ""}`}
            onClick={isEditMode ? () => onOpenGraphEditor("this_reel") : undefined}
            title={isEditMode ? "Click to open interactive graph drag editor" : undefined}
          >
            <svg
              viewBox="0 0 340 120"
              preserveAspectRatio="none"
              className="iv-views-svg w-full h-full"
            >
              <line x1="0" y1="12" x2="340" y2="12" className="iv-grid-line" />
              <line x1="0" y1="60" x2="340" y2="60" className="iv-grid-line" />
              <line x1="0" y1="108" x2="340" y2="108" className="iv-grid-line" />

              {/* Typical reel dashed curve */}
              {typicalReelSvgPath && (
                <path
                  d={typicalReelSvgPath}
                  className="iv-typical-curve"
                  fill="none"
                  strokeWidth="2.2"
                  strokeDasharray="4,4"
                />
              )}

              {/* This reel magenta spline curve */}
              {thisReelSvgPath && (
                <path
                  d={thisReelSvgPath}
                  className="iv-reel-curve"
                  fill="none"
                  strokeWidth="2.6"
                />
              )}
            </svg>

            {/* X-Axis Dates */}
            <div
              className={`iv-chart-x-axis ${isEditMode ? "cursor-pointer hover:text-[#bc1888]" : ""} transition-colors`}
              onClick={
                isEditMode
                  ? (e) => {
                      e.stopPropagation();
                      onEditText("Edit Start Date Milestone", insights.viewsGraphDates[0], (v) => {
                        insights.viewsGraphDates[0] = v.trim() || insights.viewsGraphDates[0];
                      });
                    }
                  : undefined
              }
              title={isEditMode ? "Click to edit date milestones" : undefined}
            >
              <span>{insights.viewsGraphDates[0]}</span>
              <span>{insights.viewsGraphDates[1]}</span>
              <span>{insights.viewsGraphDates[2]}</span>
            </div>
          </div>
        </div>

        {/* Legend buttons to select curve to edit */}
        <div className="iv-chart-legend">
          <button
            type="button"
            onClick={isEditMode ? () => onOpenGraphEditor("this_reel") : undefined}
            className={`iv-legend-item bg-transparent border-none ${
              isEditMode ? "cursor-pointer hover:opacity-80" : "cursor-default"
            } flex items-center gap-1 font-bold text-xs`}
            title={isEditMode ? "Click to edit This Reel curve" : undefined}
          >
            <i className="dot magenta" />
            <span>This reel</span>
            {isEditMode && <Pencil size={10} className="text-[#bc1888]" />}
          </button>
          <button
            type="button"
            onClick={isEditMode ? () => onOpenGraphEditor("typical_reel") : undefined}
            className={`iv-legend-item bg-transparent border-none ${
              isEditMode ? "cursor-pointer hover:opacity-80" : "cursor-default"
            } flex items-center gap-1 font-bold text-xs`}
            title={isEditMode ? "Click to edit Typical Reel curve" : undefined}
          >
            <i className="dot dashed" />
            <span>Your typical reel</span>
            {isEditMode && <Pencil size={10} className="text-[#737373]" />}
          </button>
        </div>
      </section>

      {/* What impacts your views */}
      <section className="iv-section">
        <InfoTitle>What impacts your views</InfoTitle>
        <p className="iv-section-sub">Rates are listed in order of importance to reach.</p>
        <div className="iv-rates-list">
          {impactRates.map(({ key, Icon, label, rate, numRate, statusSetting, status }) => (
            <div
              key={label}
              onClick={isEditMode ? () => onEditRate(key, label, numRate, statusSetting) : undefined}
              className={`iv-rate-row transition-colors ${
                isEditMode ? "cursor-pointer hover:bg-pink-50/50" : ""
              }`}
              title={isEditMode ? `Click to edit ${label}` : undefined}
            >
              <div className="iv-rate-badge">
                <Icon size={22} />
              </div>
              <span className="iv-rate-label flex items-center gap-1">
                <span>{label}</span>
                {isEditMode && <Pencil size={10} className="text-[#bc1888]" />}
              </span>
              <div className="iv-rate-right flex items-center gap-2">
                <strong className="iv-rate-pct">{rate}</strong>
                <span
                  className={`iv-rate-tag ${
                    status.isGreen ? "green" : status.isRed ? "red" : "grey"
                  }`}
                  style={{ color: status.color }}
                >
                  {status.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How long people watched your reel */}
      <section className="iv-section">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`flex items-center gap-1.5 ${
              isEditMode ? "cursor-pointer hover:opacity-80" : ""
            }`}
            onClick={isEditMode ? () => onOpenGraphEditor("watch_retention") : undefined}
            title={isEditMode ? "Click to edit watch retention graph" : undefined}
          >
            <InfoTitle>How long people watched your reel</InfoTitle>
            {isEditMode && <Pencil size={12} className="text-[#bc1888]" />}
          </div>
          {isEditMode && (
            <button
              type="button"
              onClick={() => onOpenGraphEditor("watch_retention")}
              className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[#bc1888] hover:bg-pink-100 font-bold text-[11px] border border-pink-200 cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
              title="Edit Watch Retention curve"
            >
              <Pencil size={10} />
              <span>Edit Graph</span>
            </button>
          )}
        </div>

        <div
          className={`iv-video-card-wrap ${isEditMode ? "cursor-pointer group" : ""}`}
          onClick={isEditMode ? () => onOpenGraphEditor("watch_retention") : undefined}
          title={isEditMode ? "Click to edit watch retention curve & duration" : undefined}
        >
          <div className="iv-video-card">
            <img
              src={insights.customThumbnailUrl || imgUrl}
              alt="Video preview"
              width={110}
              height={165}
              className="object-cover"
            />
            <div className="iv-video-play-badge">
              <Play size={20} fill="#ffffff" stroke="#ffffff" />
            </div>
          </div>
        </div>

        <div
          className={`iv-chart-container ${isEditMode ? "cursor-pointer group" : ""}`}
          onClick={isEditMode ? () => onOpenGraphEditor("watch_retention") : undefined}
          title={isEditMode ? "Click to open interactive watch retention curve editor" : undefined}
        >
          <div className="iv-chart-y-axis">
            <span>100%</span>
            <span>50%</span>
            <span>0</span>
          </div>
          <div className="iv-chart-area">
            <svg
              viewBox="0 0 340 100"
              preserveAspectRatio="none"
              className="iv-retention-svg w-full h-full"
            >
              <line x1="0" y1="10" x2="340" y2="10" className="iv-grid-line" />
              <line x1="0" y1="50" x2="340" y2="50" className="iv-grid-line" />
              <line x1="0" y1="90" x2="340" y2="90" className="iv-grid-line" />
              {/* Retention Spline Curve */}
              {watchRetentionSvgPath && (
                <path
                  d={watchRetentionSvgPath}
                  className="iv-reel-curve"
                  fill="none"
                  strokeWidth="2.6"
                />
              )}
            </svg>
            <div className="iv-chart-x-axis">
              <span>0:00</span>
              <span>0:{insights.reelDurationSeconds.toString().padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top sources of views */}
      <section className="iv-section">
        <InfoTitle>Top sources of views</InfoTitle>
        <div className="iv-sources-list">
          {viewSources.map(({ key, label, pct, width }) => (
            <div
              key={label}
              onClick={
                isEditMode
                  ? () =>
                      onEditPercentage(`Edit ${label} %`, width, (v) => {
                        insights.sources[key] = v;
                      })
                  : undefined
              }
              className={`iv-source-row transition-colors ${
                isEditMode ? "cursor-pointer hover:bg-gray-50" : ""
              }`}
              title={isEditMode ? `Click to edit ${label} %` : undefined}
            >
              <span className="iv-source-label flex items-center gap-1">
                <span>{label}</span>
                {isEditMode && <Pencil size={10} className="text-[#bc1888]" />}
              </span>
              <div className="iv-source-bar-row">
                <div className="iv-progress-track">
                  <div
                    className="iv-progress-fill"
                    style={{ width: `${Math.min(100, Math.max(0, width))}%` }}
                  />
                </div>
                <strong className="iv-source-pct">{pct}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Section */}
      <section className="iv-section iv-ad-section no-border">
        <h3 className="iv-ad-title">Ad</h3>
        <button type="button" className="iv-ad-boost-row">
          <div className="iv-ad-boost-left">
            <TrendingUp size={20} strokeWidth={2.2} />
            <span>Boost this reel</span>
          </div>
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </section>
    </div>
  );
}

function EngagementTab({
  insights,
  imgUrl,
  isEditMode,
  onEditText,
  onOpenGraphEditor,
}: {
  insights: PostInsightsData;
  imgUrl: string;
  isEditMode: boolean;
  onEditText: (title: string, currentVal: string | number, onSave: (v: string) => void) => void;
  onOpenGraphEditor: (target: "likes_retention") => void;
}) {
  const interactions: Array<{
    field: "likes" | "comments" | "reposts" | "shares" | "saves";
    label: string;
    val: string;
    numVal: number;
  }> = [
    { field: "likes", label: "Likes", val: GraphSplineMath.formatViews(insights.likes), numVal: insights.likes },
    { field: "comments", label: "Comments", val: GraphSplineMath.formatViews(insights.comments), numVal: insights.comments },
    { field: "reposts", label: "Reposts", val: GraphSplineMath.formatViews(insights.reposts), numVal: insights.reposts },
    { field: "shares", label: "Shares", val: GraphSplineMath.formatViews(insights.shares), numVal: insights.shares },
    { field: "saves", label: "Saves", val: GraphSplineMath.formatViews(insights.saves), numVal: insights.saves },
  ];

  // Likes Retention Spline Curve
  const likesSvgPath = useMemo(() => {
    const maxSec = insights.reelDurationSeconds || 13;
    return GraphSplineMath.buildSvgPath(insights.likesRetentionPoints, {
      maxX: maxSec,
      maxY: 20,
      minY: 0,
      width: 340,
      height: 100,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 5,
      paddingRight: 5,
    });
  }, [insights.likesRetentionPoints, insights.reelDurationSeconds]);

  return (
    <div className="iv-tab-content">
      {/* Actions after viewing */}
      <section className="iv-section">
        <InfoTitle>Actions after viewing</InfoTitle>
        <div className="iv-list-table">
          <div
            onClick={
              isEditMode
                ? () =>
                    onEditText("Edit Follows (Engagement)", insights.followsEngagement, (v) => {
                      insights.followsEngagement = parseInt(v) || 0;
                    })
                : undefined
            }
            className={`iv-table-row transition-colors ${
              isEditMode ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
            title={isEditMode ? "Click to edit Follows" : undefined}
          >
            <span className="flex items-center gap-1">
              <span>Follows</span>
              {isEditMode && <Pencil size={10} className="text-[#bc1888]" />}
            </span>
            <strong>{insights.followsEngagement.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      {/* Interactions list */}
      <section className="iv-section">
        <InfoTitle>Interactions</InfoTitle>
        <div className="iv-list-table">
          {interactions.map(({ field, label, val, numVal }) => (
            <div
              key={label}
              onClick={
                isEditMode
                  ? () =>
                      onEditText(`Edit ${label}`, numVal, (v) => {
                        const parsed = GraphSplineMath.parseViews(v);
                        if (parsed >= 0) insights[field] = parsed;
                      })
                  : undefined
              }
              className={`iv-table-row transition-colors ${
                isEditMode ? "cursor-pointer hover:bg-gray-50" : ""
              }`}
              title={isEditMode ? `Click to edit ${label}` : undefined}
            >
              <span className="flex items-center gap-1">
                <span>{label}</span>
                {isEditMode && <Pencil size={10} className="text-[#bc1888]" />}
              </span>
              <strong>{val}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* When people liked your reel */}
      <section className="iv-section no-border">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`flex items-center gap-1.5 ${
              isEditMode ? "cursor-pointer hover:opacity-80" : ""
            }`}
            onClick={isEditMode ? () => onOpenGraphEditor("likes_retention") : undefined}
            title={isEditMode ? "Click to edit likes retention graph" : undefined}
          >
            <InfoTitle>When people liked your reel</InfoTitle>
            {isEditMode && <Pencil size={12} className="text-[#bc1888]" />}
          </div>
          {isEditMode && (
            <button
              type="button"
              onClick={() => onOpenGraphEditor("likes_retention")}
              className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[#bc1888] hover:bg-pink-100 font-bold text-[11px] border border-pink-200 cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
              title="Edit Likes Retention curve"
            >
              <Pencil size={10} />
              <span>Edit Graph</span>
            </button>
          )}
        </div>

        <div
          className={`iv-video-card-wrap ${isEditMode ? "cursor-pointer group" : ""}`}
          onClick={isEditMode ? () => onOpenGraphEditor("likes_retention") : undefined}
          title={isEditMode ? "Click to edit likes retention curve & timing" : undefined}
        >
          <div className="iv-video-card">
            <img
              src={insights.customThumbnailUrl || imgUrl}
              alt="Video preview"
              width={110}
              height={165}
              className="object-cover"
            />
            <div className="iv-video-play-badge">
              <Play size={20} fill="#ffffff" stroke="#ffffff" />
            </div>
          </div>
        </div>

        <div
          className={`iv-chart-container ${isEditMode ? "cursor-pointer group" : ""}`}
          onClick={isEditMode ? () => onOpenGraphEditor("likes_retention") : undefined}
          title={isEditMode ? "Click to open interactive likes retention curve editor" : undefined}
        >
          <div className="iv-chart-y-axis">
            <span>20%</span>
            <span>10%</span>
            <span>0</span>
          </div>
          <div className="iv-chart-area">
            <svg
              viewBox="0 0 340 100"
              preserveAspectRatio="none"
              className="iv-retention-svg w-full h-full"
            >
              <line x1="0" y1="10" x2="340" y2="10" className="iv-grid-line" />
              <line x1="0" y1="50" x2="340" y2="50" className="iv-grid-line" />
              <line x1="0" y1="90" x2="340" y2="90" className="iv-grid-line" />
              {likesSvgPath && (
                <path
                  d={likesSvgPath}
                  className="iv-reel-curve"
                  fill="none"
                  strokeWidth="2.6"
                />
              )}
            </svg>
            <div className="iv-chart-x-axis">
              <span>0:00</span>
              <span>0:{insights.reelDurationSeconds.toString().padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AudienceTab({
  insights,
  isEditMode,
  onEditPercentage,
}: {
  insights: PostInsightsData;
  isEditMode: boolean;
  onEditPercentage: (title: string, currentVal: number, onSave: (v: number) => void) => void;
}) {
  const [detailTab, setDetailTab] = useState<AudienceDetailTab>("age");

  const countryData = insights.countries.map((c) => ({
    label: c.name,
    pct: `${c.percentage.toFixed(1)}%`,
    width: c.percentage,
  }));

  const ageData: Array<{ key: keyof typeof insights.age; label: string; pct: string; width: number }> = [
    { key: "age13_17", label: "13-17", pct: `${insights.age.age13_17.toFixed(1)}%`, width: insights.age.age13_17 },
    { key: "age18_24", label: "18-24", pct: `${insights.age.age18_24.toFixed(1)}%`, width: insights.age.age18_24 },
    { key: "age25_34", label: "25-34", pct: `${insights.age.age25_34.toFixed(1)}%`, width: insights.age.age25_34 },
    { key: "age35_44", label: "35-44", pct: `${insights.age.age35_44.toFixed(1)}%`, width: insights.age.age35_44 },
    { key: "age45_54", label: "45-54", pct: `${insights.age.age45_54.toFixed(1)}%`, width: insights.age.age45_54 },
    { key: "age55_64", label: "55-64", pct: `${insights.age.age55_64.toFixed(1)}%`, width: insights.age.age55_64 },
    { key: "age65Plus", label: "65+", pct: `${insights.age.age65Plus.toFixed(1)}%`, width: insights.age.age65Plus },
  ];

  const genderData = [
    { label: "Men", pct: `${insights.gender.men.toFixed(1)}%`, width: insights.gender.men },
    {
      label: "Women",
      pct: `${insights.gender.women.toFixed(1)}%`,
      width: insights.gender.women,
      purple: true,
    },
  ];

  const currentDetails =
    detailTab === "country" ? countryData : detailTab === "age" ? ageData : genderData;

  return (
    <div className="iv-tab-content">
      {/* Who viewed your reel */}
      <section className="iv-section">
        <InfoTitle>Who viewed your reel</InfoTitle>
        <div className="iv-sources-list">
          <div
            onClick={
              isEditMode
                ? () =>
                    onEditPercentage("Edit Followers %", insights.followersPct, (v) => {
                      insights.followersPct = v;
                      insights.nonFollowersPct = Number((100 - v).toFixed(1));
                    })
                : undefined
            }
            className={`iv-source-row transition-colors ${
              isEditMode ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
            title={isEditMode ? "Click to edit Followers %" : undefined}
          >
            <span className="iv-source-label flex items-center gap-1">
              <span>Followers</span>
              {isEditMode && <Pencil size={10} className="text-[#bc1888]" />}
            </span>
            <div className="iv-source-bar-row">
              <div className="iv-progress-track">
                <div
                  className="iv-progress-fill magenta"
                  style={{ width: `${insights.followersPct}%` }}
                />
              </div>
              <strong className="iv-source-pct">{insights.followersPct.toFixed(1)}%</strong>
            </div>
          </div>
          <div
            onClick={
              isEditMode
                ? () =>
                    onEditPercentage("Edit Non-Followers %", insights.nonFollowersPct, (v) => {
                      insights.nonFollowersPct = v;
                      insights.followersPct = Number((100 - v).toFixed(1));
                    })
                : undefined
            }
            className={`iv-source-row transition-colors ${
              isEditMode ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
            title={isEditMode ? "Click to edit Non-Followers %" : undefined}
          >
            <span className="iv-source-label flex items-center gap-1">
              <span>Non-followers</span>
              {isEditMode && <Pencil size={10} className="text-[#bc1888]" />}
            </span>
            <div className="iv-source-bar-row">
              <div className="iv-progress-track">
                <div
                  className="iv-progress-fill purple"
                  style={{ width: `${insights.nonFollowersPct}%` }}
                />
              </div>
              <strong className="iv-source-pct">{insights.nonFollowersPct.toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Audience details */}
      <section className="iv-section no-border">
        <InfoTitle>Audience details</InfoTitle>
        <div className="iv-filter-pills" role="tablist">
          <button
            type="button"
            className={detailTab === "age" ? "active" : ""}
            onClick={() => setDetailTab("age")}
          >
            Age
          </button>
          <button
            type="button"
            className={detailTab === "country" ? "active" : ""}
            onClick={() => setDetailTab("country")}
          >
            Country
          </button>
          <button
            type="button"
            className={detailTab === "gender" ? "active" : ""}
            onClick={() => setDetailTab("gender")}
          >
            Gender
          </button>
        </div>

        <div className="iv-sources-list">
          {currentDetails.map((item, idx) => (
            <div
              key={item.label}
              onClick={
                isEditMode
                  ? () => {
                      if (detailTab === "age") {
                        const key = (item as any).key as keyof typeof insights.age;
                        onEditPercentage(`Edit Age ${item.label} %`, item.width, (v) => {
                          insights.age[key] = v;
                        });
                      } else if (detailTab === "gender") {
                        onEditPercentage(`Edit ${item.label} %`, item.width, (v) => {
                          if (item.label === "Men") {
                            insights.gender.men = v;
                            insights.gender.women = Number((100 - v).toFixed(1));
                          } else {
                            insights.gender.women = v;
                            insights.gender.men = Number((100 - v).toFixed(1));
                          }
                        });
                      } else if (detailTab === "country") {
                        onEditPercentage(`Edit ${item.label} %`, item.width, (v) => {
                          if (insights.countries[idx]) {
                            insights.countries[idx].percentage = v;
                          }
                        });
                      }
                    }
                  : undefined
              }
              className={`iv-source-row transition-colors ${
                isEditMode ? "cursor-pointer hover:bg-gray-50" : ""
              }`}
              title={isEditMode ? `Click to edit ${item.label} %` : undefined}
            >
              <span className="iv-source-label flex items-center gap-1">
                <span>{item.label}</span>
                {isEditMode && <Pencil size={10} className="text-[#bc1888]" />}
              </span>
              <div className="iv-source-bar-row">
                <div className="iv-progress-track">
                  <div
                    className={`iv-progress-fill ${
                      (item as any).purple ? "purple" : "magenta"
                    }`}
                    style={{ width: `${Math.min(100, item.width)}%` }}
                  />
                </div>
                <strong className="iv-source-pct">{item.pct}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function InsightViewPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);

  // Direct Field Edit Dialog State
  const [textDialog, setTextDialog] = useState<{
    isOpen: boolean;
    title: string;
    currentVal: string | number;
    onSave: (v: string) => void;
  }>({
    isOpen: false,
    title: "",
    currentVal: "",
    onSave: () => {},
  });

  const [rateDialog, setRateDialog] = useState<{
    isOpen: boolean;
    key: "skip" | "share" | "like" | "save" | "repost" | "comment";
    label: string;
    currentRate: number;
    currentStatus: "Auto" | "Higher" | "Lower" | "Typical";
  }>({
    isOpen: false,
    key: "skip",
    label: "",
    currentRate: 0,
    currentStatus: "Auto",
  });

  const [percentageDialog, setPercentageDialog] = useState<{
    isOpen: boolean;
    title: string;
    currentVal: number;
    onSave: (v: number) => void;
  }>({
    isOpen: false,
    title: "",
    currentVal: 0,
    onSave: () => {},
  });

  const [yAxisDialog, setYAxisDialog] = useState(false);

  // Interactive Graph Line Drag Modal State
  const [interactiveGraphTarget, setInteractiveGraphTarget] = useState<
    "this_reel" | "typical_reel" | "watch_retention" | "likes_retention" | null
  >(null);

  const { profile } = useProfile();
  const post = profile.posts[profile.selectedPostIndex] || profile.posts[0] || null;
  const postId = post?.id || post?.shortcode || "default_post";
  const imgUrl = post?.thumbnail_src || post?.display_url || reelMachine;

  // Load post insights tied specifically to this post ID
  const [insights, setInsights] = useState<PostInsightsData>(() =>
    loadPostInsights(postId, {
      likes: post?.likes,
      comments: post?.comments,
      views: post?.views,
      thumbnailUrl: imgUrl,
    })
  );

  // Sync if selected post changes
  useEffect(() => {
    const loaded = loadPostInsights(postId, {
      likes: post?.likes,
      comments: post?.comments,
      views: post?.views,
      thumbnailUrl: imgUrl,
    });
    setInsights(loaded);
  }, [postId, post?.likes, post?.comments, post?.views, imgUrl]);

  const handleSaveInsights = (updated: PostInsightsData) => {
    const copy = { ...updated };
    setInsights(copy);
    savePostInsights(copy);
  };

  const handleResetInsights = () => {
    const fresh = getDefaultPostInsights(postId, {
      likes: post?.likes,
      comments: post?.comments,
      views: post?.views,
      thumbnailUrl: imgUrl,
    });
    setInsights(fresh);
    savePostInsights(fresh);
  };

  return (
    <main className="iv-page min-h-screen bg-page text-ink">
      <div className="iv-phone pb-28">
        <InsightHeader
          isEditMode={isEditMode}
          onToggleEditMode={() => setIsEditMode(!isEditMode)}
          onOpenFullModal={() => setIsFullModalOpen(true)}
          onResetInsights={handleResetInsights}
        />

        {/* Edit Mode Banner when activated */}
        {isEditMode && (
          <div className="bg-gradient-to-r from-[#f09433]/15 via-[#dc2743]/15 to-[#bc1888]/15 border-y border-[#bc1888]/30 px-4 py-2.5 flex items-center justify-between text-xs animate-fade-in">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles size={16} className="text-[#bc1888] shrink-0" />
              <span className="font-bold text-ink truncate">
                Tap any field or graph to edit
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsFullModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#bc1888] hover:bg-[#a01372] text-white font-bold text-[11px] border-none cursor-pointer transition-colors shadow-sm"
              >
                Customize All
              </button>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="p-1 rounded text-subtle hover:text-ink bg-transparent border-none cursor-pointer"
                title="Exit edit mode"
              >
                Done
              </button>
            </div>
          </div>
        )}

        <ReelPreviewAndMetrics
          insights={insights}
          displayImage={imgUrl}
          isEditMode={isEditMode}
          onEditField={(field, currentNum) => {
            setTextDialog({
              isOpen: true,
              title: `Edit ${field.charAt(0).toUpperCase() + field.slice(1)} Count`,
              currentVal: currentNum,
              onSave: (v) => {
                const parsed = GraphSplineMath.parseViews(v);
                if (parsed >= 0) {
                  const updated = { ...insights, [field]: parsed };
                  handleSaveInsights(updated);
                }
              },
            });
          }}
        />

        <Tabs current={tab} onChange={setTab} />

        {tab === "overview" && (
          <OverviewTab
            insights={insights}
            imgUrl={imgUrl}
            isEditMode={isEditMode}
            onEditText={(title, currentVal, onSaveField) => {
              setTextDialog({
                isOpen: true,
                title,
                currentVal,
                onSave: (v) => {
                  onSaveField(v);
                  handleSaveInsights({ ...insights });
                },
              });
            }}
            onEditRate={(key, label, currentRate, currentStatus) => {
              setRateDialog({
                isOpen: true,
                key,
                label,
                currentRate,
                currentStatus,
              });
            }}
            onEditPercentage={(title, currentVal, onSavePct) => {
              setPercentageDialog({
                isOpen: true,
                title,
                currentVal,
                onSave: (v) => {
                  onSavePct(v);
                  handleSaveInsights({ ...insights });
                },
              });
            }}
            onEditYAxis={() => setYAxisDialog(true)}
            onOpenGraphEditor={(target) => setInteractiveGraphTarget(target)}
          />
        )}
        {tab === "engagement" && (
          <EngagementTab
            insights={insights}
            imgUrl={imgUrl}
            isEditMode={isEditMode}
            onEditText={(title, currentVal, onSaveField) => {
              setTextDialog({
                isOpen: true,
                title,
                currentVal,
                onSave: (v) => {
                  onSaveField(v);
                  handleSaveInsights({ ...insights });
                },
              });
            }}
            onOpenGraphEditor={(target) => setInteractiveGraphTarget(target)}
          />
        )}
        {tab === "audience" && (
          <AudienceTab
            insights={insights}
            isEditMode={isEditMode}
            onEditPercentage={(title, currentVal, onSavePct) => {
              setPercentageDialog({
                isOpen: true,
                title,
                currentVal,
                onSave: (v) => {
                  onSavePct(v);
                  handleSaveInsights({ ...insights });
                },
              });
            }}
          />
        )}

        <FloatingBottomNav />
      </div>

      {/* 1. Single Field Text / Number Dialog */}
      <SingleTextEditDialog
        isOpen={textDialog.isOpen}
        onClose={() => setTextDialog((prev) => ({ ...prev, isOpen: false }))}
        title={textDialog.title}
        initialValue={textDialog.currentVal}
        isNumeric={true}
        onSave={textDialog.onSave}
      />

      {/* 2. Single Rate & Comparison Status Dialog */}
      <SingleRateEditDialog
        isOpen={rateDialog.isOpen}
        onClose={() => setRateDialog((prev) => ({ ...prev, isOpen: false }))}
        metricLabel={rateDialog.label}
        initialRate={rateDialog.currentRate}
        initialStatus={rateDialog.currentStatus}
        onSave={(newRate, newStatus) => {
          const updated: PostInsightsData = {
            ...insights,
            rates: {
              ...insights.rates,
              [rateDialog.key]: { rate: newRate, status: newStatus },
            },
          };
          handleSaveInsights(updated);
        }}
      />

      {/* 3. Single Percentage Slider Dialog */}
      <SinglePercentageEditDialog
        isOpen={percentageDialog.isOpen}
        onClose={() => setPercentageDialog((prev) => ({ ...prev, isOpen: false }))}
        title={percentageDialog.title}
        initialValue={percentageDialog.currentVal}
        onSave={(v) => {
          percentageDialog.onSave(v);
        }}
      />

      {/* 4. Y-Axis Custom Max/Mid/Start Scale Dialog */}
      <YAxisEditDialog
        isOpen={yAxisDialog}
        onClose={() => setYAxisDialog(false)}
        maxLabel={insights.viewsGraphMax || GraphSplineMath.formatViews(insights.views)}
        midLabel={insights.viewsGraphMid || GraphSplineMath.formatViews(insights.views / 2)}
        startLabel={insights.viewsGraphStart || "0"}
        onSave={(max, mid, start) => {
          const updated: PostInsightsData = {
            ...insights,
            viewsGraphMax: max,
            viewsGraphMid: mid,
            viewsGraphStart: start,
          };
          handleSaveInsights(updated);
        }}
      />

      {/* 5. Comprehensive Multi-Tab Modal */}
      <EditPostInsightModal
        isOpen={isFullModalOpen}
        onClose={() => setIsFullModalOpen(false)}
        data={insights}
        onSave={handleSaveInsights}
      />

      {/* 6. Direct Interactive Graph Line Editor Modal (This Reel, Typical Reel, Watch Retention, Likes Retention) */}
      <InteractiveGraphEditor
        isOpen={interactiveGraphTarget !== null}
        onClose={() => setInteractiveGraphTarget(null)}
        mode={
          interactiveGraphTarget === "this_reel"
            ? "views_this_reel"
            : interactiveGraphTarget === "typical_reel"
            ? "views_typical"
            : interactiveGraphTarget === "watch_retention"
            ? "watch_retention"
            : "likes_retention"
        }
        title={
          interactiveGraphTarget === "this_reel"
            ? "Edit Views Curve (This Reel)"
            : interactiveGraphTarget === "typical_reel"
            ? "Edit Typical Reel Curve (Dashed)"
            : interactiveGraphTarget === "watch_retention"
            ? "Edit Watch Retention Curve (How long people watched)"
            : "Edit Likes Curve (When people liked your reel)"
        }
        initialPoints={
          interactiveGraphTarget === "this_reel"
            ? insights.viewsThisReelPoints
            : interactiveGraphTarget === "typical_reel"
            ? insights.viewsTypicalPoints
            : interactiveGraphTarget === "watch_retention"
            ? insights.watchRetentionPoints
            : insights.likesRetentionPoints
        }
        totalViews={
          interactiveGraphTarget === "this_reel"
            ? insights.views
            : Math.round(insights.views * 0.6)
        }
        durationSeconds={insights.reelDurationSeconds}
        onSave={(newPoints, newTotal, newDuration) => {
          let updated: PostInsightsData;
          if (interactiveGraphTarget === "this_reel") {
            updated = {
              ...insights,
              views: newTotal,
              viewsThisReelPoints: newPoints,
            };
          } else if (interactiveGraphTarget === "typical_reel") {
            updated = {
              ...insights,
              viewsTypicalPoints: newPoints,
            };
          } else if (interactiveGraphTarget === "watch_retention") {
            updated = {
              ...insights,
              watchRetentionPoints: newPoints,
              ...(newDuration ? { reelDurationSeconds: newDuration } : {}),
            };
          } else {
            updated = {
              ...insights,
              likesRetentionPoints: newPoints,
              ...(newDuration ? { reelDurationSeconds: newDuration } : {}),
            };
          }
          handleSaveInsights(updated);
          setInteractiveGraphTarget(null);
        }}
      />
    </main>
  );
}
