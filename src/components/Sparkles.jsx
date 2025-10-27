import React, { useEffect, useState } from 'react';
import './Sparkles.css';

export default function Sparkles({ density = 50 }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: density }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
    setStars(newStars);
  }, [density]);

  return (
    <div className="sparkles-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="sparkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
