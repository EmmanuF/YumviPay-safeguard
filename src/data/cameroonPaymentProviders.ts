
export interface PaymentProvider {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  instructions?: string[];
  supportPhone?: string;
  fees?: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  limits?: {
    min: number;
    max: number;
    currency: string;
  };
  processingTime?: string;
  popularityScore?: number;
  usageCount?: number;
}

export interface PaymentMethodDetails {
  id: string;
  name: string;
  providers: PaymentProvider[];
  icon: string;
  description?: string;
}

// Updated payment method details for Cameroon
export const cameroonPaymentMethods: PaymentMethodDetails[] = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: 'smartphone',
    description: 'Send money directly to mobile money accounts with instant transfers',
    providers: [
      {
        id: 'mtn_momo',
        name: 'MTN Mobile Money',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.svg/2048px-New-mtn-logo.svg.png',
        description: 'Pay with your MTN Mobile Money account - the most widely used mobile money service in Cameroon',
        instructions: [
          'Enter your MTN number in the format +237 6XX XX XX XX',
          'You will receive an USSD prompt on your phone',
          'Enter your MTN Mobile Money PIN to confirm',
          'You will receive an SMS confirmation'
        ],
        supportPhone: '+237 677 677 677',
        fees: {
          percentage: 1.0,
          fixed: 100,
          currency: 'XAF'
        },
        limits: {
          min: 1000,
          max: 500000,
          currency: 'XAF'
        },
        processingTime: 'Instant',
        popularityScore: 5,
      },
      {
        id: 'orange_money',
        name: 'Orange Money',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2048px-Orange_logo.svg.png',
        description: 'Pay with your Orange Money account - fast and secure mobile transfers',
        instructions: [
          'Enter your Orange number in the format +237 6XX XX XX XX',
          'You will receive an USSD prompt on your phone',
          'Enter your Orange Money PIN to confirm',
          'You will receive an SMS confirmation'
        ],
        supportPhone: '+237 699 699 699',
        fees: {
          percentage: 1.0,
          fixed: 100,
          currency: 'XAF'
        },
        limits: {
          min: 1000,
          max: 500000,
          currency: 'XAF'
        },
        processingTime: 'Instant',
        popularityScore: 4,
      }
    ]
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: 'bank',
    description: 'Send money directly to bank accounts across Cameroon',
    providers: [
      {
        id: 'afriland',
        name: 'Afriland First Bank',
        logoUrl: 'https://www.afrilandfirstbank.com/sites/default/files/logo.png',
        description: 'Transfer to an Afriland First Bank account - one of Cameroon\'s largest banks',
        instructions: [
          'Enter the account number in the format XXXXX XXXXX XXXXX XXXXXX',
          'Verify the recipient name matches exactly',
          'Confirm the amount and details',
          'You will receive an email confirmation'
        ],
        supportPhone: '+237 233 42 42 42',
        fees: {
          percentage: 0.5,
          fixed: 200,
          currency: 'XAF'
        },
        limits: {
          min: 5000,
          max: 2000000,
          currency: 'XAF'
        },
        processingTime: '1-2 business days',
        popularityScore: 4,
      }
    ]
  }
];

export const getPaymentMethodById = (methodId: string): PaymentMethodDetails | undefined => {
  return cameroonPaymentMethods.find(method => method.id === methodId);
};

export const getProviderById = (methodId: string, providerId: string): PaymentProvider | undefined => {
  const method = getPaymentMethodById(methodId);
  return method?.providers.find(provider => provider.id === providerId);
};

// Get recommended payment providers based on popularity
export const getRecommendedProviders = (methodId: string, limit: number = 2): PaymentProvider[] => {
  const method = getPaymentMethodById(methodId);
  if (!method) return [];
  
  return [...method.providers]
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, limit);
};

// Get the user's preferred payment methods
export const getUserPreferredMethods = (userId: string): { methodId: string, providerId: string }[] => {
  return [
    { methodId: 'mobile_money', providerId: 'mtn_momo' }
  ];
};
