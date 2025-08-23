// components/Hero.tsx
'use client'
import React from 'react';
import { ViewType } from '../types';

interface HeroProps {
  handleNavigation: (view: ViewType) => void;
}

const Hero: React.FC<HeroProps> = ({ handleNavigation }) => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
          Chairs, Tables & Bounce Houses
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          Industrial quality Duramax products. Chairs, tables, bounce houses and accessories 
          to make your events unforgettable moments. 2-year warranty on bounce house seams!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleNavigation('sales')}
            className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            View Products for Sale
          </button>
          <button
            onClick={() => handleNavigation('rentals')}
            className="bg-yellow-500 text-white px-6 sm:px-8 py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-yellow-600 transition-colors shadow-lg"
          >
            View Products for Rent
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;