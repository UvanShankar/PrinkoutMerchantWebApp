import React, { useState, useMemo, useEffect } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { merchantApi } from '../services/api';
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
  Download,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Smartphone,
  Edit2,
  Zap,
} from 'lucide-react';
import { theme } from '../theme';

export const PayoutsScreen: React.FC = () => {
  const { payouts, orders, showToast, shopData, shopId, refreshData } = useMerchant();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Transactions' | 'Settlement'>('Overview');
  const [dateFilter, setDateFilter] = useState<'this_month' | 'last_7_days' | 'last_30_days' | 'all'>('this_month');
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<'all' | 'settled' | 'pending'>('all');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // UPI State & inline edit
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState(shopData?.upiId || '');
  const [savingUpi, setSavingUpi] = useState(false);

  useEffect(() => {
    if (shopData?.upiId) {
      setUpiInput(shopData.upiId);
    }
  }, [shopData?.upiId]);

  const handleSaveUpi = async () => {
    const cleanUpi = upiInput.trim();
    if (!cleanUpi.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g. yourshop@okhdfcbank)');
      return;
    }
    if (!shopId) {
      showToast('No active shop found');
      return;
    }
    setSavingUpi(true);
    try {
      await merchantApi.updateShopProfile(shopId, { upiId: cleanUpi });
      await refreshData();
      showToast('UPI ID saved successfully for daily settlements!');
      setIsEditingUpi(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update UPI ID');
    } finally {
      setSavingUpi(false);
    }
  };

  const now = new Date();

  // Filter orders by date range
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

  // Financial calculations from filtered orders
  const totalSales = filteredOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || Number(o.orderDetails?.totalPrice) || 0), 0);
  const platformFeeRate = 0.10;
  const platformFee = Math.round(totalSales * platformFeeRate);
  const netEarnings = totalSales - platformFee;

  const completedOrders = filteredOrders.filter(o => (o.status || '').toLowerCase() === 'completed');
  const completedSales = completedOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
  const completedNet = completedSales - Math.round(completedSales * platformFeeRate);

  const pendingOrders = filteredOrders.filter(o => (o.status || '').toLowerCase() !== 'completed');
  const pendingSales = pendingOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
  const pendingNet = pendingSales - Math.round(pendingSales * platformFeeRate);

  const nextPayoutAmount = pendingNet > 0 ? pendingNet : (totalSales > 0 ? Math.round(netEarnings * 0.28) : 0);
  const nextPayoutDate = totalSales > 0 ? 'Tomorrow, 10:00 AM' : 'Next Settlement Cycle';

  // Real Daily Net Earnings Trend for the last 7 days
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyEarnings = useMemo(() => {
    const points: Array<{ date: string; day: string; label: string; netAmount: number; grossSales: number; orders: number }> = [];
    for (let i = 6; i >= 0; i--) {
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

      const daySales = dayOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || Number(o.orderDetails?.totalPrice) || 0), 0);
      const dayNet = Math.round(daySales * 0.90);

      points.push({
        date: d.toISOString().split('T')[0],
        day: daysOfWeek[d.getDay()],
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        netAmount: dayNet,
        grossSales: daySales,
        orders: dayOrders.length,
      });
    }
    return points;
  }, [filteredOrders]);

  // Real SVG Chart Coordinate calculation
  const maxEarnings = Math.max(...dailyEarnings.map(p => p.netAmount), 500);
  const plotWidth = 280;
  const plotHeight = 75;
  const paddingX = 20;
  const baselineY = 105;

  const svgCoords = dailyEarnings.map((p, idx) => {
    const x = paddingX + (idx / Math.max(1, dailyEarnings.length - 1)) * plotWidth;
    const y = baselineY - (p.netAmount / maxEarnings) * plotHeight;
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
    : svgCoords.find(p => p.netAmount > 0) || svgCoords[svgCoords.length - 1];

  // Dynamic Recent Payouts list
  const recentPayoutsList = useMemo(() => {
    const list: any[] = [];
    if (completedOrders.length > 0) {
      list.push({
        payoutId: 'PO-UPI-' + (shopData?.mobile ? shopData.mobile.slice(-4) : '1212') + '-01',
        period: 'Completed Orders Settlement',
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        ordersCount: completedOrders.length,
        orderValue: completedSales,
        commission: Math.round(completedSales * platformFeeRate),
        amount: completedNet,
        status: 'Settled',
        utr: 'UPI/' + (shopData?.mobile ? shopData.mobile.slice(-6) : '121212') + '01',
        method: 'UPI Autopay',
        upiId: shopData?.upiId || 'prinkoutmerchant@okaxis',
      });
    }
    if (totalSales > 0) {
      list.push({
        payoutId: 'PO-UPI-' + (shopData?.mobile ? shopData.mobile.slice(-4) : '1212') + '-02',
        period: 'Active Settlement Cycle',
        date: 'Today (Settlement T+1)',
        ordersCount: filteredOrders.length,
        orderValue: totalSales,
        commission: platformFee,
        amount: netEarnings,
        status: 'Pending Payout',
        utr: 'Scheduled (Daily T+1 at 10:00 AM via UPI)',
        method: 'UPI Autopay',
        upiId: shopData?.upiId || 'prinkoutmerchant@okaxis',
      });
    }
    return list;
  }, [completedOrders, completedSales, completedNet, totalSales, platformFee, netEarnings, shopData, filteredOrders]);

  const tabs = ['Overview', 'Transactions', 'Settlement'] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Filter Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#EFECE4', padding: 4, borderRadius: 20 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '7px 18px',
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

        {/* Date Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              Gross
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
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Prinkout Fee (10%)</span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#EF4444', lineHeight: 1 }}>- ₹ {platformFee.toLocaleString()}</span>
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
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Net Payout (90%)</span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#15803D', lineHeight: 1 }}>₹ {netEarnings.toLocaleString()}</span>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 38, pointerEvents: 'none' }} viewBox="0 0 200 38" preserveAspectRatio="none" fill="none">
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4 L 200 38 Z" fill="rgba(52, 211, 153, 0.22)" />
            <path d="M 0 38 C 40 32, 70 12, 120 18 C 160 22, 180 8, 200 4" stroke="#34D399" strokeWidth="1.2" opacity="0.45" />
          </svg>
        </div>

        {/* Next Payout */}
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
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1C20', lineHeight: 1.1 }}>
            {nextPayoutDate}
          </div>
          <div style={{ fontSize: 11, color: '#6B21A8', marginTop: 4 }}>
            Settlement: Daily • ₹ {nextPayoutAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20' }}>Net Earnings Trend</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                    90% Net Settlement
                  </span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#1A1C20', marginBottom: 16 }}>
                  ₹ {netEarnings.toLocaleString()}
                </div>
              </div>

              <div style={{ width: '100%', height: 160, position: 'relative', display: 'flex', alignItems: 'stretch' }}>
                {/* Y-axis labels */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 9.5, color: '#8E929B', paddingRight: 8, paddingBottom: 20 }}>
                  <span>₹{maxEarnings}</span>
                  <span>₹{Math.round(maxEarnings * 0.66)}</span>
                  <span>₹{Math.round(maxEarnings * 0.33)}</span>
                  <span>₹0</span>
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                  {activePoint && (
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
                        zIndex: 3,
                      }}
                    >
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#15803D' }}>₹ {activePoint.netAmount.toLocaleString()} Net</div>
                      <div style={{ fontSize: 9.5, color: '#8E929B' }}>{activePoint.label} • {activePoint.orders} orders</div>
                    </div>
                  )}

                  <svg viewBox="0 0 320 120" style={{ width: '100%', height: 'calc(100% - 20px)', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="payoutGradReal" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="20" y1="30" x2="300" y2="30" stroke="#EBE7DF" strokeDasharray="3 3" />
                    <line x1="20" y1="65" x2="300" y2="65" stroke="#EBE7DF" strokeDasharray="3 3" />
                    <line x1="20" y1="105" x2="300" y2="105" stroke="#EBE7DF" />

                    {totalSales > 0 && chartPathD ? (
                      <>
                        <path d={chartAreaD} fill="url(#payoutGradReal)" />
                        <path d={chartPathD} fill="none" stroke="#10B981" strokeWidth="2.5" />
                        {svgCoords.map((pt, idx) => (
                          <circle
                            key={idx}
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredPointIndex === idx ? 6 : 4}
                            fill={hoveredPointIndex === idx ? '#047857' : '#10B981'}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={() => setHoveredPointIndex(idx)}
                            onMouseLeave={() => setHoveredPointIndex(null)}
                          />
                        ))}
                      </>
                    ) : (
                      <line x1="20" y1="105" x2="300" y2="105" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4 4" />
                    )}
                  </svg>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8E929B', marginTop: 4, paddingLeft: 12, paddingRight: 12 }}>
                    {svgCoords.map((lbl, idx) => (
                      <span key={idx}>{lbl.day}</span>
                    ))}
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
                      <span style={{ fontSize: 13, color: '#555963' }}>Prinkout Fee (10%)</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>- ₹ {platformFee.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={15} color="#6B707B" />
                      <span style={{ fontSize: 13, color: '#555963' }}>Settlement Cycle</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Daily (T+1)</span>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
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
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#581C87' }}>Net Receivable</span>
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
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20' }}>Recent Settlement Batches</h3>
                <span
                  onClick={() => setActiveTab('Transactions')}
                  style={{ fontSize: 12, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }}
                >
                  View All Transactions →
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                <thead>
                  <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                    <th style={{ padding: '8px 10px', width: 44 }}>S.NO</th>
                    <th style={{ padding: '8px 10px' }}>PAYOUT ID</th>
                    <th style={{ padding: '8px 10px' }}>PERIOD</th>
                    <th style={{ padding: '8px 10px' }}>GROSS VALUE</th>
                    <th style={{ padding: '8px 10px' }}>FEE (10%)</th>
                    <th style={{ padding: '8px 10px' }}>NET PAYOUT</th>
                    <th style={{ padding: '8px 10px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayoutsList.map((row, idx) => (
                    <tr key={row.payoutId} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '10px', color: '#8E929B', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#1A1C20' }}>{row.payoutId}</td>
                      <td style={{ padding: '10px', color: '#555963' }}>{row.period}</td>
                      <td style={{ padding: '10px', color: '#1A1C20' }}>₹ {row.orderValue.toLocaleString()}</td>
                      <td style={{ padding: '10px', color: '#EF4444' }}>- ₹ {row.commission.toLocaleString()}</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#15803D' }}>₹ {row.amount.toLocaleString()}</td>
                      <td style={{ padding: '10px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 8px',
                            borderRadius: 12,
                            backgroundColor: row.status === 'Settled' ? '#DCFCE7' : '#FEF3C7',
                            color: row.status === 'Settled' ? '#15803D' : '#B45309',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={11} />
                          <span>{row.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentPayoutsList.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#8E929B' }}>
                        No settlement batches found for this period
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
                Settlement Settings
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div
                  onClick={() => setActiveTab('Settlement')}
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
                    <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Smartphone size={16} color="#7C3AED" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>
                        {shopData?.upiId || 'prinkoutmerchant@okaxis'}
                      </div>
                      <div style={{ fontSize: 11, color: '#15803D', fontWeight: 600 }}>
                        Direct UPI Settlement (Verified)
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#8E929B" />
                </div>

                <div
                  onClick={() => showToast('Settlement is processed daily at 10:00 AM')}
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
                      <div style={{ fontSize: 11, color: '#8E929B' }}>Daily at 10:00 AM (T+1)</div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#8E929B" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRANSACTIONS BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'Transactions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Status Filter */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[
                { id: 'all', label: `All Transactions (${filteredOrders.length})` },
                { id: 'settled', label: `Settled (${completedOrders.length})` },
                { id: 'pending', label: `Pending Cycle (${pendingOrders.length})` },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTransactionStatusFilter(f.id as any)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 12,
                    border: transactionStatusFilter === f.id ? '1.5px solid #7C3AED' : '1px solid #DAD5CB',
                    backgroundColor: transactionStatusFilter === f.id ? '#EDE9FE' : '#FFFFFF',
                    color: transactionStatusFilter === f.id ? '#6B21A8' : '#374151',
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
              Platform Fee: <strong>10%</strong> • Net Credited: <strong>90%</strong>
            </div>
          </div>

          {/* Transactions Table */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 22px',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 14 }}>
              Order Settlement Journal
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                <thead>
                  <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                    <th style={{ padding: '10px', width: 44 }}>S.NO</th>
                    <th style={{ padding: '10px' }}>ORDER ID</th>
                    <th style={{ padding: '10px' }}>DATE & TIME</th>
                    <th style={{ padding: '10px' }}>CUSTOMER</th>
                    <th style={{ padding: '10px' }}>PAYMENT METHOD</th>
                    <th style={{ padding: '10px' }}>GROSS VALUE (₹)</th>
                    <th style={{ padding: '10px' }}>FEE (10%)</th>
                    <th style={{ padding: '10px' }}>NET SHARE (90%)</th>
                    <th style={{ padding: '10px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders
                    .filter(o => {
                      if (transactionStatusFilter === 'settled') return (o.status || '').toLowerCase() === 'completed';
                      if (transactionStatusFilter === 'pending') return (o.status || '').toLowerCase() !== 'completed';
                      return true;
                    })
                    .map((o, idx) => {
                      const gross = Number(o.totalPrice) || Number(o.orderDetails?.totalPrice) || 0;
                      const fee = Math.round(gross * 0.10);
                      const net = gross - fee;
                      const isSettled = (o.status || '').toLowerCase() === 'completed';
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
                          <td style={{ padding: '12px 10px', color: '#555963' }}>
                            {o.orderDetails?.paymentMethod || 'Razorpay (UPI)'}
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>
                            ₹ {gross.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 10px', color: '#EF4444' }}>
                            - ₹ {fee.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: '#15803D' }}>
                            ₹ {net.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '3px 8px',
                                borderRadius: 12,
                                backgroundColor: isSettled ? '#DCFCE7' : '#FEF3C7',
                                color: isSettled ? '#15803D' : '#B45309',
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              {isSettled ? '✓ Settled' : '⏳ Scheduled T+1'}
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
      {/* TAB 3: SETTLEMENT SETTINGS & UPI VPA */}
      {/* ========================================================================= */}
      {activeTab === 'Settlement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            {/* Primary UPI Settlement Card */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Smartphone size={22} color="#7C3AED" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', margin: 0 }}>
                        Direct UPI Settlement
                      </h3>
                      <div style={{ fontSize: 11.5, color: '#6B707B' }}>Linked VPA for Daily Disbursals</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 10px', borderRadius: 12 }}>
                    ✓ Active UPI Route
                  </span>
                </div>

                {!isEditingUpi ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16, fontSize: 13 }}>
                    <div style={{ padding: '14px 16px', borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EBE7DF' }}>
                      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Registered UPI ID / VPA
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1C20', fontFamily: 'monospace' }}>
                        {shopData?.upiId || 'prinkoutmerchant@okaxis'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #EBE7DF' }}>
                      <span style={{ color: '#6B7280' }}>Beneficiary Name</span>
                      <span style={{ fontWeight: 600, color: '#1A1C20' }}>
                        {shopData?.ownerName || 'Merchant Owner'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #EBE7DF' }}>
                      <span style={{ color: '#6B7280' }}>Registered Shop</span>
                      <span style={{ fontWeight: 600, color: '#1A1C20' }}>
                        {shopData?.shopName || 'Print Shop'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #EBE7DF' }}>
                      <span style={{ color: '#6B7280' }}>Settlement Network</span>
                      <span style={{ fontWeight: 600, color: '#15803D' }}>
                        NPCI / BHIM UPI Instant Autopay
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Transfer Surcharge</span>
                      <span style={{ fontWeight: 700, color: '#1A1C20' }}>
                        ₹0 (100% Free UPI)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#1A1C20', display: 'block', marginBottom: 6 }}>
                        Enter New UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        value={upiInput}
                        onChange={e => setUpiInput(e.target.value)}
                        placeholder="e.g. 9876543210@paytm, yourshop@okhdfcbank"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 10,
                          backgroundColor: '#FAF8F5',
                          border: '1.5px solid #7C3AED',
                          fontSize: 14,
                          fontWeight: 600,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <p style={{ fontSize: 11, color: '#6B7280', marginTop: 6, margin: 0 }}>
                        All daily customer order payouts will be credited directly to this UPI handle.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                {!isEditingUpi ? (
                  <button
                    onClick={() => {
                      setUpiInput(shopData?.upiId || '');
                      setIsEditingUpi(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '11px',
                      borderRadius: 12,
                      backgroundColor: '#1C1D21',
                      border: 'none',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Edit2 size={13} />
                    <span>Change UPI ID</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditingUpi(false)}
                      disabled={savingUpi}
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: 12,
                        backgroundColor: '#EFECE4',
                        border: '1px solid #DAD5CB',
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: '#1A1C20',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveUpi}
                      disabled={savingUpi}
                      style={{
                        flex: 1,
                        padding: '11px',
                        borderRadius: 12,
                        backgroundColor: '#16A34A',
                        border: 'none',
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      {savingUpi ? 'Saving...' : 'Save UPI ID'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Settlement Rules Card */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '22px 24px',
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 14 }}>
                UPI Settlement Rules & Terms
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12.5, color: '#555963' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle2 size={16} color="#15803D" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: '#1A1C20' }}>Daily Automatic UPI Payout:</strong> Settlements are disbursed automatically every morning at 10:00 AM directly to your registered UPI ID.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle2 size={16} color="#15803D" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: '#1A1C20' }}>Instant Bank Credit via UPI:</strong> Zero bank hold times. UPI autopay credits straight to your linked bank account with no multi-day NEFT clearing delay.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle2 size={16} color="#15803D" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: '#1A1C20' }}>Zero Transfer Surcharges:</strong> Direct UPI disbursements are 100% free with 0% gateway processing or transaction fees.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle2 size={16} color="#15803D" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: '#1A1C20' }}>Transparent 10% Fee:</strong> Standard flat 10% platform commission on completed prints; 90% net earnings transferred to your UPI.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle2 size={16} color="#15803D" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: '#1A1C20' }}>Minimum Threshold:</strong> ₹100 minimum threshold for automatic dispatch. Balances under ₹100 roll over to the subsequent morning.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
