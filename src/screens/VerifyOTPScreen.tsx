import React, { useState, useRef, useEffect } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { theme } from '../theme';
import { merchantApi } from '../services/api';

export const VerifyOTPScreen: React.FC = () => {
  const { authPhone, navigateTo, showToast, login } = useMerchant();
  const [digits, setDigits] = useState(['0', '0', '0', '0']);
  const [timer, setTimer] = useState(26);
  const [loading, setLoading] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (index: number, rawVal: string) => {
    const cleaned = rawVal.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // If multiple digits were input (pasted or auto-filled)
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 4).split('');
      const newDigits = [...digits];
      chars.forEach((c, i) => {
        if (index + i < 4) {
          newDigits[index + i] = c;
        }
      });
      setDigits(newDigits);
      const nextFocus = Math.min(3, index + chars.length);
      inputRefs[nextFocus].current?.focus();
      return;
    }

    // Single digit input
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);

    if (index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasteData) return;
    const newDigits = [...digits];
    pasteData.split('').forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setDigits(newDigits);
    const targetIdx = Math.min(pasteData.length, 3);
    inputRefs[targetIdx].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs[index - 1].current?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
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
    const cleanDigits = authPhone.replace(/\D/g, '').slice(-10);
    const normalizedPhone = `+91${cleanDigits}`;

    try {
      const res = await merchantApi.verifyOTP(normalizedPhone, otp);
      setLoading(false);
      if (!res || !res.success || !res.data) {
        showToast(res?.error || 'Verification failed. Merchant not found.');
        return;
      }
      const merchantData = res.data;
      login(merchantData, res.data?.accessToken, normalizedPhone);
      showToast(`Verified! Welcome ${merchantData.shopName || 'Merchant'}.`);
    } catch (err: any) {
      setLoading(false);
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        'Verification failed. Please check the code.';
      showToast(errMsg);
    }
  };

  const handleResend = async () => {
    setTimer(26);
    try {
      await merchantApi.sendLoginOTP(authPhone.replace(/\s+/g, ''));
      showToast('A new OTP has been sent to your phone');
    } catch {
      showToast('A new OTP has been sent to your phone');
    }
  };

  return (
    <AuthLayout cardWidth={480}>
      <button
        onClick={() => navigateTo('login')}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: '#EBE7DF',
          border: '1px solid #DAD5CB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#1A1C20',
          marginBottom: 16,
          padding: 0,
        }}
      >
        <ChevronLeft size={18} />
      </button>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: 34,
            fontWeight: 400,
            color: '#1A1C20',
            marginBottom: 6,
            lineHeight: 1.15,
          }}
        >
          Verify OTP
        </h2>
        <p style={{ fontSize: 13.5, color: '#6B707B', marginBottom: 4 }}>
          Enter the 4-digit code sent to
        </p>
        <p style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>
          {authPhone || '+91 86678 06134'}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 24 }}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={inputRefs[idx]}
            type="text"
            inputMode="numeric"
            autoComplete={idx === 0 ? 'one-time-code' : 'off'}
            value={digit}
            placeholder="0"
            onFocus={e => e.target.select()}
            onChange={e => handleDigitChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: '#EBE7DF',
              border: `1.5px solid ${digit ? '#1C1D21' : '#DAD5CB'}`,
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 700,
              color: '#1A1C20',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
          />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        {timer > 0 ? (
          <span style={{ fontSize: 13, color: '#6B707B' }}>
            Resend OTP in <b style={{ color: '#1A1C20' }}>00:{timer < 10 ? `0${timer}` : timer}</b>
          </span>
        ) : (
          <button
            onClick={handleResend}
            style={{
              background: 'none',
              border: 'none',
              color: '#1A1C20',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Resend OTP Now
          </button>
        )}
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
          backgroundColor: '#1C1D21',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
        <ArrowRight size={16} />
      </button>
    </AuthLayout>
  );
};
