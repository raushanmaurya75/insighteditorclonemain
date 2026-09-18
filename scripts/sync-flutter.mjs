import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicSourceDir = path.join(rootDir, 'public');
const outputPublicDir = path.join(rootDir, '.output', 'public');
const outputServerEntry = path.join(rootDir, '.output', 'server', 'index.mjs');

const flutterAssetsDir = path.join(rootDir, 'flutter_app', 'assets', 'web');
const flutterDistDir = path.join(rootDir, 'flutter_app', 'dist');
const distDir = path.join(rootDir, 'dist');

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function renderRoute(serverModule, routePath) {
  const env = { ASSETS: { fetch: () => new Response(null, { status: 404 }) } };
  const ctx = { waitUntil: () => {}, passThroughOnException: () => {} };
  const url = `http://localhost:8080${routePath}`;
  const req = new Request(url, { headers: { accept: 'text/html' } });

  const res = await serverModule.default.fetch(req, env, ctx);
  if (!res.ok) {
    throw new Error(`Failed to render ${routePath}: HTTP ${res.status}`);
  }
  return await res.text();
}

async function main() {
  console.log('🔄 Syncing web dist to Flutter app assets...');

  // Clean and prepare target asset directories
  cleanDir(flutterAssetsDir);
  cleanDir(flutterDistDir);
  cleanDir(distDir);

  // 1. Copy public raw assets (videos, static images)
  if (fs.existsSync(publicSourceDir)) {
    copyDirRecursive(publicSourceDir, flutterAssetsDir);
    copyDirRecursive(publicSourceDir, flutterDistDir);
    copyDirRecursive(publicSourceDir, distDir);
  }

  // 2. Copy compiled .output/public files (assets bundle with JS, CSS, hashed media)
  if (fs.existsSync(outputPublicDir)) {
    copyDirRecursive(outputPublicDir, flutterAssetsDir);
    copyDirRecursive(outputPublicDir, flutterDistDir);
    copyDirRecursive(outputPublicDir, distDir);
  }

  // 3. Render production SSR HTML pages
  let serverModule = null;
  if (fs.existsSync(outputServerEntry)) {
    try {
      serverModule = await import(`file://${outputServerEntry.replace(/\\/g, '/')}`);
      console.log('✅ Loaded production SSR server bundle.');
    } catch (e) {
      console.warn('⚠️ Could not load SSR module directly:', e.message);
    }
  }

  const routes = [
    { path: '/', file: 'index.html' },
    { path: '/profile', file: 'profile.html' },
    { path: '/insights', file: 'insights.html' },
    { path: '/dashboard', file: 'dashboard.html' },
    { path: '/insight-view', file: 'insight-view.html' },
    { path: '/post-view', file: 'post-view.html' },
  ];

  let mainHtml = '';

  for (const route of routes) {
    let routeHtml = '';
    if (serverModule) {
      try {
        routeHtml = await renderRoute(serverModule, route.path);
        console.log(`✅ Pre-rendered SSR HTML for ${route.path} -> ${route.file}`);
      } catch (err) {
        console.warn(`⚠️ Pre-render failed for ${route.path}:`, err.message);
      }
    }

    if (!routeHtml) {
      // Fallback: Generate standalone SPA HTML referencing the production CSS and JS bundle
      const assetsDir = path.join(outputPublicDir, 'assets');
      let cssFile = '';
      let jsFile = '';
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css')) || '';
        jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js')) || '';
      }

      routeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Insight Editor</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Grand+Hotel&display=swap" rel="stylesheet" />
  ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : ''}
</head>
<body>
  <div id="root"></div>
  ${jsFile ? `<script type="module" src="/assets/${jsFile}"></script>` : ''}
</body>
</html>`;
    }

    if (route.path === '/') {
      mainHtml = routeHtml;
    }

    fs.writeFileSync(path.join(flutterAssetsDir, route.file), routeHtml, 'utf-8');
    fs.writeFileSync(path.join(flutterDistDir, route.file), routeHtml, 'utf-8');
    fs.writeFileSync(path.join(distDir, route.file), routeHtml, 'utf-8');
  }

  // Ensure index.html always exists
  if (mainHtml) {
    fs.writeFileSync(path.join(flutterAssetsDir, 'index.html'), mainHtml, 'utf-8');
    fs.writeFileSync(path.join(flutterDistDir, 'index.html'), mainHtml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'index.html'), mainHtml, 'utf-8');
  }

  console.log('🎉 Successfully synced production assets & pre-rendered HTML to Flutter app!');
}

main().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
