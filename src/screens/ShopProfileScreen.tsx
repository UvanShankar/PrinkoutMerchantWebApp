import React, { useState, useEffect, useRef } from 'react';
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
  Lock,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Upload,
  ShieldCheck,
  Trash2,
  Building2,
  Calendar,
  Camera,
} from 'lucide-react';
import { theme } from '../theme';

interface DocItem {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: string;
  uploadedAt: string;
  status?: string;
}

interface PhotoItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export const ShopProfileScreen: React.FC = () => {
  const { shopId, shopData, setShopData, orders, showToast } = useMerchant();
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'hours' | 'preview'>('details');

  // Verification status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  const verificationStatus: 'draft' | 'pending_approval' | 'approved' | 'rejected' =
    shopData?.verificationStatus || (shopData?.isVerified ? 'approved' : 'draft');

  const isApproved = verificationStatus === 'approved';
  const isPending = verificationStatus === 'pending_approval';
  const isDraft = verificationStatus === 'draft';
  const isRejected = verificationStatus === 'rejected';

  // Section editing states (Locked once approved)
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingHours, setIsEditingHours] = useState(false);

  const [savingBasic, setSavingBasic] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

  // Hidden file inputs
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const [pendingDocType, setPendingDocType] = useState<string>('GST Certificate');

  // Preview Modal state
  const [previewAsset, setPreviewAsset] = useState<{ name: string; url: string; type: string } | null>(null);

  // Forms
  const [basicForm, setBasicForm] = useState({
    shopName: shopData?.shopName || '',
    description: shopData?.description || '',
    address: shopData?.address || '',
    area: shopData?.area || '',
    city: shopData?.city || '',
    pincode: shopData?.pincode || '',
    mobile: shopData?.mobile || '',
    ownerName: shopData?.ownerName || '',
  });

  const [businessForm, setBusinessForm] = useState({
    businessType: shopData?.businessType || 'Print Shop (Retail)',
    gstNumber: shopData?.gstNumber || '',
    shopLicenseNo: shopData?.shopLicenseNo || '',
    upiId: shopData?.upiId || '',
  });

  const [hoursForm, setHoursForm] = useState({
    openingTime: shopData?.openingTime || '09:00',
    closingTime: shopData?.closingTime || '21:00',
    workingDays: shopData?.workingDays && shopData.workingDays.length > 0
      ? shopData.workingDays
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  });

  const [documents, setDocuments] = useState<DocItem[]>(() => {
    if (Array.isArray(shopData?.documents)) return shopData.documents;
    return [];
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    if (Array.isArray(shopData?.photos)) {
      return shopData.photos.map((p: any, idx: number) => {
        if (typeof p === 'string') return { id: `photo_${idx}`, name: `Photo ${idx + 1}`, url: p, uploadedAt: new Date().toISOString() };
        return p;
      });
    }
    return [];
  });

  useEffect(() => {
    if (shopData) {
      setBasicForm({
        shopName: shopData.shopName || '',
        description: shopData.description || '',
        address: shopData.address || '',
        area: shopData.area || '',
        city: shopData.city || '',
        pincode: shopData.pincode || '',
        mobile: shopData.mobile || '',
        ownerName: shopData.ownerName || '',
      });
      setBusinessForm({
        businessType: shopData.businessType || 'Print Shop (Retail)',
        gstNumber: shopData.gstNumber || '',
        shopLicenseNo: shopData.shopLicenseNo || '',
        upiId: shopData.upiId || '',
      });
      setHoursForm({
        openingTime: shopData.openingTime || '09:00',
        closingTime: shopData.closingTime || '21:00',
        workingDays: shopData.workingDays && shopData.workingDays.length > 0
          ? shopData.workingDays
          : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      });
      if (Array.isArray(shopData.documents)) {
        setDocuments(shopData.documents);
      } else {
        setDocuments([]);
      }
      if (Array.isArray(shopData.photos)) {
        setPhotos(shopData.photos.map((p: any, idx: number) => {
          if (typeof p === 'string') return { id: `photo_${idx}`, name: `Photo ${idx + 1}`, url: p, uploadedAt: new Date().toISOString() };
          return p;
        }));
      } else {
        setPhotos([]);
      }
    } else {
      setBasicForm({
        shopName: '',
        description: '',
        address: '',
        area: '',
        city: '',
        pincode: '',
        mobile: '',
        ownerName: '',
      });
      setBusinessForm({
        businessType: 'Print Shop (Retail)',
        gstNumber: '',
        shopLicenseNo: '',
        upiId: '',
      });
      setHoursForm({
        openingTime: '09:00',
        closingTime: '21:00',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      });
      setDocuments([]);
      setPhotos([]);
    }
  }, [shopData]);

  // Generators for sample documents and photos (ensures instant offline testing)
  const generateSampleDocSvg = (title: string, subtitle: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <rect width="600" height="800" fill="#FCFAF7" stroke="#D1D5DB" stroke-width="2"/>
      <rect x="40" y="40" width="520" height="90" fill="#1C1D21" rx="8"/>
      <text x="300" y="85" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">PRINKOUT VERIFIED DOCUMENT</text>
      <text x="300" y="112" font-family="Arial, sans-serif" font-size="13" fill="#9CA3AF" text-anchor="middle">Official Business Compliance Asset</text>
      
      <text x="60" y="190" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#111827">${title}</text>
      <text x="60" y="220" font-family="Arial, sans-serif" font-size="14" fill="#4B5563">${subtitle}</text>
      
      <line x1="60" y1="245" x2="540" y2="245" stroke="#E5E7EB" stroke-width="2"/>
      
      <text x="60" y="280" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#6B7280">DOCUMENT REF ID</text>
      <text x="60" y="305" font-family="Courier, monospace" font-size="15" fill="#1F2937">DOC-${Date.now().toString().slice(-8)}</text>
      
      <text x="60" y="350" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#6B7280">VERIFICATION AUTHORITY</text>
      <text x="60" y="375" font-family="Arial, sans-serif" font-size="14" fill="#1F2937">Government of India / Prinkout Admin</text>
      
      <text x="60" y="420" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#6B7280">COMPLIANCE STATUS</text>
      <text x="60" y="445" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#16A34A">&#10003; AUDITED &amp; VERIFIED</text>
      
      <rect x="60" y="500" width="480" height="180" fill="#F3F4F6" rx="6" stroke="#E5E7EB"/>
      <text x="300" y="575" font-family="Arial, sans-serif" font-size="13" fill="#6B7280" text-anchor="middle">Official Digital Stamp &amp; Certificate Record</text>
      <circle cx="300" cy="620" r="26" fill="#15803D"/>
      <text x="300" y="628" font-family="Arial, sans-serif" font-size="22" fill="#FFFFFF" text-anchor="middle">&#10003;</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const generateSamplePhotoSvg = (label: string) => {
    const shopTitle = basicForm.shopName || 'Prinkout Partner Store';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="photoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1E293B;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0F172A;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#photoGrad)"/>
      <rect x="30" y="30" width="540" height="340" fill="none" stroke="#475569" stroke-width="2" rx="14"/>
      <circle cx="300" cy="170" r="46" fill="#334155"/>
      <path d="M 276 182 L 290 162 L 305 178 L 322 154 L 334 182 Z" fill="#94A3B8"/>
      <text x="300" y="250" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#F8FAFC" text-anchor="middle">${shopTitle}</text>
      <text x="300" y="280" font-family="Arial, sans-serif" font-size="14" fill="#94A3B8" text-anchor="middle">${label}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  // Save Basic Details
  const handleSaveBasic = async () => {
    if (isApproved) {
      showToast('Verified shop details are locked and cannot be edited.');
      return;
    }
    try {
      setSavingBasic(true);
      if (shopId) {
        await merchantApi.updateShopProfile(shopId, basicForm);
      }
      setShopData((prev: any) => ({ ...prev, ...basicForm }));
      setIsEditingBasic(false);
      showToast('Shop basic details saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update shop details');
    } finally {
      setSavingBasic(false);
    }
  };

  // Save Business Info
  const handleSaveBusiness = async () => {
    if (isApproved) {
      showToast('Verified shop details are locked and cannot be edited.');
      return;
    }
    try {
      setSavingBusiness(true);
      if (shopId) {
        await merchantApi.updateShopProfile(shopId, businessForm);
      }
      setShopData((prev: any) => ({ ...prev, ...businessForm }));
      setIsEditingBusiness(false);
      showToast('Business details saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update business details');
    } finally {
      setSavingBusiness(false);
    }
  };

  // Save Hours
  const handleSaveHours = async () => {
    if (isApproved) {
      showToast('Verified shop details are locked and cannot be edited.');
      return;
    }
    try {
      setSavingHours(true);
      if (shopId) {
        await merchantApi.updateShopProfile(shopId, hoursForm);
      }
      setShopData((prev: any) => ({ ...prev, ...hoursForm }));
      setIsEditingHours(false);
      showToast('Operating hours saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update operating hours');
    } finally {
      setSavingHours(false);
    }
  };

  // Upload Real File handler (documents)
  const handleDocFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      const newDoc: DocItem = {
        id: `doc_${Date.now()}`,
        name: file.name,
        type: pendingDocType,
        url: url,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toISOString(),
        status: 'Submitted',
      };
      const updated = [...documents.filter(d => d.type !== pendingDocType), newDoc];
      setDocuments(updated);
      setShopData((prev: any) => ({ ...prev, documents: updated }));
      if (shopId) {
        try {
          await merchantApi.updateShopProfile(shopId, { documents: updated });
        } catch {}
      }
      showToast(`${pendingDocType} uploaded successfully!`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Upload Sample Document helper
  const handleUploadSampleDoc = async (docType: string) => {
    if (isApproved) return;
    const url = generateSampleDocSvg(docType, `Shop: ${basicForm.shopName || 'Registered Unit'}`);
    const newDoc: DocItem = {
      id: `doc_${Date.now()}`,
      name: `${docType.replace(/\s+/g, '_')}_Verified.pdf`,
      type: docType,
      url: url,
      size: '42.8 KB',
      uploadedAt: new Date().toISOString(),
      status: 'Submitted',
    };
    const updated = [...documents.filter(d => d.type !== docType), newDoc];
    setDocuments(updated);
    setShopData((prev: any) => ({ ...prev, documents: updated }));
    if (shopId) {
      try {
        await merchantApi.updateShopProfile(shopId, { documents: updated });
      } catch {}
    }
    showToast(`Sample ${docType} generated and added!`);
  };

  // Remove Document (only in draft/rejected)
  const handleRemoveDoc = async (id: string) => {
    if (isApproved) return;
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    setShopData((prev: any) => ({ ...prev, documents: updated }));
    if (shopId) {
      try {
        await merchantApi.updateShopProfile(shopId, { documents: updated });
      } catch {}
    }
    showToast('Document removed.');
  };

  // Upload Real File handler (photos)
  const handlePhotoFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      const newPhoto: PhotoItem = {
        id: `photo_${Date.now()}`,
        name: file.name,
        url: url,
        uploadedAt: new Date().toISOString(),
      };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      setShopData((prev: any) => ({ ...prev, photos: updated }));
      if (shopId) {
        try {
          await merchantApi.updateShopProfile(shopId, { photos: updated });
        } catch {}
      }
      showToast('Shop photo added successfully!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add Sample Photo helper
  const handleAddSamplePhoto = async (label: string) => {
    if (isApproved) return;
    const url = generateSamplePhotoSvg(label);
    const newPhoto: PhotoItem = {
      id: `photo_${Date.now()}`,
      name: `${label}.jpg`,
      url: url,
      uploadedAt: new Date().toISOString(),
    };
    const updated = [...photos, newPhoto];
    setPhotos(updated);
    setShopData((prev: any) => ({ ...prev, photos: updated }));
    if (shopId) {
      try {
        await merchantApi.updateShopProfile(shopId, { photos: updated });
      } catch {}
    }
    showToast(`${label} photo added!`);
  };

  // Remove Photo (only in draft/rejected)
  const handleRemovePhoto = async (id: string) => {
    if (isApproved) return;
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    setShopData((prev: any) => ({ ...prev, photos: updated }));
    if (shopId) {
      try {
        await merchantApi.updateShopProfile(shopId, { photos: updated });
      } catch {}
    }
    showToast('Photo removed.');
  };

  // Download Asset helper
  const handleDownloadAsset = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'prinkout_verified_asset';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloading ${filename}...`);
  };

  // Send Profile for Verification
  const handleSendForVerification = async () => {
    if (!basicForm.shopName || !basicForm.address || !basicForm.mobile) {
      showToast('Please complete Shop Name, Address, and Phone Number before submitting.');
      return;
    }
    const payload = {
      ...basicForm,
      ...businessForm,
      ...hoursForm,
      documents,
      photos,
      verificationStatus: 'pending_approval' as const,
      isVerified: false,
      verificationSubmittedAt: new Date().toISOString(),
    };
    try {
      setIsSubmittingVerification(true);
      if (shopId) {
        const result = await merchantApi.sendShopForVerification(shopId, payload);
        if (result) {
          if (Array.isArray(result.documents)) setDocuments(result.documents);
          if (Array.isArray(result.photos)) setPhotos(result.photos);
          setShopData((prev: any) => ({ ...prev, ...result }));
        } else {
          setShopData((prev: any) => ({ ...prev, ...payload }));
        }
      } else {
        setShopData((prev: any) => ({ ...prev, ...payload }));
      }
      showToast('Shop profile sent for admin verification!');
    } catch (err: any) {
      console.warn('sendShopForVerification API error, falling back to local state:', err);
      setShopData((prev: any) => ({ ...prev, ...payload }));
      showToast('Shop profile submitted for verification!');
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  // Admin Simulator: Approve Shop
  const handleAdminApprove = async () => {
    try {
      if (shopId) {
        await merchantApi.approveShopVerification(shopId);
      }
      const approvedPayload = {
        verificationStatus: 'approved',
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      };
      setShopData((prev: any) => ({ ...prev, ...approvedPayload }));
      showToast('✓ Shop has been officially Verified & Approved!');
    } catch (err: any) {
      showToast(err.message || 'Approval failed');
    }
  };

  // Admin Simulator: Reject Shop
  const handleAdminReject = async () => {
    try {
      if (shopId) {
        await merchantApi.rejectShopVerification(shopId, 'Please re-upload a clear copy of your GST Certificate.');
      }
      const rejectedPayload = {
        verificationStatus: 'rejected',
        isVerified: false,
        rejectionReason: 'Please re-upload a clear copy of your GST Certificate.',
      };
      setShopData((prev: any) => ({ ...prev, ...rejectedPayload }));
      showToast('Shop verification rejected. Status set to Rejected.');
    } catch (err: any) {
      showToast(err.message || 'Rejection failed');
    }
  };

  // Reset to Draft for testing
  const handleResetToDraft = async () => {
    try {
      const draftPayload = {
        verificationStatus: 'draft',
        isVerified: false,
      };
      if (shopId) {
        await merchantApi.updateShopProfile(shopId, draftPayload);
      }
      setShopData((prev: any) => ({ ...prev, ...draftPayload }));
      showToast('Shop reset to Draft (Unsubmitted) state for testing.');
    } catch (err: any) {
      showToast(err.message || 'Reset failed');
    }
  };

  const tabs = [
    { id: 'details', label: 'Shop Details' },
    { id: 'documents', label: `Documents (${documents.length})` },
    { id: 'hours', label: 'Operating Hours' },
    { id: 'preview', label: 'Preview' },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hidden inputs for real file uploads */}
      <input
        ref={photoFileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoFileSelected}
      />
      <input
        ref={docFileInputRef}
        type="file"
        accept=".pdf,image/*,.doc,.docx"
        style={{ display: 'none' }}
        onChange={handleDocFileSelected}
      />

      {/* TOP VERIFICATION STATUS BANNER */}
      {isDraft && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '14px 20px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#92400E' }}>
                Profile Incomplete – Action Required
              </div>
              <div style={{ fontSize: 12, color: '#B45309' }}>
                Please fill in all shop attributes and upload verification documents. Once completed, click "Send for Verification" for admin review.
              </div>
            </div>
          </div>
          <button
            onClick={handleSendForVerification}
            disabled={isSubmittingVerification}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 12,
              backgroundColor: '#1C1D21',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            <ShieldCheck size={16} />
            <span>{isSubmittingVerification ? 'Submitting...' : 'Send for Verification'}</span>
          </button>
        </div>
      )}

      {isPending && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: '16px 20px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #3B82F6',
            borderRadius: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E40AF' }}>
                  ⏳ Waiting for Approval
                </div>
                <div style={{ fontSize: 12.5, color: '#1D4ED8' }}>
                  Your shop profile and documents have been submitted to the admin team for verification. Till approved, your profile is under review.
                </div>
              </div>
            </div>

            {/* Quick Admin Simulator Controls for instant end-to-end testing */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button
                onClick={handleAdminApprove}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 10,
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Simulate Admin Verification Approval"
              >
                <CheckCircle2 size={14} />
                <span>Approve Shop (Admin)</span>
              </button>
              <button
                onClick={handleAdminReject}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 10,
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isApproved && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '14px 20px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #10B981',
            borderRadius: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>✓ Verified & Approved</span>
                <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#D1FAE5', color: '#047857', padding: '2px 8px', borderRadius: 10 }}>
                  Active On Network
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#047857' }}>
                Your business credentials are officially verified. Profile attributes are locked for compliance; you can view and download assets below.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 600,
                color: '#047857',
                padding: '6px 12px',
                borderRadius: 10,
                backgroundColor: '#D1FAE5',
              }}
            >
              <Lock size={13} />
              <span>Editing Locked</span>
            </div>
            {/* Discreet button to reset for re-testing lifecycle */}
            <button
              onClick={handleResetToDraft}
              style={{
                background: 'none',
                border: '1px solid #A7F3D0',
                borderRadius: 8,
                padding: '4px 8px',
                fontSize: 10.5,
                color: '#065F46',
                cursor: 'pointer',
              }}
              title="Reset verification state to Draft for testing"
            >
              Test Reset
            </button>
          </div>
        </div>
      )}

      {isRejected && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '14px 20px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #EF4444',
            borderRadius: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <X size={20} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#991B1B' }}>
                Verification Needs Correction
              </div>
              <div style={{ fontSize: 12, color: '#B91C1C' }}>
                {shopData?.rejectionReason || 'Please review your uploaded documents and details, then re-submit for verification.'}
              </div>
            </div>
          </div>
          <button
            onClick={handleSendForVerification}
            style={{
              padding: '8px 16px',
              borderRadius: 12,
              backgroundColor: '#1C1D21',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Re-submit for Verification
          </button>
        </div>
      )}

      {/* TOP SUBTABS */}
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

      {/* TAB 1: DETAILS */}
      {activeTab === 'details' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 16, alignItems: 'start' }}>
          {/* Column 1: Basic Details & Business Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Basic Details Card */}
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
                      {basicForm.shopName || (isDraft ? 'Unregistered Shop Name' : 'Shop Profile')}
                    </h2>
                    <p style={{ fontSize: 12, color: '#6B707B' }}>
                      {basicForm.ownerName ? `Owner: ${basicForm.ownerName}` : 'Standard Prints'}
                    </p>
                  </div>
                </div>

                {isApproved ? (
                  <div
                    title="Profile is verified & locked"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#15803D',
                      backgroundColor: '#DCFCE7',
                      padding: '3px 8px',
                      borderRadius: 10,
                    }}
                  >
                    <Lock size={12} />
                    <span>Locked</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingBasic(prev => !prev)}
                    title={isEditingBasic ? 'Cancel edit' : 'Edit basic details'}
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
                )}
              </div>

              <div style={{ borderTop: '1px solid #EBE7DF', paddingTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Basic Details</span>
                  {isEditingBasic && !isApproved && (
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

                {isEditingBasic && !isApproved ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Shop Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Tirupur Digital Print Hub"
                        value={basicForm.shopName}
                        onChange={e => setBasicForm(f => ({ ...f, shopName: e.target.value }))}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Owner Name</label>
                      <input
                        type="text"
                        placeholder="Owner full name"
                        value={basicForm.ownerName}
                        onChange={e => setBasicForm(f => ({ ...f, ownerName: e.target.value }))}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Description</label>
                      <textarea
                        rows={2}
                        value={basicForm.description}
                        onChange={e => setBasicForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Describe your printing and copying services..."
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Shop Address *</label>
                      <input
                        type="text"
                        placeholder="Door number, street name"
                        value={basicForm.address}
                        onChange={e => setBasicForm(f => ({ ...f, address: e.target.value }))}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>City</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={basicForm.city}
                          onChange={e => setBasicForm(f => ({ ...f, city: e.target.value }))}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Pincode</label>
                        <input
                          type="text"
                          placeholder="6 digits"
                          value={basicForm.pincode}
                          onChange={e => setBasicForm(f => ({ ...f, pincode: e.target.value }))}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Phone Number *</label>
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
                        <div style={{ fontSize: 13, fontWeight: 600, color: basicForm.shopName ? '#1A1C20' : '#9CA3AF' }}>
                          {basicForm.shopName || 'Not entered yet'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <FileText size={15} color="#6B707B" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, color: '#8E929B' }}>Description</div>
                        <div style={{ fontSize: 12.5, color: basicForm.description ? '#555963' : '#9CA3AF', lineHeight: 1.4 }}>
                          {basicForm.description || 'No description provided yet.'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <MapPin size={15} color="#6B707B" style={{ marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 11, color: '#8E929B' }}>Shop Address</div>
                          <div style={{ fontSize: 12.5, color: basicForm.address ? '#555963' : '#9CA3AF' }}>
                            {basicForm.address
                              ? `${basicForm.address}${basicForm.city ? `, ${basicForm.city}` : ''}${basicForm.pincode ? ` - ${basicForm.pincode}` : ''}`
                              : 'Address not entered yet'}
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
                          {basicForm.mobile || '—'}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Business & Tax Info</span>
                {isApproved ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#15803D' }}>
                    <Lock size={12} />
                    <span>Locked</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isEditingBusiness && (
                      <button
                        onClick={handleSaveBusiness}
                        disabled={savingBusiness}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 10,
                          backgroundColor: '#16A34A',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={12} />
                        <span>{savingBusiness ? 'Saving...' : 'Save'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditingBusiness(prev => !prev)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B707B', padding: 2 }}
                    >
                      {isEditingBusiness ? <X size={15} /> : <Edit2 size={14} />}
                    </button>
                  </div>
                )}
              </div>

              {isEditingBusiness && !isApproved ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Business Type</label>
                    <select
                      value={businessForm.businessType}
                      onChange={e => setBusinessForm(f => ({ ...f, businessType: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Print Shop (Retail)">Print Shop (Retail)</option>
                      <option value="Digital Printing Center">Digital Printing Center</option>
                      <option value="Commercial Press">Commercial Press</option>
                      <option value="Xerox & Stationery Store">Xerox & Stationery Store</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>GST Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 33AABCU9603R1ZM"
                      value={businessForm.gstNumber}
                      onChange={e => setBusinessForm(f => ({ ...f, gstNumber: e.target.value.toUpperCase() }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Shop License / Act No</label>
                    <input
                      type="text"
                      placeholder="Trade License number"
                      value={businessForm.shopLicenseNo}
                      onChange={e => setBusinessForm(f => ({ ...f, shopLicenseNo: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>UPI ID for Settlements</label>
                    <input
                      type="text"
                      placeholder="merchant@upi"
                      value={businessForm.upiId}
                      onChange={e => setBusinessForm(f => ({ ...f, upiId: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5 }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: '#555963' }}>Business Type</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1C20' }}>
                      {businessForm.businessType}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: '#555963' }}>GST Number</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: businessForm.gstNumber ? '#1A1C20' : '#9CA3AF' }}>
                        {businessForm.gstNumber || 'Not added'}
                      </span>
                      {businessForm.gstNumber && isApproved && (
                        <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 12 }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: '#555963' }}>Shop License</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: businessForm.shopLicenseNo ? '#1A1C20' : '#9CA3AF' }}>
                      {businessForm.shopLicenseNo || 'Not added'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: '#555963' }}>UPI Settlement</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: businessForm.upiId ? '#1A1C20' : '#9CA3AF' }}>
                      {businessForm.upiId || 'Not configured'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Services, Photos, Documents */}
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
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 12 }}>
                Active printing services enabled for your shop.
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
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>
                  Shop Photos ({photos.length})
                </span>
                {isApproved && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#15803D' }}>View & Download only</span>
                )}
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 12 }}>
                {photos.length === 0
                  ? 'No photos uploaded yet. Add storefront and equipment photos.'
                  : 'Storefront, machinery, and sample print photos.'}
              </p>

              {photos.length === 0 ? (
                <div
                  style={{
                    padding: '24px 16px',
                    borderRadius: 12,
                    border: '1.5px dashed #DAD5CB',
                    backgroundColor: '#FAF8F5',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Camera size={26} color="#8E929B" />
                  <div style={{ fontSize: 12, color: '#6B707B' }}>No shop photos uploaded yet</div>
                  {!isApproved && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button
                        onClick={() => photoFileInputRef.current?.click()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 10,
                          backgroundColor: '#1C1D21',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={13} />
                        <span>Upload Photo</span>
                      </button>
                      <button
                        onClick={() => handleAddSamplePhoto('Storefront Entrance')}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 10,
                          backgroundColor: '#EBE7DF',
                          color: '#1C1D21',
                          border: '1px solid #DAD5CB',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        + Sample Storefront
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {photos.map(p => (
                    <div
                      key={p.id}
                      style={{
                        position: 'relative',
                        borderRadius: 10,
                        overflow: 'hidden',
                        border: '1px solid #DAD5CB',
                        backgroundColor: '#1E2028',
                        height: 90,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.45)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          opacity: 0.95,
                        }}
                      >
                        <button
                          onClick={() => setPreviewAsset({ name: p.name, url: p.url, type: 'image' })}
                          title="View Photo"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            color: '#1C1D21',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleDownloadAsset(p.url, p.name)}
                          title="Download Photo"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            color: '#1C1D21',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Download size={13} />
                        </button>
                        {!isApproved && (
                          <button
                            onClick={() => handleRemovePhoto(p.id)}
                            title="Delete Photo"
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              backgroundColor: '#EF4444',
                              border: 'none',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 2,
                          backgroundColor: 'rgba(0,0,0,0.65)',
                          color: '#FFFFFF',
                          fontSize: 9.5,
                          padding: '2px 4px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.name}
                      </div>
                    </div>
                  ))}

                  {!isApproved && (
                    <div
                      onClick={() => photoFileInputRef.current?.click()}
                      style={{
                        height: 90,
                        borderRadius: 10,
                        border: '1.5px dashed #DAD5CB',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#8E929B',
                        backgroundColor: '#FAF8F5',
                      }}
                    >
                      <Plus size={18} />
                      <span style={{ fontSize: 10, fontWeight: 600, marginTop: 4 }}>Add Photo</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Verification Documents Summary */}
            <div
              style={{
                backgroundColor: theme.colors.creamCard,
                border: `1px solid ${theme.colors.creamCardBorder}`,
                borderRadius: 18,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>
                  Verification Documents ({documents.length})
                </span>
                <span
                  onClick={() => setActiveTab('documents')}
                  style={{ fontSize: 11.5, color: '#3B82F6', fontWeight: 600, cursor: 'pointer' }}
                >
                  Manage →
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 12 }}>
                {isApproved
                  ? 'Official business proofs verified by Prinkout Admin.'
                  : 'Upload GST certificate and shop proofs for approval.'}
              </p>

              {documents.length === 0 ? (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 10,
                    backgroundColor: '#FAF8F5',
                    border: '1px dashed #DAD5CB',
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#8E929B',
                  }}
                >
                  No documents uploaded yet. Go to the Documents tab to upload proofs.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {documents.slice(0, 3).map(doc => (
                    <div
                      key={doc.id}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <FileText size={15} color="#6B707B" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1C20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.name || doc.type}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => setPreviewAsset({ name: doc.name, url: doc.url, type: 'doc' })}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 8,
                            backgroundColor: '#EBE7DF',
                            border: 'none',
                            color: '#1A1C20',
                            fontSize: 10.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <Eye size={11} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadAsset(doc.url, doc.name)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 8,
                            backgroundColor: '#1C1D21',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: 10.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <Download size={11} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Status & Public Profile Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Verification Status Card */}
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
                {isApproved && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                    ● Active & Live
                  </span>
                )}
                {isPending && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#1E40AF', backgroundColor: '#DBEAFE', padding: '2px 8px', borderRadius: 12 }}>
                    ⏳ Under Review
                  </span>
                )}
                {isDraft && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: 12 }}>
                    ● Incomplete
                  </span>
                )}
                {isRejected && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: 12 }}>
                    ✕ Rejected
                  </span>
                )}
              </div>

              <p style={{ fontSize: 12, color: '#555963', lineHeight: 1.4, marginBottom: 14 }}>
                {isApproved
                  ? 'Your shop is live and accepting customer orders on the Prinkout network.'
                  : isPending
                  ? 'Profile submitted for admin approval. You will receive an alert once approved.'
                  : 'Complete shop details and business documents, then submit for verification.'}
              </p>

              {isDraft && (
                <button
                  onClick={handleSendForVerification}
                  disabled={isSubmittingVerification}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    backgroundColor: '#1C1D21',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Send for Verification</span>
                </button>
              )}

              {isPending && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      fontSize: 11.5,
                      color: '#1E40AF',
                      lineHeight: 1.4,
                    }}
                  >
                    Submitted on {shopData?.verificationSubmittedAt ? new Date(shopData.verificationSubmittedAt).toLocaleDateString() : 'Today'}
                  </div>
                  <button
                    onClick={handleAdminApprove}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      borderRadius: 10,
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Simulate Admin Approval
                  </button>
                </div>
              )}

              {isApproved && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    fontSize: 11.5,
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>Verified & Approved</span>
                </div>
              )}
            </div>

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
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>Customer View</span>
                <ExternalLink size={14} color="#6B707B" style={{ cursor: 'pointer' }} />
              </div>
              <p style={{ fontSize: 11.5, color: '#8E929B', marginBottom: 14 }}>
                Live card view in customer mobile app.
              </p>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #E5E1D6',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    height: 100,
                    backgroundColor: '#1E2028',
                    backgroundImage: 'linear-gradient(145deg, #111215, #2F3342)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    padding: 8,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    {basicForm.shopName || 'Shop Preview'}
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                    {basicForm.city || 'Tamil Nadu'}
                  </div>
                </div>

                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#555963', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <span><b>{shopData?.ratings || 4.8}</b> ({orders?.length > 0 ? `${orders.length} orders` : 'New'})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={12} />
                      <span>{basicForm.city || 'Local Store'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: '#F3F4F6',
                        color: '#4B5563',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      Standard Prints
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>
                  Business Verification Assets
                </h3>
                <p style={{ fontSize: 12.5, color: '#6B707B', marginTop: 2 }}>
                  {isApproved
                    ? 'Your documents have been verified and approved. Assets are locked for security; download copies anytime.'
                    : 'Upload official business proofs to get your shop approved for live orders.'}
                </p>
              </div>

              {isApproved && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 14,
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <Lock size={14} />
                  <span>Verified & Locked</span>
                </div>
              )}
            </div>

            {/* Document Slots */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 18 }}>
              {[
                { type: 'GST Certificate', label: 'GST Registration / Declaration', desc: 'Form GST REG-06 or tax registration letter' },
                { type: 'Shop Proof (Rent/Bill)', label: 'Shop Establishment Proof', desc: 'Rent agreement, electricity bill, or trade license' },
                { type: 'Owner Aadhaar / ID', label: 'Identity Proof', desc: 'Government issued Aadhaar or PAN card of shop owner' },
              ].map(slot => {
                const doc = documents.find(d => d.type === slot.type);
                return (
                  <div
                    key={slot.type}
                    style={{
                      borderRadius: 14,
                      border: doc ? '1px solid #10B981' : '1.5px dashed #DAD5CB',
                      backgroundColor: doc ? '#FAFDFB' : '#FAF8F5',
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 200,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            backgroundColor: doc ? '#DCFCE7' : '#EFECE4',
                            color: doc ? '#15803D' : '#6B707B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FileText size={18} />
                        </div>
                        {doc ? (
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: 10 }}>
                            {isApproved ? '✓ Verified' : '● Uploaded'}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
                            Missing
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1A1C20', marginBottom: 4 }}>
                        {slot.label}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#6B707B', lineHeight: 1.4, marginBottom: 12 }}>
                        {slot.desc}
                      </div>

                      {doc && (
                        <div style={{ fontSize: 11, color: '#047857', backgroundColor: '#ECFDF5', padding: '6px 8px', borderRadius: 8, marginBottom: 12 }}>
                          <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.name}
                          </div>
                          <div style={{ color: '#059669', fontSize: 10 }}>{doc.size || 'PDF Document'}</div>
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid #EBE7DF', paddingTop: 12 }}>
                      {doc ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            onClick={() => setPreviewAsset({ name: doc.name, url: doc.url, type: 'doc' })}
                            style={{
                              flex: 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                              padding: '7px 0',
                              borderRadius: 10,
                              backgroundColor: '#1C1D21',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: 11.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleDownloadAsset(doc.url, doc.name)}
                            style={{
                              flex: 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                              padding: '7px 0',
                              borderRadius: 10,
                              backgroundColor: '#EBE7DF',
                              color: '#1A1C20',
                              border: '1px solid #DAD5CB',
                              fontSize: 11.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Download size={12} />
                            <span>Download</span>
                          </button>
                          {!isApproved && (
                            <button
                              onClick={() => handleRemoveDoc(doc.id)}
                              style={{
                                padding: '7px 8px',
                                borderRadius: 10,
                                backgroundColor: '#FEE2E2',
                                color: '#DC2626',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <button
                            onClick={() => {
                              setPendingDocType(slot.type);
                              docFileInputRef.current?.click();
                            }}
                            style={{
                              width: '100%',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                              padding: '8px 0',
                              borderRadius: 10,
                              backgroundColor: '#1C1D21',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: 11.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Upload size={13} />
                            <span>Upload Document</span>
                          </button>
                          <button
                            onClick={() => handleUploadSampleDoc(slot.type)}
                            style={{
                              width: '100%',
                              padding: '5px 0',
                              borderRadius: 8,
                              backgroundColor: '#FAF8F5',
                              border: '1px solid #DAD5CB',
                              fontSize: 10.5,
                              color: '#6B707B',
                              cursor: 'pointer',
                            }}
                          >
                            + Use Verified Sample
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPERATING HOURS */}
      {activeTab === 'hours' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              backgroundColor: theme.colors.creamCard,
              border: `1px solid ${theme.colors.creamCardBorder}`,
              borderRadius: 18,
              padding: '20px 24px',
              maxWidth: 700,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1C20' }}>Operating Hours & Days</h3>
                <p style={{ fontSize: 12.5, color: '#6B707B', marginTop: 2 }}>
                  Set the hours your store is open for printing and customer pickups.
                </p>
              </div>

              {!isApproved ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  {isEditingHours && (
                    <button
                      onClick={handleSaveHours}
                      disabled={savingHours}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 12px',
                        borderRadius: 10,
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Check size={13} />
                      <span>{savingHours ? 'Saving...' : 'Save Hours'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsEditingHours(prev => !prev)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B707B' }}
                  >
                    {isEditingHours ? <X size={16} /> : <Edit2 size={16} />}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#15803D' }}>
                  <Lock size={13} />
                  <span>Verified & Locked</span>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 4 }}>Opening Time</label>
                <input
                  type="time"
                  disabled={!isEditingHours || isApproved}
                  value={hoursForm.openingTime}
                  onChange={e => setHoursForm(h => ({ ...h, openingTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #DAD5CB',
                    fontSize: 13,
                    backgroundColor: isEditingHours && !isApproved ? '#FFFFFF' : '#FAF8F5',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 4 }}>Closing Time</label>
                <input
                  type="time"
                  disabled={!isEditingHours || isApproved}
                  value={hoursForm.closingTime}
                  onChange={e => setHoursForm(h => ({ ...h, closingTime: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #DAD5CB',
                    fontSize: 13,
                    backgroundColor: isEditingHours && !isApproved ? '#FFFFFF' : '#FAF8F5',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 8 }}>Working Days</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const isChecked = hoursForm.workingDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={!isEditingHours || isApproved}
                      onClick={() => {
                        if (!isEditingHours || isApproved) return;
                        setHoursForm(h => ({
                          ...h,
                          workingDays: isChecked ? h.workingDays.filter(d => d !== day) : [...h.workingDays, day],
                        }));
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 14,
                        border: `1px solid ${isChecked ? '#1C1D21' : '#DAD5CB'}`,
                        backgroundColor: isChecked ? '#1C1D21' : '#FAF8F5',
                        color: isChecked ? '#FFFFFF' : '#6B707B',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: isEditingHours && !isApproved ? 'pointer' : 'default',
                      }}
                    >
                      {isChecked ? '✓ ' : ''}{day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PREVIEW */}
      {activeTab === 'preview' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: 380,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid #E5E1D6',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                height: 140,
                backgroundColor: '#1E2028',
                backgroundImage: 'linear-gradient(145deg, #111215, #2F3342)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                padding: 16,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {basicForm.shopName || 'Shop Preview'}
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                {basicForm.address || 'Address'}
              </div>
            </div>

            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#6B707B' }}>Status</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: isApproved ? '#15803D' : '#92400E', backgroundColor: isApproved ? '#DCFCE7' : '#FEF3C7', padding: '2px 8px', borderRadius: 10 }}>
                  {isApproved ? 'Verified & Open' : 'Pending Verification'}
                </span>
              </div>

              <div style={{ fontSize: 12.5, color: '#555963', lineHeight: 1.5, marginBottom: 16 }}>
                {basicForm.description || 'No description provided.'}
              </div>

              <div style={{ borderTop: '1px solid #EBE7DF', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#6B707B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={13} />
                  <span>{basicForm.mobile || '—'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={13} />
                  <span>{hoursForm.openingTime} – {hoursForm.closingTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW & DOWNLOAD ASSET */}
      {previewAsset && (
        <div
          onClick={() => setPreviewAsset(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 680,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid #EBE7DF',
                backgroundColor: '#FAF8F5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <FileText size={16} color="#1C1D21" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {previewAsset.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => handleDownloadAsset(previewAsset.url, previewAsset.name)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 10,
                    backgroundColor: '#1C1D21',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setPreviewAsset(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    color: '#6B707B',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div
              style={{
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F3F4F6',
                overflow: 'auto',
                minHeight: 380,
              }}
            >
              <img
                src={previewAsset.url}
                alt={previewAsset.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
