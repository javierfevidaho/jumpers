// components/CategoryFilter.tsx
'use client'
import React from 'react';
import { CategoryType, Product } from '../types';

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  products: Product[];
  businessType: 'sale' | 'rent';
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  products,
  businessType
}) => {
  const buttonColor = businessType === 'sale' ? 'green' : 'yellow';
  const activeClass = businessType === 'sale' 
    ? 'bg-green-600 text-white' 
    : 'bg-yellow-600 text-white';

  const getProductCount = (category: CategoryType): number => {
    if (category === 'all') return products.length;
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
      <button
        onClick={() => setSelectedCategory('all')}
        className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
          selectedCategory === 'all' 
            ? activeClass
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        All ({getProductCount('all')})
      </button>
      <button
        onClick={() => setSelectedCategory('jumpers')}
        className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
          selectedCategory === 'jumpers' 
            ? activeClass
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        Bounce Houses ({getProductCount('jumpers')})
      </button>
      <button
        onClick={() => setSelectedCategory('mesas')}
        className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
          selectedCategory === 'mesas' 
            ? activeClass
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        Tables ({getProductCount('mesas')})
      </button>
      <button
        onClick={() => setSelectedCategory('sillas')}
        className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
          selectedCategory === 'sillas' 
            ? activeClass
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        Chairs ({getProductCount('sillas')})
      </button>
      <button
        onClick={() => setSelectedCategory('accesorios')}
        className={`px-3 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
          selectedCategory === 'accesorios' 
            ? activeClass
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        Accessories ({getProductCount('accesorios')})
      </button>
    </div>
  );
};

export default CategoryFilter;