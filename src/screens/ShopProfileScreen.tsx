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
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { theme } from '../theme';
import { resolveCityFromLocation, cleanCityName } from '../utils/locationUtils';
import { LocationPickerModal, LocationData } from '../components/LocationPickerModal';

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

const resolveDocUrl = (url?: string) => {
  if (!url) return '';
  if (url.includes('.s3.') && url.includes('amazonaws.com')) {
    return `http://localhost:5000/api/v1/files/document-preview?url=${encodeURIComponent(url)}`;
  }
  return url;
};

export const ShopProfileScreen: React.FC = () => {
  const {
    shopId,
    shopData,
    setShopData,
    orders,
    showToast,
    openSubmissionModal,
    profileTab,
    setProfileTab,
    setSetupStep,
  } = useMerchant();
  const activeTab = profileTab || 'details';
  const setActiveTab = (tab: any) => setProfileTab(tab);

  // Verification status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  const verificationStatus: 'draft' | 'pending_approval' | 'approved' | 'rejected' =
    shopData?.verificationStatus || (shopData?.isVerified ? 'approved' : 'draft');

  const isApproved = verificationStatus === 'approved';
  const isPending = verificationStatus === 'pending_approval';
  const isDraft = verificationStatus === 'draft';
  const isRejected = verificationStatus === 'rejected';

  // Section editing states: default to edit mode during onboarding / unapproved
  const [isEditingBasic, setIsEditingBasic] = useState(!isApproved);
  const [isEditingBusiness, setIsEditingBusiness] = useState(!isApproved);
  const [isEditingHours, setIsEditingHours] = useState(!isApproved);

  const [savingBasic, setSavingBasic] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [hasResubmitted, setHasResubmitted] = useState(false);

  // Auto-save debounce timer and status indicator
  const autoSaveTimerRef = useRef<any>(null);
  const autoSaveApiTimerRef = useRef<any>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null);

  // Step 1: Shop Details - First show shop details tab on mount
  useEffect(() => {
    setProfileTab('details');
  }, []);

  // When switching to a tab, keep components in edit mode if unapproved
  useEffect(() => {
    if (!isApproved) {
      if (activeTab === 'hours') setIsEditingHours(true);
      if (activeTab === 'details') {
        setIsEditingBasic(true);
        setIsEditingBusiness(true);
      }
    }
  }, [activeTab, isApproved]);

  // Hidden file inputs
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const [pendingDocType, setPendingDocType] = useState<string>('GST Certificate');

  // Preview Modal state
  const [previewAsset, setPreviewAsset] = useState<{ name: string; url: string; type: string } | null>(null);

  // Location Picker state
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);

  const handleLocationSelected = (loc: LocationData) => {
    const updated = {
      ...basicForm,
      address: loc.address,
      area: loc.area || basicForm.area,
      city: loc.city || basicForm.city,
      pincode: loc.pincode || basicForm.pincode,
    };
    setBasicForm(updated);
    autoSaveBasic(updated);
    if (shopId) {
      merchantApi.updateShopProfile(shopId, {
        latitude: loc.latitude,
        longitude: loc.longitude,
        address: loc.address,
        area: loc.area,
        city: loc.city,
        pincode: loc.pincode,
      }).catch(() => {});
    }
    showToast(`📍 Location updated: ${loc.city} (${loc.pincode})`);
  };

  // Forms
  const [basicForm, setBasicForm] = useState(() => {
    const initCity = resolveCityFromLocation(shopData?.pincode, shopData?.address, shopData?.city);
    return {
      shopName: shopData?.shopName || '',
      description: shopData?.description || '',
      address: shopData?.address || '',
      area: shopData?.area || '',
      city: initCity,
      pincode: shopData?.pincode || '',
      mobile: shopData?.mobile || '',
      ownerName: shopData?.ownerName || '',
    };
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
    if (Array.isArray(shopData?.documents) && shopData.documents.length > 0) return shopData.documents;
    try {
      const raw = localStorage.getItem('prinkout_merchant_session');
      if (raw) {
        const sess = JSON.parse(raw);
        if (Array.isArray(sess?.shopData?.documents) && sess.shopData.documents.length > 0) {
          return sess.shopData.documents;
        }
      }
    } catch {}
    return [];
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    if (Array.isArray(shopData?.photos) && shopData.photos.length > 0) {
      return shopData.photos.map((p: any, idx: number) => {
        if (typeof p === 'string') return { id: `photo_${idx}`, name: `Photo ${idx + 1}`, url: p, uploadedAt: new Date().toISOString() };
        return p;
      });
    }
    try {
      const raw = localStorage.getItem('prinkout_merchant_session');
      if (raw) {
        const sess = JSON.parse(raw);
        if (Array.isArray(sess?.shopData?.photos) && sess.shopData.photos.length > 0) {
          return sess.shopData.photos.map((p: any, idx: number) => {
            if (typeof p === 'string') return { id: `photo_${idx}`, name: `Photo ${idx + 1}`, url: p, uploadedAt: new Date().toISOString() };
            return p;
          });
        }
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    if (shopData) {
      const resolvedCity = resolveCityFromLocation(
        shopData.pincode,
        shopData.address,
        shopData.city
      );

      setBasicForm({
        shopName: shopData.shopName || '',
        description: shopData.description || '',
        address: shopData.address || '',
        area: shopData.area || '',
        city: resolvedCity,
        pincode: shopData.pincode || '',
        mobile: shopData.mobile || '',
        ownerName: shopData.ownerName || '',
      });

      // If shopData had 'General' or empty city, fix it in shopData and persist
      if ((!shopData.city || shopData.city.toLowerCase() === 'general') && resolvedCity) {
        setShopData((prev: any) => ({ ...prev, city: resolvedCity }));
        if (shopId) {
          merchantApi.updateShopProfile(shopId, { city: resolvedCity }).catch(() => {});
        }
        try {
          const raw = localStorage.getItem('prinkout_merchant_session');
          if (raw) {
            const sess = JSON.parse(raw);
            if (sess.shopData) {
              sess.shopData.city = resolvedCity;
              localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
            }
          }
        } catch {}
      }
      setBusinessForm(prev => ({
        businessType: shopData.businessType || prev.businessType || 'Print Shop (Retail)',
        gstNumber: shopData.gstNumber !== undefined ? (shopData.gstNumber || prev.gstNumber) : prev.gstNumber,
        shopLicenseNo: shopData.shopLicenseNo !== undefined ? (shopData.shopLicenseNo || prev.shopLicenseNo) : prev.shopLicenseNo,
        upiId: shopData.upiId !== undefined ? (shopData.upiId || prev.upiId) : prev.upiId,
      }));
      setHoursForm({
        openingTime: shopData.openingTime || '09:00',
        closingTime: shopData.closingTime || '21:00',
        workingDays: shopData.workingDays && shopData.workingDays.length > 0
          ? shopData.workingDays
          : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      });
      if (Array.isArray(shopData.documents) && shopData.documents.length > 0) {
        setDocuments(shopData.documents);
      } else {
        try {
          const raw = localStorage.getItem('prinkout_merchant_session');
          if (raw) {
            const sess = JSON.parse(raw);
            if (Array.isArray(sess?.shopData?.documents) && sess.shopData.documents.length > 0) {
              setDocuments(sess.shopData.documents);
            }
          }
        } catch {}
      }
      if (Array.isArray(shopData.photos) && shopData.photos.length > 0) {
        setPhotos(shopData.photos.map((p: any, idx: number) => {
          if (typeof p === 'string') return { id: `photo_${idx}`, name: `Photo ${idx + 1}`, url: p, uploadedAt: new Date().toISOString() };
          return p;
        }));
      } else if (!shopData.photos) {
        try {
          const raw = localStorage.getItem('prinkout_merchant_session');
          if (raw) {
            const sess = JSON.parse(raw);
            if (Array.isArray(sess?.shopData?.photos) && sess.shopData.photos.length > 0) {
              setPhotos(sess.shopData.photos.map((p: any, idx: number) => {
                if (typeof p === 'string') return { id: `photo_${idx}`, name: `Photo ${idx + 1}`, url: p, uploadedAt: new Date().toISOString() };
                return p;
              }));
            }
          }
        } catch {}
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

  // Auto-save helper for Basic Details (updates context, localStorage, and debounces backend API update)
  const autoSaveBasic = (form: typeof basicForm) => {
    if (hasResubmitted) setHasResubmitted(false);
    const cleanCity = resolveCityFromLocation(form.pincode, form.address, form.city);
    const updated = {
      ...form,
      city: cleanCity || form.city,
    };
    setShopData((prev: any) => ({ ...prev, ...updated }));
    try {
      const raw = localStorage.getItem('prinkout_merchant_session');
      if (raw) {
        const sess = JSON.parse(raw);
        sess.shopData = { ...(sess.shopData || {}), ...updated };
        localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
      }
    } catch {}

    setAutoSaveStatus('saving');
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (autoSaveApiTimerRef.current) clearTimeout(autoSaveApiTimerRef.current);

    autoSaveApiTimerRef.current = setTimeout(async () => {
      const activeShopId = shopId || shopData?.shopId;
      if (activeShopId) {
        try {
          await merchantApi.updateShopProfile(activeShopId, updated);
          setAutoSaveStatus('saved');
        } catch (e) {
          console.warn('Auto-save basic API warning:', e);
        }
      } else {
        setAutoSaveStatus('saved');
      }
      autoSaveTimerRef.current = setTimeout(() => {
        setAutoSaveStatus(null);
      }, 2000);
    }, 600);
  };

  // Auto-save helper for Business Details (updates context, localStorage, and debounces backend API update)
  const autoSaveBusiness = (form: typeof businessForm) => {
    if (hasResubmitted) setHasResubmitted(false);
    setShopData((prev: any) => ({ ...prev, ...form }));
    try {
      const raw = localStorage.getItem('prinkout_merchant_session');
      if (raw) {
        const sess = JSON.parse(raw);
        sess.shopData = { ...(sess.shopData || {}), ...form };
        localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
      }
    } catch {}

    setAutoSaveStatus('saving');
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (autoSaveApiTimerRef.current) clearTimeout(autoSaveApiTimerRef.current);

    autoSaveApiTimerRef.current = setTimeout(async () => {
      const activeShopId = shopId || shopData?.shopId;
      if (activeShopId) {
        try {
          await merchantApi.updateShopProfile(activeShopId, form);
          setAutoSaveStatus('saved');
        } catch (e) {
          console.warn('Auto-save business API warning:', e);
        }
      } else {
        setAutoSaveStatus('saved');
      }
      autoSaveTimerRef.current = setTimeout(() => {
        setAutoSaveStatus(null);
      }, 2000);
    }, 600);
  };

  // Auto-save helper for Operating Hours (updates context, localStorage, and debounces backend API update)
  const autoSaveHours = (form: typeof hoursForm) => {
    if (hasResubmitted) setHasResubmitted(false);
    setShopData((prev: any) => ({ ...prev, ...form }));
    try {
      const raw = localStorage.getItem('prinkout_merchant_session');
      if (raw) {
        const sess = JSON.parse(raw);
        sess.shopData = { ...(sess.shopData || {}), ...form };
        localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
      }
    } catch {}

    setAutoSaveStatus('saving');
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (autoSaveApiTimerRef.current) clearTimeout(autoSaveApiTimerRef.current);

    autoSaveApiTimerRef.current = setTimeout(async () => {
      const activeShopId = shopId || shopData?.shopId;
      if (activeShopId) {
        try {
          await merchantApi.updateShopProfile(activeShopId, form);
          setAutoSaveStatus('saved');
        } catch (e) {
          console.warn('Auto-save hours API warning:', e);
        }
      } else {
        setAutoSaveStatus('saved');
      }
      autoSaveTimerRef.current = setTimeout(() => {
        setAutoSaveStatus(null);
      }, 2000);
    }, 600);
  };

  // Initialize default hours on mount if not yet configured
  useEffect(() => {
    if (shopData && !isApproved) {
      const hasHours = shopData.openingTime && shopData.closingTime && Array.isArray(shopData.workingDays) && shopData.workingDays.length > 0;
      if (!hasHours) {
        const defaultHours = {
          openingTime: shopData.openingTime || '09:00',
          closingTime: shopData.closingTime || '21:00',
          workingDays: Array.isArray(shopData.workingDays) && shopData.workingDays.length > 0
            ? shopData.workingDays
            : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        };
        setHoursForm(defaultHours);
        setShopData((prev: any) => ({ ...prev, ...defaultHours }));
        try {
          const raw = localStorage.getItem('prinkout_merchant_session');
          if (raw) {
            const sess = JSON.parse(raw);
            sess.shopData = { ...(sess.shopData || {}), ...defaultHours };
            localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
          }
        } catch {}
        if (shopId) {
          merchantApi.updateShopProfile(shopId, defaultHours).catch(() => {});
        }
      }
    }
  }, [shopData?.shopId, shopData?.openingTime, shopData?.closingTime, isApproved]);

  // Save Basic Details
  const handleSaveBasic = async () => {
    try {
      setSavingBasic(true);
      const cleanCity = resolveCityFromLocation(basicForm.pincode, basicForm.address, basicForm.city);
      const updatedBasic = {
        ...basicForm,
        city: cleanCity || basicForm.city,
      };
      setBasicForm(updatedBasic);
      const payload = isApproved
        ? { description: basicForm.description }
        : updatedBasic;
      if (shopId) {
        await merchantApi.updateShopProfile(shopId, payload);
      }
      setShopData((prev: any) => ({ ...prev, ...payload }));
      if (isApproved) {
        setIsEditingBasic(false);
      }
      showToast('Shop details saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update shop details');
    } finally {
      setSavingBasic(false);
    }
  };

  // Save Business Info
  const handleSaveBusiness = async () => {
    try {
      setSavingBusiness(true);
      const payload = isApproved ? { upiId: businessForm.upiId } : businessForm;
      if (shopId) {
        await merchantApi.updateShopProfile(shopId, payload);
      }
      setShopData((prev: any) => ({ ...prev, ...payload }));
      try {
        const raw = localStorage.getItem('prinkout_merchant_session');
        if (raw) {
          const session = JSON.parse(raw);
          session.shopData = { ...(session.shopData || {}), ...payload };
          localStorage.setItem('prinkout_merchant_session', JSON.stringify(session));
        }
      } catch (e) {}
      if (isApproved) {
        setIsEditingBusiness(false);
      }
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
      if (isApproved) {
        setIsEditingHours(false);
      }
      showToast('Operating hours saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update operating hours');
    } finally {
      setSavingHours(false);
    }
  };

  const persistSessionDocs = (newDocs: DocItem[]) => {
    if (hasResubmitted) setHasResubmitted(false);
    try {
      const raw = localStorage.getItem('prinkout_merchant_session');
      if (raw) {
        const sess = JSON.parse(raw);
        sess.shopData = { ...(sess.shopData || {}), documents: newDocs };
        localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
      }
    } catch {}
  };

  const persistSessionPhotos = (newPhotos: PhotoItem[]) => {
    if (hasResubmitted) setHasResubmitted(false);
    try {
      const raw = localStorage.getItem('prinkout_merchant_session');
      if (raw) {
        const sess = JSON.parse(raw);
        sess.shopData = { ...(sess.shopData || {}), photos: newPhotos };
        localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
      }
    } catch {}
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
      persistSessionDocs(updated);
      if (shopId) {
        try {
          const res = await merchantApi.updateShopProfile(shopId, { documents: updated });
          if (res?.documents && Array.isArray(res.documents) && res.documents.length > 0) {
            setDocuments(res.documents);
            setShopData((prev: any) => ({ ...prev, documents: res.documents }));
            persistSessionDocs(res.documents);
          }
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
    persistSessionDocs(updated);
    if (shopId) {
      try {
        const res = await merchantApi.updateShopProfile(shopId, { documents: updated });
        if (res?.documents && Array.isArray(res.documents) && res.documents.length > 0) {
          setDocuments(res.documents);
          setShopData((prev: any) => ({ ...prev, documents: res.documents }));
          persistSessionDocs(res.documents);
        }
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
    persistSessionDocs(updated);
    if (shopId) {
      try {
        const res = await merchantApi.updateShopProfile(shopId, { documents: updated });
        if (res?.documents && Array.isArray(res.documents)) {
          setDocuments(res.documents);
          setShopData((prev: any) => ({ ...prev, documents: res.documents }));
          persistSessionDocs(res.documents);
        }
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
      persistSessionPhotos(updated);
      if (shopId) {
        try {
          const res = await merchantApi.updateShopProfile(shopId, { photos: updated });
          if (res?.photos && Array.isArray(res.photos) && res.photos.length > 0) {
            setPhotos(res.photos);
            setShopData((prev: any) => ({ ...prev, photos: res.photos }));
            persistSessionPhotos(res.photos);
          }
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
    persistSessionPhotos(updated);
    if (shopId) {
      try {
        const res = await merchantApi.updateShopProfile(shopId, { photos: updated });
        if (res?.photos && Array.isArray(res.photos) && res.photos.length > 0) {
          setPhotos(res.photos);
          setShopData((prev: any) => ({ ...prev, photos: res.photos }));
          persistSessionPhotos(res.photos);
        }
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
    persistSessionPhotos(updated);
    if (shopId) {
      try {
        const res = await merchantApi.updateShopProfile(shopId, { photos: updated });
        if (res?.photos && Array.isArray(res.photos)) {
          setPhotos(res.photos);
          setShopData((prev: any) => ({ ...prev, photos: res.photos }));
          persistSessionPhotos(res.photos);
        }
      } catch {}
    }
    showToast('Photo removed.');
  };

  // Download Asset helper
  const handleDownloadAsset = (url: string, filename: string) => {
    const finalUrl = url.includes('.s3.') && url.includes('amazonaws.com')
      ? `http://localhost:5000/api/v1/files/document-preview?url=${encodeURIComponent(url)}&download=1`
      : url;
    const a = document.createElement('a');
    a.href = finalUrl;
    a.download = filename || 'prinkout_verified_asset';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloading ${filename}...`);
  };

  // Tab Completeness & Detail-by-Detail Progress Tracking
  const resolvedCurrentCity = resolveCityFromLocation(basicForm.pincode, basicForm.address, basicForm.city);
  const tab1Missing: string[] = [];
  if (!basicForm.shopName?.trim()) tab1Missing.push('Shop Name');
  if (!basicForm.address?.trim()) tab1Missing.push('Shop Address');
  if (!resolvedCurrentCity) tab1Missing.push('City (Location)');
  if (!basicForm.pincode?.trim() || !/^\d{6}$/.test(basicForm.pincode.trim())) tab1Missing.push('6-digit Pincode');
  if (!basicForm.mobile?.trim() || !/^(?:\+91)?[6-9]\d{9}$/.test(basicForm.mobile.trim())) tab1Missing.push('10-digit Phone Number');
  if (!businessForm.upiId?.trim() || !businessForm.upiId.includes('@')) tab1Missing.push('Valid UPI ID (for payouts)');

  const tab2Missing: string[] = [];
  if (!Array.isArray(documents) || documents.length === 0) {
    tab2Missing.push('At least 1 Business / KYC Document (or use sample)');
  }
  if (!Array.isArray(photos) || photos.length === 0) {
    tab2Missing.push('At least 1 Storefront Photo (or use sample)');
  }

  const tab3Missing: string[] = [];
  const currentOpening = hoursForm.openingTime || '09:00';
  const currentClosing = hoursForm.closingTime || '21:00';
  const currentDays = hoursForm.workingDays && hoursForm.workingDays.length > 0
    ? hoursForm.workingDays
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (!currentOpening.trim()) tab3Missing.push('Opening Time');
  if (!currentClosing.trim()) tab3Missing.push('Closing Time');
  if (!currentDays || currentDays.length === 0) tab3Missing.push('At least 1 Working Day');

  const isTab1Filled = tab1Missing.length === 0;
  const isTab2Filled = tab2Missing.length === 0;
  const isTab3Filled = tab3Missing.length === 0;
  const isAllTabsFilled = isTab1Filled && isTab2Filled && isTab3Filled;

  // Real-time detail completion count
  const profileDetails = [
    Boolean(basicForm.shopName?.trim()),
    Boolean(basicForm.address?.trim()),
    Boolean(resolvedCurrentCity),
    Boolean(basicForm.pincode?.trim() && /^\d{6}$/.test(basicForm.pincode.trim())),
    Boolean(basicForm.mobile?.trim() && /^(?:\+91)?[6-9]\d{9}$/.test(basicForm.mobile.trim())),
    Boolean(businessForm.upiId?.trim() && businessForm.upiId.includes('@')),
    Boolean(documents.length > 0 || photos.length > 0),
    Boolean(hoursForm.openingTime?.trim() && hoursForm.closingTime?.trim()),
    Boolean(hoursForm.workingDays && hoursForm.workingDays.length > 0),
  ];
  const filledProfileDetailsCount = profileDetails.filter(Boolean).length;
  const profileProgressPercent = Math.round((filledProfileDetailsCount / profileDetails.length) * 100);

  // Send Profile for Verification (Single unified API call dispatching all shop details together)
  const handleSendForVerification = async () => {
    if (!isAllTabsFilled) {
      showToast('Please complete all tabs (Shop Details, Documents, Operating Hours) before submitting.');
      return;
    }
    const cleanCity = resolveCityFromLocation(basicForm.pincode, basicForm.address, basicForm.city);
    const updatedBasic = {
      ...basicForm,
      city: cleanCity || basicForm.city,
    };
    setBasicForm(updatedBasic);
    const payload = {
      ...(shopData || {}),
      ...updatedBasic,
      ...businessForm,
      ...hoursForm,
      documents,
      photos,
      isSetupCompleted: true,
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
          setShopData((prev: any) => ({ ...prev, ...result, isSetupCompleted: true, verificationStatus: 'pending_approval' }));
        } else {
          setShopData((prev: any) => ({ ...prev, ...payload, isSetupCompleted: true, verificationStatus: 'pending_approval' }));
        }
      } else {
        setShopData((prev: any) => ({ ...prev, ...payload, isSetupCompleted: true, verificationStatus: 'pending_approval' }));
      }
      try {
        const raw = localStorage.getItem('prinkout_merchant_session');
        if (raw) {
          const sess = JSON.parse(raw);
          sess.shopData = { ...(sess.shopData || {}), ...payload };
          localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
        }
      } catch {}
      setHasResubmitted(true);
      openSubmissionModal();
      showToast('Shop profile sent for admin verification!');
    } catch (err: any) {
      console.warn('sendShopForVerification API error, falling back to local state:', err);
      setShopData((prev: any) => ({ ...prev, ...payload, isSetupCompleted: true, verificationStatus: 'pending_approval' }));
      try {
        const raw = localStorage.getItem('prinkout_merchant_session');
        if (raw) {
          const sess = JSON.parse(raw);
          sess.shopData = { ...(sess.shopData || {}), ...payload };
          localStorage.setItem('prinkout_merchant_session', JSON.stringify(sess));
        }
      } catch {}
      setHasResubmitted(true);
      openSubmissionModal();
      showToast('Shop profile submitted for verification!');
    } finally {
      setIsSubmittingVerification(false);
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
            padding: '16px 20px',
            backgroundColor: isAllTabsFilled ? '#ECFDF5' : '#FEF3C7',
            border: isAllTabsFilled ? '1px solid #10B981' : '1px solid #F59E0B',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: isAllTabsFilled ? '#D1FAE5' : '#FDE68A',
                color: isAllTabsFilled ? '#059669' : '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isAllTabsFilled ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: isAllTabsFilled ? '#065F46' : '#92400E' }}>
                {isAllTabsFilled ? 'Profile Ready for Verification!' : 'Profile Incomplete – Action Required'}
              </div>
              <div style={{ fontSize: 12, color: isAllTabsFilled ? '#047857' : '#B45309', marginBottom: 6 }}>
                {isAllTabsFilled
                  ? 'All required tabs and attributes are filled. You can now send for admin review.'
                  : 'Please complete all tabs (Shop Details, Documents, Operating Hours) before submitting.'}
              </div>

              {/* Live Profile Detail Progress Bar */}
              <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: isAllTabsFilled ? '#065F46' : '#92400E' }}>
                  <span>{filledProfileDetailsCount} of {profileDetails.length} profile details filled</span>
                  <span>{profileProgressPercent}%</span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: isAllTabsFilled ? '#A7F3D0' : '#FDE68A', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${profileProgressPercent}%`,
                      height: '100%',
                      backgroundColor: isAllTabsFilled ? '#10B981' : '#D97706',
                      borderRadius: 3,
                      transition: 'width 0.35s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={isAllTabsFilled ? handleSendForVerification : undefined}
            disabled={isSubmittingVerification || !isAllTabsFilled}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 12,
              backgroundColor: isAllTabsFilled ? '#1C1D21' : '#64748B',
              opacity: isAllTabsFilled ? 1 : 0.45,
              color: '#FFFFFF',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: isAllTabsFilled ? 'pointer' : 'not-allowed',
              whiteSpace: 'nowrap',
              boxShadow: isAllTabsFilled ? '0 4px 12px rgba(28,29,33,0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <ShieldCheck size={16} />
            <span>{isSubmittingVerification ? 'Submitting...' : 'Send for Verification'}</span>
          </button>
        </div>
      )}

      {/* ADMIN REVIEW FEEDBACK & QUERIES BANNER */}
      {Array.isArray(shopData?.adminComments) && shopData.adminComments.length > 0 && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFBEB',
            border: '2px solid #F59E0B',
            borderRadius: 16,
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageSquare size={18} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#92400E' }}>
                  Admin Review Queries & Feedback ({shopData.adminComments.length})
                </div>
                <div style={{ fontSize: 12, color: '#B45309' }}>
                  The admin review team has left notes or doubts regarding your submission. Please address them below.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={openSubmissionModal}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  color: '#92400E',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                View All Notes
              </button>
              <button
                type="button"
                onClick={handleSendForVerification}
                disabled={isSubmittingVerification || !isAllTabsFilled || hasResubmitted}
                style={{
                  padding: '8px 18px',
                  borderRadius: 10,
                  backgroundColor: hasResubmitted ? '#059669' : isAllTabsFilled ? '#D97706' : '#94A3B8',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: !hasResubmitted && isAllTabsFilled && !isSubmittingVerification ? 'pointer' : 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: hasResubmitted ? '0 2px 8px rgba(5, 150, 105, 0.3)' : isAllTabsFilled ? '0 2px 8px rgba(217, 119, 6, 0.35)' : 'none',
                  transition: 'all 0.15s ease',
                  opacity: hasResubmitted ? 0.95 : 1,
                }}
              >
                <ShieldCheck size={15} />
                <span>
                  {isSubmittingVerification
                    ? 'Submitting...'
                    : hasResubmitted
                    ? 'Re-submitted ✓'
                    : 'Re-submit for Verification'}
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {shopData.adminComments.slice(0, 3).map((comm: any, idx: number) => (
              <div
                key={comm.id || idx}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  border: '1px solid #FDE68A',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ fontWeight: 700, color: '#B45309' }}>{comm.author || 'Admin Team'}</span>
                  <span style={{ color: '#94A3B8' }}>{comm.createdAt ? new Date(comm.createdAt).toLocaleString() : ''}</span>
                </div>
                <div style={{ fontSize: 13, color: '#1E293B', fontWeight: 500, lineHeight: 1.4 }}>
                  "{comm.text}"
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #FDE68A', paddingTop: 10, marginTop: 4 }}>
            <span style={{ fontSize: 12, color: hasResubmitted ? '#065F46' : '#92400E', fontWeight: 600 }}>
              {hasResubmitted
                ? '✓ Re-submission completed. The admin review team has been notified of your updates.'
                : 'Edited your shop details or uploaded new documents? Click Re-submit for Verification to notify the admin team.'}
            </span>
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
            disabled={isSubmittingVerification || !isAllTabsFilled || hasResubmitted}
            style={{
              padding: '8px 16px',
              borderRadius: 12,
              backgroundColor: hasResubmitted ? '#059669' : '#1C1D21',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: !hasResubmitted && isAllTabsFilled && !isSubmittingVerification ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
              opacity: hasResubmitted ? 0.95 : 1,
            }}
          >
            {isSubmittingVerification ? 'Submitting...' : hasResubmitted ? 'Re-submitted ✓' : 'Re-submit for Verification'}
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
          {tabs.map(tab => {
            const isTabComplete =
              tab.id === 'details'
                ? isTab1Filled
                : tab.id === 'documents'
                ? isTab2Filled
                : tab.id === 'hours'
                ? isTab3Filled
                : true;
            return (
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{tab.label}</span>
                {tab.id !== 'preview' && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: isTabComplete ? '#22C55E' : '#F59E0B',
                      display: 'inline-block',
                    }}
                    title={isTabComplete ? 'Tab completed' : 'Details missing in tab'}
                  />
                )}
              </button>
            );
          })}
        </div>

        {autoSaveStatus && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 12, backgroundColor: autoSaveStatus === 'saved' ? '#DCFCE7' : '#FEF3C7', color: autoSaveStatus === 'saved' ? '#15803D' : '#D97706', fontSize: 11.5, fontWeight: 700 }}>
            {autoSaveStatus === 'saved' ? <Check size={13} color="#16A34A" /> : <Clock size={13} color="#D97706" />}
            <span>{autoSaveStatus === 'saved' ? 'Auto-saved ✓' : 'Saving changes...'}</span>
          </div>
        )}
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

                {isApproved && (
                  <div
                    title="Profile is verified"
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
                    <span>Verified</span>
                  </div>
                )}

                {isApproved && (
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
                )}
              </div>

              <div style={{ borderTop: '1px solid #EBE7DF', paddingTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Basic Details</span>
                  {isApproved && isEditingBasic && (
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
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>
                        Shop Name * {isApproved && <span style={{ fontSize: 10, color: '#15803D' }}>(Verified)</span>}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tirupur Digital Print Hub"
                        disabled={isApproved}
                        value={basicForm.shopName}
                        onChange={e => {
                          const updated = { ...basicForm, shopName: e.target.value };
                          setBasicForm(updated);
                          autoSaveBasic(updated);
                        }}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>
                        Owner Name {isApproved && <span style={{ fontSize: 10, color: '#15803D' }}>(Verified)</span>}
                      </label>
                      <input
                        type="text"
                        placeholder="Owner full name"
                        disabled={isApproved}
                        value={basicForm.ownerName}
                        onChange={e => {
                          const updated = { ...basicForm, ownerName: e.target.value };
                          setBasicForm(updated);
                          autoSaveBasic(updated);
                        }}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Shop Description</label>
                      <textarea
                        rows={3}
                        value={basicForm.description}
                        onChange={e => {
                          const updated = { ...basicForm, description: e.target.value };
                          setBasicForm(updated);
                          autoSaveBasic(updated);
                        }}
                        placeholder="Describe your printing and copying services..."
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block' }}>
                          Shop Address * {isApproved && <span style={{ fontSize: 10, color: '#15803D' }}>(Verified)</span>}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowLocationPicker(true)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: 'none',
                            border: 'none',
                            color: '#4F46E5',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: '2px 8px',
                            borderRadius: 6,
                            backgroundColor: '#EEF2FF',
                          }}
                        >
                          <MapPin size={12} color="#4F46E5" />
                          <span>Pick on Map (GPS)</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Door number, street name"
                        disabled={isApproved}
                        value={basicForm.address}
                        onChange={e => {
                          const val = e.target.value;
                          const autoCity = (!basicForm.city || basicForm.city.toLowerCase() === 'general')
                            ? resolveCityFromLocation(basicForm.pincode, val, '')
                            : basicForm.city;
                          const updated = {
                            ...basicForm,
                            address: val,
                            city: autoCity || basicForm.city,
                          };
                          setBasicForm(updated);
                          autoSaveBasic(updated);
                        }}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B' }}>City *</label>
                          {basicForm.city && basicForm.city.toLowerCase() !== 'general' && (
                            <span style={{ fontSize: 9.5, color: '#059669', fontWeight: 700 }}>✓ Location</span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="City"
                          disabled={isApproved}
                          value={basicForm.city && basicForm.city.toLowerCase() !== 'general' ? basicForm.city : ''}
                          onChange={e => {
                            const updated = { ...basicForm, city: e.target.value };
                            setBasicForm(updated);
                            autoSaveBasic(updated);
                          }}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>Pincode *</label>
                        <input
                          type="text"
                          placeholder="6 digits"
                          disabled={isApproved}
                          value={basicForm.pincode}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            const autoCity = val.length === 6 ? resolveCityFromLocation(val, basicForm.address, basicForm.city) : basicForm.city;
                            const updated = {
                              ...basicForm,
                              pincode: val,
                              city: (autoCity && autoCity.toLowerCase() !== 'general') ? autoCity : basicForm.city,
                            };
                            setBasicForm(updated);
                            autoSaveBasic(updated);
                            if (val.length === 6) {
                              merchantApi.checkServiceability(val).then(res => {
                                const cityFromApi = res?.location?.city;
                                const resolved = resolveCityFromLocation(val, basicForm.address, cityFromApi);
                                if (resolved && resolved.toLowerCase() !== 'general') {
                                  const withResolved = { ...updated, city: resolved };
                                  setBasicForm(withResolved);
                                  autoSaveBasic(withResolved);
                                }
                              }).catch(() => {});
                            }
                          }}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 2 }}>
                        Phone Number * {isApproved && <span style={{ fontSize: 10, color: '#15803D' }}>(Verified)</span>}
                      </label>
                      <input
                        type="text"
                        disabled={isApproved}
                        value={basicForm.mobile}
                        onChange={e => {
                          const val = e.target.value;
                          const updated = { ...basicForm, mobile: val };
                          setBasicForm(updated);
                          autoSaveBasic(updated);
                        }}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF' }}
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
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: 11, color: '#8E929B' }}>Description</div>
                          {!isEditingBasic && (
                            <button
                              type="button"
                              onClick={() => setIsEditingBasic(true)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#4F46E5',
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              {basicForm.description ? 'Edit' : '+ Add Description'}
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize: 12.5, color: basicForm.description ? '#555963' : '#6B707B', lineHeight: 1.4, marginTop: 2 }}>
                          {basicForm.description || `${basicForm.shopName || 'Print Shop'} — Quality Xerox, colour printing, scanning, and binding services.`}
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
                              ? `${basicForm.address}${basicForm.city && basicForm.city.toLowerCase() !== 'general' ? `, ${basicForm.city}` : ''}${basicForm.pincode ? ` - ${basicForm.pincode}` : ''}`
                              : 'Address not entered yet'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLocationPicker(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: 'none',
                          border: 'none',
                          color: '#4F46E5',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '3px 8px',
                          borderRadius: 6,
                          backgroundColor: '#EEF2FF',
                          flexShrink: 0,
                        }}
                      >
                        <MapPin size={12} color="#4F46E5" />
                        <span>Pick on Map (GPS)</span>
                      </button>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1C20' }}>Business & Tax Info</span>
                  {isApproved && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: 8 }}>
                      <Lock size={10} />
                      Verified
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isApproved && isEditingBusiness && (
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
                  {isApproved && (
                    <button
                      type="button"
                      onClick={() => setIsEditingBusiness(prev => !prev)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B707B', padding: 2 }}
                      title="Edit Settlement UPI ID"
                    >
                      {isEditingBusiness ? <X size={15} /> : <Edit2 size={14} />}
                    </button>
                  )}
                </div>
              </div>

              {isEditingBusiness ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B' }}>Business Type</label>
                      {isApproved && <span style={{ fontSize: 10, color: '#15803D', fontWeight: 600 }}>Locked</span>}
                    </div>
                    <select
                      value={businessForm.businessType}
                      disabled={isApproved}
                      onChange={e => {
                        const updated = { ...businessForm, businessType: e.target.value };
                        setBusinessForm(updated);
                        autoSaveBusiness(updated);
                      }}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF', cursor: isApproved ? 'not-allowed' : 'default' }}
                    >
                      <option value="Print Shop (Retail)">Print Shop (Retail)</option>
                      <option value="Digital Printing Center">Digital Printing Center</option>
                      <option value="Commercial Press">Commercial Press</option>
                      <option value="Xerox & Stationery Store">Xerox & Stationery Store</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B' }}>GST Number</label>
                      {isApproved && <span style={{ fontSize: 10, color: '#15803D', fontWeight: 600 }}>Locked</span>}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 33AABCU9603R1ZM"
                      value={businessForm.gstNumber}
                      disabled={isApproved}
                      onChange={e => {
                        const updated = { ...businessForm, gstNumber: e.target.value.toUpperCase() };
                        setBusinessForm(updated);
                        autoSaveBusiness(updated);
                      }}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF', cursor: isApproved ? 'not-allowed' : 'default' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B' }}>Shop License / Act No</label>
                      {isApproved && <span style={{ fontSize: 10, color: '#15803D', fontWeight: 600 }}>Locked</span>}
                    </div>
                    <input
                      type="text"
                      placeholder="Trade License number"
                      value={businessForm.shopLicenseNo}
                      disabled={isApproved}
                      onChange={e => {
                        const updated = { ...businessForm, shopLicenseNo: e.target.value };
                        setBusinessForm(updated);
                        autoSaveBusiness(updated);
                      }}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #DAD5CB', fontSize: 12.5, backgroundColor: isApproved ? '#F3F4F6' : '#FFFFFF', cursor: isApproved ? 'not-allowed' : 'default' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#8E929B' }}>UPI ID for Settlements</label>
                      <span style={{ fontSize: 10, color: '#2563EB', fontWeight: 600 }}>Payout Destination</span>
                    </div>
                    <input
                      type="text"
                      placeholder="merchant@upi"
                      value={businessForm.upiId}
                      onChange={e => {
                        const updated = { ...businessForm, upiId: e.target.value };
                        setBusinessForm(updated);
                        autoSaveBusiness(updated);
                      }}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #3B82F6', fontSize: 12.5, backgroundColor: '#FFFFFF' }}
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
                  type="button"
                  onClick={handleSendForVerification}
                  disabled={isSubmittingVerification}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    backgroundColor: isAllTabsFilled ? '#1C1D21' : '#94A3B8',
                    opacity: isAllTabsFilled ? 1 : 0.75,
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isAllTabsFilled ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: isAllTabsFilled ? '0 4px 12px rgba(28,29,33,0.3)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>{isSubmittingVerification ? 'Submitting...' : 'Send for Verification'}</span>
                </button>
              )}

              {isPending && (
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
                    {(basicForm.city && basicForm.city.toLowerCase() !== 'general') ? basicForm.city : 'Tamil Nadu'}
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
                      <span>{(basicForm.city && basicForm.city.toLowerCase() !== 'general') ? basicForm.city : 'Local Store'}</span>
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
                const doc = documents.find(d =>
                  d.type === slot.type ||
                  (slot.type.includes('GST') && (d.type?.toLowerCase().includes('gst') || d.name?.toLowerCase().includes('gst'))) ||
                  (slot.type.includes('Proof') && (d.type?.toLowerCase().includes('proof') || d.type?.toLowerCase().includes('rent') || d.type?.toLowerCase().includes('bill') || d.type?.toLowerCase().includes('license') || d.name?.toLowerCase().includes('rent') || d.name?.toLowerCase().includes('statement'))) ||
                  (slot.type.includes('ID') && (d.type?.toLowerCase().includes('id') || d.type?.toLowerCase().includes('aadhaar') || d.type?.toLowerCase().includes('pan') || d.name?.toLowerCase().includes('aadhaar') || d.name?.toLowerCase().includes('patent') || d.name?.toLowerCase().includes('id')))
                );
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

            {/* All Uploaded Business Documents & KYC Proofs */}
            <div style={{ marginTop: 24, borderTop: '1px solid #EBE7DF', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1C20' }}>
                      All Uploaded Business Documents ({documents.length})
                    </div>
                    <div style={{ fontSize: 11.5, color: '#6B707B' }}>
                      Review, preview, and download your uploaded KYC files anytime.
                    </div>
                  </div>
                </div>
              </div>

              {documents.length === 0 ? (
                <div
                  style={{
                    padding: '24px 20px',
                    textAlign: 'center',
                    backgroundColor: '#FAF8F5',
                    borderRadius: 12,
                    border: '1px dashed #DAD5CB',
                    color: '#8E929B',
                    fontSize: 12.5,
                  }}
                >
                  No documents uploaded yet. Click <strong>Upload Document</strong> in the slots above to attach proof files.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {documents.map((doc, idx) => (
                    <div
                      key={doc.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EBE7DF',
                        borderRadius: 12,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            backgroundColor: '#F3F4F6',
                            color: '#4B5563',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FileText size={18} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#6B707B', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                            <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '1px 8px', borderRadius: 4, fontWeight: 600 }}>
                              {doc.type}
                            </span>
                            {doc.size && <span>{doc.size}</span>}
                            {doc.uploadedAt && <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>}
                            <span style={{ color: '#059669', fontWeight: 600 }}>✓ Attached</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => setPreviewAsset({ name: doc.name, url: doc.url, type: 'doc' })}
                          style={{
                            padding: '7px 14px',
                            borderRadius: 8,
                            backgroundColor: '#1C1D21',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          }}
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadAsset(doc.url, doc.name)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: 8,
                            backgroundColor: '#FFFFFF',
                            color: '#374151',
                            border: '1px solid #D1D5DB',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          <Download size={13} />
                          <span>Download</span>
                        </button>
                        {!isApproved && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            style={{
                              padding: '7px 10px',
                              borderRadius: 8,
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              border: 'none',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                            title="Remove file"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {autoSaveStatus && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: autoSaveStatus === 'saved' ? '#15803D' : '#D97706' }}>
                    {autoSaveStatus === 'saved' ? <Check size={12} color="#16A34A" /> : <Clock size={12} color="#D97706" />}
                    <span>{autoSaveStatus === 'saved' ? 'Auto-saved ✓' : 'Saving...'}</span>
                  </div>
                )}
                {isApproved && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#15803D' }}>
                    <Lock size={13} />
                    <span>Verified & Locked</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8E929B', display: 'block', marginBottom: 4 }}>Opening Time</label>
                <input
                  type="time"
                  disabled={!isEditingHours || isApproved}
                  value={hoursForm.openingTime}
                  onChange={e => {
                    const updated = { ...hoursForm, openingTime: e.target.value };
                    setHoursForm(updated);
                    autoSaveHours(updated);
                  }}
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
                  onChange={e => {
                    const updated = { ...hoursForm, closingTime: e.target.value };
                    setHoursForm(updated);
                    autoSaveHours(updated);
                  }}
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
                        const updatedDays = isChecked ? hoursForm.workingDays.filter(d => d !== day) : [...hoursForm.workingDays, day];
                        const updated = { ...hoursForm, workingDays: updatedDays };
                        setHoursForm(updated);
                        autoSaveHours(updated);
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
                {basicForm.description || `${basicForm.shopName || 'Print Shop'} — Quality Xerox, colour printing, scanning, and binding services.`}
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
                <a
                  href={resolveDocUrl(previewAsset.url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    borderRadius: 10,
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid #C7D2FE',
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Open in New Tab</span>
                </a>
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
              {(() => {
                const finalUrl = resolveDocUrl(previewAsset.url);
                const isPdf = previewAsset.url.includes('.pdf') || previewAsset.name?.toLowerCase().endsWith('.pdf') || previewAsset.type === 'doc';
                const isImg = !isPdf && (
                  previewAsset.url.startsWith('data:image') ||
                  previewAsset.url.includes('.png') ||
                  previewAsset.url.includes('.jpg') ||
                  previewAsset.url.includes('.jpeg') ||
                  previewAsset.url.includes('.webp') ||
                  previewAsset.url.includes('.svg')
                );

                if (isImg) {
                  return (
                    <img
                      src={finalUrl}
                      alt={previewAsset.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        objectFit: 'contain',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      onError={(e) => {
                        (e.currentTarget as any).src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  );
                }

                return (
                  <iframe
                    src={finalUrl}
                    title={previewAsset.name}
                    style={{
                      width: '100%',
                      height: '70vh',
                      border: 'none',
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Re-submit Action Bar (Visible whenever shop is unapproved) */}
      {!isApproved && (
        <div
          style={{
            marginTop: 14,
            padding: '16px 22px',
            backgroundColor: '#1E1B4B',
            borderRadius: 16,
            border: '1px solid #4338CA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#312E81',
                color: '#818CF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF' }}>
                {hasResubmitted
                  ? '✓ Verification Updates Re-submitted to Admin'
                  : Array.isArray(shopData?.adminComments) && shopData.adminComments.length > 0
                  ? 'Addressed Admin Feedback? Ready to Re-submit!'
                  : 'Send Profile & KYC Updates for Verification'}
              </div>
              <div style={{ fontSize: 12, color: '#C7D2FE', marginTop: 2 }}>
                {hasResubmitted
                  ? 'Your latest updates are currently being reviewed by the operations team.'
                  : isAllTabsFilled
                  ? 'All details and documents are complete. Click to submit directly to admin for approval.'
                  : 'Please complete all required fields and upload proofs to enable re-submission.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSendForVerification}
            disabled={isSubmittingVerification || !isAllTabsFilled || hasResubmitted}
            style={{
              padding: '11px 24px',
              borderRadius: 12,
              backgroundColor: hasResubmitted ? '#059669' : isAllTabsFilled ? '#4F46E5' : '#475569',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: !hasResubmitted && isAllTabsFilled && !isSubmittingVerification ? 'pointer' : 'default',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: hasResubmitted ? '0 4px 14px rgba(5, 150, 105, 0.4)' : isAllTabsFilled ? '0 4px 14px rgba(79, 70, 229, 0.4)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              opacity: hasResubmitted ? 0.95 : 1,
            }}
          >
            <ShieldCheck size={16} />
            <span>
              {isSubmittingVerification
                ? 'Submitting...'
                : hasResubmitted
                ? 'Re-submitted ✓'
                : 'Re-submit for Verification'}
            </span>
          </button>
        </div>
      )}

      {/* Interactive Location Picker Modal (Leaflet Map + Browser GPS) */}
      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        initialLat={shopData?.latitude}
        initialLng={shopData?.longitude}
        initialAddress={basicForm.address}
        initialPincode={basicForm.pincode}
        initialCity={basicForm.city}
        onLocationSelected={handleLocationSelected}
      />
    </div>
  );
};
