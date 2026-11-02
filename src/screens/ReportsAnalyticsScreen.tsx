import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
  Award,
  Sparkles,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { theme } from '../theme';

export const ReportsAnalyticsScreen: React.FC = () => {
  const { analytics, showToast } = useMerchant();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'orders' | 'revenue' | 'services' | 'customers'>('overview');

  const summary = analytics?.summaryMetrics || {
    totalRevenue: 148250,
    totalOrders: 482,
    avgOrderValue: 307,
    repeatCustomerRate: 64,
  };

  const revenueTrend = analytics?.revenueTrend || [
    { day: 'Mon', amount: 4800 },
    { day: 'Tue', amount: 6200 },
    { day: 'Wed', amount: 5900 },
    { day: 'Thu', amount: 7100 },
    { day: 'Fri', amount: 8400 },
    { day: 'Sat', amount: 9600 },
    { day: 'Sun', amount: 7560 },
  ];

  const breakdown = analytics?.serviceBreakdown || [
    { name: 'Standard Prints', percentage: 54, revenue: 80055 },
    { name: 'Posters', percentage: 22, revenue: 32615 },
    { name: 'Flex & Banners', percentage: 14, revenue: 20755 },
    { name: 'T-Shirts', percentage: 10, revenue: 14825 },
  ];

  const topServices = analytics?.topServices || [
    { service: 'A4 Colour Print (75 GSM)', orders: 182, revenue: 42100, growth: '+14%' },
    { service: 'A4 Black & White', orders: 145, revenue: 18200, growth: '+8%' },
    { service: 'Poster A2 Glossy', orders: 48, revenue: 14400, growth: '+21%' },
    { service: 'Spiral Book Binding', orders: 36, revenue: 12600, growth: '+5%' },
    { service: 'Star Flex Banner 3x2', orders: 24, revenue: 28800, growth: '+18%' },
  ];

  const maxAmount = Math.max(...revenueTrend.map(r => r.amount));

  const handleExport = () => {
    showToast('Report exported as PDF & CSV to your Downloads folder');
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#F4F2EC', marginBottom: 4 }}>
            Reports & Analytics
          </h1>
          <p style={{ fontSize: 13, color: theme.colors.textMuted }}>
            Track revenue growth, customer retention, and high-demand print service items.
          </p>
        </div>

        <button
          onClick={handleExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            backgroundColor: '#1E2332',
            border: `1px solid ${theme.colors.borderLight}`,
            borderRadius: 8,
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Download size={15} />
          <span>Export Report (CSV / PDF)</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 10, borderBottom: `1px solid ${theme.colors.border}`, marginBottom: 24 }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'orders', label: 'Orders' },
          { id: 'revenue', label: 'Revenue' },
          { id: 'services', label: 'Services' },
          { id: 'customers', label: 'Customers' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeSubTab === tab.id ? `2px solid ${theme.colors.primaryLight}` : '2px solid transparent',
              color: activeSubTab === tab.id ? '#FFFFFF' : theme.colors.textMuted,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim, marginBottom: 8 }}>Total Revenue (30d)</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            ₹ {summary.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={13} /> +22% from last month
          </div>
        </div>

        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim, marginBottom: 8 }}>Total Orders Placed</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            {summary.totalOrders}
          </div>
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={13} /> +16% from last month
          </div>
        </div>

        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim, marginBottom: 8 }}>Average Order Value</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            ₹ {summary.avgOrderValue}
          </div>
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={13} /> +8% driven by bulk prints
          </div>
        </div>

        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim, marginBottom: 8 }}>Repeat Customer Rate</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            {summary.repeatCustomerRate}%
          </div>
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={13} /> 308 returning users
          </div>
        </div>
      </div>

      {/* Charts Grid matching Page 11 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Weekly Revenue Trend Bar Chart */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '22px 24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Weekly Daily Sales Trend</h2>
              <span style={{ fontSize: 12, color: theme.colors.textDim }}>Total daily billing across all services</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>+18.4% WoW</span>
          </div>

          {/* Bar Chart Visual */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, gap: 14, paddingBottom: 10 }}>
            {revenueTrend.map((item, idx) => {
              const heightPct = Math.round((item.amount / maxAmount) * 100);
              const isToday = idx === revenueTrend.length - 1;
              return (
                <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isToday ? '#60A5FA' : theme.colors.textDim }}>
                    ₹{item.amount > 1000 ? `${(item.amount / 1000).toFixed(1)}k` : item.amount}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPct}%`,
                      minHeight: 20,
                      borderRadius: '6px 6px 2px 2px',
                      backgroundColor: isToday ? '#2563EB' : '#1F2433',
                      border: `1px solid ${isToday ? '#3B82F6' : theme.colors.borderLight}`,
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: isToday ? '#FFFFFF' : theme.colors.textDim }}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Breakdown Donut / Progress Visual */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '22px 24px',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Sales by Category</h2>
            <span style={{ fontSize: 12, color: theme.colors.textDim }}>Revenue contribution by print format</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {breakdown.map((item, idx) => {
              const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'];
              const color = colors[idx % colors.length];
              return (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.name}</span>
                    <span style={{ color: theme.colors.textMuted }}>{item.percentage}% (₹{item.revenue.toLocaleString()})</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, backgroundColor: '#1E222E', overflow: 'hidden' }}>
                    <div style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Services Table & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        {/* Table */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '20px 24px',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 14 }}>
            Top Performing Services
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.colors.borderLight}`, color: theme.colors.textDim, fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 10px' }}>Print Service</th>
                <th style={{ padding: '8px 10px' }}>Orders</th>
                <th style={{ padding: '8px 10px' }}>Revenue</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Growth</th>
              </tr>
            </thead>
            <tbody>
              {topServices.map((srv, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${theme.colors.border}`, fontSize: 13 }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600, color: '#FFFFFF' }}>{srv.service}</td>
                  <td style={{ padding: '12px 10px', color: theme.colors.textMuted }}>{srv.orders}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 700, color: '#FFFFFF' }}>₹ {srv.revenue.toLocaleString()}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', color: '#10B981', fontWeight: 600 }}>{srv.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Insights Card matching Page 11 */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Sparkles size={18} color="#F59E0B" />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Prinkout AI Shop Insights</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {(analytics?.insights || [
              'A4 Color prints surged by 28% this week driven by semester exams.',
              'Average order preparation turnaround reduced to 18 mins.',
              'UPI payments account for 78% of your daily transactions.',
            ]).map((insight, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                  fontSize: 13,
                  color: '#D1D5DB',
                  lineHeight: 1.45,
                }}
              >
                💡 {insight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
