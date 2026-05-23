import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PriceDisplay from './PriceDisplay';
import HoursPanel from './HoursPanel';
import ScanSignFlow from '../scan/ScanSignFlow';
import ReportPriceSheet from '../report/ReportPriceSheet';
import { useState } from 'react';
export default function GarageBottomSheet({ garageId, garages, onClose }) {
    const garage = garages.find((g) => g.id === garageId);
    const [showScanner, setShowScanner] = useState(false);
    const [showReport, setShowReport] = useState(false);
    if (!garage)
        return null;
    const confidenceColor = {
        verified: 'text-green-600',
        estimated: 'text-amber-600',
        needs_scan: 'text-red-600',
        unknown: 'text-gray-600',
        loading: 'text-blue-600',
    }[garage.pricingState];
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/30 z-30", onClick: onClose }), _jsxs("div", { className: "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-40 max-h-96 overflow-y-auto", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: garage.name }), _jsx("p", { className: "text-sm text-gray-600", children: garage.address })] }), _jsx("button", { onClick: onClose, className: "text-2xl leading-none text-gray-400 hover:text-gray-600", children: "\u00D7" })] }) }), _jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: garage.is_open ? '🟢 Open' : '🔴 Closed' }), _jsxs("span", { className: `text-xs font-semibold px-2 py-1 rounded ${confidenceColor}`, children: [garage.pricingState === 'verified' && '✓ Verified', garage.pricingState === 'estimated' && '~ Estimated', garage.pricingState === 'needs_scan' && '📷 Scan to verify', garage.pricingState === 'unknown' && 'No data', garage.pricingState === 'loading' && 'Loading...'] })] }), _jsx(PriceDisplay, { garage: garage }), garage.hours && _jsx(HoursPanel, { hours: garage.hours }), _jsxs("div", { className: "pt-2 space-y-2", children: [garage.pricingState === 'needs_scan' && (_jsx("button", { onClick: () => setShowScanner(true), className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition", children: "\uD83D\uDCF7 Scan Sign to Verify" })), _jsx("button", { onClick: () => setShowReport(true), className: "w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 rounded-lg transition", children: "\u270F\uFE0F Report Price" })] })] })] }), showScanner && _jsx(ScanSignFlow, { onClose: () => setShowScanner(false), garage: garage }), showReport && _jsx(ReportPriceSheet, { garage: garage, onClose: () => setShowReport(false) })] }));
}
