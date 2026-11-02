import React from 'react';
import { useMerchant } from '../context/MerchantContext';
import { CheckCircle2 } from 'lucide-react';
import { theme } from '../theme';

export const Toast: React.FC = () => {
  const { toastMessage } = useMerchant();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 28,
        backgroundColor: '#1E222D',
        color: '#FFFFFF',
        padding: '12px 18px',
        borderRadius: 10,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
        border: `1px solid ${theme.colors.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 9999,
        fontSize: 13,
        fontWeight: 600,
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <CheckCircle2 size={18} color="#10B981" />
      <span>{toastMessage}</span>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
