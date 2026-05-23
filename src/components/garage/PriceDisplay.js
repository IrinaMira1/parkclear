import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function PriceDisplay({ garage }) {
    if (garage.pricingState === 'loading') {
        return (_jsx("div", { className: "bg-gray-100 rounded-lg p-4 animate-pulse", children: _jsx("div", { className: "h-4 bg-gray-300 rounded w-1/2" }) }));
    }
    if (garage.pricingState === 'unknown') {
        return (_jsx("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4 text-center", children: _jsx("p", { className: "text-sm text-gray-600", children: "No pricing data available" }) }));
    }
    return (_jsx("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4", children: _jsxs("div", { className: "space-y-2", children: [garage.hourly_rate && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Hourly" }), _jsxs("span", { className: "font-bold text-lg text-gray-900", children: ["$", garage.hourly_rate] })] })), garage.daily_rate && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Daily" }), _jsxs("span", { className: "font-bold text-lg text-gray-900", children: ["$", garage.daily_rate] })] })), garage.monthly_rate && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Monthly" }), _jsxs("span", { className: "font-bold text-lg text-gray-900", children: ["$", garage.monthly_rate] })] })), garage.operator && (_jsx("div", { className: "pt-2 border-t border-blue-200", children: _jsxs("p", { className: "text-xs text-gray-600", children: ["Operated by ", garage.operator] }) })), garage.confidence_score && (_jsxs("div", { className: "text-xs text-gray-600 pt-1", children: ["Confidence: ", Math.round(garage.confidence_score), "%"] }))] }) }));
}
