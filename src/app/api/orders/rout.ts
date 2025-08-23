// src/app/api/orders/route.ts - API para pedidos
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/app/data/db.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { products: [], orders: [], customers: [], settings: {} };
  }
};

const writeDB = (data: any) => {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// GET /api/orders - Obtener todos los pedidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customer_id');
    const eventType = searchParams.get('event_type');
    const limit = searchParams.get('limit');
    
    const db = readDB();
    let orders = db.orders || [];
    
    // Filtrar por estado si se especifica
    if (status && status !== 'all') {
      orders = orders.filter((o: any) => o.status === status);
    }
    
    // Filtrar por cliente si se especifica
    if (customerId) {
      orders = orders.filter((o: any) => o.customer_id === parseInt(customerId));
    }
    
    // Filtrar por tipo de evento si se especifica
    if (eventType && eventType !== 'all') {
      orders = orders.filter((o: any) => o.event_type === eventType);
    }
    
    // Ordenar por fecha de creación (más reciente primero)
    orders.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Limitar resultados si se especifica
    if (limit) {
      orders = orders.slice(0, parseInt(limit));
    }
    
    return NextResponse.json({ 
      orders,
      total: orders.length,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch orders',
      success: false 
    }, { status: 500 });
  }
}

// POST /api/orders - Crear nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const order = await request.json();
    
    // Validar campos requeridos
    if (!order.customer_name || !order.customer_phone || !order.items || order.items.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: customer_name, customer_phone, items',
        success: false 
      }, { status: 400 });
    }
    
    const db = readDB();
    
    // Generar nuevo ID
    const maxId = db.orders.reduce((max: number, o: any) => 
      Math.max(max, o.id || 0), 0
    );
    
    // Calcular total si no se proporciona
    const total = order.total || order.items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );
    
    const newOrder = {
      ...order,
      id: maxId + 1,
      total,
      status: order.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    db.orders.push(newOrder);
    
    // Actualizar o crear cliente
    const existingCustomer = db.customers.find((c: any) => 
      c.phone === order.customer_phone || c.email === order.customer_email
    );
    
    if (existingCustomer) {
      // Actualizar cliente existente
      existingCustomer.total_orders += 1;
      existingCustomer.last_order = newOrder.created_at;
      existingCustomer.updated_at = new Date().toISOString();
    } else {
      // Crear nuevo cliente
      const maxCustomerId = db.customers.reduce((max: number, c: any) => 
        Math.max(max, c.id || 0), 0
      );
      
      const newCustomer = {
        id: maxCustomerId + 1,
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email || '',
        address: order.customer_address || '',
        total_orders: 1,
        last_order: newOrder.created_at,
        notes: '',
        created_at: new Date().toISOString()
      };
      
      db.customers.push(newCustomer);
    }
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        order: newOrder,
        success: true 
      }, { status: 201 });
    } else {
      throw new Error('Failed to save order');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      error: 'Failed to create order',
      success: false 
    }, { status: 500 });
  }
}