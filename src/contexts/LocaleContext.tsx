import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define available locales
export type Locale = 'en' | 'fr';

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // General
    'app.name': 'Yumvi-Pay',
    'app.tagline': 'Send money to your loved ones',
    
    // Countries
    'country.cameroon': 'Cameroon',
    
    // Payment Methods
    'payment.mobile_money': 'Mobile Money',
    'payment.bank_transfer': 'Bank Transfer',
    'payment.mtn_momo': 'MTN Mobile Money',
    'payment.orange_money': 'Orange Money',
    'payment.credit_card': 'Credit Card',
    
    // Transaction Flow
    'transaction.send_money': 'Send Money',
    'transaction.amount': 'Amount',
    'transaction.recipient': 'Recipient',
    'transaction.payment_method': 'Payment Method',
    'transaction.confirm': 'Confirm Transfer',
    'transaction.success': 'Transfer Successful',
    'transaction.processing': 'Processing Transfer',
    'transaction.failed': 'Transfer Failed',
    
    // Mobile Money Specific
    'momo.number': 'Mobile Number',
    'momo.enter_number': 'Enter mobile number',
    'momo.number_format': 'Format: +237 6XX XX XX XX',
    'momo.provider': 'Choose Provider',
    'momo.provider_prompt': 'Select your mobile money provider',
    
    // Banks
    'bank.account_number': 'Account Number',
    'bank.enter_account': 'Enter account number',
    'bank.account_format': 'Format: XXXXX XXXXX XXXXX XXXXXX',
    'bank.provider': 'Choose Bank',
    
    // Other
    'error.invalid_number': 'Invalid phone number',
    'error.invalid_account': 'Invalid account number',
    'settings.language': 'Language',
    'language.english': 'English',
    'language.french': 'Français',
  },
  fr: {
    // General
    'app.name': 'Yumvi-Pay',
    'app.tagline': 'Envoyez de l\'argent à vos proches',
    
    // Countries
    'country.cameroon': 'Cameroun',
    
    // Payment Methods
    'payment.mobile_money': 'Mobile Money',
    'payment.bank_transfer': 'Virement Bancaire',
    'payment.mtn_momo': 'MTN Mobile Money',
    'payment.orange_money': 'Orange Money',
    'payment.credit_card': 'Carte Bancaire',
    
    // Transaction Flow
    'transaction.send_money': 'Envoyer de l\'Argent',
    'transaction.amount': 'Montant',
    'transaction.recipient': 'Destinataire',
    'transaction.payment_method': 'Méthode de Paiement',
    'transaction.confirm': 'Confirmer le Transfert',
    'transaction.success': 'Transfert Réussi',
    'transaction.processing': 'Traitement en Cours',
    'transaction.failed': 'Échec du Transfert',
    
    // Mobile Money Specific
    'momo.number': 'Numéro Mobile',
    'momo.enter_number': 'Entrez le numéro mobile',
    'momo.number_format': 'Format: +237 6XX XX XX XX',
    'momo.provider': 'Choisir un Fournisseur',
    'momo.provider_prompt': 'Sélectionnez votre fournisseur de mobile money',
    
    // Banks
    'bank.account_number': 'Numéro de Compte',
    'bank.enter_account': 'Entrez le numéro de compte',
    'bank.account_format': 'Format: XXXXX XXXXX XXXXX XXXXXX',
    'bank.provider': 'Choisir une Banque',
    
    // Other
    'error.invalid_number': 'Numéro de téléphone invalide',
    'error.invalid_account': 'Numéro de compte invalide',
    'settings.language': 'Langue',
    'language.english': 'English',
    'language.french': 'Français',
  }
};

export const LocaleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  
  // Initialize locale from stored preference or user profile
  useEffect(() => {
    const loadLocale = async () => {
      // Try to get from localStorage first
      const storedLocale = localStorage.getItem('yumvi-locale');
      if (storedLocale && (storedLocale === 'en' || storedLocale === 'fr')) {
        setLocale(storedLocale);
        return;
      }
      
      // If authenticated, try to get from user profile
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('preferred_language')
            .eq('id', session.user.id)
            .single();
            
          if (profile?.preferred_language && 
              (profile.preferred_language === 'en' || profile.preferred_language === 'fr')) {
            setLocale(profile.preferred_language);
            localStorage.setItem('yumvi-locale', profile.preferred_language);
          }
        }
      } catch (error) {
        console.error('Error loading locale from profile:', error);
      }
    };
    
    loadLocale();
  }, []);
  
  // Update locale both in localStorage and user profile if authenticated
  const updateLocale = async (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('yumvi-locale', newLocale);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({ preferred_language: newLocale })
          .eq('id', session.user.id);
      }
    } catch (error) {
      console.error('Error updating locale in profile:', error);
    }
  };
  
  // Translation function
  const t = (key: string): string => {
    return translations[locale][key] || key;
  };
  
  const value = {
    locale,
    setLocale: updateLocale,
    t
  };
  
  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
