import { useEffect, useRef, forwardRef } from 'react'
import type { ParkingGarage } from '../../lib/types'

interface ParkingMapProps {
  garages: ParkingGarage[]
  onGarageSelect: (id: string) => void
}

const ParkingMap = forwardRef<google.maps.Map, ParkingMapProps>(
  ({ garages, onGarageSelect }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map())

    // Initialize map
    useEffect(() => {
      if (!containerRef.current) return

      const map = new google.maps.Map(containerRef.current, {
        zoom: 14,
        center: { lat: 37.7749, lng: -122.4194 },
        mapId: 'parkclear-map',
        streetViewControl: false,
        fullscreenControl: true,
      })

      ;(ref as any).current = map

      // Get user location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          map.setCenter(userLocation)

          new google.maps.marker.AdvancedMarkerElement({
            map,
            position: userLocation,
            title: 'Your location',
            content: createUserMarker(),
          })
        },
        () => {
          console.log('Geolocation not available, using SF default')
        }
      )
    }, [ref])

    // Update markers when garages change
    useEffect(() => {
      if (!(ref as any).current) return

      const map = (ref as any).current

      // Clear markers not in current list
      markersRef.current.forEach((marker, id) => {
        if (!garages.find((g) => g.id === id)) {
          marker.map = null
          markersRef.current.delete(id)
        }
      })

      // Add or update markers
      garages.forEach((garage) => {
        let marker = markersRef.current.get(garage.id)

        if (!marker) {
          const color = getMarkerColor(garage.pricingState)
          marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: garage.lat, lng: garage.lng },
            title: garage.name,
            content: createMarkerContent(color, garage.price),
          })

          marker.addEventListener('click', () => {
            onGarageSelect(garage.id)
          })

          markersRef.current.set(garage.id, marker)
        } else {
          // Update existing marker content if price changed
          const color = getMarkerColor(garage.pricingState)
          marker.content = createMarkerContent(color, garage.price)
        }
      })
    }, [garages, ref, onGarageSelect])

    return <div ref={containerRef} className="w-full h-full" />
  }
)

ParkingMap.displayName = 'ParkingMap'

function getMarkerColor(state: string): string {
  switch (state) {
    case 'verified':
      return '#22c55e'
    case 'estimated':
      return '#eab308'
    case 'needs_scan':
      return '#ef4444'
    case 'loading':
      return '#3b82f6'
    default:
      return '#9ca3af'
  }
}

function createMarkerContent(color: string, price?: string): HTMLElement {
  const div = document.createElement('div')
  div.className = 'flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-lg'
  div.style.backgroundColor = color
  div.style.border = '2px solid white'
  div.textContent = price ? price.replace('$', '') : '?'
  return div
}

function createUserMarker(): HTMLElement {
  const div = document.createElement('div')
  div.className = 'flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow-lg'
  div.innerHTML = '📍'
  return div
}

export default ParkingMap
