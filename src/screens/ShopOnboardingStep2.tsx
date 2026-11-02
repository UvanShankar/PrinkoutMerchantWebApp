import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { ArrowRight, ArrowLeft, Check, Layers, Image, Flag, Shirt, Mail, Package } from 'lucide-react';
import { theme } from '../theme';

interface ServiceOption {
  id: string;
  name: string;
  desc: string;
  icon: any;
}

export const ShopOnboardingStep2: React.FC = () => {
  const { onboardingData, updateOnboardingData, navigateTo } = useMerchant();

  const [selectedServices, setSelectedServices] = useState<string[]>(
    onboardingData.services || ['Standard Prints', 'Posters', 'Flex & Banners']
  );

  const [pricing, setPricing] = useState(
    onboardingData.pricing || {
      a4Bw: '1.50',
      a4Color: '5.00',
      a3Bw: '4.00',
      a3Color: '12.00',
      a0Bw: '50.00',
      a0Color: '120.00',
    }
  );

  const servicesList: ServiceOption[] = [
    { id: 'Standard Prints', name: 'Standard Prints', desc: 'A4, A3 documents, thesis, brochures & books', icon: Layers },
    { id: 'Posters', name: 'Posters', desc: 'Glossy & matte photo paper large prints', icon: Image },
    { id: 'Flex & Banners', name: 'Flex & Banners', desc: 'Star flex, vinyl banners & hoardings', icon: Flag },
    { id: 'T-Shirts', name: 'T-Shirts & Apparel', desc: 'Cotton DTF & sublimation customized tees', icon: Shirt },
    { id: 'Invitations', name: 'Invitations & Cards', desc: 'Wedding invites, visiting cards, envelopes', icon: Mail },
    { id: 'Packaging', name: 'Packaging & Labels', desc: 'Product stickers, boxes & corrugated sheets', icon: Package },
  ];

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handlePricingChange = (key: string, val: string) => {
    setPricing((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleNext = () => {
    updateOnboardingData({
      services: selectedServices,
      pricing,
    });
    navigateTo('onboarding-3');
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
          onClick={() => navigateTo('onboarding-1')}
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
          <span>Back to Shop Details</span>
        </button>

        <span style={{ fontSize: 13, color: theme.colors.textDim }}>Step 2 of 3</span>
      </div>

      {/* Stepper Bar */}
      <div style={{ width: '100%', maxWidth: 780, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 4, borderRadius: 2, backgroundColor: '#10B981' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#10B981', textTransform: 'uppercase' }}>✓ 1. Shop Details</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 4, borderRadius: 2, backgroundColor: '#2563EB' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>2. Services & Pricing</span>
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
          maxWidth: 780,
          backgroundColor: '#15171F',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 16,
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 36, fontWeight: 400, color: '#F4F2EC', marginBottom: 6 }}>
            Select Services Offered
          </h1>
          <p style={{ fontSize: 14, color: theme.colors.textMuted }}>
            Choose which types of printing orders you want to receive at your shop.
          </p>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
          {servicesList.map(srv => {
            const isSelected = selectedServices.includes(srv.id);
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => toggleService(srv.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 10,
                  backgroundColor: isSelected ? '#1A2133' : '#111319',
                  border: `1.5px solid ${isSelected ? theme.colors.primaryLight : theme.colors.borderLight}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.2)' : '#191C24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                  }}
                >
                  <Icon size={18} color={isSelected ? theme.colors.primaryLight : theme.colors.textDim} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? '#FFFFFF' : '#D1D5DB' }}>
                      {srv.name}
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          backgroundColor: '#2563EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={12} color="#FFFFFF" />
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.textDim, marginTop: 2, lineHeight: 1.3 }}>
                    {srv.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Standard Print Pricing Table */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.colors.textLight }}>
              Standard Print Base Rates
            </h2>
            <p style={{ fontSize: 13, color: theme.colors.textDim }}>
              Set your default price per page for everyday document prints (can be customized later).
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#101217',
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                padding: '12px 18px',
                backgroundColor: '#161922',
                borderBottom: `1px solid ${theme.colors.borderLight}`,
                fontSize: 12,
                fontWeight: 700,
                color: theme.colors.textDim,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              <div>Paper Size</div>
              <div>B&W Price (₹ / page)</div>
              <div>Colour Price (₹ / page)</div>
            </div>

            {/* A4 Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                padding: '12px 18px',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.colors.borderLight}`,
              }}
            >
              <div style={{ fontWeight: 600, color: theme.colors.textLight }}>A4 Standard (75 GSM)</div>
              <div>
                <input
                  type="text"
                  value={pricing.a4Bw}
                  onChange={e => handlePricingChange('a4Bw', e.target.value)}
                  style={{
                    width: 90,
                    padding: '6px 10px',
                    borderRadius: 6,
                    backgroundColor: '#181A22',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={pricing.a4Color}
                  onChange={e => handlePricingChange('a4Color', e.target.value)}
                  style={{
                    width: 90,
                    padding: '6px 10px',
                    borderRadius: 6,
                    backgroundColor: '#181A22',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* A3 Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                padding: '12px 18px',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.colors.borderLight}`,
              }}
            >
              <div style={{ fontWeight: 600, color: theme.colors.textLight }}>A3 Poster/Sheet</div>
              <div>
                <input
                  type="text"
                  value={pricing.a3Bw}
                  onChange={e => handlePricingChange('a3Bw', e.target.value)}
                  style={{
                    width: 90,
                    padding: '6px 10px',
                    borderRadius: 6,
                    backgroundColor: '#181A22',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={pricing.a3Color}
                  onChange={e => handlePricingChange('a3Color', e.target.value)}
                  style={{
                    width: 90,
                    padding: '6px 10px',
                    borderRadius: 6,
                    backgroundColor: '#181A22',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* A0 Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                padding: '12px 18px',
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 600, color: theme.colors.textLight }}>A0 Architectural Blueprint</div>
              <div>
                <input
                  type="text"
                  value={pricing.a0Bw}
                  onChange={e => handlePricingChange('a0Bw', e.target.value)}
                  style={{
                    width: 90,
                    padding: '6px 10px',
                    borderRadius: 6,
                    backgroundColor: '#181A22',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={pricing.a0Color}
                  onChange={e => handlePricingChange('a0Color', e.target.value)}
                  style={{
                    width: 90,
                    padding: '6px 10px',
                    borderRadius: 6,
                    backgroundColor: '#181A22',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigateTo('onboarding-1')}
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
            <span>Continue to Review</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
