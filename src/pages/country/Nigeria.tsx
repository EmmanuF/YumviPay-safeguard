
import React from 'react';
import CountryPageLayout from '@/components/country/CountryPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Nigeria = () => {
  return (
    <CountryPageLayout countryCode="NG">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Sending Money to Nigeria</h2>
        <p className="text-lg text-gray-700 mb-6">
          Nigeria is one of our most popular destinations for money transfers. With Yumvi-Pay, you can send money directly to Nigerian bank accounts or mobile wallets quickly and securely, with some of the best exchange rates available.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Currency</h3>
              <p className="text-gray-600">Nigerian Naira (NGN)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Transfer Speed</h3>
              <p className="text-gray-600">1-2 business days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Best Options</h3>
              <p className="text-gray-600">Bank transfers, MTN MoMo</p>
            </CardContent>
          </Card>
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Destinations in Nigeria</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Enugu", "Kaduna"].map((city) => (
            <div key={city} className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">{city}</span>
            </div>
          ))}
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Why Send Money to Nigeria with Yumvi-Pay?</h2>
        <div className="space-y-4">
          {[
            "Direct transfers to all major Nigerian banks",
            "Some of the best NGN exchange rates in the market",
            "Fast processing with most transfers completed within 24 hours",
            "Support for mobile money wallets like MTN MoMo",
            "Easy tracking of your transfers from start to finish",
            "Dedicated support team for Nigerian transfers"
          ].map((point, idx) => (
            <div key={idx} className="flex items-start">
              <CheckCircle2 className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <p>{point}</p>
            </div>
          ))}
        </div>
      </section>
    </CountryPageLayout>
  );
};

export default Nigeria;
