
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Compliance = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Compliance | Yumvi-Pay</title>
        <meta name="description" content="Yumvi-Pay's compliance with international regulations and standards for money transfers." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Compliance</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Yumvi-Pay is committed to compliance with all applicable laws and regulations governing money transfers 
          and financial services. We maintain strict policies and procedures to ensure regulatory compliance in all 
          jurisdictions where we operate.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Know Your Customer (KYC)</h2>
          <p>
            We implement robust KYC procedures to verify the identity of our users. This includes collecting and verifying 
            identification documents and personal information as required by regulations. Our KYC process is designed to be 
            both thorough and user-friendly, leveraging technology to streamline the verification process while meeting 
            regulatory requirements.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Anti-Money Laundering (AML)</h2>
          <p>
            Yumvi-Pay has implemented comprehensive AML policies and procedures to prevent money laundering and terrorist 
            financing. We continuously monitor transactions for suspicious activities and report as required by law. Our 
            systems are designed to detect and flag unusual transaction patterns that may indicate money laundering or other 
            financial crimes.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Data Protection & Privacy</h2>
          <p>
            We comply with data protection regulations, including GDPR where applicable, to ensure the privacy and 
            security of our users' personal information. Our data protection policies govern how we collect, use, store, 
            and share information, with a focus on transparency and user control over personal data.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Licensing & Registration</h2>
          <p>
            Yumvi-Pay maintains all necessary licenses and registrations required to operate as a money transfer service. 
            We work closely with regulatory bodies in each country where we operate to ensure full compliance with local 
            requirements and to stay informed about regulatory changes.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Regulatory Inquiries</h2>
          <p>
            For any regulatory or compliance inquiries, please contact our Compliance department at{' '}
            <a href="mailto:compliance@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">
              compliance@yumvi-pay.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
