import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Search,
  Calendar,
  Filter,
  MoreVertical,
  X,
  Phone,
  MessageCircle,
  FileText,
  Download,
  Printer,
  ShoppingBag,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { theme } from '../theme';

export const OrdersScreen: React.FC = () => {
  const { orders, selectedOrder, setSelectedOrderId, updateOrderStatus } = useMerchant();
  const [filterTab, setFilterTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic real orders mapped from MerchantContext / DynamoDB
  const allOrdersList = (orders || []).map(o => {
    const defaultTime = o.createdAt
      ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Recent';
    const defaultDate = o.createdAt
      ? new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Today';

    return {
      orderId: o.orderId,
      customerName: o.customerName || (o.userId ? `Customer (${o.userId.slice(-6)})` : 'Customer'),
      customerPhone: o.customerPhone || '+91 98432 11234',
      specs: o.specs || `${o.paperSize || 'A4'} ${o.colorMode || 'Colour'} • ${o.orderDetails?.quantity || 1} copies`,
      totalPrice: o.totalPrice || o.orderDetails?.totalPrice || 0,
      status: o.status || 'received',
      timeAgo: o.timeAgo || defaultTime,
      placedDate: `${defaultDate} at ${defaultTime}`,
      city: o.deliveryDetails?.deliveryAddress || o.pickupDetails?.pickupLocation || 'Pickup Counter',
      serviceType: o.serviceType || 'Standard Print',
      paperSize: o.paperSize || 'A4',
      colorMode: o.colorMode || 'Colour',
      pages: o.files?.[0]?.pages || 1,
      copies: o.orderDetails?.quantity || o.copies || 1,
      fileName: o.files?.[0]?.fileName || 'Project_Document.pdf',
      fileSize: o.files?.[0]?.fileSize || 'PDF',
      fileUrl: o.files?.[0]?.fileUrl,
      files: (o.files && o.files.length > 0)
        ? o.files
        : [{ fileName: o.files?.[0]?.fileName || 'Project_Document.pdf', fileSize: o.files?.[0]?.fileSize || 'PDF', fileUrl: o.files?.[0]?.fileUrl }],
      paymentStatus: o.paymentStatus || 'Paid Online',
    };
  });

  const filteredOrders = allOrdersList.filter(o => {
    if (filterTab !== 'all' && (o.status || '').toLowerCase() !== filterTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        String(o.orderId || '').toLowerCase().includes(q) ||
        String(o.customerName || '').toLowerCase().includes(q) ||
        String(o.specs || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const currentActiveOrder =
    (activeOrderId ? allOrdersList.find(o => o.orderId === activeOrderId) : filteredOrders[0]) || null;

  const activeOrder = currentActiveOrder;

  // Counts for pills
  const countAll = allOrdersList.length;
  const countReceived = allOrdersList.filter(o => o.status === 'received' || o.status === 'pending').length;
  const countPrinting = allOrdersList.filter(o => o.status === 'printing').length;
  const countReady = allOrdersList.filter(o => o.status === 'ready').length;
  const countCompleted = allOrdersList.filter(o => o.status === 'completed').length;

  const renderStatusBadge = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'received':
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
            <span>Ready</span>
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

  const handleNextStatus = (id: string, currentStatus: string) => {
    let next = 'printing';
    const s = (currentStatus || '').toLowerCase();
    if (s === 'received' || s === 'pending') next = 'printing';
    else if (s === 'printing') next = 'ready';
    else if (s === 'ready') next = 'completed';
    else return;
    updateOrderStatus(id, next);
  };

  const handleDownloadFile = (fileUrl?: string, fileName?: string) => {
    if (!fileUrl) {
      alert('File download URL is not available for this document.');
      return;
    }
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = fileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: 16, alignItems: 'start' }}>
      {/* Left Column: Top Filter Pills Card + Table Card below */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Top Filter Pills Card matching PDF */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 16,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setFilterTab('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              backgroundColor: filterTab === 'all' ? '#1C1D21' : '#EFECE4',
              color: filterTab === 'all' ? '#FFFFFF' : '#1A1C20',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>All Orders</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: filterTab === 'all' ? '#FFFFFF' : '#DDD9CE',
                color: filterTab === 'all' ? '#111215' : '#1A1C20',
                padding: '1px 7px',
                borderRadius: 10,
              }}
            >
              {countAll}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('received')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              backgroundColor: '#EEF2FF',
              color: '#4338CA',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>Received</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: '#E0E7FF',
                color: '#3730A3',
                padding: '1px 7px',
                borderRadius: 10,
              }}
            >
              {countReceived}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('printing')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              backgroundColor: '#FFEDD5',
              color: '#C2410C',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>Printing</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: '#FED7AA',
                color: '#9A3412',
                padding: '1px 7px',
                borderRadius: 10,
              }}
            >
              {countPrinting}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('ready')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>Ready</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: '#BBF7D0',
                color: '#166534',
                padding: '1px 7px',
                borderRadius: 10,
              }}
            >
              {countReady}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('completed')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              backgroundColor: '#F3F4F6',
              color: '#4B5563',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>Completed</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: '#E5E7EB',
                color: '#374151',
                padding: '1px 7px',
                borderRadius: 10,
              }}
            >
              {countCompleted}
            </span>
          </button>
        </div>

        {/* Orders Table Card matching PDF */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '20px 22px',
          }}
        >

        {/* Search, Date range, and Filter Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#EFECE4',
              border: '1px solid #DAD5CB',
              borderRadius: 12,
              padding: '9px 12px',
            }}
          >
            <Search size={15} color="#8E929B" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer or Type"
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                fontWeight: 500,
                color: '#1A1C20',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#EFECE4',
              border: '1px solid #DAD5CB',
              borderRadius: 12,
              padding: '9px 12px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#1A1C20',
              cursor: 'pointer',
            }}
          >
            <Calendar size={14} color="#6B707B" />
            <span>Jul 1, 2026 – Jul 31, 2026</span>
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#EFECE4',
              border: '1px solid #DAD5CB',
              borderRadius: 12,
              padding: '9px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#1A1C20',
              cursor: 'pointer',
            }}
          >
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>

        {/* Orders Table matching PDF */}
        <div style={{ width: '100%', overflowX: 'auto', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
            <thead>
              <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #EBE7DF' }}>
                <th style={{ padding: '8px 10px' }}>ORDER ID</th>
                <th style={{ padding: '8px 10px' }}>CUSTOMER</th>
                <th style={{ padding: '8px 10px' }}>ORDER DETAILS</th>
                <th style={{ padding: '8px 10px' }}>AMOUNT</th>
                <th style={{ padding: '8px 10px' }}>STATUS</th>
                <th style={{ padding: '8px 10px' }}>TIME</th>
                <th style={{ padding: '8px 6px', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px 12px', textAlign: 'center', color: '#8E929B', fontSize: 12.5 }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <ShoppingBag size={28} color="#8E929B" style={{ opacity: 0.5 }} />
                      <div style={{ fontWeight: 600, color: '#1A1C20' }}>No orders found</div>
                      <div style={{ fontSize: 11.5, color: '#6B707B' }}>
                        {filterTab !== 'all' ? `No orders in "${filterTab}" status.` : 'When customers place orders, they will appear here.'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(row => {
                  const isSelected = row.orderId === (activeOrder?.orderId || '');
                  return (
                    <tr
                      key={row.orderId}
                      onClick={() => setActiveOrderId(row.orderId)}
                      style={{
                        borderBottom: '1px solid #F0ECE4',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#FAF8F5' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>
                        #{row.orderId}
                      </td>
                      <td style={{ padding: '12px 10px', color: '#1A1C20', fontWeight: 600 }}>{row.customerName}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.specs}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A1C20' }}>₹ {row.totalPrice}</td>
                      <td style={{ padding: '12px 10px' }}>{renderStatusBadge(row.status)}</td>
                      <td style={{ padding: '12px 10px', color: '#8E929B', fontSize: 11.5 }}>{row.timeAgo}</td>
                      <td style={{ padding: '12px 6px', textAlign: 'center', color: '#8E929B' }}>
                        <MoreVertical size={15} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching PDF */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
          <span style={{ fontSize: 12, color: '#8E929B' }}>
            Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #DAD5CB',
                backgroundColor: '#EFECE4',
                color: '#1A1C20',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              ←
            </button>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: 'none',
                backgroundColor: '#1C1D21',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              1
            </button>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #DAD5CB',
                backgroundColor: 'transparent',
                color: '#1A1C20',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              2
            </button>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #DAD5CB',
                backgroundColor: 'transparent',
                color: '#1A1C20',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              3
            </button>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #DAD5CB',
                backgroundColor: '#EFECE4',
                color: '#1A1C20',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Right Order Details Panel matching PDF */}
      <div
        style={{
          backgroundColor: theme.colors.creamCard,
          border: `1px solid ${theme.colors.creamCardBorder}`,
          borderRadius: 18,
          padding: '22px 20px',
        }}
      >
        {activeOrder ? (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#1A1C20' }}>
                  Order #{activeOrder.orderId}
                </span>
                {renderStatusBadge(activeOrder.status)}
              </div>
              <X size={16} color="#8E929B" style={{ cursor: 'pointer' }} onClick={() => setActiveOrderId(null)} />
            </div>

            <p style={{ fontSize: 12, color: '#8E929B', marginBottom: 18 }}>
              Placed on {activeOrder.placedDate}
            </p>

        {/* Customer Details */}
        <div style={{ marginBottom: 18, borderBottom: '1px solid #EBE7DF', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>
              <User size={15} />
              <span>Customer Details</span>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <a
                href={`tel:${activeOrder.customerPhone || ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 16,
                  backgroundColor: '#EFECE4',
                  border: '1px solid #DAD5CB',
                  color: '#1A1C20',
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Phone size={11} />
                <span>Call</span>
              </a>

              <a
                href={`https://wa.me/${(activeOrder.customerPhone || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 16,
                  backgroundColor: '#EFECE4',
                  border: '1px solid #DAD5CB',
                  color: '#1A1C20',
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={11} color="#25D366" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, color: '#555963' }}>
            <div style={{ fontWeight: 600, color: '#1A1C20' }}>{activeOrder.customerName}</div>
            <div>{activeOrder.customerPhone}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} />
              <span>{activeOrder.city}</span>
            </div>
          </div>
        </div>

        {/* Print Details */}
        <div style={{ marginBottom: 18, borderBottom: '1px solid #EBE7DF', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 12 }}>
            <Printer size={15} />
            <span>Print Details</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 8, fontSize: 12.5 }}>
            <span style={{ color: '#6B707B' }}>Service</span>
            <span style={{ fontWeight: 600, color: '#1A1C20' }}>{activeOrder.serviceType}</span>

            <span style={{ color: '#6B707B' }}>Size</span>
            <span style={{ fontWeight: 600, color: '#1A1C20' }}>{activeOrder.paperSize}</span>

            <span style={{ color: '#6B707B' }}>Type</span>
            <span style={{ fontWeight: 600, color: '#1A1C20' }}>{activeOrder.colorMode}</span>

            <span style={{ color: '#6B707B' }}>Pages</span>
            <span style={{ fontWeight: 600, color: '#1A1C20' }}>{activeOrder.pages}</span>

            <span style={{ color: '#6B707B' }}>Copies</span>
            <span style={{ fontWeight: 600, color: '#1A1C20' }}>{activeOrder.copies}</span>
          </div>
        </div>

        {/* Files */}
        <div style={{ marginBottom: 18, borderBottom: '1px solid #EBE7DF', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 10 }}>
            <FileText size={15} />
            <span>Files ({(activeOrder.files && activeOrder.files.length) || (activeOrder.fileName ? 1 : 0)})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(activeOrder.files && activeOrder.files.length > 0
              ? activeOrder.files
              : [{ fileName: activeOrder.fileName, fileSize: activeOrder.fileSize, fileUrl: activeOrder.fileUrl }]
            ).map((f: any, idx: number) => {
              const ext = (f.fileName || '').split('.').pop()?.toUpperCase() || 'PDF';
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 10,
                    backgroundColor: '#EFECE4',
                    border: '1px solid #DAD5CB',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        backgroundColor: ext === 'PDF' ? '#EF4444' : '#3B82F6',
                        color: '#FFFFFF',
                        fontSize: 9,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {ext.slice(0, 4)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <a
                        href={f.fileUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={f.fileName}
                        onClick={e => {
                          if (!f.fileUrl) {
                            e.preventDefault();
                            alert('No download URL available for this file.');
                          }
                        }}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#1A1C20',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                        title={f.fileName}
                      >
                        {f.fileName || 'Project_Document.pdf'}
                      </a>
                      <span style={{ fontSize: 11, color: '#8E929B' }}>
                        {f.fileSize || `${f.pages || 1} pages`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadFile(f.fileUrl, f.fileName)}
                    title={`Download ${f.fileName || 'file'}`}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Download size={15} color="#555963" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 8 }}>
            <CreditCard size={15} />
            <span>Payment</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 20,
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} />
              <span>Paid Online</span>
            </span>

            <span style={{ fontSize: 18, fontWeight: 700, color: '#1A1C20' }}>
              ₹ {activeOrder.totalPrice}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleNextStatus(activeOrder.orderId, activeOrder.status)}
          disabled={activeOrder.status === 'completed'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '13px 20px',
            backgroundColor: activeOrder.status === 'completed' ? '#9CA3AF' : '#1C1D21',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: activeOrder.status === 'completed' ? 'not-allowed' : 'pointer',
          }}
        >
          <Printer size={16} />
          <span>
            {activeOrder.status === 'received' || activeOrder.status === 'pending'
              ? 'Mark as Printing'
              : activeOrder.status === 'printing'
              ? 'Mark as Ready'
              : activeOrder.status === 'ready'
              ? 'Mark as Completed'
              : 'Order Completed'}
          </span>
          {activeOrder.status !== 'completed' && <span>→</span>}
        </button>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8E929B' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#EBE7DF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <ShoppingBag size={24} color="#6B707B" />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20', marginBottom: 6 }}>
            No Order Selected
          </div>
          <p style={{ fontSize: 12.5, color: '#6B707B', maxWidth: 240, margin: '0 auto', lineHeight: 1.5 }}>
            Select an order from the list on the left to inspect specifications, download files, or update its printing status.
          </p>
        </div>
      )}
      </div>
    </div>
  );
};
