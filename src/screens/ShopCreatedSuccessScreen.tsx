import React from 'react';
import { useMerchant } from '../context/MerchantContext';
import { CheckCircle2, ArrowRight, Store, Bell, Printer, Wallet } from 'lucide-react';
import { theme } from '../theme';

export const ShopCreatedSuccessScreen: React.FC = () => {
  const { onboardingData, navigateTo } = useMerchant();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#0E1013',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.12), transparent 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 16px',
        fontFamily: theme.fonts.sans,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          backgroundColor: '#15171F',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 20,
          padding: '40px 36px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.35)',
          }}
        >
          <CheckCircle2 size={38} color="#10B981" />
        </div>

        <span
          style={{
            display: 'inline-block',
            padding: '5px 14px',
            borderRadius: 20,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10B981',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: 12,
          }}
        >
          ● Shop Is Now Online
        </span>

        <h1
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: 42,
            fontWeight: 400,
            color: '#F4F2EC',
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          Congratulations! Your Shop is Live.
        </h1>
        <p style={{ fontSize: 15, color: theme.colors.textMuted, lineHeight: 1.6, maxWidth: 460, margin: '0 auto 28px' }}>
          Customers in your area can now search for <b style={{ color: '#FFFFFF' }}>{onboardingData.shopName}</b>, upload documents, and place print orders directly.
        </p>

        {/* Live Shop Badge Card */}
        <div
          style={{
            backgroundColor: '#101217',
            border: `1px solid ${theme.colors.borderLight}`,
            borderRadius: 14,
            padding: '18px 22px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Store size={26} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
              {onboardingData.shopName}
            </div>
            <div style={{ fontSize: 13, color: theme.colors.textMuted }}>
              {onboardingData.area}, {onboardingData.city} • Open 09:00 AM - 09:00 PM
            </div>
          </div>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            VERIFIED
          </div>
        </div>

        {/* 3 Reminders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32, textAlign: 'left' }}>
          <div style={{ padding: '14px', borderRadius: 10, backgroundColor: '#13151D', border: `1px solid ${theme.colors.border}` }}>
            <Bell size={18} color={theme.colors.primaryLight} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>Instant Alerts</div>
            <div style={{ fontSize: 11, color: theme.colors.textDim }}>Sound chimes on each incoming print order.</div>
          </div>

          <div style={{ padding: '14px', borderRadius: 10, backgroundColor: '#13151D', border: `1px solid ${theme.colors.border}` }}>
            <Printer size={18} color={theme.colors.success} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>Print Queue</div>
            <div style={{ fontSize: 11, color: theme.colors.textDim }}>Track printing status & notify customers when ready.</div>
          </div>

          <div style={{ padding: '14px', borderRadius: 10, backgroundColor: '#13151D', border: `1px solid ${theme.colors.border}` }}>
            <Wallet size={18} color={theme.colors.warning} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>Daily Payouts</div>
            <div style={{ fontSize: 11, color: theme.colors.textDim }}>Direct auto settlement into your bank account.</div>
          </div>
        </div>

        <button
          onClick={() => navigateTo('dashboard')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '14px 24px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.45)',
          }}
        >
          <span>Go to Merchant Dashboard</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
