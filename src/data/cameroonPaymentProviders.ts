
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
}

export interface PaymentMethodDetails {
  id: string;
  name: string;
  providers: PaymentProvider[];
  icon: string;
}

// Comprehensive payment method details for Cameroon
export const cameroonPaymentMethods: PaymentMethodDetails[] = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: 'smartphone',
    providers: [
      {
        id: 'mtn_momo',
        name: 'MTN Mobile Money',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.svg/2048px-New-mtn-logo.svg.png',
        description: 'Pay with your MTN Mobile Money account',
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
        processingTime: 'Instant'
      },
      {
        id: 'orange_money',
        name: 'Orange Money',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2048px-Orange_logo.svg.png',
        description: 'Pay with your Orange Money account',
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
        processingTime: 'Instant'
      },
    ]
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: 'bank',
    providers: [
      {
        id: 'afriland',
        name: 'Afriland First Bank',
        logoUrl: 'https://www.afrilandfirstbank.com/sites/default/files/logo.png',
        description: 'Transfer to an Afriland First Bank account',
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
        processingTime: '1-2 business days'
      },
      {
        id: 'ecobank',
        name: 'Ecobank',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ecobank_Logo.svg/2560px-Ecobank_Logo.svg.png',
        description: 'Transfer to an Ecobank account',
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
        processingTime: '1-2 business days'
      },
      {
        id: 'uba',
        name: 'UBA',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/United_Bank_for_Africa_logo.svg/1200px-United_Bank_for_Africa_logo.svg.png',
        description: 'Transfer to a UBA account',
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
        processingTime: '1-2 business days'
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
