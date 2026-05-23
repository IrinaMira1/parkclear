// Base44 Edge Function: getParkingPrice
// Enriches parking garage with pricing via GMI Cloud (Gemini + Google Search)

import { defineFunction } from '@base44/sdk'

export const getParkingPrice = defineFunction(async (req: Request) => {
  const { name, address } = await req.json()

  const gmiKey = process.env.GMI_API_KEY
  const gmiBaseUrl = process.env.GMI_BASE_URL || 'https://api.gmi-serving.com'

  const prompt = `Look up the current hourly parking rate for "${name}" located at "${address}" in San Francisco.

  Search for:
  - Operator websites (LAZ Parking, SP+, Impark)
  - SpotHero
  - ParkWhiz
  - Google Maps reviews
  - Local parking rate websites

  Return ONLY a JSON object with these exact fields (no markdown):
  {
    "price": "hourly rate as string (e.g. '$3.50')",
    "confidence": number 0-100 (how confident this is current),
    "hourly": number or null,
    "daily": number or null,
    "monthly": number or null,
    "operator": "parking company name or null",
    "source": "where you found this info"
  }`

  try {
    const response = await fetch(`${gmiBaseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': gmiKey,
      },
      body: JSON.stringify({
        model: 'gemini-1.5-flash',
        max_tokens: 500,
        system: 'You are a parking price researcher. Return ONLY valid JSON, no markdown.',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        tools: [
          {
            type: 'google_search',
            name: 'google_search',
            description: 'Search the web for parking rate information',
          },
        ],
      }),
    })

    const data = await response.json()

    if (data.content?.[0]?.text) {
      try {
        const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return Response.json(parsed)
        }
      } catch (e) {
        console.error('Parse error:', e)
      }
    }

    return Response.json({ confidence: 0 })
  } catch (error) {
    console.error('GMI API error:', error)
    return Response.json({ confidence: 0, error: error.message }, { status: 500 })
  }
})
