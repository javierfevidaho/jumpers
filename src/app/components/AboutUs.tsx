// components/AboutUs.tsx
'use client'
import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          About Hernandez Jumpers
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
          We are a family business located in Phoenix, Arizona, dedicated to making your celebrations unforgettable moments. 
          We specialize in sales and rental of industrial quality Duramax products: tables, chairs, bounce houses and accessories.
        </p>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          We offer a 2-year warranty on bounce house seams and have bilingual staff for better service.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-3">Duramax Quality</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Industrial quality products that guarantee durability and safety.
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-3">2-Year Warranty</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              2-year warranty on bounce house seams.
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-3">Bilingual Service</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Service in English and Spanish for better communication.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;