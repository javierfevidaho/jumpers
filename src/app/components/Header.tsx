// components/Header.tsx
'use client'
import React from 'react';
import { ShoppingCart, Settings, Menu, X } from 'lucide-react';
import { ViewType, CartItem } from '../types';

interface HeaderProps {
  currentView: ViewType;
  cart: CartItem[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setShowCart: (show: boolean) => void;
  setIsAdmin: (admin: boolean) => void;
  handleNavigation: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  cart,
  mobileMenuOpen,
  setMobileMenuOpen,
  setShowCart,
  setIsAdmin,
  handleNavigation
}) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('home')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  HERNANDEZ JUMPERS
                </span>
                <span className="text-xs sm:text-sm text-gray-600 leading-tight -mt-1">
                  Sales & Rents
                </span>
              </div>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <button 
              onClick={() => handleNavigation('home')}
              className={`font-medium transition-colors text-sm lg:text-base ${
                currentView === 'home' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('sales')}
              className={`font-medium transition-colors text-sm lg:text-base ${
                currentView === 'sales' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Sales
            </button>
            <button 
              onClick={() => handleNavigation('rentals')}
              className={`font-medium transition-colors text-sm lg:text-base ${
                currentView === 'rentals' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Rentals
            </button>
            <button 
              onClick={() => handleNavigation('about')}
              className={`font-medium transition-colors text-sm lg:text-base ${
                currentView === 'about' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About Us
            </button>
          </nav>
          
          {/* Icons and Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsAdmin(true)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Panel Admin"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavigation('home')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('sales')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium"
              >
                Sales
              </button>
              <button 
                onClick={() => handleNavigation('rentals')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium"
              >
                Rentals
              </button>
              <button 
                onClick={() => handleNavigation('about')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium"
              >
                About Us
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;