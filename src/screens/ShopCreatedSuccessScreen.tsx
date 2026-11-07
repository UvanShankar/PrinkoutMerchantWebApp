import React from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ArrowRight, Phone, MapPin, ShoppingBag, Printer, BarChart3, Check } from 'lucide-react';
import { theme } from '../theme';

export const ShopCreatedSuccessScreen: React.FC = () => {
  const { onboardingData, shopData, navigateTo } = useMerchant();
  const displayShopName = shopData?.shopName || onboardingData?.shopName || 'Your Shop';
  const displayMobile = shopData?.mobile || onboardingData?.mobile || '—';
  const displayAddress = shopData?.address || onboardingData?.address || '—';

  return (
    <AuthLayout cardWidth={520}>
      {/* Scalloped badge matching PDF */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          {/* Burst ray lines */}
          <div
            style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 4,
            }}
          >
            <div style={{ width: 2, height: 6, backgroundColor: '#1C1D21', borderRadius: 1 }} />
            <div style={{ width: 2, height: 8, backgroundColor: '#1C1D21', borderRadius: 1, marginTop: -2 }} />
            <div style={{ width: 2, height: 6, backgroundColor: '#1C1D21', borderRadius: 1 }} />
          </div>

          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              backgroundColor: '#1C1D21',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Check size={28} color="#FFFFFF" strokeWidth={3} />
          </div>
        </div>

        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#1A1C20', marginBottom: 4 }}>
          Shop Created Successfully!
        </h2>
        <p style={{ fontSize: 13.5, color: '#6B707B' }}>
          Your shop is now live on Prinkout.
        </p>
      </div>

      {/* Live Shop Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FAF8F5',
          border: '1px solid #DAD5CB',
          borderRadius: 14,
          padding: '14px 16px',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 8,
              backgroundColor: '#2A2D34',
              backgroundImage: 'linear-gradient(145deg, #1A1C21, #3A3D46)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 9,
              fontWeight: 700,
              textAlign: 'center',
              padding: 4,
            }}
          >
            {displayShopName}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>
              {displayShopName}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555963' }}>
              <Phone size={12} />
              <span>{displayMobile}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555963' }}>
              <MapPin size={12} />
              <span>{displayAddress}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#15803D' }} />
          <span>Active</span>
        </div>
      </div>

      {/* 3 benefit cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        <div
          style={{
            backgroundColor: '#FAF8F5',
            border: '1px solid #DAD5CB',
            borderRadius: 10,
            padding: '12px 10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ShoppingBag size={18} color="#1C1D21" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1A1C20', lineHeight: 1.3 }}>
            Receive Orders Automatically
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FAF8F5',
            border: '1px solid #DAD5CB',
            borderRadius: 10,
            padding: '12px 10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Printer size={18} color="#1C1D21" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1A1C20', lineHeight: 1.3 }}>
            Print & Update Status
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FAF8F5',
            border: '1px solid #DAD5CB',
            borderRadius: 10,
            padding: '12px 10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <BarChart3 size={18} color="#1C1D21" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1A1C20', lineHeight: 1.3 }}>
            Track Earnings & Reports
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          try {
            localStorage.removeItem('prinkout_merchant_onboarding');
          } catch {}
          navigateTo('profile');
        }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '13px 20px',
          backgroundColor: '#1C1D21',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <span>Complete Profile & Send for Verification</span>
        <ArrowRight size={16} />
      </button>
    </AuthLayout>
  );
};
