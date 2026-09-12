import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  IgHeart,
  IgComment,
  IgRepost,
  IgShare,
  IgBookmark,
  IgTwoLines,
  IgPersonTagged,
  IgMuted,
  IgMusic,
  IgPlus,
} from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import storySelfie from "@/assets/home-story-selfie.jpg";
import storyMan from "@/assets/home-story-man.jpg";
import storyPerfume from "@/assets/home-story-perfume.jpg";
import storyPackaging from "@/assets/home-story-packaging.jpg";
import nainaTarsemArt from "@/assets/feed-naina-tarsem.jpg";
import anubhavDubeyPhoto from "@/assets/feed-anubhav-dubey.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instagram Home Feed" },
      {
        name: "description",
        content: "Instagram iOS home feed with stories, video reel posts, and carousel updates.",
      },
      { property: "og:title", content: "Instagram Home Feed" },
      {
        property: "og:description",
        content: "Instagram iOS home feed with stories, video reel posts, and carousel updates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeFeedPage,
});

interface StoryItem {
  id: string;
  name: string;
  image: string;
  isOwn?: boolean;
  to: string;
}

const storiesData: StoryItem[] = [
  { id: "1", name: "Your story", image: storySelfie, isOwn: true, to: "/profile" },
  { id: "2", name: "codewithnishchal", image: storyMan, to: "/insight-view" },
  { id: "3", name: "programming_c...", image: storyPerfume, to: "/dashboard" },
  { id: "4", name: "syn_chronous...", image: storyPackaging, to: "/insights" },
  { id: "5", name: "tech_insider", image: storyMan, to: "/profile" },
];

function HomeFeedPage() {
  // Post 1 state
  const [post1Liked, setPost1Liked] = useState(false);
  const [post1Bookmarked, setPost1Bookmarked] = useState(false);
  const [post1Reposted, setPost1Reposted] = useState(false);
  const [post1Muted, setPost1Muted] = useState(true);
  const [post1Following, setPost1Following] = useState(false);
  const [post1More, setPost1More] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  // Post 2 state
  const [post2Liked, setPost2Liked] = useState(false);
  const [post2Bookmarked, setPost2Bookmarked] = useState(false);
  const [post2Reposted, setPost2Reposted] = useState(false);
  const [post2Following, setPost2Following] = useState(false);
  const [post2More, setPost2More] = useState(false);

  const handleDoubleTapPost1 = () => {
    if (!post1Liked) {
      setPost1Liked(true);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 900);
  };

  return (
    <main className="min-h-screen bg-page text-ink">
      <div className="phone-shell pb-24 feed-phone-shell">
        {/* Stories Horizontal Tray */}
          <section className="feed-stories-tray" aria-label="Stories">
            {storiesData.map((story) => (
              <Link
                key={story.id}
                to={story.to}
                className="feed-story-item text-inherit no-underline"
                title={story.name}
              >
                <div
                  className={`feed-story-avatar-wrap ${
                    story.isOwn ? "is-own" : "has-gradient-ring"
                  }`}
                >
                  <img
                    src={story.image}
                    alt={story.name}
                    className="feed-story-img"
                    width={68}
                    height={68}
                    loading="lazy"
                  />

                  {story.isOwn ? (
                    <>
                      {/* Blue badge with paper airplane at top */}
                      <span className="feed-story-blue-badge" title="Share story">
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                      </span>

                      {/* Black circle with plus at bottom */}
                      <span className="feed-story-plus-badge" title="Add to story">
                        <IgPlus size={14} />
                      </span>
                    </>
                  ) : null}
                </div>
                <span className="feed-story-name">{story.name}</span>
              </Link>
            ))}
          </section>

          {/* POST 1: Reel / Video Post (pakhi_art424) */}
          <article className="feed-post-card" aria-label="Post by pakhi_art424">
            {/* Post Header */}
            <div className="feed-post-header">
              <Link to="/insight-view" className="feed-author-link" title="pakhi_art424">
                <div className="feed-header-avatar">
                  <img src={nainaTarsemArt} alt="pakhi_art424" width={38} height={38} />
                </div>
                <div className="feed-header-meta">
                  <span className="feed-username">pakhi_art424</span>
                  <span className="feed-audio-sub">
                    <IgMusic size={11} /> Made with Edits
                  </span>
                </div>
              </Link>

              <div className="feed-header-actions">
                <button
                  type="button"
                  className={`feed-follow-btn ${post1Following ? "is-following" : ""}`}
                  onClick={() => setPost1Following(!post1Following)}
                >
                  {post1Following ? "Following" : "Follow"}
                </button>
                <button
                  type="button"
                  className="feed-menu-btn"
                  aria-label="More options"
                  title="More options"
                >
                  <IgTwoLines size={20} />
                </button>
              </div>
            </div>

            {/* Post Media - Vertical Art */}
            <div
              className="feed-media-container"
              onDoubleClick={handleDoubleTapPost1}
              role="presentation"
            >
              <img
                src={nainaTarsemArt}
                alt="Naina Tarsem romantic artwork"
                className="feed-media-image"
                width={430}
                height={760}
              />

              {/* Heart Pop on double tap */}
              {showHeartPop && (
                <div className="feed-heart-pop-anim">
                  <svg viewBox="0 0 24 24" width="80" height="80" fill="#ffffff">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              )}

              {/* Tagged user button bottom left */}
              <button
                type="button"
                className="feed-overlay-btn feed-tag-btn"
                aria-label="Tagged people"
                title="Tagged people"
              >
                <IgPersonTagged size={13} />
              </button>

              {/* Audio mute button bottom right */}
              <button
                type="button"
                className="feed-overlay-btn feed-mute-btn"
                onClick={() => setPost1Muted(!post1Muted)}
                aria-label={post1Muted ? "Unmute audio" : "Mute audio"}
                title={post1Muted ? "Unmute audio" : "Mute audio"}
              >
                {post1Muted ? (
                  <IgMuted size={15} />
                ) : (
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {/* iOS Assistive Touch pill/circle */}
              <div className="feed-assistive-touch" title="Assistive Touch" aria-hidden="true" />
            </div>

            {/* Post Action Buttons Bar */}
            <div className="feed-actions-bar">
              <div className="feed-actions-left">
                {/* Like Button */}
                <button
                  type="button"
                  className={`feed-action-item ${post1Liked ? "is-liked" : ""}`}
                  onClick={() => setPost1Liked(!post1Liked)}
                  aria-label="Like"
                >
                  <IgHeart
                    size={26}
                    fill={post1Liked ? "#ff2d55" : "none"}
                    color={post1Liked ? "#ff2d55" : "currentColor"}
                    stroke={post1Liked ? "#ff2d55" : "currentColor"}
                  />
                  <span className="feed-action-count">{post1Liked ? "595.1K" : "595K"}</span>
                </button>

                {/* Comment Button */}
                <Link
                  to="/post-view"
                  className="feed-action-item text-inherit no-underline"
                  aria-label="Comments"
                >
                  <IgComment size={25} />
                  <span className="feed-action-count">571</span>
                </Link>

                {/* Repost Button */}
                <button
                  type="button"
                  className={`feed-action-item ${post1Reposted ? "is-reposted" : ""}`}
                  onClick={() => setPost1Reposted(!post1Reposted)}
                  aria-label="Repost"
                >
                  <IgRepost size={25} color={post1Reposted ? "#a855f7" : "currentColor"} />
                  <span className="feed-action-count">{post1Reposted ? "33.6K" : "33.5K"}</span>
                </button>

                {/* Share Button */}
                <Link
                  to="/dashboard"
                  className="feed-action-item text-inherit no-underline"
                  aria-label="Share"
                >
                  <IgShare size={24} />
                  <span className="feed-action-count">198K</span>
                </Link>
              </div>

              {/* Bookmark on far right */}
              <button
                type="button"
                className={`feed-action-item feed-bookmark-btn ${
                  post1Bookmarked ? "is-bookmarked" : ""
                }`}
                onClick={() => setPost1Bookmarked(!post1Bookmarked)}
                aria-label="Save"
              >
                <IgBookmark size={25} active={post1Bookmarked} />
              </button>
            </div>

            {/* Post Caption & Details */}
            <div className="feed-caption-block">
              <p className="feed-caption-text">
                <span className="feed-caption-user">pakhi_art424</span>{" "}
                <span>Follow for more 🎀</span>
                {!post1More ? (
                  <>
                    <span>... </span>
                    <button
                      type="button"
                      className="feed-more-link"
                      onClick={() => setPost1More(true)}
                    >
                      more
                    </button>
                  </>
                ) : (
                  <span>
                    {" "}
                    Aesthetic reel art created with heartfelt romance and memories! Hope you all love
                    this artwork.
                  </span>
                )}
              </p>
              <div className="feed-timestamp-row">
                <span className="feed-time-text">1 day ago</span>
                <span className="feed-dot-separator">·</span>
                <button type="button" className="feed-translation-btn">
                  See Translation
                </button>
              </div>
            </div>
          </article>

          {/* POST 2: Carousel Hindi News Post (youthobserver.news) */}
          <article className="feed-post-card" aria-label="Post by youthobserver.news">
            {/* Post Header */}
            <div className="feed-post-header">
              <Link to="/profile" className="feed-author-link" title="youthobserver.news">
                {/* Red circular Youth Observer logo */}
                <div className="feed-header-avatar feed-news-logo">
                  <div className="feed-news-badge-inner">
                    <span>Youth</span>
                    <small>Observer</small>
                  </div>
                </div>
                <div className="feed-header-meta">
                  <span className="feed-username">youthobserver.news</span>
                  <span className="feed-suggested-sub">Suggested for you</span>
                </div>
              </Link>

              <div className="feed-header-actions">
                <button
                  type="button"
                  className={`feed-follow-btn ${post2Following ? "is-following" : ""}`}
                  onClick={() => setPost2Following(!post2Following)}
                >
                  {post2Following ? "Following" : "Follow"}
                </button>
                <button
                  type="button"
                  className="feed-menu-btn"
                  aria-label="More options"
                  title="More options"
                >
                  <IgTwoLines size={20} />
                </button>
              </div>
            </div>

            {/* Post Media - Graphic Carousel Card */}
            <div className="feed-carousel-card-wrap">
              {/* Slide Counter badge on top right */}
              <div className="feed-carousel-badge">1/6</div>

              {/* Top watermark text */}
              <div className="feed-watermark-top">YOUTH OBSERVER</div>

              {/* Graphic Card Content */}
              <div className="feed-news-banner">
                {/* Arrow */}
                <div className="feed-banner-arrow" aria-hidden="true">
                  <span>—————&gt;</span>
                </div>

                {/* Orange Headline Badge */}
                <div className="feed-orange-pill">अनुभव दुबे की सफलता की कहानी</div>

                {/* Hindi Headline */}
                <h2 className="feed-news-headline">
                  IAS बनने निकले थे, आज 100
                  <br />
                  करोड़ का <span className="feed-orange-highlight">चाय बिज़नेस बना डाला!</span>
                </h2>
              </div>

              {/* Anubhav Dubey image */}
              <div className="feed-news-image-box">
                <img
                  src={anubhavDubeyPhoto}
                  alt="Anubhav Dubey speaking at Chai Sutta Bar event"
                  className="feed-news-hero-img"
                  width={430}
                  height={320}
                  loading="lazy"
                />
                {/* Vertical handle credit */}
                <span className="feed-vertical-credit">@YouthObserverNews</span>
              </div>
            </div>

            {/* Post Action Buttons Bar */}
            <div className="feed-actions-bar">
              <div className="feed-actions-left">
                {/* Like Button */}
                <button
                  type="button"
                  className={`feed-action-item ${post2Liked ? "is-liked" : ""}`}
                  onClick={() => setPost2Liked(!post2Liked)}
                  aria-label="Like"
                >
                  <IgHeart
                    size={26}
                    fill={post2Liked ? "#ff2d55" : "none"}
                    color={post2Liked ? "#ff2d55" : "currentColor"}
                    stroke={post2Liked ? "#ff2d55" : "currentColor"}
                  />
                  <span className="feed-action-count">{post2Liked ? "142.1K" : "142K"}</span>
                </button>

                {/* Comment Button */}
                <Link
                  to="/post-view"
                  className="feed-action-item text-inherit no-underline"
                  aria-label="Comments"
                >
                  <IgComment size={25} />
                  <span className="feed-action-count">892</span>
                </Link>

                {/* Repost Button */}
                <button
                  type="button"
                  className={`feed-action-item ${post2Reposted ? "is-reposted" : ""}`}
                  onClick={() => setPost2Reposted(!post2Reposted)}
                  aria-label="Repost"
                >
                  <IgRepost size={25} color={post2Reposted ? "#a855f7" : "currentColor"} />
                  <span className="feed-action-count">{post2Reposted ? "12.5K" : "12.4K"}</span>
                </button>

                {/* Share Button */}
                <Link
                  to="/dashboard"
                  className="feed-action-item text-inherit no-underline"
                  aria-label="Share"
                >
                  <IgShare size={24} />
                  <span className="feed-action-count">45.1K</span>
                </Link>
              </div>

              {/* Bookmark */}
              <button
                type="button"
                className={`feed-action-item feed-bookmark-btn ${
                  post2Bookmarked ? "is-bookmarked" : ""
                }`}
                onClick={() => setPost2Bookmarked(!post2Bookmarked)}
                aria-label="Save"
              >
                <IgBookmark size={25} active={post2Bookmarked} />
              </button>
            </div>

            {/* Post Caption & Details */}
            <div className="feed-caption-block">
              <p className="feed-caption-text">
                <span className="feed-caption-user">youthobserver.news</span>{" "}
                <span>
                  अनुभव दुबे की सफलता की कहानी — चाय सुट्टा बार के फाउंडर की प्रेरणादायक
                  जर्नी
                </span>
                {!post2More ? (
                  <>
                    <span>... </span>
                    <button
                      type="button"
                      className="feed-more-link"
                      onClick={() => setPost2More(true)}
                    >
                      more
                    </button>
                  </>
                ) : (
                  <span>
                    {" "}
                    मध्य प्रदेश के रीवा से निकलकर आज देश-विदेश में 550+ आउटलेट्स का विशाल नेटवर्क
                    खड़ा किया।
                  </span>
                )}
              </p>
              <div className="feed-timestamp-row">
                <span className="feed-time-text">2 days ago</span>
                <span className="feed-dot-separator">·</span>
                <button type="button" className="feed-translation-btn">
                  See Translation
                </button>
              </div>
            </div>
          </article>

        {/* Floating Frosted Glass Bottom Navigation Bar */}
        <FloatingBottomNav />
      </div>
    </main>
  );
}
