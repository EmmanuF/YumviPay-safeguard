
import React from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

const AppDownload = () => {
  // URL to your app's download page or Play Store/App Store listing
  const appDownloadUrl = "https://yumvipay.com/download";

  return (
    <motion.div 
      className="mt-20 flex flex-col md:flex-row items-center gap-8 bg-primary-50 rounded-3xl p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8 w-full">
        {/* QR Code Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <QRCodeSVG
              value={appDownloadUrl}
              size={120}
              level="H" // High error correction
              includeMargin={true}
              imageSettings={{
                src: '/logo-sm.png',
                excavate: true,
                height: 24,
                width: 24,
              }}
            />
          </div>
          <p className="text-sm text-gray-600 max-w-[180px] text-center">Scan to download our mobile app</p>
        </div>
        
        {/* Description and Buttons */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-bold mb-2">Get Yumvi Pay on your device</h3>
          <p className="text-gray-600 mb-4 text-center md:text-left">Download our app to enjoy a better experience and exclusive features</p>
          <div className="flex space-x-3">
            {/* App Store button with animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button variant="outline" className="border-primary-200 text-primary-700 btn-store-badge">
                <motion.svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mr-2 animate-pulse-subtle"
                >
                  <path d="M16.09 6.62C14.92 7.38 13.43 7.23 12.38 6.31C11.42 5.47 11.13 4.06 11.72 2.95C12.96 2.69 14.47 3.38 15.32 4.26C16.08 5.03 16.35 6.05 16.09 6.62Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.85 10.56C20.06 13.13 18.01 15.37 15.58 15.37H14.49V17.34C14.49 19.63 12.64 21.48 10.35 21.48C8.06 21.48 6.21 19.63 6.21 17.34V15.37H5.12C2.7 15.37 0.65 13.14 0.85 10.56C1.01 8.47 2.77 6.76 4.84 6.55C5.68 6.47 6.52 6.61 7.28 6.93C7.15 6.47 7.07 5.98 7.07 5.47C7.07 3.26 8.78 1.39 10.97 1.19C13.54 0.95 15.7 2.89 15.7 5.41C15.7 5.94 15.62 6.46 15.48 6.94C16.26 6.61 17.11 6.46 17.97 6.55C20.04 6.75 21.8 8.47 21.95 10.56H19.85Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22.97 13.03V14.05C22.97 14.61 22.52 15.07 21.95 15.07H20.87V13.03H22.97Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.14 13.03V14.05C1.14 14.61 1.6 15.07 2.16 15.07H3.24V13.03H1.14Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
                App Store
              </Button>
            </motion.div>
            
            {/* Play Store button with animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button variant="outline" className="border-primary-200 text-primary-700 btn-store-badge">
                <motion.svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mr-2 animate-pulse-subtle"
                >
                  <path d="M11.99 21.9999C14.43 21.9999 16.76 21.0999 18.52 19.4799C22.25 16.2199 22.25 10.9699 18.52 7.7199C16.76 6.0999 14.43 5.19995 11.99 5.19995C9.55 5.19995 7.22 6.0999 5.46 7.7199C1.73 10.9699 1.73 16.2199 5.46 19.4799C7.22 21.0999 9.54 21.9999 11.99 21.9999Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5.2V2" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 2H15" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
                Play Store
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Phone Mockup */}
        <div className="hidden md:block ml-auto">
          <div className="relative">
            {/* Phone frame */}
            <motion.div 
              className="w-[220px] h-[440px] bg-gray-900 rounded-[36px] border-4 border-gray-800 shadow-xl relative overflow-hidden"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 2.5,
                ease: "easeInOut"
              }}
            >
              {/* Status bar */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10 flex justify-between items-center px-6">
                <div className="w-16 h-1.5 bg-gray-700 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
              </div>
              
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
              
              {/* Screen content - App UI mockup */}
              <div className="w-full h-full pt-8 pb-4 bg-gradient-to-b from-primary-600 to-primary-400 flex flex-col">
                {/* App header */}
                <div className="px-4 py-2 flex justify-between items-center">
                  <div className="text-white text-xs font-bold">Yumvi Pay</div>
                  <Smartphone size={14} className="text-white" />
                </div>
                
                {/* Transaction card */}
                <div className="mx-4 mt-4 p-3 bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] font-bold">Send Money</div>
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.18 10.16 8.49 10.96 8.49H12.84C13.76 8.49 14.51 9.27 14.51 10.24" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 7.5V16.5" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">Amount</div>
                  <div className="text-base font-bold">$100.00</div>
                </div>
                
                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-2 px-4 mt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-2 bg-white/20 rounded-lg flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-white/30 mb-1"></div>
                      <div className="w-10 h-1.5 bg-white/30 rounded-full"></div>
                    </div>
                  ))}
                </div>
                
                {/* Recent transactions */}
                <div className="flex-1 mt-4 mx-4 p-3 bg-white/90 rounded-t-xl">
                  <div className="text-[10px] font-medium mb-2">Recent Transactions</div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-gray-200 mr-1.5"></div>
                        <div className="text-[8px]">Transaction {i}</div>
                      </div>
                      <div className="text-[8px] font-medium">$25.00</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Home indicator */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white rounded-full"></div>
            </motion.div>
            
            {/* Reflection effect */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-white/10 to-transparent rounded-[36px] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppDownload;
