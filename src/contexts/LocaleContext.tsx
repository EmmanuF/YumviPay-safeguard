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
    
    // Recipients
    'recipients.title': 'Recipients',
    'recipients.add': 'Add Recipient',
    'recipients.list': 'Your Recipients',
    'recipients.empty': 'No recipients yet',
    'recipients.add_first': 'Add your first recipient',
    'recipients.edit': 'Edit Recipient',
    'recipients.delete': 'Delete Recipient',
    'recipients.confirm_delete': 'Are you sure you want to delete this recipient?',
    'recipients.search': 'Search recipients',
    'recipients.saved': 'Recipient saved successfully',
    'recipients.deleted': 'Recipient deleted successfully',
    
    // Tabs and Navigation
    'nav.home': 'Home',
    'nav.send': 'Send',
    'nav.recipients': 'Recipients',
    'nav.history': 'History',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    
    // Profile and Authentication
    'profile.title': 'Profile',
    'profile.account': 'Account Information',
    'profile.security': 'Security Settings',
    'profile.notification': 'Notifications',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'profile.change_password': 'Change Password',
    'profile.logout': 'Logout',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.forgot': 'Forgot Password',
    'auth.reset': 'Reset Password',
    
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
    
    // Recipients
    'recipients.title': 'Destinataires',
    'recipients.add': 'Ajouter un Destinataire',
    'recipients.list': 'Vos Destinataires',
    'recipients.empty': 'Pas encore de destinataires',
    'recipients.add_first': 'Ajoutez votre premier destinataire',
    'recipients.edit': 'Modifier le Destinataire',
    'recipients.delete': 'Supprimer le Destinataire',
    'recipients.confirm_delete': 'Êtes-vous sûr de vouloir supprimer ce destinataire?',
    'recipients.search': 'Rechercher des destinataires',
    'recipients.saved': 'Destinataire enregistré avec succès',
    'recipients.deleted': 'Destinataire supprimé avec succès',
    
    // Tabs and Navigation
    'nav.home': 'Accueil',
    'nav.send': 'Envoyer',
    'nav.recipients': 'Destinataires',
    'nav.history': 'Historique',
    'nav.profile': 'Profil',
    'nav.dashboard': 'Tableau de Bord',
    
    // Profile and Authentication
    'profile.title': 'Profil',
    'profile.account': 'Informations du Compte',
    'profile.security': 'Paramètres de Sécurité',
    'profile.notification': 'Notifications',
    'profile.edit': 'Modifier le Profil',
    'profile.save': 'Enregistrer les Modifications',
    'profile.change_password': 'Changer le Mot de Passe',
    'profile.logout': 'Déconnexion',
    'auth.signin': 'Se Connecter',
    'auth.signup': 'S\'inscrire',
    'auth.forgot': 'Mot de Passe Oublié',
    'auth.reset': 'Réinitialiser le Mot de Passe',
    
    // Other
    'error.invalid_number': 'Numéro de téléphone invalide',
    'error.invalid_account': 'Numéro de compte invalide',
    'settings.language': 'Langue',
    'language.english': 'English',
    'language.french': 'Français',
  }
};

export const LocaleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Set a default locale that is guaranteed to be valid
  const [locale, setLocale] = useState<Locale>('en');
  
  // Initialize locale from stored preference or user profile
  useEffect(() => {
    const loadLocale = async () => {
      try {
        // Try to get from localStorage first
        const storedLocale = localStorage.getItem('yumvi-locale');
        console.log('Stored locale:', storedLocale);
        
        if (storedLocale === 'en' || storedLocale === 'fr') {
          console.log('Setting locale from localStorage:', storedLocale);
          setLocale(storedLocale as Locale);
          return;
        }
        
        // If authenticated, try to get from user profile
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // First check if we need to update the profiles table
          const { data: hasLanguageColumn } = await supabase
            .from('profiles')
            .select('id') // Just select a valid column to test
            .limit(1)
            .single();
            
          // If we could fetch the profile, let's add a language preference
          if (hasLanguageColumn) {
            // We'll store the language preference in localStorage
            localStorage.setItem('yumvi-locale', 'en');
          }
        }
      } catch (error) {
        console.error('Error loading locale from profile:', error);
        // Ensure we always have a valid locale by setting it to 'en'
        localStorage.setItem('yumvi-locale', 'en');
      }
    };
    
    loadLocale();
  }, []);
  
  // Update locale in localStorage
  const updateLocale = async (newLocale: Locale) => {
    // Make sure we're setting a valid locale
    if (newLocale !== 'en' && newLocale !== 'fr') {
      console.warn(`Invalid locale requested: ${newLocale}, defaulting to 'en'`);
      newLocale = 'en';
    }
    
    console.log(`Setting new locale: ${newLocale}`);
    setLocale(newLocale);
    localStorage.setItem('yumvi-locale', newLocale);
    
    // We'll implement database storage when the column is available
    console.log(`Locale switched to: ${newLocale}`);
  };
  
  // Translation function
  const t = (key: string): string => {
    // Ensure we're using a valid locale
    const safeLocale = locale === 'en' || locale === 'fr' ? locale : 'en';
    
    // Get translation or fall back to key if not found
    const translation = translations[safeLocale][key];
    if (!translation) {
      console.warn(`Translation key not found: ${key} for locale: ${safeLocale}`);
      return key;
    }
    
    return translation;
  };
  
  // For debugging
  useEffect(() => {
    console.log('Current locale in context:', locale);
  }, [locale]);
  
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
