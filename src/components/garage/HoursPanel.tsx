import type { OpeningHours } from '../../lib/types'

interface HoursPanelProps {
  hours: OpeningHours
}

export default function HoursPanel({ hours }: HoursPanelProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h3 className="font-semibold text-sm text-gray-900 mb-2">Hours</h3>
      <div className="space-y-1">
        {hours.weekday_text?.map((day, idx) => (
          <p key={idx} className="text-xs text-gray-700">
            {day}
          </p>
        ))}
      </div>
    </div>
  )
}
