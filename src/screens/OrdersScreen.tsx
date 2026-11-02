import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageCircle,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  Printer,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { theme } from '../theme';
import { MerchantOrder } from '../services/api';

export const OrdersScreen: React.FC = () => {
  const { orders, selectedOrder, setSelectedOrderId, updateOrderStatus, showToast } = useMerchant();
  const [filterTab, setFilterTab] = useState<'all' | 'received' | 'printing' | 'ready' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = orders.filter(order => {
    // Tab filter
    const status = (order.status || '').toLowerCase();
    if (filterTab === 'received' && status !== 'received' && status !== 'pending') return false;
    if (filterTab === 'printing' && status !== 'printing' && status !== 'in_progress') return false;
    if (filterTab === 'ready' && status !== 'ready' && status !== 'ready_for_pickup') return false;
    if (filterTab === 'completed' && status !== 'completed') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.orderId.toLowerCase().includes(q);
      const matchCustomer = (order.customerName || '').toLowerCase().includes(q);
      const matchSpecs = (order.specs || '').toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchSpecs) return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
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

  const getNextAction = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'received' || s === 'pending') {
      return { nextStatus: 'printing', label: 'Mark as Printing →', color: '#2563EB' };
    }
    if (s === 'printing' || s === 'in_progress') {
      return { nextStatus: 'ready', label: 'Mark as Ready for Pickup →', color: '#F59E0B' };
    }
    if (s === 'ready' || s === 'ready_for_pickup') {
      return { nextStatus: 'completed', label: 'Mark as Completed ✓', color: '#10B981' };
    }
    return null;
  };

  const handleAdvanceStatus = async (order: MerchantOrder) => {
    const action = getNextAction(order.status);
    if (!action) return;
    setIsUpdating(true);
    await updateOrderStatus(order.orderId, action.nextStatus);
    setIsUpdating(false);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
      {/* Left List Section */}
      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        {/* Page Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#F4F2EC', marginBottom: 4 }}>
              Orders Management
            </h1>
            <p style={{ fontSize: 13, color: theme.colors.textMuted }}>
              View incoming customer requests, review files, and update production stages.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'received', label: `Received (${orders.filter(o => o.status === 'received' || o.status === 'pending').length})` },
            { id: 'printing', label: `Printing (${orders.filter(o => o.status === 'printing' || o.status === 'in_progress').length})` },
            { id: 'ready', label: `Ready (${orders.filter(o => o.status === 'ready' || o.status === 'ready_for_pickup').length})` },
            { id: 'completed', label: `Completed (${orders.filter(o => o.status === 'completed').length})` },
          ].map(tab => {
            const isSelected = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 20,
                  backgroundColor: isSelected ? '#2563EB' : '#161820',
                  color: isSelected ? '#FFFFFF' : theme.colors.textMuted,
                  border: `1px solid ${isSelected ? '#2563EB' : theme.colors.border}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#161820',
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: 8,
              padding: '0 14px',
            }}
          >
            <Search size={16} color={theme.colors.textDim} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (#5577), Customer Name or Specs..."
              style={{
                flex: 1,
                padding: '10px 0',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 14px',
              backgroundColor: '#161820',
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: 8,
              color: theme.colors.textMuted,
              fontSize: 13,
            }}
          >
            <Filter size={14} />
            <span>Today</span>
          </div>
        </div>

        {/* Orders Table */}
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#13151D', borderBottom: `1px solid ${theme.colors.borderLight}`, color: theme.colors.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 16px' }}>Order ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Print Details</th>
                <th style={{ padding: '12px 16px' }}>Total Price</th>
                <th style={{ padding: '12px 16px' }}>Payment</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: theme.colors.textDim }}>
                    No orders found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const isSelected = selectedOrder?.orderId === order.orderId;
                  const badge = getStatusBadge(order.status);
                  return (
                    <tr
                      key={order.orderId}
                      onClick={() => setSelectedOrderId(order.orderId)}
                      style={{
                        backgroundColor: isSelected ? '#1E2332' : 'transparent',
                        borderBottom: `1px solid ${theme.colors.border}`,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#181A24';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#FFFFFF' }}>#{order.orderId}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: theme.colors.textLight }}>{order.customerName || 'Customer'}</div>
                        <div style={{ fontSize: 11, color: theme.colors.textDim }}>{order.customerPhone || '+91 98401 23456'}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: theme.colors.textMuted, maxWidth: 280 }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.specs || order.serviceType || 'Standard Print'}
                        </div>
                        <div style={{ fontSize: 11, color: theme.colors.textDim }}>
                          {order.files?.length || 1} file(s) attached
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#FFFFFF' }}>
                        ₹ {order.totalPrice || order.orderDetails?.totalPrice || 0}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: order.paymentStatus === 'SUCCESS' ? '#10B981' : '#F59E0B' }}>
                          {order.paymentStatus === 'SUCCESS' ? 'Paid' : 'Pending'}
                        </div>
                        <div style={{ fontSize: 11, color: theme.colors.textDim }}>{order.paymentMethod || 'UPI'}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Order Detail Drawer matching Page 8 */}
      {selectedOrder && (
        <div
          style={{
            width: 440,
            backgroundColor: '#15171F',
            borderLeft: `1px solid ${theme.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: '18px 22px',
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#12141B',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Order #{selectedOrder.orderId}</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    ...getStatusBadge(selectedOrder.status),
                  }}
                >
                  {getStatusBadge(selectedOrder.status).label}
                </span>
              </div>
              <div style={{ fontSize: 12, color: theme.colors.textDim, marginTop: 2 }}>
                Received {selectedOrder.timeAgo || '12 mins ago'}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderId(null)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: '#1E222D',
                border: 'none',
                color: theme.colors.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '20px 22px', flex: 1 }}>
            {/* Customer Details Box */}
            <div
              style={{
                backgroundColor: '#101217',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 18,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                    {selectedOrder.customerName || 'Arun Kumar'}
                  </div>
                  <div style={{ fontSize: 13, color: theme.colors.textMuted }}>
                    {selectedOrder.customerPhone || '+91 98401 23456'}
                  </div>
                  <div style={{ fontSize: 11, color: '#60A5FA', marginTop: 2 }}>
                    {selectedOrder.customerType || 'Regular customer (14 orders)'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={`tel:${selectedOrder.customerPhone || '+919840123456'}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: '#1E2330',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={14} color="#60A5FA" />
                  <span>Call Customer</span>
                </a>

                <a
                  href={`https://wa.me/${(selectedOrder.customerPhone || '9840123456').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34D399',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={14} color="#10B981" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Print Specifications */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.textDim, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>
                Print Specifications
              </div>

              <div
                style={{
                  backgroundColor: '#101217',
                  border: `1px solid ${theme.colors.borderLight}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: theme.colors.textMuted }}>Service</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{selectedOrder.serviceType || 'Standard Prints'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: theme.colors.textMuted }}>Paper Size & Type</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>
                    {selectedOrder.paperSize || 'A4'} ({selectedOrder.paperType || '75 GSM Bond'})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: theme.colors.textMuted }}>Color Mode</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{selectedOrder.colorMode || 'Colour'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: theme.colors.textMuted }}>Sides</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{selectedOrder.sides || 'Double sided'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: theme.colors.textMuted }}>Copies</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{selectedOrder.copies || 2} copies</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: theme.colors.textMuted }}>Binding</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{selectedOrder.binding || 'Corner staple'}</span>
                </div>
              </div>
            </div>

            {/* Attached Files to Print */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.textDim, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>
                Files to Print ({selectedOrder.files?.length || 1})
              </div>

              {(selectedOrder.files && selectedOrder.files.length > 0
                ? selectedOrder.files
                : [{ fileName: 'Project_Report_Final_v2.pdf', fileSize: '14.2 MB', pages: 60 }]
              ).map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#101217',
                    border: `1px solid ${theme.colors.borderLight}`,
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={18} color="#EF4444" />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 190 }}>
                        {file.fileName}
                      </div>
                      <div style={{ fontSize: 11, color: theme.colors.textDim }}>
                        {file.fileSize || '14.2 MB'} • {file.pages || 60} pages
                      </div>
                    </div>
                  </div>

                  <a
                    href={file.fileUrl || '#'}
                    download={file.fileName}
                    onClick={e => {
                      if (!file.fileUrl || file.fileUrl.startsWith('#')) {
                        e.preventDefault();
                        showToast(`Simulated download: ${file.fileName}`);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 10px',
                      borderRadius: 6,
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Special Instructions */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.textDim, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>
                Special Instructions
              </div>
              <div
                style={{
                  backgroundColor: '#181A22',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: 12,
                  color: '#FDE68A',
                  lineHeight: 1.4,
                }}
              >
                "{selectedOrder.instructions || 'Please make sure color on cover page is bright. Staple on top-left.'}"
              </div>
            </div>

            {/* Payment Summary */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.textDim, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>
                Payment Breakdown
              </div>
              <div
                style={{
                  backgroundColor: '#101217',
                  border: `1px solid ${theme.colors.borderLight}`,
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                  <span>Total Amount</span>
                  <span>₹ {selectedOrder.totalPrice || selectedOrder.orderDetails?.totalPrice || 0}</span>
                </div>
                <div style={{ fontSize: 11, color: theme.colors.textDim }}>
                  Paid via {selectedOrder.paymentMethod || 'UPI'} • Ref: {selectedOrder.paymentRef || 'UPI/9381/002'}
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Bottom Actions */}
          <div
            style={{
              padding: '16px 22px',
              borderTop: `1px solid ${theme.colors.border}`,
              backgroundColor: '#12141B',
              display: 'flex',
              gap: 10,
            }}
          >
            {getNextAction(selectedOrder.status) ? (
              <button
                onClick={() => handleAdvanceStatus(selectedOrder)}
                disabled={isUpdating}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  backgroundColor: getNextAction(selectedOrder.status)?.color || '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isUpdating ? 'default' : 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                }}
              >
                <span>{isUpdating ? 'Updating...' : getNextAction(selectedOrder.status)?.label}</span>
              </button>
            ) : (
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  borderRadius: 8,
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                ✓ Order Completed & Archived
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
