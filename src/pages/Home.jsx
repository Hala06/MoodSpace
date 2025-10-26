import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  TrendingUp,
  NotebookPen,
  MessageCircleHeart,
  BarChart3,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import FloatingOrb from '../components/FloatingOrb';
import './home.css';

const features = [
  {
    icon: Heart,
    title: 'Daily Check-Ins',
    description: 'Track your emotional journey with simple, intuitive mood logging.',
  },
  {
    icon: NotebookPen,
    title: 'Smart Journaling',
    description: 'AI-powered prompts help you reflect deeper and understand yourself better.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Safe Community',
    description: 'Connect anonymously with others who understand what you\'re going through.',
  },
  {
    icon: BarChart3,
    title: 'Insights & Trends',
    description: 'Visualize patterns and celebrate your progress with beautiful analytics.',
  }
];

const stats = [
  { value: '10k+', label: 'Active Users' },
  { value: '95%', label: 'Feel Better' },
  { value: '24/7', label: 'Support' },
  { value: '100%', label: 'Anonymous' }
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <FloatingOrb opacity={0.4} />
        
        <div className="hero-content container">
          <Motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles size={16} />
              <span>Your Mental Wellness Companion</span>
            </Motion.div>

            <h1>
              Feel seen, supported,
              <span className="gradient-text"> and steady</span>
            </h1>

            <p className="hero-subtitle">
              A beautiful space for daily mood check-ins, AI-powered journaling,
              and anonymous peer support. Built with care for your mental wellness journey.
            </p>

            <Motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <button
                className="btn-primary"
                onClick={() => navigate('/check-in')}
              >
                <span>Start Check-In</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                <span>View Dashboard</span>
              </button>
            </Motion.div>

            <Motion.div
              className="hero-features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="feature-item">
                <Check size={16} />
                <span>100% Anonymous</span>
              </div>
              <div className="feature-item">
                <Check size={16} />
                <span>AI-Powered Insights</span>
              </div>
              <div className="feature-item">
                <Check size={16} />
                <span>Safe Community</span>
              </div>
            </Motion.div>
          </Motion.div>

          <Motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="visual-card main-card">
              <div className="card-header">
                <div className="card-label">
                  <Zap size={14} />
                  <span>Daily Check-In</span>
                </div>
                <span className="card-time">2 min</span>
              </div>
              <div className="mood-grid">
                {['😊', '😌', '😔', '😰', '😡'].map((emoji, i) => (
                  <Motion.button
                    key={emoji}
                    className="mood-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                  >
                    {emoji}
                  </Motion.button>
                ))}
              </div>
              <div className="card-prompt">
                "What brought you peace today?"
              </div>
            </div>

            <Motion.div
              className="visual-card stats-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <div className="mini-chart">
                {[60, 75, 65, 85, 92, 88, 95].map((h, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="stats-footer">
                <div>
                  <strong>7 days</strong>
                  <span>streak</span>
                </div>
                <div className="trend-up">
                  <TrendingUp size={14} />
                  <span>+24%</span>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        </div>

        <div className="hero-gradient" />
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <Motion.div
                key={stat.label}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <Motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>Everything you need for your wellness journey</h2>
            <p>Thoughtfully designed tools to support your mental health every day</p>
          </Motion.div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <Motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -8 }}
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Motion.div
            className="cta-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>Start your journey today</h2>
            <p>Join thousands who are already transforming their mental wellness</p>
            <div className="cta-buttons">
              <button
                className="btn-primary large"
                onClick={() => navigate('/login')}
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} />
              </button>
            </div>
            <span className="cta-note">No credit card required • 100% anonymous</span>
          </Motion.div>
        </div>
      </section>
    </div>
  );
}
