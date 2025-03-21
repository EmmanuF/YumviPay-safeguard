
import React from 'react';
import { Smartphone, CreditCard, Building, BanknoteIcon, Star } from 'lucide-react';
import { getProvidersByMethod } from '@/data/cameroonPaymentProviders';

// Get provider options
export const getProviderOptions = (methodId: string, countryCode: string) => {
  return getProvidersByMethod(methodId).map(provider => ({
    id: provider.id,
    name: provider.name,
    logoUrl: provider.logoUrl || '', 
    description: provider.description || '',
    isAvailable: provider.isAvailable,
  }));
};

// Get icon component based on icon name
export const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'smartphone':
      return <Smartphone className="h-6 w-6 text-primary-500" />;
    case 'credit-card':
      return <CreditCard className="h-6 w-6 text-primary-500" />;
    case 'bank':
      return <Building className="h-6 w-6 text-primary-500" />;
    case 'banknote':
      return <BanknoteIcon className="h-6 w-6 text-primary-500" />;
    default:
      return <Smartphone className="h-6 w-6 text-primary-500" />;
  }
};

// Get recommended payment methods for a country
export const getRecommendedPaymentMethods = (countryCode: string): string[] => {
  // For MVP focusing on Cameroon
  if (countryCode === 'CM') {
    return ['mobile_money'];
  }
  
  return [];
};
