import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { Store, ArrowRight, ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react';
import { theme } from '../theme';

export const ShopOnboardingStep1: React.FC = () => {
  const { onboardingData, updateOnboardingData, navigateTo, showToast } = useMerchant();

  const [form, setForm] = useState({
    shopName: onboardingData.shopName || '',
    ownerName: onboardingData.ownerName || '',
    mobile: onboardingData.mobile || '',
    email: onboardingData.email || '',
    gstNumber: onboardingData.gstNumber || '',
    address: onboardingData.address || '',
    area: onboardingData.area || '',
    city: onboardingData.city || '',
    pincode: onboardingData.pincode || '',
  });

  const handleChange = (field: string, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (!form.shopName || !form.ownerName || !form.address || !form.pincode) {
      showToast('Please fill in all mandatory shop details');
      return;
    }
    updateOnboardingData(form);
    navigateTo('onboarding-2');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#0E1013',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '36px 16px',
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Top Header */}
      <div style={{ width: '100%', maxWidth: 720, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={() => navigateTo('login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: theme.colors.textMuted,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Exit Onboarding</span>
        </button>

        <span style={{ fontSize: 13, color: theme.colors.textDim }}>Step 1 of 3</span>
      </div>

      {/* Stepper Bar */}
      <div style={{ width: '100%', maxWidth: 720, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 4, borderRadius: 2, backgroundColor: '#2563EB' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>1. Shop Details</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 4, borderRadius: 2, backgroundColor: '#262934' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: theme.colors.textDim, textTransform: 'uppercase' }}>2. Services & Pricing</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 4, borderRadius: 2, backgroundColor: '#262934' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: theme.colors.textDim, textTransform: 'uppercase' }}>3. Review & Create</span>
        </div>
      </div>

      {/* Main Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          backgroundColor: '#15171F',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 16,
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 36, fontWeight: 400, color: '#F4F2EC', marginBottom: 6 }}>
            Set Up Your Shop Details
          </h1>
          <p style={{ fontSize: 14, color: theme.colors.textMuted }}>
            Customers in your area will discover your shop and place print orders directly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
              Shop Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={form.shopName}
              onChange={e => handleChange('shopName', e.target.value)}
              placeholder="e.g. Sabarish Prints"
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#101217',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
              Owner / Contact Person <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={form.ownerName}
              onChange={e => handleChange('ownerName', e.target.value)}
              placeholder="e.g. Sabarish K"
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#101217',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
              Contact Phone <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={form.mobile}
              onChange={e => handleChange('mobile', e.target.value)}
              placeholder="+91 98765 43210"
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#101217',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
              Business Email (Optional)
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="sabarish@prinkout.com"
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#101217',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
            GST Identification Number (Optional)
          </label>
          <input
            type="text"
            value={form.gstNumber}
            onChange={e => handleChange('gstNumber', e.target.value)}
            placeholder="33AABCU9603R1ZM"
            style={{
              width: '100%',
              padding: '11px 14px',
              backgroundColor: '#101217',
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: 8,
              color: '#FFFFFF',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
            Complete Shop Address <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            rows={2}
            value={form.address}
            onChange={e => handleChange('address', e.target.value)}
            placeholder="88, Kumaran Rd, Opp. Town Hall, Kannipiran Colony"
            style={{
              width: '100%',
              padding: '11px 14px',
              backgroundColor: '#101217',
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: 8,
              color: '#FFFFFF',
              fontSize: 14,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
              Area / Locality
            </label>
            <input
              type="text"
              value={form.area}
              onChange={e => handleChange('area', e.target.value)}
              placeholder="Valipalayam"
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#101217',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={e => handleChange('city', e.target.value)}
              placeholder="Tiruppur"
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#101217',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
              Pincode <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={form.pincode}
              onChange={e => handleChange('pincode', e.target.value)}
              placeholder="641601"
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#101217',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 26px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            }}
          >
            <span>Continue to Services</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
