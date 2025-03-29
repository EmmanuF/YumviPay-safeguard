
import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>About Us | Yumvi-Pay</title>
        <meta name="description" content="Learn about Yumvi-Pay's mission, vision, and the team behind our money transfer service." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">About Us</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          At Yumvi-Pay, we're transforming how money moves across borders, making it easier, faster, 
          and more affordable to send money to Africa.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Our Mission</h2>
          <p>
            Our mission is to empower individuals and businesses by providing a reliable, secure, and 
            cost-effective platform for cross-border money transfers, focusing on connecting the African 
            diaspora with their loved ones and businesses back home.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Our Story</h2>
          <p>
            Founded in 2023, Yumvi-Pay was born from a simple observation: sending money to Africa 
            was often complicated, expensive, and slow. Our founders, who experienced these challenges 
            firsthand, set out to create a solution that leverages modern technology to overcome these 
            barriers.
          </p>
          <p className="mt-4">
            Starting with Cameroon as our first market, we've built a mobile-first platform that 
            integrates seamlessly with local payment systems and offers competitive exchange rates 
            with minimal fees.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Our Team</h2>
          <p>
            Yumvi-Pay brings together a diverse team of experts in fintech, mobile technology, 
            and African markets. United by our passion for financial inclusion and technological 
            innovation, we work tirelessly to build and improve our service.
          </p>
          <p className="mt-4">
            We're backed by investors who share our vision of making financial services more 
            accessible across Africa and are committed to supporting our growth journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
