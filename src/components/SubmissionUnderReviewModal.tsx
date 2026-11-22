import React from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Store,
  Printer,
  Settings,
  BarChart3,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

interface SubmissionUnderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName?: string;
}

export const SubmissionUnderReviewModal: React.FC<SubmissionUnderReviewModalProps> = ({
  isOpen,
  onClose,
  shopName,
}) => {
  const { navigateTo, shopData, setProfileTab } = useMerchant();

  if (!isOpen) return null;

  const handleGoToDashboard = () => {
    onClose();
    navigateTo('dashboard');
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease-in-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          padding: '28px 26px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E2E8F0')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
        >
          <X size={16} />
        </button>

        {/* Header with Icon and Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
          {/* Glowing Icon Badge */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              border: '3px solid #F59E0B',
              color: '#B45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(245, 158, 11, 0.35)',
            }}
          >
            <Clock size={32} strokeWidth={2.4} />
          </div>

          {/* Under Review Status Chip */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 20,
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.3px',
              border: '1px solid #FDE68A',
            }}
          >
            <span>⏳ Profile Under Review</span>
          </div>

          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', lineHeight: 1.25 }}>
              Submission Received!
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              {shopName ? `"${shopName}"` : 'Your shop profile'} and verification documents have been submitted to the admin team.
            </p>
          </div>
        </div>

        {/* Waiting Notice Box */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontSize: 12.5,
            color: '#334155',
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#0F172A' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Please wait while we verify your shop details:</span>
          </div>
          <div>
            Verification typically takes <strong>24 to 48 hours</strong>. Our admin team will verify your address, serviceable hub, and uploaded business documents. Once approved, your shop will automatically go live to accept customer orders.
          </div>
        </div>

        {/* Admin Review Queries & Doubts Box */}
        {Array.isArray(shopData?.adminComments) && shopData.adminComments.length > 0 && (
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#92400E', fontSize: 13 }}>
                <MessageSquare size={16} color="#D97706" />
                <span>Notes from Admin Review Team ({shopData.adminComments.length})</span>
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4, backgroundColor: '#FDE68A', color: '#92400E' }}>
                Action May Be Required
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
              {shopData.adminComments.map((comm: any, idx: number) => (
                <div
                  key={comm.id || idx}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    border: '1px solid #FDE68A',
                    fontSize: 12,
                    color: '#1E293B',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, color: '#92400E', fontSize: 11 }}>{comm.author || 'Admin Team'}</span>
                    <span style={{ fontSize: 10, color: '#94A3B8' }}>{comm.createdAt ? new Date(comm.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  <div style={{ lineHeight: 1.4 }}>{comm.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', marginTop: 4 }}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setProfileTab('details');
                  navigateTo('profile');
                }}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: 10,
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  color: '#92400E',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Edit Details / Documents
              </button>
            </div>
          </div>
        )}

        {/* You Can Use the App Now Callout */}
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: '#166534' }}>
            <Sparkles size={16} color="#16A34A" />
            <span>You have full access to use the app right now!</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11.5, color: '#14532D' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} color="#16A34A" />
              <span>Explore Dashboard metrics</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} color="#16A34A" />
              <span>Test Print Queue workflow</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} color="#16A34A" />
              <span>Configure Paper Pricing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} color="#16A34A" />
              <span>Add team print operators</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={handleGoToDashboard}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 20px',
              backgroundColor: '#1C1D21',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(28, 29, 33, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Explore Dashboard & Start Using App</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px 18px',
              backgroundColor: 'transparent',
              color: '#64748B',
              border: 'none',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Stay on current screen
          </button>
        </div>
      </div>
    </div>
  );
};
