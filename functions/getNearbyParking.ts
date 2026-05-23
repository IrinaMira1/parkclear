// Base44 Edge Function: getNearbyParking
// Discovers nearby parking garages using Google Places API

import { defineFunction } from '@base44/sdk'

export const getNearbyParking = defineFunction(async (req: Request) => {
  const { lat, lng, radius = 2000 } = await req.json()

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
  url.searchParams.set('location', `${lat},${lng}`)
  url.searchParams.set('radius', radius.toString())
  url.searchParams.set('type', 'parking')
  url.searchParams.set('key', apiKey)

  const response = await fetch(url)
  const data = await response.json()

  return Response.json(data)
})
