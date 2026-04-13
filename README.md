# Skies Weather — Local Setup Guide

## Your folder should look like this:
```
skies/
├── skies-weather.html
├── manifest.json
├── sw.js
├── icon-192.png      ← generate this (see below)
├── icon-512.png      ← generate this (see below)
└── README.md
```

---

## Step 1 — Create a folder
Make a folder called `skies` anywhere (Desktop is fine).
Drop all the files into it.

---

## Step 2 — Create app icons (free, 2 minutes)

Go to https://favicon.io/favicon-generator/
- Text: ☀️  (or just "Sk")
- Background: Rounded, color #1a2744
- Font color: #ffffff
- Download the zip → grab `android-chrome-192x192.png` and `android-chrome-512x512.png`
- Rename them to `icon-192.png` and `icon-512.png`
- Put them in your skies/ folder

---

## Step 3 — Install VS Code + Live Server

1. Download VS Code: https://code.visualstudio.com
2. Open VS Code → Extensions (⇧⌘X) → search "Live Server" → Install
   (by Ritwick Dey, 50M+ downloads)

---

## Step 4 — Run it on your Mac

1. Open VS Code
2. File → Open Folder → select your `skies/` folder
3. Right-click `skies-weather.html` → "Open with Live Server"
4. Chrome opens at `http://127.0.0.1:5500/skies-weather.html`

**Install as a Mac app (Chrome):**
- In Chrome, look for the install icon (⊕) in the address bar → Install "Skies Weather"
- It appears in your Applications folder and Dock like a real app

---

## Step 5 — Use it on your iPhone (same WiFi)

1. With Live Server running on your Mac, find your Mac's local IP:
   - System Settings → Wi-Fi → click your network → note the IP (e.g. 192.168.1.42)
2. On your iPhone, open Safari and go to:
   `http://192.168.1.42:5500/skies-weather.html`
3. Tap the Share button → **Add to Home Screen** → Add
4. It installs as a full-screen app on your home screen ✓

---

## Making edits

1. Open `skies-weather.html` in VS Code
2. Edit and save (⌘S)
3. The browser auto-refreshes instantly — no manual reload needed

---

## Tips

- Weather data caches for 10 minutes so it loads fast on repeat opens
- Your saved cities and unit preference (°C/°F) persist in localStorage
- The app works offline after first load (service worker caches the shell)
- To force a weather refresh, just pull-to-reload in the browser
