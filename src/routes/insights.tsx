import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { isRuntimeSecurityValid, crashAppSecurityPanic } from "@/lib/access-code-service";
import {
  ChevronDown,
  ChevronLeft,
  Eye,
  Heart,
  Info,
  MessageCircle,
  Repeat2,
  Store,
  SquareArrowOutUpRight,
  UserRound,
} from "lucide-react";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import reelRoad from "@/assets/reel-road.jpg";
import reelCasino from "@/assets/reel-casino.jpg";
import reelMachine from "@/assets/reel-machine.jpg";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Instagram" },
      {
        name: "description",
        content:
          "Account insights: views, net followers, interactions by content type and profile activity for the last 30 days.",
      },
      { property: "og:title", content: "Insights — Instagram" },
      {
        property: "og:description",
        content:
          "Account insights: views, net followers, interactions by content type and profile activity for the last 30 days.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InsightsPage,
});

const summaryCards = [
  { label: "Views", value: "1,565,170", active: true },
  { label: "Net followers", value: "+125" },
  { label: "Interactions", value: "191,5" },
];

const thumbs = [
  { image: reelMachine, views: "385K" },
  { image: reelCasino, views: "221K" },
  { image: reelRoad, views: "142K" },
  { image: reelMachine, views: "38K" },
];

const viewBars = [
  { label: "Reels", value: "1.5M", pct: 100 },
  { label: "Stories", value: "15K", pct: 3 },
];

const interactionBars = [
  { label: "Reels", value: "191K", pct: 100 },
  { label: "Stories", value: "137", pct: 0 },
  { label: "Posts", value: "9", pct: 0 },
  { label: "Live videos", value: "0", pct: 0 },
];

const activity = [
  { label: "Profile visits", value: "4,729", icon: UserRound },
  { label: "Bio link taps", value: "72", icon: SquareArrowOutUpRight },
  { label: "Business address taps", value: "0", icon: Store },
];

const chips = [
  { label: "All", icon: null },
  { label: "Likes", icon: Heart },
  { label: "Comments", icon: MessageCircle },
  { label: "Reposts", icon: Repeat2 },
];

function Legend() {
  return (
    <div className="in-legend">
      <span className="dot a" /> Followers
      <span className="dot b" /> Non-followers
    </div>
  );
}

function InsightsPage() {
  return (
    <main className="min-h-screen bg-page text-ink">
      <div className="phone-shell pb-24">
        <header className="dash-nav">
          <Link
            to="/profile"
            aria-label="Back to profile"
            className="dash-round"
            title="Back to profile"
          >
            <ChevronLeft />
          </Link>
          <h1>Insights</h1>
          <Link
            to="/insight-view"
            aria-label="Reel insights"
            className="dash-round"
            title="Detailed Reel Insights"
          >
            <Info />
          </Link>
        </header>

        <div className="in-tabs" role="tablist">
          <button type="button" className="active">
            Overview
          </button>
          <button type="button">Content</button>
          <button type="button">Audience</button>
        </div>

        <section className="in-block">
          <div className="in-head">
            <h2>All content</h2>
            <button type="button" className="in-period">
              30 days <ChevronDown />
            </button>
          </div>

          <div className="in-cards">
            {summaryCards.map((card) => (
              <Link
                to="/insight-view"
                key={card.label}
                className={
                  card.active
                    ? "in-card active text-inherit no-underline"
                    : "in-card text-inherit no-underline"
                }
                title="View metric details"
              >
                <span>{card.label}</span>
                <b>{card.value}</b>
              </Link>
            ))}
          </div>

          <p className="in-split">
            3.1% followers
            <br />
            96.9% non-followers
          </p>

          <div className="in-chart">
            <svg viewBox="0 0 340 150" preserveAspectRatio="none" aria-hidden="true">
              <line x1="40" y1="12" x2="340" y2="12" />
              <line x1="40" y1="78" x2="340" y2="78" />
              <line x1="40" y1="140" x2="340" y2="140" />
              <polyline points="48,130 58,26 70,60 84,84 96,90 108,86 120,80 130,88 140,62 150,20 160,54 172,86 184,104 196,110 206,106 218,110 230,108 244,112 258,110 272,114 286,110 300,108 316,106 330,106" />
            </svg>
            <span className="y y1">176K</span>
            <span className="y y2">88K</span>
            <span className="y y3">0</span>
            <div className="in-xaxis">
              <span>Jul 20</span>
              <span>Aug 3</span>
              <span>Aug 18</span>
            </div>
          </div>
        </section>

        <div className="in-gap" />

        <section className="in-block">
          <h2 className="in-title">
            Views by content type <Info className="in-info" />
          </h2>
          <div className="in-row">
            <span>Viewers</span>
            <b>823,571</b>
          </div>
          <Legend />
          {viewBars.map((bar) => (
            <Link
              to="/insight-view"
              className="in-bar text-inherit no-underline"
              key={bar.label}
              title="View Reel breakdown"
            >
              <span className="in-bar-label">{bar.label}</span>
              <div className="in-track">
                <i style={{ width: `${bar.pct}%` }} />
              </div>
              <span className="in-bar-value">{bar.value}</span>
            </Link>
          ))}
        </section>

        <div className="in-thumbs">
          {thumbs.map((thumb, i) => (
            <Link
              to="/insight-view"
              className="in-thumb"
              key={`${thumb.views}-${i}`}
              title="View Reel breakdown"
            >
              <img src={thumb.image} alt="Post thumbnail" width={300} height={200} loading="lazy" />
              <span>
                <Eye /> {thumb.views}
              </span>
            </Link>
          ))}
        </div>

        <section className="in-block">
          <h2 className="in-title">
            Interactions by content type <Info className="in-info" />
          </h2>
          <div className="in-chips">
            {chips.map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                className={label === "All" ? "chip active" : "chip"}
              >
                {Icon ? <Icon /> : null}
                {label}
              </button>
            ))}
          </div>
          <Legend />
          {interactionBars.map((bar) => (
            <div className="in-bar" key={bar.label}>
              <span className="in-bar-label">{bar.label}</span>
              <div className="in-track">
                <i style={{ width: `${bar.pct}%` }} />
              </div>
              <span className="in-bar-value">{bar.value}</span>
            </div>
          ))}
        </section>

        <section className="in-block">
          <h2 className="in-title">
            Profile activity <Info className="in-info" />
          </h2>
          <ul className="in-activity">
            {activity.map(({ label, value, icon: Icon }) => (
              <li key={label}>
                <span className="in-avatar">
                  <Icon />
                </span>
                <span className="in-act-label">{label}</span>
                <b>{value}</b>
              </li>
            ))}
          </ul>
        </section>

        <FloatingBottomNav />
      </div>
    </main>
  );
}
