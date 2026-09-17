import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import {
  IgChevronDown,
  IgCreate,
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
  IgHeart,
  IgComment,
  IgClip,
  IgCarouselIcon,
  IgPlay,
} from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import {
  useProfile,
  formatCompactNumber,
  formatExactNumber,
} from "@/lib/profile-store";
import {
  AlertCircle,
  Sparkles,
  X,
  RotateCcw,
  Settings,
  TrendingUp,
  Bookmark,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Instagram — Profile" },
      {
        name: "description",
        content: "Instagram profile and reel analytics.",
      },
      { property: "og:title", content: "Instagram — Profile" },
      {
        property: "og:description",
        content: "Instagram profile and reel analytics.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { profile, selectPost, resetProfile, cloneProfile } = useProfile();

  const [activeTab, setActiveTab] = useState<"grid" | "reels" | "reposts" | "tagged">("grid");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, startTransition] = useTransition();

  const handleOpenCloneModal = () => {
    setIsMenuOpen(false);
    setErrorMessage("");
    setUsernameInput("");
    setIsCloneModalOpen(true);
  };

  const handleCloseCloneModal = () => {
    if (!isLoading) {
      setIsCloneModalOpen(false);
      setErrorMessage("");
    }
  };

  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = usernameInput.trim();
    if (!clean) {
      setErrorMessage("Please enter an Instagram username or profile link.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    setLoadingStatus("Connecting to Instagram...");

    const t1 = setTimeout(() => {
      setLoadingStatus("Fetching profile data & posts...");
    }, 1500);

    const t2 = setTimeout(() => {
      setLoadingStatus("Processing media & insights...");
    }, 3500);

    try {
      const res = await cloneProfile(clean);
      clearTimeout(t1);
      clearTimeout(t2);

      if (res.success) {
        setIsLoading(false);
        setIsCloneModalOpen(false);
        setUsernameInput("");
      } else {
        setIsLoading(false);
        setErrorMessage(
          res.error ||
            "We couldn't load this profile. Please check the username and make sure it is a public Instagram account."
        );
      }
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);
      setErrorMessage(
        "Something went wrong while loading this profile. Please check your connection and try again."
      );
    }
  };

  const handlePostClick = (index: number) => {
    selectPost(index);
    startTransition(() => {
      navigate({ to: "/post-view" });
    });
  };

  const bioLines = profile.bio ? profile.bio.split("\n") : [];

  return (
    <main className="min-h-screen bg-page text-ink">
      <div className="phone-shell pb-24">
        {/* Profile Top Navigation Bar */}
        <nav className="profile-nav" aria-label="Profile navigation">
          <Link to="/" aria-label="Home feed" title="Home feed">
            <IgCreate />
          </Link>
          <button
            className="handle"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            title="Switch or clone account"
          >
            {profile.username} <IgChevronDown />
            <i />
          </button>
          <button
            type="button"
            className="text-inherit border-none bg-transparent p-0 cursor-pointer flex items-center"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
            title="Menu"
          >
            <IgMenu />
          </button>
        </nav>

        {/* Profile Summary Section */}
        <section className="profile-summary">
          {/* Avatar + Stats */}
          <div className="profile-top">
            <div className="avatar-wrap">
              {profile.noteText && (
                <div className="note whitespace-pre-line">{profile.noteText}</div>
              )}
              <div className="avatar-ring">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  width={512}
                  height={512}
                  className="object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60";
                  }}
                />
              </div>
              <span className="avatar-add" onClick={handleOpenCloneModal} title="Clone profile">
                <IgPlus />
              </span>
            </div>

            <div className="identity-stats">
              <div className="display-name">
                {profile.fullName}{" "}
                {profile.isVerified && (
                  <IgVerified size={18} className="verified" />
                )}
              </div>
              <div className="stats">
                <div>
                  <b>{formatExactNumber(profile.postsCount)}</b>
                  <span>posts</span>
                </div>
                <div>
                  <b>{formatCompactNumber(profile.followersCount)}</b>
                  <span>followers</span>
                </div>
                <div>
                  <b>{formatCompactNumber(profile.followingCount)}</b>
                  <span>following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bio">
            {profile.category && <p className="category">{profile.category}</p>}
            {bioLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
            {profile.externalUrl && (
              <a
                href={
                  profile.externalUrl.startsWith("http")
                    ? profile.externalUrl
                    : `https://${profile.externalUrl}`
                }
                target="_blank"
                rel="noreferrer"
              >
                <IgLink /> {profile.externalUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>

          {/* Add Banners Button */}
          <button className="add-banners" type="button">
            <IgPlus /> Add banners
          </button>

          {/* Professional Dashboard Button */}
          <Link to="/dashboard" className="dashboard">
            <b>
              <IgDashboard size={16} /> Professional dashboard
            </b>
            <span>{profile.monthlyViews || "1.6M views in the last 30 days."}</span>
          </Link>

          {/* Edit / Share Actions */}
          <div className="edit-actions">
            <button type="button">Edit profile</button>
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Profile link copied!");
                }
              }}
            >
              Share profile
            </button>
          </div>
        </section>

        {/* Story Highlights */}
        <section className="highlights" aria-label="Story highlights">
          <button className="highlight" type="button" onClick={handleOpenCloneModal}>
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

        {/* Content Navigation Tabs */}
        <div className="content-tabs" role="tablist">
          <button
            aria-label="Posts"
            type="button"
            className={activeTab === "grid" ? "active" : ""}
            onClick={() => setActiveTab("grid")}
          >
            <IgGrid />
          </button>
          <button
            aria-label="Videos / Reels"
            type="button"
            className={activeTab === "reels" ? "active" : ""}
            onClick={() => setActiveTab("reels")}
          >
            <IgReels />
          </button>
          <button
            aria-label="Reposts"
            type="button"
            className={activeTab === "reposts" ? "active" : ""}
            onClick={() => setActiveTab("reposts")}
          >
            <IgRepost />
          </button>
          <button
            aria-label="Tagged"
            type="button"
            className={activeTab === "tagged" ? "active" : ""}
            onClick={() => setActiveTab("tagged")}
          >
            <IgTagged />
          </button>
        </div>

        {/* Reels View Tab */}
        {activeTab === "reels" && (
          <section className="reel-grid" aria-label="Video posts">
            {profile.posts.map((post, idx) => (
              <div
                className="reel cursor-pointer"
                key={post.id || idx}
                onClick={() => handlePostClick(idx)}
                title="View Reel & Insights"
              >
                <img
                  src={post.thumbnail_src || post.display_url}
                  alt={post.caption || "Reel"}
                  width={768}
                  height={1024}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60";
                  }}
                />
                <span className="post-grid-badge">
                  <IgClip size={17} />
                </span>
                <span className="view-count">
                  <IgPlay size={13} />
                  {formatCompactNumber(post.views)}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Standard Posts Grid Tab */}
        {activeTab === "grid" && (
          <section className="post-grid-wrap" aria-label="Photos and posts grid">
            {profile.posts.map((post, idx) => (
              <div
                key={post.id || idx}
                className="post-grid-item cursor-pointer"
                onClick={() => handlePostClick(idx)}
                title="View Post"
              >
                <img
                  src={post.thumbnail_src || post.display_url}
                  alt={post.caption || "Post thumbnail"}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60";
                  }}
                />
                {post.is_video ? (
                  <span className="post-grid-badge">
                    <IgClip size={17} />
                  </span>
                ) : (
                  <span className="post-grid-badge">
                    <IgCarouselIcon size={17} />
                  </span>
                )}
                <div className="post-grid-overlay">
                  <span className="flex items-center gap-1">
                    <IgHeart size={16} fill="#ffffff" />
                    {formatCompactNumber(post.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <IgComment size={16} fill="#ffffff" />
                    {formatCompactNumber(post.comments)}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Reposts or Tagged Empty State */}
        {(activeTab === "reposts" || activeTab === "tagged") && (
          <div className="py-16 text-center text-subtle">
            <p className="text-sm">No {activeTab} yet for @{profile.username}</p>
          </div>
        )}

        <FloatingBottomNav />
      </div>

      {/* Profile 3-Line Menu Action Sheet */}
      {isMenuOpen && (
        <div
          className="clone-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMenuOpen(false);
          }}
        >
          <div className="profile-menu-dialog" role="dialog" aria-modal="true">
            <div className="clone-modal-drag-bar" />

            <div className="clone-modal-header">
              <h3>Options</h3>
              <button
                type="button"
                className="clone-modal-close-btn"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile-menu-list">
              {/* Clone Instagram Option */}
              <button
                type="button"
                className="profile-menu-item profile-menu-item-clone"
                onClick={handleOpenCloneModal}
              >
                <div className="profile-menu-item-icon clone-grad">
                  <Sparkles size={18} />
                </div>
                <div className="profile-menu-item-text">
                  <b>Clone Instagram Profile</b>
                  <span>Scrape and load any public Instagram account</span>
                </div>
              </button>

              {profile.isCloned && (
                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={() => {
                    resetProfile();
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="profile-menu-item-icon">
                    <RotateCcw size={18} />
                  </div>
                  <div className="profile-menu-item-text">
                    <b>Reset to Default Profile</b>
                    <span>Revert back to default @btwdorian profile</span>
                  </div>
                </button>
              )}

              <div className="profile-menu-divider" />

              <Link
                to="/dashboard"
                className="profile-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="profile-menu-item-icon">
                  <TrendingUp size={18} />
                </div>
                <div className="profile-menu-item-text">
                  <b>Professional Dashboard</b>
                  <span>Creator tools, audience reach and insights</span>
                </div>
              </Link>

              <Link
                to="/insights"
                className="profile-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="profile-menu-item-icon">
                  <Activity size={18} />
                </div>
                <div className="profile-menu-item-text">
                  <b>Account Insights</b>
                  <span>View accounts reached and engaged</span>
                </div>
              </Link>

              <button
                type="button"
                className="profile-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="profile-menu-item-icon">
                  <Settings size={18} />
                </div>
                <div className="profile-menu-item-text">
                  <b>Settings and Privacy</b>
                </div>
              </button>

              <button
                type="button"
                className="profile-menu-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="profile-menu-item-icon">
                  <Bookmark size={18} />
                </div>
                <div className="profile-menu-item-text">
                  <b>Saved</b>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clone Instagram Profile Modal */}
      {isCloneModalOpen && (
        <div
          className="clone-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseCloneModal();
          }}
        >
          <div className="clone-modal-dialog" role="dialog" aria-modal="true">
            <div className="clone-modal-drag-bar" />

            <div className="clone-modal-header">
              <h3>Clone Instagram Profile</h3>
              <button
                type="button"
                className="clone-modal-close-btn"
                onClick={handleCloseCloneModal}
                disabled={isLoading}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="clone-modal-desc">
              Enter any public Instagram username or link to clone the profile, avatar, followers, and latest reels directly into the app.
            </p>

            <form onSubmit={handleCloneSubmit}>
              <div className="clone-input-wrap">
                <span className="clone-input-prefix">@</span>
                <input
                  type="text"
                  className="clone-text-input"
                  placeholder="username or instagram.com/username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              {/* User-friendly Non-technical Error Message */}
              {errorMessage && (
                <div className="clone-modal-error">
                  <AlertCircle size={17} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Live Scrape Status Animation */}
              {isLoading && (
                <div className="clone-modal-status">
                  <div className="clone-spinner" />
                  <span>{loadingStatus}</span>
                </div>
              )}

              <div className="clone-modal-actions">
                <button
                  type="submit"
                  className="clone-submit-btn"
                  disabled={isLoading || !usernameInput.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="clone-spinner" />
                      <span>Cloning Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Clone Profile</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="clone-cancel-btn"
                  onClick={handleCloseCloneModal}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
