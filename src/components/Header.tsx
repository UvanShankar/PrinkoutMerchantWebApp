import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  ChevronDown,
  Bell,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Store,
  ExternalLink,
} from 'lucide-react';
import { theme } from '../theme';

export const Header: React.FC = () => {
  const { shopData, shopStatus, toggleShopStatus, refreshData, navigateTo, showToast } = useMerchant();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Live dashboard data synchronized');
    }, 400);
  };

  return (
    <header
      style={{
        height: 68,
        backgroundColor: '#121419',
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Shop Switcher */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowShopDropdown(!showShopDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            padding: '6px 10px',
            borderRadius: 8,
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#181A22')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#1F2430',
              border: `1px solid ${theme.colors.borderLight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Store size={18} color={theme.colors.primaryLight} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: theme.colors.textLight }}>
                {shopData.shopName || 'Sabarish Prints'}
              </span>
              <ChevronDown size={14} color={theme.colors.textDim} />
            </div>
            <div style={{ fontSize: 12, color: theme.colors.textDim }}>
              {shopData.area || 'Valipalayam'}, {shopData.city || 'Tiruppur'}
            </div>
          </div>
        </button>

        {showShopDropdown && (
          <div
            style={{
              position: 'absolute',
              top: 52,
              left: 0,
              width: 260,
              backgroundColor: '#1A1D26',
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: 10,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 50,
              overflow: 'hidden',
              padding: 6,
            }}
          >
            <div style={{ padding: '8px 10px', fontSize: 11, fontWeight: 700, color: theme.colors.textDim, textTransform: 'uppercase' }}>
              Your Registered Branches
            </div>
            <button
              onClick={() => {
                setShowShopDropdown(false);
                showToast('Switched to Sabarish Prints (Main)');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 6,
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              <div>
                <div>Sabarish Prints (Main)</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Valipalayam, Tiruppur</div>
              </div>
              <CheckCircle2 size={16} />
            </button>
            <button
              onClick={() => {
                setShowShopDropdown(false);
                showToast('Switched to Selvi Xerox Express');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 6,
                backgroundColor: 'transparent',
                color: theme.colors.textLight,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 13,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#242834')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div>
                <div>Selvi Xerox Express</div>
                <div style={{ fontSize: 11, color: theme.colors.textDim }}>Kumaran Rd, Tiruppur</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Live Shop Online Toggle */}
        <button
          onClick={toggleShopStatus}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 14px',
            borderRadius: 20,
            border: `1px solid ${shopStatus === 'active' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            backgroundColor: shopStatus === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: shopStatus === 'active' ? theme.colors.success : theme.colors.warning,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: shopStatus === 'active' ? theme.colors.success : theme.colors.warning,
              boxShadow: `0 0 8px ${shopStatus === 'active' ? theme.colors.success : theme.colors.warning}`,
            }}
          />
          {shopStatus === 'active' ? 'Accepting Orders' : 'Shop Paused'}
        </button>

        {/* Sync Data */}
        <button
          onClick={handleRefresh}
          title="Refresh latest orders and stats"
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            backgroundColor: '#181A22',
            border: `1px solid ${theme.colors.borderLight}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: theme.colors.textLight,
          }}
        >
          <RefreshCw
            size={16}
            style={{
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              transformOrigin: 'center',
            }}
          />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              backgroundColor: '#181A22',
              border: `1px solid ${theme.colors.borderLight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: theme.colors.textLight,
              position: 'relative',
            }}
          >
            <Bell size={17} />
            <span
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                boxShadow: '0 0 6px #EF4444',
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 48,
                right: 0,
                width: 320,
                backgroundColor: '#1A1D26',
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: 10,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 50,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.textLight }}>Recent Alerts</span>
                <span
                  onClick={() => navigateTo('settings')}
                  style={{ fontSize: 11, color: theme.colors.primaryLight, cursor: 'pointer', fontWeight: 600 }}
                >
                  View All
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ padding: '8px 10px', backgroundColor: '#13151D', borderRadius: 6, fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>New Order #5577 Received</div>
                  <div style={{ color: theme.colors.textDim, fontSize: 11 }}>Arun K • A4 Colour • 12 mins ago</div>
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: '#13151D', borderRadius: 6, fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: '#10B981', marginBottom: 2 }}>Daily Settlement Initiated</div>
                  <div style={{ color: theme.colors.textDim, fontSize: 11 }}>₹ 17,800 sent to HDFC Bank • Yesterday</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={() => navigateTo('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            S
          </div>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textLight }}>Sabarish</span>
            <span style={{ fontSize: 11, color: theme.colors.textDim }}>Owner</span>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};
