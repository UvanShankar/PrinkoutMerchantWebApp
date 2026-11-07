import React, { useState, useEffect } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ChevronLeft, ArrowRight, Store, Phone, FileText, MapPin } from 'lucide-react';
import { theme } from '../theme';

export const ShopOnboardingStep1: React.FC = () => {
  const { onboardingData, updateOnboardingData, navigateTo, showToast } = useMerchant();
  const [form, setForm] = useState({
    shopName: onboardingData.shopName || '',
    mobile: onboardingData.mobile || '',
    gstNumber: onboardingData.gstNumber || '',
    address: onboardingData.address || '',
  });

  // Ensure fields are synchronized whenever onboardingData updates or on remount
  useEffect(() => {
    setForm({
      shopName: onboardingData.shopName || '',
      mobile: onboardingData.mobile || '',
      gstNumber: onboardingData.gstNumber || '',
      address: onboardingData.address || '',
    });
  }, [
    onboardingData.shopName,
    onboardingData.mobile,
    onboardingData.gstNumber,
    onboardingData.address,
  ]);

  const handleNext = () => {
    if (!form.shopName.trim()) {
      showToast('Please enter your shop name');
      return;
    }
    const cleanPhone = form.mobile.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit contact number');
      return;
    }
    if (!form.address.trim()) {
      showToast('Please enter your shop address');
      return;
    }
    updateOnboardingData({ ...form, mobile: cleanPhone });
    navigateTo('onboarding-2');
  };

  const handleSaveAndReview = () => {
    if (!form.shopName.trim()) {
      showToast('Please enter your shop name');
      return;
    }
    const cleanPhone = form.mobile.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit contact number');
      return;
    }
    if (!form.address.trim()) {
      showToast('Please enter your shop address');
      return;
    }
    updateOnboardingData({ ...form, mobile: cleanPhone });
    navigateTo('onboarding-3');
  };

  return (
    <AuthLayout cardWidth={520}>
      <button
        onClick={() => {
          if (onboardingData.services) {
            navigateTo('onboarding-3');
          } else {
            navigateTo('login');
          }
        }}
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
          marginBottom: 12,
          padding: 0,
        }}
      >
        <ChevronLeft size={18} />
      </button>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#1A1C20', marginBottom: 4 }}>
          Create Your Shop
        </h2>
        <p style={{ fontSize: 13, color: '#6B707B' }}>
          Set up your print shop on Prinkout in a few simple steps.
        </p>
      </div>

      {/* Stepper Bar matching PDF */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 90, zIndex: 1 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#1C1D21',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            1
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#1A1C20', textAlign: 'center' }}>Shop Details</span>
        </div>

        <div style={{ flex: 1, height: 1, backgroundColor: '#D5D0C6', margin: '-18px 8px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 110, zIndex: 1 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#EBE7DF',
              border: '1px solid #DAD5CB',
              color: '#6B707B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            2
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#6B707B', textAlign: 'center' }}>Services & Pricing</span>
        </div>

        <div style={{ flex: 1, height: 1, backgroundColor: '#D5D0C6', margin: '-18px 8px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80, zIndex: 1 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#EBE7DF',
              border: '1px solid #DAD5CB',
              color: '#6B707B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            3
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#6B707B', textAlign: 'center' }}>Review</span>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Shop Details</h3>
        <p style={{ fontSize: 12.5, color: '#6B707B' }}>
          Add your shop information. This will be visible to customers.
        </p>
      </div>

      {/* Form Fields matching PDF */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1C20', marginBottom: 6 }}>
              Contact Number <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#EBE7DF',
                border: '1px solid #DAD5CB',
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <Phone size={15} color="#6B707B" />
              <input
                type="text"
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value })}
                placeholder="Enter contact number"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1A1C20',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1C20', marginBottom: 6 }}>
              GST Number (Optional)
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#EBE7DF',
                border: '1px solid #DAD5CB',
                borderRadius: 12,
                padding: '10px 14px',
              }}
            >
              <FileText size={15} color="#6B707B" />
              <input
                type="text"
                value={form.gstNumber}
                onChange={e => setForm({ ...form, gstNumber: e.target.value })}
                placeholder="Enter GST number"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1A1C20',
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1A1C20', marginBottom: 6 }}>
            Shop Address <span style={{ color: '#EF4444' }}>*</span>
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
            <MapPin size={16} color="#6B707B" />
            <input
              type="text"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="Enter shop address"
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={handleNext}
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
          <span>Continue to Services</span>
          <ArrowRight size={16} />
        </button>

        {onboardingData.services && (
          <button
            type="button"
            onClick={handleSaveAndReview}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#1A1C20',
              border: '1px solid #D5D0C6',
              borderRadius: 12,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>Save & Return to Review</span>
          </button>
        )}
      </div>
    </AuthLayout>
  );
};
