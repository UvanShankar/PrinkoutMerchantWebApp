import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { Bell, ChevronDown, Store, Check, LogOut, User, Settings } from 'lucide-react';
import { theme } from '../theme';

export const Header: React.FC = () => {
  const { currentScreen, settingsTab, shopData, setShopId, shopId, showToast, logout, orders, payouts, navigateTo } = useMerchant();
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive dynamic alerts from real merchant orders & payouts
  const alerts: Array<{ id: string; title: string; subtitle?: string; type: 'order' | 'payout' }> = [];

  if (orders && orders.length > 0) {
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime()
    );
    sortedOrders.slice(0, 3).forEach(o => {
      const orderShortId = o.orderId.length > 8 ? o.orderId.slice(-4) : o.orderId;
      const cust = o.customerName || 'Customer';
      alerts.push({
        id: `ord_${o.orderId}`,
        title: `Order #${orderShortId} received (${cust})`,
        subtitle: `${o.serviceType || 'Standard Print'} · ₹${o.totalPrice || 0}`,
        type: 'order',
      });
    });
  }

  if (payouts?.recentPayouts && payouts.recentPayouts.length > 0) {
    const latestPayout = payouts.recentPayouts[0];
    alerts.push({
      id: `pay_${latestPayout.payoutId}`,
      title: `₹ ${latestPayout.amount.toLocaleString('en-IN')} daily payout ${latestPayout.status?.toLowerCase() || 'processed'}`,
      subtitle: latestPayout.utr ? `UTR: ${latestPayout.utr}` : 'Settled to linked bank account',
      type: 'payout',
    });
  } else if (payouts?.nextPayoutAmount && payouts.nextPayoutAmount > 0) {
    alerts.push({
      id: 'pay_next',
      title: `₹ ${payouts.nextPayoutAmount.toLocaleString('en-IN')} daily payout scheduled`,
      subtitle: payouts.nextPayoutDate ? `Expected: ${new Date(payouts.nextPayoutDate).toLocaleDateString()}` : 'Scheduled daily payout',
      type: 'payout',
    });
  }

  // Dynamic titles matching the PDF exactly for each screen
  const getHeaderContent = () => {
    switch (currentScreen) {
      case 'dashboard': {
        const shopTitle = shopData?.shopName || 'Print Shop';
        return {
          title: `Good Evening, ${shopTitle}! 👋`,
          subtitle: `Here's what's happening at ${shopTitle} today.`,
        };
      }
      case 'orders':
        return {
          title: 'Orders',
          subtitle: 'All your customer orders in one place.',
        };
      case 'queue':
        return {
          title: 'Print Queue',
          subtitle: 'Track and manage your printing workflow.',
        };
      case 'pricing':
        return {
          title: 'Pricing & Services',
          subtitle: 'Manage the print services you offer and set your prices.',
        };
      case 'reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'Track your sales, orders, and business performance.',
        };
      case 'payouts':
        return {
          title: 'Payouts',
          subtitle: 'Track your earnings, settlements, and payouts from Prinkout.',
        };
      case 'profile':
        return {
          title: 'Shop Profile',
          subtitle: 'Manage your shop details, branding, and public profile.',
        };
      case 'settings':
        if (settingsTab === 'notifications') {
          return {
            title: 'Notifications',
            subtitle: 'Choose what updates you want to receive.',
          };
        }
        if (settingsTab === 'team') {
          return {
            title: 'Team & Access',
            subtitle: 'Add team members and manage their access levels.',
          };
        }
        return {
          title: 'Settings',
          subtitle: 'Manage your account, notifications, team and preferences.',
        };
      default:
        return {
          title: 'Merchant Portal',
          subtitle: 'Prinkout merchant dashboard',
        };
    }
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px 18px',
        backgroundColor: '#0F1013',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 5,
      }}
    >
      {/* Left Title and Subtitle */}
      <div>
        <h1
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: 28,
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: 4,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>{subtitle}</p>
      </div>

      {/* Right Controls: Bell and Shop Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Bell Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#1E2026',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#D1D5DB',
              position: 'relative',
            }}
          >
            <Bell size={16} />
            {/* Orange notification dot if there are active alerts */}
            {alerts.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: '#F97316',
                  border: '1.5px solid #1E2026',
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 300,
                backgroundColor: '#1B1C22',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 14,
                boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                padding: '12px 14px',
                zIndex: 50,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>Recent Alerts</span>
                {alerts.length > 0 && (
                  <span style={{ fontSize: 10, color: '#9CA3AF', backgroundColor: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 8 }}>
                    {alerts.length} new
                  </span>
                )}
              </div>

              {alerts.length === 0 ? (
                <div style={{ padding: '12px 6px', textAlign: 'center', color: '#9CA3AF', fontSize: 11.5 }}>
                  No recent alerts right now.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {alerts.map((alert, idx) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (alert.type === 'order') navigateTo('orders');
                        if (alert.type === 'payout') navigateTo('payouts');
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        borderBottom: idx < alerts.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
                    >
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: '#F3F4F6', marginBottom: 2 }}>
                        {alert.title}
                      </div>
                      {alert.subtitle && (
                        <div style={{ fontSize: 10.5, color: '#9CA3AF' }}>
                          {alert.subtitle}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shop Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowShopDropdown(!showShopDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 14px',
              borderRadius: 22,
              backgroundColor: '#1E2026',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Store size={15} color="#9CA3AF" />
            <span>{shopData?.shopName || 'Shop'}</span>
            <ChevronDown size={14} color="#9CA3AF" />
          </button>

          {showShopDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 220,
                backgroundColor: '#1B1C22',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 12,
                boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                padding: 6,
                zIndex: 50,
              }}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: '#2A2D38',
                  color: '#FFFFFF',
                  fontSize: 12.5,
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {shopData?.shopName || 'Current Shop'}
                </span>
                <Check size={14} color="#10B981" />
              </div>

              <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

              <button
                onClick={() => {
                  setShowShopDropdown(false);
                  navigateTo('profile');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: 'transparent',
                  color: '#D1D5DB',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <User size={14} color="#9CA3AF" />
                <span>Shop Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowShopDropdown(false);
                  navigateTo('settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: 'transparent',
                  color: '#D1D5DB',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Settings size={14} color="#9CA3AF" />
                <span>Account Settings</span>
              </button>

              <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

              <button
                onClick={() => {
                  setShowShopDropdown(false);
                  logout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={14} color="#EF4444" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
