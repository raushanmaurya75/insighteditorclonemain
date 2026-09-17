import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";
import {
  scrapeInstagramProfile,
  proxyMediaRequest,
  fetchPostDetails,
} from "./src/lib/instagram-scraper";

function instagramApiDevPlugin(): Plugin {
  return {
    name: "instagram-api-dev-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlStr = req.url || "";
        if (!urlStr.startsWith("/api/")) {
          return next();
        }

        try {
          const fullUrl = new URL(urlStr, `http://${req.headers.host || "localhost:8080"}`);
          const pathname = fullUrl.pathname;
          const origin = fullUrl.origin;

          // CORS Preflight
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Range");
            res.end();
            return;
          }

          // 1. Scrape Profile
          if (pathname === "/api/scrape-ig") {
            const username = fullUrl.searchParams.get("username") || "";
            const result = await scrapeInstagramProfile(username, origin);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify(result));
            return;
          }

          // 2. Proxy Media Request (for images & MP4 videos with chunked streaming)
          if (pathname === "/api/ig-image-proxy") {
            const mediaUrl = fullUrl.searchParams.get("url") || "";
            const headers = new Headers();
            if (req.headers["range"]) {
              headers.set("range", String(req.headers["range"]));
            }
            const proxyRes = await proxyMediaRequest(mediaUrl, headers);
            res.statusCode = proxyRes.status;
            proxyRes.headers.forEach((val, key) => {
              res.setHeader(key, val);
            });
            if (proxyRes.body) {
              const reader = proxyRes.body.getReader();
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(Buffer.from(value));
              }
            }
            res.end();
            return;
          }

          // 3. Fetch Post Details (real playable video URL)
          if (pathname === "/api/fetch-post") {
            const postUrl = fullUrl.searchParams.get("url") || "";
            const postRes = await fetchPostDetails(postUrl, origin);
            res.statusCode = postRes.status;
            postRes.headers.forEach((val, key) => {
              res.setHeader(key, val);
            });
            const text = await postRes.text();
            res.end(text);
            return;
          }

          next();
        } catch (err) {
          console.error("[Vite IG API Middleware Error]:", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
      });
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [instagramApiDevPlugin()],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

