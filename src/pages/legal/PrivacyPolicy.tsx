
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MobileAppLayout from '@/components/MobileAppLayout';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/contexts/LocaleContext';

const PrivacyPolicy: React.FC = () => {
  const { t } = useLocale();
  const lastUpdated = "May 15, 2024";
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Privacy Policy | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-primary-800 mb-1">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-4">Last updated: {lastUpdated}</p>
          <Separator className="mb-6" />
          
          <div className="prose prose-sm max-w-none prose-h2:text-primary-700 prose-h2:text-lg prose-h2:font-semibold prose-h3:text-primary-600 prose-h3:text-base prose-h3:font-medium">
            <p>
              This Privacy Policy describes how Yumvi-Pay ("we", "our", or "us") collects, uses, and discloses information 
              about you when you use our mobile application, website, and services (collectively, the "Service").
            </p>
            
            <h2>1. Information We Collect</h2>
            
            <h3>1.1 Information You Provide</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Account Information: When you register for an account, we collect your name, email address, phone number, and password.</li>
              <li>Identity Verification Information: To comply with KYC (Know Your Customer) and AML (Anti-Money Laundering) regulations, we may collect government-issued identification, date of birth, and address.</li>
              <li>Transaction Information: When you use our Service to send money, we collect information about the transaction, including the recipient's information, the amount sent, and the payment method used.</li>
              <li>Communication Information: If you contact us, we may collect information about your communication and any information you provide.</li>
            </ul>
            
            <h3>1.2 Information We Collect Automatically</h3>
            <p>When you use our Service, we automatically collect certain information, including:</p>
            <ul>
              <li>Device Information: We collect information about the device you use to access our Service, including the hardware model, operating system and version, unique device identifiers, and mobile network information.</li>
              <li>Usage Information: We collect information about your use of our Service, such as the features you use, the time and duration of your use, and any errors that occur.</li>
              <li>Location Information: With your consent, we may collect information about your precise or approximate location.</li>
              <li>Log Information: We collect log information when you use our Service, including the type of browser you use, access times, pages viewed, your IP address, and the page you visited before navigating to our Service.</li>
            </ul>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information, including confirmations and receipts</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Communicate with you about products, services, offers, and events, and provide news and information we think will be of interest to you</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Comply with legal obligations and regulatory requirements</li>
              <li>Personalize and improve the Service and provide content or features that match your profile or interests</li>
            </ul>
            
            <h2>3. How We Share Your Information</h2>
            <p>We may share your information as follows:</p>
            <ul>
              <li>With third-party vendors, service providers, and partners who need access to your information to help us provide the Service (such as Kado for KYC verification and payment processing)</li>
              <li>With other users of the Service, to the extent necessary to complete transactions (for example, providing your name to recipients)</li>
              <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process</li>
              <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of Yumvi-Pay or others</li>
              <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2>4. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide the Service, comply with our legal obligations, 
              resolve disputes, and enforce our agreements. The retention period for specific data types varies based on the 
              nature of the data and applicable legal requirements.
            </p>
            
            <h2>5. Data Security</h2>
            <p>
              We take reasonable measures to help protect your information from loss, theft, misuse, unauthorized access, 
              disclosure, alteration, and destruction. However, no security measures are 100% secure, and we cannot guarantee 
              the security of your information.
            </p>
            
            <h2>6. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as the right to 
              access, correct, delete, or restrict the processing of your personal information. You can exercise these rights by 
              contacting us as described in the "Contact Us" section below.
            </p>
            
            <h2>7. International Data Transfers</h2>
            <p>
              We may transfer your information to countries other than the one in which you live, including to countries that 
              may not have the same data protection laws as your jurisdiction. By providing your information, you consent to 
              these transfers.
            </p>
            
            <h2>8. Children's Privacy</h2>
            <p>
              Our Service is not directed to children under the age of 18, and we do not knowingly collect personal information 
              from children under 18. If we learn that we have collected personal information from a child under 18, we will take 
              steps to delete that information as quickly as possible.
            </p>
            
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at 
              the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to 
              our website or sending you a notification).
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>Email: privacy@yumvi-pay.com</p>
            <p>Address: 123 Finance Street, Tech Valley, Yaoundé, Cameroon</p>
          </div>
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default PrivacyPolicy;
