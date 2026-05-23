# ParkClear - AI-Powered Parking Transparency

Mobile-first hackathon project building an AI-powered parking enrichment app.

## Project Overview

**Purpose**: Automatically enrich parking garages with live pricing as users explore the map.

**Target**: Hackathon MVP - working demo, clean code, GitHub-ready.

**Key Values**: Mobile-first UX, clarity over cleverness, demo readiness.

## Core Stack

- **Frontend**: React + TypeScript, Vite, mobile-responsive
- **Maps**: Google Maps Platform + Places API
- **AI**: Gemini Native API (hosted on GMI) with Google Search grounding
- **Orchestration**: RocketRide
- **Parking Data**: OCR for sign scanning, confidence scoring

## Core Features

1. **Interactive Parking Map** - Google Maps center, real-time markers
2. **Automatic Parking Discovery** - Places API auto-detection on map movement
3. **Live Parking Price Enrichment** - Gemini calls with search grounding
4. **Confidence Scoring** - Track verified (from API) vs estimated (Gemini) data
5. **Parking Sign Scanning** - Mobile OCR capture → Gemini enrichment
6. **Real-time Updates** - Marker refresh on user interaction

## Project Structure

```
parkclear/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── Map.tsx       # Google Maps container
│   │   ├── ParkingCard.tsx
│   │   └── OCRScanner.tsx
│   ├── lib/
│   │   ├── maps.ts       # Google Maps utilities
│   │   ├── gemini.ts     # Gemini API client
│   │   ├── rocketride.ts # RocketRide orchestration
│   │   └── types.ts      # Shared types
│   ├── pages/
│   │   └── App.tsx       # Main app page
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

## API Keys & Config

Create `.env.local` with:
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps + Places
- `VITE_GEMINI_API_KEY` - Gemini API endpoint
- `VITE_ROCKETRIDE_ENDPOINT` - RocketRide orchestration

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 in mobile browser or desktop Chrome DevTools responsive mode.

## Quick Start

1. User opens app → sees their location on map
2. Drag/zoom map → triggers Places API to find nearby parking
3. Tap parking marker → card shows name + estimated pricing from Gemini
4. Tap "Scan Sign" → camera OCR → Gemini enrichment with confidence score
5. Marker updates in real-time

## Notes for Hackathon

- Focus: **working mobile UX over polish**
- Don't over-engineer infrastructure — simple backend calls are fine
- Gemini + search grounding for pricing is the MVP differentiator
- GitHub should show clean commit history and working feature
- Confidence scoring (verified vs estimated) is key UX signal
