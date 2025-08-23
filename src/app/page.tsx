// ============================
  // PERSISTENCE FUNCTIONS
  // ============================
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to storage:', error);
      }
    }
  };

  const loadFromStorage = (key: string, defaultValue: any) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch (error) {
        console.error('Error loading from storage:', error);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // ============================
  // LOAD DATA ON COMPONENT MOUNT
  // ============================
  useEffect(() => {
    setProducts(loadFromStorage('hernandez_products', initialProducts));
    setOrders(loadFromStorage('hernandez_orders', initialOrders));
    setCustomers(loadFromStorage('hernandez_customers', initialCustomers));
  }, []);

  // ============================
  // SAVE DATA WHEN CHANGES
  // ============================
  useEffect(() => {
    saveToStorage('hernandez_products', products);
  }, [products]);

  useEffect(() => {
    saveToStorage('hernandez_orders', orders);
  }, [orders]);

  useEffect(() => {
    saveToStorage('hernandez_customers', customers);
  }, [customers]);
  const addImageToProduct = () => {
    if (editingProduct && newImageUrl.trim()) {
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const removeImageFromProduct = (index: number) => {
    if (editingProduct) {
      const newImages = editingProduct.images.filter((_, i) => i !== index);
      setEditingProduct({
        ...editingProduct,
        images: newImages.length > 0 ? newImages : ['/images/sales/banners-frozen-cars.jpg']
      });
    }
  };'use client'
'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, User, Phone, MapPin, X, Menu, Settings, Eye, EyeOff, Package, Users, ClipboardList, LogOut, Edit, Trash2, Save, Calendar } from 'lucide-react';

// ============================
// TYPES
// ============================
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rent_price?: number;
  images: string[];
  business_type: 'sale' | 'rent' | 'both';
  category: string;
  in_stock: number;
  created_at: string;
  updated_at?: string;
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

export interface Order {
  id: string;
  customer: CustomerData;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  orders_count: number;
  total_spent: number;
  last_order: string;
  created_at: string;
}

// ============================
// SAMPLE DATA
// ============================
// Real products from db.json
const initialProducts: Product[] = [
  {
    id: 1,
    name: "New 13x13 Bounce House - FOR SALE",
    description: "Brand new 13x13 bounce house for sale. Includes blower, repair kit, and 2-year warranty on seams. Perfect for starting your rental business.",
    price: 1300,
    rent_price: 0,
    category: "jumpers",
    business_type: "sale",
    in_stock: 3,
    images: [
      "/images/sales/brinca-brinca-13x13.jpg",
      "/images/sales/brinca-brinca-13x13-2.jpg"
    ],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "16ft High Water Slide",
    description: "16ft high water slide with new design, motor included, 2-year warranty on seams",
    price: 2400,
    rent_price: 300,
    category: "jumpers",
    business_type: "both",
    in_stock: 3,
    images: [
      "/images/sales/water-slide-16ft.jpg",
      "/images/sales/water-slide-16ft-2.jpg"
    ],
    created_at: "2024-01-15T10:05:00Z",
    updated_at: "2024-01-15T10:05:00Z"
  },
  {
    id: 3,
    name: "Duramax Chairs (Box of 8 units)",
    description: "Box of 8 Duramax chairs. Available in white, black and beige. $13 each chair",
    price: 104,
    rent_price: 20,
    category: "sillas",
    business_type: "both",
    in_stock: 25,
    images: [
      "/images/sales/sillas-duramax-blancas.jpg",
      "/images/sales/sillas-duramax-negras.jpg",
      "/images/sales/sillas-duramax-beige.jpg"
    ],
    created_at: "2024-01-15T10:10:00Z",
    updated_at: "2024-01-15T10:10:00Z"
  },
  {
    id: 4,
    name: "Duramax Pro 6ft Rectangular Table",
    description: "Duramax Pro industrial quality 6ft rectangular table. Available folding and non-folding",
    price: 60,
    rent_price: 15,
    category: "mesas",
    business_type: "both",
    in_stock: 20,
    images: [
      "/images/sales/mesa-rectangular-6ft.jpg",
      "/images/sales/mesa-rectangular-6ft-folded.jpg",
      "/images/sales/mesa-rectangular-setup.jpg"
    ],
    created_at: "2024-01-15T10:15:00Z",
    updated_at: "2024-01-15T10:15:00Z"
  },
  {
    id: 5,
    name: "60-Inch Round Table",
    description: "60-inch round table Duramax, perfect for large events",
    price: 120,
    rent_price: 25,
    category: "mesas",
    business_type: "both",
    in_stock: 15,
    images: [
      "/images/sales/mesa-redonda-60.jpg",
      "/images/sales/mesa-redonda-60-setup.jpg",
      "/images/sales/mesa-redonda-60-event.jpg"
    ],
    created_at: "2024-01-15T10:20:00Z",
    updated_at: "2024-01-15T10:20:00Z"
  },
  {
    id: 6,
    name: "Duramax Kids Chairs",
    description: "Duramax brand kids chairs. Available in white, pink, blue and yellow",
    price: 12,
    rent_price: 3,
    category: "sillas",
    business_type: "both",
    in_stock: 40,
    images: [
      "/images/sales/sillas-ninos-colores.jpg",
      "/images/sales/sillas-ninos-blancas.jpg",
      "/images/sales/sillas-ninos-azules.jpg",
      "/images/sales/sillas-ninos-rosas.jpg",
      "/images/sales/sillas-ninos-amarillas.jpg"
    ],
    created_at: "2024-01-15T10:25:00Z",
    updated_at: "2024-01-15T10:25:00Z"
  },
  {
    id: 10,
    name: "Bounce House Banners (Pair)",
    description: "Pair of decorative banners. Designs: Frozen, Lilo & Stitch, Princesses, Cars, Spiderman, Toy Story, Minecraft",
    price: 100,
    rent_price: 25,
    category: "accesorios",
    business_type: "both",
    in_stock: 15,
    images: [
      "/images/sales/banners-frozen-cars.jpg",
      "/images/sales/banners-frozen-cars-2.jpg",
      "/images/sales/banners-princesas.jpg",
      "/images/sales/banners-spiderman.jpg",
      "/images/sales/banners-spiderman-2.jpg"
    ],
    created_at: "2024-01-15T10:45:00Z",
    updated_at: "2024-01-15T10:45:00Z"
  },
  {
    id: 101,
    name: "16ft double-slide water slide",
    description: "Double the fun with our 16ft inflatable water slide! Perfect for parties and events, safe, durable, and ideal for hours of wet and wild entertainment.",
    price: 0,
    rent_price: 250,
    category: "jumpers",
    business_type: "rent",
    in_stock: 8,
    images: [
      "/images/rents/16ft-double-slide-water.jpg",
      "/images/rents/16ft-double-slide-water-2.jpg"
    ],
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:00:00Z"
  },
  {
    id: 103,
    name: "Boxing ring - comes with 4 gloves",
    description: "Bring the fun to your party or event with our inflatable boxing ring! Safe, durable, and comes with 4 oversized gloves for exciting matches everyone can enjoy.",
    price: 0,
    rent_price: 160,
    category: "jumpers",
    business_type: "rent",
    in_stock: 3,
    images: [
      "/images/rents/Boxing ring.jpg",
      "/images/rents/Boxing ring-2.jpg",
      "/images/rents/Boxing ring-3.jpg"
    ],
    created_at: "2024-01-15T11:10:00Z",
    updated_at: "2024-01-15T11:10:00Z"
  },
  {
    id: 109,
    name: "Tables & Chairs Rental",
    description: "Rent a complete set with 1 table and 6 chairs for just $13! Extra chairs available at $1.50 each — perfect for parties, events, and gatherings.",
    price: 0,
    rent_price: 13,
    category: "mesas",
    business_type: "rent",
    in_stock: 25,
    images: [
      "/images/rents/Tables-chairs.jpg",
      "/images/rents/Tables-chairs-2.jpg",
      "/images/rents/Tables-chairs-3.jpg"
    ],
    created_at: "2024-01-15T11:40:00Z",
    updated_at: "2024-01-15T11:40:00Z"
  }
];

const initialOrders: Order[] = [
  {
    id: "1",
    customer: {
      name: "Maria Rodriguez",
      phone: "(480) 555-0123",
      address: "123 Main St, Phoenix, AZ 85001",
      rentDate: "2024-12-15",
      eventType: "rent"
    },
    items: [
      { 
        id: 101,
        name: "16ft double-slide water slide",
        description: "Double the fun with our 16ft inflatable water slide!",
        price: 250,
        rent_price: 250,
        images: ["/images/rents/16ft-double-slide-water.jpg"],
        business_type: "rent",
        category: "jumpers",
        in_stock: 8,
        created_at: "2024-01-15T11:00:00Z",
        quantity: 1, 
        type: "rent" 
      }
    ],
    total: 250,
    status: "confirmed",
    created_at: "2024-08-20T10:30:00Z",
    notes: "Delivery at 8:00 AM, pickup at 6:00 PM"
  },
  {
    id: "2",
    customer: {
      name: "John Smith",
      phone: "(623) 555-0456",
      address: "456 Oak Ave, Scottsdale, AZ 85251",
      rentDate: "",
      eventType: "sale"
    },
    items: [
      { 
        id: 3,
        name: "Duramax Chairs (Box of 8 units)",
        description: "Box of 8 Duramax chairs. Available in white, black and beige.",
        price: 104,
        rent_price: 20,
        images: ["/images/sales/sillas-duramax-blancas.jpg"],
        business_type: "both",
        category: "sillas",
        in_stock: 25,
        created_at: "2024-01-15T10:10:00Z",
        quantity: 2, 
        type: "sale" 
      }
    ],
    total: 208,
    status: "pending",
    created_at: "2024-08-21T14:15:00Z",
    notes: "Customer will pick up"
  }
];

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    phone: "(480) 555-0123",
    address: "123 Main St, Phoenix, AZ 85001",
    email: "maria@email.com",
    orders_count: 3,
    total_spent: 276,
    last_order: "2024-08-15",
    created_at: "2024-01-15T09:00:00Z"
  },
  {
    id: "2",
    name: "John Smith",
    phone: "(623) 555-0456",
    address: "456 Oak Ave, Scottsdale, AZ 85251",
    email: "john.smith@email.com",
    orders_count: 1,
    total_spent: 208,
    last_order: "2024-08-21",
    created_at: "2024-08-21T14:00:00Z"
  }
];

// ============================
// MAIN COMPONENT
// ============================
export default function Home() {
  // ============================
  // STATE - GENERAL
  // ============================
  const [currentView, setCurrentView] = useState<'home' | 'sales' | 'rentals' | 'about'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
  // STATE - ADMIN
  // ============================
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [adminView, setAdminView] = useState<'products' | 'orders' | 'customers'>('products');
  const [showPasswordField, setShowPasswordField] = useState<boolean>(false);

  // ============================
  // STATE - DATA
  // ============================
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ============================
  // STATE - PRODUCT EDITING  
  // ============================
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  // ============================
  // ADMIN FUNCTIONS
  // ============================
  const handleAdminLogin = () => {
    if (adminCredentials.email === 'admin@hernandezjumpers.com' && adminCredentials.password === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminCredentials({ email: '', password: '' });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminView('products');
  };

  // ============================
  // PRODUCT FUNCTIONS
  // ============================
  const addNewProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: 'New Product',
      description: 'Product description',
      price: 0,
      rent_price: 0,
      images: ['/images/sales/banners-frozen-cars.jpg'],
      business_type: 'both',
      category: 'jumpers',
      in_stock: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setEditingProduct(newProduct);
    setShowProductForm(true);
  };

  const saveProduct = () => {
    if (editingProduct) {
      if (!editingProduct.name.trim() || editingProduct.price < 0) {
        alert('Please enter a valid product name and price');
        return;
      }

      const productToSave = {
        ...editingProduct,
        updated_at: new Date().toISOString(),
        images: editingProduct.images.length > 0 ? editingProduct.images : ['/images/sales/banners-frozen-cars.jpg']
      };
      
      const existingIndex = products.findIndex(p => p.id === editingProduct.id);
      if (existingIndex >= 0) {
        const updatedProducts = [...products];
        updatedProducts[existingIndex] = productToSave;
        setProducts(updatedProducts);
        alert(`Product "${productToSave.name}" updated successfully!`);
      } else {
        setProducts([...products, productToSave]);
        alert(`Product "${productToSave.name}" created successfully!`);
      }
      setEditingProduct(null);
      setShowProductForm(false);
      setNewImageUrl('');
    }
  };

  const deleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

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
  // WHATSAPP FUNCTION
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
      message += `  Price: ${item.price} ${item.type === 'rent' ? 'per day' : 'each'}\n`;
      message += `  Subtotal: ${item.price * item.quantity}\n\n`;
    });
    
    message += `💰 TOTAL: ${total}\n\n`;
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
  // ORDER FUNCTIONS
  // ============================
  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'confirmed' | 'delivered' | 'cancelled') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
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
  // RENDER FUNCTIONS
  // ============================
  const renderProductCard = (product: Product, showActions: boolean = false) => (
    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="h-48 bg-gray-100 flex items-center justify-center relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="max-w-full max-h-full object-contain"
        />
        {currentView === 'sales' && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            SALE
          </div>
        )}
        {currentView === 'rentals' && (
          <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            RENTAL
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold text-gray-800">{product.name}</h4>
          {showActions && (
            <div className="flex space-x-1">
              <button
                onClick={() => editProduct(product)}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-4 text-sm">{product.description.substring(0, 100)}...</p>
        <div className="flex justify-between items-center mb-4">
          <div>
            {(product.business_type === 'sale' || product.business_type === 'both') && currentView !== 'rentals' && (
              <p className="text-lg font-bold text-green-600">Sale: ${product.price}</p>
            )}
            {(product.business_type === 'rent' || product.business_type === 'both') && currentView !== 'sales' && (
              <p className="text-lg font-bold text-yellow-600">Rent: ${product.rent_price}/day</p>
            )}
            {currentView === 'home' && product.business_type === 'both' && (
              <>
                <p className="text-lg font-bold text-green-600">Sale: ${product.price}</p>
                <p className="text-lg font-bold text-yellow-600">Rent: ${product.rent_price}/day</p>
              </>
            )}
          </div>
        </div>
        {!showActions && (
          <div className="flex gap-2">
            {((product.business_type === 'sale' || product.business_type === 'both') && currentView !== 'rentals') && (
              <button
                onClick={() => addToCart(product, 'sale')}
                className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
              >
                Buy
              </button>
            )}
            {((product.business_type === 'rent' || product.business_type === 'both') && currentView !== 'sales') && (
              <button
                onClick={() => addToCart(product, 'rent')}
                className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm"
              >
                Rent
              </button>
            )}
          </div>
        )}
        {showActions && (
          <div className="text-sm text-gray-500">
            <p>Stock: {product.in_stock}</p>
            <p>Category: {product.category}</p>
          </div>
        )}
      </div>
    </div>
  );

  // ============================
  // LOADING STATE
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            onClick={() => setError('')} 
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
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Admin Button */}
              {!isAdmin ? (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Admin Login"
                >
                  <Settings className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={handleAdminLogout}
                  className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              )}

              {/* Cart Button */}
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

          {/* Admin Navigation */}
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => setAdminView('products')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    adminView === 'products' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Products</span>
                </button>
                <button
                  onClick={() => setAdminView('orders')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    adminView === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <ClipboardList className="w-5 h-5" />
                  <span>Orders ({orders.length})</span>
                </button>
                <button
                  onClick={() => setAdminView('customers')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    adminView === 'customers' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Customers ({customers.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ADMIN VIEWS */}
        {isAdmin && adminView === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
                <p className="text-sm text-green-600 mt-1">
                  ✅ Changes are saved automatically and persist between sessions
                </p>
              </div>
              <button
                onClick={addNewProduct}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Product
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => renderProductCard(product, true))}
            </div>
          </div>
        )}

        {isAdmin && adminView === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Order Management</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.images[0] || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, images: [e.target.value]})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Paste the URL of your product image</p>
              </div>
              
              <div>
                      <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                      <p className="text-gray-600">Customer: {order.customer.name}</p>
                      <p className="text-gray-600">Phone: {order.customer.phone}</p>
                      <p className="text-gray-600">Address: {order.customer.address}</p>
                      {order.customer.eventType === 'rent' && (
                        <p className="text-gray-600">Event Date: {order.customer.rentDate}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${order.total}</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span>{item.name} ({item.type})</span>
                        <span>{item.quantity}x ${item.price} = ${item.quantity * item.price}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Created: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAdmin && adminView === 'customers' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Customer Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{customer.name}</h3>
                  <p className="text-gray-600 mb-1">📱 {customer.phone}</p>
                  <p className="text-gray-600 mb-1">📍 {customer.address}</p>
                  {customer.email && (
                    <p className="text-gray-600 mb-3">📧 {customer.email}</p>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-600">Orders: {customer.orders_count}</p>
                    <p className="text-sm text-gray-600">Total Spent: ${customer.total_spent}</p>
                    <p className="text-sm text-gray-600">Last Order: {customer.last_order}</p>
                    <p className="text-sm text-gray-500">Joined: {new Date(customer.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REGULAR VIEWS */}
        {!isAdmin && currentView === 'home' && (
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
                {products.slice(0, 4).map(product => renderProductCard(product))}
              </div>
            </section>
          </div>
        )}

        {!isAdmin && currentView === 'sales' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🛒 Products for Sale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleProducts.map(product => renderProductCard(product))}
            </div>
          </div>
        )}

        {!isAdmin && currentView === 'rentals' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🎪 Products for Rent</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rentProducts.map(product => renderProductCard(product))}
            </div>
          </div>
        )}

        {!isAdmin && currentView === 'about' && (
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

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Admin Login</h3>
              <button
                onClick={() => setShowAdminLogin(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@hernandezjumpers.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPasswordField ? "text" : "password"}
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordField(!showPasswordField)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordField ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAdminLogin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {products.find(p => p.id === editingProduct.id) ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  setNewImageUrl('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="jumpers">Jumpers</option>
                    <option value="sillas">Sillas</option>
                    <option value="mesas">Mesas</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rent Price</label>
                  <input
                    type="number"
                    value={editingProduct.rent_price}
                    onChange={(e) => setEditingProduct({...editingProduct, rent_price: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.in_stock}
                    onChange={(e) => setEditingProduct({...editingProduct, in_stock: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <select
                  value={editingProduct.business_type}
                  onChange={(e) => setEditingProduct({...editingProduct, business_type: e.target.value as 'sale' | 'rent' | 'both'})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sale">Sale Only</option>
                  <option value="rent">Rent Only</option>
                  <option value="both">Sale & Rent</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    setNewImageUrl('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProduct}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                            <Calendar className="w-4 h-4 inline mr-1" />
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