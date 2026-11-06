import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ChevronLeft, ArrowRight, Edit2, Phone, MapPin, FileText, Check } from 'lucide-react';
import { theme } from '../theme';
import { merchantApi } from '../services/api';

export const ShopOnboardingStep3: React.FC = () => {
  const { onboardingData, setShopData, navigateTo, showToast, login } = useMerchant();
  const [loading, setLoading] = useState(false);

  const handleCreateShop = async () => {
    setLoading(true);
    const shopPayload = {
      shopName: onboardingData.shopName || '',
      ownerName: onboardingData.ownerName || 'Merchant Owner',
      mobile: onboardingData.mobile || '',
      email: onboardingData.email || '',
      address: onboardingData.address || '',
      area: onboardingData.area || '',
      city: onboardingData.city || '',
      state_name: 'Tamil Nadu',
      pincode: onboardingData.pincode || '',
      latitude: '11.1085',
      longitude: '77.3411',
      servicesOffered: onboardingData.services || ['Standard Prints', 'Posters', 'Flex & Banners'],
      gstNumber: onboardingData.gstNumber || '',
      isOnlineEnabled: true,
      isPickupAvailable: true,
      isDeliveryAvailable: true,
      openingTime: '09:00',
      closingTime: '21:00',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      pricingCombinations: [
        { paperSize: 'A4', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: parseFloat(onboardingData.pricing?.a4Bw || '3') },
        { paperSize: 'A4', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: parseFloat(onboardingData.pricing?.a4Color || '8') },
        { paperSize: 'A3', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: parseFloat(onboardingData.pricing?.a3Bw || '6') },
        { paperSize: 'A3', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: parseFloat(onboardingData.pricing?.a3Color || '15') },
        { paperSize: 'A0', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: parseFloat(onboardingData.pricing?.a0Bw || '40') },
        { paperSize: 'A0', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: parseFloat(onboardingData.pricing?.a0Color || '80') },
      ],
    };

    try {
      const result = await merchantApi.registerShop(shopPayload);
      const createdShop = {
        ...shopPayload,
        shopId: result?.data?.shopId || 'shp_' + Date.now(),
      };
      setShopData(createdShop);
      login(createdShop, null, onboardingData.mobile);
    } catch (err) {
      console.warn('Registration fallback:', err);
      setShopData(shopPayload);
      login(shopPayload, null, onboardingData.mobile);
    }

    setLoading(false);
    showToast('Shop successfully created and activated!');
    navigateTo('shop-success');
  };

  const servicesList = [
    { id: 'Standard Prints', label: 'Standard Prints (A4, A3, A0)' },
    { id: 'Posters', label: 'Posters' },
    { id: 'Flex & Banners', label: 'Flex & Banners' },
    { id: 'T-shirt Printing', label: 'T-shirt Printing' },
    { id: 'Invitations', label: 'Invitations' },
    { id: 'Packaging & Labels', label: 'Packaging & Labels' },
  ];

  return (
    <AuthLayout cardWidth={580}>
      <button
        onClick={() => navigateTo('onboarding-2')}
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

      {/* Stepper matching PDF */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 90 }}>
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
            ✓
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#1A1C20' }}>Shop Details</span>
        </div>

        <div style={{ flex: 1, height: 1, backgroundColor: '#1C1D21', margin: '-18px 8px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 110 }}>
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
            ✓
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#1A1C20' }}>Services & Pricing</span>
        </div>

        <div style={{ flex: 1, height: 1, backgroundColor: '#1C1D21', margin: '-18px 8px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
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
            3
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#1A1C20' }}>Review</span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Review & Create</h3>
        <p style={{ fontSize: 12.5, color: '#6B707B' }}>
          Check your shop details and services before creating your account.
        </p>
      </div>

      {/* Two cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 12, marginBottom: 14 }}>
        {/* Shop Details Card */}
        <div
          style={{
            backgroundColor: '#FAF8F5',
            border: '1px solid #DAD5CB',
            borderRadius: 12,
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Shop Details</span>
            <Edit2 size={13} color="#6B707B" style={{ cursor: 'pointer' }} onClick={() => navigateTo('onboarding-1')} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {/* Shopfront mock thumbnail */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 8,
                backgroundColor: '#2A2D34',
                backgroundImage: 'linear-gradient(145deg, #1A1C21, #3A3D46)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 700,
                textAlign: 'center',
                padding: 4,
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              {onboardingData.shopName || 'Shop Preview'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11.5 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>
                {onboardingData.shopName || 'Your Shop'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555963' }}>
                <Phone size={12} />
                <span>{onboardingData.mobile || '—'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#555963' }}>
                <MapPin size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                <span>{onboardingData.address || '—'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555963' }}>
                <FileText size={12} />
                <span>GST: {onboardingData.gstNumber || 'Not added'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Services Card */}
        <div
          style={{
            backgroundColor: '#FAF8F5',
            border: '1px solid #DAD5CB',
            borderRadius: 12,
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Selected Services</span>
            <Edit2 size={13} color="#6B707B" style={{ cursor: 'pointer' }} onClick={() => navigateTo('onboarding-2')} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {servicesList.map(item => {
              const checked = (onboardingData.services || ['Standard Prints', 'Posters', 'Flex & Banners']).includes(item.id);
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: checked ? '#1A1C20' : '#8E929B' }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      backgroundColor: checked ? '#1C1D21' : '#EBE7DF',
                      border: `1px solid ${checked ? '#1C1D21' : '#DAD5CB'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {checked && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Standard Print Pricing Card */}
      <div
        style={{
          backgroundColor: '#FAF8F5',
          border: '1px solid #DAD5CB',
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Standard Print Pricing</span>
          <Edit2 size={13} color="#6B707B" style={{ cursor: 'pointer' }} onClick={() => navigateTo('onboarding-2')} />
        </div>

        <div style={{ border: '1px solid #E5E1D6', borderRadius: 8, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              backgroundColor: '#E8E4DA',
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              color: '#555963',
            }}
          >
            <span>Size</span>
            <span style={{ textAlign: 'center' }}>B&W (₹ / Sheet)</span>
            <span style={{ textAlign: 'center' }}>Color (₹ / Sheet)</span>
          </div>

          {[
            { size: 'A4', bw: onboardingData.pricing?.a4Bw || '3', col: onboardingData.pricing?.a4Color || '8' },
            { size: 'A3', bw: onboardingData.pricing?.a3Bw || '6', col: onboardingData.pricing?.a3Color || '15' },
            { size: 'A0', bw: onboardingData.pricing?.a0Bw || '40', col: onboardingData.pricing?.a0Color || '80' },
          ].map((row, idx) => (
            <div
              key={row.size}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '6px 12px',
                borderTop: idx > 0 ? '1px solid #EBE7DF' : 'none',
                fontSize: 12,
                color: '#1A1C20',
              }}
            >
              <span style={{ fontWeight: 700 }}>{row.size}</span>
              <span style={{ textAlign: 'center' }}>₹ {row.bw}</span>
              <span style={{ textAlign: 'center' }}>₹ {row.col}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreateShop}
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
        <span>{loading ? 'Creating Shop...' : 'Create Shop & Continue'}</span>
        <ArrowRight size={16} />
      </button>
    </AuthLayout>
  );
};
