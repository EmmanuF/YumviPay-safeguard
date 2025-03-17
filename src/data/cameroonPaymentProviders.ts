
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
        logoUrl: '/lovable-uploads/e46e0ffc-bb69-4357-975a-9143d4045639.png',
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
      },
      {
        id: 'yoomee_money',
        name: 'YooMee Money',
        logoUrl: 'https://play-lh.googleusercontent.com/s7GhFnTdLl1kPnXBxHft1YbS_SlNFZDKRjyT7Li_y-6jVBJtUZOVwdOFw0h2oxpGvGo=w240-h480-rw',
        description: 'Fast and secure mobile money transfers with YooMee',
        instructions: [
          'Enter your YooMee Money number',
          'You will receive an SMS verification code',
          'Enter the code to confirm your transaction',
          'Your payment will be processed instantly'
        ],
        supportPhone: '+237 655 555 555',
        fees: {
          percentage: 0.9,
          fixed: 75,
          currency: 'XAF'
        },
        limits: {
          min: 1000,
          max: 400000,
          currency: 'XAF'
        },
        processingTime: 'Instant',
        popularityScore: 3,
      }
    ]
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: 'credit-card',
    description: 'Transfer directly to bank accounts in Cameroon',
    providers: [
      {
        id: 'ecobank',
        name: 'Ecobank',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/89/Ecobank_logo.svg/1200px-Ecobank_logo.svg.png',
        description: 'Transfer directly to Ecobank accounts across Cameroon',
        instructions: [
          'Enter the recipient\'s Ecobank account number',
          'Verify recipient name matches the account holder',
          'Transfer will be processed within 24 hours',
          'You will receive a confirmation via email'
        ],
        supportPhone: '+237 233 43 82 51',
        fees: {
          percentage: 0.5,
          fixed: 500,
          currency: 'XAF'
        },
        limits: {
          min: 5000,
          max: 2000000,
          currency: 'XAF'
        },
        processingTime: '1-2 business days',
        popularityScore: 4,
      },
      {
        id: 'afriland',
        name: 'Afriland First Bank',
        logoUrl: 'https://www.afrilandfirstbank.com/wp-content/uploads/2022/07/logo-afriland.png',
        description: 'Secure bank transfers to Afriland First Bank accounts',
        instructions: [
          'Enter complete account number (10 digits)',
          'Provide recipient\'s full name as registered with the bank',
          'Your transfer will be processed within 24-48 hours',
          'Transaction receipt will be sent to your email'
        ],
        supportPhone: '+237 233 43 27 90',
        fees: {
          percentage: 0.5,
          fixed: 600,
          currency: 'XAF'
        },
        limits: {
          min: 5000,
          max: 1500000,
          currency: 'XAF'
        },
        processingTime: '1-2 business days',
        popularityScore: 3,
      }
    ]
  },
  {
    id: 'cash_pickup',
    name: 'Cash Pickup',
    icon: 'banknote',
    description: 'Recipients collect cash in person from convenient locations',
    providers: [
      {
        id: 'express_union',
        name: 'Express Union',
        logoUrl: 'https://expressunion.cm/wp-content/uploads/2020/06/EXPRESS-UNION-logo.png',
        description: 'Send money for cash pickup at Express Union locations across Cameroon',
        instructions: [
          'Provide recipient\'s full name exactly as on their ID',
          'Select a convenient Express Union branch for pickup',
          'Recipient must present valid ID matching the name provided',
          'Cash will be available for pickup within 1 hour'
        ],
        supportPhone: '+237 233 42 10 10',
        fees: {
          percentage: 1.5,
          fixed: 500,
          currency: 'XAF'
        },
        limits: {
          min: 3000,
          max: 1000000,
          currency: 'XAF'
        },
        processingTime: 'Within 1 hour',
        popularityScore: 4,
      },
      {
        id: 'emi_money',
        name: 'EMI Money',
        logoUrl: 'https://play-lh.googleusercontent.com/BlFH-1QS2bzIo2FZpNxPRr3daRQHmYqw57LV-Zl9QyQwkfejcvLwfmOrqwTECr6ZFt0=w240-h480-rw',
        description: 'Fast cash pickup service at EMI Money locations throughout Cameroon',
        instructions: [
          'Enter recipient\'s full name as it appears on their ID',
          'Recipient will receive SMS with pickup code',
          'Recipient must present ID and pickup code at EMI location',
          'Money available within 30 minutes'
        ],
        supportPhone: '+237 233 50 10 10',
        fees: {
          percentage: 1.2,
          fixed: 400,
          currency: 'XAF'
        },
        limits: {
          min: 2000,
          max: 800000,
          currency: 'XAF'
        },
        processingTime: '30 minutes',
        popularityScore: 3,
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
  // This would typically come from a database, but for now we'll return a static example
  return [
    { methodId: 'mobile_money', providerId: 'mtn_momo' },
    { methodId: 'bank_transfer', providerId: 'ecobank' }
  ];
};
