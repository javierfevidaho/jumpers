// components/CartModal.tsx
'use client'
import React from 'react';
import { ShoppingCart, Plus, Minus, X, User, Phone, MapPin, Calendar } from 'lucide-react';
import { CartItem, CustomerData } from '../types';

interface CartModalProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  cart: CartItem[];
  customerData: CustomerData;
  setCustomerData: (data: CustomerData) => void;
  updateQuantity: (productId: number, type: 'sale' | 'rent', newQuantity: number) => void;
  removeFromCart: (productId: number, type: 'sale' | 'rent') => void;
  getTotalPrice: () => number;
  sendToWhatsApp: () => void;
  sendDirectMessage: () => void;
  makePhoneCall: (phoneNumber: string) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  showCart,
  setShowCart,
  cart,
  customerData,
  setCustomerData,
  updateQuantity,
  removeFromCart,
  getTotalPrice,
  sendToWhatsApp,
  sendDirectMessage,
  makePhoneCall
}) => {
  // Detect if user is on mobile
  const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2">
        <div className="p-4 sm:p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Shopping Cart</h3>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">Your cart is empty</p>
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
                  <div key={`${item.id}-${item.type}`} className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="max-w-full max-h-full object-contain"
                          style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {item.type === 'rent' ? 'Rental' : 'Sale'} - ${item.price} {item.type === 'rent' ? 'per day' : 'each'}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-blue-600">
                          Subtotal: ${item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                        className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <span className="font-semibold min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm sm:text-base">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                        className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id, item.type)}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-1 sm:ml-2 transition-colors"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Customer Form */}
              <div className="border-t pt-6">
                <h4 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerData({...customerData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerData({...customerData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerData({...customerData, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCustomerData({...customerData, eventType: e.target.value as 'sale' | 'rent'})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sale">Sale</option>
                      <option value="rent">Rental</option>
                    </select>
                  </div>
                  {customerData.eventType === 'rent' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Event Date *
                      </label>
                      <input
                        type="date"
                        value={customerData.rentDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerData({...customerData, rentDate: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Total and Checkout */}
              <div className="border-t pt-4 bg-gray-50 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">Total: ${getTotalPrice()}</span>
                </div>
                
                {/* Device-specific instructions */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    📱 {isMobile() ? 'Mobile detected' : 'PC/Desktop detected'}
                  </p>
                  <p className="text-xs text-blue-600">
                    {isMobile() 
                      ? 'On mobile, WhatsApp will open directly to send.' 
                      : 'On PC, the message will be automatically copied to clipboard and WhatsApp Web will open.'
                    }
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Primary WhatsApp button */}
                  <button
                    onClick={sendToWhatsApp}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-base sm:text-lg flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isMobile() ? 'Send via WhatsApp' : 'Open WhatsApp + Copy Message'}
                  </button>

                  {/* Alternative copy button for desktop */}
                  {!isMobile() && (
                    <button
                      onClick={sendDirectMessage}
                      className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center"
                    >
                      📋 Just Copy Message to Clipboard
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500 text-center">
                    {isMobile() 
                      ? 'Your order will be sent directly via WhatsApp to confirm details'
                      : 'The message will be copied automatically. Just paste it in WhatsApp Web/Desktop'
                    }
                  </p>
                  
                  {/* Contact options */}
                  <div className="flex justify-center space-x-4 text-xs">
                    <button 
                      onClick={() => makePhoneCall('4804381258')}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      📞 Fidel: (480) 438-1258
                    </button>
                    <button 
                      onClick={() => makePhoneCall('6234180360')}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      📞 Yesii: (623) 418-0360
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;