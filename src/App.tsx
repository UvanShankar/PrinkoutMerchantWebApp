import React from 'react';
import { MerchantProvider, useMerchant } from './context/MerchantContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';

// Auth & Onboarding Screens (Pages 1 - 6)
import { LoginScreen } from './screens/LoginScreen';
import { VerifyOTPScreen } from './screens/VerifyOTPScreen';
import { ShopOnboardingStep1 } from './screens/ShopOnboardingStep1';
import { ShopOnboardingStep2 } from './screens/ShopOnboardingStep2';
import { ShopOnboardingStep3 } from './screens/ShopOnboardingStep3';
import { ShopCreatedSuccessScreen } from './screens/ShopCreatedSuccessScreen';

// Core Merchant Hub Screens (Pages 7 - 18)
import { DashboardScreen } from './screens/DashboardScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { PrintQueueScreen } from './screens/PrintQueueScreen';
import { PricingServicesScreen } from './screens/PricingServicesScreen';
import { ReportsAnalyticsScreen } from './screens/ReportsAnalyticsScreen';
import { PayoutsScreen } from './screens/PayoutsScreen';
import { ShopProfileScreen } from './screens/ShopProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainNavigator: React.FC = () => {
  const { currentScreen, isAuthenticated } = useMerchant();

  const isPublicScreen = [
    'login',
    'verify-otp',
    'onboarding-1',
    'onboarding-2',
    'onboarding-3',
    'shop-success',
  ].includes(currentScreen);

  // If user is not authenticated and attempts to access protected screens, show login screen
  if (!isAuthenticated && !isPublicScreen) {
    return <LoginScreen />;
  }

  // Auth & Onboarding Flow
  if (currentScreen === 'login') return <LoginScreen />;
  if (currentScreen === 'verify-otp') return <VerifyOTPScreen />;
  if (currentScreen === 'onboarding-1') return <ShopOnboardingStep1 />;
  if (currentScreen === 'onboarding-2') return <ShopOnboardingStep2 />;
  if (currentScreen === 'onboarding-3') return <ShopOnboardingStep3 />;
  if (currentScreen === 'shop-success') return <ShopCreatedSuccessScreen />;

  // Main Dashboard Layout (Guarded: Authenticated Only)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#0E1013' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {currentScreen === 'dashboard' && <DashboardScreen />}
          {currentScreen === 'orders' && <OrdersScreen />}
          {currentScreen === 'queue' && <PrintQueueScreen />}
          {currentScreen === 'pricing' && <PricingServicesScreen />}
          {currentScreen === 'reports' && <ReportsAnalyticsScreen />}
          {currentScreen === 'payouts' && <PayoutsScreen />}
          {currentScreen === 'profile' && <ShopProfileScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
        </main>
      </div>
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MerchantProvider>
      <MainNavigator />
    </MerchantProvider>
  );
};

export default App;
