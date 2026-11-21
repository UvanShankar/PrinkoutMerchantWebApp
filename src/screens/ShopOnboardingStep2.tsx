import React, { useState, useEffect, useRef } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { AuthLayout } from './AuthLayout';
import { ChevronLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { theme } from '../theme';

export const ShopOnboardingStep2: React.FC = () => {
  const { onboardingData, updateOnboardingData, navigateTo, showToast } = useMerchant();

  const [selectedServices, setSelectedServices] = useState<string[]>(
    onboardingData.services || ['Standard Prints']
  );
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const [pricing, setPricing] = useState({
    a4Bw: onboardingData.pricing?.a4Bw || '3',
    a4Color: onboardingData.pricing?.a4Color || '8',
    a3Bw: onboardingData.pricing?.a3Bw || '6',
    a3Color: onboardingData.pricing?.a3Color || '15',
    a0Bw: onboardingData.pricing?.a0Bw || '40',
    a0Color: onboardingData.pricing?.a0Color || '80',
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<any>(null);

  // Synchronize state when onboardingData updates or when navigating back from review
  useEffect(() => {
    if (onboardingData.services && onboardingData.services.length > 0) {
      setSelectedServices(onboardingData.services);
    }
    if (onboardingData.pricing) {
      setPricing({
        a4Bw: onboardingData.pricing.a4Bw || '3',
        a4Color: onboardingData.pricing.a4Color || '8',
        a3Bw: onboardingData.pricing.a3Bw || '6',
        a3Color: onboardingData.pricing.a3Color || '15',
        a0Bw: onboardingData.pricing.a0Bw || '40',
        a0Color: onboardingData.pricing.a0Color || '80',
      });
    }
  }, [onboardingData.services, onboardingData.pricing]);

  const availableServices = [
    { id: 'Standard Prints', label: 'Standard Prints\n(A4, A3, A0)', disabled: false },
    { id: 'Posters', label: 'Posters', disabled: true },
    { id: 'Flex & Banners', label: 'Flex & Banners', disabled: true },
    { id: 'T-shirt Printing', label: 'T-shirt Printing', disabled: true },
    { id: 'Invitations', label: 'Invitations', disabled: true },
    { id: 'Packaging & Labels', label: 'Packaging & Labels', disabled: true },
  ];

  const toggleService = (id: string) => {
    const srv = availableServices.find(s => s.id === id);
    if (srv?.disabled) return;
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // Validation
  const missingFields: string[] = [];
  if (!selectedServices || selectedServices.length === 0) {
    missingFields.push('Select at least 1 print service');
  }

  const pricingKeys = ['a4Bw', 'a4Color', 'a3Bw', 'a3Color', 'a0Bw', 'a0Color'] as const;
  const invalidPrices = pricingKeys.filter(
    k => !pricing[k] || isNaN(parseFloat(pricing[k])) || parseFloat(pricing[k]) <= 0
  );
  if (invalidPrices.length > 0) {
    missingFields.push(`Enter valid pricing (> ₹0) for all ${pricingKeys.length} format options`);
  }

  const isComplete = missingFields.length === 0;

  // Real-time detail completion count
  const filledCount =
    (selectedServices.length > 0 ? 1 : 0) +
    pricingKeys.filter(k => pricing[k] && !isNaN(parseFloat(pricing[k])) && parseFloat(pricing[k]) > 0).length;
  const totalDetails = 1 + pricingKeys.length;
  const stepProgress = Math.round((filledCount / totalDetails) * 100);

  const triggerTooltip = () => {
    setShowTooltip(true);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 5000);
  };

  const handleNext = () => {
    if (!isComplete) {
      triggerTooltip();
      showToast('Please select a service and provide valid pricing for all formats.');
      return;
    }
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
          const isDisabled = !!srv.disabled;
          const isHovered = hoveredService === srv.id;

          return (
            <div
              key={srv.id}
              onClick={() => {
                if (isDisabled) return;
                toggleService(srv.id);
              }}
              onMouseEnter={() => setHoveredService(srv.id)}
              onMouseLeave={() => setHoveredService(null)}
              title={isDisabled ? "Coming Soon" : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 10,
                backgroundColor: isSelected ? '#FAF8F5' : '#EBE7DF',
                border: `1px solid ${isSelected ? '#1C1D21' : '#DAD5CB'}`,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.6 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {isDisabled && isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1C1D21',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '4px 9px',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                    zIndex: 30,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                    pointerEvents: 'none',
                    letterSpacing: '0.2px',
                  }}
                >
                  Coming Soon
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderWidth: '5px',
                      borderStyle: 'solid',
                      borderColor: '#1C1D21 transparent transparent transparent',
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: isSelected ? '#1C1D21' : (isDisabled ? '#E0DDD4' : '#FFFFFF'),
                  border: `1px solid ${isSelected ? '#1C1D21' : '#C5BFB4'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: isDisabled ? '#8E929B' : '#1A1C20', whiteSpace: 'pre-line', lineHeight: 1.25 }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
        {/* Dynamic Detail-by-Detail Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '2px 2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, fontWeight: 600, color: '#64748B' }}>
            <span>Progress: {filledCount} of {totalDetails} details completed</span>
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
          onClick={handleNext}
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
            opacity: isComplete ? 1 : 0.7,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: isComplete ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
          }}
        >
          <span>Continue to Review</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </AuthLayout>
  );
};
