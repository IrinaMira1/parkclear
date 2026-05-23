import { useRef, useState } from 'react'
import type { ParkingGarage } from '../../lib/types'
import { scanParkingSign } from '../../lib/api'

interface ScanSignFlowProps {
  onClose: () => void
  garage: ParkingGarage
}

export default function ScanSignFlow({ onClose, garage }: ScanSignFlowProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(true)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Camera access denied:', error)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        setCameraActive(false)
        processImage(imageData)
      }
    }
  }

  const processImage = async (imageData: string) => {
    setScanning(true)
    try {
      const priceData = await scanParkingSign(imageData)
      setResult(priceData)
    } catch (error) {
      console.error('Error scanning sign:', error)
      setResult({ error: 'Failed to scan image' })
    } finally {
      setScanning(false)
    }
  }

  const retake = () => {
    setCapturedImage(null)
    setCameraActive(true)
    setResult(null)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-96 overflow-hidden flex flex-col">
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">Scan Parking Sign</h3>
            <button onClick={onClose} className="text-2xl leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cameraActive ? (
              <div className="space-y-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full bg-black rounded-lg"
                  onLoadedMetadata={startCamera}
                />
                <canvas ref={canvasRef} hidden />
                <button
                  onClick={captureImage}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  📸 Capture
                </button>
              </div>
            ) : capturedImage ? (
              <div className="space-y-3">
                <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
                {scanning ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin text-2xl">⏳</div>
                    <p className="text-sm text-gray-600 mt-2">Analyzing sign...</p>
                  </div>
                ) : result ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-semibold text-green-900">{result.price || 'No price found'}</p>
                    <p className="text-xs text-green-700 mt-1">
                      Confidence: {Math.round((result.confidence || 0) * 100)}%
                    </p>
                    {result.details && (
                      <p className="text-xs text-gray-600 mt-2">{result.details}</p>
                    )}
                  </div>
                ) : null}
                <button
                  onClick={retake}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition"
                >
                  🔄 Retake
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
