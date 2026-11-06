import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { Bell, ChevronDown, Store, Check, LogOut } from 'lucide-react';
import { theme } from '../theme';

export const Header: React.FC = () => {
  const { currentScreen, settingsTab, shopData, setShopId, shopId, showToast, logout } = useMerchant();
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic titles matching the PDF exactly for each screen
  const getHeaderContent = () => {
    switch (currentScreen) {
      case 'dashboard': {
        const ownerFirst = shopData?.ownerName ? shopData.ownerName.trim().split(' ')[0] : 'Merchant';
        const shopTitle = shopData?.shopName || 'your print shop';
        return {
          title: `Good Evening, ${ownerFirst}! 👋`,
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
        if (settingsTab === 'integrations') {
          return {
            title: 'Integrations',
            subtitle: 'Connect tools to make your workflow faster.',
          };
        }
        if (settingsTab === 'security') {
          return {
            title: 'Security',
            subtitle: 'Keep your account safe and secure.',
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
            {/* Orange/Red notification dot */}
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
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 280,
                backgroundColor: '#1B1C22',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 14,
                boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                padding: '12px 14px',
                zIndex: 50,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
                Recent Alerts
              </div>
              <div style={{ fontSize: 11.5, color: '#D1D5DB', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Order #5577 received (Arun K)
              </div>
              <div style={{ fontSize: 11.5, color: '#D1D5DB', padding: '6px 0' }}>
                ₹ 43,488 daily payout processed
              </div>
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
