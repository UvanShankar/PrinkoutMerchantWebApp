import React from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Printer,
  Clock,
  CheckCircle,
  FileText,
  Bell,
  ArrowRight,
  MoreVertical,
  Play,
  Check,
  Send,
} from 'lucide-react';
import { theme } from '../theme';

export const PrintQueueScreen: React.FC = () => {
  const { orders, updateOrderStatus, setSelectedOrderId, navigateTo, showToast } = useMerchant();

  const receivedOrders = orders.filter(o => o.status === 'received' || o.status === 'pending');
  const printingOrders = orders.filter(o => o.status === 'printing' || o.status === 'in_progress');
  const readyOrders = orders.filter(o => o.status === 'ready' || o.status === 'ready_for_pickup');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const handleNotifyCustomer = (orderId: string, customerName: string) => {
    showToast(`SMS & WhatsApp pickup alert sent to ${customerName} for #${orderId}`);
  };

  return (
    <div style={{ padding: '24px 28px', height: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#F4F2EC', marginBottom: 4 }}>
            Live Print Queue (Kanban)
          </h1>
          <p style={{ fontSize: 13, color: theme.colors.textMuted }}>
            Real-time shop production flow. Move orders across stages as printing progresses.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>● Live Auto-Sync Active</span>
        </div>
      </div>

      {/* 4 Kanban Columns */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, overflowY: 'auto' }}>
        {/* Column 1: Received */}
        <div
          style={{
            backgroundColor: '#14161E',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#171A24',
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>Received</span>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', fontSize: 12, fontWeight: 700 }}>
              {receivedOrders.length}
            </span>
          </div>

          <div style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {receivedOrders.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: theme.colors.textDim, fontSize: 13 }}>
                No received orders waiting.
              </div>
            ) : (
              receivedOrders.map(order => (
                <div
                  key={order.orderId}
                  style={{
                    backgroundColor: '#181B26',
                    border: `1px solid ${theme.colors.borderLight}`,
                    borderRadius: 10,
                    padding: 14,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>#{order.orderId}</div>
                      <div style={{ fontSize: 12, color: theme.colors.textMuted }}>{order.customerName || 'Customer'}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#34D399' }}>
                      ₹ {order.totalPrice || order.orderDetails?.totalPrice || 0}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: theme.colors.textDim, marginBottom: 12 }}>
                    {order.specs || order.serviceType || 'Standard Prints'}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        setSelectedOrderId(order.orderId);
                        navigateTo('orders');
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: 6,
                        backgroundColor: '#202432',
                        border: 'none',
                        color: theme.colors.textMuted,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'printing')}
                      style={{
                        flex: 1.4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        padding: '6px 10px',
                        borderRadius: 6,
                        backgroundColor: '#2563EB',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={11} fill="#FFFFFF" />
                      <span>Start Print</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Printing */}
        <div
          style={{
            backgroundColor: '#14161E',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#171A24',
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>Printing</span>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', fontSize: 12, fontWeight: 700 }}>
              {printingOrders.length}
            </span>
          </div>

          <div style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {printingOrders.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: theme.colors.textDim, fontSize: 13 }}>
                Printers currently idle.
              </div>
            ) : (
              printingOrders.map(order => (
                <div
                  key={order.orderId}
                  style={{
                    backgroundColor: '#181B26',
                    border: '1px solid rgba(59, 130, 246, 0.35)',
                    borderRadius: 10,
                    padding: 14,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>#{order.orderId}</div>
                      <div style={{ fontSize: 12, color: theme.colors.textMuted }}>{order.customerName || 'Customer'}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#34D399' }}>
                      ₹ {order.totalPrice || order.orderDetails?.totalPrice || 0}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: theme.colors.textDim, marginBottom: 10 }}>
                    {order.specs || order.serviceType || 'Standard Prints'}
                  </div>

                  {/* Live Progress Bar matching Page 9 */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#93C5FD', marginBottom: 4 }}>
                      <span>Page 42 of 60</span>
                      <span>70%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, backgroundColor: '#1E2333', overflow: 'hidden' }}>
                      <div style={{ width: '70%', height: '100%', backgroundColor: '#3B82F6', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: theme.colors.textDim, marginTop: 4 }}>Est: 3 mins remaining</div>
                  </div>

                  <button
                    onClick={() => updateOrderStatus(order.orderId, 'ready')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '8px 12px',
                      borderRadius: 6,
                      backgroundColor: '#F59E0B',
                      border: 'none',
                      color: '#000000',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Mark Ready for Pickup</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Pickup */}
        <div
          style={{
            backgroundColor: '#14161E',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#171A24',
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>Ready for Pickup</span>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', fontSize: 12, fontWeight: 700 }}>
              {readyOrders.length}
            </span>
          </div>

          <div style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {readyOrders.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: theme.colors.textDim, fontSize: 13 }}>
                No completed prints pending collection.
              </div>
            ) : (
              readyOrders.map(order => (
                <div
                  key={order.orderId}
                  style={{
                    backgroundColor: '#181B26',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: 10,
                    padding: 14,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>#{order.orderId}</div>
                      <div style={{ fontSize: 12, color: theme.colors.textMuted }}>{order.customerName || 'Customer'}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#34D399' }}>
                      ₹ {order.totalPrice || order.orderDetails?.totalPrice || 0}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: theme.colors.textDim, marginBottom: 12 }}>
                    Ready at counter • Box #4
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button
                      onClick={() => handleNotifyCustomer(order.orderId, order.customerName || 'Customer')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '7px 10px',
                        borderRadius: 6,
                        backgroundColor: '#1E2332',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#34D399',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Send size={12} />
                      <span>Send Pickup SMS / WhatsApp</span>
                    </button>

                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'completed')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '7px 10px',
                        borderRadius: 6,
                        backgroundColor: '#10B981',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Check size={13} />
                      <span>Handed Over (Completed)</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Completed */}
        <div
          style={{
            backgroundColor: '#14161E',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#171A24',
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>Completed</span>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: 12, fontWeight: 700 }}>
              {completedOrders.length}
            </span>
          </div>

          <div style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {completedOrders.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: theme.colors.textDim, fontSize: 13 }}>
                No completed orders today yet.
              </div>
            ) : (
              completedOrders.map(order => (
                <div
                  key={order.orderId}
                  style={{
                    backgroundColor: '#151722',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: 10,
                    padding: 12,
                    opacity: 0.85,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>#{order.orderId}</span>
                    <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>✓ Picked Up</span>
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.textDim }}>{order.customerName || 'Customer'}</div>
                  <div style={{ fontSize: 11, color: theme.colors.textDim, marginTop: 4 }}>
                    ₹ {order.totalPrice || order.orderDetails?.totalPrice || 0} • {order.paymentMethod || 'UPI'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
