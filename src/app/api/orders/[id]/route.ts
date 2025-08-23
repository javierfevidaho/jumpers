// src/app/api/orders/[id]/route.ts - Operaciones específicas de pedido
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

// GET /api/orders/[id] - Obtener pedido específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const db = readDB();
    
    const order = db.orders.find((o: any) => o.id === orderId);
    
    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found',
        success: false 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      order,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch order',
      success: false 
    }, { status: 500 });
  }
}

// PUT /api/orders/[id] - Actualizar pedido
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const updates = await request.json();
    const db = readDB();
    
    const orderIndex = db.orders.findIndex((o: any) => o.id === orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json({ 
        error: 'Order not found',
        success: false 
      }, { status: 404 });
    }
    
    // Actualizar pedido manteniendo campos originales
    db.orders[orderIndex] = {
      ...db.orders[orderIndex],
      ...updates,
      id: orderId, // Mantener ID original
      updated_at: new Date().toISOString()
    };
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        order: db.orders[orderIndex],
        success: true 
      });
    } else {
      throw new Error('Failed to update order');
    }
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ 
      error: 'Failed to update order',
      success: false 
    }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Eliminar pedido
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const db = readDB();
    
    const orderIndex = db.orders.findIndex((o: any) => o.id === orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json({ 
        error: 'Order not found',
        success: false 
      }, { status: 404 });
    }
    
    const deletedOrder = db.orders.splice(orderIndex, 1)[0];
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        order: deletedOrder,
        message: 'Order deleted successfully',
        success: true 
      });
    } else {
      throw new Error('Failed to delete order');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ 
      error: 'Failed to delete order',
      success: false 
    }, { status: 500 });
  }
}