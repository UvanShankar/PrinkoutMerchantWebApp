import axios from 'axios';

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL)
  ? `${(import.meta as any).env.VITE_API_BASE_URL}/api/v1`
  : 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept error responses to provide clean error messages
apiClient.interceptors.response.use(
  response => response,
  error => {
    const serverError =
      error.response?.data?.error ||
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out' : error.message);
    const customError = new Error(serverError);
    (customError as any).response = error.response;
    (customError as any).status = error.response?.status;
    return Promise.reject(customError);
  }
);

export interface MerchantOrder {
  orderId: string;
  userId: string;
  shopId: string;
  customerName?: string;
  customerPhone?: string;
  customerType?: string;
  serviceType?: string;
  specs?: string;
  paperSize?: string;
  paperType?: string;
  colorMode?: string;
  sides?: string;
  copies?: number;
  binding?: string;
  instructions?: string;
  files?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize?: string;
    pages?: number;
  }>;
  totalPrice: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentRef?: string;
  status: string;
  timeAgo?: string;
  createdAt?: string;
  updatedAt?: string;
  pickupDetails?: {
    pickupDate: string;
    pickupLocation: string;
  };
  deliveryDetails?: {
    deliveryDate: string;
    deliveryAddress: string;
  };
  orderDetails?: {
    quantity: number;
    totalPrice: number;
    paymentMethod: string;
  };
}

export interface MerchantAnalytics {
  today: {
    ordersCount: number;
    ordersChangePct: number;
    revenue: number;
    revenueChangePct: number;
    inPrinting: number;
    overduePrinting: number;
    readyForPickup: number;
    pendingPickupAlerts: number;
  };
  pipeline: {
    received: number;
    printing: number;
    ready: number;
    completed: number;
  };
  summaryMetrics: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    repeatCustomerRate: number;
  };
  revenueTrend: Array<{ day: string; amount: number }>;
  serviceBreakdown: Array<{ name: string; percentage: number; revenue: number }>;
  topServices: Array<{ service: string; orders: number; revenue: number; growth: string }>;
  insights: string[];
}

export interface MerchantPayouts {
  totalSales: number;
  platformFeeRate: number;
  platformFee: number;
  netEarnings: number;
  nextPayoutAmount: number;
  nextPayoutDate: string;
  bankAccount: {
    bankName: string;
    accountNumberMasked: string;
    holderName: string;
    ifsc: string;
    status: string;
  };
  payoutSettings: {
    autoDailySettlement: boolean;
    instantPayoutEnabled: boolean;
    minimumPayoutThreshold: number;
  };
  weeklyEarnings: Array<{ date: string; amount: number }>;
  recentPayouts: Array<{ payoutId: string; date: string; amount: number; status: string; utr: string }>;
}

export const merchantApi = {
  // Auth
  async isExistingShop(mobile: string): Promise<boolean> {
    try {
      const cleanDigits = String(mobile).replace(/\D/g, '').slice(-10);
      const res = await apiClient.get(`/shops/auth/existing-shop/${cleanDigits}`);
      return res.data?.data === true;
    } catch {
      return false;
    }
  },

  async sendLoginOTP(mobile: string) {
    const res = await apiClient.post('/shops/auth/login', { mobile });
    return res.data;
  },

  async verifyOTP(mobile: string, otp: string) {
    const res = await apiClient.post('/shops/auth/verifyOTP', { mobile, otp });
    return res.data;
  },

  async registerShop(shopData: any) {
    const res = await apiClient.post('/shops/auth/register', shopData);
    return res.data;
  },

  // Shop Profile
  async getShop(shopId: string) {
    const res = await apiClient.get(`/shops/${shopId}`);
    return res.data?.data;
  },

  async updateShopProfile(shopId: string, data: any) {
    const res = await apiClient.put(`/shops/${shopId}/profile`, data);
    return res.data?.data;
  },

  async sendShopForVerification(shopId: string, profileData?: any) {
    const payload = {
      ...profileData,
      verificationStatus: 'pending_approval',
      isVerified: false,
      verificationSubmittedAt: new Date().toISOString(),
    };
    const res = await apiClient.put(`/shops/${shopId}/profile`, payload);
    return res.data?.data;
  },

  async approveShopVerification(shopId: string) {
    const payload = {
      verificationStatus: 'approved',
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    };
    const res = await apiClient.put(`/shops/${shopId}/profile`, payload);
    return res.data?.data;
  },

  async rejectShopVerification(shopId: string, reason?: string) {
    const payload = {
      verificationStatus: 'rejected',
      isVerified: false,
      rejectionReason: reason || 'Incomplete business documents',
    };
    const res = await apiClient.put(`/shops/${shopId}/profile`, payload);
    return res.data?.data;
  },

  // Orders
  async getShopOrders(shopId: string): Promise<MerchantOrder[]> {
    const res = await apiClient.get(`/orders/shop/${shopId}`);
    return res.data?.data?.orders || [];
  },

  async updateOrderStatus(orderId: string, status: string, userId?: string, shopId?: string) {
    const res = await apiClient.put(`/orders/update-status/${orderId}`, {
      status,
      userId: userId || 'user_demo',
      shopId: shopId,
    });
    return res.data;
  },

  // Analytics
  async getShopAnalytics(shopId: string): Promise<MerchantAnalytics> {
    const res = await apiClient.get(`/shops/${shopId}/analytics`);
    return res.data?.data;
  },

  // Payouts
  async getShopPayouts(shopId: string): Promise<MerchantPayouts> {
    const res = await apiClient.get(`/shops/${shopId}/payouts`);
    return res.data?.data;
  },
};
