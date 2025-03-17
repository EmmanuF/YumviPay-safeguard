
import React from 'react';
import CountryPageLayout from '@/components/country/CountryPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Ghana = () => {
  return (
    <CountryPageLayout countryCode="GH">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Sending Money to Ghana</h2>
        <p className="text-lg text-gray-700 mb-6">
          Transfer money to Ghana easily and affordably with Yumvi-Pay. Our service supports all major Ghanaian banks and mobile money providers, allowing your recipients to receive funds how they prefer.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Currency</h3>
              <p className="text-gray-600">Ghanaian Cedi (GHS)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Transfer Speed</h3>
              <p className="text-gray-600">Instant to 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Best Options</h3>
              <p className="text-gray-600">MTN Mobile Money, Vodafone Cash</p>
            </CardContent>
          </Card>
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Destinations in Ghana</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast", "Tema"].map((city) => (
            <div key={city} className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">{city}</span>
            </div>
          ))}
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Why Send Money to Ghana with Yumvi-Pay?</h2>
        <div className="space-y-4">
          {[
            "Support for all major mobile money providers (MTN, Vodafone, AirtelTigo)",
            "Direct bank deposits to any Ghanaian bank account",
            "Competitive GHS exchange rates updated in real-time",
            "Low transfer fees starting from just 1%",
            "Most mobile money transfers completed instantly",
            "Easy online tracking of your transfers"
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

export default Ghana;
