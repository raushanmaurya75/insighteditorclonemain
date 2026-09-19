import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Heart } from "lucide-react";
import {
  IgHeart,
  IgComment,
  IgRepost,
  IgShare,
  IgBookmark,
  IgTwoLines,
  IgEye,
} from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import {
  useProfile,
  formatCompactNumber,
  formatPostDate,
  setSelectedPostIndex,
  type ProfilePost,
} from "@/lib/profile-store";

export const Route = createFileRoute("/post-view")({
  head: () => ({
    meta: [
      { title: "Posts — Instagram" },
      {
        name: "description",
        content: "Instagram Post view player and feed.",
      },
      { property: "og:title", content: "Posts — Instagram" },
      {
        property: "og:description",
        content: "Instagram Post view player and feed.",
      },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostViewPage,
});

interface PostCardProps {
  post: ProfilePost;
  author: string;
  authorAvatar: string;
  postIndex: number;
}

function PostCardItem({
  post,
  author,
  authorAvatar,
  postIndex,
}: PostCardProps) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCountOffset, setLikeCountOffset] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikeCountOffset((c) => c + 1);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 900);
  };

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCountOffset((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCountOffset((c) => c + 1);
    }
  };

  const displayImage = post.display_url || post.thumbnail_src || authorAvatar;
  const likesDisplay = formatCompactNumber(post.likes + likeCountOffset);
  const commentsDisplay = formatCompactNumber(post.comments);
  const viewsDisplay = formatCompactNumber(post.views || post.likes * 10 || 1200);

  const captionText = (post.caption || "").trim();
  const shouldTruncate = captionText.length > 32 || captionText.includes("\n");

  return (
    <article className="post-view-card">
      {/* 1. Post Header: Avatar + Username + Audio Subtitle + 2-line Menu */}
      <header className="post-view-author-row">
        <div className="post-view-author-info">
          <Link to="/profile" className="shrink-0">
            <img
              src={authorAvatar}
              alt={author}
              className="post-view-avatar"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60";
              }}
            />
          </Link>
          <div className="post-view-author-text">
            <Link to="/profile" className="post-view-author-name">
              {author}
            </Link>
            <span className="post-view-author-sub">
              <span>♫</span>
              <span>{author} · Original audio</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-1 text-inherit border-none bg-transparent cursor-pointer flex items-center opacity-80 hover:opacity-100"
          aria-label="More post options"
        >
          <IgTwoLines size={20} />
        </button>
      </header>

      {/* 2. Media Image (with Aspect Ratio 4:5) */}
      <div
        className="post-view-media-wrap"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={displayImage}
          alt={captionText || author}
          className="w-full h-full object-cover select-none"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60";
          }}
        />

        {/* Double-tap animated heart pop */}
        {showHeartPop && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
            <div className="animate-heart-pop text-white drop-shadow-[0_0_24px_rgba(239,68,68,0.9)]">
              <Heart size={96} fill="#ef4444" color="#ef4444" />
            </div>
          </div>
        )}
      </div>

      {/* 3. View Insights & Boost Bar (Matching typography & colors) */}
      <div className="post-view-insights-bar">
        <button
          type="button"
          onClick={() => {
            setSelectedPostIndex(postIndex);
            navigate({ to: "/insight-view" });
          }}
          className="post-view-insights-btn"
          title="View detailed performance insights"
        >
          <IgEye size={17} />
          <span>{viewsDisplay} · View insights</span>
        </button>

        <button type="button" className="post-view-boost-btn">
          Boost post
        </button>
      </div>

      {/* 4. Action Buttons Bar: Like, Comment, Repost, Share, Bookmark */}
      <div className="post-view-actions-bar justify-between">
        <div className="flex items-center gap-5">
          {/* Like + Count */}
          <div className="post-view-action-group">
            <button
              type="button"
              onClick={toggleLike}
              className={`post-view-action-btn ${liked ? "text-[#ff3040]" : ""}`}
              aria-label="Like post"
            >
              <IgHeart size={26} active={liked} />
            </button>
            <span>{likesDisplay}</span>
          </div>

          {/* Comment + Count */}
          <div className="post-view-action-group">
            <button
              type="button"
              className="post-view-action-btn"
              aria-label="Comment on post"
            >
              <IgComment size={26} />
            </button>
            <span>{commentsDisplay}</span>
          </div>

          {/* Repost */}
          <button
            type="button"
            onClick={() => setReposted(!reposted)}
            className={`post-view-action-btn ${reposted ? "text-[#a855f7]" : ""}`}
            aria-label="Repost"
          >
            <IgRepost size={26} color={reposted ? "#a855f7" : "currentColor"} />
          </button>

          {/* Share */}
          <button
            type="button"
            className="post-view-action-btn"
            aria-label="Share post"
          >
            <IgShare size={25} />
          </button>
        </div>

        {/* Save / Bookmark */}
        <button
          type="button"
          onClick={() => setBookmarked(!bookmarked)}
          className="post-view-action-btn"
          aria-label="Save post"
        >
          <IgBookmark size={25} active={bookmarked} />
        </button>
      </div>

      {/* 5. Caption with Home Feed Style Truncation and Post Age */}
      <div className="post-view-caption-wrap">
        <div className="post-view-caption-text">
          <Link to="/profile" className="post-view-caption-author">
            {author}
          </Link>
          {isCaptionExpanded || !shouldTruncate ? (
            <span className="whitespace-pre-line">
              {captionText || "Moments & creativity ✨"}
            </span>
          ) : (
            <>
              <span>{captionText.slice(0, 32).trim()}</span>
              <button
                type="button"
                onClick={() => setIsCaptionExpanded(true)}
                className="post-view-more-btn"
              >
                ... more
              </button>
            </>
          )}
        </div>
        <p className="post-view-age">{formatPostDate(post.timestamp)}</p>
      </div>
    </article>
  );
}

function PostViewPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  const postsList = profile.posts.length > 0 ? profile.posts : [];
  const selectedIdx =
    profile.selectedPostIndex >= 0 && profile.selectedPostIndex < postsList.length
      ? profile.selectedPostIndex
      : 0;

  // Reorder posts so the tapped post appears first, followed by the rest
  const orderedPosts = [
    ...postsList.slice(selectedIdx),
    ...postsList.slice(0, selectedIdx),
  ];

  return (
    <main className="min-h-screen bg-page text-ink">
      <div className="phone-shell pb-24 feed-phone-shell">
        {/* Top Header: [< Back] Posts (Sticky, no separator line) */}
        <header className="post-view-header">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/profile" })}
              className="p-1 text-inherit bg-transparent border-none cursor-pointer flex items-center justify-center -ml-1 hover:opacity-80"
              aria-label="Back to profile"
              title="Back to profile"
            >
              <ChevronLeft size={28} strokeWidth={2.4} />
            </button>
            <h1>Posts</h1>
          </div>

          <div className="w-8" />
        </header>

        {/* Scrollable List of Posts without top separator line */}
        <section aria-label="Posts list">
          {orderedPosts.map((post, idx) => {
            const originalIndex = postsList.findIndex((p) => p.id === post.id);
            return (
              <PostCardItem
                key={post.id || `post_${idx}`}
                post={post}
                author={profile.username}
                authorAvatar={profile.avatarUrl}
                postIndex={originalIndex >= 0 ? originalIndex : idx}
              />
            );
          })}
        </section>

        {/* Floating Bottom Nav */}
        <FloatingBottomNav />
      </div>
    </main>
  );
}

