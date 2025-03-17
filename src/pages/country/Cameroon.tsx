
import React from 'react';
import CountryPageLayout from '@/components/country/CountryPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Cameroon = () => {
  return (
    <CountryPageLayout countryCode="CM">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Sending Money to Cameroon</h2>
        <p className="text-lg text-gray-700 mb-6">
          Send money to Cameroon quickly and securely with Yumvi-Pay. We offer competitive exchange rates and multiple payment options for transfers to Cameroon, whether you're supporting family or doing business.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Currency</h3>
              <p className="text-gray-600">Central African CFA Franc (XAF)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Transfer Speed</h3>
              <p className="text-gray-600">Same day to 48 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Best Options</h3>
              <p className="text-gray-600">MTN Mobile Money, Orange Money</p>
            </CardContent>
          </Card>
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Destinations in Cameroon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Douala", "Yaoundé", "Bamenda", "Bafoussam", "Garoua", "Maroua", "Buea", "Limbe"].map((city) => (
            <div key={city} className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">{city}</span>
            </div>
          ))}
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Why Send Money to Cameroon with Yumvi-Pay?</h2>
        <div className="space-y-4">
          {[
            "Fast transfers to MTN Mobile Money and Orange Money",
            "Competitive exchange rates with transparent fees",
            "Easy bank transfers to all major Cameroonian banks",
            "Dedicated local support in English and French",
            "Secure transactions with real-time tracking",
            "Lower fees compared to traditional money transfer operators"
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

export default Cameroon;
