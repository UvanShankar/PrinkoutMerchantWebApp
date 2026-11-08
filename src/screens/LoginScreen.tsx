import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { theme } from '../theme';
import { merchantApi } from '../services/api';

export const LoginScreen: React.FC = () => {
  const { setAuthPhone, authPhone, updateOnboardingData, navigateTo, showToast } = useMerchant();
  const [phoneNumber, setPhoneNumber] = useState(
    authPhone ? authPhone.replace('+91', '').trim() : ''
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendOTP = async () => {
    setErrorMessage(null);
    const digitsOnly = phoneNumber.replace(/\D/g, '').slice(-10);
    if (digitsOnly.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    const normalizedPhone = `+91${digitsOnly}`;

    try {
      // Check if merchant is already registered (single fast direct call with +91)
      const isRegistered = await merchantApi.isExistingShop(normalizedPhone);

      if (!isRegistered) {
        setLoading(false);
        setAuthPhone(normalizedPhone);
        updateOnboardingData({ mobile: digitsOnly, phone: digitsOnly });
        showToast('Mobile number not registered. Redirecting to create merchant account...');
        navigateTo('onboarding-1');
        return;
      }

      // Merchant exists -> proceed to OTP screen
      await merchantApi.sendLoginOTP(normalizedPhone);
      setLoading(false);
      setAuthPhone(normalizedPhone);
      showToast('Welcome back! Enter 0000 to sign in.');
      navigateTo('verify-otp');
    } catch (err: any) {
      setLoading(false);
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        'Shop not registered. Please sign up to create your merchant account.';

      if (
        errMsg.toLowerCase().includes('not registered') ||
        errMsg.toLowerCase().includes('not found') ||
        errMsg.toLowerCase().includes('sign up') ||
        err?.status === 401
      ) {
        setAuthPhone(normalizedPhone);
        updateOnboardingData({ mobile: digitsOnly, phone: digitsOnly });
        showToast('Mobile number not registered. Redirecting to create merchant account...');
        navigateTo('onboarding-1');
        return;
      }

      setErrorMessage(errMsg);
      showToast(errMsg);
    }
  };

  return (
    <AuthLayout cardWidth={480}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: 36,
            fontWeight: 400,
            color: '#1A1C20',
            marginBottom: 6,
            lineHeight: 1.15,
          }}
        >
          Welcome back!
        </h2>
        <p style={{ fontSize: 14, color: '#6B707B' }}>
          Sign in to your Prinkout Merchant account.
        </p>
      </div>

      {errorMessage && (
        <div
          style={{
            marginBottom: 16,
            padding: '12px 14px',
            borderRadius: 12,
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            fontSize: 13,
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{errorMessage}</div>
          <div style={{ fontSize: 12, color: '#B91C1C' }}>
            Only verified registered merchants can sign in. If you are new, click <b>Create Merchant Account</b> below.
          </div>
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#EBE7DF',
            border: `1px solid ${errorMessage ? '#DC2626' : '#DAD5CB'}`,
            borderRadius: 14,
            padding: '12px 16px',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1C20' }}>+91</span>
            <ChevronDown size={14} color="#6B707B" />
          </div>

          <div style={{ width: 1, height: 20, backgroundColor: '#D1CCC2' }} />

          <input
            type="tel"
            value={phoneNumber}
            onChange={e => {
              setPhoneNumber(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="98765 43210"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 14.5,
              fontWeight: 500,
              color: '#1A1C20',
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSendOTP();
            }}
          />
        </div>
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
          backgroundColor: '#1C1D21',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? 'default' : 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <span>{loading ? 'Sending code...' : 'Send OTP'}</span>
        <ArrowRight size={16} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '24px 0' }}>
        <div style={{ flex: 1, height: 1, backgroundColor: '#E0DDD4' }} />
        <span style={{ fontSize: 12.5, color: '#8E929B', fontWeight: 500 }}>
          New to Prinkout?
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: '#E0DDD4' }} />
      </div>

      <button
        onClick={() => navigateTo('onboarding-1')}
        style={{
          width: '100%',
          padding: '12px 20px',
          backgroundColor: 'transparent',
          color: '#1A1C20',
          border: '1px solid #D5D0C6',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        Create Merchant Account
      </button>
    </AuthLayout>
  );
};
