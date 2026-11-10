import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  ShoppingBag,
  Layers,
  Printer,
  Package,
  ArrowRight,
  Tag,
  Clock,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';
import { theme } from '../theme';

export const DashboardScreen: React.FC = () => {
  const { orders, analytics, navigateTo, setSelectedOrderId } = useMerchant();
  const [timelineTab, setTimelineTab] = useState<'Today' | 'Week' | 'Month'>('Today');

  const todayOrdersCount = orders.length > 0 ? orders.length : (analytics?.today?.ordersCount ?? 0);
  const todayRevenue = orders.length > 0
    ? orders.reduce((sum, o) => sum + (o.totalPrice || o.orderDetails?.totalPrice || 0), 0)
    : (analytics?.today?.revenue ?? 0);
  const inPrintingCount = orders.filter(o => o.status?.toLowerCase() === 'printing').length || (analytics?.today?.inPrinting ?? 0);
  const readyCount = orders.filter(o => {
    const s = o.status?.toLowerCase();
    return s === 'ready' || s === 'ready_for_pickup';
  }).length || (analytics?.today?.readyForPickup ?? 0);

  // Dynamic Orders Overview pipeline counts
  const receivedPipelineCount = orders.length > 0
    ? orders.filter(o => {
        const s = (o.status || '').toLowerCase();
        return s === 'received' || s === 'pending' || s === 'accepted' || s === 'in_progress';
      }).length
    : (analytics?.pipeline?.received ?? 0);

  const printingPipelineCount = orders.length > 0
    ? orders.filter(o => (o.status || '').toLowerCase() === 'printing').length
    : (analytics?.pipeline?.printing ?? 0);

  const readyPipelineCount = orders.length > 0
    ? orders.filter(o => {
        const s = (o.status || '').toLowerCase();
        return s === 'ready' || s === 'ready_for_pickup';
      }).length
    : (analytics?.pipeline?.ready ?? 0);

  const completedPipelineCount = orders.length > 0
    ? orders.filter(o => (o.status || '').toLowerCase() === 'completed').length
    : (analytics?.pipeline?.completed ?? 0);

  const displayOrders = (orders || []).slice(0, 5).map(o => {
    const rawStatus = (o.status || 'received').toLowerCase();
    const normalizedStatus = (rawStatus === 'pending') ? 'received' : rawStatus;
    return {
      id: o.orderId.startsWith('#') ? o.orderId : `#${o.orderId.slice(0, 4)}`,
      customer: o.customerName || (o.userId ? `Customer (${o.userId.slice(-6)})` : 'Customer'),
      type: o.specs || `${o.paperSize || 'A4'} ${o.colorMode || 'Colour'} (${o.orderDetails?.quantity || 1} copies)`,
      amount: (o.totalPrice || o.orderDetails?.totalPrice || 0).toLocaleString(),
      status: normalizedStatus,
      time: o.timeAgo || (o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'),
    };
  });

  // Status badge renderer matching PDF colors
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'printing':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: '#FFEDD5',
              color: '#C2410C',
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            <Printer size={12} />
            <span>Printing</span>
          </span>
        );
      case 'ready':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={12} />
            <span>Ready to Deliver</span>
          </span>
        );
      case 'received':
      case 'pending':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            <ShoppingBag size={12} />
            <span>Received</span>
          </span>
        );
      case 'completed':
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: '#F3F4F6',
              color: '#4B5563',
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={12} />
            <span>Completed</span>
          </span>
        );
    }
  };

  const DuneWave: React.FC = () => (
    <svg
      style={{ position: 'absolute', bottom: 0, right: 0, width: 130, height: 42, pointerEvents: 'none' }}
      viewBox="0 0 130 42"
      fill="none"
    >
      <path
        d="M 0 42 C 25 34, 55 18, 90 22 C 110 24, 122 14, 130 8 L 130 42 Z"
        fill="rgba(0, 0, 0, 0.04)"
      />
      <path
        d="M 15 42 C 45 38, 75 26, 105 28 C 118 29, 125 22, 130 18 L 130 42 Z"
        fill="rgba(0, 0, 0, 0.03)"
      />
      <path
        d="M 0 42 C 25 34, 55 18, 90 22 C 110 24, 122 14, 130 8"
        stroke="rgba(0, 0, 0, 0.07)"
        strokeWidth="1"
      />
    </svg>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 4 Top KPI Cards matching PDF */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {/* Card 1: Today's Orders */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ShoppingBag size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Today's Orders</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>{todayOrdersCount}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '2px 8px',
                borderRadius: 12,
              }}
            >
              Live
            </span>
          </div>
          <DuneWave />
        </div>

        {/* Card 2: Today's Revenue */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Layers size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Today's Revenue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>₹ {todayRevenue.toLocaleString()}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '2px 8px',
                borderRadius: 12,
              }}
            >
              Live
            </span>
          </div>
          <DuneWave />
        </div>

        {/* Card 3: In Printing */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Printer size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>In Printing</span>
          </div>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>{inPrintingCount}</span>
          <DuneWave />
        </div>

        {/* Card 4: Ready for Pickup */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Package size={16} color="#555963" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#555963' }}>Ready to Deliver</span>
          </div>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>{readyCount}</span>
          <DuneWave />
        </div>
      </div>

      {/* Middle Row: Orders Overview & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16 }}>
        {/* Orders Overview Flow */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '20px 22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>Orders Overview</h2>

            {/* Segmented control */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: '#EBE7DF',
                borderRadius: 20,
                padding: '3px',
              }}
            >
              {(['Today', 'Week', 'Month'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setTimelineTab(tab)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 16,
                    border: 'none',
                    backgroundColor: timelineTab === tab ? '#1C1D21' : 'transparent',
                    color: timelineTab === tab ? '#FFFFFF' : '#6B707B',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Pipeline step boxes */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {/* 1: Received */}
            <div
              onClick={() => navigateTo('orders')}
              style={{
                flex: 1,
                backgroundColor: '#1C1D21',
                color: '#FFFFFF',
                borderRadius: 14,
                padding: '16px 12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              title="View Received Orders"
            >
              <ShoppingBag size={18} color="#FFFFFF" style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{receivedPipelineCount}</div>
              <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>Received</div>
            </div>

            <ArrowRight size={16} color="#A3A7AF" />

            {/* 2: Printing */}
            <div
              onClick={() => navigateTo('queue')}
              style={{
                flex: 1,
                backgroundColor: '#EFECE4',
                border: '1px solid #DAD5CB',
                color: '#1A1C20',
                borderRadius: 14,
                padding: '16px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              title="View Print Queue"
            >
              <Printer size={18} color="#1A1C20" style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{printingPipelineCount}</div>
              <div style={{ fontSize: 11.5, color: '#555963', marginTop: 2 }}>Printing</div>
            </div>

            <ArrowRight size={16} color="#A3A7AF" />

            {/* 3: Ready */}
            <div
              onClick={() => navigateTo('orders')}
              style={{
                flex: 1,
                backgroundColor: '#EFECE4',
                border: '1px solid #DAD5CB',
                color: '#1A1C20',
                borderRadius: 14,
                padding: '16px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              title="View Ready to Deliver Orders"
            >
              <CheckCircle2 size={18} color="#1A1C20" style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{readyPipelineCount}</div>
              <div style={{ fontSize: 11.5, color: '#555963', marginTop: 2 }}>Ready to Deliver</div>
            </div>

            <ArrowRight size={16} color="#A3A7AF" />

            {/* 4: Completed */}
            <div
              onClick={() => navigateTo('orders')}
              style={{
                flex: 1,
                backgroundColor: '#EFECE4',
                border: '1px solid #DAD5CB',
                color: '#1A1C20',
                borderRadius: 14,
                padding: '16px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              title="View Completed Orders"
            >
              <Package size={18} color="#1A1C20" style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{completedPipelineCount}</div>
              <div style={{ fontSize: 11.5, color: '#555963', marginTop: 2 }}>Completed</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '20px 22px',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 16 }}>
            Quick Actions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              onClick={() => navigateTo('pricing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                backgroundColor: '#EFECE4',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Tag size={16} color="#1A1C20" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Update Pricing</span>
              </div>
              <ArrowRight size={14} color="#6B707B" />
            </div>

            <div
              onClick={() => navigateTo('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                backgroundColor: '#EFECE4',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={16} color="#1A1C20" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Update Shop Timings</span>
              </div>
              <ArrowRight size={14} color="#6B707B" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders & Add More Print Services */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Recent Orders Table */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '20px 22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>Recent Orders</h2>
            <button
              onClick={() => navigateTo('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                color: '#1A1C20',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>View All Orders</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
              <thead>
                <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #EBE7DF' }}>
                  <th style={{ padding: '8px 10px', width: 44 }}>S.NO</th>
                  <th style={{ padding: '8px 10px' }}>ORDER ID</th>
                  <th style={{ padding: '8px 10px' }}>CUSTOMER</th>
                  <th style={{ padding: '8px 10px' }}>TYPE</th>
                  <th style={{ padding: '8px 10px' }}>AMOUNT</th>
                  <th style={{ padding: '8px 10px' }}>STATUS</th>
                  <th style={{ padding: '8px 10px' }}>TIME</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '28px 10px', textAlign: 'center', color: '#6B707B', fontSize: 13 }}>
                      No active orders found for this shop. When customers place orders, they will appear here.
                    </td>
                  </tr>
                ) : (
                  displayOrders.map((row, idx) => (
                    <tr
                      key={row.id}
                      onClick={() => {
                        setSelectedOrderId(row.id.replace('#', ''));
                        navigateTo('orders');
                      }}
                      style={{ borderBottom: '1px solid #F0ECE4', cursor: 'pointer' }}
                      title="Click to view order details"
                    >
                      <td style={{ padding: '12px 10px', color: '#8E929B', fontWeight: 600, fontSize: 12 }}>{idx + 1}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: '#1A1C20' }}>{row.id}</td>
                      <td style={{ padding: '12px 10px', color: '#1A1C20', fontWeight: 500 }}>{row.customer}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.type}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>₹ {row.amount}</td>
                      <td style={{ padding: '12px 10px' }}>{renderStatusBadge(row.status)}</td>
                      <td style={{ padding: '12px 10px', color: '#8E929B', fontSize: 11.5 }}>{row.time}</td>
                      <td style={{ padding: '12px 6px', textAlign: 'center', color: '#8E929B', cursor: 'pointer' }}>
                        <MoreVertical size={15} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add More Print Services (Dark card matching PDF) */}
        <div
          style={{
            backgroundColor: '#18191F',
            backgroundImage: 'linear-gradient(145deg, #16171D, #222530)',
            borderRadius: 18,
            padding: '26px 22px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Isometric paper stack graphic on right */}
          <div
            style={{
              position: 'absolute',
              right: -15,
              bottom: 10,
              width: 130,
              height: 130,
              pointerEvents: 'none',
              opacity: 0.85,
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,15 90,35 50,55 10,35" fill="#FFFFFF" opacity="0.9" />
              <polygon points="90,35 90,42 50,62 50,55" fill="#D1D5DB" />
              <polygon points="10,35 10,42 50,62 50,55" fill="#E5E7EB" />

              <polygon points="50,27 90,47 50,67 10,47" fill="#FFFFFF" opacity="0.8" />
              <polygon points="90,47 90,54 50,74 50,67" fill="#D1D5DB" />
              <polygon points="10,47 10,54 50,74 50,67" fill="#E5E7EB" />

              <polygon points="50,39 90,59 50,79 10,59" fill="#FFFFFF" opacity="0.7" />
              <polygon points="90,59 90,66 50,86 50,79" fill="#D1D5DB" />
              <polygon points="10,59 10,66 50,86 50,79" fill="#E5E7EB" />
            </svg>
          </div>

          <div>
            <h3
              style={{
                fontFamily: theme.fonts.serif,
                fontSize: 28,
                fontWeight: 400,
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: 10,
              }}
            >
              Add More<br />
              Print Services
            </h3>
            <p style={{ fontSize: 12.5, color: '#9CA3AF', lineHeight: 1.5, maxWidth: 170, marginBottom: 20 }}>
              Enable posters, flex, T-shirts and more to get more orders.
            </p>
          </div>

          <div>
            <button
              onClick={() => navigateTo('pricing')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                borderRadius: 22,
                backgroundColor: '#FFFFFF',
                color: '#111215',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>Manage Services</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
