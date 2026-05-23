export type PricingState = 'verified' | 'estimated' | 'needs_scan' | 'unknown' | 'loading'

export interface ParkingGarage {
  id: string
  place_id: string
  name: string
  address: string
  lat: number
  lng: number
  is_open: boolean
  price?: string
  hourly_rate?: number
  daily_rate?: number
  monthly_rate?: number
  pricingState: PricingState
  confidence_score?: number
  hours?: OpeningHours
  lastUpdated?: number
  operator?: string
}

export interface OpeningHours {
  weekday_text?: string[]
  periods?: Array<{
    open: { day: number; time: string }
    close: { day: number; time: string }
  }>
}

export interface PriceReport {
  id: string
  garage_id: string
  price: number
  time_reported: number
  user_id?: string
  verified: boolean
}

export interface GeminiResponse {
  price?: string
  confidence: number
  hourly?: number
  daily?: number
  monthly?: number
  operator?: string
  source?: string
}

export interface AssistantMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface MapBounds {
  ne: { lat: number; lng: number }
  sw: { lat: number; lng: number }
}
