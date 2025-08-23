// utils.ts
import { CartItem, CustomerData } from './types';

// Detect if user is on mobile
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Google Maps integration
export const openGoogleMaps = (): void => {
  const address = "330 N 21st Ave, Phoenix, AZ 85009";
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  window.open(googleMapsUrl, '_blank');
};

// Phone call integration
export const makePhoneCall = (phoneNumber: string): void => {
  window.location.href = `tel:${phoneNumber}`;
};

// WhatsApp message generation
export const generateWhatsAppMessage = (cart: CartItem[], customerData: CustomerData, total: number): string => {
  let message = `🎉 *NEW ORDER - HERNANDEZ JUMPERS*\n\n`;
  message += `👤 *Customer:* ${customerData.name}\n`;
  message += `📱 *Phone:* ${customerData.phone}\n`;
  message += `📍 *Address:* ${customerData.address}\n`;
  if (customerData.eventType === 'rent') {
    message += `📅 *Event Date:* ${customerData.rentDate}\n`;
  }
  message += `🎯 *Type:* ${customerData.eventType === 'rent' ? 'RENTAL' : 'SALE'}\n\n`;
  
  message += `📋 *PRODUCTS:*\n`;
  cart.forEach(item => {
    message += `• ${item.name}\n`;
    message += `  Quantity: ${item.quantity}\n`;
    message += `  Price: $${item.price} ${item.type === 'rent' ? 'per day' : 'each'}\n`;
    message += `  Subtotal: $${item.price * item.quantity}\n\n`;
  });
  
  message += `💰 *TOTAL: $${total}*\n\n`;
  message += `📞 Contact to confirm details and coordinate delivery.`;
  
  return message;
};

export const getRawMessage = (cart: CartItem[], customerData: CustomerData, total: number): string => {
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
  
  return message;
};

// Copy message to clipboard
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    alert('✅ Message copied to clipboard! Now you can paste it in WhatsApp');
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert('✅ Message copied to clipboard! Now you can paste it in WhatsApp');
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      alert('⚠️ Could not copy automatically. Please copy the message manually.');
    }
    document.body.removeChild(textArea);
  }
};

// WhatsApp integration
export const sendToWhatsApp = (
  cart: CartItem[], 
  customerData: CustomerData, 
  total: number, 
  onSuccess: () => void
): void => {
  if (!customerData.name || !customerData.phone || !customerData.address) {
    alert('Please complete all required fields');
    return;
  }
  
  if (customerData.eventType === 'rent' && !customerData.rentDate) {
    alert('Please select the event date');
    return;
  }

  const whatsappNumber = '9862269662';
  const encodedMessage = encodeURIComponent(generateWhatsAppMessage(cart, customerData, total));
  
  if (isMobile()) {
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  } else {
    const rawMessage = getRawMessage(cart, customerData, total);
    copyToClipboard(rawMessage);
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }
  
  onSuccess();
};

export const sendDirectMessage = (
  cart: CartItem[], 
  customerData: CustomerData, 
  total: number, 
  onSuccess: () => void
): void => {
  if (!customerData.name || !customerData.phone || !customerData.address) {
    alert('Please complete all required fields');
    return;
  }
  
  if (customerData.eventType === 'rent' && !customerData.rentDate) {
    alert('Please select the event date');
    return;
  }

  const rawMessage = getRawMessage(cart, customerData, total);
  copyToClipboard(rawMessage);
  onSuccess();
};