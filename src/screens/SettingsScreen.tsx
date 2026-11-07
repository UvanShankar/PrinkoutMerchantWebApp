import React, { useState } from 'react';
import { useMerchant, SettingsSubTab } from '../context/MerchantContext';
import {
  User,
  Bell,
  Users,
  Printer,
  Link,
  Shield,
  ChevronRight,
  Plus,
  MoreVertical,
  CheckCircle2,
  ExternalLink,
  Radio,
  Clock,
  Laptop,
  Tablet,
  Smartphone,
  Lock,
  Rocket,
  Info,
} from 'lucide-react';
import { theme } from '../theme';

export const SettingsScreen: React.FC = () => {
  const { settingsTab, setSettingsTab, showToast, logout, orders, payouts } = useMerchant();

  // Notification states (Page 15)
  const [notifPreferences, setNotifPreferences] = useState({
    newOrders: true,
    orderUpdates: true,
    payoutUpdates: true,
    queueAlerts: false,
    announcements: true,
  });
  const [notifChannel, setNotifChannel] = useState<'inApp' | 'whatsapp'>('inApp');

  // Security states (Page 18)
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // Preference states (Page 14)
  const [defaultOrderView, setDefaultOrderView] = useState('All Orders');
  const [pageSize, setPageSize] = useState('50');
  const [themePreference, setThemePreference] = useState<'Light' | 'Dark'>('Light');

  // General 2FA toggle (Page 14)
  const [generalTwoFactor, setGeneralTwoFactor] = useState(true);

  const subtabs: { id: SettingsSubTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'team', label: 'Team & Access' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'security', label: 'Security' },
  ];

  // Helper iOS-style toggle matching PDF
  const renderToggle = (checked: boolean, onToggle: () => void, color = '#7C3AED') => (
    <div
      onClick={onToggle}
      style={{
        width: 38,
        height: 22,
        borderRadius: 12,
        backgroundColor: checked ? color : '#D1D5DB',
        display: 'inline-flex',
        alignItems: 'center',
        padding: 2,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          transform: checked ? 'translateX(16px)' : 'translateX(0)',
          transition: 'transform 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Subtab Bar (shown on General view matching Page 14) */}
      {settingsTab === 'general' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '10px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#EFECE4', padding: 4, borderRadius: 20 }}>
            {subtabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSettingsTab(tab.id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 16,
                  border: 'none',
                  backgroundColor: settingsTab === tab.id ? '#1C1D21' : 'transparent',
                  color: settingsTab === tab.id ? '#FFFFFF' : '#6B707B',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 14: GENERAL SETTINGS OVERVIEW */}
      {/* ========================================================================= */}
      {settingsTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 6 Cards 3x2 Grid matching PDF */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {/* 1: Account Settings */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 16,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <User size={16} color="#7C3AED" />
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>Account Settings</h3>
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Manage your login and account details.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#555963' }}>Owner Name</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>Sabarish S</span>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#555963' }}>Mobile Number</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>+91 98432 11234</span>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#555963' }}>Change Password</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>••••••••</span>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2: Notifications */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 16,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Bell size={16} color="#7C3AED" />
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>Notifications</h3>
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Choose what updates you want to receive.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#1A1C20', fontWeight: 600 }}>New Order Alerts</span>
                  {renderToggle(notifPreferences.newOrders, () => setNotifPreferences({ ...notifPreferences, newOrders: !notifPreferences.newOrders }))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#1A1C20', fontWeight: 600 }}>Payout Updates</span>
                  {renderToggle(notifPreferences.payoutUpdates, () => setNotifPreferences({ ...notifPreferences, payoutUpdates: !notifPreferences.payoutUpdates }))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#1A1C20', fontWeight: 600 }}>Prinkout Announcements</span>
                  {renderToggle(notifPreferences.announcements, () => setNotifPreferences({ ...notifPreferences, announcements: !notifPreferences.announcements }))}
                </div>
              </div>
            </div>

            {/* 3: Team & Access */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 16,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <Users size={16} color="#7C3AED" />
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>Team & Access</h3>
                </div>
                <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Add team members and manage their access.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                        S
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20' }}>Sabarish S (You)</div>
                        <div style={{ fontSize: 10.5, color: '#8E929B' }}>Owner • Full Access</div>
                      </div>
                    </div>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                        A
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20' }}>Arun K</div>
                        <div style={{ fontSize: 10.5, color: '#8E929B' }}>Staff • Orders, Print Queue</div>
                      </div>
                    </div>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSettingsTab('team')}
                style={{
                  width: '100%',
                  marginTop: 14,
                  padding: '8px',
                  borderRadius: 10,
                  backgroundColor: '#EDE9FE',
                  border: '1px solid #DDD6FE',
                  color: '#6B21A8',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + Add Team Member
              </button>
            </div>

            {/* 4: Printer & Production */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 16,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Printer size={16} color="#7C3AED" />
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>Printer & Production</h3>
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Update your printing setup and capacity.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#555963' }}>Available Printers</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>2 Printers</span>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#555963' }}>Daily Capacity</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>500 Prints</span>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#555963' }}>Operating Hours</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>9:00 AM – 8:00 PM</span>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>
              </div>
            </div>

            {/* 5: Integrations */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 16,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Link size={16} color="#7C3AED" />
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>Integrations</h3>
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Connect tools to make your workflow faster.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>Razorpay</div>
                    <div style={{ fontSize: 10.5, color: '#8E929B' }}>For payouts and settlements</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                      ✓ Connected
                    </span>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>WhatsApp Business</div>
                    <div style={{ fontSize: 10.5, color: '#8E929B' }}>For order notifications</div>
                  </div>
                  <button
                    onClick={() => setSettingsTab('integrations')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 14,
                      backgroundColor: '#EFECE4',
                      border: '1px solid #DAD5CB',
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: '#1A1C20',
                      cursor: 'pointer',
                    }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>

            {/* 6: Security */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 16,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Shield size={16} color="#7C3AED" />
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>Security</h3>
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Keep your account safe and secure.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#1A1C20', fontWeight: 600 }}>Two-Factor Authentication (2FA)</span>
                  {renderToggle(generalTwoFactor, () => setGeneralTwoFactor(!generalTwoFactor))}
                </div>

                <div
                  onClick={() => setSettingsTab('security')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF', cursor: 'pointer' }}
                >
                  <span style={{ color: '#555963' }}>Login Activity</span>
                  <ChevronRight size={14} color="#8E929B" />
                </div>

                <div
                  onClick={() => setSettingsTab('security')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', cursor: 'pointer' }}
                >
                  <span style={{ color: '#555963' }}>Manage Sessions</span>
                  <ChevronRight size={14} color="#8E929B" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner: Other Preferences matching PDF */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Other Preferences</h4>
              <p style={{ fontSize: 11.5, color: '#8E929B' }}>Customize your experience on Prinkout.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#555963' }}>Default Order View</span>
                <select
                  value={defaultOrderView}
                  onChange={e => setDefaultOrderView(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    backgroundColor: '#EFECE4',
                    border: '1px solid #DAD5CB',
                    fontSize: 12,
                    fontWeight: 600,
                    outline: 'none',
                    color: '#1A1C20',
                  }}
                >
                  <option value="All Orders">All Orders</option>
                  <option value="Received">Received</option>
                  <option value="Printing">Printing</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#555963' }}>Page Size (Orders)</span>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    backgroundColor: '#EFECE4',
                    border: '1px solid #DAD5CB',
                    fontSize: 12,
                    fontWeight: 600,
                    outline: 'none',
                    color: '#1A1C20',
                  }}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#555963' }}>Theme</span>
                <div style={{ display: 'flex', backgroundColor: '#EFECE4', borderRadius: 16, padding: 2 }}>
                  <button
                    onClick={() => setThemePreference('Light')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 14,
                      border: 'none',
                      backgroundColor: themePreference === 'Light' ? '#FFFFFF' : 'transparent',
                      color: themePreference === 'Light' ? '#1A1C20' : '#8E929B',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ☼ Light
                  </button>
                  <button
                    onClick={() => setThemePreference('Dark')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 14,
                      border: 'none',
                      backgroundColor: themePreference === 'Dark' ? '#1C1D21' : 'transparent',
                      color: themePreference === 'Dark' ? '#FFFFFF' : '#8E929B',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ☾ Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 15: NOTIFICATIONS */}
      {/* ========================================================================= */}
      {settingsTab === 'notifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          {/* Left Panel: Preferences & Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '20px 22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Bell size={18} color="#7C3AED" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>Notification Preferences</h3>
              </div>
              <p style={{ fontSize: 12, color: '#8E929B', marginBottom: 18 }}>
                Get real-time updates for your orders, payouts and more.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>New Order Alerts</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Get notified when you receive a new order.</div>
                  </div>
                  {renderToggle(notifPreferences.newOrders, () => setNotifPreferences({ ...notifPreferences, newOrders: !notifPreferences.newOrders }))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Order Updates</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Updates on order status (In Progress, Ready, Completed).</div>
                  </div>
                  {renderToggle(notifPreferences.orderUpdates, () => setNotifPreferences({ ...notifPreferences, orderUpdates: !notifPreferences.orderUpdates }))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Payout Updates</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Notifications for settlement, payouts and receipts.</div>
                  </div>
                  {renderToggle(notifPreferences.payoutUpdates, () => setNotifPreferences({ ...notifPreferences, payoutUpdates: !notifPreferences.payoutUpdates }))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Print Queue Alerts</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Get alerts when print queue is high or delayed.</div>
                  </div>
                  {renderToggle(notifPreferences.queueAlerts, () => setNotifPreferences({ ...notifPreferences, queueAlerts: !notifPreferences.queueAlerts }))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Announcements</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Product updates, new features and important announcements from Prinkout.</div>
                  </div>
                  {renderToggle(notifPreferences.announcements, () => setNotifPreferences({ ...notifPreferences, announcements: !notifPreferences.announcements }))}
                </div>
              </div>
            </div>

            {/* Notification Channels */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '20px 22px',
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1C20', marginBottom: 4 }}>Notification Channels</h3>
              <p style={{ fontSize: 12, color: '#8E929B', marginBottom: 14 }}>Choose how you want to receive notifications.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div
                  onClick={() => setNotifChannel('inApp')}
                  style={{
                    padding: '14px',
                    borderRadius: 12,
                    backgroundColor: notifChannel === 'inApp' ? '#EDE9FE' : '#FAF8F5',
                    border: `1.5px solid ${notifChannel === 'inApp' ? '#7C3AED' : '#DAD5CB'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: notifChannel === 'inApp' ? '#7C3AED' : '#FFFFFF', border: '1px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 10 }}>✓</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>In-App</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#555963', lineHeight: 1.3 }}>Receive notifications inside the merchant portal.</p>
                </div>

                <div
                  onClick={() => setNotifChannel('whatsapp')}
                  style={{
                    padding: '14px',
                    borderRadius: 12,
                    backgroundColor: notifChannel === 'whatsapp' ? '#EDE9FE' : '#FAF8F5',
                    border: `1.5px solid ${notifChannel === 'whatsapp' ? '#7C3AED' : '#DAD5CB'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: notifChannel === 'whatsapp' ? '#7C3AED' : '#FFFFFF', border: '1px solid #DAD5CB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 10 }}>{notifChannel === 'whatsapp' && '✓'}</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>WhatsApp</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#555963', lineHeight: 1.3 }}>Get important updates on WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: In-App Notifications List matching PDF */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>In-App Notifications</h3>
                <p style={{ fontSize: 11.5, color: '#8E929B' }}>Recent notifications from Prinkout.</p>
              </div>
              <span onClick={() => showToast('All marked as read')} style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', cursor: 'pointer' }}>
                ✓ Mark All as Read
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(() => {
                const list: Array<{ title: string; desc: string; time: string; unread: boolean }> = [];
                if (orders && orders.length > 0) {
                  const o = orders[0];
                  const sId = o.orderId.length > 8 ? o.orderId.slice(-4) : o.orderId;
                  list.push({
                    title: 'New Order Received',
                    desc: `Order #${sId} – ${o.serviceType || 'Standard Prints'} (₹${o.totalPrice || 0})`,
                    time: 'Just now',
                    unread: true,
                  });
                  if (orders.length > 1) {
                    const o2 = orders[1];
                    const sId2 = o2.orderId.length > 8 ? o2.orderId.slice(-4) : o2.orderId;
                    list.push({
                      title: `Order Status: ${o2.status || 'Received'}`,
                      desc: `Order #${sId2} is currently ${o2.status || 'in progress'}.`,
                      time: '20 min ago',
                      unread: true,
                    });
                  }
                }
                if (payouts?.recentPayouts && payouts.recentPayouts.length > 0) {
                  const p = payouts.recentPayouts[0];
                  list.push({
                    title: 'Payout Processed',
                    desc: `₹${p.amount.toLocaleString('en-IN')} has been settled to your bank.`,
                    time: '1 hr ago',
                    unread: false,
                  });
                } else if (payouts?.nextPayoutAmount && payouts.nextPayoutAmount > 0) {
                  list.push({
                    title: 'Payout Scheduled',
                    desc: `₹${payouts.nextPayoutAmount.toLocaleString('en-IN')} scheduled for daily settlement.`,
                    time: 'Today',
                    unread: false,
                  });
                }
                list.push(
                  { title: 'New Feature: Print Queue', desc: 'Now you can manage and track all print jobs in one place.', time: '3 hr ago', unread: false },
                  { title: 'Service Update', desc: 'Prinkout merchant network is operating normally.', time: '1 day ago', unread: false }
                );
                return list.map(n => (
                  <div
                    key={n.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      backgroundColor: '#FAF8F5',
                      border: '1px solid #EBE7DF',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 11.5, color: '#555963' }}>{n.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 10.5, color: '#8E929B' }}>{n.time}</span>
                      {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#7C3AED' }} />}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 16: TEAM & ACCESS */}
      {/* ========================================================================= */}
      {settingsTab === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top KPI Card matching PDF */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ backgroundColor: '#EDE9FE', border: '1px solid #DDD6FE', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Users size={20} color="#7C3AED" />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>3</div>
                  <div style={{ fontSize: 11.5, color: '#6B21A8' }}>Team Members</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} color="#15803D" />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>2</div>
                  <div style={{ fontSize: 11.5, color: '#15803D' }}>Full Access</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <User size={20} color="#B45309" />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>1</div>
                  <div style={{ fontSize: 11.5, color: '#B45309' }}>Limited Access</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Invite team member')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 22px',
                borderRadius: 22,
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Add Team Member</span>
            </button>
          </div>

          {/* Middle Row: Team Members Table & Access Roles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16 }}>
            {/* Team Members Table */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '20px 22px',
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Team Members</h3>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 16 }}>Manage your team and their access.</p>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                    <th style={{ padding: '8px 10px' }}>Name</th>
                    <th style={{ padding: '8px 10px' }}>Role & Access</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Last Active</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Sabarish S (You)', phone: '+91 98432 11234', role: 'Owner', access: 'Full Access', isOwner: true, time: 'Just now' },
                    { name: 'Arun K', phone: '+91 98765 43210', role: 'Staff', access: 'Orders, Print Queue', isOwner: false, time: '24 min ago' },
                    { name: 'Divya R', phone: '+91 98987 65432', role: 'Staff', access: 'Orders, Reports', isOwner: false, time: '2 hrs ago' },
                  ].map(m => (
                    <tr key={m.name} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1A1C20' }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: '#8E929B' }}>{m.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 12, backgroundColor: m.isOwner ? '#EDE9FE' : '#F3F4F6', color: m.isOwner ? '#6B21A8' : '#4B5563', fontSize: 11.5, fontWeight: 600 }}>
                          <span>{m.role}</span>
                          <span style={{ fontSize: 10, opacity: 0.75 }}>• {m.access}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, backgroundColor: '#DCFCE7', color: '#15803D', fontSize: 11, fontWeight: 700 }}>
                          ✓ Active
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{m.time}</td>
                      <td style={{ padding: '12px 6px', textAlign: 'center', color: '#8E929B' }}>
                        <MoreVertical size={14} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Access Roles */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '20px 22px',
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Access Roles</h3>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Built-in roles to control what your team can do.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: '12px 14px', borderRadius: 12, backgroundColor: '#EDE9FE', border: '1px solid #DDD6FE' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#581C87', marginBottom: 2 }}>Owner</div>
                  <div style={{ fontSize: 11.5, color: '#6B21A8' }}>Full access to all features, settings and payments.</div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EBE7DF' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Staff (Full Access)</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Can manage orders, print queue, pricing and reports.</div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EBE7DF' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Staff (Limited Access)</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Can view and manage only assigned sections (e.g., Orders or Print Queue).</div>
                </div>
              </div>
            </div>
          </div>

          {/* Access Activity Timeline matching PDF */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>Access Activity</h3>
                <p style={{ fontSize: 11.5, color: '#8E929B' }}>Recent team actions on your account.</p>
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20', backgroundColor: '#EFECE4', padding: '5px 12px', borderRadius: 12 }}>
                Last 7 Days ▼
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
              {[
                { action: 'Arun K logged in', time: 'Today, 5:42 PM • Tirupur, IN' },
                { action: 'Divya R updated print queue', time: 'Today, 3:16 PM • Tirupur, IN' },
                { action: 'Sabarish S changed pricing for A4 (100 GSM)', time: 'Today, 11:27 AM • Tirupur, IN' },
                { action: 'Sabarish S added Arun K to the team', time: 'Yesterday, 6:10 PM • Tirupur, IN' },
              ].map(a => (
                <div key={a.action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderBottom: '1px solid #F0ECE4' }}>
                  <span style={{ fontWeight: 600, color: '#1A1C20' }}>{a.action}</span>
                  <span style={{ fontSize: 11.5, color: '#8E929B' }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 17: INTEGRATIONS */}
      {/* ========================================================================= */}
      {settingsTab === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            {/* Left list of integration partners */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Integrations</h3>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 10 }}>Connect tools to make your workflow faster.</p>

              {/* Razorpay (Selected) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#EDE9FE',
                  border: '1.5px solid #7C3AED',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#581C87' }}>Razorpay</div>
                  <div style={{ fontSize: 11.5, color: '#6B21A8' }}>Accept payments and receive settlements.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                    ✓ Connected
                  </span>
                  <ChevronRight size={14} color="#581C87" />
                </div>
              </div>

              {/* WhatsApp Business */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>WhatsApp Business</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Send order updates to customers.</div>
                </div>
                <button
                  onClick={() => showToast('WhatsApp Business connect dialog')}
                  style={{ padding: '6px 14px', borderRadius: 14, backgroundColor: '#EFECE4', border: '1px solid #DAD5CB', fontSize: 12, fontWeight: 600, color: '#1A1C20', cursor: 'pointer' }}
                >
                  Connect
                </button>
              </div>

              {/* Google Drive */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Google Drive</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Save and access print files securely.</div>
                </div>
                <button
                  onClick={() => showToast('Google Drive connect dialog')}
                  style={{ padding: '6px 14px', borderRadius: 14, backgroundColor: '#EFECE4', border: '1px solid #DAD5CB', fontSize: 12, fontWeight: 600, color: '#1A1C20', cursor: 'pointer' }}
                >
                  Connect
                </button>
              </div>

              {/* Tally */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Tally (Optional)</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Sync invoices and sales data with Tally.</div>
                </div>
                <button
                  onClick={() => showToast('Tally sync connect dialog')}
                  style={{ padding: '6px 14px', borderRadius: 14, backgroundColor: '#EFECE4', border: '1px solid #DAD5CB', fontSize: 12, fontWeight: 600, color: '#1A1C20', cursor: 'pointer' }}
                >
                  Connect
                </button>
              </div>
            </div>

            {/* Right Panel: Razorpay Details matching PDF */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>Razorpay</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                    ✓ Connected
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#6B707B', marginBottom: 18 }}>
                  Accept online payments from your customers and receive settlements directly to your bank account.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#555963' }}>Settlement Account</span>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>ICICI Bank – ****4321</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#555963' }}>Settlement Cycle</span>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>T+1 (Next business day)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#555963' }}>Transaction Charges</span>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>2% + GST (as per Razorpay)</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #EBE7DF', marginTop: 16, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D' }}>
                    <span>✓</span>
                    <span style={{ color: '#1A1C20' }}>Accept UPI, Cards & Netbanking</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D' }}>
                    <span>✓</span>
                    <span style={{ color: '#1A1C20' }}>Auto payment confirmation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D' }}>
                    <span>✓</span>
                    <span style={{ color: '#1A1C20' }}>Secure & PCI compliant</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => showToast('View Transactions')}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: 12,
                    backgroundColor: '#EFECE4',
                    border: '1px solid #DAD5CB',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#1A1C20',
                    cursor: 'pointer',
                  }}
                >
                  View Transactions
                </button>
                <button
                  onClick={() => showToast('Disconnect Razorpay')}
                  style={{
                    padding: '9px 16px',
                    borderRadius: 12,
                    backgroundColor: 'transparent',
                    border: '1px solid #FCA5A5',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#EF4444',
                    cursor: 'pointer',
                  }}
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Banner matching PDF */}
          <div
            style={{
              backgroundColor: '#EDE9FE',
              borderRadius: 16,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#581C87',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>More Integrations Coming Soon</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Inventory, accounting and logistics integrations will be available in upcoming updates.</div>
            </div>
            <Rocket size={24} color="#7C3AED" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 18: SECURITY */}
      {/* ========================================================================= */}
      {settingsTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            {/* Left Security Options */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Security</h3>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 10 }}>Keep your account safe and secure.</p>

              {/* 2FA Card (Lavender highlight) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#EDE9FE',
                  border: '1px solid #DDD6FE',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#581C87' }}>Two-Factor Authentication (2FA)</div>
                  <div style={{ fontSize: 11.5, color: '#6B21A8' }}>Add an extra layer of security to your account.</div>
                </div>
                {renderToggle(twoFactorAuth, () => setTwoFactorAuth(!twoFactorAuth))}
              </div>

              {/* Login Activity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1A1C20' }}>Login Activity</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>View recent logins and active sessions.</div>
                </div>
                <ChevronRight size={15} color="#8E929B" />
              </div>

              {/* Manage Sessions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1A1C20' }}>Manage Sessions</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Log out from other devices.</div>
                </div>
                <ChevronRight size={15} color="#8E929B" />
              </div>

              {/* Change Password */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1A1C20' }}>Change Password</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Update your account password regularly.</div>
                </div>
                <ChevronRight size={15} color="#8E929B" />
              </div>

              {/* Account Security Tips */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 14,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1A1C20' }}>Account Security Tips</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Best practices to keep your account protected.</div>
                </div>
                <ChevronRight size={15} color="#8E929B" />
              </div>
            </div>

            {/* Right Panel: Account Security & Recent Activity matching PDF */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Account Security */}
              <div
                style={{
                  backgroundColor: theme.colors.creamCard,
                  border: `1px solid ${theme.colors.creamCardBorder}`,
                  borderRadius: 18,
                  padding: '20px 22px',
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Account Security</h3>
                <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Your account is protected.</p>

                <div style={{ padding: '14px 16px', borderRadius: 12, backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={18} color="#15803D" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>Your Account is Secure</div>
                    <div style={{ fontSize: 11.5, color: '#166534' }}>2FA is enabled and no security issues found.</div>
                  </div>
                </div>
              </div>

              {/* Recent Login Activity */}
              <div
                style={{
                  backgroundColor: theme.colors.creamCard,
                  border: `1px solid ${theme.colors.creamCardBorder}`,
                  borderRadius: 18,
                  padding: '20px 22px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>Recent Login Activity</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', cursor: 'pointer' }}>View All →</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Laptop size={16} color="#6B707B" />
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>MacBook Pro</div>
                        <div style={{ fontSize: 11, color: '#8E929B' }}>Tirupur, IN • Today, 5:42 PM</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                      Current Device
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Tablet size={16} color="#6B707B" />
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>iPad Air</div>
                        <div style={{ fontSize: 11, color: '#8E929B' }}>Tirupur, IN • Today, 11:20 AM</div>
                      </div>
                    </div>
                    <MoreVertical size={14} color="#8E929B" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Smartphone size={16} color="#6B707B" />
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1C20' }}>iPhone</div>
                        <div style={{ fontSize: 11, color: '#8E929B' }}>Coimbatore, IN • Yesterday, 7:14 PM</div>
                      </div>
                    </div>
                    <MoreVertical size={14} color="#8E929B" />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #EBE7DF', marginTop: 16, paddingTop: 12 }}>
                  <button
                    onClick={logout}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: 10,
                      backgroundColor: '#EFECE4',
                      border: '1px solid #DAD5CB',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#EF4444',
                      cursor: 'pointer',
                    }}
                  >
                    Log Out of This Device
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner matching PDF */}
          <div
            style={{
              backgroundColor: '#EDE9FE',
              borderRadius: 16,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#581C87',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Keep Your Account Safe</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Use a strong password, enable 2FA and review your login activity regularly.</div>
            </div>
            <Lock size={22} color="#7C3AED" />
          </div>
        </div>
      )}
    </div>
  );
};
