
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Smartphone, AppleIcon, PlayIcon, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isPlatform } from '@/utils/platformUtils';

const AppDownload = () => {
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const { toast } = useToast();
  
  // URL to your app's download page or Play Store/App Store listing
  const appDownloadUrl = "https://yumvipay.com/download";

  const handleQRClick = () => {
    setIsQRExpanded(!isQRExpanded);
  };
  
  const handleAppStoreTap = () => {
    window.open('https://apps.apple.com', '_blank');
    toast({
      title: "Opening App Store",
      description: "Redirecting to download Yumvi Pay from the App Store",
    });
  };
  
  const handlePlayStoreTap = () => {
    window.open('https://play.google.com', '_blank');
    toast({
      title: "Opening Google Play",
      description: "Redirecting to download Yumvi Pay from Google Play",
    });
  };

  return (
    <div className="mt-20 relative overflow-hidden">
      {/* Premium background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-indigo-50 rounded-3xl"></div>
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-3xl"></div>
      
      <motion.div 
        className="relative flex flex-col md:flex-row items-center gap-8 rounded-3xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 w-full">
          {/* QR Code Section with interactive elements */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              className={`bg-white p-4 rounded-xl shadow-lg transition-all duration-300 ${isQRExpanded ? 'scale-125' : ''}`}
              whileHover={{ scale: 1.05 }}
              onClick={handleQRClick}
            >
              <QRCodeSVG
                value={appDownloadUrl}
                size={isQRExpanded ? 160 : 120}
                level="H" // High error correction
                includeMargin={true}
                imageSettings={{
                  src: '/logo-sm.png',
                  excavate: true,
                  height: isQRExpanded ? 32 : 24,
                  width: isQRExpanded ? 32 : 24,
                }}
              />
              
              <motion.div 
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary-500 text-white rounded-full p-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Scan size={16} />
              </motion.div>
            </motion.div>
            
            <p className="text-sm text-gray-600 max-w-[180px] text-center font-medium">
              Scan to download our mobile app
            </p>
          </div>
          
          {/* Description and Buttons */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-bold mb-2 text-primary-700 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">Get Yumvi Pay on your device</h3>
            <p className="text-gray-700 mb-6 text-center md:text-left">Download our app to enjoy a better experience and exclusive features</p>
            
            <div className="flex space-x-4">
              {/* App Store button with premium styling and animation */}
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button 
                  variant="outline" 
                  className="border-2 border-primary-200 text-primary-700 font-medium shadow-sm hover:shadow-md transition-all duration-300 px-5 py-6"
                  onClick={handleAppStoreTap}
                >
                  <AppleIcon className="mr-2 h-5 w-5 text-primary-600" />
                  App Store
                </Button>
              </motion.div>
              
              {/* Play Store button with premium styling and animation */}
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button 
                  variant="outline" 
                  className="border-2 border-primary-200 text-primary-700 font-medium shadow-sm hover:shadow-md transition-all duration-300 px-5 py-6"
                  onClick={handlePlayStoreTap}
                >
                  <PlayIcon className="mr-2 h-5 w-5 text-primary-600" />
                  Play Store
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Enhanced Phone Mockup */}
          <div className="hidden md:block ml-auto">
            <div className="relative">
              {/* Phone frame with premium styling */}
              <motion.div 
                className="w-[260px] h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-[40px] border-[8px] border-gray-800 shadow-2xl relative overflow-hidden"
                initial={{ y: 10, rotate: 2 }}
                animate={{ y: [0, -8, 0], rotate: [2, 0, 2] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 6,
                  ease: "easeInOut"
                }}
              >
                {/* Reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30 z-10"></div>
                
                {/* Status bar */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-primary-600 z-10 flex justify-between items-center px-6">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div className="text-white text-xs">4:20 PM</div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-white/80 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/80 rounded-full"></div>
                  </div>
                </div>
                
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-black rounded-b-2xl z-20"></div>
                
                {/* Screen content - App UI mockup */}
                <div className="w-full h-full pt-10 pb-4 bg-gradient-to-b from-primary-600 via-primary-500 to-primary-400 flex flex-col">
                  {/* App header */}
                  <div className="px-5 py-3 flex justify-between items-center">
                    <div className="text-white text-base font-bold">Yumvi Pay</div>
                    <Smartphone size={18} className="text-white" />
                  </div>
                  
                  {/* Transaction card */}
                  <motion.div 
                    className="mx-5 mt-4 p-4 bg-white rounded-2xl shadow-xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-bold">Send Money</div>
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.18 10.16 8.49 10.96 8.49H12.84C13.76 8.49 14.51 9.27 14.51 10.24" stroke="#008000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 7.5V16.5" stroke="#008000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Amount</div>
                    <div className="text-xl font-bold">$100.00</div>
                    
                    {/* Add premium button */}
                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      Confirm Payment
                    </Button>
                  </motion.div>
                  
                  {/* Quick actions with improved styling */}
                  <div className="grid grid-cols-3 gap-2 px-5 mt-6">
                    {[1, 2, 3].map(i => (
                      <motion.div 
                        key={i} 
                        className="p-3 bg-white/20 rounded-2xl flex flex-col items-center shadow-lg backdrop-blur-sm"
                        whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.3)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/40 mb-1 flex items-center justify-center">
                          {i === 1 && <div className="w-4 h-4 rounded-sm bg-white/70"></div>}
                          {i === 2 && <div className="w-4 h-1 rounded-full bg-white/70"></div>}
                          {i === 3 && <div className="w-2 h-4 rounded-sm bg-white/70"></div>}
                        </div>
                        <div className="w-12 h-1.5 bg-white/40 rounded-full"></div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Recent transactions with improved styling */}
                  <motion.div 
                    className="flex-1 mt-6 mx-4 p-4 bg-white/95 rounded-t-2xl shadow-lg"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                  >
                    <div className="text-sm font-medium mb-3">Recent Transactions</div>
                    {[1, 2, 3].map(i => (
                      <motion.div 
                        key={i} 
                        className="flex items-center justify-between py-3 border-b border-gray-100"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 + (i * 0.2) }}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <div className="w-3 h-3 rounded-sm bg-primary-500"></div>
                          </div>
                          <div>
                            <div className="text-xs font-medium">Transaction {i}</div>
                            <div className="text-[10px] text-gray-400">Today, 14:3{i}</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold">$25.00</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
              </motion.div>
              
              {/* Enhanced shimmer effect */}
              <div className="absolute top-0 left-0 right-0 h-full w-full overflow-hidden rounded-[40px] pointer-events-none">
                <div className="absolute top-0 -left-[100%] h-full w-50 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[shimmer_2.5s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AppDownload;
