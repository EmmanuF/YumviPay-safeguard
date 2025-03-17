
import React from 'react';
import { Smartphone, Building, CreditCard, Landmark, CreditCard as CardIcon } from 'lucide-react';
import { cameroonPaymentMethods } from '@/data/cameroonPaymentProviders';

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'smartphone':
      return <Smartphone className="h-5 w-5 text-primary-500" />;
    case 'bank':
      return <Building className="h-5 w-5 text-primary-500" />;
    case 'credit-card':
      return <CreditCard className="h-5 w-5 text-primary-500" />;
    case 'financial':
      return <Landmark className="h-5 w-5 text-primary-500" />;
    case 'card':
      return <CardIcon className="h-5 w-5 text-primary-500" />;
    default:
      return <CreditCard className="h-5 w-5 text-primary-500" />;
  }
};

// Provider options for all countries, with special focus on Cameroon as the MVP
export const providerOptions = {
  mobile_money: {
    CM: cameroonPaymentMethods
      .find(method => method.id === 'mobile_money')?.providers
      .map(provider => ({ id: provider.id, name: provider.name })) || [
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
    CM: cameroonPaymentMethods
      .find(method => method.id === 'bank_transfer')?.providers
      .map(provider => ({ id: provider.id, name: provider.name })) || [
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
  console.log('Getting provider options for:', methodId, countryCode);
  
  // Ensure we have a valid countryCode, default to CM for MVP
  const country = countryCode || 'CM';
  
  const methodProviders = providerOptions[methodId as keyof typeof providerOptions];
  if (!methodProviders) {
    console.log('No method providers found for:', methodId);
    return [];
  }
  
  // First try to get country-specific providers, then fall back to default
  const providers = methodProviders[country as keyof typeof methodProviders] || 
                   methodProviders.CM || // Fall back to Cameroon as the MVP
                   methodProviders.default || 
                   [];
  
  console.log('Providers found:', providers);
  return providers;
};

// Helper function to get the best payment methods for a country
export const getRecommendedPaymentMethods = (countryCode: string) => {
  // For now, focusing on Cameroon as the MVP
  if (countryCode === 'CM') {
    return ['mobile_money', 'bank_transfer'];
  }
  
  // Default recommendation for other countries
  return ['mobile_money', 'bank_transfer'];
};

// Function to get recommended providers for a specific payment method
export const getRecommendedProviders = (methodId: string) => {
  // Default recommendations for Cameroon as the MVP
  if (methodId === 'mobile_money') {
    return [
      { id: 'mtn_momo', name: 'MTN Mobile Money' },
      { id: 'orange_money', name: 'Orange Money' }
    ];
  } else if (methodId === 'bank_transfer') {
    return [
      { id: 'afriland', name: 'Afriland Bank' },
      { id: 'ecobank', name: 'Ecobank' }
    ];
  }
  
  return [];
};
