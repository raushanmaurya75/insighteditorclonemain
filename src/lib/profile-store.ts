import { useState, useEffect, useSyncExternalStore } from "react";
import profilePhoto from "@/assets/profile-photo.jpg";
import reelRoad from "@/assets/reel-road.jpg";
import reelCasino from "@/assets/reel-casino.jpg";
import reelMachine from "@/assets/reel-machine.jpg";
import storyMan from "@/assets/home-story-man.jpg";
import storyPackaging from "@/assets/home-story-packaging.jpg";
import nainaTarsemArt from "@/assets/feed-naina-tarsem.jpg";
import anubhavDubeyPhoto from "@/assets/feed-anubhav-dubey.jpg";
import reelVideo1 from "@/assets/videos/reel1.mp4";
import reelVideo2 from "@/assets/videos/reel2.mp4";
import reelVideo3 from "@/assets/videos/reel3.mp4";
import { scrapeInstagramProfile, type ScrapedInstagramUser, type ScrapedPostNode } from "./instagram-scraper";


export interface ProfilePost {
  id: string;
  shortcode: string;
  is_video: boolean;
  display_url: string;
  thumbnail_src: string;
  video_url?: string | undefined;
  likes: number;
  comments: number;
  views: number;
  caption: string;
  timestamp: number;
}

export interface ProfileHighlight {
  id: string;
  title: string;
  coverUrl: string;
  isSpecialDiscord?: boolean;
}

export interface ProfileData {
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  category: string;
  externalUrl: string;
  threadsUsername?: string;
  isVerified: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  monthlyViews: string;
  noteText: string;
  isCloned: boolean;
  posts: ProfilePost[];
  highlights?: ProfileHighlight[];
  selectedPostIndex: number;
}

export interface HomeFeedPost {
  id: string;
  user: string;
  avatar: string;
  sub: string;
  img: string;
  count?: string | undefined;
  tag1?: string | undefined;
  tag2?: string | undefined;
  time: string;
  likes: string;
  comments: string;
  caption: string;
  isVerified?: boolean | undefined;
  isSuggested?: boolean | undefined;
  is_video?: boolean | undefined;
  video_url?: string | undefined;
  shortcode?: string | undefined;
}

export interface HomeStoryAccount {
  id: string;
  username: string;
  fullName?: string | undefined;
  profilePicUrl: string;
  posts: HomeFeedPost[];
}

export const DEFAULT_PROFILE: ProfileData = {
  username: "m0tivati0nal_qu0ts",
  fullName: "Motivational Quotes",
  avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
  bio: "🔥 Daily Dose of Wisdom, Discipline & Mindset\n💡 Helping you become 1% better every single day\n👇 Save & Share with an ambitious friend",
  category: "Digital Creator",
  externalUrl: "https://instagram.com/m0tivati0nal_qu0ts",
  threadsUsername: "m0tivati0nal_qu0ts",
  isVerified: false,
  postsCount: 1420,
  followersCount: 1950000,
  followingCount: 85,
  monthlyViews: "18.4M views in the last 30 days.",
  noteText: "Start\nyour first\nnote...",
  isCloned: true,
  posts: [
    {
      id: "mq_post_1",
      shortcode: "mq_clock_post",
      is_video: false,
      display_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      thumbnail_src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      likes: 54200,
      comments: 480,
      views: 320000,
      caption: "“Don't watch the clock; do what it does. Keep going.” — Sam Levenson ⏳\n\nYour future self is watching you right now through memories. Make every single day count! 🚀\n\nDouble tap ❤️ and save this for daily motivation 📌\n#discipline #successquotes #mindsetshift #entrepreneur",
      timestamp: 1786650000,
    },
    {
      id: "mq_post_2",
      shortcode: "mq_discipline_post",
      is_video: false,
      display_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
      thumbnail_src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
      likes: 89400,
      comments: 620,
      views: 580000,
      caption: "The pain of discipline is far better than the pain of regret. Keep pushing forward! 🚀\n\nSmall daily habits compound into massive long-term success. Never give up on what you truly want. 💪✨\n\n#mindset #motivation #focus #growth",
      timestamp: 1786563600,
    },
    {
      id: "mq_post_3",
      shortcode: "mq_focus_post",
      is_video: false,
      display_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
      thumbnail_src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
      likes: 124000,
      comments: 980,
      views: 890000,
      caption: "Focus on your goals, not the obstacles. Where attention goes, energy flows. 💡🔥\n\nDouble tap if you agree! 🎯\n#ambition #focus #wisdom #quotes",
      timestamp: 1786477200,
    },
    {
      id: "mq_post_4",
      shortcode: "mq_silence_post",
      is_video: false,
      display_url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80",
      thumbnail_src: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80",
      likes: 67800,
      comments: 412,
      views: 0,
      caption: "Silent progress is better than loud promises. Build in silence and let your work make the noise. 🤫🏛️\n\n#dedication #resilience #grind #hustle",
      timestamp: 1786390800,
    },
    {
      id: "mq_post_5",
      shortcode: "mq_decision_post",
      is_video: false,
      display_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      thumbnail_src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      likes: 91500,
      comments: 534,
      views: 0,
      caption: "You are always one courageous decision away from a completely different life. Step forward today. 🌟💫\n\n#courage #newbeginnings #inspiration",
      timestamp: 1786304400,
    },
    {
      id: "mq_post_6",
      shortcode: "mq_energy_post",
      is_video: false,
      display_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
      thumbnail_src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
      likes: 78200,
      comments: 389,
      views: 0,
      caption: "Energy is currency. Spend it wisely on people and habits that elevate your mind. 🎯🔋\n\n#mindsetquotes #lifelessons #clarity",
      timestamp: 1786218000,
    },
  ],
  selectedPostIndex: 0,
  highlights: [
    {
      id: "hl_discipline",
      title: "Discipline",
      coverUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "hl_mindset",
      title: "Mindset",
      coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "hl_habits",
      title: "Habits",
      coverUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "hl_books",
      title: "Books",
      coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80",
    },
  ],
};

export const DEFAULT_HOME_STORIES: HomeStoryAccount[] = [
  {
    id: "story_cr7",
    username: "cristiano",
    fullName: "Cristiano Ronaldo",
    profilePicUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80",
    posts: [],
  },
  {
    id: "story_vk",
    username: "virat.kohli",
    fullName: "Virat Kohli",
    profilePicUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
    posts: [],
  },
  {
    id: "story_sg",
    username: "selenagomez",
    fullName: "Selena Gomez",
    profilePicUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    posts: [],
  },
  {
    id: "story_natgeo",
    username: "natgeo",
    fullName: "National Geographic",
    profilePicUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80",
    posts: [],
  },
];

const STORAGE_KEY = "instagram_app_profile_v7";
const STORIES_STORAGE_KEY = "instagram_home_stories_v7";

let memoryProfile: ProfileData = loadSavedProfile();
let memoryStories: HomeStoryAccount[] = loadSavedStories();
const profileListeners = new Set<() => void>();
const storiesListeners = new Set<() => void>();

function loadSavedProfile(): ProfileData {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) {
        const posts = Array.isArray(parsed.posts) && parsed.posts.length > 0
          ? parsed.posts
          : DEFAULT_PROFILE.posts;

        const highlights = Array.isArray(parsed.highlights) && parsed.highlights.length > 0
          ? parsed.highlights
          : DEFAULT_PROFILE.highlights;

        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          avatarUrl: parsed.avatarUrl || profilePhoto,
          posts,
          highlights,
        };
      }
    }
  } catch {}
  return DEFAULT_PROFILE;
}

function loadSavedStories(): HomeStoryAccount[] {
  if (typeof window === "undefined") {
    return DEFAULT_HOME_STORIES;
  }
  try {
    const raw = localStorage.getItem(STORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_HOME_STORIES;
}

function notifyProfile() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryProfile));
    } catch {}
  }
  profileListeners.forEach((listener) => listener());
}

function notifyStories() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(memoryStories));
    } catch {}
  }
  storiesListeners.forEach((listener) => listener());
}

export function getProfileSnapshot(): ProfileData {
  return memoryProfile;
}

export function subscribeProfile(listener: () => void): () => void {
  profileListeners.add(listener);
  return () => {
    profileListeners.delete(listener);
  };
}

export function getStoriesSnapshot(): HomeStoryAccount[] {
  return memoryStories;
}

export function subscribeStories(listener: () => void): () => void {
  storiesListeners.add(listener);
  return () => {
    storiesListeners.delete(listener);
  };
}

export function setProfileData(updated: Partial<ProfileData>) {
  memoryProfile = { ...memoryProfile, ...updated };
  notifyProfile();
}

export function setSelectedPostIndex(index: number) {
  if (index >= 0 && index < memoryProfile.posts.length) {
    memoryProfile = { ...memoryProfile, selectedPostIndex: index };
    notifyProfile();
  }
}

export function resetToDefaultProfile() {
  memoryProfile = { ...DEFAULT_PROFILE };
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  notifyProfile();
}

export function addHighlight(title: string, coverUrl: string) {
  const newHl: ProfileHighlight = {
    id: `hl_${Date.now()}`,
    title: title.trim() || "Highlight",
    coverUrl,
  };
  const currentHighlights = memoryProfile.highlights || DEFAULT_PROFILE.highlights || [];
  setProfileData({
    highlights: [...currentHighlights, newHl],
  });
}

export function deleteHighlight(id: string) {
  const currentHighlights = memoryProfile.highlights || DEFAULT_PROFILE.highlights || [];
  setProfileData({
    highlights: currentHighlights.filter((h) => h.id !== id),
  });
}

export function updateHighlight(id: string, title: string, coverUrl?: string) {
  const currentHighlights = memoryProfile.highlights || DEFAULT_PROFILE.highlights || [];
  const updated = currentHighlights.map((h) => {
    if (h.id === id) {
      return {
        ...h,
        title: title.trim() || h.title,
        coverUrl: coverUrl !== undefined && coverUrl !== "" ? coverUrl : h.coverUrl,
      };
    }
    return h;
  });
  setProfileData({ highlights: updated });
}

export function moveHighlight(id: string, direction: "left" | "right") {
  const currentHighlights = [...(memoryProfile.highlights || DEFAULT_PROFILE.highlights || [])];
  const index = currentHighlights.findIndex((h) => h.id === id);
  if (index === -1) return;

  const targetIndex = direction === "left" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= currentHighlights.length) return;

  const temp = currentHighlights[index];
  currentHighlights[index] = currentHighlights[targetIndex];
  currentHighlights[targetIndex] = temp;

  setProfileData({ highlights: currentHighlights });
}

export function reorderHighlights(newHighlights: ProfileHighlight[]) {
  setProfileData({ highlights: newHighlights });
}

export async function addCustomStoryAccount(
  rawInput: string
): Promise<{ success: boolean; error?: string; account?: HomeStoryAccount }> {
  const username = rawInput
    .trim()
    .replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^@+/, "")
    .toLowerCase();

  if (!username) {
    return {
      success: false,
      error: "Please enter an Instagram username or profile link.",
    };
  }

  if (memoryStories.some((s) => s.username.toLowerCase() === username)) {
    return {
      success: false,
      error: `@${username} is already added to your stories tray.`,
    };
  }

  let user: ScrapedInstagramUser | null = null;

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:8080";
    const res = await scrapeInstagramProfile(username, origin);
    if (res.status === "ok" && res.data?.user) {
      user = res.data.user;
    }
  } catch {
    // offline/APK fallback
  }

  if (!user) {
    user = generateRealisticScrapedUser(username);
  }

  const userPosts = (user.edge_owner_to_timeline_media?.edges || []).map((e, idx) => {
    const node = e.node;
    return {
      id: node.id || `story_post_${user!.username}_${idx}`,
      user: user!.username,
      avatar: user!.profile_pic_url_hd || user!.profile_pic_url || storyMan,
      sub: `♫ Original Audio · ${user!.username}`,
      img: node.display_url || node.thumbnail_src || storyMan,
      count: "1/1",
      tag1: `#${user!.username}`,
      tag2: "#instagram",
      time: "Just now",
      likes: formatCompactNumber(node.edge_media_preview_like?.count || 1200),
      comments: formatCompactNumber(node.edge_media_to_comment?.count || 45),
      caption:
        node.edge_media_to_caption?.edges?.[0]?.node?.text ||
        node.caption?.text ||
        node.caption ||
        (node as any).text ||
        "",
      isVerified: user!.is_verified,
      is_video: Boolean(node.is_video),
      video_url: node.video_url || "",
      shortcode: node.shortcode,
    };
  });

  const newAccount: HomeStoryAccount = {
    id: `story_acc_${user.username}_${Date.now()}`,
    username: user.username,
    fullName: user.full_name || user.username,
    profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || storyMan,
    posts:
      userPosts.length > 0
        ? userPosts
        : [
            {
              id: `story_post_${user.username}`,
              user: user.username,
              avatar: user.profile_pic_url_hd || user.profile_pic_url || storyMan,
              sub: `♫ Original Audio · ${user.username}`,
              img: user.profile_pic_url_hd || user.profile_pic_url || storyMan,
              time: "1 hour ago",
              likes: "2.4K",
              comments: "58",
              caption: `Exciting moments with @${user.username} ✨ #daily`,
              isVerified: user.is_verified,
            },
          ],
  };

  memoryStories = [newAccount, ...memoryStories];
  notifyStories();
  return { success: true, account: newAccount };
}

export function removeCustomStoryAccount(username: string) {
  memoryStories = memoryStories.filter(
    (s) => s.username.toLowerCase() !== username.toLowerCase()
  );
  notifyStories();
}

export function formatCompactNumber(num: number): string {
  if (num == null || isNaN(num)) return "0";
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return val >= 10 ? `${val.toFixed(1).replace(/\.0$/, "")}M` : `${val.toFixed(1)}M`;
  }
  if (num >= 10_000) {
    const val = num / 1_000;
    return `${val.toFixed(1).replace(/\.0$/, "")}K`;
  }
  if (num >= 1_000) {
    return num.toLocaleString();
  }
  return num.toString();
}

export function formatExactNumber(num: number): string {
  if (num == null || isNaN(num)) return "0";
  return num.toLocaleString();
}

export function formatPostDate(timestamp?: number | string): string {
  if (!timestamp) return "1 August";

  if (typeof timestamp === "string" && !/^\d+$/.test(timestamp.trim())) {
    return timestamp;
  }

  const numericTs = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(numericTs) || numericTs <= 0) return "1 August";

  const ms = numericTs < 10000000000 ? numericTs * 1000 : numericTs;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return "1 August";

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours >= 0 && diffHours < 24) {
    const hrs = Math.max(1, Math.floor(diffHours));
    return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
  }
  if (diffHours >= 24 && diffHours < 24 * 7) {
    const days = Math.floor(diffHours / 24);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  const day = date.getDate();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = months[date.getMonth()];
  const currentYear = new Date().getFullYear();
  const postYear = date.getFullYear();

  if (Math.abs(currentYear - postYear) >= 1) {
    return `${day} ${month} ${postYear}`;
  }
  return `${day} ${month}`;
}


export function mapScrapedUserToProfile(user: ScrapedInstagramUser): ProfileData {
  const posts: ProfilePost[] = (user.edge_owner_to_timeline_media?.edges || []).map(
    (edge, idx) => {
      const node = edge.node;
      const likes =
        node.edge_media_preview_like?.count ||
        Math.round(user.edge_followed_by.count * 0.04) ||
        1200;
      const comments =
        node.edge_media_to_comment?.count ||
        Math.round(user.edge_followed_by.count * 0.003) ||
        65;
      const views =
        node.video_view_count ||
        Math.round(user.edge_followed_by.count * 0.35) ||
        38000;
      const caption =
        node.edge_media_to_caption?.edges?.[0]?.node?.text ||
        node.caption?.text ||
        node.caption ||
        (node as any).text ||
        "";

      return {
        id: node.id || `post_${idx}`,
        shortcode: node.shortcode || `post_${idx}`,
        is_video: Boolean(node.is_video),
        display_url: node.display_url || node.thumbnail_src || profilePhoto,
        thumbnail_src: node.thumbnail_src || node.display_url || profilePhoto,
        video_url: node.video_url || "",
        likes,
        comments,
        views,
        caption,
        timestamp: node.taken_at_timestamp || Math.floor(Date.now() / 1000) - idx * 86400,
      };
    }
  );

  const followers = user.edge_followed_by?.count ?? 0;
  const following = user.edge_follow?.count ?? 0;
  const postsCount = user.edge_owner_to_timeline_media?.count ?? posts.length;

  const monthlyViewsEstimate =
    followers > 1_000_000
      ? `${(followers * 2.8 / 1_000_000).toFixed(1)}M`
      : followers > 50_000
      ? `${(followers * 2.5 / 1_000).toFixed(0)}K`
      : "1.6M";

  const mappedHighlights: ProfileHighlight[] = Array.isArray(user.highlights)
    ? user.highlights.map((h, i) => ({
        id: h.id || `hl_${i + 1}`,
        title: h.title,
        coverUrl: h.coverUrl,
      }))
    : [];

  return {
    username: user.username,
    fullName: user.full_name || user.username,
    avatarUrl: user.profile_pic_url_hd || user.profile_pic_url || profilePhoto,
    bio: user.biography || "",
    category:
      followers > 500_000
        ? "Public Figure"
        : followers > 50_000
        ? "Digital Creator"
        : "Creator",
    externalUrl: user.external_url || "",
    isVerified: user.is_verified,
    postsCount,
    followersCount: followers,
    followingCount: following,
    monthlyViews: `${monthlyViewsEstimate} views in the last 30 days.`,
    noteText: "Listening\nto vibes...",
    isCloned: true,
    posts: posts,
    highlights: mappedHighlights,
    selectedPostIndex: 0,
  };
}

function formatDisplayName(username: string): string {
  const cleaned = username
    .replace(/[._]/g, " ")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s");
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getContextualBio(username: string, fullName: string, followers: number): string {
  const u = username.toLowerCase();
  if (u.includes("quote") || u.includes("motivat") || u.includes("mindset") || u.includes("growth")) {
    return "💡 Daily Dose of Mindset & Inspiration\n🚀 Helping you become 1% better every day\n👇 New Reels Daily | Turn on Notifications 🔔";
  }
  if (u.includes("fit") || u.includes("gym") || u.includes("workout") || u.includes("health")) {
    return "🏋️ Training, Mindset & Nutrition\n🔥 Turn your excuses into results\n👇 Daily workout reels & tips";
  }
  if (u.includes("business") || u.includes("money") || u.includes("wealth") || u.includes("finance") || u.includes("entrepreneur")) {
    return "📈 Wealth, Entrepreneurship & Growth\n💼 Practical insights for ambitious builders\n👇 Check our top highlights below";
  }
  if (u.includes("travel") || u.includes("wander") || u.includes("world")) {
    return "✈️ Exploring the world one city at a time 🌍\n📸 Visual storyteller & adventurer\n📍 Currently wandering | Next stop: everywhere";
  }
  if (u.includes("art") || u.includes("design") || u.includes("creator")) {
    return `🎨 Digital Art & Visual Aesthetics\n✨ Creating unique experiences\n📩 DM for commissions & inquiries`;
  }
  if (followers > 500_000) {
    return `✨ Public Figure & Content Creator\n📩 Collabs: contact@${username}.com\n📍 World Citizen 🌍\n👇 Stay tuned for daily updates!`;
  }
  return `✨ ${fullName}\n🎬 Creating moments and stories\n📩 DM for collaborations\nLive life to the fullest 🌟`;
}

export function generateRealisticScrapedUser(rawUsername: string): ScrapedInstagramUser {
  const username = rawUsername.toLowerCase().trim();
  const fullName = formatDisplayName(username);

  // Custom User Preset: __ankit.exe
  if (username === "__ankit.exe" || username === "ankit.exe") {
    return {
      username: "__ankit.exe",
      full_name: "Ankit Jha",
      profile_pic_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      profile_pic_url_hd: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      biography: "CSE Undergrad\nCurious about AI. Obsessed with building.\nLearning → Building → Creating\nI take my work seriously, not myself.",
      external_url: "https://instagram.com/__ankit.exe",
      edge_followed_by: { count: 51 },
      edge_follow: { count: 38 },
      edge_owner_to_timeline_media: {
        count: 1,
        edges: [
          {
            node: {
              id: "ankit_post_1",
              shortcode: "DO3eN_cD3NZ",
              is_video: true,
              display_url: reelRoad,
              thumbnail_src: reelRoad,
              video_url: reelVideo1,
              edge_media_preview_like: { count: 16 },
              edge_media_to_comment: { count: 1 },
              video_view_count: 180,
              edge_media_to_caption: {
                edges: [
                  {
                    node: {
                      text: "Welcome Durga Maa\nMay This Navratri Bring Happiness in Your Life.\n\nOriginal Creator: @udyxnshh.23\n\nJai Mata Di\n\n#trending #trendingreels #shailputri #Navratri2025 #maadurga\n#garbavibes #bhaktimood #durgapuja\n#indianfestivals #navratrispecial #garbanight #FestivalVibes\n#viralreels #ExplorePage #cinematicreels #traditionwithlove\n#devotionalvibes #navratristatus #trendingreels #explorepage\n#videoediting #navratri2025",
                    },
                  },
                ],
              },
              taken_at_timestamp: Math.floor(Date.now() / 1000) - 7200,
            },
          },
        ],
      },
      highlights: [
        {
          id: "hl_tedx",
          title: "Tedx-IIT Patna",
          coverUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80",
        },
      ],
      is_verified: false,
    };
  }

  // Custom User Preset: duellx03arenaa
  if (username === "duellx03arenaa") {
    return {
      username: "duellx03arenaa",
      full_name: "duel",
      profile_pic_url: "https://scontent.cdninstagram.com/v/t51.82787-19/809209202_18110128360933404_3699249453218680376_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=100&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=N509QPn8vbsQ7kNvwHNf1IC&_nc_oc=AdrMgPhpFaAlCTa5OCg_JeRS1YScMq18v7NC4_Jl3KEH095MqJmZkF79O8av5KUY8_P9Rs6opaP2IQvuFHJVcGP3&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=E5o_HbC6oUNlOPlYYXdn3Q&_nc_ss=70689&oh=00_AQK8mT7vHq_bpYPz3a8RcSF4dkahMxIieNYJheSabeKFZg&oe=6AB161C8",
      profile_pic_url_hd: "https://scontent.cdninstagram.com/v/t51.82787-19/809209202_18110128360933404_3699249453218680376_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=100&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=N509QPn8vbsQ7kNvwHNf1IC&_nc_oc=AdrMgPhpFaAlCTa5OCg_JeRS1YScMq18v7NC4_Jl3KEH095MqJmZkF79O8av5KUY8_P9Rs6opaP2IQvuFHJVcGP3&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=E5o_HbC6oUNlOPlYYXdn3Q&_nc_ss=70689&oh=00_AQK8mT7vHq_bpYPz3a8RcSF4dkahMxIieNYJheSabeKFZg&oe=6AB161C8",
      biography: "",
      external_url: "https://instagram.com/duellx03arenaa",
      edge_followed_by: { count: 41 },
      edge_follow: { count: 12 },
      edge_owner_to_timeline_media: {
        count: 167,
        edges: [
          {
            node: {
              id: "duell_post_1",
              shortcode: "duell_p1",
              is_video: true,
              display_url: reelMachine,
              thumbnail_src: reelMachine,
              video_url: reelVideo1,
              edge_media_preview_like: { count: 1 },
              edge_media_to_comment: { count: 0 },
              video_view_count: 24,
              edge_media_to_caption: {
                edges: [
                  {
                    node: {
                      text: "Duel: Arena 1\nMike Perry vs Dillon Danis\nSat, Aug 29 | Orlando, FL\n@thekiacenter\nTickets - Link in Bio",
                    },
                  },
                ],
              },
              taken_at_timestamp: Math.floor(Date.now() / 1000) - 3600,
            },
          },
        ],
      },
      highlights: [],
      is_verified: false,
    };
  }

  // Famous Accounts Presets
  if (username === "cristiano") {
    return {
      username: "cristiano",
      full_name: "Cristiano Ronaldo",
      profile_pic_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80",
      profile_pic_url_hd: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80",
      biography: "SIUUU ⚽️ @alnassr | @portugal\nLive with passion, play with heart. 🏆",
      external_url: "https://cristianoronaldo.com",
      edge_followed_by: { count: 642_000_000 },
      edge_follow: { count: 574 },
      edge_owner_to_timeline_media: {
        count: 3740,
        edges: [
          {
            node: {
              id: "cr7_post_1",
              shortcode: "cr7_match_win",
              is_video: false,
              display_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80",
              thumbnail_src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80",
              edge_media_preview_like: { count: 5_420_000 },
              edge_media_to_comment: { count: 64_200 },
              video_view_count: 28_400_000,
              edge_media_to_caption: {
                edges: [{ node: { text: "Unbelievable team effort tonight! 3 points in the bag. We keep pushing together! ⚽️🔥 #CR7 #AlNassr" } }],
              },
              taken_at_timestamp: Math.floor(Date.now() / 1000) - 10800,
            },
          },
        ],
      },
      is_verified: true,
    };
  }

  if (username === "virat.kohli") {
    return {
      username: "virat.kohli",
      full_name: "Virat Kohli",
      profile_pic_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
      profile_pic_url_hd: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
      biography: "Passionate cricketer 🇮🇳 | Family first ❤️ | One8\nLiving every moment with immense gratitude.",
      external_url: "https://one8.com",
      edge_followed_by: { count: 271_000_000 },
      edge_follow: { count: 312 },
      edge_owner_to_timeline_media: {
        count: 1820,
        edges: [
          {
            node: {
              id: "vk_post_1",
              shortcode: "vk_match_day",
              is_video: false,
              display_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
              thumbnail_src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
              edge_media_preview_like: { count: 3_890_000 },
              edge_media_to_comment: { count: 48_100 },
              edge_media_to_caption: {
                edges: [{ node: { text: "2 years back I joined hands with Agilitas to build a dream - one8. On 21st June we turned this audacious ambition into reality. Many of you came and witnessed not just the brand but the ecosystem we’ve built. When I looked around the room that evening, I saw belief. And it gives all of us at Agilitas immense courage to attempt what has never been done before with all our might. I can only say thank you, and welcome aboard this rocket ship. 🚀🏏 #one8 #Gratitude" } }],
              },
              taken_at_timestamp: Math.floor(Date.now() / 1000) - 21600,
            },
          },
        ],
      },
      is_verified: true,
    };
  }

  if (username === "selenagomez") {
    return {
      username: "selenagomez",
      full_name: "Selena Gomez",
      profile_pic_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      profile_pic_url_hd: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      biography: "Founder @rarebeauty 💄 | @wondermind 🧠\nKindness always wins. ✨",
      external_url: "https://rarebeauty.com",
      edge_followed_by: { count: 428_000_000 },
      edge_follow: { count: 294 },
      edge_owner_to_timeline_media: {
        count: 2190,
        edges: [
          {
            node: {
              id: "sg_post_1",
              shortcode: "sg_beauty_launch",
              is_video: false,
              display_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
              thumbnail_src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
              edge_media_preview_like: { count: 2_750_000 },
              edge_media_to_comment: { count: 31_500 },
              edge_media_to_caption: {
                edges: [{ node: { text: "A little sneak peek of what we have been working on. Can't wait for you all to see it! ✨💖 @rarebeauty" } }],
              },
              taken_at_timestamp: Math.floor(Date.now() / 1000) - 43200,
            },
          },
        ],
      },
      is_verified: true,
    };
  }

  if (username === "natgeo") {
    return {
      username: "natgeo",
      full_name: "National Geographic",
      profile_pic_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80",
      profile_pic_url_hd: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80",
      biography: "Inspiring people to care about the planet since 1888. 🌍\nExplore with us.",
      external_url: "https://nationalgeographic.com",
      edge_followed_by: { count: 284_000_000 },
      edge_follow: { count: 142 },
      edge_owner_to_timeline_media: {
        count: 28400,
        edges: [
          {
            node: {
              id: "natgeo_post_1",
              shortcode: "natgeo_wildlife",
              is_video: false,
              display_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
              thumbnail_src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
              edge_media_preview_like: { count: 980_000 },
              edge_media_to_comment: { count: 12_400 },
              video_view_count: 6_200_000,
              edge_media_to_caption: {
                edges: [{ node: { text: "Photograph by @paulnicklen | A magnificent leopard resting high above the Serengeti plains during golden hour. 🐾🌅 Follow @natgeo for more awe-inspiring moments." } }],
              },
              taken_at_timestamp: Math.floor(Date.now() / 1000) - 64800,
            },
          },
        ],
      },
      is_verified: true,
    };
  }

  if (username === "m0tivati0nal_qu0ts") {
    return {
      username: "m0tivati0nal_qu0ts",
      full_name: "Motivational Quotes",
      profile_pic_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
      profile_pic_url_hd: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
      biography: "🔥 Daily Dose of Wisdom, Discipline & Mindset\n💡 Helping you become 1% better every single day\n👇 Save & Share with an ambitious friend",
      external_url: "https://motivation.daily",
      edge_followed_by: { count: 1_950_000 },
      edge_follow: { count: 85 },
      edge_owner_to_timeline_media: {
        count: 1420,
        edges: [
          {
            node: {
              id: "mq_suggested_1",
              shortcode: "mq_discipline",
              is_video: false,
              display_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
              thumbnail_src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
              edge_media_preview_like: { count: 54_200 },
              edge_media_to_comment: { count: 480 },
              video_view_count: 320_000,
              edge_media_to_caption: {
                edges: [
                  {
                    node: {
                      text: "“Don't watch the clock; do what it does. Keep going.” — Sam Levenson ⏳\n\nYour future self is watching you right now through memories. Make every day count! 🚀\n\nDouble tap ❤️ and save this for daily motivation 📌\n#discipline #successquotes #mindsetshift #entrepreneur",
                    },
                  },
                ],
              },
              taken_at_timestamp: Math.floor(Date.now() / 1000) - 7200,
            },
          },
        ],
      },
      is_verified: false,
    };
  }

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const followersCount = 25_000 + (absHash % 480_000);
  const followingCount = 180 + (absHash % 500);
  const postsCount = 18 + (absHash % 64);
  const isVerified = followersCount > 100_000 || username.includes("official") || username.includes("real");

  const bio = getContextualBio(username, fullName, followersCount);

  // Stock avatars
  const stockAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80",
  ];
  const avatarUrl = stockAvatars[absHash % stockAvatars.length];

  const sampleThumbnails = [
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  ];

  const sampleCaptions = [
    `The pain of discipline is far better than the pain of regret. Keep pushing! 🚀 #mindset #${username}`,
    `Focus on your goals, not the obstacles. Small daily habits create massive results. 💡✨`,
    `When you feel like quitting, remember why you started. Double tap if you agree! 🔥`,
    `Silent progress is better than loud promises. Keep building in silence. 🤫💪`,
    `You are one decision away from a completely different life. Claim it today! 🌟`,
    `Energy is currency. Spend it wisely on things that elevate your life. 🎯 #focus`,
  ];

  const edges: Array<{ node: ScrapedPostNode }> = sampleCaptions.map((caption, idx) => {
    const thumb = sampleThumbnails[idx % sampleThumbnails.length];
    const likes = Math.round(followersCount * (0.03 + (idx % 5) * 0.015));
    const comments = Math.round(likes * 0.04);
    const views = Math.round(likes * 4.5);

    return {
      node: {
        id: `${username}_post_${idx + 1}`,
        shortcode: `reel_${username}_${idx + 1}`,
        is_video: false,
        display_url: thumb,
        thumbnail_src: thumb,
        video_url: undefined,
        edge_media_preview_like: { count: likes },
        edge_media_to_comment: { count: comments },
        video_view_count: views,
        edge_media_to_caption: {
          edges: [{ node: { text: caption } }],
        },
        taken_at_timestamp: Math.floor(Date.now() / 1000) - idx * 86400 * 2,
      },
    };
  });

  return {
    username,
    full_name: fullName,
    profile_pic_url: avatarUrl,
    profile_pic_url_hd: avatarUrl,
    biography: bio,
    external_url: `https://instagram.com/${username}`,
    edge_followed_by: { count: followersCount },
    edge_follow: { count: followingCount },
    edge_owner_to_timeline_media: {
      count: postsCount,
      edges,
    },
    is_verified: isVerified,
  };
}

export function getFamousCelebrityPosts(): HomeFeedPost[] {
  const famousUsers = ["cristiano", "virat.kohli", "selenagomez", "natgeo"];
  const posts: HomeFeedPost[] = [];

  famousUsers.forEach((u) => {
    const scraped = generateRealisticScrapedUser(u);
    const post = scraped.edge_owner_to_timeline_media?.edges?.[0]?.node;
    if (post) {
      posts.push({
        id: `famous_${u}_${post.id}`,
        user: scraped.username,
        avatar: scraped.profile_pic_url_hd || scraped.profile_pic_url,
        sub: `♫ Original Audio · ${scraped.username}`,
        img: post.display_url || post.thumbnail_src || storyMan,
        count: "1/1",
        tag1: `#${scraped.username}`,
        tag2: "#instagram",
        time: "10 hours ago",
        likes: formatCompactNumber(post.edge_media_preview_like?.count || 1_200_000),
        comments: formatCompactNumber(post.edge_media_to_comment?.count || 24_000),
        caption: post.edge_media_to_caption?.edges?.[0]?.node?.text || post.caption?.text || post.caption || "",
        isVerified: scraped.is_verified,
        isSuggested: true,
        is_video: Boolean(post.is_video),
        video_url: post.video_url,
        shortcode: post.shortcode,
      });
    }
  });

  return posts;
}

export function getSuggestedMotivationalPost(): HomeFeedPost {
  const mq = generateRealisticScrapedUser("m0tivati0nal_qu0ts");
  const post = mq.edge_owner_to_timeline_media?.edges?.[0]?.node;

  return {
    id: "suggested_mq_post_1",
    user: "m0tivati0nal_qu0ts",
    avatar: mq.profile_pic_url_hd || mq.profile_pic_url,
    sub: "♫ Motivational Speech · Original",
    img: post?.display_url || reelMachine,
    count: "1/1",
    tag1: "#mindset",
    tag2: "#discipline",
    time: "12 hours ago",
    likes: formatCompactNumber(post?.edge_media_preview_like?.count || 54_200),
    comments: formatCompactNumber(post?.edge_media_to_comment?.count || 480),
    caption:
      post?.edge_media_to_caption?.edges?.[0]?.node?.text ||
      "“Don't watch the clock; do what it does. Keep going.” — Sam Levenson ⏳\n\nYour future self is watching you right now through memories. Make them proud! 🚀\n\nDouble tap ❤️ and save this for daily motivation 📌\n#discipline #successquotes #mindsetshift",
    isVerified: false,
    isSuggested: true,
    is_video: Boolean(post?.is_video),
    video_url: post?.video_url || reelVideo1,
    shortcode: "mq_discipline",
  };
}

export function getAllSuggestedPosts(): HomeFeedPost[] {
  return [...getFamousCelebrityPosts(), getSuggestedMotivationalPost()];
}

export async function fetchLiveUserPosts(username: string): Promise<HomeFeedPost[]> {
  const cleanUsername = username.toLowerCase().trim().replace(/^@+/, "");
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:8080";
    const res = await scrapeInstagramProfile(cleanUsername, origin);
    if (res.status === "ok" && res.data?.user) {
      const u = res.data.user;
      const posts = (u.edge_owner_to_timeline_media?.edges || []).map((e, idx) => {
        const node = e.node;
        const rawCaption =
          node.edge_media_to_caption?.edges?.[0]?.node?.text ||
          node.caption?.text ||
          node.caption ||
          "";
        return {
          id: `live_${u.username}_${node.id || idx}`,
          user: u.username,
          avatar: u.profile_pic_url_hd || u.profile_pic_url || storyMan,
          sub: `♫ Original Audio · ${u.username}`,
          img: node.display_url || node.thumbnail_src || storyMan,
          count: "1/1",
          tag1: `#${u.username}`,
          tag2: "#instagram",
          time: "10 hours ago",
          likes: formatCompactNumber(node.edge_media_preview_like?.count || 12000),
          comments: formatCompactNumber(node.edge_media_to_comment?.count || 140),
          caption: rawCaption,
          isVerified: u.is_verified,
          isSuggested: true,
          is_video: Boolean(node.is_video),
          video_url: node.video_url || "",
          shortcode: node.shortcode,
        };
      });
      if (posts.length > 0) return posts;
    }
  } catch {}

  const fallback = generateRealisticScrapedUser(cleanUsername);
  const p = fallback.edge_owner_to_timeline_media?.edges?.[0]?.node;
  if (!p) return [];
  return [
    {
      id: `fallback_${fallback.username}_${p.id}`,
      user: fallback.username,
      avatar: fallback.profile_pic_url_hd || fallback.profile_pic_url,
      sub: `♫ Original Audio · ${fallback.username}`,
      img: p.display_url || p.thumbnail_src || storyMan,
      count: "1/1",
      tag1: `#${fallback.username}`,
      tag2: "#instagram",
      time: "14 hours ago",
      likes: formatCompactNumber(p.edge_media_preview_like?.count || 1200000),
      comments: formatCompactNumber(p.edge_media_to_comment?.count || 24000),
      caption: p.edge_media_to_caption?.edges?.[0]?.node?.text || p.caption?.text || p.caption || "",
      isVerified: fallback.is_verified,
      isSuggested: true,
      is_video: Boolean(p.is_video),
      video_url: p.video_url,
      shortcode: p.shortcode,
    },
  ];
}

export async function fetchAllFreshSuggestedPosts(): Promise<HomeFeedPost[]> {
  const users = ["cristiano", "virat.kohli", "selenagomez", "natgeo", "m0tivati0nal_qu0ts"];
  const results = await Promise.allSettled(users.map((u) => fetchLiveUserPosts(u)));
  const posts: HomeFeedPost[] = [];
  results.forEach((r) => {
    if (r.status === "fulfilled" && r.value.length > 0) {
      posts.push(r.value[0]);
    }
  });
  return posts.length > 0 ? posts : getAllSuggestedPosts();
}

export interface LiveUserDataResult {
  username: string;
  avatar: string;
  fullName: string;
  isVerified: boolean;
  posts: HomeFeedPost[];
}

export async function fetchLiveUserData(username: string): Promise<LiveUserDataResult> {
  const cleanUsername = username.toLowerCase().trim().replace(/^@+/, "");
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:8080";
    const res = await scrapeInstagramProfile(cleanUsername, origin);
    if (res.status === "ok" && res.data?.user) {
      const u = res.data.user;
      const avatar = u.profile_pic_url_hd || u.profile_pic_url || storyMan;
      const posts = (u.edge_owner_to_timeline_media?.edges || []).map((e, idx) => {
          const node = e.node;
          const rawCaption =
            node.edge_media_to_caption?.edges?.[0]?.node?.text ||
            node.caption?.text ||
            node.caption ||
            "";
          return {
            id: `live_${u.username}_${node.id || idx}`,
            user: u.username,
            avatar,
            sub: `♫ Original Audio · ${u.username}`,
            img: node.display_url || node.thumbnail_src || storyMan,
            count: "1/1",
            tag1: `#${u.username}`,
            tag2: "#instagram",
            time: "10 hours ago",
            likes: formatCompactNumber(node.edge_media_preview_like?.count || 12000),
            comments: formatCompactNumber(node.edge_media_to_comment?.count || 140),
            caption: rawCaption,
            isVerified: u.is_verified,
            isSuggested: true,
            is_video: Boolean(node.is_video),
            video_url: node.video_url || "",
            shortcode: node.shortcode,
          };
        });
        return {
          username: u.username,
          avatar,
          fullName: u.full_name || u.username,
          isVerified: u.is_verified,
          posts,
        };
      }
    } catch {}

  const fallback = generateRealisticScrapedUser(cleanUsername);
  const avatar = fallback.profile_pic_url_hd || fallback.profile_pic_url || storyMan;
  const p = fallback.edge_owner_to_timeline_media?.edges?.[0]?.node;
  const fallbackPost: HomeFeedPost[] = p
    ? [
        {
          id: `fallback_${fallback.username}_${p.id}`,
          user: fallback.username,
          avatar,
          sub: `♫ Original Audio · ${fallback.username}`,
          img: p.display_url || p.thumbnail_src || storyMan,
          count: "1/1",
          tag1: `#${fallback.username}`,
          tag2: "#instagram",
          time: "14 hours ago",
          likes: formatCompactNumber(p.edge_media_preview_like?.count || 1200000),
          comments: formatCompactNumber(p.edge_media_to_comment?.count || 24000),
          caption: p.edge_media_to_caption?.edges?.[0]?.node?.text || p.caption?.text || p.caption || "",
          isVerified: fallback.is_verified,
          isSuggested: true,
          is_video: Boolean(p.is_video),
          video_url: p.video_url,
          shortcode: p.shortcode,
        },
      ]
    : [];

  return {
    username: fallback.username,
    avatar,
    fullName: fallback.full_name || fallback.username,
    isVerified: fallback.is_verified,
    posts: fallbackPost,
  };
}

export function updateStoriesWithLiveAvatars(results: LiveUserDataResult[]) {
  const avatarMap = new Map<string, string>();
  results.forEach((r) => {
    if (r.avatar) avatarMap.set(r.username.toLowerCase(), r.avatar);
  });

  const updated = memoryStories.map((s) => {
    const liveAvatar = avatarMap.get(s.username.toLowerCase());
    if (liveAvatar && liveAvatar !== s.profilePicUrl) {
      return {
        ...s,
        profilePicUrl: liveAvatar,
        posts: s.posts.map((p) => ({ ...p, avatar: liveAvatar })),
      };
    }
    return s;
  });

  memoryStories = updated;
  notifyStories();
}

export async function cloneInstagramProfile(
  rawInput: string
): Promise<{ success: boolean; error?: string; user?: ScrapedInstagramUser }> {
  const username = rawInput
    .trim()
    .replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^@+/, "");

  if (!username) {
    return {
      success: false,
      error: "Please enter an Instagram username or profile link.",
    };
  }

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:8080";
    const res = await scrapeInstagramProfile(username, origin);
    if (res.status === "ok" && res.data?.user) {
      const mapped = mapScrapedUserToProfile(res.data.user);
      memoryProfile = mapped;
      notifyProfile();
      return { success: true, user: res.data.user };
    }
  } catch {
    // Backend API unavailable (e.g. offline APK or standalone WebView) - fall through to fallback
  }

  // Resilient offline fallback: instantly generate realistic cloned profile data
  try {
    const fallbackUser = generateRealisticScrapedUser(username);
    const mapped = mapScrapedUserToProfile(fallbackUser);
    memoryProfile = mapped;
    notifyProfile();
    return { success: true, user: fallbackUser };
  } catch (err) {
    return {
      success: false,
      error: "Failed to clone profile. Please try again.",
    };
  }
}

export function useProfile(): {
  profile: ProfileData;
  setProfile: typeof setProfileData;
  selectPost: typeof setSelectedPostIndex;
  resetProfile: typeof resetToDefaultProfile;
  cloneProfile: typeof cloneInstagramProfile;
  addHighlight: typeof addHighlight;
  deleteHighlight: typeof deleteHighlight;
  updateHighlight: typeof updateHighlight;
  moveHighlight: typeof moveHighlight;
  reorderHighlights: typeof reorderHighlights;
} {
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    () => DEFAULT_PROFILE
  );

  return {
    profile,
    setProfile: setProfileData,
    selectPost: setSelectedPostIndex,
    resetProfile: resetToDefaultProfile,
    cloneProfile: cloneInstagramProfile,
    addHighlight,
    deleteHighlight,
    updateHighlight,
    moveHighlight,
    reorderHighlights,
  };
}

export function useHomeStories(): {
  stories: HomeStoryAccount[];
  addStory: typeof addCustomStoryAccount;
  removeStory: typeof removeCustomStoryAccount;
} {
  const stories = useSyncExternalStore(
    subscribeStories,
    getStoriesSnapshot,
    () => DEFAULT_HOME_STORIES
  );

  return {
    stories,
    addStory: addCustomStoryAccount,
    removeStory: removeCustomStoryAccount,
  };
}
