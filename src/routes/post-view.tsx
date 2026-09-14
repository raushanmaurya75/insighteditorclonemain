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

export const Route = createFileRoute("/post-view")({
  head: () => ({
    meta: [
      { title: "POV: You grab the machine... — btwdorian" },
      {
        name: "description",
        content: "Instagram Reel view player.",
      },
      { property: "og:title", content: "POV: You grab the machine... — btwdorian" },
      {
        property: "og:description",
        content: "Instagram Reel view player.",
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
      </div>
    </main>
  );
}
