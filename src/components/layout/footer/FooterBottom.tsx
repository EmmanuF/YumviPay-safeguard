
import React from 'react';

const FooterBottom: React.FC = () => {
  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Yumvi-Pay. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
