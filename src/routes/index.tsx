import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IgChevronDown,
  IgDashboard,
  IgDiscord,
  IgGrid,
  IgHome,
  IgLink,
  IgMenu,
  IgMessages,
  IgPlayCount,
  IgPlus,
  IgReels,
  IgRepost,
  IgSearch,
  IgTagged,
  IgVerified,
} from "@/components/ig-icons";
import profilePhoto from "@/assets/profile-photo.jpg";
import reelRoad from "@/assets/reel-road.jpg";
import reelCasino from "@/assets/reel-casino.jpg";
import reelMachine from "@/assets/reel-machine.jpg";

export const Route = createFileRoute("/")({
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
      <div className="phone-shell">
        <nav className="profile-nav" aria-label="Profile navigation">
          <button aria-label="Create">
            <IgPlus />
          </button>
          <button className="handle">
            btwdorian <IgChevronDown />
            <i />
          </button>
          <button aria-label="Menu">
            <IgMenu />
          </button>
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
            <a href="https://shuffle.us/?r=btwdorian">
              <IgLink /> shuffle.us/?r=btwdorian
            </a>
          </div>

          <button className="add-banners">
            <IgPlus /> Add banners
          </button>

          <Link to="/dashboard" className="dashboard">
            <b>
              <IgDashboard size={16} /> Professional dashboard
            </b>
            <span>1.6M views in the last 30 days.</span>
          </Link>

          <div className="edit-actions">
            <button>Edit profile</button>
            <button>Share profile</button>
          </div>
        </section>

        <section className="highlights" aria-label="Story highlights">
          <button className="highlight">
            <span className="new-highlight">
              <IgPlus />
            </span>
            <small>New</small>
          </button>
          <button className="highlight">
            <span className="discord-highlight">
              <IgDiscord />
            </span>
            <small>Degen Disci...</small>
          </button>
        </section>

        <div className="content-tabs" role="tablist">
          <button aria-label="Posts">
            <IgGrid />
          </button>
          <button className="active" aria-label="Videos">
            <IgReels />
            <IgChevronDown />
          </button>
          <button aria-label="Reposts">
            <IgRepost />
          </button>
          <button aria-label="Tagged">
            <IgTagged />
          </button>
        </div>

        <section className="reel-grid" aria-label="Video posts">
          {reels.map((reel) => (
            <button className="reel" key={reel.views}>
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
            </button>
          ))}
        </section>

        <nav className="bottom-nav" aria-label="Main navigation">
          <button aria-label="Home">
            <IgHome />
          </button>
          <button aria-label="Reels">
            <IgReels />
          </button>
          <button aria-label="Messages">
            <IgMessages />
          </button>
          <button aria-label="Search">
            <IgSearch />
          </button>
          <button aria-label="Profile" className="mini-profile">
            <img src={profilePhoto} alt="" width={512} height={512} />
          </button>
        </nav>
      </div>
    </main>
  );
}
