// src/app/api/customers/[id]/route.ts - Operaciones específicas de cliente
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

// GET /api/customers/[id] - Obtener cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    const db = readDB();
    
    const customer = db.customers.find((c: any) => c.id === customerId);
    
    if (!customer) {
      return NextResponse.json({ 
        error: 'Customer not found',
        success: false 
      }, { status: 404 });
    }
    
    // También obtener pedidos del cliente
    const customerOrders = db.orders.filter((o: any) => 
      o.customer_phone === customer.phone || o.customer_email === customer.email
    );
    
    return NextResponse.json({ 
      customer: {
        ...customer,
        orders: customerOrders
      },
      success: true 
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch customer',
      success: false 
    }, { status: 500 });
  }
}

// PUT /api/customers/[id] - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    const updates = await request.json();
    const db = readDB();
    
    const customerIndex = db.customers.findIndex((c: any) => c.id === customerId);
    
    if (customerIndex === -1) {
      return NextResponse.json({ 
        error: 'Customer not found',
        success: false 
      }, { status: 404 });
    }
    
    // Verificar si hay conflicto con otro cliente (si se actualiza phone o email)
    if (updates.phone || updates.email) {
      const conflictCustomer = db.customers.find((c: any) => 
        c.id !== customerId && (
          (updates.phone && c.phone === updates.phone) ||
          (updates.email && c.email === updates.email)
        )
      );
      
      if (conflictCustomer) {
        return NextResponse.json({ 
          error: 'Another customer already has this phone or email',
          success: false 
        }, { status: 400 });
      }
    }
    
    // Actualizar cliente manteniendo campos originales
    db.customers[customerIndex] = {
      ...db.customers[customerIndex],
      ...updates,
      id: customerId, // Mantener ID original
      updated_at: new Date().toISOString()
    };
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        customer: db.customers[customerIndex],
        success: true 
      });
    } else {
      throw new Error('Failed to update customer');
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ 
      error: 'Failed to update customer',
      success: false 
    }, { status: 500 });
  }
}

// DELETE /api/customers/[id] - Eliminar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    const db = readDB();
    
    const customerIndex = db.customers.findIndex((c: any) => c.id === customerId);
    
    if (customerIndex === -1) {
      return NextResponse.json({ 
        error: 'Customer not found',
        success: false 
      }, { status: 404 });
    }
    
    const deletedCustomer = db.customers.splice(customerIndex, 1)[0];
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        customer: deletedCustomer,
        message: 'Customer deleted successfully',
        success: true 
      });
    } else {
      throw new Error('Failed to delete customer');
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ 
      error: 'Failed to delete customer',
      success: false 
    }, { status: 500 });
  }
}