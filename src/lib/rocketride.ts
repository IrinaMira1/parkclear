import type { ParkingGarage } from './types'

const ROCKETRIDE_URI = 'http://localhost:51959/dropper'
const ROCKETRIDE_AUTH = 'pk_c3f51c78a99d8bc70bc60d346f2f4d84'

export class RocketRideClient {
  private token: string | null = null

  async initialize(pipelineFile: string = 'pipeline.pipe'): Promise<void> {
    try {
      const initResponse = await fetch(`${ROCKETRIDE_URI}?auth=${ROCKETRIDE_AUTH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filepath: pipelineFile }),
      })

      const result = await initResponse.json()
      this.token = result.token
      console.log('RocketRide pipeline initialized:', this.token)
    } catch (error) {
      console.error('Failed to initialize RocketRide:', error)
      throw error
    }
  }

  async enrichParking(
    lat: number,
    lng: number,
    radius: number = 2000
  ): Promise<ParkingGarage[]> {
    if (!this.token) {
      await this.initialize()
    }

    try {
      const response = await fetch(`${ROCKETRIDE_URI}?auth=${ROCKETRIDE_AUTH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.token,
          input: {
            lat,
            lng,
            radius,
          },
        }),
      })

      const result = await response.json()

      if (result.status === 'success') {
        return result.output.garages as ParkingGarage[]
      } else {
        console.error('Pipeline execution failed:', result)
        throw new Error('RocketRide pipeline failed')
      }
    } catch (error) {
      console.error('Error executing RocketRide pipeline:', error)
      throw error
    }
  }

  async terminate(): Promise<void> {
    if (this.token) {
      try {
        await fetch(`${ROCKETRIDE_URI}?auth=${ROCKETRIDE_AUTH}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: this.token }),
        })
      } catch (error) {
        console.error('Error terminating RocketRide:', error)
      }
    }
  }
}

export const rocketride = new RocketRideClient()
