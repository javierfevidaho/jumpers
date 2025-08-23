// src/app/page.tsx - Página Principal Simplificada
'use client'
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, User, Phone, MapPin, X, Menu, Settings } from 'lucide-react';

// Import types
import { Product, CartItem, CustomerData } from './types';

// Import hooks
import { useProducts } from './hooks/useAdmin';

export default function Home() {
  // State
  const [currentView, setCurrentView] = useState<'home' | 'sales' | 'rentals' | 'about'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Customer data
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
    rentDate: '',
    eventType: 'sale'
  });

  // Products hook
  const { products, loading, error } = useProducts();

  // Separate products by type
  const saleProducts = products.filter(p => 
    p.business_type === 'sale' || p.business_type === 'both'
  );
  const rentProducts = products.filter(p => 
    p.business_type === 'rent' || p.business_type === 'both'
  );

  // Cart functions
  const addToCart = (product: Product, type: 'sale' | 'rent') => {
    const existingItem = cart.find(item => item.id === product.id && item.type === type);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id && item.type === type
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        type, 
        quantity: 1,
        price: type === 'rent' ? (product.rent_price || 0) : product.price
      }]);
    }
  };

  const removeFromCart = (productId: number, type: 'sale' | 'rent') => {
    setCart(cart.filter(item => !(item.id === productId && item.type === type)));
  };

  const updateQuantity = (productId: number, type: 'sale' | 'rent', newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId, type);
    } else {
      setCart(cart.map(item => 
        item.id === productId && item.type === type
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // WhatsApp function
  const sendToWhatsApp = () => {
    if (!customerData.name || !customerData.phone || !customerData.address) {
      alert('Please complete all required fields');
      return;
    }

    const total = getTotalPrice();
    let message = `🎉 NEW ORDER - HERNANDEZ JUMPERS\n\n`;
    message += `👤 Customer: ${customerData.name}\n`;
    message += `📱 Phone: ${customerData.phone}\n`;
    message += `📍 Address: ${customerData.address}\n`;
    if (customerData.eventType === 'rent') {
      message += `📅 Event Date: ${customerData.rentDate}\n`;
    }
    message += `🎯 Type: ${customerData.eventType === 'rent' ? 'RENTAL' : 'SALE'}\n\n`;
    
    message += `📋 PRODUCTS:\n`;
    cart.forEach(item => {
      message += `• ${item.name}\n`;
      message += `  Quantity: ${item.quantity}\n`;
      message += `  Price: $${item.price} ${item.type === 'rent' ? 'per day' : 'each'}\n`;
      message += `  Subtotal: $${item.price * item.quantity}\n\n`;
    });
    
    message += `💰 TOTAL: $${total}\n\n`;
    message += `📞 Contact to confirm details and coordinate delivery.`;

    const whatsappNumber = '9862269662';
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
    
    // Reset
    setCart([]);
    setCustomerData({ name: '', phone: '', address: '', rentDate: '', eventType: 'sale' });
    setShowCart(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HERNANDEZ JUMPERS
              </h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => setCurrentView('home')}
                className={`font-medium transition-colors ${currentView === 'home' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('sales')}
                className={`font-medium transition-colors ${currentView === 'sales' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Sales
              </button>
              <button 
                onClick={() => setCurrentView('rentals')}
                className={`font-medium transition-colors ${currentView === 'rentals' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Rentals
              </button>
              <button 
                onClick={() => setCurrentView('about')}
                className={`font-medium transition-colors ${currentView === 'about' ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                About Us
              </button>
            </nav>
            
            {/* Cart Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
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
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Home View */}
        {currentView === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Chairs, Tables & Bounce Houses
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Industrial quality Duramax products. Chairs, tables, bounce houses and accessories 
                to make your events unforgettable moments. 2-year warranty on bounce house seams!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setCurrentView('sales')}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  View Products for Sale
                </button>
                <button
                  onClick={() => setCurrentView('rentals')}
                  className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                >
                  View Products for Rent
                </button>
              </div>
            </section>

            {/* Featured Products */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Featured Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.slice(0, 4).map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h4>
                      <p className="text-gray-600 mb-4 text-sm">{product.description.substring(0, 100)}...</p>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          {product.business_type === 'sale' || product.business_type === 'both' ? (
                            <p className="text-lg font-bold text-green-600">Sale: ${product.price}</p>
                          ) : null}
                          {product.business_type === 'rent' || product.business_type === 'both' ? (
                            <p className="text-lg font-bold text-yellow-600">Rent: ${product.rent_price}/day</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(product.business_type === 'sale' || product.business_type === 'both') && (
                          <button
                            onClick={() => addToCart(product, 'sale')}
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                          >
                            Buy
                          </button>
                        )}
                        {(product.business_type === 'rent' || product.business_type === 'both') && (
                          <button
                            onClick={() => addToCart(product, 'rent')}
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
            </section>
          </div>
        )}

        {/* Sales View */}
        {currentView === 'sales' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🛒 Products for Sale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      SALE
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h4>
                    <p className="text-gray-600 mb-4 text-sm">{product.description.substring(0, 100)}...</p>
                    <p className="text-xl font-bold text-green-600 mb-4">Price: ${product.price}</p>
                    <button
                      onClick={() => addToCart(product, 'sale')}
                      className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Add to Cart - Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rentals View */}
        {currentView === 'rentals' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🎪 Products for Rent</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rentProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      RENTAL
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h4>
                    <p className="text-gray-600 mb-4 text-sm">{product.description.substring(0, 100)}...</p>
                    <p className="text-xl font-bold text-yellow-600 mb-4">Rent: ${product.rent_price}/day</p>
                    <button
                      onClick={() => addToCart(product, 'rent')}
                      className="w-full bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                    >
                      Add to Cart - Rent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About View */}
        {currentView === 'about' && (
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">About Hernandez Jumpers</h2>
            <p className="text-lg text-gray-600 mb-6">
              We are a family business located in Phoenix, Arizona, dedicated to making your celebrations unforgettable moments. 
              We specialize in sales and rental of industrial quality Duramax products: tables, chairs, bounce houses and accessories.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              We offer a 2-year warranty on bounce house seams and have bilingual staff for better service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-blue-600 mb-3">Duramax Quality</h3>
                <p className="text-gray-600">Industrial quality products that guarantee durability and safety.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-blue-600 mb-3">2-Year Warranty</h3>
                <p className="text-gray-600">2-year warranty on bounce house seams.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-blue-600 mb-3">Bilingual Service</h3>
                <p className="text-gray-600">Service in English and Spanish for better communication.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Shopping Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.type}`} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                            <img 
                              src={item.images[0]} 
                              alt={item.name} 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.type === 'rent' ? 'Rental' : 'Sale'} - ${item.price} {item.type === 'rent' ? 'per day' : 'each'}
                            </p>
                            <p className="text-sm font-semibold text-blue-600">
                              Subtotal: ${item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                            className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                            className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-2 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Customer Form */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={customerData.name}
                          onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={customerData.phone}
                          onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Address *
                      </label>
                      <input
                        type="text"
                        value={customerData.address}
                        onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your complete address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order Type
                        </label>
                        <select
                          value={customerData.eventType}
                          onChange={(e) => setCustomerData({...customerData, eventType: e.target.value as 'sale' | 'rent'})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="sale">Sale</option>
                          <option value="rent">Rental</option>
                        </select>
                      </div>
                      {customerData.eventType === 'rent' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Date *
                          </label>
                          <input
                            type="date"
                            value={customerData.rentDate}
                            onChange={(e) => setCustomerData({...customerData, rentDate: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Total and Checkout */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-gray-800">Total: ${getTotalPrice()}</span>
                    </div>
                    
                    <button
                      onClick={sendToWhatsApp}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Send Order via WhatsApp
                    </button>
                    
                    <div className="mt-3 text-center text-xs text-gray-500">
                      📞 Fidel: (480) 438-1258 | Yesii: (623) 418-0360
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">HERNANDEZ JUMPERS</h3>
          <p className="text-gray-300 mb-6">Sales & Rentals - Fun for the whole family</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Fidel Hernandez</h4>
              <p className="text-blue-300">📞 (480) 438-1258</p>
              <p className="text-sm">🗣️ English & Spanish</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Yesii Molina</h4>
              <p className="text-blue-300">📞 (623) 418-0360</p>
              <p className="text-sm">🗣️ Spanish</p>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="mb-2">📍 330 N 21st Ave, Phoenix, AZ 85009</p>
            <p className="mb-4">📧 hernandezjumpers@gmail.com</p>
            <p className="text-gray-400">© 2024 Hernandez Jumpers Sales & Rentals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
