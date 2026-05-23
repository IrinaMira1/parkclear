import { useEffect, useRef, useState } from 'react'
import ParkingMap from '../components/map/ParkingMap'
import GarageBottomSheet from '../components/garage/GarageBottomSheet'
import AssistantSheet from '../components/assistant/AssistantSheet'
import useParkingPrices from '../hooks/useParkingPrices'

export default function MapPage() {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [selectedGarageId, setSelectedGarageId] = useState<string | null>(null)
  const [showAssistant, setShowAssistant] = useState(false)

  const { parkingGarages, loading } = useParkingPrices(mapRef)

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Google Map */}
      <ParkingMap
        ref={mapRef}
        garages={parkingGarages}
        onGarageSelect={setSelectedGarageId}
      />

      {/* Floating Assistant Button */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="absolute bottom-24 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-20 transition-all"
        aria-label="Open AI assistant"
        title="Ask ParkClear AI for parking recommendations"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Garage Bottom Sheet */}
      {selectedGarageId && (
        <GarageBottomSheet
          garageId={selectedGarageId}
          garages={parkingGarages}
          onClose={() => setSelectedGarageId(null)}
        />
      )}

      {/* AI Assistant Sheet */}
      {showAssistant && (
        <AssistantSheet onClose={() => setShowAssistant(false)} />
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 z-10">
          <span className="animate-spin">⏳</span>
          <span className="text-sm text-gray-700 font-medium">Discovering parking...</span>
        </div>
      )}
    </div>
  )
}
