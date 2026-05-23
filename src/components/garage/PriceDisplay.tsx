import type { ParkingGarage } from '../../lib/types'

interface PriceDisplayProps {
  garage: ParkingGarage
}

export default function PriceDisplay({ garage }: PriceDisplayProps) {
  if (garage.pricingState === 'loading') {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    )
  }

  if (garage.pricingState === 'unknown') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">No pricing data available</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
      <div className="space-y-2">
        {garage.hourly_rate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Hourly</span>
            <span className="font-bold text-lg text-gray-900">${garage.hourly_rate}</span>
          </div>
        )}
        {garage.daily_rate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Daily</span>
            <span className="font-bold text-lg text-gray-900">${garage.daily_rate}</span>
          </div>
        )}
        {garage.monthly_rate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Monthly</span>
            <span className="font-bold text-lg text-gray-900">${garage.monthly_rate}</span>
          </div>
        )}
        {garage.operator && (
          <div className="pt-2 border-t border-blue-200">
            <p className="text-xs text-gray-600">Operated by {garage.operator}</p>
          </div>
        )}
        {garage.confidence_score && (
          <div className="text-xs text-gray-600 pt-1">
            Confidence: {Math.round(garage.confidence_score)}%
          </div>
        )}
      </div>
    </div>
  )
}
