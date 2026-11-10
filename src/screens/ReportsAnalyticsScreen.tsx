import React, { useState, useMemo } from 'react';
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
  BarChart2,
  Award,
  FileText,
  Clock,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import { theme } from '../theme';

export const ReportsAnalyticsScreen: React.FC = () => {
  const { analytics, orders, navigateTo, showToast } = useMerchant();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Orders' | 'Revenue' | 'Services' | 'Customers'>('Overview');
  const [dateFilter, setDateFilter] = useState<'this_month' | 'last_7_days' | 'last_30_days' | 'all'>('this_month');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Date filtering logic
  const now = new Date();
  const filteredOrders = useMemo(() => {
    if (orders.length === 0) return [];
    if (dateFilter === 'all') return orders;

    const cutoff = new Date();
    if (dateFilter === 'last_7_days') {
      cutoff.setDate(now.getDate() - 7);
      return orders.filter(o => o.createdAt && new Date(o.createdAt) >= cutoff);
    }
    if (dateFilter === 'last_30_days') {
      cutoff.setDate(now.getDate() - 30);
      return orders.filter(o => o.createdAt && new Date(o.createdAt) >= cutoff);
    }
    // this_month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return orders.filter(o => o.createdAt && new Date(o.createdAt) >= startOfMonth);
  }, [orders, dateFilter]);

  // Derived KPI calculations from real filtered orders
  const totalOrders = filteredOrders.length;
  const totalRev = filteredOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || Number(o.orderDetails?.totalPrice) || 0), 0);
  const completedCount = filteredOrders.filter(o => (o.status || '').toLowerCase() === 'completed').length;
  const inQueueCount = filteredOrders.filter(o => ['printing', 'in_progress', 'ready', 'accepted'].includes((o.status || '').toLowerCase())).length;
  const receivedCount = filteredOrders.filter(o => ['received', 'pending'].includes((o.status || '').toLowerCase())).length;
  const uniqueCustomers = Array.from(new Set(filteredOrders.map(o => o.customerPhone || o.userId).filter(Boolean)));
  const customersCount = uniqueCustomers.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
  const platformFee = Math.round(totalRev * 0.10);
  const netEarnings = totalRev - platformFee;

  // Real Dynamic 7-day trend calculations from filtered orders
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const trendPoints = useMemo(() => {
    const points: Array<{ date: string; day: string; label: string; amount: number; orders: number }> = [];
    const numDays = dateFilter === 'last_7_days' ? 7 : 7;
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const dayOrders = filteredOrders.filter(o => {
        if (!o.createdAt) return false;
        const od = new Date(o.createdAt);
        return od.getFullYear() === d.getFullYear() &&
               od.getMonth() === d.getMonth() &&
               od.getDate() === d.getDate();
      });

      const dayAmount = dayOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || Number(o.orderDetails?.totalPrice) || 0), 0);
      points.push({
        date: d.toISOString().split('T')[0],
        day: daysOfWeek[d.getDay()],
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: dayAmount,
        orders: dayOrders.length,
      });
    }
    return points;
  }, [filteredOrders, dateFilter]);

  // Real SVG Chart Coordinate calculation
  const maxTrendAmount = Math.max(...trendPoints.map(p => p.amount), 500);
  const plotWidth = 280;
  const plotHeight = 70;
  const paddingX = 20;
  const baselineY = 100;

  const svgCoords = trendPoints.map((p, idx) => {
    const x = paddingX + (idx / Math.max(1, trendPoints.length - 1)) * plotWidth;
    const y = baselineY - (p.amount / maxTrendAmount) * plotHeight;
    return { ...p, x, y };
  });

  const chartPathD = svgCoords.length > 0
    ? `M ${svgCoords[0].x} ${svgCoords[0].y} ` + svgCoords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ')
    : '';

  const chartAreaD = svgCoords.length > 0
    ? `${chartPathD} L ${svgCoords[svgCoords.length - 1].x} ${baselineY} L ${svgCoords[0].x} ${baselineY} Z`
    : '';

  const activePoint = hoveredPointIndex !== null && svgCoords[hoveredPointIndex]
    ? svgCoords[hoveredPointIndex]
    : svgCoords.find(p => p.amount > 0) || svgCoords[svgCoords.length - 1];

  // Dynamic Service Breakdown from real orders
  const servicesConfig = [
    { name: 'Standard Prints', color: '#8B5CF6', icon: Layers },
    { name: 'Posters', color: '#60A5FA', icon: ImageIcon },
    { name: 'Banners & Flex', color: '#F59E0B', icon: Tv },
    { name: 'T-shirt Printing', color: '#10B981', icon: Shirt },
    { name: 'Invitations', color: '#FDE047', icon: Mail },
  ];

  const serviceBreakdown = useMemo(() => {
    return servicesConfig.map(s => {
      const matchingOrders = filteredOrders.filter(o => {
        const st = (o.serviceType || '').toLowerCase();
        if (s.name === 'Standard Prints') return st.includes('standard') || st.includes('print') || !o.serviceType;
        if (s.name === 'Posters') return st.includes('poster');
        if (s.name === 'Banners & Flex') return st.includes('banner') || st.includes('flex');
        if (s.name === 'T-shirt Printing') return st.includes('t-shirt') || st.includes('shirt');
        if (s.name === 'Invitations') return st.includes('invitation');
        return false;
      });
      const count = matchingOrders.length;
      const amount = matchingOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || Number(o.orderDetails?.totalPrice) || 0), 0);
      const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : (s.name === 'Standard Prints' ? 100 : 0);
      return {
        ...s,
        count,
        amount,
        pct,
      };
    });
  }, [filteredOrders, totalOrders]);

  const topService = serviceBreakdown.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev), serviceBreakdown[0]);

  let cumulativeOffset = 0;
  const donutSegments = serviceBreakdown.map(s => {
    const dashOffset = -cumulativeOffset;
    cumulativeOffset += s.pct;
    return { ...s, dashOffset };
  });

  // Customer Leaderboard calculation
  const customerLeaderboard = useMemo(() => {
    const custMap: { [key: string]: { name: string; phone: string; count: number; spend: number; lastDate: string } } = {};
    filteredOrders.forEach(o => {
      const p = o.customerPhone || o.userId || 'Guest';
      if (!custMap[p]) {
        custMap[p] = {
          name: o.customerName || 'Customer',
          phone: p,
          count: 0,
          spend: 0,
          lastDate: o.createdAt ? new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today',
        };
      }
      custMap[p].count += 1;
      custMap[p].spend += (Number(o.totalPrice) || Number(o.orderDetails?.totalPrice) || 0);
    });
    return Object.values(custMap).sort((a, b) => b.spend - a.spend);
  }, [filteredOrders]);

  // Export CSV Report Functionality
  const exportReportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast('No orders to export in selected period');
      return;
    }
    const headers = ['S.No', 'Order ID', 'Date', 'Customer Name', 'Phone', 'Service', 'Specs', 'Total Amount (INR)', 'Status', 'Payment Method'];
    const rows = filteredOrders.map((o, idx) => [
      idx + 1,
      o.orderId,
      o.createdAt ? new Date(o.createdAt).toLocaleString() : 'N/A',
      `"${(o.customerName || 'Customer').replace(/"/g, '""')}"`,
      o.customerPhone || o.userId || '',
      `"${(o.serviceType || 'Standard Prints').replace(/"/g, '""')}"`,
      `"${(o.specs || 'A4').replace(/"/g, '""')}"`,
      o.totalPrice || o.orderDetails?.totalPrice || 0,
      o.status || 'Received',
      `"${(o.orderDetails?.paymentMethod || 'Razorpay UPI').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Prinkout_Analytics_Report_${dateFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV downloaded successfully');
  };

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
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Subtabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#EFECE4', padding: 4, borderRadius: 20 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '7px 16px',
                borderRadius: 16,
                border: 'none',
                backgroundColor: activeTab === tab ? '#1C1D21' : 'transparent',
                color: activeTab === tab ? '#FFFFFF' : '#6B707B',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Functional Date Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#EFECE4',
                border: '1px solid #DAD5CB',
                borderRadius: 12,
                padding: '8px 14px',
                fontSize: 12.5,
                fontWeight: 600,
                color: '#1A1C20',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'auto',
              }}
            >
              <option value="this_month">This Month ({now.toLocaleDateString([], { month: 'short', year: 'numeric' })})</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <button
            onClick={exportReportCSV}
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
            <span>Export Report (CSV)</span>
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
              {totalOrders > 0 ? `${Math.round((completedCount / totalOrders) * 100)}%` : '0%'}
            </span>
          </div>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(251, 146, 60, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#FB923C" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>

        {/* Unique Customers */}
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
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Unique Customers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>{customersCount}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
              Active
            </span>
          </div>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(167, 139, 250, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#A78BFA" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20' }}>Revenue Trend</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                    Live Dynamic Data
                  </span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#1A1C20', marginBottom: 12 }}>
                  ₹ {totalRev.toLocaleString()}
                </div>
              </div>

              {/* Real Computed SVG line chart */}
              <div style={{ width: '100%', height: 160, position: 'relative' }}>
                {/* Dynamic Tooltip based on active point */}
                {activePoint && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 8,
                      padding: '4px 8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: '1px solid #E5E1D6',
                      textAlign: 'center',
                      zIndex: 3,
                    }}
                  >
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#7C3AED' }}>₹ {activePoint.amount.toLocaleString()}</div>
                    <div style={{ fontSize: 9.5, color: '#8E929B' }}>{activePoint.label} • {activePoint.orders} orders</div>
                  </div>
                )}

                <svg viewBox="0 0 320 120" style={{ width: '100%', height: 'calc(100% - 20px)', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="purpleGradReal" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  <line x1="20" y1="30" x2="300" y2="30" stroke="#EBE7DF" strokeDasharray="3 3" />
                  <line x1="20" y1="65" x2="300" y2="65" stroke="#EBE7DF" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="300" y2="100" stroke="#EBE7DF" />

                  {totalRev > 0 && chartPathD ? (
                    <>
                      <path d={chartAreaD} fill="url(#purpleGradReal)" />
                      <path d={chartPathD} fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
                      {svgCoords.map((pt, idx) => (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredPointIndex === idx ? 6 : 4}
                          fill={hoveredPointIndex === idx ? '#581C87' : '#8B5CF6'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                          onMouseEnter={() => setHoveredPointIndex(idx)}
                          onMouseLeave={() => setHoveredPointIndex(null)}
                        />
                      ))}
                    </>
                  ) : (
                    <line x1="20" y1="100" x2="300" y2="100" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4 4" />
                  )}
                </svg>

                {/* X Axis labels from real dates */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8E929B', marginTop: 4, paddingLeft: 12, paddingRight: 12 }}>
                  {svgCoords.map((lbl, idx) => (
                    <span key={idx}>{lbl.day}</span>
                  ))}
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
                    {totalOrders > 0 && donutSegments.map(s =>
                      s.pct > 0 ? (
                        <circle
                          key={s.name}
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke={s.color}
                          strokeWidth="4"
                          strokeDasharray={`${s.pct} 100`}
                          strokeDashoffset={s.dashOffset}
                        />
                      ) : null
                    )}
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
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1C20', lineHeight: 1 }}>{totalOrders}</span>
                    <span style={{ fontSize: 10, color: '#6B707B' }}>{totalOrders === 1 ? 'Order' : 'Orders'}</span>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11.5 }}>
                  {serviceBreakdown.map(s => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color }} />
                      <span style={{ color: '#555963' }}>{s.name}</span>
                      <b style={{ color: '#1A1C20', marginLeft: 'auto' }}>{s.pct}%</b>
                    </div>
                  ))}
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
                {serviceBreakdown.map(item => {
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
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>₹ {item.amount.toLocaleString()}</span>
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
                    <th style={{ padding: '8px 10px', width: 44 }}>S.NO</th>
                    <th style={{ padding: '8px 10px' }}>ORDER ID</th>
                    <th style={{ padding: '8px 10px' }}>CUSTOMER</th>
                    <th style={{ padding: '8px 10px' }}>SERVICE</th>
                    <th style={{ padding: '8px 10px' }}>AMOUNT</th>
                    <th style={{ padding: '8px 10px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredOrders.length > 0 ? filteredOrders.slice(0, 5) : []).map((o, idx) => {
                    const orderIdDisplay = '#' + (o.orderId.length > 8 ? o.orderId.slice(-4) : o.orderId);
                    const isCompleted = (o.status || '').toLowerCase() === 'completed';
                    return (
                      <tr key={o.orderId} style={{ borderBottom: '1px solid #F0ECE4' }}>
                        <td style={{ padding: '10px', color: '#8E929B', fontWeight: 600 }}>{idx + 1}</td>
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
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px 10px', textAlign: 'center', color: '#8E929B', fontSize: 12 }}>
                        No orders found in selected date range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Insights Card */}
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
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <TrendingUp size={16} color="#6B21A8" />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#581C87' }}>Live Insights</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: '#581C87', lineHeight: 1.5 }}>
                  <div>• Gross revenue of <b>₹ {totalRev.toLocaleString()}</b> across <b>{totalOrders}</b> order{totalOrders === 1 ? '' : 's'}.</div>
                  <div>• Average ticket value is <b>₹ {avgOrderValue.toLocaleString()}</b> per order.</div>
                  <div>• <b>{topService.name}</b> generated <b>{topService.pct}%</b> of revenue.</div>
                  <div>• <b>{customersCount} unique customer{customersCount === 1 ? '' : 's'}</b> placed orders in this period.</div>
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid #DDD6FE', fontSize: 11.5, color: '#6B21A8' }}>
                All calculations updated from live DynamoDB orders.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDERS ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'Orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Order Status Filters */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[
                { id: 'all', label: `All Orders (${filteredOrders.length})` },
                { id: 'completed', label: `Completed (${completedCount})` },
                { id: 'printing', label: `In Queue (${inQueueCount})` },
                { id: 'received', label: `Received (${receivedCount})` },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderStatusFilter(f.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 12,
                    border: orderStatusFilter === f.id ? '1.5px solid #7C3AED' : '1px solid #DAD5CB',
                    backgroundColor: orderStatusFilter === f.id ? '#EDE9FE' : '#FFFFFF',
                    color: orderStatusFilter === f.id ? '#6B21A8' : '#374151',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 12, color: '#6B7280' }}>
              Showing {filteredOrders.filter(o => orderStatusFilter === 'all' || (o.status || '').toLowerCase().includes(orderStatusFilter)).length} orders
            </div>
          </div>

          {/* Full Orders Table */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 22px',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 14 }}>
              Order Records & Status Breakdown
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                <thead>
                  <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                    <th style={{ padding: '10px', width: 44 }}>S.NO</th>
                    <th style={{ padding: '10px' }}>ORDER ID</th>
                    <th style={{ padding: '10px' }}>DATE & TIME</th>
                    <th style={{ padding: '10px' }}>CUSTOMER</th>
                    <th style={{ padding: '10px' }}>SERVICE & SPECS</th>
                    <th style={{ padding: '10px' }}>QTY / COPIES</th>
                    <th style={{ padding: '10px' }}>TOTAL (₹)</th>
                    <th style={{ padding: '10px' }}>PAYMENT</th>
                    <th style={{ padding: '10px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders
                    .filter(o => orderStatusFilter === 'all' || (o.status || '').toLowerCase().includes(orderStatusFilter))
                    .map((o, idx) => {
                      const isCompleted = (o.status || '').toLowerCase() === 'completed';
                      return (
                        <tr key={o.orderId} style={{ borderBottom: '1px solid #F0ECE4' }}>
                          <td style={{ padding: '12px 10px', color: '#8E929B', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>
                            #{o.orderId.length > 8 ? o.orderId.slice(-6) : o.orderId}
                          </td>
                          <td style={{ padding: '12px 10px', color: '#555963' }}>
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ fontWeight: 600, color: '#1A1C20' }}>{o.customerName || 'Customer'}</div>
                            <div style={{ fontSize: 11, color: '#8E929B' }}>{o.customerPhone || o.userId}</div>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ fontWeight: 600, color: '#1A1C20' }}>{o.serviceType || 'Standard Prints'}</div>
                            <div style={{ fontSize: 11, color: '#8E929B' }}>{o.specs || 'A4 • B&W'}</div>
                          </td>
                          <td style={{ padding: '12px 10px', color: '#1A1C20' }}>
                            {o.orderDetails?.quantity || o.copies || 1} copies
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>
                            ₹ {o.totalPrice || 0}
                          </td>
                          <td style={{ padding: '12px 10px', color: '#15803D', fontWeight: 600 }}>
                            {o.paymentStatus || 'PAID (UPI)'}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REVENUE ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'Revenue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Revenue Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div style={{ backgroundColor: theme.colors.creamCard, border: `1px solid ${theme.colors.creamCardBorder}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Gross Sales</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20' }}>₹ {totalRev.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#15803D', marginTop: 4 }}>100% of order values</div>
            </div>

            <div style={{ backgroundColor: theme.colors.creamCard, border: `1px solid ${theme.colors.creamCardBorder}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Platform Fee (10%)</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#EF4444' }}>- ₹ {platformFee.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Standard Prinkout Commission</div>
            </div>

            <div style={{ backgroundColor: '#EDE9FE', border: '1px solid #DDD6FE', borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: '#6B21A8', marginBottom: 4 }}>Net Merchant Payout</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#581C87' }}>₹ {netEarnings.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#6B21A8', marginTop: 4 }}>90% settled to your bank</div>
            </div>

            <div style={{ backgroundColor: theme.colors.creamCard, border: `1px solid ${theme.colors.creamCardBorder}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Average Order Value</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20' }}>₹ {avgOrderValue.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#15803D', marginTop: 4 }}>Across all service types</div>
            </div>
          </div>

          {/* Daily Revenue Table */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 22px',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 14 }}>
              Daily Revenue & Settlement Journal
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
              <thead>
                <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                  <th style={{ padding: '10px', width: 44 }}>S.NO</th>
                  <th style={{ padding: '10px' }}>DATE</th>
                  <th style={{ padding: '10px' }}>DAY</th>
                  <th style={{ padding: '10px' }}>ORDERS</th>
                  <th style={{ padding: '10px' }}>GROSS REVENUE</th>
                  <th style={{ padding: '10px' }}>COMMISSION (10%)</th>
                  <th style={{ padding: '10px' }}>NET SETTLEMENT</th>
                  <th style={{ padding: '10px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {trendPoints.map((row, idx) => {
                  const gross = row.amount;
                  const comm = Math.round(gross * 0.10);
                  const net = gross - comm;
                  return (
                    <tr key={row.date} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px', color: '#8E929B', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>{row.label}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.day}</td>
                      <td style={{ padding: '12px 10px', color: '#1A1C20' }}>{row.orders} orders</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>₹ {gross.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px', color: '#EF4444' }}>- ₹ {comm.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#15803D' }}>₹ {net.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 8px',
                            borderRadius: 12,
                            backgroundColor: gross > 0 ? '#DCFCE7' : '#F3F4F6',
                            color: gross > 0 ? '#15803D' : '#9CA3AF',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {gross > 0 ? '✓ Batched' : 'No Activity'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SERVICES PERFORMANCE */}
      {/* ========================================================================= */}
      {activeTab === 'Services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 22px',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 14 }}>
              Service Performance Matrix
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
              <thead>
                <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                  <th style={{ padding: '10px', width: 44 }}>S.NO</th>
                  <th style={{ padding: '10px' }}>SERVICE CATEGORY</th>
                  <th style={{ padding: '10px' }}>ORDERS COUNT</th>
                  <th style={{ padding: '10px' }}>TOTAL REVENUE (₹)</th>
                  <th style={{ padding: '10px' }}>REVENUE SHARE</th>
                  <th style={{ padding: '10px' }}>AVG PER JOB</th>
                  <th style={{ padding: '10px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {serviceBreakdown.map((s, idx) => {
                  const Icon = s.icon;
                  const avg = s.count > 0 ? Math.round(s.amount / s.count) : 0;
                  return (
                    <tr key={s.name} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px', color: '#8E929B', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={16} color="#7C3AED" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1A1C20' }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: '#8E929B' }}>Retail & Commercial print</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: '#1A1C20' }}>{s.count} orders</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>₹ {s.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, maxWidth: 80, height: 6, borderRadius: 3, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                            <div style={{ width: `${s.pct}%`, height: '100%', backgroundColor: s.color }} />
                          </div>
                          <span style={{ fontWeight: 600, color: '#1A1C20' }}>{s.pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>₹ {avg.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 12, backgroundColor: s.count > 0 ? '#DCFCE7' : '#F3F4F6', color: s.count > 0 ? '#15803D' : '#6B7280', fontSize: 11, fontWeight: 600 }}>
                          {s.count > 0 ? 'Active Service' : 'Enabled'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CUSTOMERS ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'Customers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Customer KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <div style={{ backgroundColor: theme.colors.creamCard, border: `1px solid ${theme.colors.creamCardBorder}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Total Unique Customers</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20' }}>{customerLeaderboard.length}</div>
              <div style={{ fontSize: 11, color: '#15803D', marginTop: 4 }}>Verified client accounts</div>
            </div>

            <div style={{ backgroundColor: theme.colors.creamCard, border: `1px solid ${theme.colors.creamCardBorder}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Repeat Buyers</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#7C3AED' }}>
                {customerLeaderboard.filter(c => c.count > 1).length}
              </div>
              <div style={{ fontSize: 11, color: '#7C3AED', marginTop: 4 }}>
                {customerLeaderboard.length > 0 ? `${Math.round((customerLeaderboard.filter(c => c.count > 1).length / customerLeaderboard.length) * 100)}% retention rate` : '0%'}
              </div>
            </div>

            <div style={{ backgroundColor: theme.colors.creamCard, border: `1px solid ${theme.colors.creamCardBorder}`, borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Avg Spend Per Customer</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20' }}>
                ₹ {customerLeaderboard.length > 0 ? Math.round(totalRev / customerLeaderboard.length) : 0}
              </div>
              <div style={{ fontSize: 11, color: '#15803D', marginTop: 4 }}>Lifetime value metric</div>
            </div>
          </div>

          {/* Customer Leaderboard Table */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 22px',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 14 }}>
              Customer Directory & Order History
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
              <thead>
                <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                  <th style={{ padding: '10px', width: 44 }}>S.NO</th>
                  <th style={{ padding: '10px' }}>CUSTOMER NAME</th>
                  <th style={{ padding: '10px' }}>MOBILE NUMBER</th>
                  <th style={{ padding: '10px' }}>TOTAL ORDERS</th>
                  <th style={{ padding: '10px' }}>TOTAL SPENT (₹)</th>
                  <th style={{ padding: '10px' }}>LAST ORDER DATE</th>
                  <th style={{ padding: '10px' }}>TIER</th>
                </tr>
              </thead>
              <tbody>
                {customerLeaderboard.map((c, idx) => (
                  <tr key={c.phone} style={{ borderBottom: '1px solid #F0ECE4' }}>
                    <td style={{ padding: '12px 10px', color: '#8E929B', fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>{c.name}</td>
                    <td style={{ padding: '12px 10px', color: '#555963' }}>{c.phone}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#1A1C20' }}>{c.count} order{c.count === 1 ? '' : 's'}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>₹ {c.spend.toLocaleString()}</td>
                    <td style={{ padding: '12px 10px', color: '#555963' }}>{c.lastDate}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          padding: '2px 8px',
                          borderRadius: 12,
                          backgroundColor: c.count > 1 || c.spend > 200 ? '#EDE9FE' : '#F3F4F6',
                          color: c.count > 1 || c.spend > 200 ? '#6B21A8' : '#374151',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {c.count > 1 || c.spend > 200 ? '⭐ VIP Client' : 'Standard'}
                      </span>
                    </td>
                  </tr>
                ))}
                {customerLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#8E929B' }}>
                      No customer records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
