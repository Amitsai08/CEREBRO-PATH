import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { studentProfile, logout } = useAuth();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-career-primary to-career-secondary flex items-center justify-center text-xs font-bold text-white uppercase">
                    {studentProfile?.name?.charAt(0) || 'S'}
                </div>
                <span className="hidden md:block text-sm font-medium mr-1">{studentProfile?.name || 'Student'}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 glass-card border border-white/20 shadow-2xl z-[60] overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/10">
                            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Student Account</p>
                            <p className="text-sm font-bold truncate">{studentProfile?.name}</p>
                            <p className="text-[10px] text-white/50 truncate italic">{studentProfile?.email}</p>
                        </div>
                        
                        <div className="p-2">
                            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
                                <span className="text-lg">👤</span> Profile Details
                            </Link>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
                                <span className="text-lg">📊</span> My Dashboard
                            </Link>
                        </div>

                        <div className="p-2 pt-0 border-t border-white/10 mt-2">
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <span className="text-lg">🚪</span> Log Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
