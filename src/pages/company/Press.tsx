
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Press = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Press & Media | Yumvi-Pay</title>
        <meta name="description" content="Yumvi-Pay press releases, media kit, and company news." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Press & Media</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary-600">About Yumvi-Pay</h2>
          <p className="text-gray-700 mb-4">
            Yumvi-Pay is a mobile-first platform that enables fast, secure, and affordable money transfers to Africa.
            Our mission is to connect people across continents and provide reliable financial services to underserved communities.
          </p>
          <p className="text-gray-700">
            Founded in 2023, Yumvi-Pay is transforming how remittances are sent to Africa through innovative technology,
            strategic partnerships, and customer-centered design.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-6 border border-primary-100">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Media Kit</h2>
          <p className="text-gray-700 mb-4">
            Download our media kit for company logos, product screenshots, founder photos, and brand guidelines.
          </p>
          <Button className="gap-2">
            <Download size={16} />
            Download Media Kit
          </Button>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 text-primary-700">Press Releases</h2>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Yumvi-Pay Launches Mobile Remittance Service for Cameroon</CardTitle>
            <CardDescription>May 15, 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Yumvi-Pay announces the official launch of its mobile money transfer service to Cameroon,
              enabling fast and secure transactions with competitive exchange rates and low fees.
            </p>
            <Button variant="link" className="px-0">Read full press release →</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Yumvi-Pay Secures Seed Funding to Expand African Operations</CardTitle>
            <CardDescription>August 3, 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Yumvi-Pay has secured $2.5 million in seed funding to expand its operations across multiple African countries,
              with plans to launch in Senegal, Nigeria, and Ghana by Q4 2023.
            </p>
            <Button variant="link" className="px-0">Read full press release →</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary-600">Media Inquiries</h2>
        <p className="text-gray-700 mb-2">
          For press inquiries and interview requests, please contact:
        </p>
        <p className="font-medium">
          <a href="mailto:press@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">press@yumvi-pay.com</a>
        </p>
      </div>
    </div>
  );
};

export default Press;
