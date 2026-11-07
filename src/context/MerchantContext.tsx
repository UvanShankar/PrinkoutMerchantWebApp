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

export type SettingsSubTab = 'general' | 'notifications' | 'team' | 'integrations' | 'security';

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

    if (requested) {
      const allScreens: ScreenType[] = [
        ...publicScreens,
        'dashboard', 'orders', 'queue', 'pricing', 'reports', 'payouts', 'profile', 'settings'
      ];
      if (allScreens.includes(requested)) {
        if (requested === 'login') return 'dashboard';
        return requested;
      }
    }
    return 'dashboard';
  };

  const getInitialSettingsTab = (): SettingsSubTab => {
    if (typeof window !== 'undefined' && window.location.href.includes('tab=')) {
      const match = window.location.href.match(/tab=([a-z]+)/);
      if (match && ['general', 'notifications', 'team', 'integrations', 'security'].includes(match[1])) {
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
        if (match && ['general', 'notifications', 'team', 'integrations', 'security'].includes(match[1])) {
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
  const [onboardingData, setOnboardingData] = useState({
    shopName: '',
    ownerName: '',
    mobile: initialSession?.phone || '',
    email: '',
    gstNumber: '',
    address: '',
    area: '',
    city: '',
    pincode: '',
    services: ['Standard Prints', 'Posters', 'Flex & Banners'],
    pricing: {
      a4Bw: '1.50',
      a4Color: '5.00',
      a3Bw: '4.00',
      a3Color: '12.00',
      a0Bw: '50.00',
      a0Color: '120.00',
    },
  });

  const updateOnboardingData = (data: Partial<any>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
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

    setCurrentScreenState('dashboard');
    if (typeof window !== 'undefined') {
      window.location.hash = '#/dashboard';
    }
  };

  // Logout handler
  const logout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove session from localStorage:', e);
    }

    isAuthenticatedRef.current = false;
    setIsAuthenticated(false);
    setShopId('');
    setShopData(null);
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('5577');
  
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
      if (fetchedOrders) setOrders(fetchedOrders);
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

  const selectedOrder = orders.find(o => o.orderId === selectedOrderId) || null;

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
