import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  TrendingUp,
} from "lucide-react";
import {
  IgHeart,
  IgComment,
  IgRepost,
  IgShare,
  IgBookmark,
  IgClock,
} from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import reelMachine from "@/assets/reel-machine.jpg";

export const Route = createFileRoute("/insight-view")({
  head: () => ({
    meta: [
      { title: "Reel insights — btwdorian" },
      {
        name: "description",
        content: "Detailed reel performance, engagement, and audience insights for iPhone.",
      },
      { property: "og:title", content: "Reel insights — btwdorian" },
      {
        property: "og:description",
        content: "Detailed reel performance, engagement, and audience insights for iPhone.",
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

interface AudienceItem {
  label: string;
  pct: string;
  width: number;
  purple?: boolean;
}

function InfoTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="iv-title">
      <span>{children}</span>
      <Info size={16} className="iv-info-icon" aria-hidden="true" />
    </h2>
  );
}

function InsightHeader() {
  return (
    <header className="iv-header">
      <Link
        to="/insights"
        aria-label="Back to insights"
        title="Back to insights"
        className="iv-round-btn"
      >
        <ChevronLeft size={22} strokeWidth={2.4} />
      </Link>
      <h1>Reel insights</h1>
      <Link
        to="/dashboard"
        aria-label="Professional Dashboard"
        title="Dashboard"
        className="iv-round-btn"
      >
        <TrendingUp size={20} strokeWidth={2.2} />
      </Link>
    </header>
  );
}

function ReelPreviewAndMetrics() {
  const reelMetrics = [
    { Icon: IgHeart, value: "368" },
    { Icon: IgComment, value: "10" },
    { Icon: IgRepost, value: "4" },
    { Icon: IgShare, value: "4" },
    { Icon: IgBookmark, value: "0" },
  ];

  return (
    <section className="iv-top-strip">
      <Link
        to="/post-view"
        className="iv-thumb-wrap"
        aria-label="View Reel post"
        title="Watch Reel"
      >
        <img
          src={reelMachine}
          alt="Reel preview"
          width={118}
          height={210}
          className="iv-thumb-img"
        />
        <div className="iv-thumb-overlay">
          <p>
            POV: You grab the machine
            <br />
            before the guy who just blew
            <br />
            his paycheck can get back
            <br />
            from the ATM
          </p>
        </div>
      </Link>
      <div className="iv-metric-icons">
        {reelMetrics.map(({ Icon, value }, i) => (
          <span key={i}>
            <Icon size={24} />
            <b>{value}</b>
          </span>
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
          className={current === tab ? "active" : ""}
          onClick={() => onChange(tab)}
          key={tab}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}

function OverviewTab() {
  const [viewsFilter, setViewsFilter] = useState<ViewsFilter>("all");

  const impactRates = [
    { Icon: IgClock, label: "Skip rate", rate: "22.1%", status: "Lower", positive: true },
    { Icon: IgShare, label: "Share rate", rate: "0.1%", status: "Lower", positive: true },
    { Icon: IgHeart, label: "Like rate", rate: "8.8%", status: "Lower", positive: true },
    { Icon: IgBookmark, label: "Save rate", rate: "0.0%", status: "Lower", positive: true },
    { Icon: IgRepost, label: "Repost rate", rate: "0.1%", status: "Lower", positive: true },
    { Icon: IgComment, label: "Comment rate", rate: "0.2%", status: "Higher", positive: true },
  ];

  const viewSources = [
    { label: "Reels tab", pct: "22.9%", width: 22.9 },
    { label: "Feed", pct: "8.6%", width: 8.6 },
    { label: "Profile", pct: "4.5%", width: 4.5 },
    { label: "Stories", pct: "3.4%", width: 3.4 },
    { label: "Explore", pct: "1.5%", width: 1.5 },
  ];

  return (
    <div className="iv-tab-content">
      {/* Summary with 4 Stat Cards */}
      <section className="iv-section">
        <InfoTitle>Summary</InfoTitle>
        <div className="iv-summary-grid">
          <div className="iv-card">
            <span className="iv-card-label">Views</span>
            <strong className="iv-card-val">12,910</strong>
          </div>
          <div className="iv-card">
            <span className="iv-card-label">Viewers</span>
            <strong className="iv-card-val">4,168</strong>
          </div>
          <div className="iv-card">
            <span className="iv-card-label">Average watch time</span>
            <strong className="iv-card-val">13s</strong>
          </div>
          <div className="iv-card">
            <span className="iv-card-label">Follows</span>
            <strong className="iv-card-val">0</strong>
          </div>
        </div>
      </section>

      {/* Views Over Time */}
      <section className="iv-section">
        <InfoTitle>Views over time</InfoTitle>
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

        <div className="iv-chart-container">
          <div className="iv-chart-y-axis">
            <span>100K</span>
            <span>50K</span>
            <span>0</span>
          </div>
          <div className="iv-chart-area">
            <svg viewBox="0 0 340 120" preserveAspectRatio="none" className="iv-views-svg">
              <line x1="0" y1="10" x2="340" y2="10" className="iv-grid-line" />
              <line x1="0" y1="60" x2="340" y2="60" className="iv-grid-line" />
              <line x1="0" y1="110" x2="340" y2="110" className="iv-grid-line" />
              {/* Typical reel dashed curve */}
              <path
                d="M 5 110 Q 50 70, 120 56 T 240 45 T 335 40"
                className="iv-typical-curve"
                fill="none"
              />
              {/* This reel magenta curve */}
              <path
                d="M 5 110 L 25 100 L 90 99 L 180 99 L 260 99"
                className="iv-reel-curve"
                fill="none"
              />
            </svg>
            <div className="iv-chart-x-axis">
              <span>Aug 8</span>
              <span>Aug 15</span>
              <span>Aug 22</span>
            </div>
          </div>
        </div>

        <div className="iv-chart-legend">
          <span className="iv-legend-item">
            <i className="dot magenta" />
            This reel
          </span>
          <span className="iv-legend-item">
            <i className="dot dashed" />
            Your typical reel
          </span>
        </div>
      </section>

      {/* What impacts your views */}
      <section className="iv-section">
        <InfoTitle>What impacts your views</InfoTitle>
        <p className="iv-section-sub">Rates are listed in order of importance to reach.</p>
        <div className="iv-rates-list">
          {impactRates.map(({ Icon, label, rate, status }) => (
            <div className="iv-rate-row" key={label}>
              <div className="iv-rate-badge">
                <Icon size={22} />
              </div>
              <span className="iv-rate-label">{label}</span>
              <div className="iv-rate-right">
                <strong className="iv-rate-pct">{rate}</strong>
                <span className="iv-rate-tag green">{status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How long people watched your reel */}
      <section className="iv-section">
        <InfoTitle>How long people watched your reel</InfoTitle>
        <div className="iv-video-card-wrap">
          <div className="iv-video-card">
            <img src={reelMachine} alt="Video preview" width={110} height={165} />
            <div className="iv-video-play-badge">
              <Play size={20} fill="#ffffff" stroke="#ffffff" />
            </div>
          </div>
        </div>

        <div className="iv-chart-container">
          <div className="iv-chart-y-axis">
            <span>100%</span>
            <span>50%</span>
            <span>0</span>
          </div>
          <div className="iv-chart-area">
            <svg viewBox="0 0 340 100" preserveAspectRatio="none" className="iv-retention-svg">
              <line x1="0" y1="10" x2="340" y2="10" className="iv-grid-line" />
              <line x1="0" y1="50" x2="340" y2="50" className="iv-grid-line" />
              <line x1="0" y1="90" x2="340" y2="90" className="iv-grid-line" />
              {/* Retention curve */}
              <path
                d="M 5 10 L 45 22 L 95 30 L 115 70 L 155 75 L 210 80 L 260 85 L 335 88"
                className="iv-reel-curve"
                fill="none"
              />
            </svg>
            <div className="iv-chart-x-axis">
              <span>0:00</span>
              <span>0:13</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top sources of views */}
      <section className="iv-section">
        <InfoTitle>Top sources of views</InfoTitle>
        <div className="iv-sources-list">
          {viewSources.map(({ label, pct, width }) => (
            <div className="iv-source-row" key={label}>
              <span className="iv-source-label">{label}</span>
              <div className="iv-source-bar-row">
                <div className="iv-progress-track">
                  <div className="iv-progress-fill" style={{ width: `${width}%` }} />
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

function EngagementTab() {
  const interactions = [
    { label: "Likes", val: "368" },
    { label: "Comments", val: "10" },
    { label: "Reposts", val: "4" },
    { label: "Shares", val: "4" },
    { label: "Saves", val: "0" },
  ];

  return (
    <div className="iv-tab-content">
      {/* Top follows row */}
      <div className="iv-follows-row">
        <span className="iv-follows-label">Follows</span>
        <strong className="iv-follows-val">0</strong>
      </div>

      {/* Interactions list */}
      <section className="iv-section">
        <InfoTitle>Interactions</InfoTitle>
        <div className="iv-list-table">
          {interactions.map(({ label, val }) => (
            <div className="iv-table-row" key={label}>
              <span>{label}</span>
              <strong>{val}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* When people liked your reel */}
      <section className="iv-section no-border">
        <InfoTitle>When people liked your reel</InfoTitle>
        <div className="iv-video-card-wrap">
          <div className="iv-video-card">
            <img src={reelMachine} alt="Video preview" width={110} height={165} />
            <div className="iv-video-play-badge">
              <Play size={20} fill="#ffffff" stroke="#ffffff" />
            </div>
          </div>
        </div>

        <div className="iv-chart-container">
          <div className="iv-chart-y-axis">
            <span>20%</span>
            <span>10%</span>
            <span>0</span>
          </div>
          <div className="iv-chart-area">
            <svg viewBox="0 0 340 100" preserveAspectRatio="none" className="iv-retention-svg">
              <line x1="0" y1="10" x2="340" y2="10" className="iv-grid-line" />
              <line x1="0" y1="50" x2="340" y2="50" className="iv-grid-line" />
              <line x1="0" y1="90" x2="340" y2="90" className="iv-grid-line" />
              {/* Liked curve from page 4.jpeg */}
              <path
                d="M 5 45 L 35 20 L 70 52 L 95 60 L 130 80 L 160 52 L 205 60 L 235 84 L 270 96 L 305 92 L 335 86"
                className="iv-reel-curve"
                fill="none"
              />
            </svg>
            <div className="iv-chart-x-axis">
              <span>0:00</span>
              <span>0:13</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AudienceTab() {
  const [detailTab, setDetailTab] = useState<AudienceDetailTab>("country");

  const countryData: AudienceItem[] = [
    { label: "United States", pct: "33.4%", width: 33.4 },
    { label: "India", pct: "30.6%", width: 30.6 },
    { label: "Brazil", pct: "7.4%", width: 7.4 },
    { label: "Indonesia", pct: "2.4%", width: 2.4 },
    { label: "Canada", pct: "2.4%", width: 2.4 },
  ];

  const ageData: AudienceItem[] = [
    { label: "13-17", pct: "5.4%", width: 5.4 },
    { label: "18-24", pct: "42.3%", width: 42.3 },
    { label: "25-34", pct: "36.9%", width: 36.9 },
    { label: "35-44", pct: "9.5%", width: 9.5 },
    { label: "45-54", pct: "3.1%", width: 3.1 },
    { label: "55-64", pct: "1.3%", width: 1.3 },
    { label: "65+", pct: "1.5%", width: 1.5 },
  ];

  const genderData: AudienceItem[] = [
    { label: "Men", pct: "81.9%", width: 81.9 },
    { label: "Women", pct: "18.1%", width: 18.1, purple: true },
  ];

  const currentDetails =
    detailTab === "country" ? countryData : detailTab === "age" ? ageData : genderData;

  return (
    <div className="iv-tab-content">
      {/* Who viewed your reel */}
      <section className="iv-section">
        <InfoTitle>Who viewed your reel</InfoTitle>
        <div className="iv-sources-list">
          <div className="iv-source-row">
            <span className="iv-source-label">Followers</span>
            <div className="iv-source-bar-row">
              <div className="iv-progress-track">
                <div className="iv-progress-fill magenta" style={{ width: "20.9%" }} />
              </div>
              <strong className="iv-source-pct">20.9%</strong>
            </div>
          </div>
          <div className="iv-source-row">
            <span className="iv-source-label">Non-followers</span>
            <div className="iv-source-bar-row">
              <div className="iv-progress-track">
                <div className="iv-progress-fill purple" style={{ width: "79.1%" }} />
              </div>
              <strong className="iv-source-pct">79.1%</strong>
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
          {currentDetails.map((item) => (
            <div className="iv-source-row" key={item.label}>
              <span className="iv-source-label">{item.label}</span>
              <div className="iv-source-bar-row">
                <div className="iv-progress-track">
                  <div
                    className={`iv-progress-fill ${item.purple ? "purple" : "magenta"}`}
                    style={{ width: `${item.width}%` }}
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

  return (
    <main className="iv-page">
      <div className="iv-phone pb-28">
        <InsightHeader />
        <ReelPreviewAndMetrics />
        <Tabs current={tab} onChange={setTab} />
        {tab === "overview" && <OverviewTab />}
        {tab === "engagement" && <EngagementTab />}
        {tab === "audience" && <AudienceTab />}
        <FloatingBottomNav />
      </div>
    </main>
  );
}
