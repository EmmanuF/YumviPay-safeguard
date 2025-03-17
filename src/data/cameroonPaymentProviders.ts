
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
  popularityScore?: number; // For suggesting popular methods
  usageCount?: number; // For tracking preferences
}

export interface PaymentMethodDetails {
  id: string;
  name: string;
  providers: PaymentProvider[];
  icon: string;
  description?: string;
}

// Comprehensive payment method details for Cameroon
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
      },
      {
        id: 'yoomee_money',
        name: 'YooMee Money',
        logoUrl: 'https://play-lh.googleusercontent.com/DVwQMuDgmRG7xfvQfHBkz3q2igHnsiZPOzBwI0L-A4wFCPAuGrd5wPYIcerHYQj-rNQ',
        description: 'Transfer money using YooMee Money - a growing mobile money service',
        instructions: [
          'Enter YooMee account number',
          'Recipient will receive notification',
          'Funds will be available immediately'
        ],
        supportPhone: '+237 652 652 652',
        fees: {
          percentage: 1.5,
          fixed: 150,
          currency: 'XAF'
        },
        limits: {
          min: 1000,
          max: 300000,
          currency: 'XAF'
        },
        processingTime: 'Within 15 minutes',
        popularityScore: 2,
      },
      {
        id: 'camtel_mobile',
        name: 'Camtel Mobile Money',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/85/CAMTEL-logo.jpg',
        description: 'Use Camtel Mobile Money for transfers within the Camtel network',
        instructions: [
          'Enter Camtel account number',
          'Verify recipient name',
          'Complete payment authorization'
        ],
        supportPhone: '+237 622 222 222',
        fees: {
          percentage: 1.2,
          fixed: 120,
          currency: 'XAF'
        },
        limits: {
          min: 1000,
          max: 250000,
          currency: 'XAF'
        },
        processingTime: 'Within 30 minutes',
        popularityScore: 1,
      },
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
      },
      {
        id: 'ecobank',
        name: 'Ecobank',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ecobank_Logo.svg/2560px-Ecobank_Logo.svg.png',
        description: 'Transfer to an Ecobank account - a pan-African banking group',
        instructions: [
          'Enter the account number in the format XXXXX XXXXX XXXXX XXXXXX',
          'Verify the recipient name matches exactly',
          'Confirm the amount and details',
          'You will receive an email confirmation'
        ],
        supportPhone: '+237 233 43 82 82',
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
      },
      {
        id: 'uba',
        name: 'UBA',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/United_Bank_for_Africa_logo.svg/1200px-United_Bank_for_Africa_logo.svg.png',
        description: 'Transfer to a UBA account - United Bank for Africa',
        instructions: [
          'Enter the account number in the format XXXXX XXXXX XXXXX XXXXXX',
          'Verify the recipient name matches exactly',
          'Confirm the amount and details',
          'You will receive an email confirmation'
        ],
        supportPhone: '+237 233 50 85 00',
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
        popularityScore: 3,
      },
      {
        id: 'bicec',
        name: 'BICEC',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Logo_BICEC_2018.png',
        description: 'Transfer to a BICEC account - Banque Internationale du Cameroun pour l\'Epargne et le Crédit',
        instructions: [
          'Enter the account number in the correct format',
          'Verify the recipient name matches exactly',
          'Confirm the amount and details',
          'You will receive an email confirmation'
        ],
        supportPhone: '+237 233 42 10 10',
        fees: {
          percentage: 0.6,
          fixed: 250,
          currency: 'XAF'
        },
        limits: {
          min: 5000,
          max: 1500000,
          currency: 'XAF'
        },
        processingTime: '1-2 business days',
        popularityScore: 3,
      },
      {
        id: 'sgc',
        name: 'Société Générale Cameroun',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d1/Logo_Soci%C3%A9t%C3%A9_G%C3%A9n%C3%A9rale.svg/1280px-Logo_Soci%C3%A9t%C3%A9_G%C3%A9n%C3%A9rale.svg.png',
        description: 'Transfer to a Société Générale account',
        instructions: [
          'Enter the account number in the correct format',
          'Verify the recipient name matches exactly',
          'Confirm the amount and details',
          'You will receive an email confirmation'
        ],
        supportPhone: '+237 233 42 51 11',
        fees: {
          percentage: 0.7,
          fixed: 300,
          currency: 'XAF'
        },
        limits: {
          min: 10000,
          max: 2000000,
          currency: 'XAF'
        },
        processingTime: '1-2 business days',
        popularityScore: 2,
      },
    ]
  },
  {
    id: 'cash_pickup',
    name: 'Cash Pickup',
    icon: 'credit-card',
    description: 'Send money for cash pickup at various locations across Cameroon',
    providers: [
      {
        id: 'express_union',
        name: 'Express Union',
        logoUrl: 'https://expressunioncameroun.com/wp-content/uploads/2016/11/LOGO-EX-UN-280x280.png',
        description: 'Send money for cash pickup at Express Union branches',
        instructions: [
          'Enter recipient details',
          'Recipient must present ID for pickup',
          'Available at any Express Union branch',
          'Recipient will need the reference number provided'
        ],
        supportPhone: '+237 233 42 31 20',
        fees: {
          percentage: 2.0,
          fixed: 500,
          currency: 'XAF'
        },
        limits: {
          min: 5000,
          max: 1000000,
          currency: 'XAF'
        },
        processingTime: 'Available immediately for pickup',
        popularityScore: 3,
      },
      {
        id: 'moneygram',
        name: 'MoneyGram',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/MoneyGram_logo.svg',
        description: 'Send money for cash pickup at MoneyGram locations',
        instructions: [
          'Enter recipient details',
          'Share reference number with recipient',
          'Recipient must present ID for pickup',
          'Available at banks and other MoneyGram agents'
        ],
        supportPhone: '+237 233 42 42 42',
        fees: {
          percentage: 2.5,
          fixed: 1000,
          currency: 'XAF'
        },
        limits: {
          min: 10000,
          max: 2000000,
          currency: 'XAF'
        },
        processingTime: 'Available immediately for pickup',
        popularityScore: 2,
      },
    ]
  },
  {
    id: 'digital_wallet',
    name: 'Digital Wallet',
    icon: 'credit-card',
    description: 'Send money to digital wallets for versatile online payments',
    providers: [
      {
        id: 'paypal',
        name: 'PayPal',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png',
        description: 'Send money to PayPal accounts for online payments',
        instructions: [
          'Enter recipient PayPal email',
          'Confirm transfer details',
          'Recipient will be notified via email',
          'Funds available in PayPal account immediately'
        ],
        supportPhone: '+1 888 221 1161',
        fees: {
          percentage: 3.0,
          fixed: 0,
          currency: 'XAF'
        },
        limits: {
          min: 5000,
          max: 1000000,
          currency: 'XAF'
        },
        processingTime: 'Instant',
        popularityScore: 3,
      },
      {
        id: 'perfect_money',
        name: 'Perfect Money',
        logoUrl: 'https://perfectmoney.com/img/pm-logo.png',
        description: 'Send money to Perfect Money digital wallets',
        instructions: [
          'Enter recipient Perfect Money ID',
          'Confirm transfer details',
          'Funds will be available immediately'
        ],
        supportPhone: 'Online support only',
        fees: {
          percentage: 1.0,
          fixed: 0,
          currency: 'XAF'
        },
        limits: {
          min: 1000,
          max: 500000,
          currency: 'XAF'
        },
        processingTime: 'Instant',
        popularityScore: 1,
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

// Get the user's preferred payment methods (to be used with user-specific saved preferences)
export const getUserPreferredMethods = (userId: string): { methodId: string, providerId: string }[] => {
  // This would normally be fetched from a user preferences database
  // For now, return a mock response
  return [
    { methodId: 'mobile_money', providerId: 'mtn_momo' },
    { methodId: 'bank_transfer', providerId: 'afriland' }
  ];
};
