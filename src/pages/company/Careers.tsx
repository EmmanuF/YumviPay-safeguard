import React from 'react';
import { Helmet } from 'react-helmet-async';
const Careers = () => {
  return <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Careers | Yumvi-Pay</title>
        <meta name="description" content="Join our team at Yumvi-Pay and be part of revolutionizing money transfers to Africa." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Careers at Yumvi-Pay</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Join our dynamic team and be part of making a difference in how people send money to Africa.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Our Mission</h2>
          <p>
            At Yumvi-Pay, we're on a mission to make cross-border money transfers to Africa seamless, 
            affordable, and accessible to everyone. We're building innovative mobile solutions that connect 
            people across continents and empower communities.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Why Work With Us</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Make a meaningful impact on people's lives</li>
            <li>Work with cutting-edge mobile technology</li>
            <li>Collaborative and inclusive work culture</li>
            <li>Competitive compensation and benefits</li>
            <li>Remote-friendly work environment</li>
            <li>Growth opportunities in a rapidly expanding market</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Open Positions</h2>
          <p className="mb-4">
            We're always looking for talented individuals to join our team. Check back soon for specific job openings.
          </p>
          <p>
            If you're passionate about fintech, mobile technology, and making a difference in Africa, 
            send your resume to <a href="mailto:careers@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">careers@yumvipay.com</a>.
          </p>
        </div>
      </div>
    </div>;
};
export default Careers;