import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Calendar,
  Layers,
  CreditCard,
  Building,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Printer,
  Wallet,
  ChevronRight,
} from 'lucide-react';
import { theme } from '../theme';

export const PayoutsScreen: React.FC = () => {
  const { payouts, orders, showToast } = useMerchant();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Transactions' | 'Settlement'>('Overview');

  const totalSales = payouts?.totalSales ?? orders.reduce((sum, o) => sum + (o.totalPrice || o.orderDetails?.totalPrice || 0), 0);
  const platformFeeRate = payouts?.platformFeeRate ?? 0.1;
  const platformFee = payouts?.platformFee ?? Math.round(totalSales * platformFeeRate);
  const netEarnings = payouts?.netEarnings ?? (totalSales - platformFee);
  const nextPayoutAmount = payouts?.nextPayoutAmount ?? (totalSales > 0 ? Math.round(netEarnings * 0.28) : 0);
  const nextPayoutDate = payouts?.nextPayoutDate ?? 'Tomorrow, 10:00 AM';

  const tabs = ['Overview', 'Transactions', 'Settlement'] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Filter Bar matching PDF */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.creamCard,
          border: `1px solid ${theme.colors.creamCardBorder}`,
          borderRadius: 18,
          padding: '12px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#EFECE4', padding: 4, borderRadius: 20 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 16px',
                borderRadius: 16,
                border: 'none',
                backgroundColor: activeTab === tab ? '#1C1D21' : 'transparent',
                color: activeTab === tab ? '#FFFFFF' : '#6B707B',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#EFECE4',
            border: '1px solid #DAD5CB',
            borderRadius: 12,
            padding: '7px 14px',
            fontSize: 12.5,
            fontWeight: 600,
            color: '#1A1C20',
            cursor: 'pointer',
          }}
        >
          <Calendar size={14} color="#6B707B" />
          <span>Jul 1, 2026 – Jul 31, 2026</span>
          <span style={{ fontSize: 10, color: '#6B707B' }}>▼</span>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {/* Total Sales */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 16,
            padding: '16px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CreditCard size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Total Sales</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>₹ {totalSales.toLocaleString()}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
              ↑ +32%
            </span>
          </div>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(167, 139, 250, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#A78BFA" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>

        {/* Commission */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 16,
            padding: '16px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Layers size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Prinkout Commission (10%)</span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>₹ {platformFee.toLocaleString()}</span>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(251, 146, 60, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#FB923C" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>

        {/* Net Payout */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 16,
            padding: '16px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Wallet size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Net Payout</span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>₹ {netEarnings.toLocaleString()}</span>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(52, 211, 153, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#34D399" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>

        {/* Next Payout (Lavender Card matching PDF) */}
        <div
          style={{
            backgroundColor: '#EDE9FE',
            border: '1px solid #DDD6FE',
            borderRadius: 16,
            padding: '16px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Calendar size={16} color="#6B21A8" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6B21A8' }}>Next Payout</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20', lineHeight: 1.1 }}>
            {nextPayoutDate}
          </div>
          <div style={{ fontSize: 11, color: '#6B21A8', marginTop: 4 }}>
            Settlement: Daily • ₹ {nextPayoutAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Middle Row: Earnings Trend & Payout Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14 }}>
        {/* Earnings Trend Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20' }}>Earnings Trend</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                ↑ +32% vs previous period
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1A1C20', marginBottom: 16 }}>
              ₹ {totalSales.toLocaleString()}
            </div>
          </div>

          <div style={{ width: '100%', height: 160, position: 'relative', display: 'flex', alignItems: 'stretch' }}>
            {/* Y-axis labels matching PDF */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 9.5, color: '#8E929B', paddingRight: 8, paddingBottom: 20 }}>
              <span>60K</span>
              <span>50K</span>
              <span>40K</span>
              <span>30K</span>
              <span>20K</span>
              <span>10K</span>
              <span>0</span>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 28,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  padding: '4px 8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #E5E1D6',
                  textAlign: 'center',
                  zIndex: 2,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1C20' }}>₹ 6,480</div>
                <div style={{ fontSize: 9.5, color: '#8E929B' }}>Jul 29, 2026</div>
              </div>

              <svg viewBox="0 0 320 120" style={{ width: '100%', height: 'calc(100% - 20px)', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="10" x2="320" y2="10" stroke="#EBE7DF" strokeDasharray="3 3" />
                <line x1="0" y1="35" x2="320" y2="35" stroke="#EBE7DF" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="320" y2="60" stroke="#EBE7DF" strokeDasharray="3 3" />
                <line x1="0" y1="85" x2="320" y2="85" stroke="#EBE7DF" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="320" y2="110" stroke="#EBE7DF" />

                <path
                  d="M 20 95 C 40 92, 55 75, 75 75 C 95 75, 110 82, 130 80 C 150 78, 165 65, 185 60 C 205 55, 220 50, 240 45 C 260 40, 275 52, 295 40 L 295 110 L 20 110 Z"
                  fill="url(#payoutGrad)"
                />
                <path
                  d="M 20 95 C 40 92, 55 75, 75 75 C 95 75, 110 82, 130 80 C 150 78, 165 65, 185 60 C 205 55, 220 50, 240 45 C 260 40, 275 52, 295 40"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2.5"
                />

                {[
                  { x: 20, y: 95 },
                  { x: 75, y: 75 },
                  { x: 130, y: 80 },
                  { x: 185, y: 60 },
                  { x: 240, y: 45 },
                  { x: 295, y: 40 },
                ].map((dot, idx) => (
                  <circle key={idx} cx={dot.x} cy={dot.y} r="4" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
                ))}
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8E929B', marginTop: 4 }}>
                <span>Jul 1</span>
                <span>Jul 5</span>
                <span>Jul 9</span>
                <span>Jul 13</span>
                <span>Jul 17</span>
                <span>Jul 21</span>
                <span>Jul 25</span>
                <span>Jul 29</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Summary Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 18 }}>
              Payout Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Printer size={15} color="#6B707B" />
                  <span style={{ fontSize: 13, color: '#555963' }}>Total Order Value</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>₹ {totalSales.toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Layers size={15} color="#6B707B" />
                  <span style={{ fontSize: 13, color: '#555963' }}>Prinkout Commission (10%)</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>- ₹ {platformFee.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Payout Banner matching PDF */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#EDE9FE',
              borderRadius: 12,
              padding: '12px 16px',
              marginTop: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wallet size={16} color="#6B21A8" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#581C87' }}>Net Payout</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#581C87' }}>₹ {netEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Payouts & Payout Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14 }}>
        {/* Recent Payouts Table */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20' }}>Recent Payouts</h3>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20', cursor: 'pointer' }}>
              View All Payouts →
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
            <thead>
              <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                <th style={{ padding: '8px 10px' }}>PAYOUT ID</th>
                <th style={{ padding: '8px 10px' }}>PERIOD</th>
                <th style={{ padding: '8px 10px' }}>ORDER VALUE</th>
                <th style={{ padding: '8px 10px' }}>COMMISSION</th>
                <th style={{ padding: '8px 10px' }}>PAYOUT AMOUNT</th>
                <th style={{ padding: '8px 10px' }}>STATUS</th>
                <th style={{ padding: '8px 6px', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {payouts?.recentPayouts && payouts.recentPayouts.length > 0 ? (
                payouts.recentPayouts.map(row => (
                  <tr key={row.payoutId} style={{ borderBottom: '1px solid #F0ECE4' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#1A1C20' }}>{row.payoutId}</td>
                    <td style={{ padding: '10px', color: '#555963' }}>{row.date}</td>
                    <td style={{ padding: '10px', color: '#1A1C20' }}>₹ {row.amount.toLocaleString()}</td>
                    <td style={{ padding: '10px', color: '#555963' }}>₹ {Math.round(row.amount * 0.1).toLocaleString()}</td>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#1A1C20' }}>₹ {Math.round(row.amount * 0.9).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 12,
                          backgroundColor: '#DCFCE7',
                          color: '#15803D',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle2 size={11} />
                        <span>{row.status}</span>
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', color: '#8E929B' }}>
                      <MoreVertical size={14} />
                    </td>
                  </tr>
                ))
              ) : totalSales > 0 ? (
                <tr style={{ borderBottom: '1px solid #F0ECE4' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#1A1C20' }}>#PO-0124</td>
                  <td style={{ padding: '10px', color: '#555963' }}>Current Period</td>
                  <td style={{ padding: '10px', color: '#1A1C20' }}>₹ {totalSales.toLocaleString()}</td>
                  <td style={{ padding: '10px', color: '#555963' }}>₹ {platformFee.toLocaleString()}</td>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#1A1C20' }}>₹ {netEarnings.toLocaleString()}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={11} />
                      <span>Pending Payout</span>
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#8E929B' }}>
                    <MoreVertical size={14} />
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#8E929B' }}>
                    No payout records found for this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payout Settings Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 16 }}>
            Payout Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              onClick={() => showToast('Manage Bank Accounts')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 12,
                backgroundColor: '#FAF8F5',
                border: '1px solid #EBE7DF',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building size={16} color="#6B707B" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>
                    {payouts?.bankAccount?.bankName || 'Bank Account'}
                  </div>
                  <div style={{ fontSize: 11, color: '#8E929B' }}>
                    {payouts?.bankAccount?.accountNumberMasked || '**** 4321'} ({payouts?.bankAccount?.status || 'Active'})
                  </div>
                </div>
              </div>
              <ChevronRight size={15} color="#8E929B" />
            </div>

            <div
              onClick={() => showToast('Update Settlement Frequency')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 12,
                backgroundColor: '#FAF8F5',
                border: '1px solid #EBE7DF',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Calendar size={16} color="#6B707B" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Settlement Frequency</div>
                  <div style={{ fontSize: 11, color: '#8E929B' }}>Daily</div>
                </div>
              </div>
              <ChevronRight size={15} color="#8E929B" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
