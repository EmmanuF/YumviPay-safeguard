
import React from 'react';
import CountryPageLayout from '@/components/country/CountryPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Star } from 'lucide-react';

const Cameroon = () => {
  return (
    <CountryPageLayout countryCode="CM">
      <div className="mb-6 inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
        <Star className="h-4 w-4 mr-1 fill-primary-500 text-primary-500" />
        <span className="text-sm font-medium">Featured Destination</span>
      </div>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Sending Money to Cameroon</h2>
        <p className="text-lg text-gray-700 mb-6">
          Cameroon is our primary destination for money transfers as part of our initial MVP. We offer comprehensive coverage across Cameroon with multiple payment options and some of the best rates available.
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
              <p className="text-gray-600">As fast as minutes</p>
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
          {["Yaoundé", "Douala", "Bamenda", "Garoua", "Maroua", "Bafoussam", "Ngaoundéré", "Bertoua", "Buea"].map((city) => (
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
            "Full integration with MTN Mobile Money and Orange Money",
            "Bank transfers to all major Cameroonian banks",
            "Cash pickup options at Express Union and EMI Money locations",
            "Competitive XAF exchange rates with no hidden markups",
            "Bilingual support in both English and French",
            "Instant notifications to recipients when money is sent",
            "Most transfers completed within minutes"
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
