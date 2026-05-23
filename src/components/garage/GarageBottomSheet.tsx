import type { ParkingGarage } from '../../lib/types'
import PriceDisplay from './PriceDisplay'
import HoursPanel from './HoursPanel'
import ScanSignFlow from '../scan/ScanSignFlow'
import ReportPriceSheet from '../report/ReportPriceSheet'
import { useState } from 'react'

interface GarageBottomSheetProps {
  garageId: string
  garages: ParkingGarage[]
  onClose: () => void
}

export default function GarageBottomSheet({ garageId, garages, onClose }: GarageBottomSheetProps) {
  const garage = garages.find((g) => g.id === garageId)
  const [showScanner, setShowScanner] = useState(false)
  const [showReport, setShowReport] = useState(false)

  if (!garage) return null

  const confidenceColor = {
    verified: 'text-green-600',
    estimated: 'text-amber-600',
    needs_scan: 'text-red-600',
    unknown: 'text-gray-600',
    loading: 'text-blue-600',
  }[garage.pricingState]

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-40 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{garage.name}</h2>
              <p className="text-sm text-gray-600">{garage.address}</p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {garage.is_open ? '🟢 Open' : '🔴 Closed'}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${confidenceColor}`}>
              {garage.pricingState === 'verified' && '✓ Verified'}
              {garage.pricingState === 'estimated' && '~ Estimated'}
              {garage.pricingState === 'needs_scan' && '📷 Scan to verify'}
              {garage.pricingState === 'unknown' && 'No data'}
              {garage.pricingState === 'loading' && 'Loading...'}
            </span>
          </div>

          {/* Pricing */}
          <PriceDisplay garage={garage} />

          {/* Hours */}
          {garage.hours && <HoursPanel hours={garage.hours} />}

          {/* Actions */}
          <div className="pt-2 space-y-2">
            {garage.pricingState === 'needs_scan' && (
              <button
                onClick={() => setShowScanner(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                📷 Scan Sign to Verify
              </button>
            )}
            <button
              onClick={() => setShowReport(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 rounded-lg transition"
            >
              ✏️ Report Price
            </button>
          </div>
        </div>
      </div>

      {showScanner && <ScanSignFlow onClose={() => setShowScanner(false)} garage={garage} />}
      {showReport && <ReportPriceSheet garage={garage} onClose={() => setShowReport(false)} />}
    </>
  )
}
