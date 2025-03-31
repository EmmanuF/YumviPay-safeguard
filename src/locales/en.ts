
// English translations
const enTranslations = {
  // General
  'app.name': 'Yumvi-Pay',
  'app.tagline': 'Send money to your loved ones',
  'app.loading': 'Loading...',
  'app.pleaseWait': 'Please wait...',
  'app.optimized.mobile': 'Optimized for mobile',
  
  // Hero section
  'hero.title': 'Transfer Without Boundaries',
  'hero.subtitle': 'Fast, secure, and affordable money transfers to Africa',
  'hero.subheading': 'Send Money Instantly, Securely, and Without Hassle.',
  'hero.getStarted': 'Get Started',
  'hero.downloadApp': 'Download App',
  'hero.features.fast': 'Fast & Secure',
  'hero.features.free': 'Free Transfers',
  'hero.calculator.title': 'Calculate Your Transfer',
  'hero.calculator.youSend': 'You Send',
  'hero.calculator.theyReceive': 'They Receive',
  'hero.calculator.button': 'Send Now',
  'hero.calculator.rate': 'Exchange Rate: 1 {from} = {to} {toCurrency}',
  
  // Countries
  'country.cameroon': 'Cameroon',
  'country.nigeria': 'Nigeria',
  'country.kenya': 'Kenya',
  'country.ghana': 'Ghana',
  'country.us': 'United States',
  
  // Payment Methods
  'payment.mobile_money': 'Send via mobile money',
  'payment.bank_transfer': 'Send via bank transfer',
  'payment.mtn_momo': 'MTN Mobile Money',
  'payment.orange_money': 'Orange Money',
  'payment.credit_card': 'Credit Card',
  
  // Payment loading states
  'payment.loading.default': 'Loading payment options...',
  'payment.loading.processing': 'Processing your payment...',
  'payment.loading.verifying': 'Verifying your transaction...',
  'payment.loading.time': 'This may take a few moments',
  'payment.error.help': 'Please try again or contact support if the issue persists',
  
  // Transaction Flow
  'transaction.send_money': 'Send Money',
  'transaction.amount': 'Amount',
  'transaction.recipient': 'Recipient Name',
  'transaction.payment_method': 'Payment Method',
  'transaction.confirm': 'Confirm Transfer',
  'transaction.success': 'Transfer Successful',
  'transaction.processing': 'Processing Transfer',
  'transaction.failed': 'Transfer Failed',
  'transaction.details': 'Transaction Details',
  'transaction.status': 'Status',
  'transaction.date': 'Date',
  'transaction.time': 'Time',
  'transaction.referenceId': 'Reference ID',
  'transaction.fee': 'Fee',
  'transaction.total': 'Total',
  'transaction.exchangeRate': 'Exchange Rate',
  'transaction.receivedAmount': 'Received Amount',
  'transaction.sendAgain': 'Send Again',
  'transaction.viewHistory': 'View History',
  'transaction.goBack': 'Go Back',
  'transaction.estimatedDelivery': 'Estimated Delivery',
  'transaction.recipient_gets': 'Recipient gets',
  'transaction.created': 'Transaction Created',
  'transaction.marked.completed': 'Your transaction has been marked as completed',
  'transaction.view.offline': 'View Offline Data',
  'transaction.new': 'Start New Transaction',
  'transaction.creating': 'Creating Your Transaction',
  'transaction.taking.longer': 'Taking longer than expected',
  'transaction.retry.options': 'Would you like to retry or complete the transaction now?',
  'transaction.complete.now': 'Complete Transaction Now',
  'transaction.start.new': 'Start New Transaction',
  
  // Transaction errors
  'error.no.transaction': 'No transaction ID available',
  'error.updating.transaction': 'Error Updating Transaction',
  'error.loading.data': 'Error Loading Data',
  'error.offline': 'You are currently offline',
  'error.check.connection': 'Please check your connection',
  'error.offline.transaction': 'Cannot load transaction details while offline',
  
  // Common actions
  'action.retry': 'Retry',
  
  // SendMoney component
  'sendMoney.title': 'Send Money',
  'sendMoney.description': 'Fill in the details below to send money',
  'sendMoney.amountLabel': 'Amount',
  'sendMoney.amountPlaceholder': 'Enter amount',
  'sendMoney.countryLabel': 'Country',
  'sendMoney.countryPlaceholder': 'Select country',
  'sendMoney.paymentMethodLabel': 'Payment Method',
  'sendMoney.recipientNameLabel': 'Recipient Name',
  'sendMoney.recipientNamePlaceholder': 'Enter recipient name',
  'sendMoney.recipientContactLabel': 'Recipient Contact',
  'sendMoney.recipientContactPlaceholder': 'Enter recipient phone number',
  'sendMoney.submitButton': 'Send Money',
  'sendMoney.initialDataTitle': 'Let\'s Start Your Transaction',
  'sendMoney.initialDataDescription': 'First, select your amount and currency',
  'sendMoney.calculatorTitle': 'Calculate Exchange Rate',
  'sendMoney.calculatorDescription': 'Check how much your recipient will receive',
  'sendMoney.pleaseWait': 'Please wait',
  'sendMoney.loadingData': 'Loading transaction data...',
  'sendMoney.processing': 'Processing...',
  
  // Features section
  'features.title': 'Why Choose Yumvi-Pay',
  'features.subtitle': 'We offer the best experience for sending money to Africa',
  'features.rates.title': 'Best Exchange Rates',
  'features.rates.description': 'We offer competitive exchange rates that ensure your money goes further when sending to Africa.',
  'features.transparent.title': 'Simple & Transparent',
  'features.transparent.description': 'Know exactly how much your recipient will get before you send, with no hidden fees or charges.',
  'features.secure.title': 'Secure & Fast KYC',
  'features.secure.description': 'Our integrated verification ensures safe and quick transactions with minimal waiting time.',
  
  // Testimonials
  'testimonials.title': 'What Our Customers Say',
  'testimonials.subtitle': 'Thousands of people trust Yumvi-Pay to send money to their loved ones every day',
  'testimonials.cta': 'Join thousands of satisfied customers using Yumvi-Pay today!',
  
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
  'auth.signout': "Sign Out",
  
  // Footer
  'footer.company': 'Company',
  'footer.about': 'About Us',
  'footer.careers': 'Careers',
  'footer.press': 'Press',
  'footer.blog': 'Blog',
  'footer.legal': 'Legal',
  'footer.terms': 'Terms of Service',
  'footer.privacy': 'Privacy Policy',
  'footer.security': 'Security',
  'footer.compliance': 'Compliance',
  'footer.cookies': 'Cookies Policy',
  'footer.help': 'Help & Support',
  'footer.faq': 'FAQ',
  'footer.contact': 'Contact Us',
  'footer.support': 'Support Center',
  'footer.countries': 'Countries',
  'footer.follow': 'Follow Us',
  'footer.copyright': '© 2024 Yumvi-Pay. All rights reserved.',
  'footer.app.download': 'Download Our App',
  'footer.newsletter': 'Subscribe to our newsletter',
  'footer.newsletter.placeholder': 'Enter your email',
  'footer.newsletter.button': 'Subscribe',
  
  // Language
  'language.english': 'English',
  'language.french': 'Français',
  'language.changed': 'Language Changed',
  'language.change_failed': 'Language Change Failed',
  'language.try_again': 'Please try again later',
  
  // Error messages
  'error.invalid_number': 'Invalid phone number',
  'error.invalid_account': 'Invalid account number',
  'error.network': 'Network error',
  'error.unexpected': 'An unexpected error occurred',
  'common.offline': 'You are currently offline',
  'common.offline.description': 'Please check your connection and try again',
  'common.retry': 'Retry',
  
  // Settings
  'settings.language': 'Language',
  'settings.notifications': 'Notifications',
  'settings.theme': 'Theme',
  'settings.currency': 'Currency',
  'settings.security': 'Security',
  
  // Common actions
  'actions.save': 'Save',
  'actions.cancel': 'Cancel',
  'actions.confirm': 'Confirm',
  'actions.delete': 'Delete',
  'actions.edit': 'Edit',
  'actions.view': 'View',
  'actions.continue': 'Continue',
  'actions.back': 'Back',
  'actions.send': 'Send',
  'actions.receive': 'Receive',
  'actions.share': 'Share',
  'actions.download': 'Download',
  
  // App download section
  'app.download.title': 'Download Our Mobile App',
  'app.download.description': 'Get the best experience with our mobile app. Send money on the go, track transactions, and receive notifications.',
  'app.download.users': '10,000+ active users',
  'app.download.ios.comingSoon': 'iOS app coming soon!',
  'app.download.android.comingSoon': 'Android app coming soon!',
};

export { enTranslations };
export default enTranslations;
