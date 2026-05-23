import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { scanParkingSign } from '../../lib/api';
export default function ScanSignFlow({ onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(true);
    const [capturedImage, setCapturedImage] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }
        catch (error) {
            console.error('Camera access denied:', error);
        }
    };
    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0);
                const imageData = canvasRef.current.toDataURL('image/jpeg');
                setCapturedImage(imageData);
                setCameraActive(false);
                processImage(imageData);
            }
        }
    };
    const processImage = async (imageData) => {
        setScanning(true);
        try {
            const priceData = await scanParkingSign(imageData);
            setResult(priceData);
        }
        catch (error) {
            console.error('Error scanning sign:', error);
            setResult({ error: 'Failed to scan image' });
        }
        finally {
            setScanning(false);
        }
    };
    const retake = () => {
        setCapturedImage(null);
        setCameraActive(true);
        setResult(null);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/50 z-40", onClick: onClose }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-2xl w-full max-w-md mx-4 max-h-96 overflow-hidden flex flex-col", children: [_jsxs("div", { className: "bg-gray-900 text-white p-4 flex justify-between items-center", children: [_jsx("h3", { className: "font-bold", children: "Scan Parking Sign" }), _jsx("button", { onClick: onClose, className: "text-2xl leading-none", children: "\u00D7" })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4", children: cameraActive ? (_jsxs("div", { className: "space-y-3", children: [_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, className: "w-full bg-black rounded-lg", onLoadedMetadata: startCamera }), _jsx("canvas", { ref: canvasRef, hidden: true }), _jsx("button", { onClick: captureImage, className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition", children: "\uD83D\uDCF8 Capture" })] })) : capturedImage ? (_jsxs("div", { className: "space-y-3", children: [_jsx("img", { src: capturedImage, alt: "Captured", className: "w-full rounded-lg" }), scanning ? (_jsxs("div", { className: "text-center py-4", children: [_jsx("div", { className: "inline-block animate-spin text-2xl", children: "\u23F3" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Analyzing sign..." })] })) : result ? (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-3", children: [_jsx("p", { className: "font-semibold text-green-900", children: result.price || 'No price found' }), _jsxs("p", { className: "text-xs text-green-700 mt-1", children: ["Confidence: ", Math.round((result.confidence || 0) * 100), "%"] }), result.details && (_jsx("p", { className: "text-xs text-gray-600 mt-2", children: result.details }))] })) : null, _jsx("button", { onClick: retake, className: "w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition", children: "\uD83D\uDD04 Retake" })] })) : null })] }) })] }));
}
