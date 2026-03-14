# Hardly Iron — Clan Rank Calculator

## What this is

A React + Vite single-page app that calculates clan ranks for the "Hardly Iron" Old School RuneScape ironman clan. Players enter their RSN (RuneScape Name) and the app auto-discovers data from APIs, calculates points across categories, and shows their current rank + progress to the next one.

Deployed to **Cloudflare Pages** at https://hi-clan-ranks.pages.dev. GitHub repo: https://github.com/LexOsrs/hi-clan-ranks

## Tech stack

- **React 19** + **Vite 8** (SPA, no SSR)
- **framer-motion** for animations, **lucide-react** for icons
- **Puppeteer** for generating the infographic PNG (`scripts/screenshot.mjs`)
- **Cloudflare Pages Functions** for API proxying in production
- Font: EB Garamond

## Data sources

- **Wise Old Man API v2** (`https://api.wiseoldman.net/v2`): player stats (total level, EHP, EHB), collection log count, group membership (clan join date). Group ID: **1169**
- **RuneProfile API** (`https://api.runeprofile.com`): quests, achievement diary tiers, combat achievement tiers, bank items (for PvM item detection)
- RuneProfile is proxied through `/api/runeprofile/` to avoid CORS — via Vite dev proxy and Cloudflare Pages Function (`functions/api/runeprofile/profiles/[[catchall]].js`)

## Project structure

```
src/
  App.jsx / App.css          — Main app shell (search bar, layout, footer)
  index.css                  — Global styles, CSS variables, dark OSRS theme
  main.jsx                   — React entry point
  data/
    constants.js             — Rank definitions, quest bonuses, diary/CA tiers,
                               PvM items (with RuneProfile search names), total
                               level thresholds, clog tiers, clan tenure milestones
    questPoints.js           — Complete quest name → QP mapping (~160 quests)
  hooks/
    useClanData.js           — Core data hook: API fetching, item state building,
                               localStorage persistence, manual override merging
  components/
    RankBadges.jsx           — Horizontal rank badge bar with clan icons
    RankSummary.jsx          — Summary card: current rank, points, stats, progress bar
    CategorySection.jsx      — Collapsible category with item rows (checkbox/numeric)
    EventInput.jsx           — Manual event counter (+/-)
functions/
  api/runeprofile/profiles/[[catchall]].js  — CF Pages proxy for RuneProfile API
public/
  ranks/Clan_*.png           — Official OSRS clan rank icons from wiki (13x13px)
  clan-logo.webp             — Clan logo
  infographic.html           — Standalone points guide page (3-column layout)
  infographic.png            — Screenshot of above for Discord sharing
scripts/
  screenshot.mjs             — Puppeteer: screenshots infographic.html at 1920px @2x
```

## Key concepts

### Points categories
Five categories: **quests**, **diaries**, **pvm**, **skilling**, **misc**. Each item is either boolean (checkbox) or numeric (input). Points are summed to determine rank.

### Ranks
Defined in `constants.js`. From Helper (0 pts) up to Wrath (12,500 pts + 5 events). Higher ranks require both points AND event participation.

### localStorage persistence
- Saves username, event count, and manual overrides
- On reload, re-fetches API data and merges: API value wins unless user manually set a higher value
- When API catches up to a manual override, the override is pruned

### PvM item detection
Items matched by searching RuneProfile bank items for specific names (exact string match). Some items require all search terms to match (`matchAll: true`, e.g. ToA Remnants). Imbued god cape has a quest fallback.

### Combat Achievements
CA points are 1:1 up to 2,630. Tier completion is based on cumulative point thresholds (Easy ≥ 41, Medium ≥ 161, etc.), NOT task counts.

### Infographic
`public/infographic.html` is a standalone page. Run `node scripts/screenshot.mjs` to regenerate the PNG (requires dev server running on port 5174).

## Commands

```bash
npm run dev          # Start dev server (port 5174)
npm run build        # Production build to dist/
node scripts/screenshot.mjs   # Regenerate infographic.png (needs dev server running)
```

## Style

- Dark OSRS theme: dark brown background, gold (#ff981f) accents
- CSS variables defined in `index.css`
- Rank icons use `image-rendering: pixelated` since they're tiny pixel art
- Partial progress = gold, maxed = green
