
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
    CM: [
      { id: 'mtn_momo', name: 'MTN Mobile Money' },
      { id: 'orange_money', name: 'Orange Money' }
    ],
    default: []
  },
  bank_transfer: {
    CM: [
      { id: 'afriland', name: 'Afriland First Bank' }
    ],
    default: []
  }
};

// Get provider options for the selected payment method and country
export const getProviderOptions = (methodId: string, countryCode: string) => {
  console.log('Getting provider options for:', methodId, countryCode);
  
  // For Cameroon, only return mobile money options if that's the method
  if (countryCode === 'CM' && methodId === 'mobile_money') {
    return providerOptions.mobile_money.CM;
  }
  
  // For other methods/countries, use standard logic
  const methodProviders = providerOptions[methodId as keyof typeof providerOptions];
  if (!methodProviders) {
    console.log('No method providers found for:', methodId);
    return [];
  }
  
  // First try to get country-specific providers, then fall back to default
  const providers = methodProviders[countryCode as keyof typeof methodProviders] || 
                   methodProviders.CM || 
                   methodProviders.default || 
                   [];
  
  console.log('Providers found:', providers);
  return providers;
};

// Helper function to get the best payment methods for a country
export const getRecommendedPaymentMethods = (countryCode: string) => {
  // For Cameroon as the MVP, only recommend mobile money
  if (countryCode === 'CM') {
    return ['mobile_money'];
  }
  
  // Default recommendation for other countries
  return ['mobile_money'];
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
      { id: 'afriland', name: 'Afriland First Bank' }
    ];
  }
  
  return [];
};
