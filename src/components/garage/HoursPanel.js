import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function HoursPanel({ hours }) {
    return (_jsxs("div", { className: "bg-gray-50 rounded-lg p-3", children: [_jsx("h3", { className: "font-semibold text-sm text-gray-900 mb-2", children: "Hours" }), _jsx("div", { className: "space-y-1", children: hours.weekday_text?.map((day, idx) => (_jsx("p", { className: "text-xs text-gray-700", children: day }, idx))) })] }));
}
