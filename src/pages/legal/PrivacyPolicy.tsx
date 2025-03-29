import React from 'react';
import { Helmet } from 'react-helmet-async';
const PrivacyPolicy = () => {
  return <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Privacy Policy | Yumvi-Pay</title>
        <meta name="description" content="Learn about how Yumvi-Pay collects, uses, and protects your personal information." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          At Yumvi-Pay, we are committed to protecting your privacy and safeguarding your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and protect your data when you use our 
          services.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Information We Collect</h2>
          <p className="mb-4">We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone number, mailing address, 
              date of birth, and government-issued identification documents.
            </li>
            <li>
              <strong>Financial Information:</strong> Bank account details, credit/debit card information, 
              mobile money account details, and transaction history.
            </li>
            <li>
              <strong>Technical Information:</strong> Device information, IP address, browser type, 
              operating system, mobile device identifiers, and app usage data.
            </li>
            <li>
              <strong>Location Information:</strong> With your permission, we may collect precise location 
              data from your mobile device.
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">How We Use Your Information</h2>
          <p className="mb-4">We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our services</li>
            <li>To process transactions and send notifications about your transactions</li>
            <li>To verify your identity and prevent fraud or other prohibited activities</li>
            <li>To comply with legal and regulatory requirements</li>
            <li>To communicate with you about our services, updates, and promotions</li>
            <li>To personalize your experience and provide customer support</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Data Sharing and Disclosure</h2>
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Service Providers:</strong> Third-party vendors who help us provide our services, 
              including payment processors, KYC verification providers, and cloud storage providers.
            </li>
            <li>
              <strong>Financial Partners:</strong> Banks, mobile money operators, and other financial 
              institutions that facilitate transactions.
            </li>
            <li>
              <strong>Regulatory Authorities:</strong> Government agencies or law enforcement when 
              required by law or to protect our rights.
            </li>
          </ul>
          <p className="mt-4">
            We do not sell your personal information to third parties for marketing purposes.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Your Rights and Choices</h2>
          <p className="mb-4">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, correct, or delete your personal information</li>
            <li>Object to or restrict certain processing of your data</li>
            <li>Data portability (receiving a copy of your data)</li>
            <li>Withdraw consent for processing based on consent</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Contact Us</h2>
          <p>
            If you have any questions or concerns about our Privacy Policy or data practices, please 
            contact our Privacy Team at{' '}
            <a href="mailto:privacy@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">support@yumvipay.com</a>
          </p>
        </div>
      </div>
    </div>;
};
export default PrivacyPolicy;