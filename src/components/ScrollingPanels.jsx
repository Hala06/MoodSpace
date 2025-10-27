import React from 'react';
import { motion as Motion } from 'framer-motion';
import './ScrollingPanels.css';

const panels = [
  {
    emoji: '😊',
    color: 'rgba(102, 126, 234, 0.15)',
    text: 'Track your mood daily'
  },
  {
    emoji: '📝',
    color: 'rgba(139, 92, 246, 0.15)',
    text: 'Journal with AI prompts'
  },
  {
    emoji: '💬',
    color: 'rgba(236, 72, 153, 0.15)',
    text: 'Connect anonymously'
  },
  {
    emoji: '📊',
    color: 'rgba(59, 130, 246, 0.15)',
    text: 'Visualize your journey'
  },
  {
    emoji: '✨',
    color: 'rgba(240, 147, 251, 0.15)',
    text: 'Get personalized insights'
  },
  {
    emoji: '🎯',
    color: 'rgba(34, 197, 94, 0.15)',
    text: 'Build healthy habits'
  }
];

export default function ScrollingPanels() {
  return (
    <div className="scrolling-panels-container single">
      <div className="panels-column">
        {[...panels, ...panels].map((panel, index) => (
          <Motion.div
            key={`panel-${index}`}
            className="panel opaque"
            style={{ 
              background: panel.color.replace('0.15', '0.7'),
              backdropFilter: 'blur(10px)'
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="panel-emoji">{panel.emoji}</span>
            <p className="panel-text">{panel.text}</p>
          </Motion.div>
        ))}
      </div>
    </div>
  );
}
