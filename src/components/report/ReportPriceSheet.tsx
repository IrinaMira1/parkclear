import { useState } from 'react'
import type { ParkingGarage } from '../../lib/types'

interface ReportPriceSheetProps {
  garage: ParkingGarage
  onClose: () => void
}

export default function ReportPriceSheet({ garage, onClose }: ReportPriceSheetProps) {
  const [price, setPrice] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to your backend
    console.log(`Reported price $${price} for ${garage.name}`)
    setSubmitted(true)
    setTimeout(onClose, 2000)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Report Current Price</h3>
          <button onClick={onClose} className="text-2xl leading-none text-gray-400">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {garage.name}
            </label>
            <p className="text-xs text-gray-600">{garage.address}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 3.50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-900 px-3 py-2 rounded-lg text-sm">
              ✓ Thank you! Your report helps improve pricing accuracy.
            </div>
          )}

          {!submitted && (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Submit Report
            </button>
          )}
        </form>
      </div>
    </>
  )
}
