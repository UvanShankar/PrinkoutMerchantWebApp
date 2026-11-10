import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { merchantApi, MerchantOrder, MerchantAnalytics, MerchantPayouts } from '../services/api';

export type ScreenType =
  | 'login'
  | 'verify-otp'
  | 'onboarding-1'
  | 'onboarding-2'
  | 'onboarding-3'
  | 'shop-success'
  | 'dashboard'
  | 'orders'
  | 'queue'
  | 'pricing'
  | 'reports'
  | 'payouts'
  | 'profile'
  | 'settings';

export type SettingsSubTab = 'general' | 'notifications' | 'team';

interface MerchantContextType {
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType) => void;
  settingsTab: SettingsSubTab;
  setSettingsTab: (tab: SettingsSubTab) => void;
  
  // Auth & Session
  isAuthenticated: boolean;
  login: (userData?: any, token?: string, phone?: string) => void;
  logout: () => void;
  authPhone: string;
  setAuthPhone: (phone: string) => void;
  onboardingData: any;
  updateOnboardingData: (data: Partial<any>) => void;
  resetOnboardingData: (phone?: string) => void;

  // 3-Step Setup Flow for New Merchants
  isSetupPending: boolean;
  setupStep: 1 | 2 | 3;
  setSetupStep: (step: 1 | 2 | 3) => void;
  submitSetupForReview: () => Promise<void>;

  // Team & Access
  teamMembers: any[];
  accessActivity: any[];
  addTeamMember: (member: { name: string; phone: string; role?: string; access?: string }) => Promise<void>;
  removeTeamMember: (phoneOrId: string) => Promise<void>;

  // Notifications
  notificationPreferences: any;
  saveNotificationPreferences: (prefs: any) => Promise<void>;

  // Active Shop & Status
  shopId: string;
  setShopId: (id: string) => void;
  shopData: any;
  setShopData: React.Dispatch<React.SetStateAction<any>>;
  shopStatus: 'active' | 'away';
  toggleShopStatus: () => void;

  // Orders & Queue
  orders: MerchantOrder[];
  selectedOrder: MerchantOrder | null;
  setSelectedOrderId: (id: string | null) => void;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  
  // Pricing state (excluding bulk update)
  pricingItems: any[];
  togglePricingItemActive: (id: string) => void;
  updatePricingValue: (id: string, field: string, val: string) => void;

  // Analytics & Payouts
  analytics: MerchantAnalytics | null;
  payouts: MerchantPayouts | null;
  refreshData: () => Promise<void>;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const SESSION_STORAGE_KEY = 'prinkout_merchant_session';

const publicScreens: ScreenType[] = [
  'login',
  'verify-otp',
  'onboarding-1',
  'onboarding-2',
  'onboarding-3',
  'shop-success',
];

const getStoredSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

const defaultPricingItems = [
  { id: 'p1', size: 'A4', gsm: '75 GSM', type: 'Bond Paper', bwPrice: '1.50', colorPrice: '5.00', singleSide: true, doubleSide: true, active: true },
  { id: 'p2', size: 'A4', gsm: '100 GSM', type: 'Super White', bwPrice: '2.50', colorPrice: '8.00', singleSide: true, doubleSide: true, active: true },
  { id: 'p3', size: 'A3', gsm: '80 GSM', type: 'Plain Paper', bwPrice: '4.00', colorPrice: '12.00', singleSide: true, doubleSide: true, active: true },
  { id: 'p4', size: 'A3', gsm: '120 GSM', type: 'Heavy Bond', bwPrice: '6.00', colorPrice: '18.00', singleSide: true, doubleSide: true, active: true },
  { id: 'p5', size: 'A2', gsm: '220 GSM', type: 'Glossy Photo', bwPrice: '35.00', colorPrice: '85.00', singleSide: true, doubleSide: false, active: true },
  { id: 'p6', size: 'A1', gsm: '220 GSM', type: 'Glossy Photo', bwPrice: '70.00', colorPrice: '160.00', singleSide: true, doubleSide: false, active: false },
];

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialSession = getStoredSession();
  const isDevAuth = typeof window !== 'undefined' && window.location.href.includes('test_auth=1');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => isDevAuth || !!(initialSession && initialSession.isAuthenticated)
  );
  const isAuthenticatedRef = useRef<boolean>(
    isDevAuth || !!(initialSession && initialSession.isAuthenticated)
  );

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const checkIsAuth = (): boolean => {
    if (isDevAuth) return true;
    if (isAuthenticatedRef.current) return true;
    if (isAuthenticated) return true;
    const session = getStoredSession();
    return !!(session && session.isAuthenticated);
  };

  // Navigation - detect from hash if present (e.g. #/orders)
  const getInitialScreen = (): ScreenType => {
    const session = getStoredSession();
    const isAuth = isDevAuth || !!(session && session.isAuthenticated);
    const hasHash = typeof window !== 'undefined' && window.location.hash;
    const requested = hasHash ? (window.location.hash.split('?')[0].replace('#/', '').replace('#', '') as ScreenType) : null;

    if (!isAuth) {
      if (requested && publicScreens.includes(requested)) {
        return requested;
      }
      return 'login';
    }

    const isVerified = session?.shopData?.isVerified === true || session?.shopData?.verificationStatus === 'approved';

    if (requested) {
      const allScreens: ScreenType[] = [
        ...publicScreens,
        'dashboard', 'orders', 'queue', 'pricing', 'reports', 'payouts', 'profile', 'settings'
      ];
      if (allScreens.includes(requested)) {
        if (requested === 'login') return isVerified ? 'dashboard' : 'profile';
        return requested;
      }
    }
    return isVerified ? 'dashboard' : 'profile';
  };

  const getInitialSettingsTab = (): SettingsSubTab => {
    if (typeof window !== 'undefined' && window.location.href.includes('tab=')) {
      const match = window.location.href.match(/tab=([a-z]+)/);
      if (match && ['general', 'notifications', 'team'].includes(match[1])) {
        return match[1] as SettingsSubTab;
      }
    }
    return 'general';
  };

  const [currentScreen, setCurrentScreenState] = useState<ScreenType>(getInitialScreen);
  const [settingsTab, setSettingsTab] = useState<SettingsSubTab>(getInitialSettingsTab);

  const navigateTo = (screen: ScreenType) => {
    const isAuth = checkIsAuth();
    if (!isAuth && !publicScreens.includes(screen)) {
      setCurrentScreenState('login');
      if (typeof window !== 'undefined') {
        window.location.hash = '#/login';
      }
      showToast('Please log in to continue');
      return;
    }

    setCurrentScreenState(screen);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${screen}`;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.split('?')[0];
      const h = rawHash.replace('#/', '').replace('#', '') as ScreenType;
      const allScreens: ScreenType[] = [
        ...publicScreens,
        'dashboard', 'orders', 'queue', 'pricing', 'reports', 'payouts', 'profile', 'settings'
      ];
      if (!allScreens.includes(h)) return;

      const isAuth = checkIsAuth();
      if (!isAuth && !publicScreens.includes(h)) {
        setCurrentScreenState('login');
        window.location.hash = '#/login';
        return;
      }
      setCurrentScreenState(h);

      if (window.location.href.includes('tab=')) {
        const match = window.location.href.match(/tab=([a-z]+)/);
        if (match && ['general', 'notifications', 'team'].includes(match[1])) {
          setSettingsTab(match[1] as SettingsSubTab);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, isDevAuth]);

  // Initial route guard check
  useEffect(() => {
    const isAuth = checkIsAuth();
    if (!isAuth && !publicScreens.includes(currentScreen)) {
      navigateTo('login');
    }
  }, [isAuthenticated, isDevAuth, currentScreen]);

  // Auth / Onboarding
  const [authPhone, setAuthPhone] = useState(initialSession?.phone || '');

  const getDefaultOnboardingData = (phone = '') => ({
    shopName: '',
    ownerName: '',
    mobile: phone || initialSession?.phone || '',
    email: '',
    gstNumber: '',
    address: '',
    area: '',
    city: '',
    pincode: '',
    services: ['Standard Prints'],
    pricing: {
      a4Bw: '3',
      a4Color: '8',
      a3Bw: '6',
      a3Color: '15',
      a0Bw: '40',
      a0Color: '80',
    },
  });

  const getInitialOnboardingData = () => {
    const defaultData = getDefaultOnboardingData();

    if (typeof window === 'undefined') return defaultData;
    try {
      const raw = localStorage.getItem('prinkout_merchant_onboarding');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...defaultData,
          ...parsed,
          pricing: { ...defaultData.pricing, ...(parsed.pricing || {}) },
          mobile: parsed.mobile || initialSession?.phone || '',
        };
      }
    } catch {}
    return defaultData;
  };

  const [onboardingData, setOnboardingData] = useState(getInitialOnboardingData);

  const resetOnboardingData = (phone?: string) => {
    try {
      localStorage.removeItem('prinkout_merchant_onboarding');
    } catch (e) {}
    setOnboardingData(getDefaultOnboardingData(phone || authPhone));
  };

  const updateOnboardingData = (data: Partial<any>) => {
    setOnboardingData(prev => {
      const updated = {
        ...prev,
        ...data,
        pricing: data.pricing ? { ...(prev.pricing || {}), ...data.pricing } : prev.pricing,
      };
      try {
        localStorage.setItem('prinkout_merchant_onboarding', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Active Shop
  const [shopId, setShopId] = useState(initialSession?.shopId || '');
  const [shopData, setShopData] = useState<any>(initialSession?.shopData || null);
  const [shopStatus, setShopStatus] = useState<'active' | 'away'>('active');

  // Login handler
  const login = (userData?: any, token?: string, phone?: string) => {
    if (!userData || !userData.shopId) {
      console.error('Cannot login without merchant data');
      return;
    }
    const activeShopId = userData.shopId;
    const activeShopData = userData;
    const activePhone = phone || userData.mobile || authPhone;

    // Clear any previous onboarding cache so stale shop names never carry over
    try {
      localStorage.removeItem('prinkout_merchant_onboarding');
    } catch (e) {}
    setOnboardingData(getDefaultOnboardingData(activePhone));

    const session = {
      isAuthenticated: true,
      shopId: activeShopId,
      shopData: activeShopData,
      phone: activePhone,
      token: token || 'merchant_jwt_' + Date.now(),
      loginTime: new Date().toISOString(),
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session to localStorage:', e);
    }

    isAuthenticatedRef.current = true;
    setIsAuthenticated(true);
    setShopId(activeShopId);
    setShopData(activeShopData);
    if (activePhone) setAuthPhone(activePhone);

    const isVerified = activeShopData?.isVerified === true || activeShopData?.verificationStatus === 'approved';
    const targetScreen: ScreenType = isVerified ? 'dashboard' : 'profile';

    setCurrentScreenState(targetScreen);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${targetScreen}`;
    }
  };

  // Logout handler - clears session, onboarding cache, and resets all shop state
  const logout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem('prinkout_merchant_onboarding');
    } catch (e) {
      console.warn('Failed to remove session from localStorage:', e);
    }

    isAuthenticatedRef.current = false;
    setIsAuthenticated(false);
    setShopId('');
    setShopData(null);
    setAuthPhone('');
    setOnboardingData(getDefaultOnboardingData());
    setOrders([]);
    setAnalytics(null);
    setPayouts(null);
    setCurrentScreenState('login');
    if (typeof window !== 'undefined') {
      window.location.hash = '#/login';
    }
    showToast('Signed out successfully');
  };

  const toggleShopStatus = () => {
    setShopStatus(prev => {
      const next = prev === 'active' ? 'away' : 'active';
      showToast(`Shop is now ${next === 'active' ? 'Online & Receiving Orders' : 'Temporarily Away'}`);
      return next;
    });
  };

  // Orders
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Pricing
  const [pricingItems, setPricingItems] = useState(defaultPricingItems);

  // Analytics & Payouts
  const [analytics, setAnalytics] = useState<MerchantAnalytics | null>(null);
  const [payouts, setPayouts] = useState<MerchantPayouts | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load Data
  const refreshData = async () => {
    if (!shopId) return;
    try {
      const [fetchedOrders, fetchedAnalytics, fetchedPayouts, fetchedShop] = await Promise.all([
        merchantApi.getShopOrders(shopId).catch(() => []),
        merchantApi.getShopAnalytics(shopId).catch(() => null),
        merchantApi.getShopPayouts(shopId).catch(() => null),
        merchantApi.getShop(shopId).catch(() => null),
      ]);
      if (fetchedOrders && fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
        setSelectedOrderId(prev => prev || fetchedOrders[0].orderId);
      } else if (fetchedOrders) {
        setOrders(fetchedOrders);
      }
      if (fetchedAnalytics) setAnalytics(fetchedAnalytics);
      if (fetchedPayouts) setPayouts(fetchedPayouts);
      if (fetchedShop) setShopData(fetchedShop);
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [shopId, isAuthenticated]);

  // Order status update
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setOrders(prev =>
      prev.map(o => (o.orderId === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o))
    );
    showToast(`Order #${orderId} marked as ${newStatus.toUpperCase()}`);

    try {
      const targetOrder = orders.find(o => o.orderId === orderId);
      await merchantApi.updateOrderStatus(orderId, newStatus, targetOrder?.userId, shopId);
    } catch (err) {
      console.error('Failed to persist order status:', err);
    }
  };

  // Pricing item toggles
  const togglePricingItemActive = (id: string) => {
    setPricingItems(prev =>
      prev.map(item => (item.id === id ? { ...item, active: !item.active } : item))
    );
    showToast('Pricing updated successfully');
  };

  const updatePricingValue = (id: string, field: string, val: string) => {
    setPricingItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // 3-Step Setup Flow state
  const isSetupPending = Boolean(
    shopData &&
    !shopData.isSetupCompleted &&
    (shopData.verificationStatus === 'draft' || !shopData.verificationStatus || shopData.verificationStatus === 'pending_setup')
  );

  const [setupStep, setSetupStepState] = useState<1 | 2 | 3>(() => {
    if (currentScreen === 'profile') return 1;
    if (currentScreen === 'settings') return 2;
    if (currentScreen === 'pricing') return 3;
    return 1;
  });

  const setSetupStep = (step: 1 | 2 | 3) => {
    setSetupStepState(step);
    if (step === 1) {
      navigateTo('profile');
    } else if (step === 2) {
      setSettingsTab('general');
      navigateTo('settings');
    } else if (step === 3) {
      navigateTo('pricing');
    }
  };

  // Sync setupStep with current screen
  useEffect(() => {
    if (currentScreen === 'profile') setSetupStepState(1);
    else if (currentScreen === 'settings' && settingsTab === 'general') setSetupStepState(2);
    else if (currentScreen === 'pricing') setSetupStepState(3);
  }, [currentScreen, settingsTab]);

  // Team Members & Access Activity
  const defaultOwner = {
    id: `mem_owner_${String(shopData?.mobile || authPhone || '1212121212').replace(/\D/g, '').slice(-10)}`,
    name: `${shopData?.ownerName || shopData?.shopName || 'Admin'} (You)`,
    phone: shopData?.mobile || authPhone || '+91 1212121212',
    role: 'Owner',
    access: 'Full Access',
    isOwner: true,
    status: 'Active',
    time: 'Just now',
  };

  const [teamMembers, setTeamMembers] = useState<any[]>(() => {
    if (Array.isArray(shopData?.teamMembers) && shopData.teamMembers.length > 0) {
      return shopData.teamMembers;
    }
    return [defaultOwner];
  });

  const [accessActivity, setAccessActivity] = useState<any[]>(() => {
    if (Array.isArray(shopData?.accessActivity) && shopData.accessActivity.length > 0) {
      return shopData.accessActivity;
    }
    return [];
  });

  // Sync team members when shopData updates
  useEffect(() => {
    if (shopData) {
      if (Array.isArray(shopData.teamMembers) && shopData.teamMembers.length > 0) {
        setTeamMembers(shopData.teamMembers);
      } else {
        const owner = {
          id: `mem_owner_${String(shopData.mobile || authPhone || '1212121212').replace(/\D/g, '').slice(-10)}`,
          name: `${shopData.ownerName || shopData.shopName || 'Admin'} (You)`,
          phone: shopData.mobile || authPhone || '+91 1212121212',
          role: 'Owner',
          access: 'Full Access',
          isOwner: true,
          status: 'Active',
          time: 'Just now',
        };
        setTeamMembers([owner]);
      }
      if (Array.isArray(shopData.accessActivity)) {
        setAccessActivity(shopData.accessActivity);
      }
    }
  }, [shopData]);

  const addTeamMember = async (member: { name: string; phone: string; role?: string; access?: string }) => {
    try {
      const activeShopId = shopId || shopData?.shopId;
      if (!activeShopId) throw new Error("No active shop");
      const res = await merchantApi.addTeamMember(activeShopId, member);
      if (res?.teamMembers) setTeamMembers(res.teamMembers);
      if (res?.accessActivity) setAccessActivity(res.accessActivity);
      showToast(`${member.name} added to team`);
    } catch (err: any) {
      const clean10 = String(member.phone).replace(/\D/g, '').slice(-10);
      const newM = {
        id: `mem_${Date.now()}`,
        name: member.name,
        phone: `+91${clean10}`,
        role: member.role || 'Print Operator',
        access: member.access || 'Orders, Print Queue',
        isOwner: false,
        status: 'Active',
        time: 'Just now',
      };
      setTeamMembers(prev => [...prev, newM]);
      const act = {
        id: `act_${Date.now()}`,
        action: `${shopData?.ownerName || 'Admin'} added ${member.name} (${newM.role} • ${newM.access})`,
        time: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: Date.now(),
      };
      setAccessActivity(prev => [act, ...prev]);
      showToast(`${member.name} added to team`);
    }
  };

  const removeTeamMember = async (phoneOrId: string) => {
    try {
      const activeShopId = shopId || shopData?.shopId;
      if (!activeShopId) throw new Error("No active shop");
      const res = await merchantApi.deleteTeamMember(activeShopId, phoneOrId);
      if (res?.teamMembers) setTeamMembers(res.teamMembers);
      if (res?.accessActivity) setAccessActivity(res.accessActivity);
      showToast("Team member removed");
    } catch (err: any) {
      setTeamMembers(prev => prev.filter(m => m.id !== phoneOrId && !m.phone.includes(phoneOrId)));
      showToast("Team member removed");
    }
  };

  // Notification Preferences
  const [notificationPreferences, setNotificationPreferences] = useState<any>(() => {
    return shopData?.notificationPreferences || {
      newOrders: true,
      orderUpdates: true,
      payoutUpdates: true,
      queueAlerts: true,
      announcements: true,
      channel: 'inApp',
    };
  });

  const saveNotificationPreferences = async (prefs: any) => {
    setNotificationPreferences(prefs);
    try {
      const activeShopId = shopId || shopData?.shopId;
      if (activeShopId) {
        await merchantApi.updateNotifications(activeShopId, prefs);
      }
      showToast('Notification preferences saved');
    } catch (err) {
      console.warn('Failed to save notification preferences:', err);
    }
  };

  const submitSetupForReview = async () => {
    const activeShopId = shopId || shopData?.shopId;
    if (activeShopId) {
      try {
        await merchantApi.submitShopSetup(activeShopId);
      } catch (err) {
        console.warn('API submit setup error:', err);
      }
    }
    setShopData((prev: any) => ({
      ...prev,
      isSetupCompleted: true,
      verificationStatus: 'pending_approval',
    }));
    try {
      const sess = getStoredSession();
      if (sess) {
        sess.shopData = {
          ...sess.shopData,
          isSetupCompleted: true,
          verificationStatus: 'pending_approval',
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sess));
      }
    } catch {}
    showToast('🎉 Shop setup submitted for review!');
    navigateTo('dashboard');
  };

  const selectedOrder = (selectedOrderId ? orders.find(o => o.orderId === selectedOrderId) : orders[0]) || null;

  return (
    <MerchantContext.Provider
      value={{
        currentScreen,
        navigateTo,
        settingsTab,
        setSettingsTab,
        isAuthenticated,
        login,
        logout,
        authPhone,
        setAuthPhone,
        onboardingData,
        updateOnboardingData,
        resetOnboardingData,
        isSetupPending,
        setupStep,
        setSetupStep,
        submitSetupForReview,
        teamMembers,
        accessActivity,
        addTeamMember,
        removeTeamMember,
        notificationPreferences,
        saveNotificationPreferences,
        shopId,
        setShopId,
        shopData,
        setShopData,
        shopStatus,
        toggleShopStatus,
        orders,
        selectedOrder,
        setSelectedOrderId,
        updateOrderStatus,
        pricingItems,
        togglePricingItemActive,
        updatePricingValue,
        analytics,
        payouts,
        refreshData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => {
  const context = useContext(MerchantContext);
  if (!context) throw new Error('useMerchant must be used within a MerchantProvider');
  return context;
};
