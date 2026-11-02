import React from 'react';
import { useMerchant, ScreenType } from '../context/MerchantContext';
import {
  LayoutDashboard,
  FileText,
  Printer,
  Tag,
  BarChart3,
  CreditCard,
  Store,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { theme } from '../theme';

interface NavItem {
  id: ScreenType;
  label: string;
  icon: any;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentScreen, navigateTo, orders, shopStatus, logout } = useMerchant();

  const pendingCount = orders.filter(o => o.status === 'received' || o.status === 'printing').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: FileText, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'queue', label: 'Print Queue', icon: Printer },
    { id: 'pricing', label: 'Pricing & Services', icon: Tag },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
    { id: 'profile', label: 'Shop Profile', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: 260,
        backgroundColor: theme.colors.bgSidebar,
        borderRight: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 22px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            }}
          >
            <Printer size={20} color="#FFFFFF" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: theme.colors.textLight,
                lineHeight: 1.1,
              }}
            >
              Prinkout<span style={{ color: theme.colors.primaryLight }}>.</span>
            </h1>
            <span style={{ fontSize: 11, color: theme.colors.textDim, fontWeight: 500, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Merchant Hub
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px',
            borderRadius: 20,
            backgroundColor: shopStatus === 'active' ? theme.colors.successBg : theme.colors.warningBg,
            border: `1px solid ${shopStatus === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: shopStatus === 'active' ? theme.colors.success : theme.colors.warning,
              boxShadow: `0 0 6px ${shopStatus === 'active' ? theme.colors.success : theme.colors.warning}`,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: shopStatus === 'active' ? theme.colors.success : theme.colors.warning,
            }}
          >
            {shopStatus === 'active' ? 'Online' : 'Away'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.colors.textDim, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8, paddingLeft: 10 }}>
          Main Menu
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigateTo(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: isActive ? '#1F2430' : 'transparent',
                    color: isActive ? '#FFFFFF' : theme.colors.textMuted,
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#181A22';
                      e.currentTarget.style.color = '#E5E7EB';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.textMuted;
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={18} color={isActive ? theme.colors.primaryLight : theme.colors.textDim} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      style={{
                        padding: '2px 7px',
                        borderRadius: 12,
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Support Box */}
      <div style={{ padding: '16px 14px', borderTop: `1px solid ${theme.colors.border}` }}>
        <div
          style={{
            backgroundColor: '#171922',
            border: `1px solid ${theme.colors.borderLight}`,
            borderRadius: 10,
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <HelpCircle size={16} color={theme.colors.primaryLight} />
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textLight }}>Merchant Support</span>
          </div>
          <p style={{ fontSize: 12, color: theme.colors.textMuted, lineHeight: 1.4, marginBottom: 10 }}>
            Orders or printer questions? We’re active 24/7.
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <a
              href="tel:+919876543210"
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 6,
                backgroundColor: '#202430',
                color: '#D1D5DB',
                fontSize: 11,
                fontWeight: 600,
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Call Hub
            </a>
            <button
              onClick={logout}
              title="Logout / Sign Out"
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                backgroundColor: '#202430',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
