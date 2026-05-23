import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import ParkingMap from '../components/map/ParkingMap';
import GarageBottomSheet from '../components/garage/GarageBottomSheet';
import AssistantSheet from '../components/assistant/AssistantSheet';
import useParkingPrices from '../hooks/useParkingPrices';
export default function MapPage() {
    const mapRef = useRef(null);
    const [selectedGarageId, setSelectedGarageId] = useState(null);
    const [showAssistant, setShowAssistant] = useState(false);
    const { parkingGarages, loading } = useParkingPrices(mapRef);
    return (_jsxs("div", { className: "w-full h-screen flex flex-col bg-gray-100", children: [_jsx(ParkingMap, { ref: mapRef, garages: parkingGarages, onGarageSelect: setSelectedGarageId }), _jsx("button", { onClick: () => setShowAssistant(!showAssistant), className: "absolute bottom-24 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-20 transition-all", "aria-label": "Open AI assistant", title: "Ask ParkClear AI for parking recommendations", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDCAC" }) }), selectedGarageId && (_jsx(GarageBottomSheet, { garageId: selectedGarageId, garages: parkingGarages, onClose: () => setSelectedGarageId(null) })), showAssistant && (_jsx(AssistantSheet, { onClose: () => setShowAssistant(false) })), loading && (_jsxs("div", { className: "absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 z-10", children: [_jsx("span", { className: "animate-spin", children: "\u23F3" }), _jsx("span", { className: "text-sm text-gray-700 font-medium", children: "Discovering parking..." })] }))] }));
}
