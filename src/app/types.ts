// src/app/types.ts - Interfaces y Tipos
export interface Product {
  id: number;
  name: string;
  price: number;
  rent_price?: number;
  description: string;
  images: string[];
  category: 'jumpers' | 'mesas' | 'sillas' | 'accesorios';
  in_stock: number;
  business_type: 'sale' | 'rent' | 'both';
}

export interface CartItem extends Product {
  quantity: number;
  type: 'sale' | 'rent';
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  rentDate: string;
  eventType: 'sale' | 'rent';
}

export interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export type ViewType = 'home' | 'sales' | 'rentals' | 'about';
export type CategoryType = 'all' | 'jumpers' | 'mesas' | 'sillas' | 'accesorios';