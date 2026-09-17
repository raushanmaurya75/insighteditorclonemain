import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicDir = path.join(rootDir, '.output', 'public');
const flutterAssetsDir = path.join(rootDir, 'flutter_app', 'assets', 'web');
const flutterDistDir = path.join(rootDir, 'flutter_app', 'dist');
const desktopFlutterAssetsDir = path.resolve(rootDir, '..', 'insight editor flutter', 'assets', 'web');
const desktopFlutterDistDir = path.resolve(rootDir, '..', 'insight editor flutter', 'dist');
const distDir = path.join(rootDir, 'dist');

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

async function main() {
  console.log('🔄 Syncing web dist to Flutter app assets...');

  // Ensure target directories exist
  fs.mkdirSync(flutterAssetsDir, { recursive: true });
  fs.mkdirSync(flutterDistDir, { recursive: true });
  fs.mkdirSync(desktopFlutterAssetsDir, { recursive: true });
  fs.mkdirSync(desktopFlutterDistDir, { recursive: true });
  fs.mkdirSync(distDir, { recursive: true });

  // 1. Copy .output/public files
  if (fs.existsSync(publicDir)) {
    copyDirRecursive(publicDir, flutterAssetsDir);
    copyDirRecursive(publicDir, flutterDistDir);
    copyDirRecursive(publicDir, desktopFlutterAssetsDir);
    copyDirRecursive(publicDir, desktopFlutterDistDir);
    copyDirRecursive(publicDir, distDir);
  }

  // 2. Fetch the rendered HTML from local server or create standard SPA index.html
  let htmlContent = '';
  try {
    const res = await fetch('http://localhost:8080');
    if (res.ok) {
      htmlContent = await res.text();
      console.log('✅ Captured pre-rendered HTML from running server.');
    }
  } catch {
    console.log('ℹ️ Server not running, generating standalone index.html from bundle...');
  }

  if (!htmlContent) {
    // Look for styles and scripts in publicDir
    const assetsDir = path.join(publicDir, 'assets');
    let cssFile = '';
    let jsFile = '';
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css')) || '';
      jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js')) || '';
    }

    htmlContent = `<!DOCTYPE html>
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

  // Write index.html to targets
  fs.writeFileSync(path.join(flutterAssetsDir, 'index.html'), htmlContent, 'utf-8');
  fs.writeFileSync(path.join(flutterDistDir, 'index.html'), htmlContent, 'utf-8');
  fs.writeFileSync(path.join(desktopFlutterAssetsDir, 'index.html'), htmlContent, 'utf-8');
  fs.writeFileSync(path.join(desktopFlutterDistDir, 'index.html'), htmlContent, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf-8');

  console.log('✅ Successfully synced dist & index.html to:');
  console.log('   📁', flutterAssetsDir);
  console.log('   📁', flutterDistDir);
  console.log('   📁', desktopFlutterAssetsDir);
  console.log('   📁', desktopFlutterDistDir);
  console.log('   📁', distDir);
}

main().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
