import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';

const AIChatModal = ({ isOpen, onClose }) => {
    const { studentProfile } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello ${studentProfile?.name || 'there'}! I'm Cerebro, your AI counselor. How can I help you with your career choices today?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/ai/chat`, {
                message: input,
                studentProfile
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a bit of trouble connecting to my brain. Please try again!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-career-dark border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-career-primary/20 to-transparent flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-career-primary flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Cerebro AI Counselor</h3>
                                    <p className="text-xs text-green-400 font-bold uppercase tracking-widest">Online & Ready</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-white/40 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[400px]">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                                        msg.role === 'user' 
                                            ? 'bg-career-primary text-white ml-12 rounded-tr-none' 
                                            : 'bg-white/5 border border-white/5 text-white/80 mr-12 rounded-tl-none'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-career-primary rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-career-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-career-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 border-t border-white/10 bg-white/5 flex gap-4">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about streams, colleges, exams..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-career-primary transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-12 h-12 rounded-2xl bg-career-primary flex items-center justify-center text-white shadow-lg shadow-career-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AIChatModal;
