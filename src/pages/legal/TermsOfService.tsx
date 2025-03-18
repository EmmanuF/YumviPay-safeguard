import React from 'react';
import { Helmet } from 'react-helmet-async';
import MobileAppLayout from '@/components/MobileAppLayout';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/contexts/LocaleContext';

const TermsOfService: React.FC = () => {
  const { t } = useLocale();
  const lastUpdated = "May 15, 2024";
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Terms of Service | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-primary-800 mb-1">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-4">Last updated: {lastUpdated}</p>
          <Separator className="mb-6" />
          
          <div className="prose prose-sm max-w-none prose-h2:text-primary-700 prose-h2:text-lg prose-h2:font-semibold prose-h3:text-primary-600 prose-h3:text-base prose-h3:font-medium">
            <p>
              Welcome to Yumvi-Pay. These Terms of Service ("Terms") govern your use of the Yumvi-Pay mobile application, 
              website, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound 
              by these Terms. If you do not agree to these Terms, please do not use the Service.
            </p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By using our Service, you agree to these Terms, our Privacy Policy, and any other guidelines, rules, or 
              licenses posted on the Service. These Terms constitute a legally binding agreement between you and Yumvi-Pay.
            </p>
            
            <h2>2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that 
              you are at least 18 years old and have the legal capacity to enter into these Terms.
            </p>
            
            <h2>3. Account Registration</h2>
            <p>
              To use certain features of the Service, you must register for an account. You agree to provide accurate, current, 
              and complete information during the registration process and to update such information to keep it accurate, 
              current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your account credentials and for all activities that occur under your account. 
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
            
            <h2>4. Service Description</h2>
            <p>
              Yumvi-Pay is a money transfer service that allows users to send money to recipients in Africa. The Service includes:
            </p>
            <ul>
              <li>User registration and authentication</li>
              <li>Integration with Kado for KYC verification and payment processing</li>
              <li>Transaction monitoring and reporting</li>
              <li>Recipient notifications</li>
              <li>Mobile app features like biometric authentication and push notifications</li>
            </ul>
            
            <h2>5. Fees and Payments</h2>
            <p>
              Yumvi-Pay charges fees for its money transfer services. All fees will be clearly displayed before you complete a 
              transaction. By proceeding with a transaction, you agree to pay all applicable fees.
            </p>
            <p>
              Payment for transactions is processed by Kado, a third-party payment processor. Your use of Kado's services is 
              subject to Kado's terms and conditions.
            </p>
            
            <h2>6. Transaction Limits</h2>
            <p>
              Yumvi-Pay may impose limits on the amount of money you can send or receive through the Service. These limits 
              may be based on factors such as your transaction history, verification status, and applicable regulations.
            </p>
            
            <h2>7. Prohibited Activities</h2>
            <p>
              You agree not to use the Service for any illegal or unauthorized purpose, including but not limited to:
            </p>
            <ul>
              <li>Money laundering or financing terrorism</li>
              <li>Fraudulent activities</li>
              <li>Violating any laws or regulations</li>
              <li>Providing false or misleading information</li>
              <li>Attempting to gain unauthorized access to the Service or other users' accounts</li>
            </ul>
            
            <h2>8. Intellectual Property</h2>
            <p>
              All content and materials available on the Service, including but not limited to text, graphics, logos, icons, 
              images, audio clips, and software, are the property of Yumvi-Pay or its licensors and are protected by copyright, 
              trademark, and other intellectual property laws.
            </p>
            
            <h2>9. Privacy</h2>
            <p>
              Your privacy is important to us. Our Privacy Policy describes how we collect, use, and disclose information 
              about you. By using the Service, you consent to the collection, use, and disclosure of your information as 
              described in our Privacy Policy.
            </p>
            
            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service at any time, without prior notice or liability, 
              for any reason, including if you breach these Terms.
            </p>
            
            <h2>11. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
              INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
              NON-INFRINGEMENT.
            </p>
            
            <h2>12. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL YUMVI-PAY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
              INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM 
              YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
            </p>
            
            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to 
              its conflict of law provisions.
            </p>
            
            <h2>14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by posting 
              the updated Terms on the Service and updating the "Last updated" date. Your continued use of the Service after 
              any changes indicates your acceptance of the modified Terms.
            </p>
            
            <h2>15. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>Email: legal@yumvi-pay.com</p>
            <p>Address: 2470 S DAIRY ASHFORD RD, HOUSTON TX 77077</p>
          </div>
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default TermsOfService;
