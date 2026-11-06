import React from 'react';

export const AmbientWave: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '600px',
        height: '280px',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 600 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="waveGlowGold" x1="0" y1="260" x2="600" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#EAD8B1" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#CBB588" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7B6946" stopOpacity="0" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="crispGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Diffuse Wide Ambient Glow */}
        <path
          d="M -30 260 C 80 220, 180 180, 300 180 C 420 180, 520 215, 610 230"
          stroke="url(#waveGlowGold)"
          strokeWidth="18"
          filter="url(#softGlow)"
          opacity="0.4"
        />

        {/* Secondary lower ribbon */}
        <path
          d="M -20 275 C 90 245, 190 210, 310 210 C 430 210, 520 235, 600 250"
          stroke="url(#waveGlowGold)"
          strokeWidth="1.2"
          opacity="0.6"
        />

        {/* Primary sharp glowing ribbon strand */}
        <path
          d="M -30 260 C 80 220, 180 180, 300 180 C 420 180, 520 215, 610 230"
          stroke="url(#waveGlowGold)"
          strokeWidth="1.6"
          filter="url(#crispGlow)"
          opacity="0.8"
        />
        <path
          d="M -30 260 C 80 220, 180 180, 300 180 C 420 180, 520 215, 610 230"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.95"
        />
      </svg>
    </div>
  );
};
