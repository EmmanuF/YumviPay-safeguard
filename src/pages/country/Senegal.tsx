
import React from 'react';
import CountryPageLayout from '@/components/country/CountryPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Senegal = () => {
  return (
    <CountryPageLayout countryCode="SN">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Sending Money to Senegal</h2>
        <p className="text-lg text-gray-700 mb-6">
          Sending money to Senegal is easy and secure with Yumvi-Pay. Whether you're supporting family, paying for services, or investing in business, we offer multiple ways to transfer funds to Senegal with competitive exchange rates and low fees.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Currency</h3>
              <p className="text-gray-600">West African CFA Franc (XOF)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Transfer Speed</h3>
              <p className="text-gray-600">As fast as minutes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Best Options</h3>
              <p className="text-gray-600">Orange Money, Wave</p>
            </CardContent>
          </Card>
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Destinations in Senegal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Dakar", "Thiès", "Saint-Louis", "Touba", "Rufisque", "Kaolack"].map((city) => (
            <div key={city} className="p-4 border border-gray-200 rounded-lg">
              <span className="font-medium">{city}</span>
            </div>
          ))}
        </div>
      </section>
        
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Why Send Money to Senegal with Yumvi-Pay?</h2>
        <div className="space-y-4">
          {[
            "Direct integration with Orange Money and Wave mobile wallets",
            "Competitive exchange rates with transparent fee structure",
            "Send money to recipients without bank accounts",
            "Transactions typically arrive in minutes",
            "24/7 customer support in French and English"
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

export default Senegal;
