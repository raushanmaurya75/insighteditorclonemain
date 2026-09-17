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
import type { ScrapedInstagramUser } from "./instagram-scraper";


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

export interface ProfileData {
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  category: string;
  externalUrl: string;
  isVerified: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  monthlyViews: string;
  noteText: string;
  isCloned: boolean;
  posts: ProfilePost[];
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
  username: "btwdorian",
  fullName: "Dorian Divizev",
  avatarUrl: profilePhoto,
  bio: "Gambling “POV GOD” ifykyk\nsign up here ↓ for $1k giveaway at 10k 🎉",
  category: "Adult Entertainment Service",
  externalUrl: "https://shuffle.us/?r=btwdorian",
  isVerified: true,
  postsCount: 42,
  followersCount: 6253,
  followingCount: 939,
  monthlyViews: "1.6M",
  noteText: "Obsessed\nwith...",
  isCloned: false,
  posts: [
    {
      id: "seed_1",
      shortcode: "DF_dK99O5lQ",
      is_video: true,
      display_url: reelRoad,
      thumbnail_src: reelRoad,
      video_url: reelVideo1,
      likes: 368,
      comments: 10,
      views: 37600,
      caption: "POV: the type of place bro takes you after you go 0/4 on ur parlays",
      timestamp: 1786650000,
    },
    {
      id: "seed_2",
      shortcode: "DE82lknO28a",
      is_video: true,
      display_url: reelCasino,
      thumbnail_src: reelCasino,
      video_url: reelVideo2,
      likes: 1240,
      comments: 48,
      views: 22900,
      caption: "POV: How it feels knowing you discovered the ultimate spot",
      timestamp: 1786563600,
    },
    {
      id: "seed_3",
      shortcode: "DC6_201pxk9",
      is_video: true,
      display_url: reelMachine,
      thumbnail_src: reelMachine,
      video_url: reelVideo3,
      likes: 4950,
      comments: 182,
      views: 143000,
      caption: "POV: You grab the machine before they say who just blew his paycheck",
      timestamp: 1786477200,
    },
  ],
  selectedPostIndex: 0,
};

export const DEFAULT_HOME_STORIES: HomeStoryAccount[] = [
  {
    id: "story_1",
    username: "pakhi_art424",
    fullName: "Pakhi Art",
    profilePicUrl: storyMan,
    posts: [
      {
        id: "post_pakhi",
        user: "pakhi_art424",
        avatar: storyMan,
        sub: "♫ Pawan Singh · Gajab Kayila",
        img: nainaTarsemArt,
        count: "1/5",
        tag1: "#lifeenjoyments🌍💖❤️",
        tag2: "#instagram",
        time: "6 days ago",
        likes: "823",
        comments: "42",
        caption: "Life enjoyments with incredible art and color. 🎨",
        isVerified: false,
        is_video: true,
        video_url: reelVideo1,
      },
    ],
  },
  {
    id: "story_2",
    username: "anubhav.dubey.3",
    fullName: "Anubhav Dubey",
    profilePicUrl: storyPackaging,
    posts: [
      {
        id: "post_anubhav",
        user: "anubhav.dubey.3",
        avatar: storyPackaging,
        sub: "Kolkata - The City of Joy",
        img: anubhavDubeyPhoto,
        count: "1/4",
        tag1: "#business",
        tag2: "#startup",
        time: "1 day ago",
        likes: "1,204",
        comments: "88",
        caption: "Building everyday with grit and consistency. ☕",
        isVerified: true,
        is_video: false,
      },
    ],
  },
];

const STORAGE_KEY = "instagram_app_profile_v4";
const STORIES_STORAGE_KEY = "instagram_home_stories_v4";

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

        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          avatarUrl: parsed.avatarUrl || profilePhoto,
          posts,
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

  try {
    const res = await fetch(`/api/scrape-ig?username=${encodeURIComponent(username)}`);
    if (!res.ok) {
      return {
        success: false,
        error: "Unable to connect to Instagram. Please try again.",
      };
    }

    const data = await res.json();
    if (data.status === "ok" && data.data?.user) {
      const user = data.data.user as ScrapedInstagramUser;
      const userPosts = (user.edge_owner_to_timeline_media?.edges || []).map((e, idx) => {
        const node = e.node;
        return {
          id: node.id || `story_post_${user.username}_${idx}`,
          user: user.username,
          avatar: user.profile_pic_url_hd || user.profile_pic_url || storyMan,
          sub: `♫ Original Audio · ${user.username}`,
          img: node.display_url || node.thumbnail_src || storyMan,
          count: "1/1",
          tag1: `#${user.username}`,
          tag2: "#instagram",
          time: "Just now",
          likes: formatCompactNumber(node.edge_media_preview_like?.count || 1200),
          comments: formatCompactNumber(node.edge_media_to_comment?.count || 45),
          caption:
            node.edge_media_to_caption?.edges?.[0]?.node?.text ||
            `New post by @${user.username} ✨`,
          isVerified: user.is_verified,
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

    return {
      success: false,
      error:
        data.error ||
        "Couldn't find that account. Please check the username and make sure it is a public profile.",
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong while fetching this profile. Please try again.",
    };
  }
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
        `Post by @${user.username} ✨`;

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

  const followers = user.edge_followed_by?.count || 0;
  const following = user.edge_follow?.count || 0;
  const postsCount = user.edge_owner_to_timeline_media?.count || posts.length;

  const monthlyViewsEstimate =
    followers > 1_000_000
      ? `${(followers * 2.8 / 1_000_000).toFixed(1)}M`
      : followers > 50_000
      ? `${(followers * 2.5 / 1_000).toFixed(0)}K`
      : "1.6M";

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
    posts: posts.length > 0 ? posts : DEFAULT_PROFILE.posts,
    selectedPostIndex: 0,
  };
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
    const res = await fetch(`/api/scrape-ig?username=${encodeURIComponent(username)}`);
    if (!res.ok) {
      return {
        success: false,
        error: "Unable to reach the profile server. Please try again in a moment.",
      };
    }

    const data = await res.json();
    if (data.status === "ok" && data.data?.user) {
      const mapped = mapScrapedUserToProfile(data.data.user);
      memoryProfile = mapped;
      notifyProfile();
      return { success: true, user: data.data.user };
    }

    return {
      success: false,
      error:
        data.error ||
        "Couldn't find that account. Please check the username and make sure it's a public profile.",
    };
  } catch {
    return {
      success: false,
      error: "Connection problem. Please check your network and try again.",
    };
  }
}

export function useProfile(): {
  profile: ProfileData;
  setProfile: typeof setProfileData;
  selectPost: typeof setSelectedPostIndex;
  resetProfile: typeof resetToDefaultProfile;
  cloneProfile: typeof cloneInstagramProfile;
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
