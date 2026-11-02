import React from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  ShoppingBag,
  IndianRupee,
  Printer,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
  BarChart2,
  AlertCircle,
} from 'lucide-react';
import { theme } from '../theme';

export const DashboardScreen: React.FC = () => {
  const { analytics, orders, navigateTo, setSelectedOrderId, shopData } = useMerchant();

  const todayStats = analytics?.today || {
    ordersCount: 24,
    ordersChangePct: 12,
    revenue: 7560,
    revenueChangePct: 18,
    inPrinting: 8,
    overduePrinting: 4,
    readyForPickup: 6,
    pendingPickupAlerts: 2,
  };

  const pipeline = analytics?.pipeline || {
    received: 24,
    printing: 8,
    ready: 6,
    completed: 10,
  };

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'received' || s === 'pending') {
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)', label: 'Received' };
    }
    if (s === 'printing' || s === 'in_progress') {
      return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.3)', label: 'Printing' };
    }
    if (s === 'ready' || s === 'ready_for_pickup') {
      return { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)', label: 'Ready for Pickup' };
    }
    return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)', label: 'Completed' };
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 34, fontWeight: 400, color: '#F4F2EC', marginBottom: 4 }}>
            Good Afternoon, {shopData.ownerName || 'Sabarish'} 👋
          </h1>
          <p style={{ fontSize: 14, color: theme.colors.textMuted }}>
            Here is your live production overview for <b>{shopData.shopName || 'Sabarish Prints'}</b> today.
          </p>
        </div>

        <button
          onClick={() => navigateTo('queue')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
          }}
        >
          <Printer size={16} />
          <span>Open Live Queue</span>
        </button>
      </div>

      {/* 4 Stat Cards matching PDF */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
        {/* Card 1: Today's Orders */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '20px 22px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim }}>Today's Orders</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={17} color={theme.colors.primaryLight} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>{todayStats.ordersCount}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={12} style={{ marginRight: 2 }} /> +{todayStats.ordersChangePct}%
            </span>
          </div>
          <div style={{ fontSize: 12, color: theme.colors.textDim }}>vs 21 yesterday</div>
        </div>

        {/* Card 2: Today's Revenue */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '20px 22px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim }}>Today's Revenue</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={17} color="#10B981" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>₹ {todayStats.revenue.toLocaleString()}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={12} style={{ marginRight: 2 }} /> +{todayStats.revenueChangePct}%
            </span>
          </div>
          <div style={{ fontSize: 12, color: theme.colors.textDim }}>Auto-settles tomorrow at 10 AM</div>
        </div>

        {/* Card 3: In Printing */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '20px 22px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim }}>In Printing</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Printer size={17} color="#60A5FA" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>{todayStats.inPrinting}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#F59E0B' }}>
              {todayStats.overduePrinting} in queue
            </span>
          </div>
          <div style={{ fontSize: 12, color: theme.colors.textDim }}>Est. time left: 18 mins</div>
        </div>

        {/* Card 4: Ready for Pickup */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '20px 22px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textDim }}>Ready for Pickup</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={17} color="#F59E0B" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>{todayStats.readyForPickup}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>
              {todayStats.pendingPickupAlerts} SMS sent
            </span>
          </div>
          <div style={{ fontSize: 12, color: theme.colors.textDim }}>Awaiting customer collection</div>
        </div>
      </div>

      {/* Pipeline Status Flow Bar */}
      <div
        style={{
          backgroundColor: '#161820',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 14,
          padding: '18px 24px',
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.textLight, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Today's Order Pipeline Flow
          </span>
          <span style={{ fontSize: 12, color: theme.colors.primaryLight, cursor: 'pointer', fontWeight: 600 }} onClick={() => navigateTo('queue')}>
            View Kanban Board →
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Step 1 */}
          <div
            onClick={() => navigateTo('orders')}
            style={{
              flex: 1,
              padding: '12px 14px',
              backgroundColor: '#1C1F2B',
              borderRadius: 8,
              border: '1px solid rgba(239, 68, 68, 0.25)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 11, color: '#F87171', fontWeight: 700, textTransform: 'uppercase' }}>1. Received</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>{pipeline.received}</div>
          </div>

          <ChevronRight size={18} color={theme.colors.textDim} />

          {/* Step 2 */}
          <div
            onClick={() => navigateTo('queue')}
            style={{
              flex: 1,
              padding: '12px 14px',
              backgroundColor: '#1C1F2B',
              borderRadius: 8,
              border: '1px solid rgba(59, 130, 246, 0.25)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 11, color: '#60A5FA', fontWeight: 700, textTransform: 'uppercase' }}>2. Printing</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>{pipeline.printing}</div>
          </div>

          <ChevronRight size={18} color={theme.colors.textDim} />

          {/* Step 3 */}
          <div
            onClick={() => navigateTo('queue')}
            style={{
              flex: 1,
              padding: '12px 14px',
              backgroundColor: '#1C1F2B',
              borderRadius: 8,
              border: '1px solid rgba(245, 158, 11, 0.25)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 11, color: '#FBBF24', fontWeight: 700, textTransform: 'uppercase' }}>3. Ready for Pickup</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>{pipeline.ready}</div>
          </div>

          <ChevronRight size={18} color={theme.colors.textDim} />

          {/* Step 4 */}
          <div
            onClick={() => navigateTo('orders')}
            style={{
              flex: 1,
              padding: '12px 14px',
              backgroundColor: '#1C1F2B',
              borderRadius: 8,
              border: '1px solid rgba(16, 185, 129, 0.25)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 11, color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>4. Completed</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>{pipeline.completed}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div
          onClick={() => navigateTo('queue')}
          style={{
            padding: '16px 20px',
            borderRadius: 12,
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1B1E29')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#161820')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Printer size={18} color={theme.colors.primaryLight} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Manage Print Queue</div>
              <div style={{ fontSize: 12, color: theme.colors.textDim }}>Drag & reorder live jobs</div>
            </div>
          </div>
          <ChevronRight size={18} color={theme.colors.textDim} />
        </div>

        <div
          onClick={() => navigateTo('pricing')}
          style={{
            padding: '16px 20px',
            borderRadius: 12,
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1B1E29')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#161820')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Update Service Rates</div>
              <div style={{ fontSize: 12, color: theme.colors.textDim }}>GSM, size & color pricing</div>
            </div>
          </div>
          <ChevronRight size={18} color={theme.colors.textDim} />
        </div>

        <div
          onClick={() => navigateTo('reports')}
          style={{
            padding: '16px 20px',
            borderRadius: 12,
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1B1E29')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#161820')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={18} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Analytics & Reports</div>
              <div style={{ fontSize: 12, color: theme.colors.textDim }}>Trends, items & payouts</div>
            </div>
          </div>
          <ChevronRight size={18} color={theme.colors.textDim} />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div
        style={{
          backgroundColor: '#161820',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 14,
          padding: '22px 24px',
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: theme.colors.textLight }}>Recent Active Orders</h2>
          <button
            onClick={() => navigateTo('orders')}
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
            <span>View All ({orders.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.colors.borderLight}`, color: theme.colors.textDim, fontSize: 12, textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Order ID</th>
                <th style={{ padding: '10px 14px' }}>Customer</th>
                <th style={{ padding: '10px 14px' }}>Service Specs</th>
                <th style={{ padding: '10px 14px' }}>Amount</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => {
                const badge = getStatusBadge(order.status);
                return (
                  <tr
                    key={order.orderId}
                    style={{
                      borderBottom: `1px solid ${theme.colors.border}`,
                      fontSize: 13,
                    }}
                  >
                    <td style={{ padding: '14px', fontWeight: 700, color: '#FFFFFF' }}>#{order.orderId}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: theme.colors.textLight }}>{order.customerName || 'Customer'}</div>
                      <div style={{ fontSize: 11, color: theme.colors.textDim }}>{order.timeAgo || 'Recently'}</div>
                    </td>
                    <td style={{ padding: '14px', color: theme.colors.textMuted, maxWidth: 300 }}>
                      {order.specs || order.serviceType || 'Standard Print'}
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                      ₹ {order.totalPrice || order.orderDetails?.totalPrice || 0}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 20,
                          backgroundColor: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.orderId);
                          navigateTo('orders');
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          backgroundColor: '#1E2330',
                          border: `1px solid ${theme.colors.borderLight}`,
                          color: theme.colors.primaryLight,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add More Print Services Promo Banner matching PDF */}
      <div
        style={{
          borderRadius: 14,
          padding: '24px 28px',
          backgroundImage: 'linear-gradient(135deg, #1E3A8A 0%, #172554 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Sparkles size={18} color="#93C5FD" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Grow Your Shop
            </span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
            Expand into Posters, Flex & Customized T-Shirts
          </h3>
          <p style={{ fontSize: 13, color: '#BFDBFE', maxWidth: 540 }}>
            Shops offering 3+ categories generate 4.2x higher weekly revenue from business and student orders.
          </p>
        </div>

        <button
          onClick={() => navigateTo('pricing')}
          style={{
            padding: '11px 22px',
            backgroundColor: '#FFFFFF',
            color: '#1E3A8A',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          Add More Print Services
        </button>
      </div>
    </div>
  );
};
