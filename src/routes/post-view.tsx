import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  Camera,
  Search,
  Eye,
  TrendingUp,
} from "lucide-react";
import {
  IgHeart,
  IgComment,
  IgRepost,
  IgShare,
  IgMore,
} from "@/components/ig-icons";
import reelMachine from "@/assets/reel-machine.jpg";
import profilePhoto from "@/assets/profile-photo.jpg";
import friendAvatar1 from "@/assets/home-story-man.jpg";
import friendAvatar2 from "@/assets/home-story-selfie.jpg";

export const Route = createFileRoute("/post-view")({
  head: () => ({
    meta: [
      { title: "POV: You grab the machine... — btwdorian" },
      {
        name: "description",
        content: "Instagram Reel view player for iPhone.",
      },
      { property: "og:title", content: "POV: You grab the machine... — btwdorian" },
      {
        property: "og:description",
        content: "Instagram Reel view player for iPhone.",
      },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostViewPage,
});

function PostViewPage() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(true);
  const [likeCount, setLikeCount] = useState(367);
  const [bookmarked, setBookmarked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(4);

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const toggleRepost = () => {
    if (reposted) {
      setReposted(false);
      setRepostCount((c) => c - 1);
    } else {
      setReposted(true);
      setRepostCount((c) => c + 1);
    }
  };

  return (
    <main className="pv-container">
      <div className="pv-phone-frame">
        {/* Reel Media Background */}
        <div className="pv-media-wrap">
          <img src={reelMachine} alt="POV: You grab the machine" className="pv-media-bg" />
          {/* Subtle gradient overlays for UI readability */}
          <div className="pv-top-gradient" />
          <div className="pv-bottom-gradient" />

          {/* Centered Text Overlay */}
          <div className="pv-overlay-text-wrap">
            <p className="pv-overlay-text">
              POV: You grab the machine
              <br />
              before the guy who just blew
              <br />
              his paycheck can get back
              <br />
              from the ATM
            </p>
          </div>
        </div>

        {/* iPhone Status Bar + Dynamic Island */}
        <div className="pv-status-bar">
          <div className="pv-status-left">
            <span className="pv-time">1:20</span>
          </div>

          <div className="pv-dynamic-island">
            <span className="pv-island-dot" />
          </div>

          <div className="pv-status-right">
            {/* Cellular bars */}
            <svg
              className="pv-cell-icon"
              viewBox="0 0 17 11"
              fill="currentColor"
              width="17"
              height="11"
            >
              <rect x="0" y="8" width="3" height="3" rx="0.6" />
              <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.6" />
              <rect x="9" y="3" width="3" height="8" rx="0.6" />
              <rect x="13.5" y="0" width="3" height="11" rx="0.6" />
            </svg>
            {/* Wifi */}
            <svg
              className="pv-wifi-icon"
              viewBox="0 0 16 12"
              fill="currentColor"
              width="15"
              height="11"
            >
              <path d="M8 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 5.6c2 0 3.8.8 5.1 2.1a1 1 0 1 0 1.4-1.4A9.2 9.2 0 0 0 8 3.6c-2.6 0-5 1-6.5 2.7a1 1 0 1 0 1.4 1.4A7.2 7.2 0 0 1 8 5.6Zm0-4.6c3.4 0 6.6 1.4 9 3.8a1 1 0 0 0 1.4-1.4A14.7 14.7 0 0 0 8-.4C4.3-.4 1 .9-1.4 3.4a1 1 0 1 0 1.4 1.4A12.7 12.7 0 0 1 8 1Z" />
            </svg>
            {/* Battery 54 */}
            <div className="pv-battery">
              <span className="pv-battery-pct">54</span>
              <div className="pv-battery-border">
                <div className="pv-battery-fill" style={{ width: "54%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Actions Overlay */}
        <div className="pv-top-nav">
          <button
            type="button"
            className="pv-nav-btn"
            onClick={() => {
              if (window.history.length > 1) {
                navigate({ to: "/profile" });
              } else {
                navigate({ to: "/profile" });
              }
            }}
            aria-label="Back to profile"
          >
            <ChevronLeft size={28} strokeWidth={2.4} />
          </button>

          <div className="pv-top-actions">
            <button type="button" className="pv-nav-btn" aria-label="Camera">
              <Camera size={26} strokeWidth={1.9} />
            </button>
            <button type="button" className="pv-nav-btn" aria-label="Search">
              <Search size={25} strokeWidth={2.1} />
            </button>
          </div>
        </div>

        {/* Right Vertical Action Bar */}
        <aside className="pv-right-actions">
          {/* Like */}
          <div className="pv-action-item">
            <button
              type="button"
              className={`pv-action-btn ${liked ? "is-liked" : ""}`}
              onClick={toggleLike}
              aria-label="Like"
            >
              <IgHeart
                size={28}
                active={liked}
                className={liked ? "heart-pop" : ""}
              />
            </button>
            <span className="pv-action-count">{likeCount}</span>
          </div>

          {/* Comment */}
          <div className="pv-action-item">
            <button type="button" className="pv-action-btn" aria-label="Comments">
              <IgComment size={28} />
            </button>
            <span className="pv-action-count">10</span>
          </div>

          {/* Repost */}
          <div className="pv-action-item">
            <button
              type="button"
              className={`pv-action-btn ${reposted ? "is-reposted" : ""}`}
              onClick={toggleRepost}
              aria-label="Repost"
            >
              <IgRepost size={28} color={reposted ? "#a855f7" : "currentColor"} />
            </button>
            <span className="pv-action-count">{repostCount}</span>
          </div>

          {/* Share */}
          <div className="pv-action-item">
            <button type="button" className="pv-action-btn" aria-label="Share">
              <IgShare size={26} />
            </button>
            <span className="pv-action-count">4</span>
          </div>

          {/* More options */}
          <div className="pv-action-item">
            <button type="button" className="pv-action-btn" aria-label="More options">
              <IgMore size={26} />
            </button>
          </div>

          {/* Audio square badge */}
          <div className="pv-action-item pv-audio-item">
            <div className="pv-audio-disc" title="Original audio - btwdorian">
              <img src={profilePhoto} alt="Audio artwork" width={28} height={28} />
              <span className="pv-audio-notes">♫</span>
            </div>
          </div>
        </aside>

        {/* Bottom Left Content Overlay */}
        <div className="pv-bottom-left">
          {/* Interactive Friend Tags / Floating Bubbles */}
          <div className="pv-bubbles-row">
            {/* Heart float badge */}
            <div className="pv-float-heart">
              <IgHeart size={14} active fill="#ff2d55" />
            </div>

            {/* Tag a friend pill */}
            <div className="pv-tag-pill">
              <span>Tag a friend...</span>
            </div>

            {/* Friend 1 avatar bubble */}
            <div className="pv-avatar-bubble">
              <img src={friendAvatar1} alt="Friend avatar" />
              <span className="pv-bubble-badge">
                <IgRepost size={10} />
              </span>
            </div>

            {/* Friend 2 avatar bubble */}
            <div className="pv-avatar-bubble">
              <img src={friendAvatar2} alt="Friend avatar" />
              <span className="pv-bubble-badge">
                <IgRepost size={10} />
              </span>
            </div>
          </div>

          {/* Creator Profile Row */}
          <div className="pv-creator-row">
            <Link to="/profile" className="pv-creator-avatar-link">
              <img src={profilePhoto} alt="btwdorian avatar" className="pv-creator-avatar" />
            </Link>
            <Link to="/profile" className="pv-creator-name">
              btwdorian
            </Link>
          </div>

          {/* Caption */}
          <p className="pv-caption">Sorry bro it’s due 😭 ...</p>
        </div>

        {/* Bottom Bar Controls */}
        <div className="pv-bottom-bar">
          {/* Get inspired on Edits pill */}
          <button type="button" className="pv-edits-btn">
            <span className="pv-edits-icon">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <defs>
                  <linearGradient id="igEditsGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f58529" />
                    <stop offset="50%" stopColor="#dd2a7b" />
                    <stop offset="100%" stopColor="#8134af" />
                  </linearGradient>
                </defs>
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="6"
                  stroke="url(#igEditsGrad)"
                  strokeWidth="2.2"
                />
                <circle cx="12" cy="12" r="4.2" stroke="url(#igEditsGrad)" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="url(#igEditsGrad)" />
              </svg>
            </span>
            <span className="pv-edits-text">Get inspired on Edits</span>
          </button>

          {/* Right Metrics: Views (links to Insight-View) & Boost */}
          <div className="pv-bottom-metrics">
            <Link to="/insight-view" className="pv-metric-btn" title="View detailed Reel insights">
              <Eye size={18} strokeWidth={2.2} />
              <span className="pv-metric-label">12.9K views</span>
            </Link>

            <button type="button" className="pv-metric-btn pv-boost-btn">
              <TrendingUp size={18} strokeWidth={2.2} />
              <span className="pv-metric-label">Boost</span>
            </button>
          </div>
        </div>

        {/* iPhone Home Indicator */}
        <div className="pv-home-indicator" />
      </div>
    </main>
  );
}
