import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { Printer, ArrowRight, ShieldCheck, ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';
import { theme } from '../theme';
import { merchantApi } from '../services/api';

export const LoginScreen: React.FC = () => {
  const { authPhone, setAuthPhone, navigateTo, showToast } = useMerchant();
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.replace(/\s+/g, '').length < 10) {
      showToast('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    const fullPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91 ${phoneNumber}`;
    setAuthPhone(fullPhone);

    await merchantApi.sendLoginOTP(fullPhone.replace(/\s+/g, ''));
    setLoading(false);
    showToast(`OTP sent to ${fullPhone}`);
    navigateTo('verify-otp');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#0E1013',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.08), transparent 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 32, maxWidth: 640 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px',
            borderRadius: 30,
            backgroundColor: '#161922',
            border: `1px solid ${theme.colors.borderLight}`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Printer size={15} color="#FFFFFF" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
            Prinkout<span style={{ color: theme.colors.primaryLight }}>.</span>
          </span>
          <span style={{ fontSize: 11, color: theme.colors.textMuted, borderLeft: `1px solid ${theme.colors.border}`, paddingLeft: 8 }}>
            Merchant Partner
          </span>
        </div>

        <h1
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: 52,
            fontWeight: 400,
            color: '#F4F2EC',
            lineHeight: 1.15,
            marginBottom: 16,
            letterSpacing: '-0.5px',
          }}
        >
          Manage Prints, Grow Your Shop.
        </h1>
        <p style={{ fontSize: 16, color: theme.colors.textMuted, lineHeight: 1.6, maxWidth: 520, margin: '0 auto 24px' }}>
          Accept online print orders, monitor your production queue in real-time, and get daily automatic payouts.
        </p>

        {/* 3 Feature Pills matching PDF */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 20,
              backgroundColor: '#161922',
              border: `1px solid ${theme.colors.border}`,
              fontSize: 13,
              fontWeight: 500,
              color: '#D1D5DB',
            }}
          >
            <ShoppingBag size={15} color={theme.colors.primaryLight} />
            <span>Receive Orders</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 20,
              backgroundColor: '#161922',
              border: `1px solid ${theme.colors.border}`,
              fontSize: 13,
              fontWeight: 500,
              color: '#D1D5DB',
            }}
          >
            <Printer size={15} color={theme.colors.success} />
            <span>Print & Update</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 20,
              backgroundColor: '#161922',
              border: `1px solid ${theme.colors.border}`,
              fontSize: 13,
              fontWeight: 500,
              color: '#D1D5DB',
            }}
          >
            <TrendingUp size={15} color={theme.colors.warning} />
            <span>Track Earnings</span>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#15171F',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 16,
          padding: '32px 28px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 8 }}>
            Mobile Number
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#101217',
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: 10,
              padding: '2px 14px',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.textMuted, marginRight: 10, borderRight: `1px solid ${theme.colors.border}`, paddingRight: 10 }}>
              🇮🇳 +91
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="98765 43210"
              style={{
                flex: 1,
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 600,
                outline: 'none',
                letterSpacing: '0.5px',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSendOTP();
              }}
            />
          </div>
          <span style={{ display: 'block', marginTop: 6, fontSize: 11, color: theme.colors.textDim }}>
            Use test number <b>98765 43210</b> or your own mobile number
          </span>
        </div>

        <button
          onClick={handleSendOTP}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '13px 20px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            if (!loading) e.currentTarget.style.backgroundColor = '#1D4ED8';
          }}
          onMouseLeave={e => {
            if (!loading) e.currentTarget.style.backgroundColor = '#2563EB';
          }}
        >
          <span>{loading ? 'Sending Verification Code...' : 'Send OTP'}</span>
          <ArrowRight size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
          <span style={{ fontSize: 12, color: theme.colors.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            New to Prinkout?
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
        </div>

        <button
          onClick={() => navigateTo('onboarding-1')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 20px',
            backgroundColor: '#1E222D',
            color: '#F3F4F6',
            border: `1px solid ${theme.colors.borderLight}`,
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#282E3E')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1E222D')}
        >
          <Sparkles size={16} color={theme.colors.warning} />
          <span>Create Merchant Account</span>
        </button>

        {/* Demo Fast Login Shortcut */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            onClick={() => {
              showToast('Logged in as Sabarish Prints');
              navigateTo('dashboard');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.primaryLight,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Direct Demo Access (Skip OTP) →
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: theme.colors.textDim }}>
        By continuing, you agree to Prinkout's Merchant Terms & Privacy Policy
      </div>
    </div>
  );
};
