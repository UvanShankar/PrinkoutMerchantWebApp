import React, { useState, useRef } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { ArrowLeft, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { theme } from '../theme';
import { merchantApi } from '../services/api';

export const VerifyOTPScreen: React.FC = () => {
  const { authPhone, navigateTo, showToast } = useMerchant();
  const [digits, setDigits] = useState(['0', '0', '0', '0']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    // Auto-advance
    if (val && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join('');
    if (otp.length < 4) {
      showToast('Please enter the 4-digit verification code');
      return;
    }
    setLoading(true);
    await merchantApi.verifyOTP(authPhone.replace(/\s+/g, ''), otp);
    setLoading(false);
    showToast('Verified successfully! Welcome back.');
    navigateTo('dashboard');
  };

  const handleResend = async () => {
    setTimer(45);
    await merchantApi.sendLoginOTP(authPhone.replace(/\s+/g, ''));
    showToast('A new OTP has been sent to your phone');
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
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#15171F',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 16,
          padding: '36px 30px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <button
          onClick={() => navigateTo('login')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: theme.colors.textMuted,
            fontSize: 13,
            cursor: 'pointer',
            padding: 0,
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <ShieldCheck size={22} color={theme.colors.primaryLight} />
        </div>

        <h2
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: 32,
            fontWeight: 400,
            color: '#F4F2EC',
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Enter Verification Code
        </h2>
        <p style={{ fontSize: 14, color: theme.colors.textMuted, lineHeight: 1.5, marginBottom: 26 }}>
          We sent a 4-digit code to <b style={{ color: '#FFFFFF' }}>{authPhone}</b>.
        </p>

        {/* 4 Digit Boxes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 24 }}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              style={{
                width: 64,
                height: 64,
                textAlign: 'center',
                fontSize: 26,
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: '#101217',
                border: `1.5px solid ${digit ? theme.colors.primaryLight : theme.colors.borderLight}`,
                borderRadius: 12,
                outline: 'none',
                boxShadow: digit ? '0 0 12px rgba(37, 99, 235, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
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
            marginBottom: 20,
          }}
        >
          <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
          <ArrowRight size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: theme.colors.textDim }}>Didn't receive code?</span>
          {timer > 0 ? (
            <span style={{ color: theme.colors.textMuted }}>Resend code in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.primaryLight,
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Resend Code Now
            </button>
          )}
        </div>

        <div style={{ marginTop: 24, padding: '10px 14px', borderRadius: 8, backgroundColor: '#13151D', fontSize: 12, color: theme.colors.textDim, textAlign: 'center' }}>
          💡 Testing hint: Default test code is <b style={{ color: '#FFFFFF' }}>0000</b>
        </div>
      </div>
    </div>
  );
};
