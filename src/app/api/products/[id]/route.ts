// src/app/api/products/[id]/route.ts - Operaciones específicas de producto
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

// GET /api/products/[id] - Obtener producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const db = readDB();
    
    const product = db.products.find((p: any) => p.id === productId);
    
    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found',
        success: false 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      product,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch product',
      success: false 
    }, { status: 500 });
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const updates = await request.json();
    const db = readDB();
    
    const productIndex = db.products.findIndex((p: any) => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json({ 
        error: 'Product not found',
        success: false 
      }, { status: 404 });
    }
    
    // Actualizar producto manteniendo campos originales
    db.products[productIndex] = {
      ...db.products[productIndex],
      ...updates,
      id: productId, // Mantener ID original
      updated_at: new Date().toISOString()
    };
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        product: db.products[productIndex],
        success: true 
      });
    } else {
      throw new Error('Failed to update product');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ 
      error: 'Failed to update product',
      success: false 
    }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const db = readDB();
    
    const productIndex = db.products.findIndex((p: any) => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json({ 
        error: 'Product not found',
        success: false 
      }, { status: 404 });
    }
    
    const deletedProduct = db.products.splice(productIndex, 1)[0];
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        product: deletedProduct,
        message: 'Product deleted successfully',
        success: true 
      });
    } else {
      throw new Error('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ 
      error: 'Failed to delete product',
      success: false 
    }, { status: 500 });
  }
}