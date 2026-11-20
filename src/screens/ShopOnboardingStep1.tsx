import React, { useState, useEffect } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ChevronLeft, ArrowRight, Store, Phone, FileText, MapPin, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';
import { theme } from '../theme';
import { merchantApi } from '../services/api';

export const ShopOnboardingStep1: React.FC = () => {
  const { onboardingData, updateOnboardingData, navigateTo, showToast } = useMerchant();
  const [form, setForm] = useState({
    shopName: onboardingData.shopName || '',
    mobile: onboardingData.mobile || '',
    gstNumber: onboardingData.gstNumber || '',
    address: onboardingData.address || '',
    pincode: onboardingData.pincode || '641601',
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

  // Ensure fields are synchronized whenever onboardingData updates or on remount
  useEffect(() => {
    setForm({
      shopName: onboardingData.shopName || '',
      mobile: onboardingData.mobile || '',
      gstNumber: onboardingData.gstNumber || '',
      address: onboardingData.address || '',
      pincode: onboardingData.pincode || '641601',
    });
  }, [
    onboardingData.shopName,
    onboardingData.mobile,
    onboardingData.gstNumber,
    onboardingData.address,
    onboardingData.pincode,
  ]);

  // Live serviceability check on pincode change
  useEffect(() => {
    const pin = form.pincode?.trim().replace(/\D/g, '');
    if (pin && pin.length === 6) {
      merchantApi.checkServiceability(pin).then((res) => {
        setServiceStatus({
          checked: true,
          serviceable: res?.serviceable ?? false,
          area: res?.location?.area,
          city: res?.location?.city,
          status: res?.status,
          message: res?.message,
        });
      });
    } else {
      setServiceStatus(null);
    }
  }, [form.pincode]);

  const validateAndProceed = (callback: () => void) => {
    if (!form.shopName.trim()) {
      showToast('Please enter your shop name');
      return;
    }
    const cleanPhone = form.mobile.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      showToast('Please enter a valid 10-digit contact number');
      return;
    }
    if (!form.address.trim()) {
      showToast('Please enter your shop address');
      return;
    }
    const cleanPin = form.pincode.trim().replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      showToast('Please enter a valid 6-digit postal pincode');
      return;
    }

    if (serviceStatus && !serviceStatus.serviceable) {
      setShowComingSoonModal(true);
      return;
    }

    const canonicalPhone = `+91${cleanPhone}`;
    updateOnboardingData({
      ...form,
      pincode: cleanPin,
      city: serviceStatus?.city || onboardingData.city || 'Tiruppur',
      area: serviceStatus?.area || onboardingData.area || '',
      mobile: canonicalPhone,
      phone: canonicalPhone,
    });
    callback();
  };

  const handleNext = () => {
    validateAndProceed(() => navigateTo('onboarding-2'));
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

        {/* Pincode & Serviceability Check */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
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
                    <span>Active Hub ({serviceStatus.city})</span>
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

          {/* Serviceability Warning Card if unserviceable */}
          {serviceStatus?.checked && !serviceStatus.serviceable && (
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
                <div>Currently active hubs: Tiruppur (641601, 641602, 641604) and Chennai (600036, 600028, 600040).</div>
              </div>
            </div>
          )}
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

            <p style={{ fontSize: 13, color: '#6B707B', margin: '10px 0 20px', lineHeight: 1.5 }}>
              To ensure top-tier student delivery speeds and reliable merchant payouts, Prinkout is rolling out hub by hub. We are currently active in <strong>Chennai</strong> and <strong>Tiruppur</strong>.
            </p>

            <div
              style={{
                backgroundColor: '#F5F3EF',
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 20,
                textAlign: 'left',
                fontSize: 12,
                color: '#494D57',
              }}
            >
              <div style={{ fontWeight: 700, color: '#1A1C20', marginBottom: 4 }}>
                Active Service Hubs:
              </div>
              <div>• Tiruppur Core: <strong>641601, 641602, 641604</strong></div>
              <div>• Chennai (IITM / Central): <strong>600036, 600028, 600040</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, pincode: '641601' });
                  setShowComingSoonModal(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1C1D21',
                  color: '#FFFFFF',
                  borderRadius: 12,
                  fontSize: 13.5,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Use Active Launch Hub (641601)
              </button>

              <button
                type="button"
                onClick={() => setShowComingSoonModal(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'transparent',
                  color: '#6B707B',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Edit Pincode
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
