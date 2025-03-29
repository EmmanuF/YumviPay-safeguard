import React from 'react';
import { Helmet } from 'react-helmet-async';
const Cookies = () => {
  return <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Cookie Policy | Yumvi-Pay</title>
        <meta name="description" content="Learn about how Yumvi-Pay uses cookies and similar technologies." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Cookie Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          This Cookie Policy explains how Yumvi-Pay uses cookies and similar technologies to recognize you 
          when you visit our mobile application and website. It explains what these technologies are and why 
          we use them, as well as your rights to control our use of them.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">What Are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your device when you visit a website or use a mobile app. 
            Cookies are widely used by website and app owners to make their platforms work, or to work more efficiently, 
            as well as to provide reporting information.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Types of Cookies We Use</h2>
          <p className="mb-4">We use the following types of cookies:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Essential cookies:</strong> These cookies are necessary for the app to function and cannot 
              be switched off. They are usually only set in response to actions made by you which amount to a request 
              for services, such as setting your privacy preferences, logging in, or filling in forms.
            </li>
            <li>
              <strong>Performance cookies:</strong> These cookies allow us to count visits and traffic sources so we 
              can measure and improve the performance of our app. They help us know which pages are the most and least 
              popular and see how visitors move around the app.
            </li>
            <li>
              <strong>Functionality cookies:</strong> These cookies enable the app to provide enhanced functionality 
              and personalization. They may be set by us or by third-party providers whose services we have added to 
              our app.
            </li>
            <li>
              <strong>Targeting cookies:</strong> These cookies may be set through our app by our advertising partners. 
              They may be used by those companies to build a profile of your interests and show you relevant advertisements 
              on other sites.
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">How We Use Cookies</h2>
          <p className="mb-4">We use cookies for various purposes, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To authenticate users and prevent fraudulent use of user accounts</li>
            <li>To remember your preferences and settings</li>
            <li>To analyze how our app is used so we can improve it</li>
            <li>To personalize your experience</li>
            <li>To help us provide relevant marketing content</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Your Cookie Choices</h2>
          <p>
            Most browsers and mobile devices allow you to control cookies through their settings preferences. 
            However, if you limit the ability of websites and applications to set cookies, you may impact your 
            overall user experience. Some features of our app may not function properly if you disable cookies.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please contact us at{' '}
            <a href="mailto:privacy@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">support@yumvipay.com</a>
          </p>
        </div>
      </div>
    </div>;
};
export default Cookies;