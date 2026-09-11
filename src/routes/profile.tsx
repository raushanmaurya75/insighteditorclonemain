import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IgChevronDown,
  IgDashboard,
  IgDiscord,
  IgGrid,
  IgLink,
  IgMenu,
  IgPlayCount,
  IgPlus,
  IgReels,
  IgRepost,
  IgTagged,
  IgVerified,
} from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import profilePhoto from "@/assets/profile-photo.jpg";
import reelRoad from "@/assets/reel-road.jpg";
import reelCasino from "@/assets/reel-casino.jpg";
import reelMachine from "@/assets/reel-machine.jpg";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "btwdorian — Profile" },
      {
        name: "description",
        content: "Dorian Divizev's social profile and latest videos.",
      },
      { property: "og:title", content: "btwdorian — Profile" },
      {
        property: "og:description",
        content: "Dorian Divizev's social profile and latest videos.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const reels = [
  {
    image: reelRoad,
    text: "POV: the type of place bro takes you after you go 0/4 on ur parlays",
    views: "37.6K",
  },
  {
    image: reelCasino,
    text: "POV: How it feels knowing you discovered the ultimate spot",
    views: "22.9K",
  },
  {
    image: reelMachine,
    text: "POV: You grab the machine before they say who just blew his paycheck",
    views: "143K",
  },
];

function ProfilePage() {
  return (
    <main className="min-h-screen bg-page text-ink">
      <div className="phone-shell pb-24">
        <nav className="profile-nav" aria-label="Profile navigation">
          <Link to="/" aria-label="Home feed" title="Home feed">
            <IgPlus />
          </Link>
          <button className="handle" type="button">
            btwdorian <IgChevronDown />
            <i />
          </button>
          <Link to="/dashboard" aria-label="Menu / Dashboard" title="Dashboard">
            <IgMenu />
          </Link>
        </nav>

        <section className="profile-summary">
          <div className="profile-top">
            <div className="avatar-wrap">
              <div className="note">
                Obsessed
                <br />
                with...
              </div>
              <div className="avatar-ring">
                <img src={profilePhoto} alt="Dorian Divizev" width={512} height={512} />
              </div>
              <span className="avatar-add">
                <IgPlus />
              </span>
            </div>
            <div className="identity-stats">
              <div className="display-name">
                Dorian Divizev <IgVerified size={18} className="verified" />
              </div>
              <div className="stats">
                <div>
                  <b>42</b>
                  <span>posts</span>
                </div>
                <div>
                  <b>6,253</b>
                  <span>followers</span>
                </div>
                <div>
                  <b>939</b>
                  <span>following</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bio">
            <p className="category">Adult Entertainment Service</p>
            <p>Gambling “POV GOD” ifykyk</p>
            <p>sign up here ↓ for $1k giveaway at 10k 🎉</p>
            <a href="https://shuffle.us/?r=btwdorian" target="_blank" rel="noreferrer">
              <IgLink /> shuffle.us/?r=btwdorian
            </a>
          </div>

          <button className="add-banners" type="button">
            <IgPlus /> Add banners
          </button>

          <Link to="/dashboard" className="dashboard">
            <b>
              <IgDashboard size={16} /> Professional dashboard
            </b>
            <span>1.6M views in the last 30 days.</span>
          </Link>

          <div className="edit-actions">
            <button type="button">Edit profile</button>
            <button type="button">Share profile</button>
          </div>
        </section>

        <section className="highlights" aria-label="Story highlights">
          <button className="highlight" type="button">
            <span className="new-highlight">
              <IgPlus />
            </span>
            <small>New</small>
          </button>
          <Link to="/insights" className="highlight" title="Audience Insights">
            <span className="discord-highlight">
              <IgDiscord />
            </span>
            <small>Degen Disci...</small>
          </Link>
        </section>

        <div className="content-tabs" role="tablist">
          <button aria-label="Posts" type="button">
            <IgGrid />
          </button>
          <Link to="/insight-view" className="active" aria-label="Videos" title="Reel Insights">
            <IgReels />
            <IgChevronDown />
          </Link>
          <button aria-label="Reposts" type="button">
            <IgRepost />
          </button>
          <button aria-label="Tagged" type="button">
            <IgTagged />
          </button>
        </div>

        <section className="reel-grid" aria-label="Video posts">
          {reels.map((reel) => (
            <Link to="/insight-view" className="reel" key={reel.views} title="View Reel Insights">
              <img
                src={reel.image}
                alt="Video thumbnail"
                width={768}
                height={1024}
                loading="lazy"
              />
              <span className="reel-copy">{reel.text}</span>
              <span className="view-count">
                <IgPlayCount />
                {reel.views}
              </span>
            </Link>
          ))}
        </section>

        <FloatingBottomNav />
      </div>
    </main>
  );
}
