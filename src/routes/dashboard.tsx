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
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import { useProfile, formatCompactNumber } from "@/lib/profile-store";

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
  { label: "Monthly recap", icon: History, to: "/insights" },
  { label: "Best practices", icon: GraduationCap, to: "/insights" },
  { label: "Inspiration", icon: Lightbulb, to: "/insights" },
  { label: "Ad tools", icon: TrendingUp, to: "/insights" },
  { label: "Trial reels", icon: TrialReels, to: "/insight-view" },
  { label: "Partnership ads", icon: UserRoundCheck, to: "/insights" },
  { label: "Gifts", icon: Gift, to: "/insights" },
  { label: "Saved replies", icon: Send, to: "/insights" },
];

function DashboardPage() {
  const { profile } = useProfile();

  const totalViews =
    profile.followersCount > 1000000
      ? `${(profile.followersCount * 2.8 / 1000000).toFixed(1)}M`
      : profile.followersCount > 50000
      ? `${(profile.followersCount * 2.5 / 1000).toFixed(0)}K`
      : "1.6M";

  const newFollowers = Math.round(profile.followersCount * 0.045) || 286;
  const contentShared = profile.postsCount || 37;

  const insights = [
    { label: "Views", value: totalViews, to: "/insights" },
    { label: "New followers", value: formatCompactNumber(newFollowers), to: "/insights" },
    { label: "Content you shared", value: String(contentShared), to: "/insights" },
  ];

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
          <h1>Professional dashboard</h1>
          <Link
            to="/insights"
            aria-label="Settings / Insights"
            className="dash-round"
            title="Settings"
          >
            <Settings />
          </Link>
        </header>

        <section className="dash-block">
          <Link
            to="/insights"
            className="dash-head text-inherit no-underline"
            title="View detailed account insights"
          >
            <h2>Insights</h2>
            <span>Jul 20 - Aug 18</span>
          </Link>
          <ul className="dash-list">
            {insights.map((row) => (
              <li key={row.label}>
                <Link
                  to={row.to}
                  className="w-full flex items-center justify-between text-inherit no-underline py-2.5"
                >
                  <span className="dash-label">{row.label}</span>
                  <span className="dash-value">{row.value}</span>
                  <ChevronRight className="dash-caret" />
                </Link>
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
            {tools.map(({ label, icon: Icon, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="w-full flex items-center justify-between text-inherit no-underline py-2.5"
                >
                  <Icon className="tool-icon" />
                  <span className="dash-label">{label}</span>
                  <ChevronRight className="dash-caret big" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="dash-divider" />

        <FloatingBottomNav />
      </div>
    </main>
  );
}
