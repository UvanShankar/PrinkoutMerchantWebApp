import React, { useState } from 'react';
import { useMerchant, SettingsSubTab } from '../context/MerchantContext';
import {
  User,
  Bell,
  Users,
  Printer,
  Link,
  ChevronRight,
  Plus,
  CheckCircle2,
  ExternalLink,
  Radio,
  Clock,
  Smartphone,
  Rocket,
  Info,
  Trash2,
  X,
  CreditCard,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { theme } from '../theme';

export const SettingsScreen: React.FC = () => {
  const {
    settingsTab,
    setSettingsTab,
    showToast,
    logout,
    orders,
    payouts,
    shopData,
    authPhone,
    teamMembers,
    accessActivity,
    addTeamMember,
    removeTeamMember,
    notificationPreferences,
    saveNotificationPreferences,
  } = useMerchant();

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Print Operator');
  const [newMemberAccess, setNewMemberAccess] = useState('Orders, Print Queue');
  const [submittingMember, setSubmittingMember] = useState(false);

  // Preference states (Page 14)
  const [defaultOrderView, setDefaultOrderView] = useState('All Orders');
  const [pageSize, setPageSize] = useState('50');
  const [themePreference, setThemePreference] = useState<'Light' | 'Dark'>('Light');

  const subtabs: { id: SettingsSubTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'team', label: 'Team & Access' },
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
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>{shopData?.ownerName || shopData?.shopName || 'Merchant Owner'}</span>
                    <ChevronRight size={14} color="#8E929B" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#555963' }}>Mobile Number</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>{shopData?.mobile || authPhone || '+91 1212121212'}</span>
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
                  {renderToggle(!!notificationPreferences?.newOrders, () =>
                    saveNotificationPreferences({ ...notificationPreferences, newOrders: !notificationPreferences?.newOrders })
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#1A1C20', fontWeight: 600 }}>Payout Updates</span>
                  {renderToggle(!!notificationPreferences?.payoutUpdates, () =>
                    saveNotificationPreferences({ ...notificationPreferences, payoutUpdates: !notificationPreferences?.payoutUpdates })
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#1A1C20', fontWeight: 600 }}>Prinkout Announcements</span>
                  {renderToggle(!!notificationPreferences?.announcements, () =>
                    saveNotificationPreferences({ ...notificationPreferences, announcements: !notificationPreferences?.announcements })
                  )}
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
                  {teamMembers.slice(0, 2).map((m: any) => (
                    <div key={m.id || m.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                          {(m.name || 'M').charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20' }}>{m.name}</div>
                          <div style={{ fontSize: 10.5, color: '#8E929B' }}>{m.role} • {m.access}</div>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#8E929B" />
                    </div>
                  ))}
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

            {/* 5: Settlement & Fulfilment */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 16,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <CreditCard size={16} color="#7C3AED" />
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>Settlement & Fulfilment</h3>
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Bank payout UPI & store pickup settings.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>UPI Settlement</div>
                    <div style={{ fontSize: 10.5, color: '#8E929B' }}>{shopData?.upiId || 'prinkoutmerchant@okaxis'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                      ✓ Active
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>Fulfilment Mode</div>
                    <div style={{ fontSize: 10.5, color: '#8E929B' }}>{shopData?.fulfilmentMode || 'Store Pickup Only'}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '2px 8px', borderRadius: 12 }}>
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* 6: Partner Support */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 16,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Headphones size={16} color="#7C3AED" />
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1A1C20' }}>Partner Support</h3>
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>Get dedicated assistance from Prinkout Ops.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#555963' }}>Helpline</span>
                  <span style={{ fontWeight: 600, color: '#1A1C20' }}>+91 90877 77488</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EBE7DF' }}>
                  <span style={{ color: '#555963' }}>Support Email</span>
                  <span style={{ fontWeight: 600, color: '#7C3AED' }}>support@prinkout.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#555963' }}>Merchant Portal</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                    Active
                  </span>
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
                  {renderToggle(!!notificationPreferences?.newOrders, () =>
                    saveNotificationPreferences({ ...notificationPreferences, newOrders: !notificationPreferences?.newOrders })
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Order Updates</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Updates on order status (In Progress, Ready to Deliver, Completed).</div>
                  </div>
                  {renderToggle(!!notificationPreferences?.orderUpdates, () =>
                    saveNotificationPreferences({ ...notificationPreferences, orderUpdates: !notificationPreferences?.orderUpdates })
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Payout Updates</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Notifications for settlement, payouts and receipts.</div>
                  </div>
                  {renderToggle(!!notificationPreferences?.payoutUpdates, () =>
                    saveNotificationPreferences({ ...notificationPreferences, payoutUpdates: !notificationPreferences?.payoutUpdates })
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #EBE7DF' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Print Queue Alerts</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Get alerts when print queue is high or delayed.</div>
                  </div>
                  {renderToggle(!!notificationPreferences?.queueAlerts, () =>
                    saveNotificationPreferences({ ...notificationPreferences, queueAlerts: !notificationPreferences?.queueAlerts })
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Announcements</div>
                    <div style={{ fontSize: 11, color: '#8E929B' }}>Product updates, new features and important announcements from Prinkout.</div>
                  </div>
                  {renderToggle(!!notificationPreferences?.announcements, () =>
                    saveNotificationPreferences({ ...notificationPreferences, announcements: !notificationPreferences?.announcements })
                  )}
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
                  onClick={() => saveNotificationPreferences({ ...notificationPreferences, channel: 'inApp' })}
                  style={{
                    padding: '14px',
                    borderRadius: 12,
                    backgroundColor: notificationPreferences?.channel === 'inApp' ? '#EDE9FE' : '#FAF8F5',
                    border: `1.5px solid ${notificationPreferences?.channel === 'inApp' ? '#7C3AED' : '#DAD5CB'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: notificationPreferences?.channel === 'inApp' ? '#7C3AED' : '#FFFFFF', border: '1px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 10 }}>✓</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>In-App</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#555963', lineHeight: 1.3 }}>Receive notifications inside the merchant portal.</p>
                </div>

                <div
                  onClick={() => saveNotificationPreferences({ ...notificationPreferences, channel: 'whatsapp' })}
                  style={{
                    padding: '14px',
                    borderRadius: 12,
                    backgroundColor: notificationPreferences?.channel === 'whatsapp' ? '#EDE9FE' : '#FAF8F5',
                    border: `1.5px solid ${notificationPreferences?.channel === 'whatsapp' ? '#7C3AED' : '#DAD5CB'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: notificationPreferences?.channel === 'whatsapp' ? '#7C3AED' : '#FFFFFF', border: '1px solid #DAD5CB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 10 }}>{notificationPreferences?.channel === 'whatsapp' && '✓'}</div>
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
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>{teamMembers.length}</div>
                  <div style={{ fontSize: 11.5, color: '#6B21A8' }}>Team Members</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} color="#15803D" />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>
                    {teamMembers.filter((m: any) => m.isOwner || m.access?.toLowerCase().includes('full') || m.role?.toLowerCase().includes('admin')).length}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#15803D' }}>Full Access</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <User size={20} color="#B45309" />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1A1C20', lineHeight: 1 }}>
                    {teamMembers.filter((m: any) => !m.isOwner && !m.access?.toLowerCase().includes('full') && !m.role?.toLowerCase().includes('admin')).length}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#B45309' }}>Limited Access</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAddMemberModal(true)}
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
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 16 }}>Manage your team and their access permissions.</p>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ color: '#8E929B', fontSize: 10.5, fontWeight: 700, borderBottom: '1px solid #EBE7DF' }}>
                    <th style={{ padding: '8px 10px' }}>Name</th>
                    <th style={{ padding: '8px 10px' }}>Role & Access</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Last Active</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m: any) => (
                    <tr key={m.id || m.phone} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: m.isOwner ? '#EDE9FE' : '#E0F2FE', color: m.isOwner ? '#6B21A8' : '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                            {(m.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1A1C20' }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: '#8E929B' }}>{m.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 12, backgroundColor: m.isOwner ? '#EDE9FE' : '#F3F4F6', color: m.isOwner ? '#6B21A8' : '#4B5563', fontSize: 11.5, fontWeight: 600 }}>
                          <span>{m.role || 'Staff'}</span>
                          <span style={{ fontSize: 10, opacity: 0.75 }}>• {m.access || 'Limited'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, backgroundColor: '#DCFCE7', color: '#15803D', fontSize: 11, fontWeight: 700 }}>
                          ✓ {m.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{m.time || 'Just now'}</td>
                      <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                        {m.isOwner ? (
                          <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Owner</span>
                        ) : (
                          <button
                            onClick={() => removeTeamMember(m.phone || m.id)}
                            title="Remove team member"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '4px 6px',
                              borderRadius: 6,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
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
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#581C87', marginBottom: 2 }}>Owner / Admin</div>
                  <div style={{ fontSize: 11.5, color: '#6B21A8' }}>Full access to all features, settings, pricing and payments.</div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EBE7DF' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Print Operator</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Can manage incoming orders, print queue and status transitions.</div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EBE7DF' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Cashier / Accounts</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Can manage orders, verify billing payments and view payouts.</div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 12, backgroundColor: '#FAF8F5', border: '1px solid #EBE7DF' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Front Desk / Reception</div>
                  <div style={{ fontSize: 11.5, color: '#555963' }}>Can view received orders and assist customers with pickup.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Access Activity Timeline */}
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
                <p style={{ fontSize: 11.5, color: '#8E929B' }}>Live audit log of team actions on your account.</p>
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20', backgroundColor: '#EFECE4', padding: '5px 12px', borderRadius: 12 }}>
                Audit Log
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
              {accessActivity && accessActivity.length > 0 ? (
                accessActivity.map((a: any, idx: number) => (
                  <div key={a.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #F0ECE4' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#7C3AED' }} />
                      <span style={{ fontWeight: 600, color: '#1A1C20' }}>{a.action}</span>
                    </div>
                    <span style={{ fontSize: 11.5, color: '#8E929B' }}>{a.time}</span>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #F0ECE4' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#15803D' }} />
                    <span style={{ fontWeight: 600, color: '#1A1C20' }}>
                      Account initialized with Admin ({shopData?.mobile || authPhone || '+91 1212121212'})
                    </span>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#8E929B' }}>Initial Setup</span>
                </div>
              )}
            </div>
          </div>

          {/* Add Team Member Modal */}
          {showAddMemberModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 20,
                  padding: '28px 32px',
                  width: 480,
                  maxWidth: '92vw',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  border: '1px solid #EBE7DF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1C20', margin: 0 }}>Add Team Member</h2>
                    <p style={{ fontSize: 12, color: '#8E929B', margin: '4px 0 0 0' }}>Invite staff with role-based permissions.</p>
                  </div>
                  <button
                    onClick={() => setShowAddMemberModal(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8E929B', padding: 4 }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const clean10 = newMemberPhone.replace(/\D/g, '').slice(-10);
                    if (clean10.length !== 10) {
                      showToast('Please enter a valid 10-digit mobile number');
                      return;
                    }
                    if (!newMemberName.trim()) {
                      showToast('Please enter member name');
                      return;
                    }
                    setSubmittingMember(true);
                    try {
                      await addTeamMember({
                        name: newMemberName.trim(),
                        phone: `+91${clean10}`,
                        role: newMemberRole,
                        access: newMemberAccess,
                      });
                      setShowAddMemberModal(false);
                      setNewMemberName('');
                      setNewMemberPhone('');
                    } catch (err) {
                      showToast('Failed to add team member');
                    } finally {
                      setSubmittingMember(false);
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>
                      Full Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid #D1D5DB',
                        fontSize: 13,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>
                      Mobile Number (+91 E.164) <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: 10, overflow: 'hidden' }}>
                      <span style={{ padding: '10px 12px', backgroundColor: '#F3F4F6', fontSize: 13, fontWeight: 600, color: '#374151', borderRight: '1px solid #D1D5DB' }}>
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={newMemberPhone}
                        onChange={e => setNewMemberPhone(e.target.value.replace(/\D/g, ''))}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          border: 'none',
                          fontSize: 13,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>
                      Role & Access Permissions <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      value={newMemberRole}
                      onChange={e => {
                        const r = e.target.value;
                        setNewMemberRole(r);
                        if (r === 'Admin / Store Manager') setNewMemberAccess('Full Access');
                        else if (r === 'Print Operator') setNewMemberAccess('Orders, Print Queue');
                        else if (r === 'Cashier / Accounts') setNewMemberAccess('Orders, Payouts, Reports');
                        else if (r === 'Front Desk / Reception') setNewMemberAccess('Orders Only');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid #D1D5DB',
                        fontSize: 13,
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Print Operator">Print Operator (Orders & Print Queue)</option>
                      <option value="Admin / Store Manager">Admin / Store Manager (Full Access)</option>
                      <option value="Cashier / Accounts">Cashier / Accounts (Orders, Payouts, Reports)</option>
                      <option value="Front Desk / Reception">Front Desk / Reception (Orders Only)</option>
                    </select>
                    <div style={{ marginTop: 6, fontSize: 11, color: '#6B7280' }}>
                      Access granted: <strong style={{ color: '#7C3AED' }}>{newMemberAccess}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowAddMemberModal(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 10,
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingMember}
                      style={{
                        flex: 1.5,
                        padding: '10px',
                        borderRadius: 10,
                        border: 'none',
                        backgroundColor: '#7C3AED',
                        color: '#FFFFFF',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: submittingMember ? 'not-allowed' : 'pointer',
                        opacity: submittingMember ? 0.7 : 1,
                      }}
                    >
                      {submittingMember ? 'Adding...' : 'Add Member'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
