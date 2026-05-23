import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
export default function ReportPriceSheet({ garage, onClose }) {
    const [price, setPrice] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would submit to your backend
        console.log(`Reported price $${price} for ${garage.name}`);
        setSubmitted(true);
        setTimeout(onClose, 2000);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/30 z-40", onClick: onClose }), _jsxs("div", { className: "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 flex justify-between items-center", children: [_jsx("h3", { className: "font-bold text-gray-900", children: "Report Current Price" }), _jsx("button", { onClick: onClose, className: "text-2xl leading-none text-gray-400", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-4 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: garage.name }), _jsx("p", { className: "text-xs text-gray-600", children: garage.address })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Hourly Rate ($)" }), _jsx("input", { type: "number", step: "0.01", min: "0", value: price, onChange: (e) => setPrice(e.target.value), placeholder: "e.g. 3.50", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), submitted && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-900 px-3 py-2 rounded-lg text-sm", children: "\u2713 Thank you! Your report helps improve pricing accuracy." })), !submitted && (_jsx("button", { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition", children: "Submit Report" }))] })] })] }));
}
