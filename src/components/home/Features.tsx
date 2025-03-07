
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const Features = () => {
  return (
    <motion.div 
      id="features"
      className="mt-20 grid md:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="glass-effect rounded-2xl p-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <TrendingUp className="h-6 w-6 text-primary-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Best Exchange Rates</h3>
        <p className="text-gray-600">We offer competitive exchange rates that ensure your money goes further.</p>
      </div>
      
      <div className="glass-effect rounded-2xl p-6">
        <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16.01V15.99" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12.01V7.99" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Simple & Transparent</h3>
        <p className="text-gray-600">Know exactly how much your recipient will get before you send.</p>
      </div>
      
      <div className="glass-effect rounded-2xl p-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0001 14.8799C13.5501 14.8799 14.8301 13.6199 14.8301 12.0499C14.8301 10.4799 13.5601 9.21997 12.0001 9.21997C10.4401 9.21997 9.17017 10.4799 9.17017 12.0499C9.17017 13.6199 10.4501 14.8799 12.0001 14.8799Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.2802 14.8799C18.1402 15.4599 18.2702 16.0999 18.6602 16.5899L18.7402 16.6799C19.0602 16.9999 19.2402 17.4499 19.2402 17.9199C19.2402 18.3899 19.0602 18.8399 18.7402 19.1599C18.1102 19.7899 17.1202 19.7899 16.4902 19.1599L16.4102 19.0799C16.0302 18.6999 15.3902 18.5599 14.8002 18.6999C14.2302 18.8299 13.7802 19.2999 13.6602 19.8799V20.0199C13.6602 21.0299 12.8402 21.8499 11.8302 21.8499C10.8202 21.8499 9.99021 21.0299 9.99021 20.0199V19.9099C9.87021 19.3099 9.42021 18.8299 8.84021 18.6999C8.26021 18.5599 7.62021 18.6999 7.24021 19.0799L7.16021 19.1599C6.87021 19.4499 6.49021 19.5999 6.08021 19.5999C5.67021 19.5999 5.29021 19.4499 5.00021 19.1599C4.68021 18.8399 4.50021 18.3899 4.50021 17.9199C4.50021 17.4499 4.68021 16.9999 5.00021 16.6799L5.08021 16.5999C5.47021 16.2099 5.59021 15.5699 5.47021 14.9999C5.34021 14.4299 4.87021 13.9799 4.29021 13.8599H4.15021C3.14021 13.8599 2.32021 13.0399 2.32021 12.0299C2.32021 11.0199 3.14021 10.1999 4.15021 10.1999H4.26021C4.86021 10.0699 5.34021 9.61995 5.47021 9.03995C5.59021 8.45995 5.47021 7.81995 5.08021 7.43995L5.00021 7.35995C4.68021 7.03995 4.50021 6.58995 4.50021 6.11995C4.50021 5.64995 4.68021 5.19995 5.00021 4.87995C5.63021 4.24995 6.62021 4.24995 7.25021 4.87995L7.33021 4.95995C7.71021 5.34995 8.35021 5.46995 8.94021 5.34995H9.00021C9.57021 5.21995 10.0202 4.74995 10.1402 4.16995V4.02995C10.1402 3.01995 10.9602 2.19995 11.9702 2.19995C12.9802 2.19995 13.8002 3.01995 13.8002 4.02995V4.13995C13.9202 4.71995 14.3702 5.18995 14.9602 5.30995C15.5502 5.42995 16.1802 5.30995 16.5602 4.91995L16.6402 4.83995C16.9302 4.54995 17.3102 4.39995 17.7202 4.39995C18.1302 4.39995 18.5102 4.54995 18.8002 4.83995C19.1202 5.15995 19.3002 5.60995 19.3002 6.07995C19.3002 6.54995 19.1202 6.99995 18.8002 7.31995L18.7202 7.39995C18.3302 7.78995 18.2102 8.42995 18.3302 9.00995C18.4502 9.57995 18.9202 10.0299 19.5002 10.1499H19.6402C20.6502 10.1499 21.4702 10.9699 21.4702 11.9799C21.4702 12.9899 20.6502 13.8099 19.6402 13.8099H19.5302C18.9602 13.9499 18.4802 14.3999 18.2802 14.8799Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Secure & Fast KYC</h3>
        <p className="text-gray-600">Our integrated verification ensures safe and quick transactions.</p>
      </div>
    </motion.div>
  );
};

export default Features;
