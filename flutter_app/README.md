# Insight Editor - Flutter Android App

This Flutter project wraps and powers the **Insight Editor** React web application as a native Android app / APK.

---

## 🚀 How It Works & Recommended Methods

### Method 1: Live Dev Mode (Recommended for Development)
1. In the React root directory, start the dev server:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:8080`)*

2. In the Flutter project (`flutter_app` or `insight editor flutter`), run:
   ```bash
   flutter run
   ```
   - **On Android Emulator**: Connects automatically to `http://10.0.2.2:8080`.
   - **On Physical Android Device**: Ensure phone is on the same Wi-Fi, click "Change URL" on the app screen and enter `http://<YOUR_PC_IP>:8080`.

---

### Method 2: Production Hosted Mode (Recommended for Release)
1. Deploy your React app to your hosting provider (e.g. Cloudflare, Vercel, VPS).
2. Open [`lib/main.dart`](file:///lib/main.dart) and update `AppConfig`:
   ```dart
   static const String productionUrl = "https://your-domain.com";
   static const bool isProduction = true;
   ```
3. Build the release APK:
   ```bash
   flutter build apk --release
   ```
   The generated APK will be at `build/app/outputs/flutter-apk/app-release.apk`.

---

### Method 3: One-Click Build & Sync from React Workspace
From the React project directory:
```bash
npm run build:apk
```
This will automatically:
1. Build the production React web bundle (`npm run build`).
2. Sync the output assets to the Flutter asset bundle (`assets/web/`).
3. Build the Flutter APK (`flutter build apk --debug`).

---

## ✨ Features Included

- **Native Android Back Navigation**: Pressing back navigates back inside the web app history. Double-tap back at root prompts "Press back again to exit".
- **Pull-to-Refresh**: Native pull down to reload web view.
- **Top Loading Indicator**: Instagram-style slim gradient progress bar.
- **Offline & Error Recovery**: If server is unreachable, displays a retry screen and an in-app "Change URL" dialog.
- **Hardware Acceleration & Media Playback**: Supports HTML5 video autoplay, inline video/audio reels, and full screen.
- **Permissions**: Internet, camera, and gallery/media permissions configured in `AndroidManifest.xml`.
