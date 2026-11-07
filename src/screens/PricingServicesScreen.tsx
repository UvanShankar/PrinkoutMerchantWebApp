import React, { useState, useEffect } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { merchantApi } from '../services/api';
import {
  Layers,
  Image as ImageIcon,
  Tv,
  Shirt,
  Mail,
  Box,
  Plus,
  Edit2,
  Clock,
  Coins,
  Store,
  Info,
  Check,
} from 'lucide-react';
import { theme } from '../theme';

export const PricingServicesScreen: React.FC = () => {
  const { shopId, shopData, showToast, refreshData } = useMerchant();
  const [activeTab, setActiveTab] = useState<'services' | 'templates'>('services');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('standard');
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pricingRows, setPricingRows] = useState([
    { id: '1', size: 'A4', paperType: '70 GSM Plain', bwPrice: '0.48', colPrice: '1.45', enabled: true },
    { id: '2', size: 'A4', paperType: '100 GSM Glossy', bwPrice: '4', colPrice: '10', enabled: true },
    { id: '3', size: 'A3', paperType: '100 GSM Plain', bwPrice: '6', colPrice: '15', enabled: true },
    { id: '4', size: 'A0', paperType: '180 GSM Heavy', bwPrice: '40', colPrice: '80', enabled: true },
  ]);

  useEffect(() => {
    if (shopData) {
      const combos = shopData.pricingCombinations || [];
      const a4bw = combos.find((c: any) => c.paperSize === 'A4' && c.printMode?.toLowerCase().includes('b') && c.paperTexture?.toLowerCase().includes('plain'))?.pricePerUnit ?? shopData.bwPrice ?? 0.48;
      const a4col = combos.find((c: any) => c.paperSize === 'A4' && c.printMode?.toLowerCase().includes('color') && c.paperTexture?.toLowerCase().includes('plain'))?.pricePerUnit ?? shopData.colorPrice ?? 1.45;
      const a4glossyBw = combos.find((c: any) => c.paperSize === 'A4' && c.printMode?.toLowerCase().includes('b') && c.paperTexture?.toLowerCase().includes('glossy'))?.pricePerUnit ?? 4;
      const a4glossyCol = combos.find((c: any) => c.paperSize === 'A4' && c.printMode?.toLowerCase().includes('color') && c.paperTexture?.toLowerCase().includes('glossy'))?.pricePerUnit ?? 10;
      const a3bw = combos.find((c: any) => c.paperSize === 'A3' && c.printMode?.toLowerCase().includes('b'))?.pricePerUnit ?? 6;
      const a3col = combos.find((c: any) => c.paperSize === 'A3' && c.printMode?.toLowerCase().includes('color'))?.pricePerUnit ?? 15;
      const a0bw = combos.find((c: any) => c.paperSize === 'A0' && c.printMode?.toLowerCase().includes('b'))?.pricePerUnit ?? 40;
      const a0col = combos.find((c: any) => c.paperSize === 'A0' && c.printMode?.toLowerCase().includes('color'))?.pricePerUnit ?? 80;

      setPricingRows([
        { id: '1', size: 'A4', paperType: '70 GSM Plain', bwPrice: String(a4bw), colPrice: String(a4col), enabled: true },
        { id: '2', size: 'A4', paperType: '100 GSM Glossy', bwPrice: String(a4glossyBw), colPrice: String(a4glossyCol), enabled: true },
        { id: '3', size: 'A3', paperType: '100 GSM Plain', bwPrice: String(a3bw), colPrice: String(a3col), enabled: true },
        { id: '4', size: 'A0', paperType: '180 GSM Heavy', bwPrice: String(a0bw), colPrice: String(a0col), enabled: true },
      ]);
    }
  }, [shopData]);

  const [estimatedTime, setEstimatedTime] = useState('2 - 4 Hours');
  const [minOrderValue, setMinOrderValue] = useState('100');

  const toggleRowEnabled = async (id: string) => {
    const updated = pricingRows.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setPricingRows(updated);
    showToast('Pricing status updated');
  };

  const handleSavePricing = async () => {
    if (!shopId) {
      showToast('No active shop found');
      return;
    }
    setSaving(true);
    try {
      const updatedCombos = [
        { paperSize: 'A4', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: parseFloat(pricingRows[0]?.bwPrice || '0.48') },
        { paperSize: 'A4', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: parseFloat(pricingRows[0]?.colPrice || '1.45') },
        { paperSize: 'A4', paperTexture: 'Glossy', printMode: 'Black_&_White', pricePerUnit: parseFloat(pricingRows[1]?.bwPrice || '4') },
        { paperSize: 'A4', paperTexture: 'Glossy', printMode: 'Color', pricePerUnit: parseFloat(pricingRows[1]?.colPrice || '10') },
        { paperSize: 'A3', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: parseFloat(pricingRows[2]?.bwPrice || '6') },
        { paperSize: 'A3', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: parseFloat(pricingRows[2]?.colPrice || '15') },
        { paperSize: 'A0', paperTexture: 'Plain', printMode: 'Black_&_White', pricePerUnit: parseFloat(pricingRows[3]?.bwPrice || '40') },
        { paperSize: 'A0', paperTexture: 'Plain', printMode: 'Color', pricePerUnit: parseFloat(pricingRows[3]?.colPrice || '80') },
      ];

      await merchantApi.updateShopProfile(shopId, {
        pricingCombinations: updatedCombos,
        bwPrice: parseFloat(pricingRows[0]?.bwPrice || '0.48'),
        colorPrice: parseFloat(pricingRows[0]?.colPrice || '1.45'),
      });

      await refreshData();
      showToast('Pricing saved and synchronized with customer app!');
      setIsEditing(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  const servicesList = [
    { id: 'standard', name: 'Standard Prints', desc: 'A4, A3, A0', icon: Layers, active: true, disabled: false },
    { id: 'posters', name: 'Posters', desc: 'Custom sizes', icon: ImageIcon, disabled: true },
    { id: 'banners', name: 'Banners & Flex', desc: 'Indoor / Outdoor', icon: Tv, disabled: true },
    { id: 'tshirt', name: 'T-shirt Printing', desc: 'DTF / Vinyl / Screen', icon: Shirt, disabled: true },
    { id: 'invitations', name: 'Invitations', desc: 'Laser / Premium', icon: Mail, disabled: true },
    { id: 'packaging', name: 'Packaging', desc: 'Boxes / Labels', icon: Box, disabled: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Header Card */}
      <div
        style={{
          backgroundColor: theme.colors.creamCard,
          border: `1px solid ${theme.colors.creamCardBorder}`,
          borderRadius: 18,
          padding: '20px 22px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          {/* Tabs matching PDF */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#EFECE4', padding: 4, borderRadius: 22 }}>
            <button
              onClick={() => setActiveTab('services')}
              style={{
                padding: '6px 16px',
                borderRadius: 18,
                border: 'none',
                backgroundColor: activeTab === 'services' ? '#1C1D21' : 'transparent',
                color: activeTab === 'services' ? '#FFFFFF' : '#6B707B',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              My Services
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              style={{
                padding: '6px 16px',
                borderRadius: 18,
                border: 'none',
                backgroundColor: activeTab === 'templates' ? '#1C1D21' : 'transparent',
                color: activeTab === 'templates' ? '#FFFFFF' : '#6B707B',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Price List Templates
            </button>
          </div>

          <button
            onClick={() => showToast('Add Service dialog')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 20,
              backgroundColor: '#1C1D21',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>Add Service</span>
          </button>
        </div>

        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>Your Services</h2>
          <p style={{ fontSize: 12, color: '#6B707B', marginBottom: 16 }}>
            Add, edit, or disable the print services you offer on Prinkout.
          </p>
        </div>

        {/* Horizontal Service Cards matching PDF */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {servicesList.map(srv => {
            const isSelected = selectedServiceId === srv.id;
            const isDisabled = !!srv.disabled;
            const isHovered = hoveredServiceId === srv.id;
            const Icon = srv.icon;

            return (
              <div
                key={srv.id}
                onClick={() => {
                  if (isDisabled) {
                    showToast(`${srv.name} is coming soon!`);
                    return;
                  }
                  setSelectedServiceId(srv.id);
                }}
                onMouseEnter={() => setHoveredServiceId(srv.id)}
                onMouseLeave={() => setHoveredServiceId(null)}
                title={isDisabled ? `${srv.name} - Coming Soon` : undefined}
                style={{
                  backgroundColor: isDisabled ? '#F9F8F5' : '#FFFFFF',
                  border: `1.5px solid ${isSelected && !isDisabled ? '#1C1D21' : isDisabled ? '#E5E1D8' : '#E8E4DA'}`,
                  borderRadius: 14,
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.65 : 1,
                  transition: 'all 0.15s ease',
                  boxShadow: isDisabled ? 'none' : '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                {/* Coming Soon floating tooltip on hover */}
                {isDisabled && isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#1C1D21',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 9px',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                      zIndex: 30,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                      pointerEvents: 'none',
                      letterSpacing: '0.2px',
                    }}
                  >
                    Coming Soon
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderWidth: '4px',
                        borderStyle: 'solid',
                        borderColor: '#1C1D21 transparent transparent transparent',
                      }}
                    />
                  </div>
                )}

                {/* Check badge on active service */}
                {isSelected && !isDisabled && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#1C1D21',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}

                {/* Coming Soon tag */}
                {isDisabled && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      fontSize: 9,
                      fontWeight: 700,
                      backgroundColor: '#EBE7DF',
                      color: '#8E929B',
                      padding: '1px 5px',
                      borderRadius: 8,
                      letterSpacing: '0.2px',
                    }}
                  >
                    Soon
                  </span>
                )}

                <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Icon size={22} color={isDisabled ? '#8E929B' : '#1A1C20'} />
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: isDisabled ? '#6B707B' : '#1A1C20', marginBottom: 2, lineHeight: 1.2 }}>
                  {srv.name}
                </div>
                <div style={{ fontSize: 10.5, color: isDisabled ? '#A0A4AE' : '#8E929B' }}>{srv.desc}</div>
              </div>
            );
          })}

          {/* Add More card */}
          <div
            onClick={() => showToast('Add new service category')}
            style={{
              backgroundColor: 'transparent',
              border: '1.5px dashed #DAD5CB',
              borderRadius: 14,
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              color: '#8E929B',
            }}
          >
            <Plus size={20} style={{ marginBottom: 6 }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Add More</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Standard Prints — Pricing & Service Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16 }}>
        {/* Left Pricing Table Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '20px 22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 2 }}>
                Standard Prints – Pricing
              </h3>
              <p style={{ fontSize: 12, color: '#6B707B' }}>
                Set your price per sheet for different sizes and print types.
              </p>
            </div>

            <button
              onClick={() => {
                if (isEditing) {
                  handleSavePricing();
                } else {
                  setIsEditing(true);
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 16,
                backgroundColor: isEditing ? '#16A34A' : '#EFECE4',
                border: isEditing ? 'none' : '1px solid #DAD5CB',
                color: isEditing ? '#FFFFFF' : '#1A1C20',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isEditing ? <Check size={12} /> : <Edit2 size={12} />}
              <span>{isEditing ? (saving ? 'Saving...' : 'Save Pricing') : 'Edit Pricing'}</span>
            </button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
              <thead>
                <tr style={{ color: '#555963', fontSize: 11, fontWeight: 700, backgroundColor: '#E8E4DA', borderBottom: '1px solid #DAD5CB' }}>
                  <th style={{ padding: '8px 12px', borderTopLeftRadius: 8 }}>Size</th>
                  <th style={{ padding: '8px 12px' }}>Paper Type</th>
                  <th style={{ padding: '8px 12px' }}>B&W (₹ / Sheet)</th>
                  <th style={{ padding: '8px 12px' }}>Colour (₹ / Sheet)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', borderTopRightRadius: 8 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#1A1C20' }}>{row.size}</td>
                    <td style={{ padding: '12px', color: '#555963' }}>{row.paperType}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1A1C20' }}>
                      {isEditing ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: 6, border: '1px solid #DAD5CB' }}>
                          <span style={{ fontSize: 11, color: '#6B707B' }}>₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={row.bwPrice}
                            onChange={e => {
                              const val = e.target.value;
                              setPricingRows(prev => prev.map(r => r.id === row.id ? { ...r, bwPrice: val } : r));
                            }}
                            style={{ width: 44, border: 'none', outline: 'none', fontSize: 12, fontWeight: 600, color: '#1A1C20' }}
                          />
                        </div>
                      ) : (
                        `₹ ${row.bwPrice}`
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1A1C20' }}>
                      {isEditing ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: 6, border: '1px solid #DAD5CB' }}>
                          <span style={{ fontSize: 11, color: '#6B707B' }}>₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={row.colPrice}
                            onChange={e => {
                              const val = e.target.value;
                              setPricingRows(prev => prev.map(r => r.id === row.id ? { ...r, colPrice: val } : r));
                            }}
                            style={{ width: 44, border: 'none', outline: 'none', fontSize: 12, fontWeight: 600, color: '#1A1C20' }}
                          />
                        </div>
                      ) : (
                        `₹ ${row.colPrice}`
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {/* iOS-style green toggle matching PDF */}
                      <div
                        onClick={() => toggleRowEnabled(row.id)}
                        style={{
                          width: 38,
                          height: 22,
                          borderRadius: 12,
                          backgroundColor: row.enabled ? '#22C55E' : '#D1D5DB',
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
                            transform: row.enabled ? 'translateX(16px)' : 'translateX(0)',
                            transition: 'transform 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Service Settings Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '20px 22px',
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20', marginBottom: 18 }}>
            Service Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Setting 1: Estimated Printing Time */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Clock size={16} color="#6B707B" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Estimated Printing Time</div>
                  <div style={{ fontSize: 11, color: '#8E929B' }}>Time to complete an order</div>
                </div>
              </div>

              <select
                value={estimatedTime}
                onChange={e => setEstimatedTime(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: '#EFECE4',
                  border: '1px solid #DAD5CB',
                  color: '#1A1C20',
                  fontSize: 12.5,
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="1 - 2 Hours">1 – 2 Hours</option>
                <option value="2 - 4 Hours">2 – 4 Hours</option>
                <option value="Same Day">Same Day</option>
                <option value="24 Hours">24 Hours</option>
              </select>
            </div>

            {/* Setting 2: Minimum Order Value */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Coins size={16} color="#6B707B" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Minimum Order Value</div>
                  <div style={{ fontSize: 11, color: '#8E929B' }}>Optional</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: '#EFECE4',
                  border: '1px solid #DAD5CB',
                  borderRadius: 8,
                  padding: '5px 10px',
                }}
              >
                <span style={{ fontSize: 12, color: '#555963' }}>₹</span>
                <input
                  type="text"
                  value={minOrderValue}
                  onChange={e => setMinOrderValue(e.target.value)}
                  style={{
                    width: 50,
                    border: 'none',
                    background: 'transparent',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#1A1C20',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Setting 3: Fulfilment Mode */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Store size={16} color="#6B707B" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Fulfilment Mode</div>
                  <div style={{ fontSize: 11, color: '#8E929B' }}>For now, pickup only (MVP)</div>
                </div>
              </div>

              <span
                style={{
                  padding: '5px 12px',
                  borderRadius: 16,
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Pickup Only
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tip Banner matching PDF */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#EDE9FE',
          borderRadius: 14,
          padding: '12px 20px',
          color: '#581C87',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Info size={14} color="#6B21A8" />
          </div>
          <span style={{ fontSize: 12.5, color: '#581C87' }}>
            <b>Tip:</b> Add more services like Posters, Banners, T-shirts, Invitations and Packaging to get more orders.
          </span>
        </div>

        <button
          onClick={() => showToast('Opening Service Catalog')}
          style={{
            padding: '6px 14px',
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
            border: '1px solid #DDD6FE',
            color: '#581C87',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Add Another Service
        </button>
      </div>
    </div>
  );
};
