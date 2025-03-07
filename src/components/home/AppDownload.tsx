
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const AppDownload = () => {
  return (
    <motion.div 
      className="mt-20 flex flex-col md:flex-row items-center gap-8 bg-primary-50 rounded-3xl p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="bg-white p-4 rounded-xl">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <path d="M0,0 h30v30h-30z M10,10 h10v10h-10z" fill="black" />
          <path d="M40,0 h30v30h-30z M50,10 h10v10h-10z" fill="black" />
          <path d="M0,40 h30v30h-30z M10,50 h10v10h-10z" fill="black" />
          <path d="M40,40 h10v10h-10z" fill="black" />
          <path d="M60,40 h10v10h-10z" fill="black" />
          <path d="M80,40 h20v20h-20z M85,45 h10v10h-10z" fill="black" />
          <path d="M40,60 h10v10h-10z" fill="black" />
          <path d="M60,60 h10v10h-10z" fill="black" />
          <path d="M80,70 h10v10h-10z" fill="black" />
          <path d="M0,80 h30v20h-30z" fill="black" />
          <path d="M40,80 h10v20h-10z" fill="black" />
          <path d="M60,80 h10v20h-10z" fill="black" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-2">Scan this QR code with your phone</h3>
        <p className="text-gray-600 mb-4">Download our app to enjoy a better experience and exclusive features</p>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-primary-200 text-primary-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M16.09 6.62C14.92 7.38 13.43 7.23 12.38 6.31C11.42 5.47 11.13 4.06 11.72 2.95C12.96 2.69 14.47 3.38 15.32 4.26C16.08 5.03 16.35 6.05 16.09 6.62Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.85 10.56C20.06 13.13 18.01 15.37 15.58 15.37H14.49V17.34C14.49 19.63 12.64 21.48 10.35 21.48C8.06 21.48 6.21 19.63 6.21 17.34V15.37H5.12C2.7 15.37 0.65 13.14 0.85 10.56C1.01 8.47 2.77 6.76 4.84 6.55C5.68 6.47 6.52 6.61 7.28 6.93C7.15 6.47 7.07 5.98 7.07 5.47C7.07 3.26 8.78 1.39 10.97 1.19C13.54 0.95 15.7 2.89 15.7 5.41C15.7 5.94 15.62 6.46 15.48 6.94C16.26 6.61 17.11 6.46 17.97 6.55C20.04 6.75 21.8 8.47 21.95 10.56H19.85Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22.97 13.03V14.05C22.97 14.61 22.52 15.07 21.95 15.07H20.87V13.03H22.97Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.14 13.03V14.05C1.14 14.61 1.6 15.07 2.16 15.07H3.24V13.03H1.14Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            App Store
          </Button>
          <Button variant="outline" className="border-primary-200 text-primary-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M11.99 21.9999C14.43 21.9999 16.76 21.0999 18.52 19.4799C22.25 16.2199 22.25 10.9699 18.52 7.7199C16.76 6.0999 14.43 5.19995 11.99 5.19995C9.55 5.19995 7.22 6.0999 5.46 7.7199C1.73 10.9699 1.73 16.2199 5.46 19.4799C7.22 21.0999 9.54 21.9999 11.99 21.9999Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5.2V2" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 2H15" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Play Store
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AppDownload;
