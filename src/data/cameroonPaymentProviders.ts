import { Smartphone, CreditCard, Building } from "lucide-react";

// Define payment provider types
export interface PaymentProvider {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  isAvailable: boolean;
  isRecommended?: boolean;
  processingTime?: string;
  popularityScore?: number;
  instructions?: string[];
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
    processingTime: 'Instant',
    popularityScore: 5,
    instructions: [
      'Enter the recipient\'s MTN mobile number',
      'Make sure the number starts with 67, 68, 65, or 66'
    ]
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
    processingTime: 'Instant',
    popularityScore: 4,
    instructions: [
      'Enter the recipient\'s Orange mobile number',
      'Make sure the number starts with 69, 65, or 66'
    ]
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
    processingTime: '1-2 business days',
    popularityScore: 3,
    instructions: [
      'Enter the recipient\'s account number',
      'Account number should be 10-12 digits'
    ]
  },
  {
    id: 'ecobank',
    name: 'Ecobank',
    description: 'Send to Ecobank accounts',
    logoUrl: '/assets/providers/ecobank-logo.png',
    isAvailable: false,
    processingTime: '1-2 business days',
    popularityScore: 3,
    instructions: [
      'Enter the recipient\'s account number',
      'Account number should be 10-12 digits'
    ]
  },
  {
    id: 'yoomee_money',
    name: 'Yoomee Money',
    description: 'Send to Yoomee Money wallets',
    logoUrl: '/assets/providers/yoomee-logo.png',
    isAvailable: false,
    processingTime: 'Instant',
    popularityScore: 2,
    instructions: [
      'Enter the recipient\'s Yoomee mobile number',
      'Make sure the number format is correct'
    ]
  },
];

// Get all providers for a payment method
export const getProvidersByMethod = (methodId: string): PaymentProvider[] => {
  console.log(`DEBUG - getProvidersByMethod called with ID: "${methodId}"`);
  
  // Normalize the method ID to handle both dash and underscore formats
  const normalizedId = methodId.replace(/-/g, '_');
  console.log(`DEBUG - Normalized method ID: "${normalizedId}"`);
  
  let providers: PaymentProvider[] = [];
  
  switch (normalizedId) {
    case 'mobile_money_mtn':
    case 'mtn_mobile_money':
      console.log('DEBUG - Returning MTN providers');
      providers = mtnMobileMoneyProviders;
      break;
    case 'mobile_money_orange':
    case 'orange_money':
      console.log('DEBUG - Returning Orange providers');
      providers = orangeMoneyProviders;
      break;
    case 'bank_transfer':
      console.log('DEBUG - Returning bank transfer providers');
      providers = bankTransferProviders;
      break;
    case 'mobile_money':
      console.log('DEBUG - Returning all mobile money providers');
      providers = [...mtnMobileMoneyProviders, ...orangeMoneyProviders];
      break;
    default:
      console.log(`DEBUG - No providers found for method ID: "${normalizedId}"`);
      providers = [];
  }
  
  console.log(`DEBUG - Returning ${providers.length} providers:`, providers);
  return providers;
};

// Get provider by ID
export const getProviderById = (methodId: string): PaymentProvider | undefined => {
  console.log(`DEBUG - getProviderById called with ID: "${methodId}"`);
  
  // Normalize the ID to handle both dash and underscore formats
  const normalizedId = methodId.replace(/-/g, '_');
  console.log(`DEBUG - Normalized provider ID: "${normalizedId}"`);
  
  const allProviders = [
    ...mtnMobileMoneyProviders,
    ...orangeMoneyProviders,
    ...bankTransferProviders,
  ];
  
  const provider = allProviders.find(provider => 
    provider.id === normalizedId || provider.id === methodId
  );
  
  console.log(`DEBUG - Provider found:`, provider);
  return provider;
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
