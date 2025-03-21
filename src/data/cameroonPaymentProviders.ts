
import { Smartphone, CreditCard, Building } from "lucide-react";

// Define payment provider types
export interface PaymentProvider {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  isAvailable: boolean;
  isRecommended?: boolean;
}

// MTN Mobile Money providers
export const mtnMobileMoneyProviders: PaymentProvider[] = [
  {
    id: 'mtn_mobile_money',
    name: 'MTN Mobile Money',
    description: 'Send directly to MTN Mobile Money accounts',
    logoUrl: '/assets/providers/mtn-logo.png',
    isAvailable: true,
    isRecommended: true,
  },
];

// Orange Money providers
export const orangeMoneyProviders: PaymentProvider[] = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    description: 'Send directly to Orange Money accounts',
    logoUrl: '/assets/providers/orange-logo.png',
    isAvailable: true,
    isRecommended: true,
  },
];

// Bank transfer providers - coming soon
export const bankTransferProviders: PaymentProvider[] = [
  {
    id: 'afriland',
    name: 'Afriland First Bank',
    description: 'Send to Afriland First Bank accounts',
    logoUrl: '/assets/providers/afriland-logo.png',
    isAvailable: false,
  },
  {
    id: 'ecobank',
    name: 'Ecobank',
    description: 'Send to Ecobank accounts',
    logoUrl: '/assets/providers/ecobank-logo.png',
    isAvailable: false,
  },
  {
    id: 'yoomee_money',
    name: 'Yoomee Money',
    description: 'Send to Yoomee Money wallets',
    logoUrl: '/assets/providers/yoomee-logo.png',
    isAvailable: false,
  },
];

// Get all providers for a payment method
export const getProvidersByMethod = (methodId: string): PaymentProvider[] => {
  switch (methodId) {
    case 'mobile_money_mtn':
    case 'mtn_mobile_money':
      return mtnMobileMoneyProviders;
    case 'mobile_money_orange':
    case 'orange_money':
      return orangeMoneyProviders;
    case 'bank_transfer':
      return bankTransferProviders;
    case 'mobile_money':
      return [...mtnMobileMoneyProviders, ...orangeMoneyProviders];
    default:
      return [];
  }
};

// Get provider by ID
export const getProviderById = (id: string): PaymentProvider | undefined => {
  const allProviders = [
    ...mtnMobileMoneyProviders,
    ...orangeMoneyProviders,
    ...bankTransferProviders,
  ];
  return allProviders.find(provider => provider.id === id);
};

// Get payment method by ID
export const getPaymentMethodById = (id: string): { name: string; icon: any } | undefined => {
  const methods = {
    'mobile_money': { name: 'Mobile Money', icon: Smartphone },
    'credit_card': { name: 'Credit Card', icon: CreditCard },
    'bank_transfer': { name: 'Bank Transfer', icon: Building },
  };
  return methods[id as keyof typeof methods];
};

// Get recommended providers for a country
export const getRecommendedProviders = (countryCode: string): string[] => {
  // For MVP, we're focusing on Cameroon
  if (countryCode === 'CM') {
    return ['mtn_mobile_money', 'orange_money'];
  }
  return [];
};

// Get all available payment methods for a country
export const getAvailableMethods = (countryCode: string) => {
  if (countryCode === 'CM') {
    return [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Pay with MTN or Orange Mobile Money',
        providers: ['mtn_mobile_money', 'orange_money'],
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Pay with your bank account',
        providers: ['afriland', 'ecobank'],
        comingSoon: true,
      },
    ];
  }
  return [];
};
