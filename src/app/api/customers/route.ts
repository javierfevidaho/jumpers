// src/app/api/customers/route.ts - API para clientes
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

// GET /api/customers - Obtener todos los clientes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';
    const limit = searchParams.get('limit');
    
    const db = readDB();
    let customers = db.customers || [];
    
    // Buscar por nombre, teléfono o email si se especifica
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter((c: any) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.phone.includes(search) ||
        (c.email && c.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Ordenar resultados
    customers.sort((a: any, b: any) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Manejar fechas
      if (sortBy === 'created_at' || sortBy === 'last_order') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    
    // Limitar resultados si se especifica
    if (limit) {
      customers = customers.slice(0, parseInt(limit));
    }
    
    return NextResponse.json({ 
      customers,
      total: customers.length,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch customers',
      success: false 
    }, { status: 500 });
  }
}

// POST /api/customers - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const customer = await request.json();
    
    // Validar campos requeridos
    if (!customer.name || !customer.phone) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, phone',
        success: false 
      }, { status: 400 });
    }
    
    const db = readDB();
    
    // Verificar si el cliente ya existe
    const existingCustomer = db.customers.find((c: any) => 
      c.phone === customer.phone || (customer.email && c.email === customer.email)
    );
    
    if (existingCustomer) {
      return NextResponse.json({ 
        error: 'Customer with this phone or email already exists',
        success: false 
      }, { status: 400 });
    }
    
    // Generar nuevo ID
    const maxId = db.customers.reduce((max: number, c: any) => 
      Math.max(max, c.id || 0), 0
    );
    
    const newCustomer = {
      ...customer,
      id: maxId + 1,
      total_orders: customer.total_orders || 0,
      last_order: customer.last_order || null,
      notes: customer.notes || '',
      created_at: new Date().toISOString()
    };
    
    db.customers.push(newCustomer);
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        customer: newCustomer,
        success: true 
      }, { status: 201 });
    } else {
      throw new Error('Failed to save customer');
    }
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ 
      error: 'Failed to create customer',
      success: false 
    }, { status: 500 });
  }
}