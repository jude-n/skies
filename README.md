# Skies Weather

A beautiful personal weather app for Mac and iPhone. Built with vanilla HTML/CSS/JS, powered entirely by free APIs, deployed to Vercel at zero cost. No backend, no API keys, no accounts.

---

## Features

### Weather Data
- 🌤 Current conditions with animated backgrounds (clear day/night, rain, snow, thunderstorm, fog, overcast)
- 🌡 Both °C and °F always visible — tap either pill to switch the primary display
- 📝 Plain-English daily summary ("Currently overcast at 16°C. Rain likely in about 3 hours.")
- 📅 10-day forecast with gradient temperature range bars
- 📈 7-day high/low temperature graph (line chart)
- 🕐 24-hour hourly forecast with precipitation % and wind speed per hour
- 🌅 Sunrise & sunset times with day-progress bar
- 🌡 Feels like card — shows converted temp, plain-English reason (wind chill, humidity), and a comfort scale

### Extra Cards
- 🌬 Air Quality Index (AQI) with color-coded indicator bar
- 🌙 Moon phase — calculated locally, shows phase name, % illuminated, and days to next full moon
- 📊 Historical context — compares today's forecast to the same date last year
- ⚠️ Live NWS weather alerts (US only) — appear as colored banners by severity
- 🛰 Rain radar map via Windy embed, centered on current city

### Cities & Navigation
- 📍 Default city: Charleston, IL
- ➕ Search and save unlimited cities — persists across sessions and app updates
- ↔️ Swipe left/right between saved cities
- 🗑 Swipe left on a city card to reveal Delete — no Edit mode needed
- 🏙 Other Cities chips at the bottom — tap to jump directly to that city

### Actions
- 📤 Share button — native share sheet on iPhone, clipboard copy on desktop
- 🔔 Rain alert notifications — browser push, checks every 15 min, fires when rain > 60% in next 3 hours
- 🔄 Refresh button — clears cache for current city and refetches immediately
- ⬇️ Pull-to-refresh — drag down from top of any city slide

### App & Display
- 🌙/☀️ Dark and light mode — tap the sun/moon icon, persists across sessions
- 🕐 Last updated timestamp with green/red freshness indicator
- ⬆️ "More details" expandable card — visibility, pressure, wind, humidity, precip, UV
- 📱 PWA — installable on iPhone (Add to Home Screen) and Mac (Chrome install button)
- 📶 Works offline after first load via service worker

---

## File Structure

```
skies/
├── index.html       ← app shell (minimal — just loads CSS + JS)
├── app.js           ← all logic, API calls, UI rendering
├── styles.css       ← all styles and theme tokens
├── manifest.json    ← PWA manifest (name, icons, display mode)
├── sw.js            ← service worker (offline caching + push)
├── icon-192.png     ← app icon 192×192 (generate below)
├── icon-512.png     ← app icon 512×512 (generate below)
└── README.md
```

---

## APIs Used — all free, no key required

| API | Purpose |
|-----|---------|
| [Open-Meteo Forecast](https://open-meteo.com) | Current, hourly, daily weather + AQI |
| [Open-Meteo Archive](https://open-meteo.com/en/docs/historical-weather-api) | Historical climate data for context card |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search |
| [Nominatim (OSM)](https://nominatim.org) | Reverse geocoding for GPS location |
| [NWS api.weather.gov](https://www.weather.gov/documentation/services-web-api) | US weather alerts |
| [Windy embed](https://embed.windy.com) | Rain radar map |

---

## Setup

### Step 1 — Create app icons (2 min)

Go to [favicon.io/favicon-generator](https://favicon.io/favicon-generator/)
- Text: `Sk` · Background: Rounded · Color: `#0a0a0f` · Font color: `#ffffff`
- Download the zip
- Rename `android-chrome-192x192.png` → `icon-192.png`
- Rename `android-chrome-512x512.png` → `icon-512.png`
- Put both in your project folder

### Step 2 — Local development

1. Install [VS Code](https://code.visualstudio.com) + the **Live Server** extension (by Ritwick Dey)
2. Open your project folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500/index.html` — edits auto-refresh on save

**Install as Mac desktop app:** In Chrome, look for the ⊕ install icon in the address bar and click it. Skies appears in your Applications folder and Dock.

### Step 3 — Deploy to Vercel (free, HTTPS, works on iPhone)

1. Push your project folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → import your GitHub repo
3. Click Deploy — you get a permanent URL like `https://skies-weather.vercel.app`

Every push to GitHub auto-redeploys in ~30 seconds.

### Step 4 — Install on iPhone

1. Open your Vercel URL in **Safari**
2. Tap the Share button → **Add to Home Screen** → Add
3. Opens full-screen with no browser bar, works offline ✓

---

## Deploying updates without losing user data

Saved cities, unit preference, and theme are stored in `localStorage` under stable keys (`skies_places`, `skies_unit`, `skies_mode`). These are **never touched by a deploy**.

The weather cache (`skies_cache_v1`) is separate and is safe to clear. To force all users to refetch fresh weather data after a deploy, rename the cache key in `app.js`:

```js
// In app.js, KEYS object at the top:
cache: 'skies_cache_v2',  // bump this version to bust the cache
```

This only clears cached API responses — saved cities are completely unaffected.

---

## How swipe-to-delete works

In the city list, swipe any city card **left** to reveal a red Delete button underneath. Tap Delete to remove it. Swipe right to dismiss. The default city (Charleston) cannot be deleted.

---

## Push notifications

- Tap **Rain Alerts** in the Quick Actions card
- Allow notifications when prompted
- The app checks every 15 minutes and notifies if rain probability exceeds 60% in the next 3 hours for your default city
- On desktop: works in Chrome
- On iPhone: requires iOS 16.4+ and the app must be installed to the home screen (not just open in Safari)

---

## Weather alerts

NWS alerts (US only) load automatically alongside weather data. Active alerts appear as colored banners at the top of the screen — red for extreme, orange for severe, yellow for moderate, blue for minor. No configuration needed.

---

## Tips

- Weather data caches for 10 minutes per city — use the Refresh button or pull down to force a fresh fetch
- Tap either the °C or °F pill to switch which one is displayed large
- The light/dark mode toggle is the sun/moon icon in the top-right corner of each city view, or in the city list settings
- Moon phase is calculated locally with no API call
- Historical context compares to the same date one year ago

