# WardTrack — Standalone Android App (Capacitor)

This project bundles the **entire WardTrack app inside the APK**. Unlike the
PWABuilder version, it does **not** load from GitHub Pages — the app files live
inside the installed app, so it opens instantly and works even if your website
is down. It still uses the internet only for Firebase team-sync (same as before).

The whole app is in the `www/` folder. Everything else is the native wrapper.

---

## Easiest build — GitHub Actions (no computer setup needed)

This repo includes a workflow that builds the APK **in the cloud**. You never
install Android Studio, Node, or Java.

### Steps

1. Create a **new** GitHub repository (e.g. `WardTrack-App`) — keep it Public or Private, either works.
2. Upload **everything in this `wardtrack-app` folder** to that repo, keeping the structure:
   ```
   www/                         (the app + icons)
   package.json
   capacitor.config.json
   .gitignore
   .github/workflows/build-android.yml
   ```
   > On GitHub: **Add file → Upload files**, drag the folders/files in, commit.
   > Make sure the `.github/workflows/build-android.yml` path is preserved —
   > the hidden `.github` folder must be at the repo root.
3. Go to the repo's **Actions** tab. The build starts automatically on push
   (or click **Build WardTrack Android APK → Run workflow**).
4. Wait ~5–8 minutes. When it finishes (green ✓), open the completed run and
   scroll to **Artifacts** → download **WardTrack-APK**.
5. Unzip it → you get **`WardTrack.apk`**.
6. Send that `.apk` to your team via WhatsApp → tap to install.

That's it. To update the app later, replace the files in `www/` (paste the new
`index.html`), commit, and download the freshly built APK from Actions.

---

## Alternative — build on your own computer

If you have (or set up) a computer with **Node.js** and **Android Studio**:

```bash
cd wardtrack-app
npm install
npx cap add android
npx cap sync android
npx cap open android     # opens Android Studio → Build → Build APK
```

Or headless (no Android Studio UI), from the project folder after `cap add android`:

```bash
cd android
./gradlew assembleDebug
# APK appears at android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Notes

- **App ID:** `io.github.arikashimaru.wardtrack` (change in `capacitor.config.json` if you like)
- **Debug APK:** the workflow builds a *debug* APK, which installs directly on any
  phone by sideloading — perfect for sharing with your team. No signing keystore needed.
- **Play Store:** for the Play Store you need a *signed release* build. Ask and I'll
  add the signing step + a release workflow.
- **Firebase sync, offline data, photo upload, and all features** work the same
  inside the app. The service worker is automatically skipped inside the native
  app (not needed — files are already local).
- **Camera/photos:** the "Add Photo" button opens the Android file/camera picker
  through the WebView.
