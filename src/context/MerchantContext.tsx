import React, { createContext, useContext, useState, useEffect } from 'react';
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
  
  // Auth & Onboarding State
  authPhone: string;
  setAuthPhone: (phone: string) => void;
  onboardingData: any;
  updateOnboardingData: (data: Partial<any>) => void;

  // Active Shop & Status
  shopId: string;
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
  // Navigation - detect from hash if present (e.g. #/orders)
  const getInitialScreen = (): ScreenType => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#/', '').replace('#', '') as ScreenType;
      const valid: ScreenType[] = [
        'login', 'verify-otp', 'onboarding-1', 'onboarding-2', 'onboarding-3',
        'shop-success', 'dashboard', 'orders', 'queue', 'pricing', 'reports', 'payouts', 'profile', 'settings'
      ];
      if (valid.includes(h)) return h;
    }
    return 'dashboard';
  };

  const [currentScreen, setCurrentScreenState] = useState<ScreenType>(getInitialScreen);
  const [settingsTab, setSettingsTab] = useState<SettingsSubTab>('general');

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreenState(screen);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${screen}`;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash.replace('#/', '').replace('#', '') as ScreenType;
      const valid: ScreenType[] = [
        'login', 'verify-otp', 'onboarding-1', 'onboarding-2', 'onboarding-3',
        'shop-success', 'dashboard', 'orders', 'queue', 'pricing', 'reports', 'payouts', 'profile', 'settings'
      ];
      if (valid.includes(h)) setCurrentScreenState(h);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auth / Onboarding
  const [authPhone, setAuthPhone] = useState('+91 98765 43210');
  const [onboardingData, setOnboardingData] = useState({
    shopName: 'Sabarish Prints',
    ownerName: 'Sabarish K',
    mobile: '+91 98765 43210',
    email: 'sabarish@prinkout.com',
    gstNumber: '33AABCU9603R1ZM',
    address: '88, Kumaran Rd, Opp. Town Hall, Kannipiran Colony, Valipalayam',
    area: 'Valipalayam',
    city: 'Tiruppur',
    pincode: '641601',
    services: ['Standard Prints', 'Posters', 'Flex & Banners', 'T-Shirts', 'Invitations', 'Packaging'],
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
  const [shopId] = useState('shp_selvi_001');
  const [shopData, setShopData] = useState<any>({
    shopId: 'shp_selvi_001',
    shopName: 'Sabarish Prints',
    ownerName: 'Sabarish K',
    mobile: '+91 98765 43210',
    email: 'sabarish@prinkout.com',
    address: '88, Kumaran Rd, Opp. Town Hall, Kannipiran Colony, Valipalayam',
    area: 'Valipalayam',
    city: 'Tiruppur',
    state: 'Tamil Nadu',
    pincode: '641601',
    rating: 4.9,
    reviewsCount: 128,
  });
  const [shopStatus, setShopStatus] = useState<'active' | 'away'>('active');

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
    try {
      const [fetchedOrders, fetchedAnalytics, fetchedPayouts, fetchedShop] = await Promise.all([
        merchantApi.getShopOrders(shopId),
        merchantApi.getShopAnalytics(shopId),
        merchantApi.getShopPayouts(shopId),
        merchantApi.getShop(shopId),
      ]);
      if (fetchedOrders?.length) setOrders(fetchedOrders);
      if (fetchedAnalytics) setAnalytics(fetchedAnalytics);
      if (fetchedPayouts) setPayouts(fetchedPayouts);
      if (fetchedShop) setShopData((prev: any) => ({ ...prev, ...fetchedShop }));
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [shopId]);

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
        authPhone,
        setAuthPhone,
        onboardingData,
        updateOnboardingData,
        shopId,
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
