import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Search,
  Calendar,
  Filter,
  ChevronRight,
  CheckCircle2,
  Layers,
  Printer,
  Package,
  User,
  Phone,
  MessageCircle,
  FileText,
  Download,
  X,
  Check,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { theme } from '../theme';

interface QueueItem {
  id: string;
  rawId: string;
  customer: string;
  specs: string;
  price?: string;
  progress?: number;
  thumbType: 'report' | 'blueprint' | 'poster' | 'papers' | 'banner' | 'tshirt' | 'invite' | 'label' | 'stand';
  thumbLabel?: string;
  thumbBg?: string;
  createdAt?: string;
  timeAgo?: string;
  rawOrder: any;
}

export const PrintQueueScreen: React.FC = () => {
  const { orders, updateOrderStatus, navigateTo } = useMerchant();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalOrder, setSelectedModalOrder] = useState<any | null>(null);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const dateRangeDisplay = `${startOfMonth.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} – ${endOfMonth.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const renderStatusBadge = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'received':
      case 'pending':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: 11, fontWeight: 700 }}>
            <Layers size={11} />
            <span>Received</span>
          </span>
        );
      case 'printing':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, backgroundColor: '#FFEDD5', color: '#C2410C', fontSize: 11, fontWeight: 700 }}>
            <Printer size={11} />
            <span>Printing</span>
          </span>
        );
      case 'ready':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, backgroundColor: '#DCFCE7', color: '#15803D', fontSize: 11, fontWeight: 700 }}>
            <CheckCircle2 size={11} />
            <span>Ready to Deliver</span>
          </span>
        );
      case 'completed':
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: 11, fontWeight: 700 }}>
            <CheckCircle2 size={11} />
            <span>Completed</span>
          </span>
        );
    }
  };

  const mapToQueue = (o: any): QueueItem => {
    let thumbType: QueueItem['thumbType'] = 'report';
    const text = `${o.specs || ''} ${o.serviceType || ''}`.toLowerCase();
    if (text.includes('t-shirt') || text.includes('tshirt')) thumbType = 'tshirt';
    else if (text.includes('flex') || text.includes('banner')) thumbType = 'banner';
    else if (text.includes('poster')) thumbType = 'poster';
    else if (text.includes('invite') || text.includes('card')) thumbType = 'invite';
    else if (text.includes('label')) thumbType = 'label';
    else if (text.includes('a3') || text.includes('blueprint')) thumbType = 'blueprint';
    else if (text.includes('b/w') || text.includes('plain')) thumbType = 'papers';

    return {
      id: o.orderId.startsWith('#') ? o.orderId : `#${o.orderId.slice(0, 4)}`,
      rawId: o.orderId,
      customer: o.customerName || (o.userId ? `Customer (${o.userId.slice(-6)})` : 'Customer'),
      specs: o.specs || `${o.paperSize || 'A4'} • ${o.colorMode || 'Colour'} • ${o.orderDetails?.quantity || 1} copies`,
      price: `₹ ${(o.totalPrice || o.orderDetails?.totalPrice || 0).toLocaleString()}`,
      thumbType,
      thumbLabel: (o.files?.[0]?.fileName || 'Order').slice(0, 8),
      thumbBg: thumbType === 'report' ? '#3B82F6' : thumbType === 'poster' ? '#6366F1' : thumbType === 'banner' ? '#A855F7' : '#94A3B8',
      createdAt: o.createdAt,
      timeAgo: o.timeAgo || (o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'),
      rawOrder: o,
    };
  };

  const matchesSearch = (item: QueueItem) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.customer.toLowerCase().includes(q) ||
      item.specs.toLowerCase().includes(q)
    );
  };

  // FIFO helper: sort earliest orders first so older orders are processed before newer ones
  const getOrderTimestamp = (o: any) => {
    const raw = o.createdAt || o.updatedAt;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return isNaN(t) ? 0 : t;
  };

  const sortByFifo = (a: any, b: any) => getOrderTimestamp(a) - getOrderTimestamp(b);

  const receivedItems: QueueItem[] = (orders || [])
    .filter(o => o.status?.toLowerCase() === 'received' || o.status?.toLowerCase() === 'pending')
    .sort(sortByFifo)
    .map(mapToQueue)
    .filter(matchesSearch);

  const printingItems: QueueItem[] = (orders || [])
    .filter(o => o.status?.toLowerCase() === 'printing')
    .sort(sortByFifo)
    .map(o => ({ ...mapToQueue(o), progress: 50 }))
    .filter(matchesSearch);

  const readyItems: QueueItem[] = (orders || [])
    .filter(o => o.status?.toLowerCase() === 'ready')
    .sort(sortByFifo)
    .map(mapToQueue)
    .filter(matchesSearch);

  const completedItems: QueueItem[] = (orders || [])
    .filter(o => o.status?.toLowerCase() === 'completed')
    .sort(sortByFifo)
    .map(mapToQueue)
    .filter(matchesSearch);

  const renderThumbnail = (item: QueueItem) => {
    switch (item.thumbType) {
      case 'tshirt':
        return (
          <div
            style={{
              width: 46,
              height: 48,
              borderRadius: 6,
              backgroundColor: '#1E232B',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg viewBox="0 0 40 40" width="34" height="34" fill="none">
              <path
                d="M 12 10 L 16 14 C 18 16, 22 16, 24 14 L 28 10 L 36 15 L 32 21 L 28 19 L 28 34 L 12 34 L 12 19 L 8 21 L 4 15 Z"
                fill="#2A303C"
                stroke="#475569"
                strokeWidth="1"
              />
              <text x="20" y="24" fontSize="5" fontWeight="700" fill="#E2E8F0" textAnchor="middle">Prinkout.</text>
            </svg>
          </div>
        );
      case 'banner':
        return (
          <div
            style={{
              width: 46,
              height: 48,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ transform: 'rotate(-25deg)', width: 36, height: 16, borderRadius: 8, border: '2px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.25)' }} />
          </div>
        );
      case 'stand':
        return (
          <div
            style={{
              width: 46,
              height: 48,
              borderRadius: 6,
              background: 'linear-gradient(180deg, #6366F1, #8B5CF6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#FFFFFF',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ width: 28, height: 32, border: '1px solid rgba(255,255,255,0.7)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 6, fontWeight: 700 }}>BANNER</span>
            </div>
          </div>
        );
      case 'blueprint':
        return (
          <div
            style={{
              width: 46,
              height: 48,
              borderRadius: 6,
              backgroundColor: '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
              backgroundSize: '6px 6px',
            }}
          >
            <div style={{ width: 30, height: 32, border: '1px solid #64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 7, fontWeight: 700, color: '#334155' }}>#5572</span>
            </div>
          </div>
        );
      case 'invite':
        return (
          <div
            style={{
              width: 46,
              height: 48,
              borderRadius: 6,
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#92400E',
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: 6, fontFamily: 'serif', fontStyle: 'italic', fontWeight: 700 }}>Invitation</span>
          </div>
        );
      case 'label':
        return (
          <div
            style={{
              width: 46,
              height: 48,
              borderRadius: 6,
              backgroundColor: '#FFEDD5',
              border: '1px solid #FED7AA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              gap: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FDBA74', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, fontWeight: 700, color: '#FFFFFF' }}>•</div>
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FB923C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, fontWeight: 700, color: '#FFFFFF' }}>•</div>
          </div>
        );
      case 'poster':
        return (
          <div
            style={{
              width: 46,
              height: 48,
              borderRadius: 6,
              background: item.thumbBg ? `linear-gradient(135deg, ${item.thumbBg}, #1E1B4B)` : 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#FFFFFF',
              fontSize: 7,
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.1,
              padding: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
            }}
          >
            {item.thumbLabel || 'POSTER'}
          </div>
        );
      case 'report':
      default:
        return (
          <div
            style={{
              width: 46,
              height: 48,
              borderRadius: 6,
              background: item.thumbBg ? `linear-gradient(180deg, ${item.thumbBg}, #1E40AF)` : '#3B82F6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#FFFFFF',
              fontSize: 7,
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.1,
              padding: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
            }}
          >
            {item.thumbLabel || item.id}
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Search & Filter Bar matching PDF */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: theme.colors.creamCard,
          border: `1px solid ${theme.colors.creamCardBorder}`,
          borderRadius: 16,
          padding: '10px 14px',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={16} color="#8E929B" />
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

        <div style={{ width: 1, height: 20, backgroundColor: '#DAD5CB' }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12.5,
            fontWeight: 600,
            color: '#1A1C20',
            cursor: 'pointer',
          }}
        >
          <Calendar size={14} color="#6B707B" />
          <span>{dateRangeDisplay}</span>
          <span style={{ fontSize: 10, color: '#6B707B' }}>▼</span>
        </div>

        <div style={{ width: 1, height: 20, backgroundColor: '#DAD5CB' }} />

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            fontSize: 12.5,
            fontWeight: 600,
            color: '#1A1C20',
            cursor: 'pointer',
            padding: '2px 8px',
          }}
        >
          <Filter size={14} />
          <span>Filter</span>
        </button>
      </div>

      {/* 4 Kanban Columns matching PDF */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, alignItems: 'stretch' }}>
        {/* Column 1: Received */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 16,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={15} color="#4F46E5" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Received</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: 12 }}>
                {receivedItems.length}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#8E929B' }}>FIFO Queue: First order received prints first.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {receivedItems.length === 0 ? (
              <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: 12, color: '#8E929B' }}>
                No received orders waiting
              </div>
            ) : (
              receivedItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedModalOrder(item.rawOrder)}
                  title="Click to view order details"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: idx === 0 ? '1.5px solid #6366F1' : '1px solid #EAE6DC',
                    borderRadius: 12,
                    boxShadow: idx === 0 ? '0 2px 8px rgba(99,102,241,0.12)' : '0 2px 5px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = idx === 0 ? '0 2px 8px rgba(99,102,241,0.12)' : '0 2px 5px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    {renderThumbnail(item)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#4F46E5',
                              backgroundColor: '#EEF2FF',
                              padding: '1px 6px',
                              borderRadius: 6,
                            }}
                          >
                            S.No: {idx + 1}
                          </span>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>{item.id}</span>
                        </div>
                        {idx === 0 && (
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 700,
                              color: '#4338CA',
                              backgroundColor: '#EEF2FF',
                              padding: '1px 6px',
                              borderRadius: 6,
                            }}
                          >
                            FIFO Next
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11.5, color: '#555963', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.customer}
                      </span>
                      <span style={{ fontSize: 10.5, color: '#8E929B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.specs}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1C20' }}>{item.price}</span>
                        {item.timeAgo && <span style={{ fontSize: 10, color: '#9CA3AF' }}>{item.timeAgo}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right Green > Button to move to Printing (FIFO Next) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(item.rawId, 'printing');
                    }}
                    title={idx === 0 ? "Start Printing (FIFO Next)" : `Start Printing (FIFO #${idx + 1})`}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#16A34A',
                      border: 'none',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 5px rgba(22, 163, 74, 0.35)',
                      transition: 'background-color 0.15s ease, transform 0.1s ease',
                    }}
                    onMouseEnter={e => {
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = '#15803D';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#16A34A';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <ChevronRight size={16} strokeWidth={2.8} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Printing */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 16,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Printer size={15} color="#C2410C" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Printing</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#FFEDD5', color: '#C2410C', padding: '2px 8px', borderRadius: 12 }}>
                {printingItems.length}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#8E929B' }}>Orders currently in progress.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {printingItems.length === 0 ? (
              <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: 12, color: '#8E929B' }}>
                No orders currently printing
              </div>
            ) : (
              printingItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedModalOrder(item.rawOrder)}
                  title="Click to view order details"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE6DC',
                    borderRadius: 12,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    {renderThumbnail(item)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#C2410C',
                              backgroundColor: '#FFEDD5',
                              padding: '1px 6px',
                              borderRadius: 6,
                            }}
                          >
                            S.No: {idx + 1}
                          </span>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>{item.id}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11.5, color: '#555963', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.customer}
                      </span>
                      <span style={{ fontSize: 10.5, color: '#8E929B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.specs}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                          <div style={{ width: `${item.progress}%`, height: '100%', backgroundColor: '#F59E0B' }} />
                        </div>
                        <span style={{ fontSize: 10, color: '#8E929B', fontWeight: 600 }}>{item.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Green > Button to move to Ready to Deliver */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(item.rawId, 'ready');
                    }}
                    title="Mark as Ready to Deliver (Next step)"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#16A34A',
                      border: 'none',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 5px rgba(22, 163, 74, 0.35)',
                      transition: 'background-color 0.15s ease, transform 0.1s ease',
                    }}
                    onMouseEnter={e => {
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = '#15803D';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#16A34A';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <ChevronRight size={16} strokeWidth={2.8} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready to Deliver */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 16,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={15} color="#15803D" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Ready to Deliver</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 12 }}>
                {readyItems.length}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#8E929B' }}>Printing completed. Awaiting delivery / customer.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {readyItems.length === 0 ? (
              <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: 12, color: '#8E929B' }}>
                No orders ready to deliver
              </div>
            ) : (
              readyItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedModalOrder(item.rawOrder)}
                  title="Click to view order details"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE6DC',
                    borderRadius: 12,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    {renderThumbnail(item)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#15803D',
                              backgroundColor: '#DCFCE7',
                              padding: '1px 6px',
                              borderRadius: 6,
                            }}
                          >
                            S.No: {idx + 1}
                          </span>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>{item.id}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11.5, color: '#555963', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.customer}
                      </span>
                      <span style={{ fontSize: 10.5, color: '#8E929B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.specs}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1C20' }}>{item.price}</span>
                        {item.timeAgo && <span style={{ fontSize: 10, color: '#9CA3AF' }}>{item.timeAgo}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right Green > Button to move to Completed */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(item.rawId, 'completed');
                    }}
                    title="Mark as Completed (Next step)"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#16A34A',
                      border: 'none',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 5px rgba(22, 163, 74, 0.35)',
                      transition: 'background-color 0.15s ease, transform 0.1s ease',
                    }}
                    onMouseEnter={e => {
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = '#15803D';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#16A34A';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <ChevronRight size={16} strokeWidth={2.8} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Completed */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 16,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={15} color="#4B5563" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Completed</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#F3F4F6', color: '#4B5563', padding: '2px 8px', borderRadius: 12 }}>
                {completedItems.length}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#8E929B' }}>Picked up / delivered to customer.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {completedItems.length === 0 ? (
              <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: 12, color: '#8E929B' }}>
                No completed orders yet
              </div>
            ) : (
              completedItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedModalOrder(item.rawOrder)}
                  title="Click to view order details"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE6DC',
                    borderRadius: 12,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                  }}
                >
                  {/* Left Completed Badge */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #BBF7D0',
                      color: '#15803D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    title="Order Completed"
                  >
                    <Check size={16} strokeWidth={2.8} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    {renderThumbnail(item)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#4B5563',
                              backgroundColor: '#F3F4F6',
                              padding: '1px 6px',
                              borderRadius: 6,
                            }}
                          >
                            S.No: {idx + 1}
                          </span>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>{item.id}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11.5, color: '#555963', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.customer}
                      </span>
                      <span style={{ fontSize: 10.5, color: '#8E929B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.specs}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1C20' }}>{item.price}</span>
                        {item.timeAgo && <span style={{ fontSize: 10, color: '#9CA3AF' }}>{item.timeAgo}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal Popup */}
      {selectedModalOrder && (
        <div
          onClick={() => setSelectedModalOrder(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              width: '100%',
              maxWidth: 560,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              border: '1px solid #EBE7DF',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0ECE4', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {(() => {
                  const mIdx = (orders || []).findIndex(o => o.orderId === selectedModalOrder.orderId);
                  return mIdx >= 0 ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#8E929B', backgroundColor: '#F0ECE4', padding: '3px 8px', borderRadius: 8 }}>
                      S.No: {mIdx + 1}
                    </span>
                  ) : null;
                })()}
                <span style={{ fontSize: 18, fontWeight: 700, color: '#1A1C20' }}>
                  #{selectedModalOrder.orderId}
                </span>
                {renderStatusBadge(selectedModalOrder.status)}
              </div>
              <button
                type="button"
                onClick={() => setSelectedModalOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#8E929B',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 6,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Placed Time */}
            <div style={{ fontSize: 12, color: '#8E929B', marginTop: -6 }}>
              Placed on {selectedModalOrder.createdAt ? new Date(selectedModalOrder.createdAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
            </div>

            {/* Customer Details Box */}
            <div style={{ backgroundColor: '#FAF8F5', borderRadius: 12, padding: '12px 14px', border: '1px solid #EAE6DC' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>
                  <User size={15} color="#4F46E5" />
                  <span>Customer Information</span>
                </div>
                {selectedModalOrder.customerPhone && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <a
                      href={`tel:${selectedModalOrder.customerPhone}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #DAD5CB',
                        fontSize: 11,
                        color: '#1A1C20',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <Phone size={11} />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${String(selectedModalOrder.customerPhone).replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: '#DCFCE7',
                        border: '1px solid #BBF7D0',
                        fontSize: 11,
                        color: '#15803D',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <MessageCircle size={11} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: '#555963' }}>Name:</span>
                <span style={{ fontWeight: 600, color: '#1A1C20' }}>{selectedModalOrder.customerName || (selectedModalOrder.userId ? `Customer (${selectedModalOrder.userId.slice(-6)})` : 'Customer')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginTop: 4 }}>
                <span style={{ color: '#555963' }}>Phone:</span>
                <span style={{ fontWeight: 600, color: '#1A1C20' }}>{selectedModalOrder.customerPhone || selectedModalOrder.userId || '—'}</span>
              </div>
            </div>

            {/* Print Specifications */}
            <div style={{ border: '1px solid #EAE6DC', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 10 }}>
                <Printer size={15} color="#C2410C" />
                <span>Print Job Specifications</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                <div>
                  <span style={{ color: '#8E929B', display: 'block', fontSize: 11 }}>Paper Size</span>
                  <span style={{ fontWeight: 600, color: '#1A1C20' }}>{selectedModalOrder.paperSize || 'A4'}</span>
                </div>
                <div>
                  <span style={{ color: '#8E929B', display: 'block', fontSize: 11 }}>Colour Mode</span>
                  <span style={{ fontWeight: 600, color: '#1A1C20' }}>{selectedModalOrder.colorMode || 'Colour'}</span>
                </div>
                <div>
                  <span style={{ color: '#8E929B', display: 'block', fontSize: 11 }}>Quantity / Copies</span>
                  <span style={{ fontWeight: 600, color: '#1A1C20' }}>{selectedModalOrder.orderDetails?.quantity || selectedModalOrder.copies || 1} copies</span>
                </div>
                <div>
                  <span style={{ color: '#8E929B', display: 'block', fontSize: 11 }}>Sides / Binding</span>
                  <span style={{ fontWeight: 600, color: '#1A1C20' }}>{selectedModalOrder.sides || 'Double sided'} • {selectedModalOrder.binding || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Files Attached */}
            <div style={{ border: '1px solid #EAE6DC', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={14} color="#6366F1" />
                <span>Uploaded Documents</span>
              </div>
              {Array.isArray(selectedModalOrder.files) && selectedModalOrder.files.length > 0 ? (
                selectedModalOrder.files.map((f: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 8,
                      backgroundColor: '#FAF8F5',
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                      <FileText size={15} color="#555963" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {f.fileName || `Document_${idx + 1}.pdf`}
                      </span>
                    </div>
                    {f.fileUrl && (
                      <a
                        href={f.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 6,
                          backgroundColor: '#1C1D21',
                          color: '#FFFFFF',
                          fontSize: 11,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <Download size={11} />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 12, color: '#8E929B' }}>Standard document print</div>
              )}
            </div>

            {/* Delivery / Pickup & Pricing */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0ECE4', paddingTop: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: '#8E929B' }}>
                  {selectedModalOrder.deliveryDetails?.deliveryAddress ? 'Delivery Address' : 'Pickup Location'}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20', maxWidth: 280, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {selectedModalOrder.deliveryDetails?.deliveryAddress || selectedModalOrder.pickupDetails?.pickupLocation || 'Store Counter'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#8E929B' }}>Total Amount (Paid)</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1C20' }}>
                  ₹ {(selectedModalOrder.totalPrice || selectedModalOrder.orderDetails?.totalPrice || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setSelectedModalOrder(null)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #DAD5CB',
                  backgroundColor: '#FFFFFF',
                  color: '#1A1C20',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              {selectedModalOrder.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => {
                    const currentStatus = (selectedModalOrder.status || '').toLowerCase();
                    let next = 'printing';
                    if (currentStatus === 'received' || currentStatus === 'pending') next = 'printing';
                    else if (currentStatus === 'printing') next = 'ready';
                    else if (currentStatus === 'ready') next = 'completed';
                    updateOrderStatus(selectedModalOrder.orderId, next);
                    setSelectedModalOrder(null);
                  }}
                  style={{
                    flex: 1.5,
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <span>
                    {(selectedModalOrder.status || '').toLowerCase() === 'received' || (selectedModalOrder.status || '').toLowerCase() === 'pending'
                      ? 'Move to Printing'
                      : (selectedModalOrder.status || '').toLowerCase() === 'printing'
                      ? 'Mark as Ready to Deliver'
                      : 'Mark as Completed'}
                  </span>
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
