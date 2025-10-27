import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  NotebookPen,
  MessageCircleHeart,
  BarChart3,
  Sparkles,
  Check
} from 'lucide-react';
import OrbModel from '../components/OrbModel';
import AnimatedBlobs from '../components/AnimatedBlobs';
import SparklesComponent from '../components/Sparkles';
import './home.css';

const features = [
  {
    icon: Heart,
    title: 'Daily Check-Ins',
    description: 'Track your emotional journey with simple mood logging.',
  },
  {
    icon: NotebookPen,
    title: 'Smart Journaling',
    description: 'AI-powered prompts help you reflect and grow.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Safe Community',
    description: 'Connect anonymously with supportive peers.',
  },
  {
    icon: BarChart3,
    title: 'Insights',
    description: 'Visualize patterns and celebrate progress.',
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
      {/* Ambient Effects */}
      <AnimatedBlobs />
      <SparklesComponent density={40} />
      
      {/* Hero Section */}
      <section className="hero-section">
        <OrbModel />
        
        <div className="hero-content container">
          <Motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
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
              and anonymous peer support.
            </p>

            <Motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
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
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="feature-item">
                <Check size={16} />
                <span>100% Anonymous</span>
              </div>
              <div className="feature-item">
                <Check size={16} />
                <span>AI-Powered</span>
              </div>
              <div className="feature-item">
                <Check size={16} />
                <span>Safe Community</span>
              </div>
            </Motion.div>
          </Motion.div>
        </div>
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Everything you need for wellness</h2>
            <p>Simple tools designed with care for your mental health journey</p>
          </Motion.div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <Motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
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
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to start your journey?</h2>
            <p>Join thousands who are taking care of their mental health</p>
            <Motion.button
              className="btn-primary large"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </Motion.button>
          </Motion.div>
        </div>
      </section>
    </div>
  );
}
