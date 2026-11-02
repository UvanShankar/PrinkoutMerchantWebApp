import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle,
  Smartphone,
  Save,
  Star,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { theme } from '../theme';

export const ShopProfileScreen: React.FC = () => {
  const { shopData, setShopData, shopStatus, toggleShopStatus, showToast } = useMerchant();
  const [activeTab, setActiveTab] = useState<'details' | 'hours' | 'documents' | 'preview'>('details');

  const [form, setForm] = useState({
    shopName: shopData.shopName || 'Sabarish Prints',
    ownerName: shopData.ownerName || 'Sabarish K',
    mobile: shopData.mobile || '+91 98765 43210',
    email: shopData.email || 'sabarish@prinkout.com',
    address: shopData.address || '88, Kumaran Rd, Opp. Town Hall, Kannipiran Colony, Valipalayam',
    area: shopData.area || 'Valipalayam',
    city: shopData.city || 'Tiruppur',
    pincode: shopData.pincode || '641601',
    rating: shopData.rating || 4.9,
    reviewsCount: shopData.reviewsCount || 128,
  });

  const handleSave = () => {
    setShopData((prev: any) => ({ ...prev, ...form }));
    showToast('Shop profile updated successfully');
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#F4F2EC', marginBottom: 4 }}>
            Shop Profile & Public Listing
          </h1>
          <p style={{ fontSize: 13, color: theme.colors.textMuted }}>
            Manage how your shop appears to nearby customers searching on the Prinkout mobile app.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          }}
        >
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, borderBottom: `1px solid ${theme.colors.border}`, marginBottom: 24 }}>
        {[
          { id: 'details', label: 'Shop Details' },
          { id: 'hours', label: 'Operating Hours' },
          { id: 'documents', label: 'Documents & Verification' },
          { id: 'preview', label: 'Customer Mobile Preview' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.primaryLight}` : '2px solid transparent',
              color: activeTab === tab.id ? '#FFFFFF' : theme.colors.textMuted,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shop Banner & Top Card */}
      <div
        style={{
          backgroundColor: '#161820',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            height: 120,
            backgroundImage: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: -30,
              left: 28,
              width: 72,
              height: 72,
              borderRadius: 16,
              backgroundColor: '#2563EB',
              border: '3px solid #161820',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            }}
          >
            <Store size={36} color="#FFFFFF" />
          </div>
        </div>

        <div style={{ padding: '40px 28px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>{form.shopName}</h2>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                ✓ VERIFIED SHOP
              </span>
            </div>
            <div style={{ fontSize: 13, color: theme.colors.textDim, marginTop: 4 }}>
              {form.address}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <Star size={16} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>{form.rating}</span>
                <span style={{ fontSize: 13, color: theme.colors.textDim }}>({form.reviewsCount} reviews)</span>
              </div>
              <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Top Rated in Tiruppur</div>
            </div>

            <button
              onClick={toggleShopStatus}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                backgroundColor: shopStatus === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                border: `1px solid ${shopStatus === 'active' ? '#10B981' : '#F59E0B'}`,
                color: shopStatus === 'active' ? '#34D399' : '#FBBF24',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ● {shopStatus === 'active' ? 'Shop Active (Online)' : 'Shop Away (Paused)'}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'details' && (
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '24px 28px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
                Shop Name
              </label>
              <input
                type="text"
                value={form.shopName}
                onChange={e => setForm({ ...form, shopName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                  color: '#FFFFFF',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
                Proprietor / Owner Name
              </label>
              <input
                type="text"
                value={form.ownerName}
                onChange={e => setForm({ ...form, ownerName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                  color: '#FFFFFF',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
                Contact Phone
              </label>
              <input
                type="text"
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                  color: '#FFFFFF',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                  color: '#FFFFFF',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
              Complete Street Address
            </label>
            <textarea
              rows={2}
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: '#111319',
                border: `1px solid ${theme.colors.borderLight}`,
                color: '#FFFFFF',
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
                Area
              </label>
              <input
                type="text"
                value={form.area}
                onChange={e => setForm({ ...form, area: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                  color: '#FFFFFF',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
                City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                  color: '#FFFFFF',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.textLight, marginBottom: 6 }}>
                Pincode
              </label>
              <input
                type="text"
                value={form.pincode}
                onChange={e => setForm({ ...form, pincode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                  color: '#FFFFFF',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hours' && (
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '24px 28px',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
            Weekly Operating Schedule
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { day: 'Monday', hours: '09:00 AM - 09:00 PM', open: true },
              { day: 'Tuesday', hours: '09:00 AM - 09:00 PM', open: true },
              { day: 'Wednesday', hours: '09:00 AM - 09:00 PM', open: true },
              { day: 'Thursday', hours: '09:00 AM - 09:00 PM', open: true },
              { day: 'Friday', hours: '09:00 AM - 09:00 PM', open: true },
              { day: 'Saturday', hours: '09:00 AM - 09:00 PM', open: true },
              { day: 'Sunday', hours: '10:00 AM - 06:00 PM', open: true },
            ].map(item => (
              <div
                key={item.day}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 8,
                  backgroundColor: '#111319',
                  border: `1px solid ${theme.colors.borderLight}`,
                }}
              >
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.day}</span>
                <span style={{ color: theme.colors.textMuted }}>{item.hours}</span>
                <span style={{ color: '#10B981', fontWeight: 600, fontSize: 12 }}>● Open</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div
          style={{
            backgroundColor: '#161820',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: '24px 28px',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
            Merchant Compliance Documents
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div style={{ padding: '16px', borderRadius: 10, backgroundColor: '#111319', border: `1px solid ${theme.colors.borderLight}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>GST Certificate</span>
                <span style={{ color: '#10B981', fontSize: 11, fontWeight: 700 }}>VERIFIED</span>
              </div>
              <div style={{ fontSize: 12, color: theme.colors.textDim, marginBottom: 12 }}>33AABCU9603R1ZM</div>
              <button
                onClick={() => showToast('Opening GST Document certificate')}
                style={{ padding: '6px 12px', borderRadius: 6, backgroundColor: '#1E2332', border: 'none', color: '#60A5FA', fontSize: 12, cursor: 'pointer' }}
              >
                View Document
              </button>
            </div>

            <div style={{ padding: '16px', borderRadius: 10, backgroundColor: '#111319', border: `1px solid ${theme.colors.borderLight}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Shop & Establishment License</span>
                <span style={{ color: '#10B981', fontSize: 11, fontWeight: 700 }}>VERIFIED</span>
              </div>
              <div style={{ fontSize: 12, color: theme.colors.textDim, marginBottom: 12 }}>TN/TPR/SHOP/2021/8812</div>
              <button
                onClick={() => showToast('Opening License Document')}
                style={{ padding: '6px 12px', borderRadius: 6, backgroundColor: '#1E2332', border: 'none', color: '#60A5FA', fontSize: 12, cursor: 'pointer' }}
              >
                View Document
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* Customer Mobile Mockup matching Page 13 */}
          <div
            style={{
              width: 360,
              backgroundColor: '#000000',
              borderRadius: 36,
              border: '8px solid #262934',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
            }}
          >
            {/* Phone Top Notch */}
            <div style={{ height: 24, backgroundColor: '#000000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 100, height: 14, backgroundColor: '#1B1E28', borderRadius: '0 0 10px 10px' }} />
            </div>

            <div style={{ padding: 16, backgroundColor: '#111215', color: '#FFFFFF' }}>
              <div style={{ height: 110, borderRadius: 12, backgroundColor: '#2563EB', padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 14 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{form.shopName}</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>{form.area}, {form.city}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 14 }}>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {form.rating} (128 reviews)</span>
                <span style={{ color: '#10B981' }}>● Open Now</span>
                <span style={{ color: '#9CA3AF' }}>0.5 km away</span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Available Services</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {['Standard Prints', 'Posters', 'Spiral Binding', 'Flex Banners'].map(s => (
                  <span key={s} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 12, backgroundColor: '#1F2432', color: '#93C5FD' }}>
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ padding: '12px', borderRadius: 10, backgroundColor: '#1A1D26', fontSize: 12, marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>A4 Black & White</div>
                <div style={{ color: '#10B981', fontWeight: 700 }}>₹ 1.50 / page</div>
              </div>

              <div style={{ padding: '10px', borderRadius: 8, backgroundColor: '#2563EB', textAlign: 'center', fontWeight: 700, fontSize: 13 }}>
                Upload Files & Order Print
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
