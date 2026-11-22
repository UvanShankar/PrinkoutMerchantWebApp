import React, { useState, useRef } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { merchantApi } from '../services/api';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileCheck,
  Store,
  Settings,
  Tag,
  ShieldCheck,
  X,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { resolveCityFromLocation } from '../utils/locationUtils';

const DEFAULT_OPENING_TIME = '09:00';
const DEFAULT_CLOSING_TIME = '21:00';
const DEFAULT_WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const SetupProgressBar: React.FC = () => {
  const {
    isSetupPending,
    setupStep,
    setSetupStep,
    submitSetupForReview,
    shopId,
    shopData,
    setShopData,
    authPhone,
    showToast,
    profileTab,
    setProfileTab,
  } = useMerchant();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showStepTooltip, setShowStepTooltip] = useState(false);
  const [stepMissingFields, setStepMissingFields] = useState<string[]>([]);
  const stepTooltipTimeoutRef = useRef<any>(null);

  if (!isSetupPending) return null;

  // Real-time detail completion tracking (fills dynamically as each detail is entered and saved)
  const resolvedShopCity = resolveCityFromLocation(shopData?.pincode, shopData?.address, shopData?.city);

  const hasServicesConfigured = Boolean(
    (Array.isArray(shopData?.services) && shopData.services.length > 0) ||
    (Array.isArray(shopData?.servicesOffered) && shopData.servicesOffered.length > 0) ||
    (Array.isArray(shopData?.standardPrintsPricing) && shopData.standardPrintsPricing.length > 0) ||
    shopData?.bwPrice ||
    shopData?.colorPrice
  );

  const hasPricingConfigured = Boolean(
    shopData?.pricing ||
    (Array.isArray(shopData?.paperRates) && shopData.paperRates.length > 0) ||
    (Array.isArray(shopData?.standardPrintsPricing) && shopData.standardPrintsPricing.length > 0) ||
    (Array.isArray(shopData?.pricingCombinations) && shopData.pricingCombinations.length > 0) ||
    (shopData?.bwPrice && shopData?.colorPrice)
  );

  const detailsTracking = [
    { key: 'shopName', label: 'Shop Name', filled: Boolean(shopData?.shopName?.trim()) },
    { key: 'address', label: 'Shop Address', filled: Boolean(shopData?.address?.trim()) },
    { key: 'city', label: 'City', filled: Boolean(resolvedShopCity) },
    { key: 'pincode', label: '6-digit Pincode', filled: Boolean(shopData?.pincode?.trim() && /^\d{6}$/.test(shopData.pincode.trim())) },
    { key: 'mobile', label: 'Phone Number', filled: Boolean(shopData?.mobile?.trim()) },
    { key: 'upiId', label: 'UPI ID for Payouts', filled: Boolean(shopData?.upiId?.trim() && shopData.upiId.includes('@')) },
    { key: 'documents', label: 'Verification Document / Store Photo', filled: Boolean((Array.isArray(shopData?.documents) && shopData.documents.length > 0) || (Array.isArray(shopData?.photos) && shopData.photos.length > 0)) },
    { key: 'hours', label: 'Operating Hours', filled: Boolean((shopData?.openingTime || DEFAULT_OPENING_TIME) && (shopData?.closingTime || DEFAULT_CLOSING_TIME)) },
    { key: 'days', label: 'Working Days', filled: Boolean((Array.isArray(shopData?.workingDays) && shopData.workingDays.length > 0) || DEFAULT_WORKING_DAYS.length > 0) },
    { key: 'services', label: 'Services Selected', filled: hasServicesConfigured },
    { key: 'pricing', label: 'Format Pricing Rates', filled: hasPricingConfigured },
  ];

  const totalDetailsCount = detailsTracking.length;
  const completedDetailsCount = detailsTracking.filter(d => d.filled).length;
  const progressPercent = Math.min(100, Math.round((completedDetailsCount / totalDetailsCount) * 100));

  // Granular validations per tab and step
  const getTab1Missing = () => {
    const missing: string[] = [];
    if (!shopData?.shopName?.trim()) missing.push('Shop Name');
    if (!shopData?.address?.trim()) missing.push('Shop Address');
    if (!resolvedShopCity) missing.push('City (Location)');
    if (!shopData?.pincode?.trim() || !/^\d{6}$/.test(shopData.pincode.trim())) missing.push('6-digit Pincode');
    if (!shopData?.mobile?.trim()) missing.push('Phone Number');
    if (!shopData?.upiId?.trim() || !shopData.upiId.includes('@')) missing.push('UPI ID for Payouts');
    return missing;
  };

  const getTab2Missing = () => {
    const missing: string[] = [];
    const hasDoc =
      (Array.isArray(shopData?.documents) && shopData.documents.length > 0) ||
      (Array.isArray(shopData?.photos) && shopData.photos.length > 0);
    if (!hasDoc) {
      missing.push('Verification Document or Storefront Photo');
    }
    return missing;
  };

  const getTab3Missing = () => {
    const missing: string[] = [];
    const opening = shopData?.openingTime !== undefined ? shopData.openingTime : DEFAULT_OPENING_TIME;
    const closing = shopData?.closingTime !== undefined ? shopData.closingTime : DEFAULT_CLOSING_TIME;
    const days = (Array.isArray(shopData?.workingDays) && shopData.workingDays.length > 0)
      ? shopData.workingDays
      : DEFAULT_WORKING_DAYS;

    if (!opening || !opening.trim()) {
      missing.push('Opening Time');
    }
    if (!closing || !closing.trim()) {
      missing.push('Closing Time');
    }
    if (!Array.isArray(days) || days.length === 0) {
      missing.push('Operating Hours & Working Days');
    }
    return missing;
  };

  // Step 3 Validation
  const getStep3Missing = () => {
    const missing: string[] = [];
    if (!hasServicesConfigured) {
      missing.push('Select at least 1 Print Service');
    }
    if (!hasPricingConfigured) {
      missing.push('Paper Rates & Pricing configuration');
    }
    return missing;
  };

  const tab1Missing = getTab1Missing();
  const tab2Missing = getTab2Missing();
  const tab3Missing = getTab3Missing();
  const step3Missing = getStep3Missing();

  const activeProfileTab = profileTab || 'details';

  let isCurrentStepComplete = false;
  let currentStepMissing: string[] = [];
  let nextButtonLabel = '';
  let onNextAction: () => void = () => {};
  let canGoBack = false;
  let onBackAction: () => void = () => {};

  if (setupStep === 1) {
    if (activeProfileTab === 'details') {
      isCurrentStepComplete = tab1Missing.length === 0;
      currentStepMissing = tab1Missing;
      nextButtonLabel = 'Next: Verification Documents';
      onNextAction = () => {
        setProfileTab('documents');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      canGoBack = false;
    } else if (activeProfileTab === 'documents') {
      isCurrentStepComplete = tab2Missing.length === 0;
      currentStepMissing = tab2Missing;
      nextButtonLabel = 'Next: Operating Hours & Days';
      onNextAction = () => {
        setProfileTab('hours');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      canGoBack = true;
      onBackAction = () => {
        setProfileTab('details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    } else if (activeProfileTab === 'hours') {
      isCurrentStepComplete = tab3Missing.length === 0;
      currentStepMissing = tab3Missing;
      nextButtonLabel = 'Next: Store Preferences (Step 2)';
      onNextAction = () => {
        const opening = shopData?.openingTime?.trim() || DEFAULT_OPENING_TIME;
        const closing = shopData?.closingTime?.trim() || DEFAULT_CLOSING_TIME;
        const days = Array.isArray(shopData?.workingDays) && shopData.workingDays.length > 0
          ? shopData.workingDays
          : DEFAULT_WORKING_DAYS;

        const updatedHours = {
          openingTime: opening,
          closingTime: closing,
          workingDays: days,
        };

        setShopData((prev: any) => ({ ...prev, ...updatedHours }));
        try {
          const raw = localStorage.getItem('prinkout_merchant_session');
          if (raw) {
            const sess = JSON.parse(raw);
            sess.shopData = { ...(sess.shopData || {}), ...updatedHours };
            localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
          }
        } catch {}

        const activeShopId = shopId || shopData?.shopId;
        if (activeShopId) {
          merchantApi.updateShopProfile(activeShopId, updatedHours).catch(() => {});
        }

        setSetupStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      canGoBack = true;
      onBackAction = () => {
        setProfileTab('documents');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    } else {
      // preview tab
      isCurrentStepComplete = true;
      currentStepMissing = [];
      nextButtonLabel = 'Next: Store Preferences (Step 2)';
      onNextAction = () => {
        setSetupStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      canGoBack = true;
      onBackAction = () => {
        setProfileTab('hours');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }
  } else if (setupStep === 2) {
    isCurrentStepComplete = true;
    currentStepMissing = [];
    nextButtonLabel = 'Next: Pricing & Services (Step 3)';
    onNextAction = () => {
      setSetupStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    canGoBack = true;
    onBackAction = () => {
      setSetupStep(1);
      setProfileTab('hours');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  } else if (setupStep === 3) {
    isCurrentStepComplete = step3Missing.length === 0;
    currentStepMissing = step3Missing;
    nextButtonLabel = 'Submit Profile for Review';
    onNextAction = () => {
      setShowReviewModal(true);
    };
    canGoBack = true;
    onBackAction = () => {
      setSetupStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  const triggerStepTooltip = (missing: string[]) => {
    setStepMissingFields(missing);
    setShowStepTooltip(true);
    if (stepTooltipTimeoutRef.current) clearTimeout(stepTooltipTimeoutRef.current);
    stepTooltipTimeoutRef.current = setTimeout(() => setShowStepTooltip(false), 5000);
  };

  const handleNext = () => {
    if (!isCurrentStepComplete) {
      triggerStepTooltip(currentStepMissing);
      showToast(`Please complete: ${currentStepMissing[0] || 'required details'}`);
      return;
    }
    onNextAction();
  };

  const handleBack = () => {
    if (canGoBack) {
      onBackAction();
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      setSubmitting(true);
      await submitSetupForReview();
      setShowReviewModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 3D Bottom Floating Progress Bar Container */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: '14px 28px',
          background: 'linear-gradient(180deg, #1C1F27 0%, #111318 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '2px solid #6366F1',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        {/* Left Step Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 280 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
              border: '2px solid #A5B4FC',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 17,
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.55)',
              flexShrink: 0,
            }}
          >
            {setupStep}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>
                {setupStep === 1
                  ? activeProfileTab === 'details'
                    ? 'Step 1: Shop Details'
                    : activeProfileTab === 'documents'
                    ? 'Step 1: Documents & Photos'
                    : activeProfileTab === 'hours'
                    ? 'Step 1: Operating Hours & Days'
                    : 'Step 1: Store Preview'
                  : setupStep === 2
                  ? 'Step 2: Settings (General)'
                  : 'Step 3: Pricing & Services'}
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.45)',
                }}
              >
                Required
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9', marginTop: 3 }}>
              {setupStep === 1
                ? activeProfileTab === 'details'
                  ? 'Enter shop name, address, pincode & payout UPI ID'
                  : activeProfileTab === 'documents'
                  ? 'Upload verification documents or storefront photo'
                  : activeProfileTab === 'hours'
                  ? 'Set shop opening & closing hours and working days'
                  : 'Preview your store profile'
                : setupStep === 2
                ? 'Verify store details & notification preferences'
                : 'Configure paper sizes, GSM rates & fulfilment mode'}
            </div>
          </div>
        </div>

        {/* Center 3D Progress Bar */}
        <div style={{ flex: 1, maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 800 }}>
            <span style={{ color: '#FFFFFF', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              MANDATORY SETUP PROGRESS ({completedDetailsCount}/{totalDetailsCount} details)
            </span>
            <span
              style={{
                color: progressPercent === 100 ? '#4ADE80' : '#93C5FD',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {progressPercent}% Complete
            </span>
          </div>

          {/* 3D Track */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 16,
              borderRadius: 12,
              backgroundColor: '#1E2128',
              boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.6), 0 1px 1px rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              padding: 2,
              boxSizing: 'border-box',
            }}
          >
            {/* 3D Fill Bar */}
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                borderRadius: 10,
                background:
                  progressPercent === 100
                    ? 'linear-gradient(180deg, #4ADE80 0%, #16A34A 55%, #14532D 100%)'
                    : 'linear-gradient(180deg, #A5B4FC 0%, #6366F1 50%, #4338CA 100%)',
                boxShadow:
                  progressPercent === 100
                    ? '0 0 14px rgba(74, 222, 128, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.7)'
                    : '0 0 14px rgba(99, 102, 241, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
            >
              {/* Glossy highlight layer */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '45%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 100%)',
                  borderRadius: '10px 10px 0 0',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Navigation Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          {/* Floating Tooltip if button hovered/clicked while current step incomplete */}
          {showStepTooltip && !isCurrentStepComplete && currentStepMissing.length > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 14px)',
                right: 0,
                width: 300,
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 12,
                boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
                border: '1px solid #334155',
                zIndex: 60,
                animation: 'fadeIn 0.2s ease-in-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#F87171' }}>
                  <AlertCircle size={15} />
                  <span>Required before proceeding:</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStepTooltip(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 13, padding: 0 }}
                >
                  ✕
                </button>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5, color: '#E2E8F0', fontSize: 11.5 }}>
                {currentStepMissing.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              {/* Tooltip downward triangle pointer */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  right: 35,
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #0F172A',
                }}
              />
            </div>
          )}

          {canGoBack && (
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          )}

          <div
            onMouseEnter={() => {
              if (!isCurrentStepComplete) triggerStepTooltip(currentStepMissing);
            }}
            onMouseLeave={() => {
              setShowStepTooltip(false);
            }}
            style={{ display: 'inline-flex' }}
          >
            <button
              type="button"
              disabled={!isCurrentStepComplete}
              onClick={isCurrentStepComplete ? handleNext : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 12,
                backgroundColor: isCurrentStepComplete
                  ? setupStep === 3
                    ? '#16A34A'
                    : '#4F46E5'
                  : '#475569',
                opacity: isCurrentStepComplete ? 1 : 0.45,
                border: 'none',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                cursor: isCurrentStepComplete ? 'pointer' : 'not-allowed',
                boxShadow: isCurrentStepComplete
                  ? setupStep === 3
                    ? '0 4px 14px rgba(22, 163, 74, 0.45)'
                    : '0 4px 14px rgba(79, 70, 229, 0.45)'
                  : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{nextButtonLabel}</span>
              {setupStep === 3 ? <Sparkles size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Submit for Review Confirmation Pop-up Modal */}
      {showReviewModal && (
        <div
          onClick={() => setShowReviewModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              width: '100%',
              maxWidth: 540,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.35)',
              border: '1px solid #EBE7DF',
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #F0ECE4', paddingBottom: 14 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 9px', borderRadius: 12, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                  <ShieldCheck size={13} />
                  <span>Setup Complete</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1C20', margin: 0 }}>
                  Submit Shop Profile for Review
                </h3>
                <p style={{ fontSize: 12, color: '#8E929B', margin: '4px 0 0 0' }}>
                  Your shop will be submitted to the Prinkout review team. All portal tabs will unlock immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#8E929B',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Checklist summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Step 1 Review Card */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EAE6DC' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Store size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Step 1: Shop Profile</span>
                    <CheckCircle2 size={16} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 11.5, color: '#555963', marginTop: 2 }}>
                    {shopData?.shopName || 'Print Shop'} • {shopData?.address || 'Address configured'} • UPI: {shopData?.upiId || 'Configured'}
                  </div>
                </div>
              </div>

              {/* Step 2 Review Card */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EAE6DC' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Settings size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Step 2: Settings (General)</span>
                    <CheckCircle2 size={16} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 11.5, color: '#555963', marginTop: 2 }}>
                    Owner: {shopData?.ownerName || 'Merchant'} • Phone: {shopData?.mobile || authPhone || ''} • Admin Full Access
                  </div>
                </div>
              </div>

              {/* Step 3 Review Card */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EAE6DC' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Tag size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Step 3: Pricing & Services</span>
                    <CheckCircle2 size={16} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 11.5, color: '#555963', marginTop: 2 }}>
                    Standard Prints (A4 70 GSM B&W and Colour enabled) • Mode: {shopData?.fulfilmentMode || 'Store Pickup Only'}
                  </div>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#166534' }}>
              ✓ By clicking Submit for Review, your setup is marked as completed and sent for official verification. All portal tabs will be unlocked.
            </div>

            {/* Modal Bottom Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: 12,
                  border: '1px solid #DAD5CB',
                  backgroundColor: '#FFFFFF',
                  color: '#1A1C20',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmSubmit}
                style={{
                  flex: 1.5,
                  padding: '11px 16px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                }}
              >
                <FileCheck size={16} />
                <span>{submitting ? 'Submitting...' : 'Confirm & Submit for Review'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
