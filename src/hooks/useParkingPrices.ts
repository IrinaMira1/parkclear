import { useState, useEffect, useCallback, useRef } from 'react'
import type { ParkingGarage, MapBounds, PricingState } from '../lib/types'
import { getNearbyParking, getParkingPrice } from '../lib/api'

const RATE_LIMIT_MS = 4000
const PRICE_CACHE_TTL = 3600000

export default function useParkingPrices(mapRef: React.RefObject<google.maps.Map>) {
  const [parkingGarages, setParkingGarages] = useState<ParkingGarage[]>([])
  const [loading, setLoading] = useState(false)
  const pricingCacheRef = useRef<Map<string, { data: any; time: number }>>(new Map())
  const lastFetchRef = useRef<number>(0)

  const resolvePricingState = (confidenceScore?: number): PricingState => {
    if (confidenceScore === undefined) return 'loading'
    if (confidenceScore >= 70) return 'verified'
    if (confidenceScore >= 35) return 'estimated'
    if (confidenceScore > 0) return 'needs_scan'
    return 'unknown'
  }

  const enrichGarageWithPricing = useCallback(async (garage: ParkingGarage) => {
    const cache = pricingCacheRef.current
    const cacheKey = garage.place_id

    // Check cache
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!
      if (Date.now() - cached.time < PRICE_CACHE_TTL) {
        const { price, confidence } = cached.data
        return {
          ...garage,
          price,
          confidence_score: confidence,
          pricingState: resolvePricingState(confidence),
        }
      }
    }

    // Rate limit
    const now = Date.now()
    if (now - lastFetchRef.current < RATE_LIMIT_MS) {
      await new Promise((resolve) =>
        setTimeout(resolve, RATE_LIMIT_MS - (now - lastFetchRef.current))
      )
    }
    lastFetchRef.current = Date.now()

    try {
      const priceData = await getParkingPrice(garage)

      cache.set(cacheKey, {
        data: priceData,
        time: Date.now(),
      })

      return {
        ...garage,
        price: priceData.price,
        hourly_rate: priceData.hourly,
        daily_rate: priceData.daily,
        monthly_rate: priceData.monthly,
        operator: priceData.operator,
        confidence_score: priceData.confidence,
        pricingState: resolvePricingState(priceData.confidence),
      }
    } catch (error) {
      console.error('Error enriching garage:', error)
      return {
        ...garage,
        pricingState: 'unknown' as const,
      }
    }
  }, [])

  const fetchNearbyParking = useCallback(async () => {
    if (!mapRef.current) return

    setLoading(true)
    try {
      const center = mapRef.current.getCenter()
      if (!center) return

      const garages = await getNearbyParking(center.lat(), center.lng())

      // Enrich with pricing sequentially to respect rate limits
      const enriched = []
      for (const garage of garages) {
        const enrichedGarage = await enrichGarageWithPricing(garage)
        enriched.push(enrichedGarage)
      }

      setParkingGarages(enriched)
    } catch (error) {
      console.error('Error fetching parking:', error)
    } finally {
      setLoading(false)
    }
  }, [mapRef, enrichGarageWithPricing])

  useEffect(() => {
    if (!mapRef.current) return

    // Initial fetch
    fetchNearbyParking()

    // Listen for map idle (pan/zoom complete)
    const idleListener = mapRef.current.addListener('idle', () => {
      fetchNearbyParking()
    })

    return () => {
      google.maps.event.removeListener(idleListener)
    }
  }, [mapRef, fetchNearbyParking])

  return {
    parkingGarages,
    loading,
    refetch: fetchNearbyParking,
  }
}
