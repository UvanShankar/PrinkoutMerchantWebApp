import React, { useState } from 'react';
import { useMerchant, SettingsSubTab } from '../context/MerchantContext';
import {
  Settings,
  Bell,
  Users,
  Printer,
  Link,
  Shield,
  Palette,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Key,
  Smartphone,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { theme } from '../theme';

export const SettingsScreen: React.FC = () => {
  const { settingsTab, setSettingsTab, showToast, logout } = useMerchant();

  // Notifications State (Page 15)
  const [orderChime, setOrderChime] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  // Team State (Page 16)
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Sabarish K', role: 'Owner & Admin', phone: '+91 98765 43210', status: 'Active' },
    { id: '2', name: 'Murugan P', role: 'Print Operator', phone: '+91 98765 43211', status: 'Active' },
    { id: '3', name: 'Suresh R', role: 'Delivery Associate', phone: '+91 98765 43212', status: 'Active' },
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Print Operator');

  // Security State (Page 18)
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    setTeamMembers(prev => [
      ...prev,
      { id: Date.now().toString(), name: newMemberName, role: newMemberRole, phone: '+91 98400 00000', status: 'Active' },
    ]);
    setNewMemberName('');
    setShowInviteModal(false);
    showToast(`Staff member ${newMemberName} added`);
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#F4F2EC', marginBottom: 4 }}>
          Settings & Integrations
        </h1>
        <p style={{ fontSize: 13, color: theme.colors.textMuted }}>
          Manage your notifications, team permissions, payment gateway, and security.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, borderBottom: `1px solid ${theme.colors.border}`, marginBottom: 24, overflowX: 'auto' }}>
        {[
          { id: 'general', label: 'Settings Hub (Page 14)', icon: Settings },
          { id: 'notifications', label: 'Notifications (Page 15)', icon: Bell },
          { id: 'team', label: 'Team & Access (Page 16)', icon: Users },
          { id: 'integrations', label: 'Integrations (Page 17)', icon: Link },
          { id: 'security', label: 'Security & 2FA (Page 18)', icon: Shield },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = settingsTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${theme.colors.primaryLight}` : '2px solid transparent',
                color: isActive ? '#FFFFFF' : theme.colors.textMuted,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* General Settings Hub Grid (Page 14) */}
      {settingsTab === 'general' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { id: 'notifications', title: 'Notifications', desc: 'Order alerts, sound chimes & SMS', icon: Bell, color: '#2563EB' },
            { id: 'team', title: 'Team & Staff Access', desc: 'Manage 3 operators and delivery staff', icon: Users, color: '#10B981' },
            { id: 'integrations', title: 'Payment & API Integrations', desc: 'Razorpay, WhatsApp Business & Google Drive', icon: Link, color: '#8B5CF6' },
            { id: 'security', title: 'Security & 2-Factor Auth', desc: 'Two-factor login, sessions & audit log', icon: Shield, color: '#EF4444' },
            { id: 'printer', title: 'Printer & Production Devices', desc: 'Canon, HP & Epson network drivers', icon: Printer, color: '#F59E0B' },
            { id: 'theme', title: 'Theme & Display', desc: 'Modern Dark Merchant UI (Default)', icon: Palette, color: '#06B6D4' },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => {
                  if (card.id === 'notifications' || card.id === 'team' || card.id === 'integrations' || card.id === 'security') {
                    setSettingsTab(card.id as any);
                  } else {
                    showToast(`${card.title} settings opened`);
                  }
                }}
                style={{
                  backgroundColor: '#161820',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: 14,
                  padding: '22px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#1B1F2B';
                  e.currentTarget.style.borderColor = '#374151';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#161820';
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              >
                <div style={{ display: 'flex', gap: 14 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      backgroundColor: `${card.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} color={card.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>{card.title}</div>
                    <div style={{ fontSize: 13, color: theme.colors.textDim, lineHeight: 1.4 }}>{card.desc}</div>
                  </div>
                </div>
                <ChevronRight size={18} color={theme.colors.textDim} />
              </div>
            );
          })}
        </div>
      )}

      {/* Notifications Tab (Page 15) */}
      {settingsTab === 'notifications' && (
        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '24px 28px' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
            Notification Channels & Sound Alerts
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111319', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Loud Audio Chime on New Orders</div>
                <div style={{ fontSize: 12, color: theme.colors.textDim }}>Plays recurring alert until operator accepts order</div>
              </div>
              <button onClick={() => setOrderChime(!orderChime)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: orderChime ? '#10B981' : theme.colors.textDim }}>
                {orderChime ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111319', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>WhatsApp Pickup Alerts to Customers</div>
                <div style={{ fontSize: 12, color: theme.colors.textDim }}>Auto-send message when print is marked "Ready for Pickup"</div>
              </div>
              <button onClick={() => setWhatsappAlerts(!whatsappAlerts)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: whatsappAlerts ? '#10B981' : theme.colors.textDim }}>
                {whatsappAlerts ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111319', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Daily Settlement Email Digest</div>
                <div style={{ fontSize: 12, color: theme.colors.textDim }}>Detailed PDF statement of daily orders and net bank transfer</div>
              </div>
              <button onClick={() => setEmailDigest(!emailDigest)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: emailDigest ? '#10B981' : theme.colors.textDim }}>
                {emailDigest ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team & Access Tab (Page 16) */}
      {settingsTab === 'team' && (
        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>Shop Operators & Staff</h2>
              <span style={{ fontSize: 12, color: theme.colors.textDim }}>Assign roles to restrict pricing and payout access</span>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Add Staff Member</span>
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: 20 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.colors.borderLight}`, color: theme.colors.textDim, fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Name</th>
                <th style={{ padding: '10px 14px' }}>Role</th>
                <th style={{ padding: '10px 14px' }}>Phone</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member.id} style={{ borderBottom: `1px solid ${theme.colors.border}`, fontSize: 13 }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#FFFFFF' }}>{member.name}</td>
                  <td style={{ padding: '12px 14px', color: '#93C5FD' }}>{member.role}</td>
                  <td style={{ padding: '12px 14px', color: theme.colors.textMuted }}>{member.phone}</td>
                  <td style={{ padding: '12px 14px', color: '#10B981', fontWeight: 600 }}>● {member.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {showInviteModal && (
            <div style={{ padding: '16px', backgroundColor: '#111319', borderRadius: 10, border: `1px solid ${theme.colors.borderLight}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>Invite New Staff Member</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Staff Name"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 6, backgroundColor: '#181A22', border: `1px solid ${theme.colors.borderLight}`, color: '#FFFFFF' }}
                />
                <select
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: '#181A22', border: `1px solid ${theme.colors.borderLight}`, color: '#FFFFFF' }}
                >
                  <option value="Print Operator">Print Operator</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Delivery Associate">Delivery Associate</option>
                </select>
                <button
                  onClick={handleAddMember}
                  style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Integrations Tab (Page 17) */}
      {settingsTab === 'integrations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={{ padding: '20px 24px', backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Razorpay Payment Gateway</div>
              <span style={{ padding: '3px 8px', borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: 11, fontWeight: 700 }}>
                CONNECTED
              </span>
            </div>
            <p style={{ fontSize: 13, color: theme.colors.textMuted, lineHeight: 1.5, marginBottom: 14 }}>
              Handles UPI, Google Pay, PhonePe, Paytm, and credit card payments directly into your account.
            </p>
            <div style={{ fontSize: 12, color: theme.colors.textDim }}>Merchant Key: rzp_live_••••4821</div>
          </div>

          <div style={{ padding: '20px 24px', backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>WhatsApp Business Cloud</div>
              <span style={{ padding: '3px 8px', borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: 11, fontWeight: 700 }}>
                ACTIVE
              </span>
            </div>
            <p style={{ fontSize: 13, color: theme.colors.textMuted, lineHeight: 1.5, marginBottom: 14 }}>
              Automatic message alerts to customer phones when prints are ready for pickup.
            </p>
            <div style={{ fontSize: 12, color: theme.colors.textDim }}>Sender: +91 98765 43210 (Verified)</div>
          </div>
        </div>
      )}

      {/* Security Tab (Page 18) */}
      {settingsTab === 'security' && (
        <div style={{ backgroundColor: '#161820', border: `1px solid ${theme.colors.border}`, borderRadius: 14, padding: '24px 28px' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
            Security & Authentication
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#111319', borderRadius: 8, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Two-Factor Authentication (2FA)</div>
              <div style={{ fontSize: 12, color: theme.colors.textDim }}>Requires mobile OTP code on every new desktop login</div>
            </div>
            <button onClick={() => setTwoFactorAuth(!twoFactorAuth)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: twoFactorAuth ? '#10B981' : theme.colors.textDim }}>
              {twoFactorAuth ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          <div style={{ padding: '14px 16px', backgroundColor: '#111319', borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>Active Desktop Sessions</div>
            <div style={{ fontSize: 12, color: theme.colors.textMuted, marginBottom: 12 }}>
              MacBook Pro • Electron Desktop App • Valipalayam, Tiruppur (Current Device)
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => showToast('All other sessions revoked')}
                style={{ padding: '8px 14px', backgroundColor: '#1E222D', border: `1px solid ${theme.colors.borderLight}`, color: '#E5E7EB', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Revoke Other Sessions
              </button>
              <button
                onClick={logout}
                style={{ padding: '8px 14px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Sign Out of This Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
