import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../utils/useTheme';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Home, LayoutDashboard, BookOpen, MessageSquare, Plus, Sun, Moon, LogIn, LogOut, UserCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
  { to: '/journal', label: 'Journal', icon: BookOpen, requiresAuth: true },
  { to: '/forum', label: 'Forum', icon: MessageSquare, requiresAuth: true },
];

export default function AppLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, toggleTheme] = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckIn = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/check-in' } });
      return;
    }
    navigate('/check-in');
  };

  const handleNavClick = (event, item) => {
    if (!isAuthenticated && item.requiresAuth) {
      event.preventDefault();
      navigate('/login', { state: { from: item.to } });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  // Don't render layout on login page
  if (location.pathname === '/login') {
    return <Outlet />;
  }

  return (
    <div className="app-shell">
      <Motion.header 
        className={`app-header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="header-content">
          <NavLink to="/" className="brand">
            <span>moodspace</span>
          </NavLink>
          <nav className="app-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={(event) => handleNavClick(event, item)}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''} ${!isAuthenticated && item.requiresAuth ? 'locked' : ''}`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <Motion.button 
              className="check-in-button" 
              onClick={handleCheckIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={18} />
              <span>Check-In</span>
            </Motion.button>

            {isAuthenticated ? (
              <>
                <div className="user-pill">
                  <UserCircle size={20} />
                  <span>{user?.name ?? 'Member'}</span>
                </div>
                <Motion.button
                  className="auth-button"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} />
                </Motion.button>
              </>
            ) : (
              <Motion.button
                className="auth-button"
                onClick={handleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn size={18} />
              </Motion.button>
            )}
            
            <Motion.button
              className="theme-toggle"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <Motion.span
                  key={theme}
                  initial={{ opacity: 0, y: -20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </Motion.span>
              </AnimatePresence>
            </Motion.button>

          </div>
        </div>
      </Motion.header>
      
      <main className="app-main">
        <Outlet />
      </main>
      
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          },
        }} 
      />

      <footer className="app-footer">
        <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} moodspace. Building better mental wellness together.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
        </div>
      </footer>
    </div>
  );
}
