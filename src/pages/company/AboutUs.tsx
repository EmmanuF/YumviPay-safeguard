
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Briefcase, Globe, Users } from 'lucide-react';
import '@/styles/card-styles.css';

const AboutUs = () => {
  // Create animation refs for different sections
  const missionRef = useScrollAnimation({
    threshold: 0.1
  });
  const storyRef = useScrollAnimation({
    threshold: 0.1
  });
  const teamRef = useScrollAnimation({
    threshold: 0.1
  });
  const valuesRef = useScrollAnimation();
  
  return <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>About Us | Yumvi-Pay</title>
        <meta name="description" content="Learn about Yumvi-Pay's mission, vision, and the team behind our money transfer service." />
      </Helmet>
      
      {/* Header Section with improved styling */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary-700">About Us</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-6">
            At Yumvi-Pay, we're transforming how money moves across borders, making it easier, faster, 
            and more affordable to send money to Africa.
          </p>
        </div>
      </div>
      
      {/* Mission Section with Icon */}
      <div ref={missionRef} className={`mb-16 opacity-0 fade-in-section`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-primary-50 p-4 rounded-full">
                <Award className="h-12 w-12 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary-600">Our Mission</h2>
                <p className="text-gray-700">
                  Our mission is to empower individuals and businesses by providing a reliable, secure, and 
                  cost-effective platform for cross-border money transfers, focusing on connecting the African 
                  diaspora with their loved ones and businesses back home.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Our Story Section with Icon */}
      <div ref={storyRef} className={`mb-16 opacity-0 fade-in-section`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-primary-50 p-4 rounded-full">
                <Globe className="h-12 w-12 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary-600">Our Story</h2>
                <p className="text-gray-700">Founded in 2021, Yumvi-Pay was born from a simple observation: sending money to Africa was often complicated, expensive, and slow. Our founders, who experienced these challenges firsthand, set out to create a solution that leverages modern technology to overcome these barriers.</p>
                <p className="mt-4 text-gray-700">
                  Starting with Cameroon as our first market, we've built a mobile-first platform that 
                  integrates seamlessly with local payment systems and offers competitive exchange rates 
                  with minimal fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Our Team Section with Icon */}
      <div ref={teamRef} className={`mb-16 opacity-0 fade-in-section`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-primary-50 p-4 rounded-full">
                <Users className="h-12 w-12 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary-600">Our Team</h2>
                <p className="text-gray-700">
                  Yumvi-Pay brings together a diverse team of experts in fintech, mobile technology, 
                  and African markets. United by our passion for financial inclusion and technological 
                  innovation, we work tirelessly to build and improve our service.
                </p>
                <p className="mt-4 text-gray-700">
                  We're backed by investors who share our vision of making financial services more 
                  accessible across Africa and are committed to supporting our growth journey.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Our Values Section */}
      <div ref={valuesRef} className={`mb-8 opacity-0 fade-in-section`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-primary-50 p-4 rounded-full">
                <Briefcase className="h-12 w-12 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary-600">Our Values</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-lg mb-2 text-primary-600">Transparency</h3>
                    <p className="text-gray-700">We believe in being transparent about our fees, exchange rates, and processes, ensuring our customers always know what to expect.</p>
                  </div>
                  
                  <div className="border border-gray-100 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-lg mb-2 text-primary-600">Accessibility</h3>
                    <p className="text-gray-700">We're dedicated to making financial services accessible to everyone, regardless of their location or background.</p>
                  </div>
                  
                  <div className="border border-gray-100 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-lg mb-2 text-primary-600">Security</h3>
                    <p className="text-gray-700">We prioritize the security of our customers' data and funds, implementing robust measures to protect against fraud and unauthorized access.</p>
                  </div>
                  
                  <div className="border border-gray-100 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-lg mb-2 text-primary-600">Innovation</h3>
                    <p className="text-gray-700">We continuously seek new ways to improve our service, embracing technology to make money transfers faster, cheaper, and more convenient.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add CSS for the scroll animation effect */}
      <style>
        {`
          .fade-in-section.visible {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          
          .fade-in-section {
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
        `}
      </style>
    </div>;
};

export default AboutUs;
