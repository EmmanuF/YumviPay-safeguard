
import React from 'react';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCountries } from '@/hooks/useCountries';
import { PaymentMethod } from '@/types/country';
import { getIconComponent } from '@/components/send-money/PaymentProviderData';
import { ArrowRight } from 'lucide-react';

interface CountryPageLayoutProps {
  countryCode: string;
  children?: React.ReactNode;
}

const CountryPageLayout: React.FC<CountryPageLayoutProps> = ({ 
  countryCode,
  children 
}) => {
  const { getCountryByCode } = useCountries();
  const country = getCountryByCode(countryCode);

  if (!country) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">Country Not Found</h1>
          <p className="mb-6">Sorry, information about this country is not available at the moment.</p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center">
          <img 
            src={country.flagUrl} 
            alt={`${country.name} flag`} 
            className="w-12 h-8 object-cover rounded mr-3"
          />
          <h1 className="text-3xl font-bold">Send Money to {country.name}</h1>
        </div>
        
        {children}
        
        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6">Available Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {country.paymentMethods.map((method: PaymentMethod) => (
              <div key={method.id} className="border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  {getIconComponent(method.icon)}
                  <h3 className="text-xl font-medium ml-2">{method.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Fees: {method.fees}</span>
                  <span>Processing: {method.processingTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <div className="my-12 bg-primary-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Send Money to {country.name}?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Fast, secure, and affordable money transfers to {country.name}. Get started with Yumvi-Pay today.
          </p>
          <Link to="/send">
            <Button size="lg" className="flex items-center">
              Start Sending Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CountryPageLayout;
