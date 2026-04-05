import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/dashboard', label: 'Dashboard', icon: '📊', protected: true },
  { path: '/explore', label: 'Colleges', icon: '🏫', protected: true },
  { path: '/exams', label: 'Exams', icon: '📝', protected: true },
  { path: '/analytics', label: 'Intelligence', icon: '🧠', protected: true },
  { path: '/profile', label: 'Profile', icon: '👤', protected: true },
  { path: '/admin/data', label: 'Data Admin', icon: '📁', adminOnly: true },
];

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { studentProfile } = useAuth();
  const isAdmin = studentProfile?.role === 'admin';

  const filteredLinks = navLinks.filter(link => {
    if (link.path === '/') return true; // Home is always visible
    if (!studentProfile && link.protected) return false; // Hide protected links if not logged in
    if (link.adminOnly && !isAdmin) return false; // Regular admin check
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-career-dark text-career-light relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-career-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-career-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Desktop & Mobile Header ── */}
      <header className="glass-header sticky top-0 z-50 py-3 px-4 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-career-primary to-career-secondary flex items-center justify-center text-sm font-bold">
            CP
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-career-primary to-career-secondary bg-clip-text text-transparent">
            Cerebro Path
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {filteredLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                location.pathname === link.path
                  ? 'bg-career-primary/20 text-career-primary font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {studentProfile ? (
            <ProfileDropdown />
          ) : (
            <Link to="/login" className="btn-primary py-1.5 px-5 text-sm ml-2">Login</Link>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-header border-b border-white/10 overflow-hidden z-40 sticky top-[52px]"
          >
            <div className="p-4 space-y-1">
              {filteredLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    location.pathname === link.path
                      ? 'bg-career-primary/20 text-career-primary font-medium'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              {!studentProfile && (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-center block mt-3 py-2.5 text-sm">
                  Login / Signup
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-grow flex flex-col relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-header border-t border-white/10 px-2 py-2">
        <div className="flex justify-around">
          {filteredLinks.slice(0, 5).map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-all ${
                location.pathname === link.path
                  ? 'text-career-primary'
                  : 'text-white/40'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Footer ── */}
      <footer className="py-20 border-t border-white/10 bg-black/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-career-primary to-career-secondary flex items-center justify-center text-sm font-bold">
                CP
              </div>
              <h3 className="text-xl font-display font-bold">Cerebro Path</h3>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Empowering Maharashtra's students with AI-driven career intelligence and real-time admission insights.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon="𝕏" />
              <SocialIcon icon="LinkedIn" />
              <SocialIcon icon="IG" />
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link to="/explore" className="hover:text-career-primary transition-colors">College Directory</Link></li>
              <li><Link to="/analytics" className="hover:text-career-primary transition-colors">Market Intelligence</Link></li>
              <li><Link to="/dashboard" className="hover:text-career-primary transition-colors">Student Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><a href="#" className="hover:text-career-primary transition-colors">CET Guide 2026</a></li>
              <li><a href="#" className="hover:text-career-primary transition-colors">Scholarship Portal</a></li>
              <li><a href="#" className="hover:text-career-primary transition-colors">AI Counselor Bot</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li>📍 Mumbai, Maharashtra</li>
              <li>📧 support@cerebropath.in</li>
              <li>📞 +91 98765 43210</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 pt-8 border-t border-white/5 text-center text-xs text-white/20">
          © {new Date().getFullYear()} Cerebro Path. All rights reserved. Designed for Maharashtra's Future.
        </div>
      </footer>
    </div>
  );
};

const SocialIcon = ({ icon }) => (
  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] cursor-pointer hover:bg-career-primary hover:text-white transition-all">
    {icon}
  </div>
);

export default MainLayout;
