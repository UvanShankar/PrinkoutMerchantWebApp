import React from 'react';
import { ShopOnboardingStep1 } from './ShopOnboardingStep1';

/**
 * Services & Pricing step has been relocated directly into the Merchant Onboarding Profile setup.
 * Registration is streamlined into a single shop details step with OTP verification.
 */
export const ShopOnboardingStep2: React.FC = () => {
  return <ShopOnboardingStep1 />;
};
