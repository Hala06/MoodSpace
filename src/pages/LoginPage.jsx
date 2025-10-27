import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, ArrowRight, Sparkles, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import DiamondModel from '../components/DiamondModel';
import AnimatedBlobs from '../components/AnimatedBlobs';
import SparklesComponent from '../components/Sparkles';
import './login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const redirectPath = location.state?.from && location.state.from !== '/login'
    ? location.state.from
    : '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleGuestLogin = () => {
    try {
      const guestNumber = Math.floor(Math.random() * 9000) + 1000;
      login({ email: `guest${guestNumber}@moodspace.app`, name: `Guest ${guestNumber}` });
      toast.success('Welcome! Exploring as a guest ✨');
      navigate(redirectPath);
    } catch {
      toast.error('Unable to start guest session');
    }
  };

  const toggleForm = () => {
    setError('');
    setIsLogin((prev) => !prev);
  };

  const handleAuth = async ({ email, name, password }) => {
    setError('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    
    if (!isLogin && !name) {
      setError('Please enter your name.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      login({ email, name: name || email.split('@')[0] });
      toast.success(isLogin ? '🎉 Welcome back!' : '✨ Account created!');
      navigate(redirectPath);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Ambient Effects */}
      <AnimatedBlobs />
      <SparklesComponent density={35} />
      
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '500',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          },
        }}
      />
      
      <DiamondModel />
      
      <div className="login-container">
        <Motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {error && (
            <Motion.div 
              className="auth-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </Motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {isLogin ? (
              <LoginForm key="login" toggleForm={toggleForm} onSubmit={handleAuth} loading={loading} />
            ) : (
              <SignupForm key="signup" toggleForm={toggleForm} onSubmit={handleAuth} loading={loading} />
            )}
          </AnimatePresence>
          
          <div className="divider">
            <span>or</span>
          </div>
          
          <Motion.button 
            className="guest-button" 
            onClick={handleGuestLogin}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={18} />
            Try without signing up
            <ArrowRight size={18} />
          </Motion.button>
        </Motion.div>
      </div>
    </div>
  );
};

const LoginForm = ({ toggleForm, onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Motion.div
      className="form-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue your wellness journey</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>
        
        <Motion.button 
          type="submit" 
          className="submit-button"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Sign In
            </>
          )}
        </Motion.button>
      </form>
      
      <p className="toggle-form-text">
        Don't have an account?{' '}
        <button type="button" onClick={toggleForm} className="toggle-link">
          Create one
        </button>
      </p>
    </Motion.div>
  );
};

const SignupForm = ({ toggleForm, onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength += 1;
    if (pwd.length >= 10) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return Math.min(strength, 4);
  };

  const handlePasswordChange = (event) => {
    const pwd = event.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, email, password });
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981', '#22c55e'];

  return (
    <Motion.div
      className="form-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-header">
        <h2>Create Account</h2>
        <p>Start your wellness journey today</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="signup-name">Full name</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              type="text"
              id="signup-name"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoFocus
            />
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="signup-email">Email address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              id="signup-email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="signup-password">Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              id="signup-password"
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />
          </div>
          {password && (
            <div className="password-strength">
              <div className="strength-bars">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="strength-bar"
                    style={{
                      background: level <= passwordStrength ? strengthColors[passwordStrength] : 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                ))}
              </div>
              {passwordStrength > 0 && (
                <span style={{ color: strengthColors[passwordStrength] }}>
                  {strengthLabels[passwordStrength]}
                </span>
              )}
            </div>
          )}
        </div>
        
        <Motion.button 
          type="submit" 
          className="submit-button"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </Motion.button>
      </form>
      
      <p className="toggle-form-text">
        Already have an account?{' '}
        <button type="button" onClick={toggleForm} className="toggle-link">
          Sign in
        </button>
      </p>
    </Motion.div>
  );
};

export default LoginPage;
