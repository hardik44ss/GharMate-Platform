import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hammer, Menu, X, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

interface NavbarProps {
  onAuthClick: () => void;
}

export default function Navbar({ onAuthClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashLink = user
    ? { ROLE_CLIENT: '/dashboard/client', ROLE_CONTRACTOR: '/dashboard/contractor', ROLE_ADMIN: '/dashboard/admin' }[user.role]
    : '/';

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Find Contractors', href: '/contractors' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'AI Tools', href: '/#ai-tools' },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-nav py-2.5' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-brand-700 rounded-xl group-hover:bg-brand-800 transition-colors">
              <Hammer className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold font-display ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              GharMate
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  scrolled ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors ${
                    scrolled ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                  }`}
                >
                  <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}&background=1d3052&color=fff`} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
                  <span className={`text-sm font-semibold ${scrolled ? 'text-slate-700' : 'text-white'}`}>{user.fullName.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 ${scrolled ? 'text-slate-400' : 'text-white/60'}`} />
                </button>
                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-float border border-slate-100 z-20 py-2"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <Link to={dashLink} onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button onClick={onAuthClick} className={`text-sm font-semibold ${scrolled ? 'text-slate-700 hover:text-slate-900' : 'text-white hover:text-white/90'}`}>
                  Sign In
                </button>
                <Button size="sm" onClick={onAuthClick} className={!scrolled ? 'bg-white text-brand-800 hover:bg-white/90' : ''}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 ${scrolled ? 'text-slate-700' : 'text-white'}`}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden mt-4 pb-4 space-y-1 bg-white rounded-2xl p-4 shadow-float"
          >
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100 mt-2">
              {isAuthenticated ? (
                <>
                  <Link to={dashLink} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Dashboard</Link>
                  <button onClick={handleLogout} className="block px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full text-left">Sign Out</button>
                </>
              ) : (
                <Button fullWidth size="sm" onClick={() => { onAuthClick(); setMobileOpen(false); }}>Get Started</Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
