import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  Heart,
  Info,
  MessageCircle,
  Play,
  Repeat2,
  Send,
  Store,
  UserRound,
  ExternalLink,
  Clock3,
} from "lucide-react";
import reelMachine from "@/assets/reel-machine.jpg";
import reelCasino from "@/assets/reel-casino.jpg";
import reelRoad from "@/assets/reel-road.jpg";

export const Route = createFileRoute("/insight-view")({
  head: () => ({
    meta: [
      { title: "Reel Insights — btwdorian" },
      {
        name: "description",
        content: "Detailed reel performance, engagement, and audience insights.",
      },
      { property: "og:title", content: "Reel Insights — btwdorian" },
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

const thumbnails = [reelMachine, reelCasino, reelRoad, reelCasino, reelMachine];
const reelMetrics = [
  { Icon: Heart, value: "48" },
  { Icon: MessageCircle, value: "2" },
  { Icon: Repeat2, value: "3" },
  { Icon: Send, value: "8" },
  { Icon: Bookmark, value: "6" },
];

function InfoTitle({ children }: { children: string }) {
  return (
    <h2 className="iv-title">
      {children}
      <Info aria-hidden="true" />
    </h2>
  );
}

function InsightHeader() {
  return (
    <>
      <div className="iv-status" aria-hidden="true">
        <strong>8:27</strong>
        <span className="iv-island">
          <i />
        </span>
        <span className="iv-network">
          ▮▮▮▮&nbsp; 5G&nbsp; <b>65</b>
        </span>
      </div>
      <header className="iv-header">
        <button type="button" aria-label="Back">
          <ChevronLeft />
        </button>
        <h1>Insights</h1>
        <button type="button" aria-label="Information">
          <Info />
        </button>
      </header>
    </>
  );
}

function ReelStrip() {
  return (
    <>
      <div className="iv-thumbnails" aria-label="Reel previews">
        {thumbnails.map((image, index) => (
          <div key={index}>
            <img src={image} alt="" width={300} height={170} />
          </div>
        ))}
      </div>
      <div className="iv-metric-icons">
        {reelMetrics.map(({ Icon, value }) => (
          <span key={value}>
            <Icon />
            <b>{value}</b>
          </span>
        ))}
      </div>
    </>
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

function InteractionSummary() {
  return (
    <section className="iv-section iv-summary">
      <div className="iv-summary-row">
        <span>Follows</span>
        <b>3</b>
      </div>
      <InfoTitle>Interactions</InfoTitle>
      {[
        ["Likes", "48"],
        ["Comments", "2"],
        ["Reposts", "3"],
        ["Shares", "8"],
        ["Saves", "6"],
      ].map(([label, value]) => (
        <div className="iv-summary-row" key={label}>
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
    </section>
  );
}

function RetentionSection() {
  return (
    <section className="iv-section">
      <InfoTitle>When people liked your reel</InfoTitle>
      <div className="iv-reel-preview">
        <img src={reelMachine} alt="Escalator reel preview" width={300} height={530} />
        <Play aria-hidden="true" />
      </div>
      <div className="iv-line-chart iv-retention-chart">
        <span className="iv-y top">50%</span>
        <span className="iv-y middle">25%</span>
        <span className="iv-y bottom">0</span>
        <svg viewBox="0 0 460 130" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="8" x2="460" y2="8" />
          <line x1="0" y1="63" x2="460" y2="63" />
          <line x1="0" y1="118" x2="460" y2="118" />
          <polyline points="4,25 16,70 33,92 50,82 67,116 100,116 120,114 145,116 166,114 190,116 217,116 233,104 249,116 267,108 285,116 309,116 327,114 345,116 458,116" />
        </svg>
        <div className="iv-x">
          <span>0:00</span>
          <span>0:28</span>
        </div>
      </div>
    </section>
  );
}

function PerformanceSection() {
  const rates = [
    [Clock3, "Skip rate", "57.2%"],
    [Send, "Share rate", "0.3%"],
    [Heart, "Like rate", "1.9%"],
    [Bookmark, "Save rate", "0.2%"],
    [Repeat2, "Repost rate", "0.1%"],
  ] as const;
  return (
    <section className="iv-section iv-performance">
      <div className="iv-filter-row">
        <button className="active">All</button>
        <button>Followers</button>
        <button>Non-followers</button>
      </div>
      <div className="iv-line-chart iv-compare-chart">
        <span className="iv-y top">3K</span>
        <span className="iv-y middle">1.5K</span>
        <span className="iv-y bottom">0</span>
        <svg viewBox="0 0 460 170" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="8" x2="460" y2="8" />
          <line x1="0" y1="86" x2="460" y2="86" />
          <line x1="0" y1="164" x2="460" y2="164" />
          <polyline className="main" points="4,164 22,26 43,21 160,17 300,16 394,14" />
          <polyline
            className="typical"
            points="4,164 22,146 80,146 150,143 235,143 315,138 455,137"
          />
        </svg>
        <div className="iv-x">
          <span>23 Aug</span>
          <span>2 Sep</span>
          <span>13 Sep</span>
        </div>
      </div>
      <div className="iv-chart-key">
        <span>
          <i className="main" />
          This reel
        </span>
        <span>
          <i />
          Your typical reel
        </span>
      </div>
      <InfoTitle>What affects your views</InfoTitle>
      <p className="iv-muted">Rates are listed in order of importance to reach.</p>
      <div className="iv-rate-list">
        {rates.map(([Icon, label, value]) => (
          <div key={label}>
            <span>
              <Icon />
            </span>
            <strong>{label}</strong>
            <b>{value}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function AudienceView() {
  const ages = [
    ["13–17", "7.6%", 8],
    ["18–24", "47.7%", 48],
    ["25–34", "37.0%", 37],
    ["35–44", "5.9%", 6],
    ["45–54", "1.1%", 1],
    ["55–64", "0.2%", 0.5],
    ["65+", "0", 0],
  ] as const;
  return (
    <>
      <section className="iv-section iv-audience">
        <InfoTitle>Who viewed your reel</InfoTitle>
        <AudienceBar label="Followers" value="5.8%" width={6} />
        <AudienceBar label="Non-followers" value="94.2%" width={94} purple />
        <InfoTitle>Audience details</InfoTitle>
        <div className="iv-filter-row">
          <button className="active">Age</button>
          <button>Country</button>
          <button>Gender</button>
        </div>
        <div className="iv-age-list">
          {ages.map(([label, value, width]) => (
            <AudienceBar key={label} label={label} value={value} width={width} />
          ))}
        </div>
        <div className="iv-country">
          <AudienceBar label="Nepal" value="0.3%" width={0.6} />
          <AudienceBar label="Colombia" value="0.2%" width={0.4} />
        </div>
      </section>
      <section className="iv-section iv-active-times">
        <InfoTitle>Follower active times</InfoTitle>
        <p className="iv-muted">Based on your current time zone (GMT+5:30)</p>
        <div className="iv-days">
          {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((day, i) => (
            <button className={i === 0 ? "active" : ""} key={day}>
              {day}
            </button>
          ))}
        </div>
        <div className="iv-columns">
          {[15, 20, 66, 72, 78, 76, 88, 60].map((height, i) => (
            <i style={{ height: `${height}%` }} key={i} />
          ))}
        </div>
        <div className="iv-hours">
          {["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"].map((hour) => (
            <span key={hour}>{hour}</span>
          ))}
        </div>
        <h3>When followers are most active</h3>
        {[
          ["Mondays", "18–21"],
          ["Tuesdays", "18–21"],
          ["Wednesdays", "18–21"],
        ].map(([day, time]) => (
          <p className="iv-active-day" key={day}>
            <b>{day}</b>
            <span>{time}</span>
          </p>
        ))}
      </section>
    </>
  );
}

function AudienceBar({
  label,
  value,
  width,
  purple = false,
}: {
  label: string;
  value: string;
  width: number;
  purple?: boolean;
}) {
  return (
    <div className="iv-audience-row">
      <span>{label}</span>
      <b>{value}</b>
      <div>
        <i className={purple ? "purple" : ""} style={{ width: `${Math.max(width, 0.4)}%` }} />
      </div>
    </div>
  );
}

function EngagementView() {
  const activities = [
    { Icon: UserRound, label: "Profile visits", value: "1,649" },
    { Icon: ExternalLink, label: "Bio link taps", value: "4" },
    { Icon: Store, label: "Business address taps", value: "0" },
  ];
  return (
    <>
      <InteractionSummary />
      <RetentionSection />
      <section className="iv-section iv-profile-activity">
        <InfoTitle>Profile activity</InfoTitle>
        {activities.map(({ Icon, label, value }) => (
          <div className="iv-activity-row" key={label}>
            <span>
              <Icon />
            </span>
            <strong>{label}</strong>
            <b>{value}</b>
          </div>
        ))}
      </section>
    </>
  );
}

function InsightViewPage() {
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <main className="iv-page">
      <div className="iv-phone">
        <InsightHeader />
        <ReelStrip />
        <Tabs current={tab} onChange={setTab} />
        {tab === "overview" ? (
          <>
            <InteractionSummary />
            <RetentionSection />
            <PerformanceSection />
          </>
        ) : null}
        {tab === "engagement" ? <EngagementView /> : null}
        {tab === "audience" ? <AudienceView /> : null}
      </div>
    </main>
  );
}
