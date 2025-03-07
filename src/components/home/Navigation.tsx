
import React from 'react';

const Navigation = () => {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.3 7.91998V13.07C19.3 16.15 17.54 17.47 14.9 17.47H6.10999C5.48999 17.47 4.91999 17.4 4.41999 17.27C4.15999 17.21 3.90999 17.12 3.67999 17.02C2.28999 16.4 1.59998 15.03 1.59998 13.07V7.91998C1.59998 4.83998 3.35999 3.52002 5.99999 3.52002H14.9C17.54 3.52002 19.3 4.83998 19.3 7.91998Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22.3011 10.9001V16.0601C22.3011 19.1401 20.5411 20.4601 17.9011 20.4601H9.11108C8.37108 20.4601 7.70108 20.3501 7.12108 20.1301C5.89108 19.6601 5.08108 18.6101 4.91108 17.0601C5.41108 17.1901 5.98108 17.2601 6.60108 17.2601H15.3911C17.9511 17.2601 19.7911 15.9401 19.7911 12.8601V7.70006C19.7911 6.00006 19.1711 4.81006 18.1611 4.25006C20.4411 4.37006 22.3011 5.70006 22.3011 10.9001Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Yumvi-Pay</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
          <a href="#rates" className="text-gray-600 hover:text-primary-600 transition-colors">Exchange Rates</a>
          <a href="#countries" className="text-gray-600 hover:text-primary-600 transition-colors">Countries</a>
          <a href="#help" className="text-gray-600 hover:text-primary-600 transition-colors">Help</a>
        </nav>
        
        <button className="hidden md:block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full font-medium transition-colors">
          Download App
        </button>
      </div>
    </header>
  );
};

export default Navigation;
