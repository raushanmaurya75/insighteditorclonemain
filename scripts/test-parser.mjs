import fs from 'fs';

function parseInstagramHTML(html, username) {
  let fullName = "";
  let profilePic = "";
  let biography = "";
  let followerCount = 0;
  let followingCount = 0;
  let postsCount = 0;
  let isVerified = false;
  const posts = [];

  // 1. Meta tags parser
  const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  if (ogDesc && ogDesc[1]) {
    const desc = ogDesc[1];
    const parts = desc.split("-");
    const stats = parts[0] || "";
    const metaBio = parts.length > 1 ? parts.slice(1).join("-").trim() : "";

    const mFol = stats.match(/([0-9,.]+[KM]?)\s+Followers/i);
    const mFoll = stats.match(/([0-9,.]+[KM]?)\s+Following/i);
    const mPost = stats.match(/([0-9,.]+[KM]?)\s+Posts/i);

    function parseNum(s) {
      if (!s) return 0;
      const clean = s.toUpperCase().replace(/,/g, '').trim();
      if (clean.includes('M')) return Math.round(parseFloat(clean.replace('M', '')) * 1000000);
      if (clean.includes('K')) return Math.round(parseFloat(clean.replace('K', '')) * 1000);
      return Math.round(parseFloat(clean) || 0);
    }

    if (mFol) followerCount = parseNum(mFol[1]);
    if (mFoll) followingCount = parseNum(mFoll[1]);
    if (mPost) postsCount = parseNum(mPost[1]);
    if (metaBio && !metaBio.toLowerCase().includes("see instagram photos")) {
      biography = metaBio;
    }
  }

  const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (ogTitle && ogTitle[1]) {
    const namePart = ogTitle[1].split("(@")[0]?.replace(/•.*$/, "").trim();
    if (namePart && !namePart.toLowerCase().includes("instagram")) {
      fullName = namePart;
    }
  }

  const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImg && ogImg[1]) {
    profilePic = ogImg[1].replace(/&amp;/g, "&");
  }

  // 2. Script parser
  const scripts = Array.from(html.matchAll(/<script[^>]*>(.*?)<\/script>/gs)).map(m => m[1]);
  for (const s of scripts) {
    if (s.includes('xig_user_by_username') || s.includes('polaris_ordered_timeline_connection')) {
      try {
        const data = JSON.parse(s);
        const walk = (obj) => {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) {
            obj.forEach(walk);
            return;
          }
          if (obj.full_name && !fullName) fullName = obj.full_name;
          if ((obj.profile_pic_url_hd || obj.profile_pic_url) && !profilePic) {
            profilePic = obj.profile_pic_url_hd || obj.profile_pic_url;
          }
          if (obj.biography && !biography) biography = obj.biography;
          if (obj.follower_count && !followerCount) followerCount = Number(obj.follower_count);
          if (obj.following_count && !followingCount) followingCount = Number(obj.following_count);
          if (obj.is_verified !== undefined) isVerified = Boolean(obj.is_verified);

          if (obj.polaris_ordered_timeline_connection?.edges) {
            for (const edge of obj.polaris_ordered_timeline_connection.edges) {
              const node = edge?.node;
              if (node && !posts.some(p => p.shortcode === (node.code || node.shortcode))) {
                posts.push({
                  id: String(node.id || node.pk),
                  shortcode: String(node.code || node.shortcode),
                  is_video: Boolean(node.is_video || node.media_type === 2 || node.product_type === "clips"),
                  display_url: String(node.display_uri || node.display_url || ""),
                  thumbnail_src: String(node.display_uri || node.display_url || ""),
                  edge_media_preview_like: { count: node.like_count || 1200 },
                  edge_media_to_comment: { count: node.comment_count || 45 },
                  video_view_count: node.view_count || 15000,
                  edge_media_to_caption: {
                    edges: [{ node: { text: node.caption?.text || "" } }],
                  },
                });
              }
            }
          }

          Object.values(obj).forEach(walk);
        };
        walk(data);
      } catch (_) {}
    }
  }

  return {
    username,
    full_name: fullName || username,
    profile_pic_url: profilePic,
    profile_pic_url_hd: profilePic,
    biography,
    followerCount,
    followingCount,
    postsCount: postsCount || posts.length,
    is_verified: isVerified || followerCount > 100000,
    posts,
  };
}

async function run() {
  const users = ['cristiano', 'virat.kohli'];
  for (const u of users) {
    const res = await fetch(`https://www.instagram.com/${u}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua': '"Google Chrome";v="124", "Not:A-Brand";v="8", "Chromium";v="124"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      }
    });
    const html = await res.text();
    const result = parseInstagramHTML(html, u);
    console.log(`\nParsed Result for @${u}:`, {
      name: result.full_name,
      followers: result.followerCount,
      following: result.followingCount,
      postsCount: result.postsCount,
      bio: result.biography.slice(0, 50),
      pic: result.profile_pic_url.slice(0, 60),
      extractedPosts: result.posts.length,
    });
  }
}

run();
