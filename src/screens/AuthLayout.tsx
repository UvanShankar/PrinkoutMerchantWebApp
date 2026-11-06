import React from 'react';
import { BrandLogo } from '../components/BrandLogo';
import { AmbientWave } from '../components/AmbientWave';
import { Layers, Printer, BarChart3 } from 'lucide-react';
import { theme } from '../theme';

interface AuthLayoutProps {
  children: React.ReactNode;
  cardWidth?: number;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, cardWidth = 500 }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#0E0F12',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 48px',
        fontFamily: theme.fonts.sans,
        overflowX: 'hidden',
      }}
    >
      <AmbientWave />

      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '48px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Branding Column */}
        <div style={{ flex: '1 1 500px', maxWidth: '540px' }}>
          <div style={{ marginBottom: 48 }}>
            <BrandLogo size="medium" showSubtitle={false} />
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#8E929B',
              letterSpacing: '2.4px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            MERCHANT PORTAL
          </div>

          <h1
            style={{
              fontFamily: theme.fonts.serif,
              fontSize: 60,
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: 1.08,
              letterSpacing: '-0.5px',
              marginBottom: 20,
            }}
          >
            Manage Prints,<br />
            Grow Your Shop.
          </h1>

          <p
            style={{
              fontSize: 15,
              color: '#9CA3AF',
              lineHeight: 1.6,
              maxWidth: 420,
              marginBottom: 36,
            }}
          >
            Receive orders, print effortlessly,<br />
            and track your earnings — all in one place.
          </p>

          {/* 3 feature boxes matching PDF (icon on top, text below, thin dividers) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginTop: 12,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={18} color="#FFFFFF" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF' }}>Receive Orders</span>
            </div>

            <div style={{ width: 1, height: 32, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Printer size={18} color="#FFFFFF" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF' }}>Print & Update</span>
            </div>

            <div style={{ width: 1, height: 32, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart3 size={18} color="#FFFFFF" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF' }}>Track Earnings</span>
            </div>
          </div>
        </div>

        {/* Right Section: Top Right Label + Cream Card */}
        <div
          style={{
            flex: `0 0 ${cardWidth}px`,
            maxWidth: `${cardWidth}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#8E929B',
              letterSpacing: '2.4px',
              textTransform: 'uppercase',
              marginBottom: 16,
              alignSelf: 'flex-end',
            }}
          >
            MERCHANT PORTAL
          </div>

          <div
            style={{
              width: '100%',
              backgroundColor: theme.colors.creamCard,
              borderRadius: 28,
              padding: '36px 32px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(246, 244, 238, 0.06)',
              border: `1px solid ${theme.colors.creamCardBorder}`,
              color: theme.colors.creamTextDark,
              boxSizing: 'border-box',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
