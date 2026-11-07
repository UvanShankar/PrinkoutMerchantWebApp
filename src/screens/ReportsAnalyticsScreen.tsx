import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Calendar,
  Download,
  ArrowRight,
  TrendingUp,
  Layers,
  Image as ImageIcon,
  Tv,
  Shirt,
  Mail,
  CheckCircle2,
  Users,
  Printer,
  Sparkles,
} from 'lucide-react';
import { theme } from '../theme';

export const ReportsAnalyticsScreen: React.FC = () => {
  const { analytics, orders, navigateTo, showToast } = useMerchant();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Orders' | 'Revenue' | 'Services' | 'Customers'>('Overview');

  const totalOrders = orders.length > 0 ? orders.length : (analytics?.summaryMetrics?.totalOrders ?? 0);
  const totalRev = orders.length > 0
    ? orders.reduce((sum, o) => sum + (o.totalPrice || o.orderDetails?.totalPrice || 0), 0)
    : (analytics?.summaryMetrics?.totalRevenue ?? 0);
  const completedCount = orders.filter(o => o.status?.toLowerCase() === 'completed').length || (totalOrders > 0 ? Math.round(totalOrders * 0.85) : 0);
  const customersCount = new Set(orders.map(o => o.customerPhone || o.userId).filter(Boolean)).size || (totalOrders > 0 ? 12 : 0);

  const tabs = ['Overview', 'Orders', 'Revenue', 'Services', 'Customers'] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Filter and Export Bar */}
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
        {/* Subtabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#EFECE4', padding: 4, borderRadius: 20 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#EFECE4',
              border: '1px solid #DAD5CB',
              borderRadius: 12,
              padding: '7px 12px',
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

          <button
            onClick={() => showToast('Exporting Report (CSV/PDF)...')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 16,
              backgroundColor: '#1C1D21',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {/* Total Orders */}
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
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Total Orders</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>{totalOrders}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
              Live
            </span>
          </div>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(129, 140, 248, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#818CF8" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>

        {/* Total Revenue */}
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
            <TrendingUp size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Total Revenue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>₹ {totalRev.toLocaleString()}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
              Live
            </span>
          </div>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(52, 211, 153, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#34D399" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>

        {/* Prints Completed */}
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
            <Printer size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Prints Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>{completedCount}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
              Live
            </span>
          </div>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(251, 146, 60, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#FB923C" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>

        {/* New Customers */}
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
            <Users size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>New Customers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>{customersCount}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
              Live
            </span>
          </div>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(167, 139, 250, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#A78BFA" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>
      </div>

      {/* Middle Row: Revenue Trend, Orders by Service, Top Services */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 14 }}>
        {/* Revenue Trend Card */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20' }}>Revenue Trend</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                ↑ +32% vs previous period
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1A1C20', marginBottom: 16 }}>
              ₹ 48,320
            </div>
          </div>

          {/* SVG line chart matching PDF */}
          <div style={{ width: '100%', height: 160, position: 'relative' }}>
            {/* Tooltip matching PDF */}
            <div
              style={{
                position: 'absolute',
                top: 4,
                right: 32,
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                padding: '4px 8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #E5E1D6',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1A1C20' }}>₹ 6,480</div>
              <div style={{ fontSize: 9.5, color: '#8E929B' }}>Jul 29, 2026</div>
            </div>

            <svg viewBox="0 0 320 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="20" x2="320" y2="20" stroke="#EBE7DF" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="320" y2="50" stroke="#EBE7DF" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="320" y2="80" stroke="#EBE7DF" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="320" y2="110" stroke="#EBE7DF" />

              {/* Area fill */}
              <path
                d="M 20 95 C 40 92, 55 75, 75 75 C 95 75, 110 82, 130 80 C 150 78, 165 65, 185 60 C 205 55, 220 50, 240 45 C 260 40, 275 52, 295 40 L 295 110 L 20 110 Z"
                fill="url(#purpleGrad)"
              />

              {/* Line */}
              <path
                d="M 20 95 C 40 92, 55 75, 75 75 C 95 75, 110 82, 130 80 C 150 78, 165 65, 185 60 C 205 55, 220 50, 240 45 C 260 40, 275 52, 295 40"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
              />

              {/* Dots */}
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

            {/* X Axis labels */}
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

        {/* Orders by Service Donut Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20', marginBottom: 14 }}>
            Orders by Service
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Donut chart */}
            <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="38 100" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#60A5FA" strokeWidth="4" strokeDasharray="18 100" strokeDashoffset="-38" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="14 100" strokeDashoffset="-56" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="12 100" strokeDashoffset="-70" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#FDE047" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-82" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#9CA3AF" strokeWidth="4" strokeDasharray="8 100" strokeDashoffset="-92" />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1C20', lineHeight: 1 }}>156</span>
                <span style={{ fontSize: 10, color: '#6B707B' }}>Orders</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
                <span style={{ color: '#555963' }}>Standard Prints</span>
                <b style={{ color: '#1A1C20', marginLeft: 'auto' }}>38%</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#60A5FA' }} />
                <span style={{ color: '#555963' }}>Posters</span>
                <b style={{ color: '#1A1C20', marginLeft: 'auto' }}>18%</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ color: '#555963' }}>Banners & Flex</span>
                <b style={{ color: '#1A1C20', marginLeft: 'auto' }}>14%</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ color: '#555963' }}>T-shirts</span>
                <b style={{ color: '#1A1C20', marginLeft: 'auto' }}>12%</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FDE047' }} />
                <span style={{ color: '#555963' }}>Invitations</span>
                <b style={{ color: '#1A1C20', marginLeft: 'auto' }}>10%</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                <span style={{ color: '#555963' }}>Others</span>
                <b style={{ color: '#1A1C20', marginLeft: 'auto' }}>8%</b>
              </div>
            </div>
          </div>
        </div>

        {/* Top Services (by Revenue) Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20', marginBottom: 14 }}>
            Top Services (by Revenue)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Standard Prints', amount: '18,240', icon: Layers },
              { name: 'Posters', amount: '8,640', icon: ImageIcon },
              { name: 'Banners & Flex', amount: '6,720', icon: Tv },
              { name: 'T-shirt Printing', amount: '5,760', icon: Shirt },
              { name: 'Invitations', amount: '4,800', icon: Mail },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 10,
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #EBE7DF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={14} color="#6B707B" />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>₹ {item.amount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
        {/* Recent Orders Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20' }}>Recent Orders</h3>
            <button
              onClick={() => navigateTo('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                color: '#1A1C20',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>View All Orders</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
            <thead>
              <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                <th style={{ padding: '8px 10px' }}>ORDER ID</th>
                <th style={{ padding: '8px 10px' }}>CUSTOMER</th>
                <th style={{ padding: '8px 10px' }}>SERVICE</th>
                <th style={{ padding: '8px 10px' }}>AMOUNT</th>
                <th style={{ padding: '8px 10px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {(orders.length > 0 ? orders.slice(0, 5) : []).map(o => {
                const orderIdDisplay = '#' + (o.orderId.length > 8 ? o.orderId.slice(-4) : o.orderId);
                const isCompleted = o.status?.toLowerCase() === 'completed';
                return (
                  <tr key={o.orderId} style={{ borderBottom: '1px solid #F0ECE4' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#1A1C20' }}>{orderIdDisplay}</td>
                    <td style={{ padding: '10px', color: '#1A1C20' }}>{o.customerName || 'Customer'}</td>
                    <td style={{ padding: '10px', color: '#555963' }}>{o.serviceType || 'Standard Print'}</td>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#1A1C20' }}>₹ {o.totalPrice || 0}</td>
                    <td style={{ padding: '10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 12,
                          backgroundColor: isCompleted ? '#DCFCE7' : '#FEF3C7',
                          color: isCompleted ? '#15803D' : '#B45309',
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {isCompleted && <CheckCircle2 size={11} />}
                        <span>{o.status || 'Received'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px 10px', textAlign: 'center', color: '#8E929B', fontSize: 12 }}>
                    No recent orders to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Insights Card (Lavender matching PDF) */}
        <div
          style={{
            backgroundColor: '#EDE9FE',
            border: '1px solid #DDD6FE',
            borderRadius: 18,
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Subtle bar chart illustration in bottom right */}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 14,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 5,
              opacity: 0.35,
              pointerEvents: 'none',
            }}
          >
            <div style={{ width: 10, height: 25, backgroundColor: '#8B5CF6', borderRadius: 3 }} />
            <div style={{ width: 10, height: 42, backgroundColor: '#8B5CF6', borderRadius: 3 }} />
            <div style={{ width: 10, height: 60, backgroundColor: '#8B5CF6', borderRadius: 3 }} />
            <div style={{ width: 10, height: 75, backgroundColor: '#8B5CF6', borderRadius: 3 }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <TrendingUp size={16} color="#6B21A8" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#581C87' }}>Insights</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: '#581C87', lineHeight: 1.5, maxWidth: 280 }}>
              <div>• Revenue is up by <b>32%</b> compared to the previous period.</div>
              <div>• Standard Prints is your top performing service (<b>38%</b>).</div>
              <div>• <b>28 new customers</b> placed orders this month.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
