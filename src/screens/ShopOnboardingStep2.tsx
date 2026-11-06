import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';
import { theme } from '../theme';

export const ShopOnboardingStep2: React.FC = () => {
  const { onboardingData, updateOnboardingData, navigateTo } = useMerchant();

  const [selectedServices, setSelectedServices] = useState<string[]>(
    onboardingData.services || ['Standard Prints', 'Posters', 'Flex & Banners']
  );

  const [pricing, setPricing] = useState({
    a4Bw: onboardingData.pricing?.a4Bw || '3',
    a4Color: onboardingData.pricing?.a4Color || '8',
    a3Bw: onboardingData.pricing?.a3Bw || '6',
    a3Color: onboardingData.pricing?.a3Color || '15',
    a0Bw: onboardingData.pricing?.a0Bw || '40',
    a0Color: onboardingData.pricing?.a0Color || '80',
  });

  const availableServices = [
    { id: 'Standard Prints', label: 'Standard Prints\n(A4, A3, A0)' },
    { id: 'Posters', label: 'Posters' },
    { id: 'Flex & Banners', label: 'Flex & Banners' },
    { id: 'T-shirt Printing', label: 'T-shirt Printing' },
    { id: 'Invitations', label: 'Invitations' },
    { id: 'Packaging & Labels', label: 'Packaging & Labels' },
  ];

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    updateOnboardingData({
      services: selectedServices,
      pricing,
    });
    navigateTo('onboarding-3');
  };

  return (
    <AuthLayout cardWidth={560}>
      <button
        onClick={() => navigateTo('onboarding-1')}
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
            2
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#1A1C20' }}>Services & Pricing</span>
        </div>

        <div style={{ flex: 1, height: 1, backgroundColor: '#D5D0C6', margin: '-18px 8px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
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
          <span style={{ fontSize: 11, fontWeight: 500, color: '#6B707B' }}>Review</span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Services & Pricing</h3>
        <p style={{ fontSize: 12.5, color: '#6B707B' }}>
          Select the printing services you offer and set your prices.
        </p>
      </div>

      {/* 6 checkable cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {availableServices.map(srv => {
          const isSelected = selectedServices.includes(srv.id);
          return (
            <div
              key={srv.id}
              onClick={() => toggleService(srv.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 10,
                backgroundColor: isSelected ? '#FAF8F5' : '#EBE7DF',
                border: `1px solid ${isSelected ? '#1C1D21' : '#DAD5CB'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: isSelected ? '#1C1D21' : '#FFFFFF',
                  border: `1px solid ${isSelected ? '#1C1D21' : '#C5BFB4'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20', whiteSpace: 'pre-line', lineHeight: 1.25 }}>
                {srv.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pricing Table matching PDF */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20', marginBottom: 8 }}>
          Set Pricing (Standard Prints)
        </div>

        <div
          style={{
            border: '1px solid #DAD5CB',
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: '#FAF8F5',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 2fr 2fr',
              backgroundColor: '#E8E4DA',
              padding: '8px 14px',
              fontSize: 11,
              fontWeight: 700,
              color: '#555963',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
            }}
          >
            <span>SIZE</span>
            <span style={{ textAlign: 'center' }}>B&W (₹ / Sheet)</span>
            <span style={{ textAlign: 'center' }}>COLOR (₹ / Sheet)</span>
          </div>

          {[
            { size: 'A4', bwKey: 'a4Bw', colKey: 'a4Color' },
            { size: 'A3', bwKey: 'a3Bw', colKey: 'a3Color' },
            { size: 'A0', bwKey: 'a0Bw', colKey: 'a0Color' },
          ].map((row, idx) => (
            <div
              key={row.size}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 2fr 2fr',
                padding: '8px 14px',
                alignItems: 'center',
                borderTop: idx > 0 ? '1px solid #EBE7DF' : 'none',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>{row.size}</span>
              <div style={{ padding: '0 8px' }}>
                <input
                  type="text"
                  value={(pricing as any)[row.bwKey]}
                  onChange={e => setPricing({ ...pricing, [row.bwKey]: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: 8,
                    backgroundColor: '#EBE7DF',
                    border: '1px solid #DAD5CB',
                    textAlign: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1A1C20',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ padding: '0 8px' }}>
                <input
                  type="text"
                  value={(pricing as any)[row.colKey]}
                  onChange={e => setPricing({ ...pricing, [row.colKey]: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: 8,
                    backgroundColor: '#EBE7DF',
                    border: '1px solid #DAD5CB',
                    textAlign: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1A1C20',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

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
        <span>Continue to Review</span>
        <ArrowRight size={16} />
      </button>
    </AuthLayout>
  );
};
