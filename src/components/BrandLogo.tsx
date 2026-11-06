import React from 'react';
import { theme } from '../theme';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'medium', showSubtitle = true }) => {
  const fontSize = size === 'large' ? 38 : size === 'small' ? 24 : 30;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <span
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: fontSize + 4,
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1,
            position: 'relative',
            display: 'inline-block',
          }}
        >
          P
          <span
            style={{
              position: 'absolute',
              bottom: 2,
              left: 2,
              width: 3,
              height: 3,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
            }}
          />
        </span>
        <span
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: fontSize,
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1,
            letterSpacing: '-0.2px',
          }}
        >
          rinkout.
        </span>
      </div>
      {showSubtitle && (
        <span
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: 10,
            fontWeight: 700,
            color: '#9CA3AF',
            letterSpacing: '2.4px',
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          MERCHANT PORTAL
        </span>
      )}
    </div>
  );
};
