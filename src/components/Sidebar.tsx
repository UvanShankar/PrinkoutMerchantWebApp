import React from 'react';
import { useMerchant, ScreenType, SettingsSubTab } from '../context/MerchantContext';
import { BrandLogo } from './BrandLogo';
import {
  Home,
  FileText,
  Printer,
  CheckCircle,
  BarChart3,
  CreditCard,
  Store,
  Settings,
  ChevronDown,
  ChevronUp,
  Headphones,
  ArrowRight,
  LogOut,
  Lock,
} from 'lucide-react';
import { theme } from '../theme';

export const Sidebar: React.FC = () => {
  const { currentScreen, navigateTo, settingsTab, setSettingsTab, logout, isSetupPending, showToast } = useMerchant();

  const isSettingsActive = currentScreen === 'settings';

  const navItems = [
    { id: 'dashboard' as ScreenType, label: 'Dashboard', icon: Home },
    { id: 'orders' as ScreenType, label: 'Orders', icon: FileText },
    { id: 'queue' as ScreenType, label: 'Print Queue', icon: Printer },
    { id: 'pricing' as ScreenType, label: 'Pricing & Services', icon: CheckCircle },
    { id: 'reports' as ScreenType, label: 'Reports', icon: BarChart3 },
    { id: 'payouts' as ScreenType, label: 'Payouts', icon: CreditCard },
    { id: 'profile' as ScreenType, label: 'Shop Profile', icon: Store },
    { id: 'settings' as ScreenType, label: 'Settings', icon: Settings },
  ];

  const settingsSubTabs: { id: SettingsSubTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'team', label: 'Team & Access' },
  ];

  return (
    <aside
      style={{
        width: 230,
        backgroundColor: '#0F1013',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        flexShrink: 0,
        height: '100vh',
        boxSizing: 'border-box',
        zIndex: 10,
      }}
    >
      <div>
        {/* Logo */}
        <div style={{ marginBottom: 32, paddingLeft: 8 }}>
          <BrandLogo size="small" showSubtitle={true} />
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            const isSettings = item.id === 'settings';
            const isLocked = isSetupPending && !['profile', 'settings', 'pricing'].includes(item.id);

            return (
              <div key={item.id}>
                <button
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) {
                      showToast('Complete the 3 setup steps (Profile, Settings, Pricing) to unlock');
                      return;
                    }
                    navigateTo(item.id);
                  }}
                  title={isLocked ? 'Complete Setup to Unlock' : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 14px',
                    borderRadius: 22,
                    border: 'none',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#111215' : isLocked ? '#4B5563' : '#9CA3AF',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.45 : 1,
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={16} strokeWidth={isActive ? 2.4 : 2} color={isActive ? '#111215' : isLocked ? '#4B5563' : '#9CA3AF'} />
                    <span>{item.label}</span>
                  </div>

                  {isLocked ? (
                    <Lock size={12} color="#6B7280" />
                  ) : (
                    isSettings && (
                      isSettingsActive ? (
                        <ChevronUp size={14} color={isActive ? '#111215' : '#9CA3AF'} />
                      ) : (
                        <ChevronDown size={14} color="#9CA3AF" />
                      )
                    )
                  )}
                </button>

                {/* Sub-tabs if settings is active and tab is not general (pages 15-18) or when expanded */}
                {isSettings && isSettingsActive && settingsTab !== 'general' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '6px 0 6px 14px' }}>
                    {settingsSubTabs.map(sub => {
                      const isSubActive = settingsTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSettingsTab(sub.id);
                            navigateTo('settings');
                          }}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '6px 14px',
                            borderRadius: 16,
                            border: 'none',
                            backgroundColor: isSubActive ? '#EAE7FF' : 'transparent',
                            color: isSubActive ? '#4338CA' : '#9CA3AF',
                            fontSize: 12,
                            fontWeight: isSubActive ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Need Help card (exact to PDF: No extra Sign Out link) */}
      <div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 14,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Headphones size={15} color="#D1D5DB" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>Need Help?</span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>Chat with Prinkout support.</span>
            </div>
          </div>
          <ArrowRight size={14} color="#9CA3AF" />
        </div>
      </div>
    </aside>
  );
};
