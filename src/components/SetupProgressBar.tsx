import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
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
} from 'lucide-react';

export const SetupProgressBar: React.FC = () => {
  const {
    isSetupPending,
    setupStep,
    setSetupStep,
    submitSetupForReview,
    shopData,
    authPhone,
  } = useMerchant();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isSetupPending) return null;

  const progressPercent = setupStep === 1 ? 33 : setupStep === 2 ? 66 : 100;

  const handleNext = () => {
    if (setupStep === 1) {
      setSetupStep(2);
    } else if (setupStep === 2) {
      setSetupStep(3);
    } else if (setupStep === 3) {
      setShowReviewModal(true);
    }
  };

  const handleBack = () => {
    if (setupStep === 2) {
      setSetupStep(1);
    } else if (setupStep === 3) {
      setSetupStep(2);
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
          padding: '12px 24px',
          background: 'linear-gradient(180deg, rgba(20, 22, 27, 0.96) 0%, #0D0E11 100%)',
          backdropFilter: 'blur(16px)',
          borderTop: '1.5px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Left Step Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 260 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 15,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              flexShrink: 0,
            }}
          >
            {setupStep}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>
                {setupStep === 1
                  ? 'Step 1: Shop Profile'
                  : setupStep === 2
                  ? 'Step 2: Settings (General)'
                  : 'Step 3: Pricing & Services'}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#CBD5E1',
                }}
              >
                Required
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>
              {setupStep === 1
                ? 'Fill shop contact, address & verification documents'
                : setupStep === 2
                ? 'Verify store details & notification preferences'
                : 'Configure paper sizes, GSM rates & fulfilment mode'}
            </div>
          </div>
        </div>

        {/* Center 3D Progress Bar */}
        <div style={{ flex: 1, maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
            <span style={{ color: '#E2E8F0', letterSpacing: '0.4px' }}>MANDATORY SETUP PROGRESS</span>
            <span style={{ color: progressPercent === 100 ? '#4ADE80' : '#818CF8' }}>{progressPercent}% Complete</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {setupStep > 1 && (
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

          <button
            type="button"
            onClick={handleNext}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 12,
              backgroundColor: setupStep === 3 ? '#16A34A' : '#4F46E5',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow:
                setupStep === 3
                  ? '0 4px 14px rgba(22, 163, 74, 0.45)'
                  : '0 4px 14px rgba(79, 70, 229, 0.45)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>
              {setupStep === 1
                ? 'Next: Settings General'
                : setupStep === 2
                ? 'Next: Pricing & Services'
                : 'Submit for Review'}
            </span>
            {setupStep === 3 ? <Sparkles size={16} /> : <ChevronRight size={16} />}
          </button>
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
                    Owner: {shopData?.ownerName || 'Merchant'} • Phone: {shopData?.mobile || authPhone || '+91 1212121212'} • Admin Full Access
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
