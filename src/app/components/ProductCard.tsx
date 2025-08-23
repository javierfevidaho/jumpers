// components/ProductCard.tsx
'use client'
import React from 'react';
import { Product } from '../types';
import ImageGallery from './ImageGallery';

interface ProductCardProps {
  product: Product;
  businessType: 'sale' | 'rent';
  onAddToCart: (product: Product, type: 'sale' | 'rent') => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  businessType, 
  onAddToCart 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <ImageGallery images={product.images} productName={product.name} />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          Stock: {product.in_stock}
        </div>
        {businessType === 'sale' && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            SALE
          </div>
        )}
        {businessType === 'rent' && (
          <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            RENTAL
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
            {businessType === 'sale' ? (
              <p className="text-lg sm:text-xl font-bold text-green-600">
                Price: ${product.price}
              </p>
            ) : (
              <p className="text-lg sm:text-xl font-bold text-yellow-600">
                Rent: ${product.rent_price}/day
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {businessType === 'sale' ? (
            <button
              onClick={() => onAddToCart(product, 'sale')}
              className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
            >
              Add to Cart - Buy
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product, 'rent')}
              className="w-full bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm"
            >
              Add to Cart - Rent
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;