import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  CreditCard,
  Building,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
  Download,
  Zap,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { theme } from '../theme';

export const PayoutsScreen: React.FC = () => {
  const { payouts, showToast } = useMerchant();
  const [instantLoading, setInstantLoading] = useState(false);

  const data = payouts || {
    totalSales: 148250,
    platformFeeRate: 0.1,
    platformFee: 14825,
    netEarnings: 133425,
    nextPayoutAmount: 12450,
    nextPayoutDate: 'Tomorrow, 10:00 AM',
    bankAccount: {
      bankName: 'HDFC Bank',
      accountNumberMasked: '•••• 4821',
      holderName: 'Sabarish K',
      ifsc: 'HDFC0001234',
      status: 'Verified',
    },
    payoutSettings: {
      autoDailySettlement: true,
      instantPayoutEnabled: true,
      minimumPayoutThreshold: 500,
    },
    weeklyEarnings: [
      { date: 'Oct 26', amount: 12500 },
      { date: 'Oct 27', amount: 14200 },
      { date: 'Oct 28', amount: 13800 },
      { date: 'Oct 29', amount: 16400 },
      { date: 'Oct 30', amount: 18900 },
      { date: 'Oct 31', amount: 21300 },
      { date: 'Nov 01', amount: 17800 },
    ],
    recentPayouts: [
      { payoutId: 'PAY-9921', date: 'Nov 01, 2026', amount: 17800, status: 'Transferred', utr: 'UTR89217482' },
      { payoutId: 'PAY-9918', date: 'Oct 31, 2026', amount: 21300, status: 'Transferred', utr: 'UTR89216110' },
      { payoutId: 'PAY-9912', date: 'Oct 30, 2026', amount: 18900, status: 'Transferred', utr: 'UTR89214902' },
      { payoutId: 'PAY-9905', date: 'Oct 29, 2026', amount: 16400, status: 'Transferred', utr: 'UTR89213567' },
      { payoutId: 'PAY-9899', date: 'Oct 28, 2026', amount: 13800, status: 'Transferred', utr: 'UTR89212044' },
    ],
  };

  const handleInstantPayout = () => {
    setInstantLoading(true);
    setTimeout(() => {
      setInstantLoading(false);
      showToast(`Instant payout of ₹ ${data.nextPayoutAmount.toLocaleString()} initiated to ${data.bankAccount.bankName}`);
    }, 700);
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#F4F2EC', marginBottom: 4 }}>
            Payouts & Settlements
          </h1>
          <p style={{ fontSize: 13, color: theme.colors.textMuted }}>
            Automatic daily transfers, bank account details, and commission statements.
          </p>
        </div>

        <button
          onClick={handleInstantPayout}
          disabled={instantLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: instantLoading ? 'default' : 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          }}
        >
          <Zap size={16} />
          <span>{instantLoading ? 'Processing...' : `Withdraw Instantly (₹ ${data.nextPayoutAmount.toLocaleString()})`}</span>
        </button>
      </div>

      {/* 4 Cards matching Page 12 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim, marginBottom: 8 }}>Total Sales (Gross)</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            ₹ {data.totalSales.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: theme.colors.textDim }}>Before platform deductions</div>
        </div>

        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim, marginBottom: 8 }}>Platform Fee (10%)</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#F59E0B', marginBottom: 4 }}>
            - ₹ {data.platformFee.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: theme.colors.textDim }}>Server, payment & app maintenance</div>
        </div>

        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim, marginBottom: 8 }}>Net Merchant Earnings</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#10B981', marginBottom: 4 }}>
            ₹ {data.netEarnings.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>Ready / already settled</div>
        </div>

        <div style={{ backgroundColor: '#161820', border: '1px solid rgba(37, 99, 235, 0.4)', borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#93C5FD', marginBottom: 8 }}>Next Scheduled Payout</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            ₹ {data.nextPayoutAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#93C5FD', fontWeight: 600 }}>{data.nextPayoutDate}</div>
        </div>
      </div>

      {/* Grid: Bank Info & Earnings Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 20, marginBottom: 28 }}>
        {/* Linked Bank Account Card matching Page 12 */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '22px 24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Settlement Bank Account</h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 12,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <CheckCircle size={12} />
              <span>Verified</span>
            </span>
          </div>

          <div
            style={{
              padding: '16px 18px',
              borderRadius: 10,
              backgroundColor: '#111319',
              border: `1px solid ${theme.colors.borderLight}`,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: '#1E2332',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building size={20} color="#60A5FA" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{data.bankAccount.bankName}</div>
                <div style={{ fontSize: 13, color: theme.colors.textMuted }}>A/C: {data.bankAccount.accountNumberMasked}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, borderTop: `1px solid ${theme.colors.border}`, paddingTop: 10 }}>
              <div>
                <span style={{ color: theme.colors.textDim }}>Beneficiary: </span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{data.bankAccount.holderName}</span>
              </div>
              <div>
                <span style={{ color: theme.colors.textDim }}>IFSC: </span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{data.bankAccount.ifsc}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: theme.colors.textMuted }}>
            <span>Auto Daily Settlement</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>Active (Every Morning)</span>
          </div>
        </div>

        {/* Weekly Earnings Bars */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '22px 24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Weekly Net Transfers</h2>
            <span style={{ fontSize: 12, color: theme.colors.textDim }}>Last 7 days settlement history</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, gap: 12 }}>
            {data.weeklyEarnings.map(item => (
              <div key={item.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: theme.colors.textMuted }}>₹{(item.amount / 1000).toFixed(1)}k</span>
                <div
                  style={{
                    width: '100%',
                    height: `${(item.amount / 22000) * 100}%`,
                    backgroundColor: '#10B981',
                    borderRadius: '4px 4px 1px 1px',
                    opacity: 0.85,
                  }}
                />
                <span style={{ fontSize: 11, color: theme.colors.textDim }}>{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payouts Table */}
      <div
        style={{
          backgroundColor: '#161820',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 14,
          padding: '22px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Recent Payout Statements</h2>
          <button
            onClick={() => showToast('Exporting payout statement')}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.primaryLight,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Download size={14} />
            <span>Download Statement (PDF)</span>
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.colors.borderLight}`, color: theme.colors.textDim, fontSize: 11, textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 14px' }}>Payout ID</th>
              <th style={{ padding: '10px 14px' }}>Date</th>
              <th style={{ padding: '10px 14px' }}>Amount</th>
              <th style={{ padding: '10px 14px' }}>Bank UTR / Ref</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentPayouts.map(payout => (
              <tr key={payout.payoutId} style={{ borderBottom: `1px solid ${theme.colors.border}`, fontSize: 13 }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#FFFFFF' }}>{payout.payoutId}</td>
                <td style={{ padding: '12px 14px', color: theme.colors.textMuted }}>{payout.date}</td>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#34D399' }}>₹ {payout.amount.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', color: theme.colors.textDim, fontFamily: 'monospace' }}>{payout.utr}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: 12,
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    ✓ {payout.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
