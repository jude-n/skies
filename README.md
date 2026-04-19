# Skies Weather

A beautiful personal weather app — works on Mac, iPhone, and any browser. Built with vanilla HTML/JS, powered by free APIs, deployable to Vercel with zero cost.

---

## Features

- 🌤 Current conditions with animated background scenes (clear, rain, snow, thunder, fog, night)
- 🌡 Both °C and °F always visible — tap to switch primary display
- 📍 Default city: Charleston, IL — add and save unlimited cities
- 📅 10-day forecast with temperature range bars
- 🕐 24-hour hourly scroll with precipitation probability
- 🌅 Sunrise & sunset with day progress indicator
- 🌬 Air quality index (AQI) via Open-Meteo
- 🌙 Moon phase calculated locally
- ⚠️ Live weather alerts via NWS (US only, free)
- 🛰 Rain radar map via Windy embed
- 📤 Share weather summary (native share sheet or clipboard copy)
- 🔔 Rain alert push notifications (browser-based, checks every 15 min)
- 🔄 Manual refresh button
- 🌙/☀️ Dark and light mode, persists across sessions
- Works offline after first load (service worker caching)

---

## APIs Used (all free, no key required)

| API | Used for |
|-----|----------|
| [Open-Meteo](https://open-meteo.com) | Weather forecast, hourly, daily, AQI |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search |
| [Nominatim (OSM)](https://nominatim.org) | Reverse geocoding for GPS location |
| [NWS (api.weather.gov)](https://www.weather.gov/documentation/services-web-api) | US weather alerts |
| [Windy](https://embed.windy.com) | Rain radar embed |

---

## File Structure

```
skies/
├── index.html       ← entire app (HTML + CSS + JS)
├── manifest.json    ← PWA manifest
├── sw.js            ← service worker (offline + push)
├── icon-192.png     ← app icon (generate below)
├── icon-512.png     ← app icon large (generate below)
└── README.md
```

---

## Setup

### Step 1 — Create icons (2 min)

Go to https://favicon.io/favicon-generator/
- Text: `Sk` · Background: Rounded · Color: `#0a0a0f` · Font color: `#ffffff`
- Download → rename `android-chrome-192x192.png` → `icon-192.png` and `android-chrome-512x512.png` → `icon-512.png`
- Drop both into your project folder

### Step 2 — Local development

1. Install [VS Code](https://code.visualstudio.com) + the **Live Server** extension (by Ritwick Dey)
2. Open your project folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500/index.html`

**Install as Mac app:** Chrome will show an install ⊕ icon in the address bar → click to install as a standalone app

### Step 3 — Deploy to Vercel (free, HTTPS, works everywhere)

1. Push your folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project → connect your repo
3. Click Deploy — you get a URL like `https://skies-weather.vercel.app`

Any push to GitHub auto-redeploys in ~30 seconds.

### Step 4 — iPhone home screen

1. Open your Vercel URL in **Safari**
2. Tap **Share → Add to Home Screen**
3. Full-screen app, no browser bar, works offline ✓

---

## Making edits

Edit `index.html` locally → save → Live Server auto-refreshes. When happy, push to GitHub and Vercel deploys automatically.

---

## Push notifications

The app checks for rain every 15 minutes using the browser's Notification API. To enable:
- Tap **Rain Alerts** in the Quick Actions card
- Allow notifications when prompted
- You'll get a notification if rain probability exceeds 60% in the next 3 hours for your default city (Charleston, IL)
- Works in Chrome on desktop; Safari on iOS 16.4+ when installed as a home screen app

---

## Weather alerts

US weather alerts (NWS) load automatically for US cities. No setup needed — alerts appear as colored banners at the top of the screen when active. Colors indicate severity: red = extreme, orange = severe, yellow = moderate, blue = minor.

---

## Tips

- Weather data caches for 10 minutes — tap Refresh to force a fresh fetch
- City list and preferences (unit, dark/light mode) persist in localStorage
- The app works fully offline after first load
- On iOS, notifications only work when the app is installed to the home screen (Add to Home Screen)
