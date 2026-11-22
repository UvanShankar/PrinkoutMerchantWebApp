import React from 'react';
import { useMerchant } from '../context/MerchantContext';
import { Clock } from 'lucide-react';

export const VerificationPendingBanner: React.FC = () => {
  const { shopData, openSubmissionModal } = useMerchant();

  // Also check stored session if context is hydrating
  const effectiveShopData = shopData || (() => {
    try {
      const s = localStorage.getItem('prinkout_merchant_session');
      return s ? JSON.parse(s)?.shopData : null;
    } catch {
      return null;
    }
  })();

  const isApproved = effectiveShopData?.isVerified === true || effectiveShopData?.verificationStatus === 'approved';
  const isRejected = effectiveShopData?.verificationStatus === 'rejected';

  // Show banner across all tabs whenever the shop is not verified and not rejected
  const isUnderReview = !isApproved && !isRejected;

  if (!isUnderReview) return null;

  // Format date as DD/MM/YYYY (e.g. 22/11/2026) matching user request
  const submittedDate = (() => {
    try {
      const raw = effectiveShopData?.verificationSubmittedAt;
      const d = raw ? new Date(raw) : new Date();
      return isNaN(d.getTime()) ? new Date().toLocaleDateString('en-GB') : d.toLocaleDateString('en-GB');
    } catch {
      return new Date().toLocaleDateString('en-GB');
    }
  })();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '14px 20px',
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        marginBottom: 18,
        animation: 'fadeIn 0.2s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: '#DBEAFE',
            color: '#1E40AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Clock size={20} />
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>Profile Under Review</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: '#DBEAFE',
                color: '#1E40AF',
                padding: '2px 8px',
                borderRadius: 10,
              }}
            >
              Submitted {submittedDate}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#2563EB', marginTop: 2, lineHeight: 1.4 }}>
            Your shop profile and documents have been submitted to the admin team. You have full access to use and explore all features in the app.
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={openSubmissionModal}
        style={{
          padding: '8px 16px',
          borderRadius: 12,
          backgroundColor: '#1E40AF',
          color: '#FFFFFF',
          border: 'none',
          fontSize: 12.5,
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(30, 64, 175, 0.25)',
          transition: 'all 0.15s ease',
        }}
      >
        View Submission Details
      </button>
    </div>
  );
};
