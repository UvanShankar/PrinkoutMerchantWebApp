import React, { useState, useEffect } from 'react';
import { useMerchant } from '../context/MerchantContext';
import { merchantApi } from '../services/api';
import {
  Edit2,
  Store,
  FileText,
  MapPin,
  Phone,
  CheckCircle2,
  Plus,
  ExternalLink,
  ChevronRight,
  Star,
  Map,
  Check,
  X,
} from 'lucide-react';
import { theme } from '../theme';

export const ShopProfileScreen: React.FC = () => {
  const { shopId, shopData, setShopData, orders, showToast } = useMerchant();
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'hours' | 'preview'>('details');

  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [savingBasic, setSavingBasic] = useState(false);
  const [basicForm, setBasicForm] = useState({
    shopName: shopData?.shopName || '',
    description: shopData?.description || '',
    address: shopData?.address || '',
    mobile: shopData?.mobile || '',
  });

  useEffect(() => {
    if (shopData) {
      setBasicForm({
        shopName: shopData.shopName || '',
        description: shopData.description || '',
        address: shopData.address || '',
        mobile: shopData.mobile || '',
      });
    }
  }, [shopData]);

  const handleSaveBasic = async () => {
    try {
      setSavingBasic(true);
      if (shopId) {
        await merchantApi.updateShopProfile(shopId, basicForm);
      }
      setShopData((prev: any) => ({ ...prev, ...basicForm }));
      setIsEditingBasic(false);
      showToast('Shop details updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update shop details');
    } finally {
      setSavingBasic(false);
    }
  };

  const tabs = [
    { id: 'details', label: 'Shop Details' },
    { id: 'documents', label: 'Documents' },
    { id: 'hours', label: 'Operating Hours' },
    { id: 'preview', label: 'Preview' },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Filter Subtabs matching PDF */}
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
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '6px 16px',
                borderRadius: 16,
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#1C1D21' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#6B707B',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Column Grid matching PDF */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Column 1: Basic Details & Business Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Shop Header Pill Box */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: '#8B5CF6',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: theme.fonts.serif,
                    fontSize: 24,
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  P.
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1C20', lineHeight: 1.2 }}>
                    {shopData?.shopName || 'Shop Profile'}
                  </h2>
                  <p style={{ fontSize: 12, color: '#6B707B' }}>
                    {shopData?.servicesOffered?.length ? shopData.servicesOffered.join(' • ') : 'Standard Prints'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingBasic(prev => !prev)}
                title={isEditingBasic ? 'Cancel edit' : 'Edit details'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  color: isEditingBasic ? '#DC2626' : '#6B707B',
                }}
              >
                {isEditingBasic ? <X size={16} /> : <Edit2 size={15} />}
              </button>
            </div>

            <div style={{ borderTop: '1px solid #EBE7DF', paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Basic Details</span>
                {isEditingBasic && (
                  <button
                    onClick={handleSaveBasic}
                    disabled={savingBasic}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 10px',
                      borderRadius: 12,
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Check size={12} />
                    <span>{savingBasic ? 'Saving...' : 'Save'}</span>
                  </button>
                )}
              </div>

              {isEditingBasic ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Shop Name</label>
                    <input
                      type="text"
                      value={basicForm.shopName}
                      onChange={e => setBasicForm(f => ({ ...f, shopName: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Description</label>
                    <textarea
                      rows={2}
                      value={basicForm.description}
                      onChange={e => setBasicForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe the printing and copy services you offer..."
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Shop Address</label>
                    <input
                      type="text"
                      value={basicForm.address}
                      onChange={e => setBasicForm(f => ({ ...f, address: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Phone Number</label>
                    <input
                      type="text"
                      value={basicForm.mobile}
                      onChange={e => setBasicForm(f => ({ ...f, mobile: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Store size={15} color="#6B707B" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: '#8E929B' }}>Shop Name</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>
                        {shopData?.shopName || '—'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <FileText size={15} color="#6B707B" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: '#8E929B' }}>Description</div>
                      <div style={{ fontSize: 12.5, color: '#555963', lineHeight: 1.4 }}>
                        {shopData?.description ||
                          (shopData?.shopName
                            ? `${shopData.shopName} provides fast, professional printing and document reproduction services.`
                            : 'Fast, professional printing and document reproduction services.')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <MapPin size={15} color="#6B707B" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, color: '#8E929B' }}>Shop Address</div>
                        <div style={{ fontSize: 12.5, color: '#555963' }}>
                          {shopData?.address || (shopData?.area ? `${shopData.area}, ${shopData.city} - ${shopData.pincode || ''}` : (shopData?.city ? `${shopData.city} - ${shopData.pincode || ''}` : 'Address not specified'))}
                        </div>
                      </div>
                    </div>
                    <Map size={16} color="#6B707B" style={{ cursor: 'pointer', marginTop: 2 }} />
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <Phone size={15} color="#6B707B" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: '#8E929B' }}>Phone Number</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C20' }}>
                        {shopData?.mobile || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Info Card */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20', marginBottom: 12 }}>
              Business Info
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: '#555963' }}>GST Number</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>
                    {shopData?.gstNumber || 'Not added'}
                  </span>
                  {shopData?.gstNumber && (
                    <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 12 }}>
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: '#555963' }}>Business Type</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>
                  Print Shop (Retail) ▼
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Services Offered, Shop Photos, Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Services Offered */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Services Offered</span>
              <Edit2 size={14} color="#6B707B" style={{ cursor: 'pointer' }} />
            </div>
            <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 12 }}>
              Select the services you provide on Prinkout.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { name: 'Standard Prints', active: true, disabled: false },
                { name: 'Posters', active: false, disabled: true },
                { name: 'Banners & Flex', active: false, disabled: true },
                { name: 'T-shirt Printing', active: false, disabled: true },
                { name: 'Invitations', active: false, disabled: true },
                { name: 'Packaging', active: false, disabled: true },
              ].map(s => (
                <div
                  key={s.name}
                  title={s.disabled ? `${s.name} - Coming Soon` : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    borderRadius: 14,
                    backgroundColor: s.active ? '#1C1D21' : '#F5F3ED',
                    border: `1px solid ${s.active ? '#1C1D21' : '#DAD5CB'}`,
                    color: s.active ? '#FFFFFF' : '#8E929B',
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: s.disabled ? 0.65 : 1,
                    cursor: s.disabled ? 'not-allowed' : 'default',
                  }}
                >
                  {s.active ? (
                    <span style={{ fontSize: 11, fontWeight: 800 }}>✓</span>
                  ) : (
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: '#8E929B' }}>Soon</span>
                  )}
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Photos */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Shop Photos</span>
              <Edit2 size={14} color="#6B707B" style={{ cursor: 'pointer' }} />
            </div>
            <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 12 }}>
              Add photos of your shop, machines, or sample prints.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {/* Photo 1: Storefront */}
              <div
                style={{
                  height: 64,
                  borderRadius: 10,
                  backgroundColor: '#2A2D35',
                  backgroundImage: 'linear-gradient(145deg, #1A1C21, #3D4250)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: 8.5,
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: 2,
                }}
              >
                {shopData?.shopName || 'Store Front'}
              </div>

              {/* Photo 2: Printer */}
              <div
                style={{
                  height: 64,
                  borderRadius: 10,
                  backgroundColor: '#374151',
                  backgroundImage: 'linear-gradient(145deg, #1F2937, #4B5563)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: 8.5,
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: 2,
                }}
              >
                Canon Wide
              </div>

              {/* Photo 3: Workshop */}
              <div
                style={{
                  height: 64,
                  borderRadius: 10,
                  backgroundColor: '#4B5563',
                  backgroundImage: 'linear-gradient(145deg, #374151, #6B7280)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: 8.5,
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: 2,
                }}
              >
                Print Room
              </div>

              {/* Add photo button */}
              <div
                onClick={() => showToast('Upload photo')}
                style={{
                  height: 64,
                  borderRadius: 10,
                  border: '1.5px dashed #DAD5CB',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#8E929B',
                }}
              >
                <Plus size={16} />
                <span style={{ fontSize: 9.5, fontWeight: 600, marginTop: 2 }}>Add Photo</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Documents</span>
              <Edit2 size={14} color="#6B707B" style={{ cursor: 'pointer' }} />
            </div>
            <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 12 }}>
              Keep your business documents up to date.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 10,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={15} color="#6B707B" />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>GST Certificate</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                    ✓ Verified
                  </span>
                  <ChevronRight size={14} color="#8E929B" />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 10,
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EBE7DF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={15} color="#6B707B" />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>Shop Proof (Rent/Bill)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                    ✓ Verified
                  </span>
                  <ChevronRight size={14} color="#8E929B" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Public Profile Preview & Shop Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Public Profile Preview */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Public Profile Preview</span>
              <ExternalLink size={14} color="#6B707B" style={{ cursor: 'pointer' }} />
            </div>
            <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>
              This is how customers will see your shop.
            </p>

            {/* Mobile-like card preview matching PDF */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E5E1D6',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              {/* Photo hero with carousel dots */}
              <div
                style={{
                  height: 120,
                  backgroundColor: '#1E2028',
                  backgroundImage: 'linear-gradient(145deg, #111215, #2F3342)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  color: '#FFFFFF',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.5px' }}>{shopData?.shopName || 'Shop Preview'}</div>
                {/* Carousel dots */}
                <div style={{ position: 'absolute', bottom: 8, display: 'flex', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>

              {/* Info area */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: '#8B5CF6',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    P.
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>{shopData?.shopName || 'Shop Preview'}</div>
                    <div style={{ fontSize: 10.5, color: '#8E929B' }}>
                      {shopData?.servicesOffered?.length ? shopData.servicesOffered.join(' • ') : 'Standard Prints'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#555963', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <span><b>{shopData?.ratings || 4.8}</b> ({orders?.length > 0 ? `${orders.length} orders` : 'New'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MapPin size={12} />
                    <span>{shopData?.city || 'Local Store'}</span>
                  </div>
                </div>

                {/* Service pills */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(shopData?.servicesOffered?.length ? shopData.servicesOffered : ['Standard Prints']).map((p: string) => (
                    <span
                      key={p}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: '#F3F4F6',
                        color: '#4B5563',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shop Status Card */}
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Shop Status</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                ● Active
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#555963', lineHeight: 1.4 }}>
              Your shop is live and visible to customers on Prinkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
