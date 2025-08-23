// components/FeaturedProducts.tsx
'use client'
import React from 'react';
import { Product, ViewType } from '../types';
import ImageGallery from './ImageGallery';

interface FeaturedProductsProps {
  saleProducts: Product[];
  rentProducts: Product[];
  handleNavigation: (view: ViewType) => void;
  onAddToCart: (product: Product, type: 'sale' | 'rent') => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  saleProducts,
  rentProducts,
  handleNavigation,
  onAddToCart
}) => {
  const featuredProducts = [...saleProducts.slice(0, 2), ...rentProducts.slice(0, 2)];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <ImageGallery images={product.images} productName={product.name} />
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Stock: {product.in_stock}
                </div>
                {saleProducts.find(p => p.id === product.id) && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    FOR SALE
                  </div>
                )}
                {rentProducts.find(p => p.id === product.id) && (
                  <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    FOR RENT
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {product.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                  <div>
                    {saleProducts.find(p => p.id === product.id) && (
                      <p className="text-base sm:text-lg font-bold text-green-600">
                        Sale: ${product.price}
                      </p>
                    )}
                    {rentProducts.find(p => p.id === product.id) && (
                      <p className="text-base sm:text-lg font-bold text-yellow-600">
                        Rent: ${product.rent_price}/day
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {saleProducts.find(p => p.id === product.id) && (
                    <button
                      onClick={() => onAddToCart(product, 'sale')}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                    >
                      Buy
                    </button>
                  )}
                  {rentProducts.find(p => p.id === product.id) && (
                    <button
                      onClick={() => onAddToCart(product, 'rent')}
                      className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm"
                    >
                      Rent
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNavigation('sales')}
              className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              View All for Sale
            </button>
            <button
              onClick={() => handleNavigation('rentals')}
              className="bg-yellow-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
            >
              View All for Rent
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;