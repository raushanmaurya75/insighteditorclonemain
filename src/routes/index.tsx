import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
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
  IgClose,
  IgInstagramGlyph,
  IgMetaLogo,
} from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import {
  useProfile,
  useHomeStories,
  cloneInstagramProfile,
  addCustomStoryAccount,
  removeCustomStoryAccount,
  formatCompactNumber,
  getFamousCelebrityPosts,
  getSuggestedMotivationalPost,
  getAllSuggestedPosts,
  fetchAllFreshSuggestedPosts,
  fetchLiveUserPosts,
  fetchLiveUserData,
  updateStoriesWithLiveAvatars,
  type HomeFeedPost,
  type HomeStoryAccount,
} from "@/lib/profile-store";
import { isRuntimeSecurityValid, crashAppSecurityPanic } from "@/lib/access-code-service";

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

interface PostItemProps {
  post: HomeFeedPost;
}

function parseNumericCount(val: string | number | undefined, fallback: number = 0): number {
  if (val == null) return fallback;
  if (typeof val === "number") return isNaN(val) ? fallback : val;
  const clean = val.toString().trim().toUpperCase().replace(/,/g, "");
  if (clean.endsWith("M")) return (parseFloat(clean.replace("M", "")) || 0) * 1_000_000;
  if (clean.endsWith("K")) return (parseFloat(clean.replace("K", "")) || 0) * 1_000;
  const num = parseFloat(clean);
  return isNaN(num) ? fallback : num;
}

function DynamicPostCard({ post }: PostItemProps) {
  const { profile } = useProfile();
  const { stories } = useHomeStories();
  const [liked, setLiked] = useState(false);
  const [likeOffset, setLikeOffset] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const isOwnPost = post.user.toLowerCase() === profile.username.toLowerCase();
  const isStoryAccount = stories.some((s) => s.username.toLowerCase() === post.user.toLowerCase());
  const showFollowButton = !isOwnPost && !isStoryAccount;
  const isSuggested = !isOwnPost && !isStoryAccount && Boolean(post.isSuggested);
  const isCarousel = Boolean(
    (post as any).is_carousel ||
    (post as any).isCarousel ||
    (post.count && post.count.includes("/") && post.count !== "1/1")
  );

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

  const baseLikes = parseNumericCount(post.likes, 12800);
  const baseComments = parseNumericCount(post.comments, Math.max(12, Math.round(baseLikes * 0.008)));
  const baseReposts = parseNumericCount((post as any).reposts, Math.max(24, Math.round(baseLikes * 0.038)));
  const baseShares = parseNumericCount((post as any).shares, Math.max(68, Math.round(baseLikes * 0.145)));

  const displayedLikes = formatCompactNumber(baseLikes + likeOffset);
  const displayedComments = formatCompactNumber(baseComments);
  const displayedReposts = formatCompactNumber(baseReposts + (reposted ? 1 : 0));
  const displayedShares = formatCompactNumber(baseShares);

  const fullCaption = (post.caption || "").trim();
  const hasNewlines = fullCaption.includes("\n");
  const isCaptionLong = fullCaption.length > 55 || hasNewlines;
  const shortCaption = isCaptionLong
    ? (hasNewlines ? fullCaption.split("\n")[0] : fullCaption.slice(0, 55)).trim()
    : fullCaption;

  const displayTime = post.time && post.time !== "Suggested for you" ? post.time : "10 hours ago";

  return (
    <article className="feed-post-card pb-3 mb-1">
      <header className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[var(--line)] bg-gray-100 dark:bg-zinc-800">
            <img
              src={post.avatar}
              alt={post.user}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60";
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[13.5px] font-bold text-inherit truncate leading-tight">
                {post.user}
              </span>
              {post.isVerified && <IgVerified size={13} className="text-[#0095f6]" />}
            </div>
            <span className="text-[11.5px] text-[var(--subtle)] truncate flex items-center gap-1 mt-0.5 leading-tight">
              {isSuggested ? "Suggested for you" : post.sub || "♫ Original Audio"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showFollowButton && (
            <button
              type="button"
              onClick={() => setIsFollowing(!isFollowing)}
              className={`rounded-lg transition-colors cursor-pointer border-none ${
                isFollowing
                  ? "bg-[var(--line)] text-ink"
                  : "bg-[#efefef] hover:bg-[#dbdbdb] dark:bg-[#262626] dark:hover:bg-[#363636] text-ink"
              }`}
              style={{ fontSize: "14px", fontWeight: 600, padding: "7px 18px", lineHeight: "1" }}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
          <button
            type="button"
            className="p-1 text-inherit border-none bg-transparent cursor-pointer flex items-center opacity-85 hover:opacity-100"
            aria-label="Options"
          >
            <IgTwoLines size={26} />
          </button>
        </div>
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

      {/* Carousel dots indicator - only for carousel posts */}
      {isCarousel && (
        <div className="flex items-center justify-center gap-1.5 pt-2.5 pb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0095f6]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#dbdbdb]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#dbdbdb]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#dbdbdb]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#dbdbdb]" />
        </div>
      )}

      {/* Post Actions with Inline Interaction Counts */}
      <div className="flex items-center justify-between px-3.5 pt-1 pb-1.5">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Like */}
          <button
            type="button"
            onClick={toggleLike}
            className={`flex items-center gap-1.5 p-0 bg-transparent border-none cursor-pointer transition-transform active:scale-90 ${
              liked ? "text-[#ff3040]" : "text-inherit"
            }`}
            aria-label="Like"
          >
            <IgHeart size={24} active={liked} />
            <span className="text-[13.5px] font-semibold text-inherit tracking-tight">
              {displayedLikes}
            </span>
          </button>

          {/* Comment */}
          <button
            type="button"
            className="flex items-center gap-1.5 p-0 bg-transparent border-none cursor-pointer text-inherit hover:opacity-75 transition-opacity"
            aria-label="Comment"
          >
            <IgComment size={23} />
            <span className="text-[13.5px] font-semibold text-inherit tracking-tight">
              {displayedComments}
            </span>
          </button>

          {/* Repost */}
          <button
            type="button"
            onClick={() => setReposted(!reposted)}
            className={`flex items-center gap-1.5 p-0 bg-transparent border-none cursor-pointer transition-colors ${
              reposted ? "text-[#a855f7]" : "text-inherit"
            }`}
            aria-label="Repost"
          >
            <IgRepost size={22} color={reposted ? "#a855f7" : "currentColor"} />
            <span className="text-[13.5px] font-semibold text-inherit tracking-tight">
              {displayedReposts}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            className="flex items-center gap-1.5 p-0 bg-transparent border-none cursor-pointer text-inherit hover:opacity-75 transition-opacity"
            aria-label="Share"
          >
            <IgShare size={22} />
            <span className="text-[13.5px] font-semibold text-inherit tracking-tight">
              {displayedShares}
            </span>
          </button>
        </div>

        {/* Bookmark */}
        <button
          type="button"
          onClick={() => setBookmarked(!bookmarked)}
          className={`p-0 bg-transparent border-none cursor-pointer text-inherit transition-transform active:scale-90 ${
            bookmarked ? "text-inherit" : "opacity-90 hover:opacity-100"
          }`}
          aria-label="Bookmark"
        >
          <IgBookmark size={23} active={bookmarked} />
        </button>
      </div>

      {/* Post Details: Caption, See more, Timestamp & Translation */}
      <div className="px-3.5 pt-0.5 space-y-1 text-[13.5px]">
        {fullCaption.length > 0 && (
          <div className="leading-snug">
            <Link
              to="/profile"
              className="mr-1.5 no-underline hover:underline inline"
              style={{ fontWeight: 700, color: "var(--ink)" }}
            >
              {post.user}
            </Link>
            {!isCaptionExpanded && isCaptionLong ? (
              <span className="text-inherit">
                {shortCaption}
                <button
                  type="button"
                  onClick={() => setIsCaptionExpanded(true)}
                  className="font-normal cursor-pointer bg-transparent border-none p-0 ml-1 inline text-[13.5px]"
                  style={{ color: "#737373" }}
                >
                  ... more
                </button>
              </span>
            ) : (
              <span className="whitespace-pre-line text-inherit">
                {showTranslation ? `Translated: ${fullCaption}` : fullCaption}
                {isCaptionLong && isCaptionExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsCaptionExpanded(false)}
                    className="font-normal cursor-pointer bg-transparent border-none p-0 ml-1.5 text-xs inline"
                    style={{ color: "#737373" }}
                  >
                    less
                  </button>
                )}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--subtle)] pt-0.5">
          <span>{displayTime}</span>
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className="font-semibold text-inherit hover:underline bg-transparent border-none p-0 cursor-pointer text-[11.5px]"
          >
            {showTranslation ? "See original" : "See translation"}
          </button>
        </div>
      </div>
    </article>
  );
}

function checkIsSplashNeeded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return !sessionStorage.getItem("ig_splash_completed_v3");
  } catch {
    return false;
  }
}

function shuffleFeedPosts(posts: HomeFeedPost[]): HomeFeedPost[] {
  if (posts.length <= 1) return posts;
  const pool = [...posts];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // De-duplicate consecutive posts from the same author
  const result: HomeFeedPost[] = [];
  const deferred: HomeFeedPost[] = [];

  for (const post of pool) {
    if (result.length > 0 && result[result.length - 1].user.toLowerCase() === post.user.toLowerCase()) {
      deferred.push(post);
    } else {
      result.push(post);
      if (deferred.length > 0) {
        const defIdx = deferred.findIndex((d) => d.user.toLowerCase() !== post.user.toLowerCase());
        if (defIdx !== -1) {
          result.push(deferred.splice(defIdx, 1)[0]);
        }
      }
    }
  }

  // Distribute any remaining deferred posts with maximal author spacing
  for (const defPost of deferred) {
    let inserted = false;
    for (let i = 0; i < result.length; i++) {
      const prev = result[i];
      const next = result[i + 1];
      if (
        prev.user.toLowerCase() !== defPost.user.toLowerCase() &&
        (!next || next.user.toLowerCase() !== defPost.user.toLowerCase())
      ) {
        result.splice(i + 1, 0, defPost);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      result.push(defPost);
    }
  }

  return result;
}

const HOME_FEED_PERSIST_KEY = "ig_home_feed_persistent_v1";

function loadCachedFeed(): HomeFeedPost[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(HOME_FEED_PERSIST_KEY) || localStorage.getItem(HOME_FEED_PERSIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

function saveCachedFeed(posts: HomeFeedPost[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(HOME_FEED_PERSIST_KEY, JSON.stringify(posts));
    localStorage.setItem(HOME_FEED_PERSIST_KEY, JSON.stringify(posts));
  } catch {}
}

function buildHomeFeedFromSources(
  storyAccounts: HomeStoryAccount[],
  liveMap: Map<string, HomeFeedPost[]>,
  suggestedPool: HomeFeedPost[],
  currentUsername: string
): HomeFeedPost[] {
  const storyPosts: HomeFeedPost[] = [];
  const storyUserSet = new Set(storyAccounts.map((s) => s.username.toLowerCase()));
  const currentLower = (currentUsername || "").toLowerCase();

  // 1. Story accounts posts (marked isSuggested: false)
  storyAccounts.forEach((s) => {
    const livePosts = liveMap.get(s.username);
    const postList = livePosts && livePosts.length > 0 ? livePosts : s.posts;
    (postList || []).forEach((p) => {
      // Cloned profile posts are NEVER shown in home feed
      if (p.user.toLowerCase() !== currentLower) {
        storyPosts.push({
          ...p,
          isSuggested: false,
        });
      }
    });
  });

  // 2. Suggested posts (only accounts not in stories & not the cloned user profile)
  const suggested: HomeFeedPost[] = (suggestedPool || [])
    .filter(
      (p) =>
        Boolean(p) &&
        !storyUserSet.has(p.user.toLowerCase()) &&
        p.user.toLowerCase() !== currentLower
    )
    .map((p) => ({
      ...p,
      isSuggested: true,
    }));

  // Note: user's cloned profile posts are NEVER added to home feed
  const combined = [...storyPosts, ...suggested];
  if (combined.length === 0) return [];
  return shuffleFeedPosts(combined);
}

function HomeFeedPage() {
  const { profile, cloneProfile } = useProfile();
  const { stories } = useHomeStories();

  // Hard anti-bypass check: if unauthorized, panic & lockdown
  useEffect(() => {
    if (!isRuntimeSecurityValid()) {
      crashAppSecurityPanic("Unauthorized access attempt to Home Feed");
    }
  }, []);

  const [isSplashActive, setIsSplashActive] = useState<boolean>(false);
  const [isSplashFading, setIsSplashFading] = useState(false);

  const [isManageStoriesOpen, setIsManageStoriesOpen] = useState(false);
  const [storyInput, setStoryInput] = useState("");
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);
  const [activeStoryViewer, setActiveStoryViewer] = useState<HomeStoryAccount | null>(null);

  // Initial feed state: loaded from cache or initialized on splash screen once
  const [feedPosts, setFeedPosts] = useState<HomeFeedPost[]>(() => {
    const cached = loadCachedFeed();
    if (cached && cached.length > 0) return cached;
    return [];
  });

  // Cold-start splash screen: Pre-builds 100% of the feed & story avatars before revealing Home
  useEffect(() => {
    let active = true;

    const needsSplash = checkIsSplashNeeded();

    if (needsSplash) {
      setIsSplashActive(true);

      const minSplashDelay = new Promise((resolve) => setTimeout(resolve, 1500));
      const profilePromise = profile.username
        ? (cloneProfile || cloneInstagramProfile)(profile.username)
        : Promise.resolve({ success: true });
      const suggestedPromise = fetchAllFreshSuggestedPosts();
      const storyUsernames = stories.map((s) => s.username).filter(Boolean);
      const storyPromise =
        storyUsernames.length > 0
          ? Promise.allSettled(storyUsernames.map((u) => fetchLiveUserData(u)))
          : Promise.resolve([]);

      // Preload everything simultaneously while splash is showing (User Profile + Suggested Feed + Stories)
      Promise.allSettled([profilePromise, suggestedPromise, storyPromise, minSplashDelay]).then(
        ([_profRes, sugRes, storyRes]) => {
          if (!active) return;

          let freshSug: HomeFeedPost[] = getAllSuggestedPosts();
          if (sugRes.status === "fulfilled" && sugRes.value && sugRes.value.length > 0) {
            freshSug = sugRes.value;
          }

          const nextMap = new Map<string, HomeFeedPost[]>();
          if (storyRes.status === "fulfilled" && Array.isArray(storyRes.value)) {
            const validResults: any[] = [];
            storyRes.value.forEach((r: any) => {
              if (r.status === "fulfilled" && r.value) {
                validResults.push(r.value);
                if (r.value.posts && r.value.posts.length > 0) {
                  nextMap.set(r.value.username, r.value.posts);
                }
              }
            });

            if (validResults.length > 0) {
              updateStoriesWithLiveAvatars(validResults);
            }
          }

          // Build and randomize the home feed ONCE right here on splash screen
          const newGeneratedFeed = buildHomeFeedFromSources(
            stories,
            nextMap,
            freshSug,
            profile.username
          );

          saveCachedFeed(newGeneratedFeed);
          setFeedPosts(newGeneratedFeed);

          try {
            sessionStorage.setItem("ig_splash_completed_v3", "1");
          } catch {}

          // Feed & Avatars are 100% created — smoothly fade out splash screen!
          setIsSplashFading(true);
          setTimeout(() => {
            if (active) setIsSplashActive(false);
          }, 400);
        }
      );

      // Failsafe timeout (3.8s max)
      const failsafe = setTimeout(() => {
        if (active) {
          try {
            sessionStorage.setItem("ig_splash_completed_v3", "1");
          } catch {}
          setIsSplashFading(true);
          setTimeout(() => {
            if (active) setIsSplashActive(false);
          }, 400);
        }
      }, 3800);

      return () => {
        active = false;
        clearTimeout(failsafe);
      };
    } else {
      // Subsequent visits in session: Splash is skipped and feed is ALREADY created!
      setIsSplashActive(false);

      const cached = loadCachedFeed();
      if (!cached || cached.length === 0) {
        const fallbackFeed = buildHomeFeedFromSources(
          stories,
          new Map(),
          getAllSuggestedPosts(),
          profile.username
        );
        saveCachedFeed(fallbackFeed);
        setFeedPosts(fallbackFeed);
      } else {
        setFeedPosts(cached);
      }
    }
  }, []);

  const handleAddStory = async (usernameToAdd?: string) => {
    const target = usernameToAdd || storyInput;
    if (!target.trim()) return;

    // Support comma or space separated usernames (e.g. "cristiano, virat.kohli, selenagomez")
    const rawList = target
      .split(/[\s,]+/)
      .map((u) => u.trim().replace(/^@+/, ""))
      .filter(Boolean);

    if (rawList.length === 0) return;

    setIsAddingStory(true);
    setStoryError(null);

    let lastError: string | null = null;
    let addedCount = 0;

    for (const u of rawList) {
      if (stories.length + addedCount >= 10) {
        lastError = "Story tray is full (maximum 10 accounts).";
        break;
      }
      const res = await addCustomStoryAccount(u);
      if (res.success) {
        addedCount++;
      } else {
        lastError = res.error || `Failed to add @${u}`;
      }
    }

    setIsAddingStory(false);

    if (addedCount > 0) {
      setStoryInput("");
      const validStoryUsernames = rawList.map((u) => u.toLowerCase());
      Promise.allSettled(validStoryUsernames.map((u) => fetchLiveUserData(u))).then((results) => {
        const newPosts: HomeFeedPost[] = [];
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value && r.value.posts) {
            r.value.posts.forEach((p: HomeFeedPost) => {
              if (p.user.toLowerCase() !== profile.username.toLowerCase()) {
                newPosts.push({ ...p, isSuggested: false });
              }
            });
          }
        });
        if (newPosts.length > 0) {
          setFeedPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const freshFiltered = newPosts.filter((p) => !existingIds.has(p.id));
            const updated = [...freshFiltered, ...prev];
            saveCachedFeed(updated);
            return updated;
          });
        }
      });
    }
    if (lastError && addedCount === 0) {
      setStoryError(lastError);
    }
  };

  const handleRemoveStory = (username: string) => {
    removeCustomStoryAccount(username);
    setFeedPosts((prev) => {
      const updated = prev.filter(
        (p) => p.user.toLowerCase() !== username.toLowerCase()
      );
      saveCachedFeed(updated);
      return updated;
    });
  };


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
          {feedPosts.map((post) => (
            <DynamicPostCard key={post.id} post={post} />
          ))}
        </section>

        {/* Floating Bottom Nav */}
        <FloatingBottomNav />
      </div>

      {/* =========================================================================
          MANAGE STORIES BOTTOM SHEET MODAL
          ========================================================================= */}
      {isManageStoriesOpen && (
        <div
          className="clone-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isAddingStory) setIsManageStoriesOpen(false);
          }}
        >
          <div
            className="clone-modal-dialog max-w-[480px] w-full max-h-[90vh] flex flex-col overflow-hidden bg-white text-ink rounded-t-2xl shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="clone-modal-drag-bar" />

            {/* Header + Counter Badge */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#ededed]">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-ink">Manage Home Stories</h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                    isStoriesFull
                      ? "bg-red-50 text-red-500 border-red-200"
                      : "bg-blue-50 text-[#0095f6] border-blue-200"
                  }`}
                >
                  {stories.length}/10
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsManageStoriesOpen(false)}
                  className="text-sm font-bold text-[#0095f6] hover:text-[#00376b] cursor-pointer bg-transparent border-none p-1"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <p className="text-subtle leading-relaxed">
                Add up to 10 Instagram usernames. Real profile avatars and posts are fetched via our scraper engine and integrated into your story tray and feed.
              </p>

              {/* Input Form */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#0095f6] text-sm">
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
                      isStoriesFull
                        ? "Limit reached (10/10)"
                        : "Enter usernames (e.g. cristiano, virat.kohli)"
                    }
                    className="w-full bg-white text-ink pl-8 pr-3 py-2 border border-[#dbdbdb] rounded-xl text-xs outline-none focus:border-black transition-colors disabled:opacity-50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleAddStory()}
                  disabled={isStoriesFull || isAddingStory || !storyInput.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs border-none cursor-pointer disabled:opacity-40 flex items-center justify-center min-w-[65px] hover:opacity-95 shadow-sm shadow-pink-500/25"
                >
                  {isAddingStory ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Add"
                  )}
                </button>
              </div>

              {/* Error Message */}
              {storyError && (
                <p className="text-[11.5px] text-red-500 font-medium">{storyError}</p>
              )}

              <div className="h-px bg-[#ededed] my-2" />

              {/* Added Accounts List */}
              <h3 className="text-xs font-bold text-ink">
                Added Story Accounts ({stories.length}/10)
              </h3>

              {stories.length === 0 ? (
                <p className="text-center py-6 text-xs text-subtle">
                  No custom story accounts yet. Enter a username above to add stories to your home feed!
                </p>
              ) : (
                <div className="space-y-2">
                  {stories.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#ededed] hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0 flex items-center justify-center">
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
                        <div className="min-w-0 text-xs">
                          <p className="font-bold text-ink truncate leading-tight">
                            @{acc.username}
                          </p>
                          <p className="text-[11px] text-subtle truncate mt-0.5">
                            {acc.fullName || acc.username}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveStory(acc.username)}
                        className="p-1.5 text-subtle hover:text-red-500 hover:bg-red-50 rounded bg-transparent border-none cursor-pointer transition-colors"
                        title="Remove story account"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#ededed] flex justify-end bg-[#fbfbfb]">
              <button
                type="button"
                onClick={() => setIsManageStoriesOpen(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs border-none cursor-pointer hover:opacity-95 shadow-sm shadow-pink-500/25"
              >
                Done
              </button>
            </div>
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

      {/* =========================================================================
          INSTAGRAM NATIVE SPLASH SCREEN OVERLAY
          ========================================================================= */}
      {isSplashActive && (
        <aside
          className={`ig-splash-screen ${isSplashFading ? "is-fading" : ""}`}
          aria-label="Instagram Splash"
        >
          <div className="ig-splash-center">
            <div className="ig-splash-glyph-wrap">
              <IgInstagramGlyph size={76} />
            </div>
          </div>

          <footer className="ig-splash-footer">
            <span className="ig-splash-from-text">from</span>
            <img
              src="/images/meta_logo.png"
              alt="Meta"
              className="ig-splash-meta-img"
            />
          </footer>
        </aside>
      )}
    </main>
  );
}

