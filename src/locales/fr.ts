
// French translations
const frTranslations = {
  // General
  'app.name': 'Yumvi-Pay',
  'app.tagline': 'Envoyez de l\'argent à vos proches',
  'app.loading': 'Chargement...',
  'app.pleaseWait': 'Veuillez patienter...',
  'app.optimized.mobile': 'Optimisé pour mobile',
  
  // Hero section
  'hero.title': 'Transferts Sans Limites',
  'hero.subtitle': 'Transferts d\'argent rapides, sécurisés et abordables vers l\'Afrique',
  'hero.subheading': 'Envoyez de l\'Argent Instantanément, en Toute Sécurité et Sans Tracas.',
  'hero.getStarted': 'Commencer',
  'hero.downloadApp': 'Télécharger l\'App',
  'hero.features.fast': 'Rapide & Sécurisé',
  'hero.features.free': 'Transferts Gratuits',
  'hero.calculator.title': 'Calculer Votre Transfert',
  'hero.calculator.youSend': 'Vous Envoyez',
  'hero.calculator.theyReceive': 'Ils Reçoivent',
  'hero.calculator.button': 'Envoyer Maintenant',
  'hero.calculator.rate': 'Taux de change: 1 {from} = {to} {toCurrency}',
  
  // Countries
  'country.cameroon': 'Cameroun',
  'country.nigeria': 'Nigeria',
  'country.kenya': 'Kenya',
  'country.ghana': 'Ghana',
  'country.us': 'États-Unis',
  
  // Payment Methods
  'payment.mobile_money': 'Envoyer via mobile money',
  'payment.bank_transfer': 'Envoyer via virement bancaire',
  'payment.mtn_momo': 'MTN Mobile Money',
  'payment.orange_money': 'Orange Money',
  'payment.credit_card': 'Carte Bancaire',
  
  // Payment loading states
  'payment.loading.default': 'Chargement des options de paiement...',
  'payment.loading.processing': 'Traitement de votre paiement...',
  'payment.loading.verifying': 'Vérification de votre transaction...',
  'payment.loading.time': 'Cela peut prendre quelques instants',
  'payment.error.help': 'Veuillez réessayer ou contacter le support si le problème persiste',
  
  // Transaction Flow
  'transaction.send_money': 'Envoyer de l\'Argent',
  'transaction.amount': 'Montant',
  'transaction.recipient': 'Nom du Destinataire',
  'transaction.payment_method': 'Méthode de Paiement',
  'transaction.confirm': 'Confirmer le Transfert',
  'transaction.success': 'Transfert Réussi',
  'transaction.processing': 'Traitement en Cours',
  'transaction.failed': 'Échec du Transfert',
  'transaction.details': 'Détails de la Transaction',
  'transaction.status': 'Statut',
  'transaction.date': 'Date',
  'transaction.time': 'Heure',
  'transaction.referenceId': 'ID de Référence',
  'transaction.fee': 'Frais',
  'transaction.total': 'Total',
  'transaction.exchangeRate': 'Taux de Change',
  'transaction.receivedAmount': 'Montant Reçu',
  'transaction.sendAgain': 'Envoyer à Nouveau',
  'transaction.viewHistory': 'Voir l\'Historique',
  'transaction.goBack': 'Retour',
  'transaction.estimatedDelivery': 'Délai de Livraison Estimé',
  'transaction.recipient_gets': 'Le destinataire reçoit',
  'transaction.created': 'Transaction Créée',
  'transaction.marked.completed': 'Votre transaction a été marquée comme terminée',
  'transaction.view.offline': 'Voir les données hors ligne',
  'transaction.new': 'Démarrer une nouvelle transaction',
  'transaction.creating': 'Création de votre transaction',
  'transaction.taking.longer': 'Prend plus de temps que prévu',
  'transaction.retry.options': 'Voulez-vous réessayer ou terminer la transaction maintenant?',
  'transaction.complete.now': 'Terminer la transaction maintenant',
  'transaction.start.new': 'Démarrer une nouvelle transaction',
  
  // Transaction errors
  'error.no.transaction': 'Aucun ID de transaction disponible',
  'error.updating.transaction': 'Erreur lors de la mise à jour de la transaction',
  'error.loading.data': 'Erreur lors du chargement des données',
  'error.offline': 'Vous êtes actuellement hors ligne',
  'error.check.connection': 'Veuillez vérifier votre connexion',
  'error.offline.transaction': 'Impossible de charger les détails de la transaction hors ligne',
  
  // Common actions
  'action.retry': 'Réessayer',
  
  // SendMoney component
  'sendMoney.title': 'Envoyer de l\'Argent',
  'sendMoney.description': 'Remplissez les détails ci-dessous pour envoyer de l\'argent',
  'sendMoney.amountLabel': 'Montant',
  'sendMoney.amountPlaceholder': 'Entrez le montant',
  'sendMoney.countryLabel': 'Pays',
  'sendMoney.countryPlaceholder': 'Sélectionnez le pays',
  'sendMoney.paymentMethodLabel': 'Méthode de Paiement',
  'sendMoney.recipientNameLabel': 'Nom du Destinataire',
  'sendMoney.recipientNamePlaceholder': 'Entrez le nom du destinataire',
  'sendMoney.recipientContactLabel': 'Contact du Destinataire',
  'sendMoney.recipientContactPlaceholder': 'Entrez le numéro de téléphone du destinataire',
  'sendMoney.submitButton': 'Envoyer de l\'Argent',
  'sendMoney.initialDataTitle': 'Commençons Votre Transaction',
  'sendMoney.initialDataDescription': 'D\'abord, sélectionnez votre montant et votre devise',
  'sendMoney.calculatorTitle': 'Calculer le Taux de Change',
  'sendMoney.calculatorDescription': 'Vérifiez combien votre destinataire recevra',
  'sendMoney.pleaseWait': 'Veuillez patienter',
  'sendMoney.loadingData': 'Chargement des données de transaction...',
  'sendMoney.processing': 'Traitement en cours...',
  
  // Features section
  'features.title': 'Pourquoi Choisir Yumvi-Pay',
  'features.subtitle': 'Nous offrons la meilleure expérience pour envoyer de l\'argent vers l\'Afrique',
  'features.rates.title': 'Meilleurs Taux de Change',
  'features.rates.description': 'Nous offrons des taux de change compétitifs qui font que votre argent va plus loin lors d\'envois vers l\'Afrique.',
  'features.transparent.title': 'Simple & Transparent',
  'features.transparent.description': 'Sachez exactement combien votre destinataire recevra avant d\'envoyer, sans frais ni charges cachés.',
  'features.secure.title': 'KYC Sécurisé & Rapide',
  'features.secure.description': 'Notre vérification intégrée garantit des transactions sûres et rapides avec un temps d\'attente minimal.',
  
  // Testimonials
  'testimonials.title': 'Ce que Disent Nos Clients',
  'testimonials.subtitle': 'Des milliers de personnes font confiance à Yumvi-Pay pour envoyer de l\'argent à leurs proches chaque jour',
  'testimonials.cta': 'Rejoignez des milliers de clients satisfaits utilisant Yumvi-Pay aujourd\'hui!',
  
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
  'auth.signout': "Déconnexion",
  
  // Footer
  'footer.company': 'Entreprise',
  'footer.about': 'À Propos',
  'footer.careers': 'Carrières',
  'footer.press': 'Presse',
  'footer.blog': 'Blog',
  'footer.legal': 'Mentions Légales',
  'footer.terms': 'Conditions d\'Utilisation',
  'footer.privacy': 'Politique de Confidentialité',
  'footer.security': 'Sécurité',
  'footer.compliance': 'Conformité',
  'footer.cookies': 'Politique de Cookies',
  'footer.help': 'Aide & Support',
  'footer.faq': 'FAQ',
  'footer.contact': 'Nous Contacter',
  'footer.support': 'Centre d\'Assistance',
  'footer.countries': 'Pays',
  'footer.follow': 'Suivez-nous',
  'footer.copyright': '© 2024 Yumvi-Pay. Tous droits réservés.',
  'footer.app.download': 'Téléchargez Notre Application Mobile',
  'footer.app.download.title': 'Téléchargez Notre Application Mobile',
  'footer.app.download.description': 'Profitez de la meilleure expérience avec notre application mobile. Envoyez de l\'argent en déplacement, suivez vos transactions et recevez des notifications.',
  'footer.app.download.users': 'Plus de 10 000 utilisateurs actifs',
  'footer.newsletter': 'Abonnez-vous à notre newsletter',
  'footer.newsletter.placeholder': 'Entrez votre email',
  'footer.newsletter.button': 'S\'abonner',
  
  // Language
  'language.english': 'English',
  'language.french': 'Français',
  'language.changed': 'Langue Modifiée',
  'language.change_failed': 'Échec du Changement de Langue',
  'language.try_again': 'Veuillez réessayer plus tard',
  
  // Error messages
  'error.invalid_number': 'Numéro de téléphone invalide',
  'error.invalid_account': 'Numéro de compte invalide',
  'error.network': 'Erreur de réseau',
  'error.unexpected': 'Une erreur inattendue s\'est produite',
  'common.offline': 'Vous êtes actuellement hors ligne',
  'common.offline.description': 'Veuillez vérifier votre connexion et réessayer',
  'common.retry': 'Réessayer',
  
  // Settings
  'settings.language': 'Langue',
  'settings.notifications': 'Notifications',
  'settings.theme': 'Thème',
  'settings.currency': 'Devise',
  'settings.security': 'Sécurité',
  
  // Common actions
  'actions.save': 'Enregistrer',
  'actions.cancel': 'Annuler',
  'actions.confirm': 'Confirmer',
  'actions.delete': 'Supprimer',
  'actions.edit': 'Modifier',
  'actions.view': 'Voir',
  'actions.continue': 'Continuer',
  'actions.back': 'Retour',
  'actions.send': 'Envoyer',
  'actions.receive': 'Recevoir',
  'actions.share': 'Partager',
  'actions.download': 'Télécharger',
  
  // App download section
  'app.download.title': 'Téléchargez Notre Application Mobile',
  'app.download.description': 'Profitez de la meilleure expérience avec notre application mobile. Envoyez de l\'argent en déplacement, suivez vos transactions et recevez des notifications.',
  'app.download.users': 'Plus de 10 000 utilisateurs actifs',
  'app.download.ios.comingSoon': 'Application iOS bientôt disponible !',
  'app.download.android.comingSoon': 'Application Android bientôt disponible !',
};

export { frTranslations };
export default frTranslations;
