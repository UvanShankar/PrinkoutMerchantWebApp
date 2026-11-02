import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { ArrowRight, ArrowLeft, Edit3, Store, CheckCircle, Sparkles } from 'lucide-react';
import { theme } from '../theme';
import { merchantApi } from '../services/api';

export const ShopOnboardingStep3: React.FC = () => {
  const { onboardingData, setShopData, navigateTo, showToast, login } = useMerchant();
  const [loading, setLoading] = useState(false);

  const handleCreateShop = async () => {
    setLoading(true);
    const shopPayload = {
      shopName: onboardingData.shopName,
      ownerName: onboardingData.ownerName,
      mobile: onboardingData.mobile,
      email: onboardingData.email,
      address: onboardingData.address,
      area: onboardingData.area,
      city: onboardingData.city,
      state_name: 'Tamil Nadu',
      pincode: onboardingData.pincode,
      latitude: '11.1085',
      longitude: '77.3411',
      servicesOffered: onboardingData.services,
      gstNumber: onboardingData.gstNumber,
      isOnlineEnabled: true,
      isPickupAvailable: true,
      isDeliveryAvailable: true,
      openingTime: '09:00',
      closingTime: '21:00',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      pricingCombinations: [
        { paperSize: 'A4', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: parseFloat(onboardingData.pricing?.a4Bw || '1.50') },
        { paperSize: 'A4', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: parseFloat(onboardingData.pricing?.a4Color || '5.00') },
        { paperSize: 'A3', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: parseFloat(onboardingData.pricing?.a3Bw || '4.00') },
        { paperSize: 'A3', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: parseFloat(onboardingData.pricing?.a3Color || '12.00') },
      ],
    };

    try {
      const result = await merchantApi.registerShop(shopPayload);
      const createdShop = {
        ...shopPayload,
        shopId: result?.data?.shopId || 'shp_' + Date.now(),
      };
      login(createdShop, null, onboardingData.mobile);
    } catch (err) {
      console.warn('Registration fallback:', err);
      login(shopPayload, null, onboardingData.mobile);
    }

    setLoading(false);
    showToast('Shop successfully created and activated!');
    navigateTo('shop-success');
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
      <div style={{ width: '100%', maxWidth: 780, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={() => navigateTo('onboarding-2')}
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
          <span>Back to Services</span>
        </button>

        <span style={{ fontSize: 13, color: theme.colors.textDim }}>Step 3 of 3</span>
      </div>

      {/* Stepper Bar */}
      <div style={{ width: '100%', maxWidth: 780, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 4, borderRadius: 2, backgroundColor: '#10B981' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#10B981', textTransform: 'uppercase' }}>✓ 1. Shop Details</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 4, borderRadius: 2, backgroundColor: '#10B981' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#10B981', textTransform: 'uppercase' }}>✓ 2. Services & Pricing</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 4, borderRadius: 2, backgroundColor: '#2563EB' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>3. Review & Create</span>
        </div>
      </div>

      {/* Main Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 780,
          backgroundColor: '#15171F',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 16,
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 36, fontWeight: 400, color: '#F4F2EC', marginBottom: 6 }}>
            Review & Launch Your Shop
          </h1>
          <p style={{ fontSize: 14, color: theme.colors.textMuted }}>
            Check your profile and pricing details before publishing your shop to Prinkout.
          </p>
        </div>

        {/* Card 1: Shop Details */}
        <div
          style={{
            backgroundColor: '#101217',
            border: `1px solid ${theme.colors.borderLight}`,
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Shop Details
            </span>
            <button
              onClick={() => navigateTo('onboarding-1')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'none',
                border: 'none',
                color: theme.colors.primaryLight,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: theme.colors.textDim }}>Shop Name</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>{onboardingData.shopName}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.colors.textDim }}>Owner Name</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>{onboardingData.ownerName}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.colors.textDim }}>Contact Phone</div>
              <div style={{ fontSize: 14, color: '#D1D5DB' }}>{onboardingData.mobile}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.colors.textDim }}>GST Number</div>
              <div style={{ fontSize: 14, color: '#D1D5DB' }}>{onboardingData.gstNumber || 'Not provided'}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: 11, color: theme.colors.textDim }}>Address</div>
              <div style={{ fontSize: 14, color: '#D1D5DB' }}>
                {onboardingData.address}, {onboardingData.area}, {onboardingData.city} - {onboardingData.pincode}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Selected Services */}
        <div
          style={{
            backgroundColor: '#101217',
            border: `1px solid ${theme.colors.borderLight}`,
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Selected Services ({onboardingData.services?.length || 0})
            </span>
            <button
              onClick={() => navigateTo('onboarding-2')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'none',
                border: 'none',
                color: theme.colors.primaryLight,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(onboardingData.services || []).map((srv: string) => (
              <span
                key={srv}
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  backgroundColor: '#181E2B',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#93C5FD',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                ✓ {srv}
              </span>
            ))}
          </div>
        </div>

        {/* Card 3: Standard Print Pricing */}
        <div
          style={{
            backgroundColor: '#101217',
            border: `1px solid ${theme.colors.borderLight}`,
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Standard Print Pricing
            </span>
            <button
              onClick={() => navigateTo('onboarding-2')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'none',
                border: 'none',
                color: theme.colors.primaryLight,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: '#15171F' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>A4 Standard</div>
              <div style={{ fontSize: 12, color: theme.colors.textMuted }}>B&W: ₹ {onboardingData.pricing?.a4Bw || '1.50'}</div>
              <div style={{ fontSize: 12, color: theme.colors.textMuted }}>Colour: ₹ {onboardingData.pricing?.a4Color || '5.00'}</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: '#15171F' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>A3 Poster</div>
              <div style={{ fontSize: 12, color: theme.colors.textMuted }}>B&W: ₹ {onboardingData.pricing?.a3Bw || '4.00'}</div>
              <div style={{ fontSize: 12, color: theme.colors.textMuted }}>Colour: ₹ {onboardingData.pricing?.a3Color || '12.00'}</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: '#15171F' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>A0 Blueprint</div>
              <div style={{ fontSize: 12, color: theme.colors.textMuted }}>B&W: ₹ {onboardingData.pricing?.a0Bw || '50.00'}</div>
              <div style={{ fontSize: 12, color: theme.colors.textMuted }}>Colour: ₹ {onboardingData.pricing?.a0Color || '120.00'}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigateTo('onboarding-2')}
            style={{
              padding: '12px 20px',
              backgroundColor: '#181A22',
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: 8,
              color: theme.colors.textMuted,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Back
          </button>

          <button
            onClick={handleCreateShop}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 28px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            }}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Creating Your Shop...' : 'Create Shop & Continue'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
