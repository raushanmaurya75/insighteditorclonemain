import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  GraduationCap,
  History,
  Lightbulb,
  Send,
  Settings,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Professional dashboard — btwdorian" },
      {
        name: "description",
        content:
          "Insights and creator tools: views, new followers, content shared, ad tools and more.",
      },
      { property: "og:title", content: "Professional dashboard — btwdorian" },
      {
        property: "og:description",
        content:
          "Insights and creator tools: views, new followers, content shared, ad tools and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const insights = [
  { label: "Views", value: "1.6M" },
  { label: "New followers", value: "286" },
  { label: "Content you shared", value: "37" },
];

const TrialReels = (props: { className?: string }) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" strokeDasharray="3.4 3" />
    <path d="M10 8.8v6.4l5.4-3.2-5.4-3.2Z" fill="currentColor" stroke="none" />
  </svg>
);

const tools = [
  { label: "Monthly recap", icon: History },
  { label: "Best practices", icon: GraduationCap },
  { label: "Inspiration", icon: Lightbulb },
  { label: "Ad tools", icon: TrendingUp },
  { label: "Trial reels", icon: TrialReels },
  { label: "Partnership ads", icon: UserRoundCheck },
  { label: "Gifts", icon: Gift },
  { label: "Saved replies", icon: Send },
];

function DashboardPage() {
  return (
    <main className="min-h-screen bg-page text-ink">
      <div className="phone-shell">
        <header className="dash-nav">
          <Link to="/" aria-label="Back" className="dash-round">
            <ChevronLeft />
          </Link>
          <h1>Professional dashboard</h1>
          <button type="button" aria-label="Settings" className="dash-round">
            <Settings />
          </button>
        </header>

        <section className="dash-block">
          <div className="dash-head">
            <h2>Insights</h2>
            <span>Jul 20 - Aug 18</span>
          </div>
          <ul className="dash-list">
            {insights.map((row) => (
              <li key={row.label}>
                <button type="button">
                  <span className="dash-label">{row.label}</span>
                  <span className="dash-value">{row.value}</span>
                  <ChevronRight className="dash-caret" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <div className="dash-divider" />

        <section className="dash-block">
          <div className="dash-head">
            <h2>Your tools</h2>
          </div>
          <ul className="dash-list tools">
            {tools.map(({ label, icon: Icon }) => (
              <li key={label}>
                <button type="button">
                  <Icon className="tool-icon" />
                  <span className="dash-label">{label}</span>
                  <ChevronRight className="dash-caret big" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <div className="dash-divider" />
      </div>
    </main>
  );
}
