// components/ProductGrid.tsx
'use client'
import React from 'react';
import { Product, CategoryType } from '../types';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

interface ProductGridProps {
  products: Product[];
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  businessType: 'sale' | 'rent';
  title: string;
  description: string;
  onAddToCart: (product: Product, type: 'sale' | 'rent') => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  businessType,
  title,
  description,
  onAddToCart
}) => {
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          products={products}
          businessType={businessType}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              businessType={businessType}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products in this category</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;