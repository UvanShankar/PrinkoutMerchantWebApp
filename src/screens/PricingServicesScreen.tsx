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
  Check,
  CreditCard,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { theme } from '../theme';

interface PricingRow {
  id: string;
  size: string;
  paperType: string;
  bwEnabled: boolean;
  bwPrice: string;
  colEnabled: boolean;
  colPrice: string;
  isDefault?: boolean;
}

export const PricingServicesScreen: React.FC = () => {
  const { shopId, shopData, showToast, refreshData } = useMerchant();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('standard');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Standard Prints: starts initially with ONLY A4 and 70 GSM
  const [standardPricingRows, setStandardPricingRows] = useState<PricingRow[]>([
    {
      id: 'row_a4_70',
      size: 'A4',
      paperType: '70 GSM',
      bwEnabled: true,
      bwPrice: '2.00',
      colEnabled: true,
      colPrice: '10.00',
      isDefault: true,
    },
  ]);

  // Dropdown states for adding new paper size & GSM
  const [newSize, setNewSize] = useState('A3');
  const [newGsm, setNewGsm] = useState('80 GSM');

  // Posters pricing rows
  const [postersPricingRows, setPostersPricingRows] = useState<PricingRow[]>([
    { id: 'pos_1', size: 'A2', paperType: '180 GSM Matte', bwEnabled: true, bwPrice: '25.00', colEnabled: true, colPrice: '60.00', isDefault: true },
    { id: 'pos_2', size: 'A1', paperType: '220 GSM Glossy', bwEnabled: true, bwPrice: '50.00', colEnabled: true, colPrice: '120.00', isDefault: true },
    { id: 'pos_3', size: 'A0', paperType: '260 GSM Satin Photo', bwEnabled: true, bwPrice: '90.00', colEnabled: true, colPrice: '200.00', isDefault: true },
  ]);

  // Banners pricing rows
  const [bannersPricingRows, setBannersPricingRows] = useState([
    { id: 'ban_1', type: 'Normal Flex', unit: 'Per Sq. Ft', enabled: true, price: '18.00' },
    { id: 'ban_2', type: 'Star Flex (HD)', unit: 'Per Sq. Ft', enabled: true, price: '28.00' },
    { id: 'ban_3', type: 'Vinyl Banner with Eyelets', unit: 'Per Sq. Ft', enabled: true, price: '45.00' },
    { id: 'ban_4', type: 'Backlit Film (Signage)', unit: 'Per Sq. Ft', enabled: true, price: '75.00' },
  ]);

  // Business cards pricing rows
  const [cardsPricingRows, setCardsPricingRows] = useState([
    { id: 'card_1', type: 'Standard 300 GSM', qty: '100 Cards', enabled: true, price: '180.00' },
    { id: 'card_2', type: 'Matte Laminated 350 GSM', qty: '100 Cards', enabled: true, price: '280.00' },
    { id: 'card_3', type: 'Velvet Touch UV 400 GSM', qty: '100 Cards', enabled: true, price: '450.00' },
  ]);

  // T-Shirt pricing rows
  const [tshirtPricingRows, setTshirtPricingRows] = useState([
    { id: 'tsh_1', type: 'Round Neck (100% Cotton)', printArea: 'Front A4 Print', enabled: true, price: '299.00' },
    { id: 'tsh_2', type: 'Round Neck (100% Cotton)', printArea: 'Front & Back A4 Print', enabled: true, price: '399.00' },
    { id: 'tsh_3', type: 'Polo Collar Premium', printArea: 'Chest Logo + Back A4', enabled: true, price: '499.00' },
  ]);

  // Invitations pricing rows
  const [invitesPricingRows, setInvitesPricingRows] = useState([
    { id: 'inv_1', type: 'Textured Linen Card', size: '5 x 7 inches', enabled: true, price: '15.00' },
    { id: 'inv_2', type: 'Metallic Shimmer Card', size: '5 x 7 inches', enabled: true, price: '22.00' },
    { id: 'inv_3', type: 'Laser Cut Luxury Fold', size: '6 x 8 inches', enabled: true, price: '45.00' },
  ]);

  // Packaging pricing rows
  const [packagingPricingRows, setPackagingPricingRows] = useState([
    { id: 'pkg_1', type: 'Die-Cut Vinyl Stickers', unit: 'Sheet of 24', enabled: true, price: '35.00' },
    { id: 'pkg_2', type: 'Custom Kraft Paper Bag', unit: 'Pack of 50', enabled: true, price: '650.00' },
    { id: 'pkg_3', type: 'Corrugated Shipping Box', unit: 'Pack of 25', enabled: true, price: '450.00' },
  ]);

  // Service Settings state
  const [estimatedTime, setEstimatedTime] = useState('1 - 2 Hours');
  const [minOrderValue, setMinOrderValue] = useState('50');
  const [fulfilmentMode, setFulfilmentMode] = useState<string>('Store Pickup Only');

  // Load shop data
  useEffect(() => {
    if (shopData) {
      if (shopData.fulfilmentMode) {
        setFulfilmentMode(shopData.fulfilmentMode);
      }
      if (Array.isArray(shopData.standardPrintsPricing) && shopData.standardPrintsPricing.length > 0) {
        setStandardPricingRows(shopData.standardPrintsPricing);
      } else if (shopData.bwPrice || shopData.colorPrice) {
        setStandardPricingRows([
          {
            id: 'row_a4_70',
            size: 'A4',
            paperType: '70 GSM',
            bwEnabled: true,
            bwPrice: String(shopData.bwPrice ?? '2.00'),
            colEnabled: true,
            colPrice: String(shopData.colorPrice ?? '10.00'),
            isDefault: true,
          },
        ]);
      }
    }
  }, [shopData]);

  // Add paper size and GSM row to Standard Prints
  const handleAddStandardRow = () => {
    // Check if combo already exists
    const exists = standardPricingRows.some(
      r => r.size === newSize && r.paperType === newGsm
    );
    if (exists) {
      showToast(`${newSize} with ${newGsm} is already in your price list`);
      return;
    }

    // Default prices based on size
    let defaultBw = '4.00';
    let defaultCol = '15.00';
    if (newSize === 'A3') { defaultBw = '5.00'; defaultCol = '18.00'; }
    else if (newSize === 'A2') { defaultBw = '25.00'; defaultCol = '60.00'; }
    else if (newSize === 'A1') { defaultBw = '50.00'; defaultCol = '120.00'; }
    else if (newSize === 'A0') { defaultBw = '90.00'; defaultCol = '200.00'; }

    const newRow: PricingRow = {
      id: `std_${Date.now()}`,
      size: newSize,
      paperType: newGsm,
      bwEnabled: true,
      bwPrice: defaultBw,
      colEnabled: true,
      colPrice: defaultCol,
      isDefault: false,
    };

    setStandardPricingRows(prev => [...prev, newRow]);
    showToast(`Added ${newSize} (${newGsm}) to price list`);
  };

  const handleDeleteStandardRow = (id: string) => {
    setStandardPricingRows(prev => prev.filter(r => r.id !== id));
    showToast('Row removed from price list');
  };

  const handleSavePricing = async () => {
    if (!shopId) {
      showToast('No active shop found');
      return;
    }
    setSaving(true);
    try {
      const a4Row = standardPricingRows.find(r => r.size === 'A4') || standardPricingRows[0];
      const payload = {
        standardPrintsPricing: standardPricingRows,
        fulfilmentMode,
        bwPrice: parseFloat(a4Row?.bwPrice || '2.00'),
        colorPrice: parseFloat(a4Row?.colPrice || '10.00'),
      };

      await merchantApi.updateShopProfile(shopId, payload);
      await refreshData();
      showToast('Pricing & Services saved successfully!');
      setIsEditing(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  const servicesList = [
    { id: 'standard', name: 'Standard Prints', desc: 'A4, A3, A0', icon: Layers, enabled: true },
    { id: 'posters', name: 'Posters', desc: 'Photo / Glossy', icon: ImageIcon, enabled: false },
    { id: 'banners', name: 'Banners & Flex', desc: 'Outdoor / Signage', icon: Tv, enabled: false },
    { id: 'cards', name: 'Business Cards', desc: 'Matte / Velvet', icon: CreditCard, enabled: false },
    { id: 'tshirt', name: 'T-shirt Printing', desc: 'Cotton / Polo', icon: Shirt, enabled: false },
    { id: 'invitations', name: 'Invitations', desc: 'Cards / Envelopes', icon: Mail, enabled: false },
    { id: 'packaging', name: 'Packaging', desc: 'Boxes / Labels', icon: Box, enabled: false },
  ];

  // Helper iOS-style toggle
  const renderToggle = (checked: boolean, onToggle: () => void, color = '#22C55E') => (
    <div
      onClick={onToggle}
      title={checked ? 'Enabled' : 'Disabled'}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
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
          width: 16,
          height: 16,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 80 }}>
      {/* Top Header Card */}
      <div
        style={{
          backgroundColor: theme.colors.creamCard,
          border: `1px solid ${theme.colors.creamCardBorder}`,
          borderRadius: 18,
          padding: '20px 22px',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#1A1C20', marginBottom: 2 }}>
            Your Services & Offerings
          </h2>
          <p style={{ fontSize: 12, color: '#6B707B', margin: 0 }}>
            Select a service category below to configure its print specifications, size rates, and options.
          </p>
        </div>

        {/* Horizontal Service Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {servicesList.map(srv => {
            const isSelected = selectedServiceId === srv.id;
            const Icon = srv.icon;
            const isEnabled = srv.enabled;

            return (
              <div
                key={srv.id}
                onClick={() => {
                  if (!isEnabled) {
                    showToast(`${srv.name} is disabled. Only Standard Prints are currently enabled on Prinkout.`);
                    return;
                  }
                  setSelectedServiceId(srv.id);
                }}
                style={{
                  backgroundColor: isSelected ? '#FFFFFF' : (isEnabled ? '#FAF8F5' : '#F5F3EF'),
                  border: `2px solid ${isSelected ? '#16A34A' : '#E8E4DA'}`,
                  borderRadius: 14,
                  padding: '16px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  cursor: isEnabled ? 'pointer' : 'not-allowed',
                  opacity: isEnabled ? 1 : 0.45,
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(22, 163, 74, 0.14)' : 'none',
                }}
              >
                {/* Status badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: 6,
                    backgroundColor: isEnabled ? '#DCFCE7' : '#E5E7EB',
                    color: isEnabled ? '#15803D' : '#6B7280',
                  }}
                >
                  {isEnabled ? 'Active' : 'Disabled'}
                </span>

                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isSelected ? '#DCFCE7' : '#EFECE4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                    marginTop: 4,
                  }}
                >
                  <Icon size={20} color={isSelected ? '#15803D' : (isEnabled ? '#1A1C20' : '#9CA3AF')} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isEnabled ? '#1A1C20' : '#6B7280', marginBottom: 2, lineHeight: 1.2 }}>
                  {srv.name}
                </div>
                <div style={{ fontSize: 10, color: '#8E929B' }}>{srv.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Dynamic Row: Changes based on selected service card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16 }}>
        {/* Left Dynamic Service Table Card */}
        <div
          style={{
            backgroundColor: theme.colors.creamCard,
            border: `1px solid ${theme.colors.creamCardBorder}`,
            borderRadius: 18,
            padding: '20px 22px',
          }}
        >
          {/* Service Title Bar */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 8, backgroundColor: '#DCFCE7', color: '#15803D', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                <Sparkles size={11} />
                <span>Active Service Category</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1A1C20', marginBottom: 2 }}>
                {selectedServiceId === 'standard' && 'Standard Prints — Pricing'}
                {selectedServiceId === 'posters' && 'Posters — Sizes & Photo Rates'}
                {selectedServiceId === 'banners' && 'Banners & Flex — Media Types'}
                {selectedServiceId === 'cards' && 'Business Cards — Quantities & Paper'}
                {selectedServiceId === 'tshirt' && 'T-Shirt Printing — Fabric & Placement'}
                {selectedServiceId === 'invitations' && 'Invitations — Specialty Cards'}
                {selectedServiceId === 'packaging' && 'Packaging & Labels — Boxes & Stickers'}
              </h3>
              <p style={{ fontSize: 12, color: '#6B707B' }}>
                {selectedServiceId === 'standard'
                  ? 'Manage B&W and Colour per-sheet rates. Add sizes & GSM configs below.'
                  : `Configure offerings and customer pricing for ${servicesList.find(s => s.id === selectedServiceId)?.name}.`}
              </p>
            </div>

            <button
              type="button"
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
                padding: '7px 16px',
                borderRadius: 16,
                backgroundColor: isEditing ? '#16A34A' : '#EFECE4',
                border: isEditing ? 'none' : '1px solid #DAD5CB',
                color: isEditing ? '#FFFFFF' : '#1A1C20',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isEditing ? <Check size={13} /> : <Edit2 size={13} />}
              <span>{isEditing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Prices'}</span>
            </button>
          </div>

          {/* Table 1: Standard Prints */}
          {selectedServiceId === 'standard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ color: '#555963', fontSize: 11, fontWeight: 700, backgroundColor: '#E8E4DA', borderBottom: '1px solid #DAD5CB' }}>
                      <th style={{ padding: '8px 10px', borderTopLeftRadius: 8 }}>Size</th>
                      <th style={{ padding: '8px 10px' }}>Paper GSM</th>
                      <th style={{ padding: '8px 8px', textAlign: 'center' }}>B&W Status</th>
                      <th style={{ padding: '8px 10px' }}>B&W (₹ / Sheet)</th>
                      <th style={{ padding: '8px 8px', textAlign: 'center' }}>Colour Status</th>
                      <th style={{ padding: '8px 10px' }}>Colour (₹ / Sheet)</th>
                      <th style={{ padding: '8px 8px', textAlign: 'center', borderTopRightRadius: 8 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {standardPricingRows.map(row => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                        <td style={{ padding: '12px 10px', fontWeight: 800, color: '#1A1C20' }}>{row.size}</td>
                        <td style={{ padding: '12px 10px', color: '#555963', fontWeight: 600 }}>{row.paperType}</td>

                        {/* B&W Status Toggle (before B&W Price) */}
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          {renderToggle(row.bwEnabled, () => {
                            setStandardPricingRows(prev =>
                              prev.map(r => (r.id === row.id ? { ...r, bwEnabled: !r.bwEnabled } : r))
                            );
                          })}
                        </td>

                        {/* B&W Price */}
                        <td style={{ padding: '10px 10px', fontWeight: 600, color: row.bwEnabled ? '#1A1C20' : '#9CA3AF' }}>
                          {isEditing ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: 8, border: '1px solid #DAD5CB' }}>
                              <span style={{ fontSize: 11, color: '#6B707B' }}>₹</span>
                              <input
                                type="number"
                                step="0.10"
                                value={row.bwPrice}
                                onChange={e => {
                                  const val = e.target.value;
                                  setStandardPricingRows(prev =>
                                    prev.map(r => (r.id === row.id ? { ...r, bwPrice: val } : r))
                                  );
                                }}
                                style={{ width: 50, border: 'none', outline: 'none', fontSize: 12, fontWeight: 700, color: '#1A1C20' }}
                              />
                            </div>
                          ) : (
                            <span>{row.bwEnabled ? `₹ ${row.bwPrice}` : 'Disabled'}</span>
                          )}
                        </td>

                        {/* Colour Status Toggle (before Colour Price) */}
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          {renderToggle(row.colEnabled, () => {
                            setStandardPricingRows(prev =>
                              prev.map(r => (r.id === row.id ? { ...r, colEnabled: !r.colEnabled } : r))
                            );
                          })}
                        </td>

                        {/* Colour Price */}
                        <td style={{ padding: '10px 10px', fontWeight: 600, color: row.colEnabled ? '#1A1C20' : '#9CA3AF' }}>
                          {isEditing ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: 8, border: '1px solid #DAD5CB' }}>
                              <span style={{ fontSize: 11, color: '#6B707B' }}>₹</span>
                              <input
                                type="number"
                                step="0.50"
                                value={row.colPrice}
                                onChange={e => {
                                  const val = e.target.value;
                                  setStandardPricingRows(prev =>
                                    prev.map(r => (r.id === row.id ? { ...r, colPrice: val } : r))
                                  );
                                }}
                                style={{ width: 50, border: 'none', outline: 'none', fontSize: 12, fontWeight: 700, color: '#1A1C20' }}
                              />
                            </div>
                          ) : (
                            <span>{row.colEnabled ? `₹ ${row.colPrice}` : 'Disabled'}</span>
                          )}
                        </td>

                        {/* Delete Row Action */}
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          {!row.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleDeleteStandardRow(row.id)}
                              title="Delete row"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#EF4444',
                                padding: 2,
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Paper Size & GSM Dropdown Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  backgroundColor: '#FAF8F5',
                  border: '1.5px dashed #DAD5CB',
                  marginTop: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#1A1C20' }}>
                  <Plus size={16} color="#4F46E5" />
                  <span>Add Size & Paper:</span>
                </div>

                {/* Dropdown 1: Paper Size (All A4, A3, A2, A1, A0) */}
                <select
                  value={newSize}
                  onChange={e => setNewSize(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DAD5CB',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#1A1C20',
                    outline: 'none',
                  }}
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A2">A2</option>
                  <option value="A1">A1</option>
                  <option value="A0">A0</option>
                  <option value="Legal">Legal</option>
                </select>

                {/* Dropdown 2: Paper GSM */}
                <select
                  value={newGsm}
                  onChange={e => setNewGsm(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DAD5CB',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#1A1C20',
                    outline: 'none',
                  }}
                >
                  <option value="70 GSM">70 GSM</option>
                  <option value="75 GSM">75 GSM</option>
                  <option value="80 GSM">80 GSM</option>
                  <option value="100 GSM">100 GSM</option>
                  <option value="300 GSM">300 GSM</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddStandardRow}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 10,
                    backgroundColor: '#1C1D21',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Plus size={14} />
                  <span>Add to Price List</span>
                </button>
              </div>
            </div>
          )}

          {/* Table 2: Posters */}
          {selectedServiceId === 'posters' && (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ color: '#555963', fontSize: 11, fontWeight: 700, backgroundColor: '#E8E4DA', borderBottom: '1px solid #DAD5CB' }}>
                    <th style={{ padding: '8px 10px' }}>Poster Size</th>
                    <th style={{ padding: '8px 10px' }}>Media Type</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center' }}>B&W Status</th>
                    <th style={{ padding: '8px 10px' }}>B&W (₹)</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center' }}>Colour Status</th>
                    <th style={{ padding: '8px 10px' }}>Colour (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {postersPricingRows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 800 }}>{row.size}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.paperType}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {renderToggle(row.bwEnabled, () => {
                          setPostersPricingRows(prev =>
                            prev.map(r => (r.id === row.id ? { ...r, bwEnabled: !r.bwEnabled } : r))
                          );
                        })}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 700 }}>₹ {row.bwPrice}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {renderToggle(row.colEnabled, () => {
                          setPostersPricingRows(prev =>
                            prev.map(r => (r.id === row.id ? { ...r, colEnabled: !r.colEnabled } : r))
                          );
                        })}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 700 }}>₹ {row.colPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table 3: Banners */}
          {selectedServiceId === 'banners' && (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ color: '#555963', fontSize: 11, fontWeight: 700, backgroundColor: '#E8E4DA', borderBottom: '1px solid #DAD5CB' }}>
                    <th style={{ padding: '8px 10px' }}>Banner Type</th>
                    <th style={{ padding: '8px 10px' }}>Pricing Unit</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Rate (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {bannersPricingRows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 800 }}>{row.type}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.unit}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {renderToggle(row.enabled, () => {
                          setBannersPricingRows(prev =>
                            prev.map(r => (r.id === row.id ? { ...r, enabled: !r.enabled } : r))
                          );
                        })}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 700 }}>₹ {row.price} / sq.ft</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table 4: Business Cards */}
          {selectedServiceId === 'cards' && (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ color: '#555963', fontSize: 11, fontWeight: 700, backgroundColor: '#E8E4DA', borderBottom: '1px solid #DAD5CB' }}>
                    <th style={{ padding: '8px 10px' }}>Card Finish</th>
                    <th style={{ padding: '8px 10px' }}>Quantity</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {cardsPricingRows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 800 }}>{row.type}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.qty}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {renderToggle(row.enabled, () => {
                          setCardsPricingRows(prev =>
                            prev.map(r => (r.id === row.id ? { ...r, enabled: !r.enabled } : r))
                          );
                        })}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 700 }}>₹ {row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table 5: T-Shirts */}
          {selectedServiceId === 'tshirt' && (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ color: '#555963', fontSize: 11, fontWeight: 700, backgroundColor: '#E8E4DA', borderBottom: '1px solid #DAD5CB' }}>
                    <th style={{ padding: '8px 10px' }}>Apparel Type</th>
                    <th style={{ padding: '8px 10px' }}>Print Area</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {tshirtPricingRows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 800 }}>{row.type}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.printArea}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {renderToggle(row.enabled, () => {
                          setTshirtPricingRows(prev =>
                            prev.map(r => (r.id === row.id ? { ...r, enabled: !r.enabled } : r))
                          );
                        })}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 700 }}>₹ {row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table 6: Invitations */}
          {selectedServiceId === 'invitations' && (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ color: '#555963', fontSize: 11, fontWeight: 700, backgroundColor: '#E8E4DA', borderBottom: '1px solid #DAD5CB' }}>
                    <th style={{ padding: '8px 10px' }}>Card Type</th>
                    <th style={{ padding: '8px 10px' }}>Dimensions</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Price (₹ / Card)</th>
                  </tr>
                </thead>
                <tbody>
                  {invitesPricingRows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 800 }}>{row.type}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.size}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {renderToggle(row.enabled, () => {
                          setInvitesPricingRows(prev =>
                            prev.map(r => (r.id === row.id ? { ...r, enabled: !r.enabled } : r))
                          );
                        })}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 700 }}>₹ {row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table 7: Packaging & Labels */}
          {selectedServiceId === 'packaging' && (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ color: '#555963', fontSize: 11, fontWeight: 700, backgroundColor: '#E8E4DA', borderBottom: '1px solid #DAD5CB' }}>
                    <th style={{ padding: '8px 10px' }}>Packaging Item</th>
                    <th style={{ padding: '8px 10px' }}>Quantity</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {packagingPricingRows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 800 }}>{row.type}</td>
                      <td style={{ padding: '12px 10px', color: '#555963' }}>{row.unit}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {renderToggle(row.enabled, () => {
                          setPackagingPricingRows(prev =>
                            prev.map(r => (r.id === row.id ? { ...r, enabled: !r.enabled } : r))
                          );
                        })}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 700 }}>₹ {row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                  <div style={{ fontSize: 11, color: '#8E929B' }}>Average time per order</div>
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
                  <div style={{ fontSize: 11, color: '#8E929B' }}>Optional threshold</div>
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

            {/* Setting 3: Fulfilment Mode (Dropdown as requested) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Store size={16} color="#6B707B" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>Fulfilment Mode</div>
                  <div style={{ fontSize: 11, color: '#8E929B' }}>Store delivery & pickup options</div>
                </div>
              </div>

              <select
                value={fulfilmentMode}
                onChange={e => setFulfilmentMode(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: '#EFECE4',
                  border: '1px solid #DAD5CB',
                  color: '#1A1C20',
                  fontSize: 12.5,
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Store Pickup Only">Store Pickup Only</option>
                <option value="Delivery Only">Delivery Only</option>
                <option value="Both (Pickup & Delivery)">Both (Pickup & Delivery)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
