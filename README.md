# ParkClear — Real-time Parking Intelligence for San Francisco

An AI-powered parking discovery and pricing app that helps you find the best parking in SF with live pricing enrichment via Gemini + Google Search grounding.

## 🎯 Project Overview

- **Maps Interface**: Google Maps with custom parking garage markers
- **Live Discovery**: Google Places API auto-detection as you pan/zoom
- **AI Pricing**: GMI Cloud (Gemini + search grounding) enriches garages with current rates
- **Confidence Scoring**: Verified (≥70) vs estimated (≥35) vs needs scan (<35)
- **Sign Scanning**: Mobile OCR capture of parking signs for AI enrichment
- **AI Assistant**: Context-aware parking recommendations with time-aware logic
- **Community Reports**: Users can report/verify pricing updates

---

## 🏗️ Architecture

### Frontend (React + Vite + Tailwind)
```
src/
├── pages/
│   └── MapPage.tsx          — Main orchestrator
├── hooks/
│   └── useParkingPrices.ts  — 3-layer data pipeline
├── components/
│   ├── map/
│   │   └── ParkingMap.tsx   — Google Maps + OverlayView markers
│   ├── garage/
│   │   ├── GarageBottomSheet.tsx
│   │   ├── HoursPanel.tsx
│   │   ├── PriceDisplay.tsx
│   │   └── ParkingSignImage.tsx
│   ├── assistant/
│   │   ├── AssistantSheet.tsx — AI chat interface
│   │   └── RecommendedGarageCard.tsx
│   ├── scan/
│   │   └── ScanSignFlow.tsx — Photo extraction & OCR
│   ├── report/
│   │   └── ReportPriceSheet.tsx — Community pricing
│   └── search/
│       └── SearchOverlay.tsx — Garage search
├── lib/
│   ├── types.ts             — Shared types
│   ├── api.ts               — Base44 API calls
│   └── gemini.ts            — Gemini client
└── main.tsx
```

### Backend (Base44 Edge Functions)
```
functions/
├── getNearbyParking.ts      — Layer 1: Google Places discovery
└── getParkingPrice.ts       — Layers 2+3: Pricing + confidence
```

### Database (Base44)
```
ParkingGarage                — Master records (hours, pricing, location)
PriceReport                  — Community submissions (price corrections)
```

---

## 🔄 Data Pipeline (3 Layers)

### Layer 1 — Discovery
- **Trigger**: Map `idle` event (user pans/zooms)
- **API**: Google Places Nearby Search → `type=parking`
- **Output**: `place_id`, `name`, `address`, `lat/lng`, `is_open`

### Layer 2 — Pricing Enrichment
- **API**: GMI Cloud (`api.gmi-serving.com`) — Gemini Flash + `google_search` tool
- **Search targets**: LAZ, SP+, Impark operator pages, SpotHero, ParkWhiz, reviews
- **Rate limit**: 4s between calls (Gemini free-tier quota)
- **Caching**: Session-level `pricingCache` Map (no duplicate calls per session)

### Layer 3 — Confidence Scoring
- **Source**: Gemini confidence score (0–100)
- **States**:
  - `verified` (≥70) → 🟢 green marker
  - `estimated` (≥35) → 🟡 amber marker  
  - `needs_scan` (<35) → 🔴 red marker (prompt user for photo)
  - `unknown` → ⚪ no price found
  - `loading` → ⏳ awaiting response

---

## 🔑 APIs & Environment Variables

| API | Purpose | Env Var |
|-----|---------|---------|
| Google Maps JS | Map rendering, custom markers | `VITE_GOOGLE_MAPS_API_KEY` |
| Google Places Nearby | Parking discovery | `VITE_GOOGLE_MAPS_API_KEY` |
| GMI Cloud (Gemini Flash) | Pricing enrichment w/ web grounding | `VITE_GMI_API_KEY` |
| Gemini API (direct) | Fallback & sign scanning | `VITE_GEMINI_API_KEY` |
| Base44 SDK | Auth, database, edge functions | auto-injected |

### Environment Setup

1. Copy `.env.example` → `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your keys:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   VITE_GMI_API_KEY=your_gmi_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. For Base44 backend: Add the same vars in Base44 Dashboard → Settings → Environment Variables

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```
Open http://localhost:5173 in your browser (use Chrome DevTools for mobile view).

### Backend Setup (Base44)
1. Push `functions/` to Base44
2. Configure environment variables in Base44 Dashboard
3. Test endpoints via Postman or `curl`

### Deploy
```bash
npm run build
# Deploy via Base44 or your chosen hosting
```

---

## 🤖 Key Implementation Details

### Pricing Logic
- All pricing enrichment prompts live in `functions/getParkingPrice.ts`
- Tune Gemini's search behavior via the prompt in that function

### Confidence Threshold
- Verify vs estimated cutoff: `hooks/useParkingPrices.ts` → `resolvePricingState()`
- Adjust the 70/35 thresholds here

### AI Assistant Prompt
- Location: `components/assistant/AssistantSheet.tsx` → `handleSend()`
- Edit for time-aware, context-sensitive recommendations

### Parking Hours & Early Bird Logic
- Location: `components/garage/HoursPanel.tsx`
- Handles open/closed state and dynamic hour display

### Data Schema
- Source of truth: `ParkingGarage` entity in Base44
- All fields (hours, pricing, rates) stored here

---

## 📝 Notes for Development

- All pricing logic is self-contained — easy to iterate on Gemini prompts
- Confidence scoring is the key UX differentiator (verified/estimated/needs_scan)
- Mobile-first design: test continuously in responsive mode
- Community reporting is opt-in but critical for long-term accuracy
- Rate limiting is built in to respect free-tier quotas

---

## 🎯 MVP Checklist

- [ ] Map loads with user location
- [ ] Places API discovers nearby parking
- [ ] Markers render with color coding (verified/estimated/needs_scan)
- [ ] Tap marker shows garage details + pricing
- [ ] Sign scanning captures and enriches data
- [ ] AI assistant answers parking questions
- [ ] Community price reporting works
- [ ] Mobile responsive on iPhone 12+

---

## 📄 License

MIT — feel free to fork and adapt for other cities!
