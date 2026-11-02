import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';
import {
  Tag,
  Check,
  Save,
  Plus,
  ToggleLeft,
  ToggleRight,
  Layers,
  Image,
  Flag,
  Shirt,
  Mail,
  Package,
  Clock,
  Truck,
  IndianRupee,
} from 'lucide-react';
import { theme } from '../theme';

export const PricingServicesScreen: React.FC = () => {
  const { pricingItems, togglePricingItemActive, updatePricingValue, showToast } = useMerchant();

  // Tabs: ONLY 'my-services' and 'templates'. BULK UPDATE EXPLICITLY OMITTED AS REQUESTED!
  const [activeTab, setActiveTab] = useState<'services' | 'templates'>('services');
  const [activeCategory, setActiveCategory] = useState('Standard Prints');

  // Service fulfillment settings
  const [turnaroundTime, setTurnaroundTime] = useState('30 mins');
  const [minOrderValue, setMinOrderValue] = useState('20');
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);

  const categories = [
    { name: 'Standard Prints', icon: Layers },
    { name: 'Posters', icon: Image },
    { name: 'Flex & Banners', icon: Flag },
    { name: 'T-Shirts', icon: Shirt },
    { name: 'Invitations', icon: Mail },
    { name: 'Packaging', icon: Package },
  ];

  const handleSaveAll = () => {
    showToast('Pricing & service settings successfully updated!');
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 400, color: '#F4F2EC', marginBottom: 4 }}>
            Pricing & Services
          </h1>
          <p style={{ fontSize: 13, color: theme.colors.textMuted }}>
            Configure your catalog, paper GSM options, per-page rates, and fulfillment modes.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
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

      {/* Tabs Header - BULK UPDATE IS EXCLUDED */}
      <div style={{ display: 'flex', gap: 12, borderBottom: `1px solid ${theme.colors.border}`, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '10px 18px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'services' ? `2px solid ${theme.colors.primaryLight}` : '2px solid transparent',
            color: activeTab === 'services' ? '#FFFFFF' : theme.colors.textMuted,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          My Services & Price List
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          style={{
            padding: '10px 18px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'templates' ? `2px solid ${theme.colors.primaryLight}` : '2px solid transparent',
            color: activeTab === 'templates' ? '#FFFFFF' : theme.colors.textMuted,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Price List Templates
        </button>
      </div>

      {activeTab === 'templates' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 28 }}>
          {[
            { title: 'Standard Xerox & College Rate Card', desc: 'Optimized for campus shops: A4 B&W ₹1.50, Colour ₹5.00', active: true },
            { title: 'Commercial Corporate Print Rates', desc: 'Standard business stationery and proposal reports', active: false },
            { title: 'Architectural & Blueprints Heavy', desc: 'Specialized for A0, A1, A2 engineering sheets', active: false },
          ].map((tmpl, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#161820',
                border: `1.5px solid ${tmpl.active ? theme.colors.primaryLight : theme.colors.borderLight}`,
                borderRadius: 12,
                padding: '20px 22px',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>{tmpl.title}</div>
              <div style={{ fontSize: 13, color: theme.colors.textMuted, lineHeight: 1.5, marginBottom: 18 }}>{tmpl.desc}</div>
              <button
                onClick={() => showToast(`Applied ${tmpl.title} template`)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  backgroundColor: tmpl.active ? '#2563EB' : '#1F2432',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tmpl.active ? 'Currently Active' : 'Apply Template'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Category Selector Row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => {
              const isSelected = activeCategory === cat.name;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 16px',
                    borderRadius: 8,
                    backgroundColor: isSelected ? '#2563EB' : '#161820',
                    border: `1px solid ${isSelected ? '#2563EB' : theme.colors.border}`,
                    color: isSelected ? '#FFFFFF' : theme.colors.textMuted,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={16} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Pricing Table matching Page 10 */}
          <div
            style={{
              backgroundColor: '#161820',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 14,
              overflow: 'hidden',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                padding: '16px 22px',
                borderBottom: `1px solid ${theme.colors.borderLight}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                  {activeCategory} Rate Card
                </h2>
                <span style={{ fontSize: 12, color: theme.colors.textDim }}>
                  Individual per-unit prices applied to online customer file uploads.
                </span>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#13151D', borderBottom: `1px solid ${theme.colors.borderLight}`, color: theme.colors.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 18px' }}>Paper Size</th>
                  <th style={{ padding: '12px 18px' }}>GSM / Texture</th>
                  <th style={{ padding: '12px 18px' }}>B&W Rate (₹)</th>
                  <th style={{ padding: '12px 18px' }}>Colour Rate (₹)</th>
                  <th style={{ padding: '12px 18px' }}>Single Side</th>
                  <th style={{ padding: '12px 18px' }}>Double Side</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>Active</th>
                </tr>
              </thead>
              <tbody>
                {pricingItems.map(item => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: `1px solid ${theme.colors.border}`,
                      fontSize: 13,
                      opacity: item.active ? 1 : 0.5,
                    }}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#FFFFFF' }}>{item.size}</td>
                    <td style={{ padding: '14px 18px', color: theme.colors.textLight }}>
                      {item.gsm} <span style={{ color: theme.colors.textDim }}>({item.type})</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: theme.colors.textDim }}>₹</span>
                        <input
                          type="text"
                          value={item.bwPrice}
                          onChange={e => updatePricingValue(item.id, 'bwPrice', e.target.value)}
                          style={{
                            width: 65,
                            padding: '4px 8px',
                            backgroundColor: '#101217',
                            border: `1px solid ${theme.colors.borderLight}`,
                            borderRadius: 6,
                            color: '#FFFFFF',
                            fontSize: 13,
                            outline: 'none',
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: theme.colors.textDim }}>₹</span>
                        <input
                          type="text"
                          value={item.colorPrice}
                          onChange={e => updatePricingValue(item.id, 'colorPrice', e.target.value)}
                          style={{
                            width: 65,
                            padding: '4px 8px',
                            backgroundColor: '#101217',
                            border: `1px solid ${theme.colors.borderLight}`,
                            borderRadius: 6,
                            color: '#FFFFFF',
                            fontSize: 13,
                            outline: 'none',
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: item.singleSide ? '#10B981' : theme.colors.textDim, fontWeight: 600 }}>
                        {item.singleSide ? '✓ Enabled' : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: item.doubleSide ? '#10B981' : theme.colors.textDim, fontWeight: 600 }}>
                        {item.doubleSide ? '✓ Enabled' : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => togglePricingItemActive(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: item.active ? '#10B981' : theme.colors.textDim,
                        }}
                      >
                        {item.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Service Settings Card matching Page 10 */}
          <div
            style={{
              backgroundColor: '#161820',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 14,
              padding: '24px 28px',
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
              Service & Fulfillment Settings
            </h2>
            <p style={{ fontSize: 12, color: theme.colors.textDim, marginBottom: 20 }}>
              Adjust timing guarantees and delivery availability for your shop.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              {/* Turnaround Time */}
              <div style={{ padding: '16px', borderRadius: 10, backgroundColor: '#111319', border: `1px solid ${theme.colors.borderLight}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Clock size={16} color={theme.colors.primaryLight} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Est. Turnaround Time</span>
                </div>
                <input
                  type="text"
                  value={turnaroundTime}
                  onChange={e => setTurnaroundTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: '#181A22',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Minimum Order Value */}
              <div style={{ padding: '16px', borderRadius: 10, backgroundColor: '#111319', border: `1px solid ${theme.colors.borderLight}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <IndianRupee size={16} color="#10B981" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Minimum Order Value</span>
                </div>
                <input
                  type="text"
                  value={minOrderValue}
                  onChange={e => setMinOrderValue(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: '#181A22',
                    border: `1px solid ${theme.colors.borderLight}`,
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Fulfillment Options */}
              <div style={{ padding: '16px', borderRadius: 10, backgroundColor: '#111319', border: `1px solid ${theme.colors.borderLight}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Truck size={16} color="#F59E0B" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Fulfillment Channels</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setPickupEnabled(!pickupEnabled)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: 6,
                      backgroundColor: pickupEnabled ? 'rgba(16, 185, 129, 0.15)' : '#181A22',
                      border: `1px solid ${pickupEnabled ? '#10B981' : theme.colors.borderLight}`,
                      color: pickupEnabled ? '#34D399' : theme.colors.textDim,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Pickup: {pickupEnabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: 6,
                      backgroundColor: deliveryEnabled ? 'rgba(37, 99, 235, 0.15)' : '#181A22',
                      border: `1px solid ${deliveryEnabled ? '#2563EB' : theme.colors.borderLight}`,
                      color: deliveryEnabled ? '#60A5FA' : theme.colors.textDim,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delivery: {deliveryEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
