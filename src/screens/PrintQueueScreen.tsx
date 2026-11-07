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
}

export const PrintQueueScreen: React.FC = () => {
  const { orders, updateOrderStatus, navigateTo } = useMerchant();
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const dateRangeDisplay = `${startOfMonth.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} – ${endOfMonth.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;

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

  const receivedItems: QueueItem[] = (orders || [])
    .filter(o => o.status?.toLowerCase() === 'received' || o.status?.toLowerCase() === 'pending')
    .map(mapToQueue)
    .filter(matchesSearch);

  const printingItems: QueueItem[] = (orders || [])
    .filter(o => o.status?.toLowerCase() === 'printing')
    .map(o => ({ ...mapToQueue(o), progress: 50 }))
    .filter(matchesSearch);

  const readyItems: QueueItem[] = (orders || [])
    .filter(o => o.status?.toLowerCase() === 'ready')
    .map(mapToQueue)
    .filter(matchesSearch);

  const completedItems: QueueItem[] = (orders || [])
    .filter(o => o.status?.toLowerCase() === 'completed')
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
            <p style={{ fontSize: 11, color: '#8E929B' }}>Paid orders ready to print.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {receivedItems.length === 0 ? (
              <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: 12, color: '#8E929B' }}>
                No received orders waiting
              </div>
            ) : (
              receivedItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    updateOrderStatus(item.rawId, 'printing');
                  }}
                  title="Click to start printing"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE6DC',
                    borderRadius: 12,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {renderThumbnail(item)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>{item.id}</span>
                      <span style={{ fontSize: 11.5, color: '#555963' }}>{item.customer}</span>
                      <span style={{ fontSize: 10.5, color: '#8E929B' }}>{item.specs}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1C20', marginTop: 2 }}>{item.price}</span>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#9CA3AF" />
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
              printingItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    updateOrderStatus(item.rawId, 'ready');
                  }}
                  title="Click to mark ready for pickup"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE6DC',
                    borderRadius: 12,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    {renderThumbnail(item)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>{item.id}</span>
                      <span style={{ fontSize: 11.5, color: '#555963' }}>{item.customer}</span>
                      <span style={{ fontSize: 10.5, color: '#8E929B' }}>{item.specs}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                          <div style={{ width: `${item.progress}%`, height: '100%', backgroundColor: '#F59E0B' }} />
                        </div>
                        <span style={{ fontSize: 10, color: '#8E929B', fontWeight: 600 }}>{item.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#9CA3AF" style={{ marginLeft: 6 }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Pickup */}
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
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Ready for Pickup</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 12 }}>
                {readyItems.length}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#8E929B' }}>Printing completed. Awaiting customer.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {readyItems.length === 0 ? (
              <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: 12, color: '#8E929B' }}>
                No orders ready for pickup
              </div>
            ) : (
              readyItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    updateOrderStatus(item.rawId, 'completed');
                  }}
                  title="Click to mark completed"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE6DC',
                    borderRadius: 12,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {renderThumbnail(item)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>{item.id}</span>
                      <span style={{ fontSize: 11.5, color: '#555963' }}>{item.customer}</span>
                      <span style={{ fontSize: 10.5, color: '#8E929B' }}>{item.specs}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1C20', marginTop: 2 }}>{item.price}</span>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#9CA3AF" />
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
            <p style={{ fontSize: 11, color: '#8E929B' }}>Picked up by customer.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {completedItems.length === 0 ? (
              <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: 12, color: '#8E929B' }}>
                No completed orders yet
              </div>
            ) : (
              completedItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE6DC',
                    borderRadius: 12,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {renderThumbnail(item)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>{item.id}</span>
                      <span style={{ fontSize: 11.5, color: '#555963' }}>{item.customer}</span>
                      <span style={{ fontSize: 10.5, color: '#8E929B' }}>{item.specs}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1C20', marginTop: 2 }}>{item.price}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700 }}>✓</span>
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
