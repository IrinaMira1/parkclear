import { useState, useEffect, useCallback, useRef } from 'react'
import type { ParkingGarage } from '../lib/types'
import { rocketride } from '../lib/rocketride'

export default function useParkingPricesRocketRide(
  mapRef: React.RefObject<google.maps.Map>
) {
  const [parkingGarages, setParkingGarages] = useState<ParkingGarage[]>([])
  const [loading, setLoading] = useState(false)
  const initialized = useRef(false)

  // Initialize RocketRide on mount
  useEffect(() => {
    if (!initialized.current) {
      rocketride.initialize().then(() => {
        initialized.current = true
      })
    }

    return () => {
      // Cleanup on unmount
      rocketride.terminate()
    }
  }, [])

  const fetchNearbyParking = useCallback(async () => {
    if (!mapRef.current || !initialized.current) return

    setLoading(true)
    try {
      const center = mapRef.current.getCenter()
      if (!center) return

      // Execute RocketRide pipeline
      const garages = await rocketride.enrichParking(
        center.lat(),
        center.lng(),
        2000
      )

      setParkingGarages(garages)
    } catch (error) {
      console.error('Error fetching parking:', error)
    } finally {
      setLoading(false)
    }
  }, [mapRef])

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
