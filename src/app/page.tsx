'use client';
import { useState, useEffect } from 'react';
import { Product, CartItem, CustomerData, Order, Customer } from './types';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import ProductGrid from './components/ProductGrid';
import AboutUs from './components/AboutUs';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import CartModal from './components/CartModal';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

// Hooks
import { useAdmin } from './hooks/useAdmin';

export default function Home() {
  // ============================
  // STATE - GENERAL
  // ============================
  const [currentView, setCurrentView] = useState<'home' | 'sales' | 'rentals' | 'about'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);

  // ============================
  // STATE - CUSTOMER
  // ============================
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
    rentDate: '',
    eventType: 'sale'
  });

  // ============================
  // STATE - DATA
  // ============================
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // ============================
  // ADMIN HOOK
  // ============================
  const {
    isAdmin,
    showAdminLogin,
    setShowAdminLogin,
    handleAdminLogin,
    handleAdminLogout,
    adminCredentials,
    setAdminCredentials,
    showPasswordField,
    setShowPasswordField
  } = useAdmin();

  // ============================
  // LOAD DATA FROM DB.JSON
  // ============================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load from localStorage first (for persistence)
        const savedProducts = localStorage.getItem('hernandez_products');
        const savedOrders = localStorage.getItem('hernandez_orders');
        const savedCustomers = localStorage.getItem('hernandez_customers');

        if (savedProducts && savedOrders && savedCustomers) {
          // Load from localStorage if available
          setProducts(JSON.parse(savedProducts));
          setOrders(JSON.parse(savedOrders));
          setCustomers(JSON.parse(savedCustomers));
        } else {
          // Load from db.json if no localStorage data
          const response = await fetch('/api/data');
          if (response.ok) {
            const data = await response.json();
            setProducts(data.products || []);
            setOrders(data.orders || []);
            setCustomers(data.customers || []);
            
            // Save to localStorage for persistence
            localStorage.setItem('hernandez_products', JSON.stringify(data.products || []));
            localStorage.setItem('hernandez_orders', JSON.stringify(data.orders || []));
            localStorage.setItem('hernandez_customers', JSON.stringify(data.customers || []));
          } else {
            // Fallback: Load db.json directly
            const dbResponse = await fetch('/data/db.json');
            const dbData = await dbResponse.json();
            setProducts(dbData.products || []);
            setOrders(dbData.orders || []);
            setCustomers(dbData.customers || []);
            
            localStorage.setItem('hernandez_products', JSON.stringify(dbData.products || []));
            localStorage.setItem('hernandez_orders', JSON.stringify(dbData.orders || []));
            localStorage.setItem('hernandez_customers', JSON.stringify(dbData.customers || []));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ============================
  // SAVE DATA WHEN CHANGES
  // ============================
  useEffect(() => {
    if (!loading && products.length > 0) {
      localStorage.setItem('hernandez_products', JSON.stringify(products));
    }
  }, [products, loading]);

  useEffect(() => {
    if (!loading && orders.length > 0) {
      localStorage.setItem('hernandez_orders', JSON.stringify(orders));
    }
  }, [orders, loading]);

  useEffect(() => {
    if (!loading && customers.length > 0) {
      localStorage.setItem('hernandez_customers', JSON.stringify(customers));
    }
  }, [customers, loading]);

  // ============================
  // CART FUNCTIONS
  // ============================
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

  // ============================
  // WHATSAPP ORDER FUNCTION
  // ============================
  const sendToWhatsApp = () => {
    if (!customerData.name || !customerData.phone || !customerData.address) {
      alert('Please complete all required fields');
      return;
    }

    const total = getTotalPrice();
    const orderId = `ORD${Date.now()}`;
    
    // Create new order
    const newOrder: Order = {
      id: orderId,
      customer: customerData,
      items: [...cart],
      total: total,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    setOrders([...orders, newOrder]);

    // Add or update customer
    const existingCustomer = customers.find(c => c.phone === customerData.phone);
    if (existingCustomer) {
      setCustomers(customers.map(c => 
        c.phone === customerData.phone 
          ? {
              ...c,
              name: customerData.name,
              address: customerData.address,
              orders_count: c.orders_count + 1,
              total_spent: c.total_spent + total,
              last_order: new Date().toISOString().split('T')[0]
            }
          : c
      ));
    } else {
      const newCustomer: Customer = {
        id: `CUST${Date.now()}`,
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        email: '',
        orders_count: 1,
        total_spent: total,
        last_order: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };
      setCustomers([...customers, newCustomer]);
    }
    
    // Create WhatsApp message
    let message = `🎉 NEW ORDER - HERNANDEZ JUMPERS\n\n`;
    message += `📋 Order ID: ${orderId}\n`;
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

  // ============================
  // FILTER FUNCTIONS
  // ============================
  const saleProducts = products.filter(p => 
    p.business_type === 'sale' || p.business_type === 'both'
  );
  const rentProducts = products.filter(p => 
    p.business_type === 'rent' || p.business_type === 'both'
  );

  // ============================
  // LOADING STATE
  // ============================
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

  // ============================
  // ERROR STATE
  // ============================
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

  // ============================
  // MAIN RENDER
  // ============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        cart={cart}
        setShowCart={setShowCart}
        isAdmin={isAdmin}
        setShowAdminLogin={setShowAdminLogin}
        handleAdminLogout={handleAdminLogout}
        orders={orders}
        customers={customers}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ADMIN PANEL */}
        {isAdmin && (
          <AdminPanel 
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            customers={customers}
            setCustomers={setCustomers}
          />
        )}

        {/* PUBLIC VIEWS */}
        {!isAdmin && currentView === 'home' && (
          <>
            <Hero setCurrentView={setCurrentView} />
            <FeaturedProducts 
              products={products.slice(0, 4)} 
              addToCart={addToCart}
              currentView={currentView}
            />
          </>
        )}

        {!isAdmin && currentView === 'sales' && (
          <ProductGrid 
            title="🛒 Products for Sale"
            products={saleProducts}
            addToCart={addToCart}
            currentView={currentView}
          />
        )}

        {!isAdmin && currentView === 'rentals' && (
          <ProductGrid 
            title="🎪 Products for Rent"
            products={rentProducts}
            addToCart={addToCart}
            currentView={currentView}
          />
        )}

        {!isAdmin && currentView === 'about' && (
          <AboutUs />
        )}
      </main>

      {/* MODALS */}
      <AdminLogin 
        showAdminLogin={showAdminLogin}
        setShowAdminLogin={setShowAdminLogin}
        handleAdminLogin={handleAdminLogin}
        adminCredentials={adminCredentials}
        setAdminCredentials={setAdminCredentials}
        showPasswordField={showPasswordField}
        setShowPasswordField={setShowPasswordField}
      />

      <CartModal 
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        customerData={customerData}
        setCustomerData={setCustomerData}
        getTotalPrice={getTotalPrice}
        sendToWhatsApp={sendToWhatsApp}
      />

      <Footer />
      <ChatWidget />
    </div>
  );
}