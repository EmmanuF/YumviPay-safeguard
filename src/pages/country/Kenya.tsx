
import React from 'react';
import CountryPageLayout from '@/components/country/CountryPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Kenya = () => {
  return (
    <CountryPageLayout countryCode="KE">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Sending Money to Kenya</h2>
        <p className="text-lg text-gray-700 mb-6">
          Kenya is one of the most dynamic economies in East Africa, and Yumvi-Pay makes it simple to send money there. Whether you're transferring to M-Pesa or a bank account, we offer fast and secure options.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Currency</h3>
              <p className="text-gray-600">Kenyan Shilling (KES)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Transfer Speed</h3>
              <p className="text-gray-600">Instant (M-Pesa) to 48 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Best Options</h3>
              <p className="text-gray-600">M-Pesa, Bank Transfer</p>
            </CardContent>
          </Card>
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Destinations in Kenya</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Nyeri", "Machakos"].map((city) => (
            <div key={city} className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">{city}</span>
            </div>
          ))}
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Why Send Money to Kenya with Yumvi-Pay?</h2>
        <div className="space-y-4">
          {[
            "Direct integration with M-Pesa for instant mobile transfers",
            "Support for all major Kenyan banks",
            "Competitive exchange rates with real-time updates",
            "Low, transparent fees with no hidden charges",
            "Dedicated customer support in English and Swahili",
            "Trusted by thousands of Kenyans in the diaspora"
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

export default Kenya;
