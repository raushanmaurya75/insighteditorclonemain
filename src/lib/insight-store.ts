export interface GraphPoint {
  time: number; // minutes for views, seconds for retention/likes
  value: number; // count or percentage
}

export interface CountryData {
  id: string;
  name: string;
  percentage: number;
}

export interface MetricRateItem {
  key: "skip" | "share" | "like" | "save" | "repost" | "comment";
  label: string;
  rate: number;
  status: "Auto" | "Higher" | "Lower" | "Typical";
}

export interface PostInsightsData {
  postId: string;
  // Top Strip Preview
  customThumbnailUrl?: string;

  // Interaction Counts (under thumbnail)
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  saves: number;

  // Summary Grid
  views: number;
  viewers: number;
  averageWatchTime: string;
  followsSummary: number;

  // Views Over Time Graph
  viewsFilter: "all" | "followers" | "non-followers";
  viewsGraphDurationHours: number;
  viewsGraphXMode: "dates" | "hours";
  viewsGraphDates: [string, string, string];
  viewsGraphMax: string;
  viewsGraphMid: string;
  viewsGraphStart: string;
  viewsThisReelPoints: GraphPoint[];
  viewsTypicalPoints: GraphPoint[];

  // What Impacts Your Views
  rates: {
    skip: { rate: number; status: "Auto" | "Higher" | "Lower" | "Typical" };
    share: { rate: number; status: "Auto" | "Higher" | "Lower" | "Typical" };
    like: { rate: number; status: "Auto" | "Higher" | "Lower" | "Typical" };
    save: { rate: number; status: "Auto" | "Higher" | "Lower" | "Typical" };
    repost: { rate: number; status: "Auto" | "Higher" | "Lower" | "Typical" };
    comment: { rate: number; status: "Auto" | "Higher" | "Lower" | "Typical" };
  };

  // How long people watched (Watch Retention)
  reelDurationSeconds: number;
  watchRetentionPoints: GraphPoint[];

  // Top Sources of Views
  sources: {
    reelsTab: number;
    explore: number;
    feed: number;
    profile: number;
    search: number;
  };

  // Engagement Tab
  followsEngagement: number;
  profileVisits: number;
  likesRetentionPoints: GraphPoint[];

  // Audience Tab
  followersPct: number;
  nonFollowersPct: number;
  age: {
    age13_17: number;
    age18_24: number;
    age25_34: number;
    age35_44: number;
    age45_54: number;
    age55_64: number;
    age65Plus: number;
  };
  countries: CountryData[];
  gender: {
    men: number;
    women: number;
  };
}

export class GraphSplineMath {
  static formatViews(value: number): string {
    if (value == null || isNaN(value)) return "0";
    if (value >= 1_000_000) {
      const m = value / 1_000_000;
      const formatted = m >= 10 || m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, "");
      return `${formatted}M`;
    } else if (value >= 1_000) {
      const k = value / 1_000;
      const formatted = k >= 10 || k % 1 === 0 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, "");
      return `${formatted}k`;
    } else {
      return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
    }
  }

  static parseViews(text: string | number): number {
    if (typeof text === "number") return text;
    if (text == null) return 0;
    const clean = text.toString().trim().replace(/,/g, "").toLowerCase();
    if (!clean) return 0;
    if (clean.endsWith("m")) {
      const num = parseFloat(clean.slice(0, -1));
      return (isNaN(num) ? 0 : num) * 1_000_000;
    }
    if (clean.endsWith("k")) {
      const num = parseFloat(clean.slice(0, -1));
      return (isNaN(num) ? 0 : num) * 1_000;
    }
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }

  static computeMilestoneCeiling(
    val: number,
    defaultMax = 2000,
    minCeiling = 10
  ): number {
    if (val <= 0) return defaultMax;
    if (val < minCeiling) return minCeiling;

    const exp = Math.floor(Math.log10(val));
    const powerOfTen = Math.pow(10, exp);
    const fraction = val / powerOfTen;

    let ceilingFraction = 10.0;
    if (fraction <= 1.0) {
      ceilingFraction = 1.0;
    } else if (fraction <= 2.0) {
      ceilingFraction = 2.0;
    } else if (fraction <= 5.0) {
      ceilingFraction = 5.0;
    }
    return ceilingFraction * powerOfTen;
  }

  /// Monotone Cubic Spline (Fritsch-Carlson algorithm)
  static interpolateSplineY(t: number, points: GraphPoint[]): number {
    if (points.length === 0) return 0;
    const sorted = [...points].sort((a, b) => a.time - b.time);
    if (sorted.length === 1) return sorted[0].value;
    if (t <= sorted[0].time) return sorted[0].value;
    if (t >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;

    const n = sorted.length;
    const dx = new Array(n - 1).fill(0);
    const dy = new Array(n - 1).fill(0);
    const ms = new Array(n - 1).fill(0);

    for (let i = 0; i < n - 1; i++) {
      dx[i] = sorted[i + 1].time - sorted[i].time;
      dy[i] = sorted[i + 1].value - sorted[i].value;
      ms[i] = dx[i] === 0 ? 0 : dy[i] / dx[i];
    }

    const c1s = new Array(n).fill(0);
    c1s[0] = ms[0];
    for (let i = 0; i < n - 1; i++) {
      const m = ms[i];
      if (i < n - 2) {
        const mNext = ms[i + 1];
        if (m * mNext <= 0) {
          c1s[i + 1] = 0;
        } else {
          const commonDx = dx[i] + dx[i + 1];
          c1s[i + 1] =
            commonDx === 0
              ? 0
              : (3 * commonDx) /
                ((2 * dx[i + 1] + dx[i]) / m + (dx[i + 1] + 2 * dx[i]) / mNext);
        }
      }
    }
    c1s[n - 1] = ms[n - 2];

    let i = 0;
    for (let k = 0; k < n - 1; k++) {
      if (t >= sorted[k].time && t <= sorted[k + 1].time) {
        i = k;
        break;
      }
    }

    const h = sorted[i + 1].time - sorted[i].time;
    if (h === 0) return sorted[i].value;
    const diff = t - sorted[i].time;
    const tNorm = diff / h;
    const t2 = tNorm * tNorm;
    const t3 = t2 * tNorm;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + tNorm;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    return (
      h00 * sorted[i].value +
      h10 * h * c1s[i] +
      h01 * sorted[i + 1].value +
      h11 * h * c1s[i + 1]
    );
  }

  /// Builds an SVG path string from points sampled across [0, maxX]
  static buildSvgPath(
    points: GraphPoint[],
    options: {
      maxX: number;
      maxY: number;
      minY?: number;
      width: number;
      height: number;
      paddingTop?: number;
      paddingBottom?: number;
      paddingLeft?: number;
      paddingRight?: number;
      samples?: number;
    }
  ): string {
    if (points.length === 0) return "";
    const {
      maxX,
      maxY,
      minY = 0,
      width,
      height,
      paddingTop = 10,
      paddingBottom = 10,
      paddingLeft = 0,
      paddingRight = 0,
      samples = 100,
    } = options;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const rangeY = maxY - minY > 0 ? maxY - minY : 1;

    let pathStr = "";
    for (let step = 0; step <= samples; step++) {
      const t = (step / samples) * maxX;
      const val = GraphSplineMath.interpolateSplineY(t, points);
      const px = paddingLeft + (t / maxX) * chartWidth;
      const py =
        height - paddingBottom - ((val - minY) / rangeY) * chartHeight;

      if (step === 0) {
        pathStr += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
      } else {
        pathStr += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      }
    }
    return pathStr;
  }
}

export function calculateMetricStatus(
  metricLabel: string,
  rate: number,
  statusSetting: "Auto" | "Higher" | "Lower" | "Typical" = "Auto"
): { text: string; color: string; isGreen: boolean; isRed: boolean } {
  if (statusSetting && statusSetting !== "Auto") {
    const isHigher = statusSetting === "Higher";
    const isLower = statusSetting === "Lower";
    const isSkip = metricLabel.toLowerCase().includes("skip");
    const isGreen = isSkip ? isLower : isHigher;
    const isRed = isSkip ? isHigher : isLower;

    return {
      text: statusSetting,
      color: isGreen ? "#2db84c" : isRed ? "#e05353" : "#737373",
      isGreen,
      isRed,
    };
  }

  const key = metricLabel.toLowerCase();
  if (key.includes("skip")) {
    if (rate < 30.0) {
      return { text: "Lower", color: "#2db84c", isGreen: true, isRed: false };
    } else if (rate <= 45.0) {
      return { text: "Typical", color: "#737373", isGreen: false, isRed: false };
    } else {
      return { text: "Higher", color: "#e05353", isGreen: false, isRed: true };
    }
  }

  if (key.includes("share")) {
    if (rate > 0.7) {
      return { text: "Higher", color: "#2db84c", isGreen: true, isRed: false };
    } else if (rate >= 0.15) {
      return { text: "Typical", color: "#737373", isGreen: false, isRed: false };
    } else {
      return { text: "Lower", color: "#737373", isGreen: false, isRed: false };
    }
  }

  if (key.includes("like")) {
    if (rate > 3.5) {
      return { text: "Higher", color: "#2db84c", isGreen: true, isRed: false };
    } else if (rate >= 1.0) {
      return { text: "Typical", color: "#737373", isGreen: false, isRed: false };
    } else {
      return { text: "Lower", color: "#737373", isGreen: false, isRed: false };
    }
  }

  if (key.includes("save")) {
    if (rate > 0.3) {
      return { text: "Higher", color: "#2db84c", isGreen: true, isRed: false };
    } else {
      return { text: "Typical", color: "#737373", isGreen: false, isRed: false };
    }
  }

  if (key.includes("repost")) {
    if (rate > 0.06) {
      return { text: "Higher", color: "#2db84c", isGreen: true, isRed: false };
    } else {
      return { text: "Typical", color: "#737373", isGreen: false, isRed: false };
    }
  }

  if (rate > 2.0) {
    return { text: "Higher", color: "#2db84c", isGreen: true, isRed: false };
  } else if (rate > 0.5) {
    return { text: "Typical", color: "#737373", isGreen: false, isRed: false };
  }
  return { text: "Lower", color: "#737373", isGreen: false, isRed: false };
}

export function getDefaultPostInsights(
  postId: string,
  initialData?: {
    likes?: number;
    comments?: number;
    views?: number;
    thumbnailUrl?: string;
  }
): PostInsightsData {
  const likes = initialData?.likes || 368;
  const comments = initialData?.comments || 10;
  const views = initialData?.views || Math.max(12910, likes * 28);
  const viewers = Math.round(views * 0.32) || 4168;

  const shares = Math.round(likes * 0.08) || 4;
  const reposts = Math.round(likes * 0.03) || 2;
  const saves = Math.round(likes * 0.02) || 0;

  const likeRate = views > 0 ? Number(((likes / views) * 100).toFixed(1)) : 5.0;
  const commentRate = views > 0 ? Number(((comments / views) * 100).toFixed(1)) : 0.2;
  const shareRate = views > 0 ? Number(((shares / views) * 100).toFixed(1)) : 0.1;
  const repostRate = views > 0 ? Number(((reposts / views) * 100).toFixed(1)) : 0.1;

  return {
    postId,
    customThumbnailUrl: initialData?.thumbnailUrl,
    likes,
    comments,
    reposts,
    shares,
    saves,
    views,
    viewers,
    averageWatchTime: "13s",
    followsSummary: 0,
    viewsFilter: "all",
    viewsGraphDurationHours: 6.0,
    viewsGraphXMode: "dates",
    viewsGraphDates: ["Aug 8", "Aug 15", "Aug 22"],
    viewsGraphMax: "",
    viewsGraphMid: "",
    viewsGraphStart: "0",
    viewsThisReelPoints: [
      { time: 0, value: 0 },
      { time: 60, value: Math.round(views * 0.15) },
      { time: 180, value: Math.round(views * 0.75) },
      { time: 360, value: views },
    ],
    viewsTypicalPoints: [
      { time: 0, value: 0 },
      { time: 90, value: Math.round(views * 0.08) },
      { time: 180, value: Math.round(views * 0.35) },
      { time: 360, value: Math.round(views * 0.6) },
    ],
    rates: {
      skip: { rate: 22.1, status: "Auto" },
      share: { rate: shareRate, status: "Auto" },
      like: { rate: likeRate, status: "Auto" },
      save: { rate: 0.0, status: "Auto" },
      repost: { rate: repostRate, status: "Auto" },
      comment: { rate: commentRate, status: "Auto" },
    },
    reelDurationSeconds: 13,
    watchRetentionPoints: [
      { time: 0, value: 100 },
      { time: 2, value: 85 },
      { time: 5, value: 68 },
      { time: 8, value: 45 },
      { time: 11, value: 20 },
      { time: 13, value: 12 },
    ],
    sources: {
      reelsTab: 82.9,
      explore: 14.3,
      feed: 1.4,
      profile: 1.1,
      search: 0.2,
    },
    followsEngagement: 0,
    profileVisits: 0,
    likesRetentionPoints: [
      { time: 0, value: 15 },
      { time: 3, value: 15 },
      { time: 6, value: 0 },
      { time: 8, value: 15 },
      { time: 10, value: 15 },
      { time: 12, value: 0 },
      { time: 13, value: 0 },
    ],
    followersPct: 20.9,
    nonFollowersPct: 79.1,
    age: {
      age13_17: 5.4,
      age18_24: 42.3,
      age25_34: 36.9,
      age35_44: 9.5,
      age45_54: 3.1,
      age55_64: 1.3,
      age65Plus: 1.5,
    },
    countries: [
      { id: "c1", name: "United States", percentage: 33.4 },
      { id: "c2", name: "India", percentage: 30.6 },
      { id: "c3", name: "Brazil", percentage: 7.4 },
      { id: "c4", name: "Indonesia", percentage: 2.4 },
      { id: "c5", name: "Canada", percentage: 2.4 },
    ],
    gender: {
      men: 81.9,
      women: 18.1,
    },
  };
}

const STORAGE_PREFIX = "instagram_post_insights_v2_";

export function loadPostInsights(
  postId: string,
  initialData?: {
    likes?: number;
    comments?: number;
    views?: number;
    thumbnailUrl?: string;
  }
): PostInsightsData {
  if (typeof window === "undefined" || !postId) {
    return getDefaultPostInsights(postId || "default", initialData);
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${postId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.postId) {
        return {
          ...getDefaultPostInsights(postId, initialData),
          ...parsed,
        };
      }
    }
  } catch {}
  return getDefaultPostInsights(postId, initialData);
}

export function savePostInsights(data: PostInsightsData): void {
  if (typeof window === "undefined" || !data.postId) return;
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${data.postId}`,
      JSON.stringify(data)
    );
  } catch {}
}

export function syncPostToInsights(
  postId: string,
  data: { views?: number; likes?: number; comments?: number; thumbnailUrl?: string }
): void {
  if (typeof window === "undefined" || !postId) return;
  const current = loadPostInsights(postId);
  const updated: PostInsightsData = {
    ...current,
    ...(data.views !== undefined ? { views: data.views } : {}),
    ...(data.likes !== undefined ? { likes: data.likes } : {}),
    ...(data.comments !== undefined ? { comments: data.comments } : {}),
    ...(data.thumbnailUrl ? { customThumbnailUrl: data.thumbnailUrl } : {}),
  };
  if (data.views !== undefined && updated.viewsThisReelPoints?.length > 0) {
    const pts = [...updated.viewsThisReelPoints];
    pts[pts.length - 1] = { ...pts[pts.length - 1], value: data.views };
    updated.viewsThisReelPoints = pts;
  }
  savePostInsights(updated);
}
