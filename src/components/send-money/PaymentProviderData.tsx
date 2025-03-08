
import React from 'react';
import { Smartphone, Building, CreditCard } from 'lucide-react';

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'smartphone':
      return <Smartphone className="h-5 w-5 text-primary-500" />;
    case 'bank':
      return <Building className="h-5 w-5 text-primary-500" />;
    case 'credit-card':
      return <CreditCard className="h-5 w-5 text-primary-500" />;
    default:
      return <CreditCard className="h-5 w-5 text-primary-500" />;
  }
};

// Hardcoded provider options for demonstration purposes
// In a real app, this would come from an API or database
export const providerOptions = {
  mobile_money: {
    CM: [
      { id: 'mtn_momo', name: 'MTN Mobile Money' },
      { id: 'orange_money', name: 'Orange Money' }
    ],
    GH: [
      { id: 'mtn_momo', name: 'MTN Mobile Money' },
      { id: 'vodafone_cash', name: 'Vodafone Cash' }
    ],
    NG: [
      { id: 'airtel_money', name: 'Airtel Money' },
      { id: 'mtn_momo', name: 'MTN Mobile Money' }
    ],
    KE: [
      { id: 'mpesa', name: 'M-Pesa' },
      { id: 'airtel_money', name: 'Airtel Money' }
    ],
    default: []
  },
  bank_transfer: {
    CM: [
      { id: 'afriland', name: 'Afriland Bank' },
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'uba', name: 'UBA' }
    ],
    GH: [
      { id: 'ecobank', name: 'Ecobank' },
      { id: 'gcb', name: 'GCB Bank' },
      { id: 'absa', name: 'ABSA Bank' }
    ],
    NG: [
      { id: 'gtbank', name: 'GT Bank' },
      { id: 'firstbank', name: 'First Bank' },
      { id: 'zenith', name: 'Zenith Bank' }
    ],
    default: []
  }
};

// Get provider options for the selected payment method and country
export const getProviderOptions = (methodId: string, countryCode: string) => {
  const methodProviders = providerOptions[methodId as keyof typeof providerOptions];
  if (!methodProviders) return [];
  
  return methodProviders[countryCode as keyof typeof methodProviders] || methodProviders.default || [];
};
