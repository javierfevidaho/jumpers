// components/Footer.tsx
'use client'
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FooterProps {
  makePhoneCall: (phoneNumber: string) => void;
  openGoogleMaps: () => void;
}

const Footer: React.FC<FooterProps> = ({ makePhoneCall, openGoogleMaps }) => {
  return (
    <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex flex-col">
            <h3 className="text-xl sm:text-2xl font-bold">HERNANDEZ JUMPERS</h3>
            <p className="text-gray-300 text-sm sm:text-base -mt-1">Sales & Rentals - Fun for the whole family</p>
          </div>
        </div>
        
        {/* Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Fidel Hernandez</h4>
            <button 
              onClick={() => makePhoneCall('4804381258')}
              className="block text-blue-300 hover:text-blue-200 transition-colors mb-1"
            >
              📞 (480) 438-1258
            </button>
            <p>🗣️ English & Spanish</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Yesii Molina</h4>
            <button 
              onClick={() => makePhoneCall('6234180360')}
              className="block text-blue-300 hover:text-blue-200 transition-colors mb-1"
            >
              📞 (623) 418-0360
            </button>
            <p>🗣️ Spanish</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 text-sm">
          <button 
            onClick={openGoogleMaps}
            className="flex items-center justify-center text-blue-300 hover:text-blue-200 transition-colors"
          >
            📍 330 N 21st Ave, Phoenix, AZ 85009
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>
          <span>📧 hernandezjumpers@gmail.com</span>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2024 Hernandez Jumpers Sales & Rentals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;