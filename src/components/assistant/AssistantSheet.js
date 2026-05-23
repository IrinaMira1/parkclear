import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
export default function AssistantSheet({ onClose }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm ParkClear's AI assistant. Ask me about parking recommendations, rates, or availability.",
            timestamp: Date.now(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSend = async () => {
        if (!input.trim())
            return;
        const userMessage = {
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        // Simulate AI response
        setTimeout(() => {
            const assistantMessage = {
                role: 'assistant',
                content: "Based on current parking availability and your location, I'd recommend checking nearby garages with verified pricing. Would you like me to show you options?",
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setLoading(false);
        }, 1000);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/30 z-40", onClick: onClose }), _jsxs("div", { className: "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 h-96 flex flex-col", children: [_jsxs("div", { className: "border-b border-gray-200 p-4 flex justify-between items-center", children: [_jsx("h3", { className: "font-bold text-gray-900", children: "ParkClear Assistant" }), _jsx("button", { onClick: onClose, className: "text-2xl leading-none text-gray-400", children: "\u00D7" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.map((msg, idx) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-none'}`, children: _jsx("p", { className: "text-sm", children: msg.content }) }) }, idx))), loading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none animate-pulse", children: _jsx("span", { children: "\u2713" }) }) })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "border-t border-gray-200 p-4 flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "Ask about parking...", className: "flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm", disabled: loading }), _jsx("button", { onClick: handleSend, disabled: loading || !input.trim(), className: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full p-2 transition", children: _jsx("span", { children: "\u2192" }) })] })] })] }));
}
