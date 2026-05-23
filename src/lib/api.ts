import type { ParkingGarage, GeminiResponse } from './types'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const GMI_API_KEY = import.meta.env.VITE_GMI_API_KEY
const GMI_BASE_URL =
  import.meta.env.VITE_GMI_BASE_URL || 'https://api.gmi-serving.com'

export async function getNearbyParking(
  lat: number,
  lng: number,
  radius = 2000
): Promise<ParkingGarage[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
  url.searchParams.set('location', `${lat},${lng}`)
  url.searchParams.set('radius', radius.toString())
  url.searchParams.set('type', 'parking')
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY)

  const response = await fetch(url)
  const data = await response.json()

  if (data.results) {
    return data.results.map((place: any) => ({
      id: place.place_id,
      place_id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      is_open: place.opening_hours?.open_now ?? true,
      pricingState: 'loading' as const,
      lastUpdated: Date.now(),
    }))
  }

  return []
}

export async function getParkingPrice(
  garage: ParkingGarage
): Promise<GeminiResponse> {
  const prompt = `Look up the current hourly parking rate for "${garage.name}" located at "${garage.address}" in San Francisco. Search for operator websites (LAZ Parking, SP+, Impark), SpotHero, ParkWhiz, and parking reviews. Return ONLY a JSON object with these exact fields:
{
  "price": "hourly rate as string (e.g. '$3.50')",
  "confidence": number 0-100 (how confident you are this is current),
  "hourly": number or null,
  "daily": number or null,
  "monthly": number or null,
  "operator": "parking company name or null",
  "source": "where you found this info"
}`

  try {
    const response = await fetch(`${GMI_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GMI_API_KEY,
      },
      body: JSON.stringify({
        model: 'gemini-1.5-flash',
        max_tokens: 500,
        system: 'You are a parking price researcher. Return ONLY valid JSON.',
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
            description: 'Search the web for parking information',
          },
        ],
      }),
    })

    const data = await response.json()

    if (data.content?.[0]?.text) {
      try {
        const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.error('Failed to parse Gemini response:', e)
      }
    }

    return { confidence: 0 }
  } catch (error) {
    console.error('Error fetching pricing:', error)
    return { confidence: 0 }
  }
}

export async function scanParkingSign(imageData: string): Promise<GeminiResponse> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Extract the parking rate information from this sign image. Return ONLY a JSON object with: {"price": "...", "confidence": 0-100, "details": "..."}',
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageData.replace(/^data:image\/\w+;base64,/, ''),
                  },
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 300,
          },
        }),
      }
    )

    const data = await response.json()

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      try {
        const jsonMatch = data.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.error('Failed to parse sign scan response:', e)
      }
    }

    return { confidence: 0 }
  } catch (error) {
    console.error('Error scanning sign:', error)
    return { confidence: 0 }
  }
}
