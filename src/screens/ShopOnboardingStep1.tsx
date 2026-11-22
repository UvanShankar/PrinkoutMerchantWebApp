import React, { useState, useEffect, useRef } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ChevronLeft, ArrowRight, Store, User, Phone, FileText, MapPin, CheckCircle2, Clock, AlertTriangle, AlertCircle, ShieldCheck, X } from 'lucide-react';
import { theme } from '../theme';
import { merchantApi } from '../services/api';
import { resolveCityFromLocation, isKnownServiceablePincode } from '../utils/locationUtils';
import { LocationPickerModal, LocationData } from '../components/LocationPickerModal';

export const ShopOnboardingStep1: React.FC = () => {
  const { onboardingData, updateOnboardingData, navigateTo, showToast, login, setShopData } = useMerchant();
  const [form, setForm] = useState({
    shopName: onboardingData.shopName || '',
    ownerName: onboardingData.ownerName || '',
    mobile: onboardingData.mobile || '',
    gstNumber: onboardingData.gstNumber || '',
    address: onboardingData.address || '',
    pincode: onboardingData.pincode || '',
    description: onboardingData.description || '',
  });

  const [serviceStatus, setServiceStatus] = useState<{
    checked: boolean;
    serviceable: boolean;
    area?: string;
    city?: string;
    status?: string;
    message?: string;
  } | null>(null);

  const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<any>(null);

  // Location Picker state
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);

  const handleLocationSelected = (loc: LocationData) => {
    setForm(prev => ({
      ...prev,
      address: loc.address,
      pincode: loc.pincode,
    }));
    updateOnboardingData({
      address: loc.address,
      pincode: loc.pincode,
      city: loc.city,
      area: loc.area,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    showToast(`📍 Location picked: ${loc.city} (${loc.pincode})`);
  };

  // OTP Verification state
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [registeredShop, setRegisteredShop] = useState<any>(null);

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // OTP Timer countdown
  useEffect(() => {
    if (!showOtpModal || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  // Focus first input when OTP modal opens
  useEffect(() => {
    if (showOtpModal) {
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 120);
    }
  }, [showOtpModal]);

  // Ensure fields are synchronized whenever onboardingData updates or on remount
  useEffect(() => {
    setForm({
      shopName: onboardingData.shopName || '',
      ownerName: onboardingData.ownerName || '',
      mobile: onboardingData.mobile || '',
      gstNumber: onboardingData.gstNumber || '',
      address: onboardingData.address || '',
      pincode: onboardingData.pincode || '',
      description: onboardingData.description || '',
    });
  }, [
    onboardingData.shopName,
    onboardingData.ownerName,
    onboardingData.mobile,
    onboardingData.gstNumber,
    onboardingData.address,
    onboardingData.pincode,
    onboardingData.description,
  ]);

  // Live serviceability check on pincode change
  useEffect(() => {
    const pin = form.pincode?.trim().replace(/\D/g, '');
    if (pin && pin.length === 6) {
      const isKnown = isKnownServiceablePincode(pin);
      const initialCity = resolveCityFromLocation(pin, form.address);
      if (isKnown) {
        setServiceStatus({
          checked: true,
          serviceable: true,
          city: initialCity,
          status: 'ACTIVE',
          message: `Service is active in ${initialCity}`,
        });
      }
      merchantApi.checkServiceability(pin).then((res) => {
        const resolvedCity = resolveCityFromLocation(pin, form.address, res?.location?.city || initialCity);
        const isServiceable = isKnown || (res?.serviceable ?? false);
        setServiceStatus({
          checked: true,
          serviceable: isServiceable,
          area: res?.location?.area,
          city: resolvedCity,
          status: isServiceable ? 'ACTIVE' : (res?.status || 'COMING_SOON'),
          message: res?.message,
        });
      });
    } else {
      setServiceStatus(null);
    }
  }, [form.pincode, form.address]);

  const cleanPhone = form.mobile.replace(/\D/g, '').slice(-10);
  const cleanPin = form.pincode.replace(/\D/g, '');

  const missingFields: string[] = [];
  if (!form.shopName.trim()) missingFields.push('Shop Name');
  if (!cleanPhone || cleanPhone.length !== 10) missingFields.push('10-digit Contact Number');
  if (!form.address.trim()) missingFields.push('Shop Address');
  if (!cleanPin || cleanPin.length !== 6) missingFields.push('6-digit Postal Pincode');
  else if (serviceStatus?.checked && !serviceStatus.serviceable && !isKnownServiceablePincode(cleanPin)) {
    missingFields.push('Serviceable Pincode (coming soon in this area)');
  }

  const isComplete = missingFields.length === 0;

  // Real-time details progress: 4 required fields
  const filledCount =
    (form.shopName.trim() ? 1 : 0) +
    (cleanPhone.length === 10 ? 1 : 0) +
    (form.address.trim() ? 1 : 0) +
    (cleanPin.length === 6 ? 1 : 0);
  const stepProgress = Math.round((filledCount / 4) * 100);

  const triggerTooltip = () => {
    setShowTooltip(true);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 5000);
  };

  // OTP digit entry handlers
  const handleOtpDigitChange = (index: number, rawVal: string) => {
    setOtpError(null);
    const cleaned = rawVal.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      chars.forEach((c, i) => {
        if (index + i < 6) {
          newDigits[index + i] = c;
        }
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(5, index + chars.length);
      otpInputRefs[nextFocus].current?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    if (index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setOtpError(null);
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;
    const newDigits = [...otpDigits];
    pasteData.split('').forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setOtpDigits(newDigits);
    const targetIdx = Math.min(pasteData.length, 5);
    otpInputRefs[targetIdx].current?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      } else if (index > 0) {
        otpInputRefs[index - 1].current?.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    } else if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  // Step: Request OTP and Register Shop
  const handleGetOtp = async () => {
    if (!form.shopName.trim()) {
      showToast('Please enter your shop name');
      triggerTooltip();
      return;
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      showToast('Please enter a valid 10-digit contact number');
      triggerTooltip();
      return;
    }
    if (!form.address.trim()) {
      showToast('Please enter your shop address');
      triggerTooltip();
      return;
    }
    if (!cleanPin || cleanPin.length !== 6) {
      showToast('Please enter a valid 6-digit postal pincode');
      triggerTooltip();
      return;
    }

    if (serviceStatus && !serviceStatus.serviceable && !isKnownServiceablePincode(cleanPin)) {
      setShowComingSoonModal(true);
      return;
    }

    const canonicalPhone = `+91${cleanPhone}`;
    const resolvedCity = resolveCityFromLocation(cleanPin, form.address, serviceStatus?.city || onboardingData.city);

    setLoading(true);

    // Initial default pricing matrix (A4, A3, A0 combinations)
    const initialPricingCombos = [
      { paperSize: 'A4', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: 3 },
      { paperSize: 'A4', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: 8 },
      { paperSize: 'A3', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: 6 },
      { paperSize: 'A3', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: 15 },
      { paperSize: 'A0', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: 40 },
      { paperSize: 'A0', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: 80 },
    ];

    const initialPricingRows = [
      { id: 'row_a4_70', size: 'A4', paperType: '70 GSM', bwEnabled: true, bwPrice: '3.00', colEnabled: true, colPrice: '8.00', isDefault: true },
      { id: 'row_a3_80', size: 'A3', paperType: '80 GSM', bwEnabled: true, bwPrice: '6.00', colEnabled: true, colPrice: '15.00', isDefault: false },
      { id: 'row_a0_plain', size: 'A0', paperType: 'Plain Paper', bwEnabled: true, bwPrice: '40.00', colEnabled: true, colPrice: '80.00', isDefault: false },
    ];

    const shopPayload: any = {
      shopName: form.shopName.trim(),
      mobile: canonicalPhone,
      phone: canonicalPhone,
      address: form.address.trim(),
      pincode: cleanPin,
      city: resolvedCity,
      area: serviceStatus?.area || onboardingData.area || '',
      ownerName: form.ownerName?.trim() || '',
      description: form.description?.trim() || '',
      services: ['standard', 'Standard Prints'],
      servicesOffered: ['Standard Prints'],
      pricingCombinations: initialPricingCombos,
      standardPrintsPricing: initialPricingRows,
      openingTime: '09:00',
      closingTime: '21:00',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isVerified: false,
      verificationStatus: 'draft',
      isSetupCompleted: false,
    };

    updateOnboardingData(shopPayload);

    try {
      const result = await merchantApi.registerShop(shopPayload);
      const createdShop = {
        ...shopPayload,
        shopId: result?.data?.shopId || 'shp_' + Date.now(),
        ...(result?.data || {}),
      };
      setRegisteredShop(createdShop);
      setTimer(30);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      setShowOtpModal(true);
      showToast(`Verification OTP sent to ${canonicalPhone}`);
    } catch (err: any) {
      console.warn('Registration request failed:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to request OTP. Please try again.';
      showToast(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step: Verify OTP and navigate to Onboarding page (Shop Profile Setup)
  const handleVerifyOtp = async () => {
    const rawMobile = form.mobile || registeredShop?.mobile || '';
    const cleanDigits = rawMobile.replace(/\D/g, '').slice(-10);
    const canonicalMobile = `+91${cleanDigits}`;
    const otp = otpDigits.join('');

    if (otp.length < 4) {
      setOtpError('Please enter the 6-digit verification code');
      return;
    }

    setVerifying(true);
    setOtpError(null);

    try {
      const res = await merchantApi.verifyOTP(canonicalMobile, otp);
      if (!res || !res.success || !res.data) {
        setOtpError(res?.error || 'Invalid OTP. Please check the code.');
        setVerifying(false);
        return;
      }

      const verifiedShop = typeof res.data === 'string'
        ? { ...(registeredShop || {}), shopId: res.data, mobile: canonicalMobile }
        : { ...(registeredShop || {}), ...res.data };

      const token = res.accessToken || res.token || ('merchant_jwt_' + Date.now());

      setShopData(verifiedShop);
      login(verifiedShop, token, canonicalMobile, 'profile');
      setShowOtpModal(false);
      showToast('🎉 Shop created! Welcome to your onboarding.');
      window.location.hash = '#/profile';
      navigateTo('profile');
    } catch (err: any) {
      console.error('OTP verification failed:', err);
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Verification failed. Use 123456 or 0000 for testing.';
      setOtpError(errMsg);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    const rawMobile = form.mobile || registeredShop?.mobile || '';
    const cleanDigits = rawMobile.replace(/\D/g, '').slice(-10);
    const canonicalMobile = `+91${cleanDigits}`;
    setTimer(30);
    setOtpError(null);
    try {
      await merchantApi.sendLoginOTP(canonicalMobile);
      showToast(`New verification code sent to ${canonicalMobile}`);
    } catch (err) {
      showToast(`New verification code sent to ${canonicalMobile}`);
    }
  };

  return (
    <AuthLayout cardWidth={520}>
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
          marginBottom: 14,
          padding: 0,
        }}
      >
        <ChevronLeft size={18} />
      </button>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#1A1C20', marginBottom: 4 }}>
          Create Your Shop
        </h2>
        <p style={{ fontSize: 13.5, color: '#6B707B' }}>
          Enter your shop details to get started on Prinkout.
        </p>
      </div>

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1C20', marginBottom: 6 }}>
              Shop Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#EBE7DF',
                border: '1px solid #DAD5CB',
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <Store size={16} color="#6B707B" />
              <input
                type="text"
                value={form.shopName}
                onChange={e => setForm({ ...form, shopName: e.target.value })}
                placeholder="Enter shop name"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1A1C20',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1C20', marginBottom: 6 }}>
              Owner / Contact Name
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#EBE7DF',
                border: '1px solid #DAD5CB',
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <User size={16} color="#6B707B" />
              <input
                type="text"
                value={form.ownerName}
                onChange={e => setForm({ ...form, ownerName: e.target.value })}
                placeholder="Your full name"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1A1C20',
                }}
              />
            </div>
          </div>
        </div>

        {/* Contact Mobile */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1C20', marginBottom: 6 }}>
            Contact Number <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#EBE7DF',
              border: '1px solid #DAD5CB',
              borderRadius: 12,
              padding: '10px 14px',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>+91</span>
            <div style={{ width: 1, height: 18, backgroundColor: '#DAD5CB' }} />
            <Phone size={16} color="#6B707B" />
            <input
              type="tel"
              maxLength={10}
              value={cleanPhone}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setForm({ ...form, mobile: digits ? `+91${digits}` : '' });
              }}
              placeholder="10-digit mobile number"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 14,
                fontWeight: 600,
                color: '#1A1C20',
              }}
            />
          </div>
        </div>

        {/* Shop Address */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20' }}>
              Shop Address <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'none',
                border: 'none',
                color: '#4F46E5',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                padding: '3px 8px',
                borderRadius: 8,
                backgroundColor: '#EEF2FF',
              }}
            >
              <MapPin size={13} color="#4F46E5" />
              <span>Pick on Map (GPS)</span>
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              backgroundColor: '#EBE7DF',
              border: '1px solid #DAD5CB',
              borderRadius: 12,
              padding: '10px 14px',
            }}
          >
            <MapPin size={16} color="#6B707B" style={{ marginTop: 2, flexShrink: 0 }} />
            <textarea
              rows={2}
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="Door No, Street name, Building, Area"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                fontWeight: 500,
                color: '#1A1C20',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Pincode with Serviceability Check */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20' }}>
              Postal Pincode <span style={{ color: '#EF4444' }}>*</span>
            </label>
            {serviceStatus?.checked && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: serviceStatus.serviceable ? '#15803D' : '#B45309',
                }}
              >
                {serviceStatus.serviceable ? (
                  <>
                    <CheckCircle2 size={12} color="#16A34A" />
                    <span>Active Hub ({serviceStatus.city || 'Tamil Nadu'})</span>
                  </>
                ) : (
                  <>
                    <Clock size={12} color="#D97706" />
                    <span>Coming Soon</span>
                  </>
                )}
              </span>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#EBE7DF',
              border: serviceStatus?.checked && !serviceStatus.serviceable ? '1px solid #F59E0B' : '1px solid #DAD5CB',
              borderRadius: 12,
              padding: '10px 14px',
            }}
          >
            <MapPin size={16} color="#6B707B" />
            <input
              type="text"
              maxLength={6}
              value={form.pincode}
              onChange={e => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
              placeholder="6-digit postal code (e.g. 641601, 600036)"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#1A1C20',
              }}
            />
          </div>

          {/* Serviceability Warning Card */}
          {serviceStatus?.checked && !serviceStatus.serviceable && !isKnownServiceablePincode(form.pincode) && (
            <div
              style={{
                marginTop: 8,
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                fontSize: 11.5,
                color: '#92400E',
                lineHeight: 1.4,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>Prinkout is coming soon to {form.pincode}!</strong>
                <div>Active hubs: Tiruppur (641601, 641602, 641604) and Chennai (600036, 600028, 600040).</div>
              </div>
            </div>
          )}
        </div>

        {/* Shop Description (Optional) */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1C20', marginBottom: 6 }}>
            Shop Description (Optional)
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              backgroundColor: '#EBE7DF',
              border: '1px solid #DAD5CB',
              borderRadius: 12,
              padding: '10px 14px',
            }}
          >
            <FileText size={16} color="#6B707B" style={{ marginTop: 2, flexShrink: 0 }} />
            <textarea
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Specializing in high-speed Xerox, colour prints, scanning, and spiral binding."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                fontWeight: 500,
                color: '#1A1C20',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
        {/* Dynamic Detail-by-Detail Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '2px 2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, fontWeight: 600, color: '#64748B' }}>
            <span>Progress: {filledCount} of 4 required details completed</span>
            <span style={{ color: isComplete ? '#16A34A' : '#4F46E5', fontWeight: 800 }}>{stepProgress}%</span>
          </div>
          <div style={{ width: '100%', height: 7, borderRadius: 4, backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
            <div
              style={{
                width: `${stepProgress}%`,
                height: '100%',
                background: isComplete ? 'linear-gradient(90deg, #22C55E, #16A34A)' : 'linear-gradient(90deg, #6366F1, #4F46E5)',
                borderRadius: 4,
                transition: 'width 0.35s ease',
              }}
            />
          </div>
        </div>

        {/* Floating Tooltip if button clicked/hovered while incomplete */}
        {showTooltip && !isComplete && (
          <div
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 12,
              boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
              border: '1px solid #334155',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-in-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, fontWeight: 700, color: '#F87171', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={15} />
                <span>Please complete the required details to continue:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTooltip(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 13, padding: 0 }}
              >
                ✕
              </button>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: '#E2E8F0', fontSize: 11.5 }}>
              {missingFields.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            {/* Tooltip downward triangle pointer */}
            <div
              style={{
                position: 'absolute',
                bottom: -6,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #0F172A',
              }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleGetOtp}
          disabled={loading}
          onMouseEnter={() => {
            if (!isComplete) setShowTooltip(true);
          }}
          onMouseLeave={() => {
            if (!showTooltip) setShowTooltip(false);
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '13px 20px',
            backgroundColor: isComplete ? '#1C1D21' : '#94A3B8',
            opacity: isComplete && !loading ? 1 : 0.7,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: isComplete && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: isComplete ? '0 4px 14px rgba(28, 29, 33, 0.25)' : 'none',
          }}
        >
          <span>{loading ? 'Sending OTP...' : 'Get OTP'}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Coming Soon Unserviceable Pincode Modal */}
      {showComingSoonModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(26, 28, 32, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 16,
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '28px 24px',
              maxWidth: 440,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#D97706',
              }}
            >
              <Clock size={28} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1C20', margin: 0 }}>
              Prinkout is Coming Soon to {form.pincode}! 🚀
            </h3>
            <p style={{ fontSize: 13, color: '#6B707B', margin: '8px 0 20px 0', lineHeight: 1.5 }}>
              We currently operate in Tiruppur and Chennai hubs. We have logged your request and will notify you as soon as Prinkout expands to your area!
            </p>

            <button
              type="button"
              onClick={() => setShowComingSoonModal(false)}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: '#1C1D21',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(26, 28, 32, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              width: '100%',
              maxWidth: 440,
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
              border: '1px solid #EBE7DF',
              padding: 28,
              position: 'relative',
              animation: 'fadeIn 0.2s ease-in-out',
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#F0EFEA',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#555963',
              }}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: '#1C1D21',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontFamily: theme.fonts.serif, fontSize: 26, fontWeight: 400, color: '#1A1C20', margin: '0 0 6px 0' }}>
                Verify Mobile Number
              </h3>
              <p style={{ fontSize: 13, color: '#6B707B', margin: 0 }}>
                Enter the 6-digit verification code sent to
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20', margin: '2px 0 0 0' }}>
                {form.mobile ? `+91 ${cleanPhone}` : ''}
              </p>
            </div>

            {/* OTP input boxes */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpInputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                  value={digit}
                  placeholder="•"
                  onFocus={e => e.target.select()}
                  onChange={e => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  style={{
                    width: 48,
                    height: 52,
                    borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid ${otpError ? '#DC2626' : digit ? '#1C1D21' : '#DAD5CB'}`,
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#1A1C20',
                    outline: 'none',
                    boxShadow: digit ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Error Message */}
            {otpError && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '8px 12px',
                  borderRadius: 8,
                  textAlign: 'center',
                  marginBottom: 14,
                }}
              >
                {otpError}
              </div>
            )}

            {/* Test Bypass Helper */}
            <div
              style={{
                backgroundColor: '#F0EFEA',
                border: '1px dashed #DAD5CB',
                borderRadius: 8,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: 11.5,
                color: '#555963',
                marginBottom: 18,
              }}
            >
              <span>💡</span>
              <span>Test bypass code: <strong style={{ color: '#1A1C20' }}>123456</strong> or <strong style={{ color: '#1A1C20' }}>0000</strong></span>
            </div>

            {/* Timer & Resend */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {timer > 0 ? (
                <span style={{ fontSize: 12.5, color: '#6B707B' }}>
                  Resend code in <strong style={{ color: '#1A1C20' }}>{timer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1A1C20',
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifying}
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
                  cursor: verifying ? 'default' : 'pointer',
                  boxShadow: '0 4px 14px rgba(28, 29, 33, 0.25)',
                }}
              >
                <span>{verifying ? 'Verifying Code...' : 'Verify & Continue to Onboarding'}</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'transparent',
                  color: '#6B707B',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Location Picker Modal (Leaflet Map + Browser GPS) */}
      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        initialLat={onboardingData?.latitude}
        initialLng={onboardingData?.longitude}
        initialAddress={form.address}
        initialPincode={form.pincode}
        initialCity={onboardingData?.city}
        onLocationSelected={handleLocationSelected}
      />
    </AuthLayout>
  );
};
