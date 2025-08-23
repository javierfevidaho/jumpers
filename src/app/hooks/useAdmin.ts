// src/app/hooks/useAdmin.ts - Hook actualizado con integración API
'use client';
import { useState, useEffect } from 'react';
import { Product } from '../types';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  refreshProducts: () => void;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

// Hook para manejar productos con API
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.error || 'Failed to load products');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading products';
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => [...prev, data.product]);
        return data.product;
      } else {
        throw new Error(data.error || 'Failed to add product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>): Promise<void> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, ...data.product } : p
        ));
      } else {
        throw new Error(data.error || 'Failed to update product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        throw new Error(data.error || 'Failed to delete product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts
  };
};

// Hook para autenticación (versión simulada para desarrollo)
export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Credenciales de desarrollo (cambiar en producción)
      const validCredentials = [
        { email: 'admin@hernandezjumpers.com', password: 'admin123' },
        { email: 'fidel@hernandezjumpers.com', password: 'fidel2024' },
        { email: 'yesii@hernandezjumpers.com', password: 'yesii2024' }
      ];
      
      const isValid = validCredentials.some(cred => 
        cred.email === email && cred.password === password
      );
      
      if (isValid) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  return {
    isAuthenticated,
    loading,
    signIn,
    signOut
  };
};

// Hook para pedidos
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(orders.map((order: any) => 
          order.id === orderId ? { ...order, status } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(prev => [data.order, ...prev]);
        return data.order;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    loadOrders,
    updateOrderStatus,
    createOrder
  };
};

// Hook para clientes
export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.customers);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    loadCustomers
  };
};

export default useProducts;