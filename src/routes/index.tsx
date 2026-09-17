import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  X,
  Trash2,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
} from "lucide-react";
import {
  IgHeart,
  IgComment,
  IgRepost,
  IgShare,
  IgBookmark,
  IgTwoLines,
  IgPlus,
  IgChevronDown,
  IgVerified,
} from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import {
  useProfile,
  useHomeStories,
  addCustomStoryAccount,
  removeCustomStoryAccount,
  formatCompactNumber,
  type HomeFeedPost,
  type HomeStoryAccount,
} from "@/lib/profile-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instagram" },
      {
        name: "description",
        content: "Instagram feed with editable stories and interactive posts.",
      },
      { property: "og:title", content: "Instagram" },
      {
        property: "og:description",
        content: "Instagram feed with editable stories and interactive posts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeFeedPage,
});

const SUGGESTED_QUICK_ACCOUNTS = [
  "m0tivati0nal_qu0ts",
  "cristiano",
  "virat.kohli",
  "leomessi",
  "natgeo",
  "therock",
];

interface PostItemProps {
  post: HomeFeedPost;
}

function DynamicPostCard({ post }: PostItemProps) {
  const [liked, setLiked] = useState(false);
  const [likeOffset, setLikeOffset] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikeOffset((c) => c + 1);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 900);
  };

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeOffset((c) => c - 1);
    } else {
      setLiked(true);
      setLikeOffset((c) => c + 1);
    }
  };

  const isVideo = Boolean(post.is_video || (post.video_url && post.video_url.length > 0));

  return (
    <article className="feed-post-card border-b border-[var(--line)] pb-4 mb-2">
      {/* Post Header */}
      <header className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="feed-story-avatar-wrap has-gradient-ring !w-10 !h-10 !p-0.5 shrink-0">
            <img
              src={post.avatar}
              alt={post.user}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60";
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13.5px] font-bold text-inherit truncate leading-tight">
                {post.user}
              </span>
              {post.isVerified && <IgVerified size={13} className="text-[#0095f6]" />}
            </div>
            {post.sub && (
              <span className="text-[11.5px] text-[var(--subtle)] truncate flex items-center gap-1 mt-0.5">
                {post.sub}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="p-1 text-inherit border-none bg-transparent cursor-pointer flex items-center opacity-80 hover:opacity-100"
          aria-label="Options"
        >
          <IgTwoLines size={20} />
        </button>
      </header>

      {/* Post Media */}
      <div
        className="relative w-full aspect-[4/5] bg-black overflow-hidden select-none cursor-pointer flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
      >
        {isVideo && post.video_url ? (
          <video
            src={post.video_url}
            poster={post.img}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            webkit-playsinline="true"
          />
        ) : (
          <img
            src={post.img}
            alt={post.caption || "Feed post"}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60";
            }}
          />
        )}

        {/* Double Tap Heart Pop */}
        {showHeartPop && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
            <div className="animate-heart-pop text-white drop-shadow-[0_0_24px_rgba(239,68,68,0.9)]">
              <Heart size={96} fill="#ef4444" color="#ef4444" />
            </div>
          </div>
        )}

        {/* Mute button if video */}
        {isVideo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:scale-105 transition-transform"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        )}
      </div>

      {/* Post Actions: Like, Comment, Repost, Share, Bookmark */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-1">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleLike}
            className={`p-0 bg-transparent border-none cursor-pointer transition-transform active:scale-75 ${
              liked ? "text-[#ff3040]" : "text-inherit"
            }`}
            aria-label="Like"
          >
            <IgHeart size={26} active={liked} />
          </button>

          <button
            type="button"
            className="p-0 bg-transparent border-none cursor-pointer text-inherit hover:opacity-75 transition-opacity"
            aria-label="Comment"
          >
            <IgComment size={25} />
          </button>

          <button
            type="button"
            onClick={() => setReposted(!reposted)}
            className={`p-0 bg-transparent border-none cursor-pointer transition-colors ${
              reposted ? "text-[#a855f7]" : "text-inherit"
            }`}
            aria-label="Repost"
          >
            <IgRepost size={25} color={reposted ? "#a855f7" : "currentColor"} />
          </button>

          <button
            type="button"
            className="p-0 bg-transparent border-none cursor-pointer text-inherit hover:opacity-75 transition-opacity"
            aria-label="Share"
          >
            <IgShare size={24} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setBookmarked(!bookmarked)}
          className={`p-0 bg-transparent border-none cursor-pointer text-inherit transition-transform active:scale-90 ${
            bookmarked ? "text-inherit" : "opacity-90 hover:opacity-100"
          }`}
          aria-label="Bookmark"
        >
          <IgBookmark size={24} active={bookmarked} />
        </button>
      </div>

      {/* Post Details: Likes, Caption, Time */}
      <div className="px-3.5 pt-1 space-y-1 text-[13.5px]">
        <p className="font-bold">
          {post.likes} {likeOffset > 0 ? `+${likeOffset}` : ""} likes
        </p>
        <p className="leading-snug">
          <span className="font-bold mr-1.5">{post.user}</span>
          <span className="whitespace-pre-line">{post.caption}</span>
        </p>
        {post.comments && (
          <button
            type="button"
            className="text-[12.5px] text-[var(--subtle)] bg-transparent border-none p-0 cursor-pointer block hover:underline"
          >
            View all {post.comments} comments
          </button>
        )}
        <p className="text-[11px] uppercase tracking-wider text-[var(--subtle)] pt-0.5">
          {post.time}
        </p>
      </div>
    </article>
  );
}

function HomeFeedPage() {
  const { profile } = useProfile();
  const { stories } = useHomeStories();

  const [isManageStoriesOpen, setIsManageStoriesOpen] = useState(false);
  const [storyInput, setStoryInput] = useState("");
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);
  const [activeStoryViewer, setActiveStoryViewer] = useState<HomeStoryAccount | null>(null);

  const handleAddStory = async (usernameToAdd?: string) => {
    const target = usernameToAdd || storyInput;
    if (!target.trim()) return;

    setIsAddingStory(true);
    setStoryError(null);

    const res = await addCustomStoryAccount(target);
    setIsAddingStory(false);

    if (res.success) {
      setStoryInput("");
    } else {
      setStoryError(res.error || "Unable to add account. Please check the username.");
    }
  };

  // Construct combined feed posts
  // 1. User's own cloned profile posts
  const userProfilePosts: HomeFeedPost[] = (profile.posts || []).slice(0, 3).map((p, idx) => ({
    id: `user_p_${p.id || idx}`,
    user: profile.username,
    avatar: profile.avatarUrl,
    sub: idx % 2 === 0 ? "♫ Original Audio" : "City Highlights",
    img: p.display_url || p.thumbnail_src || profile.avatarUrl,
    count: "1/1",
    tag1: `#${profile.username}`,
    tag2: "#moments",
    time: "2 hours ago",
    likes: formatCompactNumber(p.likes || 850),
    comments: formatCompactNumber(p.comments || 32),
    caption: p.caption || "Consistency and creativity ✨ #moments",
    isVerified: profile.isVerified,
    is_video: p.is_video,
    video_url: p.video_url,
    shortcode: p.shortcode,
  }));

  // 2. Added story accounts posts
  const storyAccountsPosts: HomeFeedPost[] = stories.flatMap((s) => s.posts || []);

  // 3. Realistic interleaved feed
  const combinedFeed: HomeFeedPost[] = [];
  let uIdx = 0;
  let sIdx = 0;

  while (uIdx < userProfilePosts.length || sIdx < storyAccountsPosts.length) {
    if (uIdx < userProfilePosts.length) {
      const uPost = userProfilePosts[uIdx++];
      if (uPost) combinedFeed.push(uPost);
    }
    if (sIdx < storyAccountsPosts.length) {
      const sPost = storyAccountsPosts[sIdx++];
      if (sPost) combinedFeed.push(sPost);
    }
  }

  const isStoriesFull = stories.length >= 10;

  return (
    <main className="min-h-screen bg-page text-ink">
      <div className="phone-shell pb-24 feed-phone-shell">
        {/* Top Instagram Header: [+] Instagram ⌵ [❤] */}
        <header className="feed-top-header" aria-label="Instagram Top Bar">
          <button
            type="button"
            onClick={() => setIsManageStoriesOpen(true)}
            className="feed-header-icon-btn bg-transparent border-none p-0 cursor-pointer"
            aria-label="Manage stories"
            title="Manage Story Accounts"
          >
            <IgPlus size={26} />
          </button>

          <div className="feed-brand-wrap">
            <span className="feed-brand-title">Instagram</span>
            <span className="feed-brand-chevron" aria-hidden="true">
              <IgChevronDown size={14} />
            </span>
          </div>

          <Link
            to="/insights"
            className="feed-header-icon-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <IgHeart size={24} />
          </Link>
        </header>

        {/* Stories Horizontal Tray */}
        <section className="feed-stories-tray" aria-label="Stories">
          {/* Your Story (Opens Manage Stories modal) */}
          <button
            type="button"
            onClick={() => setIsManageStoriesOpen(true)}
            className="feed-story-item text-inherit no-underline bg-transparent border-none p-0 cursor-pointer"
            title="Your story (Click to manage stories)"
          >
            <div className="feed-story-avatar-wrap is-own">
              <img
                src={profile.avatarUrl}
                alt="Your story"
                className="feed-story-img"
                width={68}
                height={68}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60";
                }}
              />
              <span className="feed-story-plus-badge" title="Add to story">
                <IgPlus size={14} />
              </span>
            </div>
            <span className="feed-story-name">Your story</span>
          </button>

          {/* Dynamic Story Accounts */}
          {stories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveStoryViewer(story)}
              className="feed-story-item text-inherit no-underline bg-transparent border-none p-0 cursor-pointer"
              title={`@${story.username}`}
            >
              <div className="feed-story-avatar-wrap has-gradient-ring">
                <img
                  src={story.profilePicUrl}
                  alt={story.username}
                  className="feed-story-img"
                  width={68}
                  height={68}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60";
                  }}
                />
              </div>
              <span className="feed-story-name truncate max-w-[72px] block">
                {story.username}
              </span>
            </button>
          ))}
        </section>

        {/* Dynamic Feed Posts List */}
        <section aria-label="Feed posts">
          {combinedFeed.map((post) => (
            <DynamicPostCard key={post.id} post={post} />
          ))}
        </section>

        {/* Floating Bottom Nav */}
        <FloatingBottomNav />
      </div>

      {/* =========================================================================
          MANAGE STORIES BOTTOM SHEET MODAL (Matches GitHub Insight Folder)
          ========================================================================= */}
      {isManageStoriesOpen && (
        <div
          className="clone-modal-backdrop"
          onClick={() => !isAddingStory && setIsManageStoriesOpen(false)}
        >
          <div
            className="clone-modal-card max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-10 h-1 bg-white/25 rounded-full mx-auto mb-3" />

            {/* Header + Counter Badge */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[18px] font-bold text-ink">Manage Home Stories</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold border ${
                  isStoriesFull
                    ? "bg-red-500/20 text-red-400 border-red-500/40"
                    : "bg-[var(--brand)]/20 text-[var(--brand)] border-[var(--brand)]/40"
                }`}
              >
                {stories.length}/10 Added
              </span>
            </div>

            <p className="text-[13px] text-[var(--subtle)] leading-relaxed mb-4">
              Add up to 10 Instagram usernames. Their live profile avatar will appear in your top
              story tray and their posts will show on your feed.
            </p>

            {/* Input Form */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[var(--brand)] text-[15px]">
                  @
                </span>
                <input
                  type="text"
                  value={storyInput}
                  onChange={(e) => setStoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isAddingStory && !isStoriesFull) {
                      handleAddStory();
                    }
                  }}
                  disabled={isStoriesFull || isAddingStory}
                  placeholder={
                    isStoriesFull ? "Limit reached (10/10)" : "Enter username (e.g. cristiano)"
                  }
                  className="w-full bg-[var(--panel)] text-ink pl-8 pr-3 py-2.5 rounded-xl border border-[var(--line)] text-[14px] outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-50"
                />
              </div>

              <button
                type="button"
                onClick={() => handleAddStory()}
                disabled={isStoriesFull || isAddingStory || !storyInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white font-semibold text-[14px] border-none cursor-pointer disabled:opacity-40 flex items-center justify-center min-w-[70px] hover:opacity-90 transition-opacity"
              >
                {isAddingStory ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Add"
                )}
              </button>
            </div>

            {/* Error Message */}
            {storyError && (
              <p className="text-[12.5px] text-red-500 font-medium mb-3">{storyError}</p>
            )}

            {/* Quick Suggestion Chips */}
            <div className="mb-4">
              <p className="text-[12px] font-semibold text-[var(--subtle)] mb-2">
                Quick Suggestions:
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {SUGGESTED_QUICK_ACCOUNTS.map((uname) => {
                  const isAdded = stories.some(
                    (s) => s.username.toLowerCase() === uname.toLowerCase()
                  );
                  return (
                    <button
                      key={uname}
                      type="button"
                      disabled={isAdded || isStoriesFull || isAddingStory}
                      onClick={() => handleAddStory(uname)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border shrink-0 flex items-center gap-1 cursor-pointer transition-all ${
                        isAdded
                          ? "bg-[var(--panel)] text-[var(--brand)] border-[var(--brand)]/30 opacity-70 cursor-default"
                          : "bg-[var(--panel)] text-ink border-[var(--line)] hover:border-[var(--brand)]"
                      }`}
                    >
                      {isAdded && <CheckCircle2 size={13} className="text-[var(--brand)]" />}
                      <span>@{uname}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-[var(--line)] my-3" />

            {/* Added Accounts List */}
            <h3 className="text-[13.5px] font-bold text-ink mb-2">
              Added Story Accounts ({stories.length}/10)
            </h3>

            {stories.length === 0 ? (
              <p className="text-center py-6 text-[13px] text-[var(--subtle)]">
                No custom story accounts yet. Enter a username above to add stories to your home feed!
              </p>
            ) : (
              <div className="space-y-1.5">
                {stories.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-[var(--panel)] border border-[var(--line)]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0">
                        <img
                          src={acc.profilePicUrl}
                          alt={acc.username}
                          className="w-full h-full rounded-full object-cover bg-black"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-bold text-ink truncate leading-tight">
                          {acc.username}
                        </p>
                        <p className="text-[11.5px] text-[var(--subtle)] truncate">
                          {acc.fullName || `@${acc.username}`}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCustomStoryAccount(acc.username)}
                      className="p-2 text-red-500 hover:text-red-600 bg-transparent border-none cursor-pointer transition-colors"
                      title="Remove story account"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsManageStoriesOpen(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-[var(--panel)] border border-[var(--line)] text-ink font-semibold text-[13.5px] cursor-pointer hover:bg-[var(--line)] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULLSCREEN STORY VIEWER DIALOG (Matches GitHub Insight Folder)
          ========================================================================= */}
      {activeStoryViewer && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in select-none"
          onClick={() => setActiveStoryViewer(null)}
        >
          <div
            className="relative w-full max-w-[420px] h-[82vh] max-h-[760px] bg-[#111] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Story Header & Progress Bar */}
            <div className="absolute top-0 inset-x-0 z-30 p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-white animate-[storyProgress_5s_linear_forwards]" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={activeStoryViewer.profilePicUrl}
                    alt={activeStoryViewer.username}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
                  />
                  <div className="min-w-0">
                    <span className="text-white font-bold text-[13.5px] drop-shadow-md truncate block">
                      {activeStoryViewer.username}
                    </span>
                    <span className="text-white/70 text-[11px] drop-shadow-md">
                      4h ago
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStoryViewer(null)}
                  className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 border-none cursor-pointer"
                  aria-label="Close story"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Story Media */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden bg-black">
              <img
                src={
                  activeStoryViewer.posts[0]?.img ||
                  activeStoryViewer.profilePicUrl
                }
                alt={activeStoryViewer.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";
                }}
              />
            </div>

            {/* Bottom Caption & Interactive Reply Bar */}
            <div className="absolute bottom-0 inset-x-0 z-30 p-3.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <p className="text-white text-[13px] drop-shadow mb-3 line-clamp-2">
                {activeStoryViewer.posts[0]?.caption ||
                  `Story highlights by @${activeStoryViewer.username} ✨`}
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${activeStoryViewer.username}...`}
                  className="flex-1 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-2 text-[13px] text-white placeholder-white/60 outline-none"
                />
                <button
                  type="button"
                  className="p-2 text-white bg-transparent border-none cursor-pointer hover:scale-110 transition-transform"
                >
                  <IgHeart size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
