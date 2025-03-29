
import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Terms of Service | Yumvi-Pay</title>
        <meta name="description" content="Read Yumvi-Pay's terms of service and user agreement." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          These Terms of Service ("Terms") govern your use of Yumvi-Pay's mobile application and services. 
          Please read these Terms carefully before using our services.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Acceptance of Terms</h2>
          <p>
            By accessing or using Yumvi-Pay's services, you agree to be bound by these Terms, our Privacy Policy, 
            and any additional terms referenced herein. If you do not agree to these Terms, you may not use our services.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Service Description</h2>
          <p className="mb-4">
            Yumvi-Pay provides a mobile platform for sending money to recipients in select African countries. 
            Our services include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Facilitating cross-border money transfers</li>
            <li>Currency exchange services</li>
            <li>Transaction tracking and notifications</li>
            <li>Recipient management</li>
            <li>Customer support</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">User Responsibilities</h2>
          <p className="mb-4">When using our services, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Not use our services for illegal or unauthorized purposes</li>
            <li>Not attempt to bypass or manipulate our security measures</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Fees and Charges</h2>
          <p>
            Yumvi-Pay charges fees for its services, which may include transaction fees, currency exchange fees, 
            and any applicable taxes. All fees will be clearly disclosed before you confirm a transaction. 
            We reserve the right to change our fee structure with notice to users.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Intellectual Property</h2>
          <p>
            All content, features, and functionality of the Yumvi-Pay app, including but not limited to text, 
            graphics, logos, icons, images, and software, are the exclusive property of Yumvi-Pay and are protected 
            by intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our 
            services without our explicit permission.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">
              legal@yumvi-pay.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
