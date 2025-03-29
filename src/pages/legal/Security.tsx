import React from 'react';
import { Helmet } from 'react-helmet-async';
const Security = () => {
  return <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Security | Yumvi-Pay</title>
        <meta name="description" content="Learn about Yumvi-Pay's security measures and how we protect your data and transactions." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Security at Yumvi-Pay</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          At Yumvi-Pay, the security of your data and transactions is our top priority. We employ industry-leading security 
          measures to protect your information and ensure your peace of mind.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Data Encryption</h2>
          <p>
            All data transmitted between your device and our servers is protected with end-to-end encryption using TLS 1.3 
            protocol. Your sensitive information is never stored in plain text, and we employ strong encryption algorithms 
            to secure data at rest.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Biometric Authentication</h2>
          <p>
            Our mobile app supports biometric authentication methods including fingerprint and facial recognition, 
            providing a secure and convenient way to access your account. Additional security measures, such as two-factor 
            authentication, add an extra layer of protection.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Transaction Monitoring</h2>
          <p>
            We continuously monitor transactions for suspicious activity using advanced fraud detection systems. 
            Our automated systems can detect unusual patterns and flag potentially fraudulent transactions to protect 
            you from unauthorized use.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Compliance & Certification</h2>
          <p>
            Yumvi-Pay adheres to international security standards and best practices. We conduct regular security audits 
            and vulnerability assessments to ensure our systems remain secure. Our compliance with regulatory requirements 
            includes KYC (Know Your Customer) and AML (Anti-Money Laundering) procedures.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Reporting Security Concerns</h2>
          <p>
            If you notice any suspicious activity or have security concerns, please contact our security team immediately at{' '}
            <a href="mailto:security@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">support@yumvipay.com</a>
          </p>
        </div>
      </div>
    </div>;
};
export default Security;