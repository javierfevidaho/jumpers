// src/app/api/products/route.ts - API Routes para productos
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ruta al archivo db.json
const DB_PATH = path.join(process.cwd(), 'src/app/data/db.json');

// Leer la base de datos
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { products: [], orders: [], customers: [], settings: {} };
  }
};

// Escribir a la base de datos
const writeDB = (data: any) => {
  try {
    // Asegurar que el directorio existe
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

// GET /api/products - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const businessType = searchParams.get('business_type');
    const search = searchParams.get('search');
    
    const db = readDB();
    let products = db.products || [];
    
    // Filtrar por categoría si se especifica
    if (category && category !== 'all') {
      products = products.filter((p: any) => p.category === category);
    }
    
    // Filtrar por tipo de negocio si se especifica
    if (businessType && businessType !== 'all') {
      products = products.filter((p: any) => 
        p.business_type === businessType || p.business_type === 'both'
      );
    }
    
    // Filtrar por búsqueda si se especifica
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json({ 
      products,
      total: products.length,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      success: false 
    }, { status: 500 });
  }
}

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const product = await request.json();
    
    // Validar campos requeridos
    if (!product.name || !product.description || !product.category) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, description, category',
        success: false 
      }, { status: 400 });
    }
    
    const db = readDB();
    
    // Generar nuevo ID
    const maxId = db.products.reduce((max: number, p: any) => 
      Math.max(max, p.id || 0), 0
    );
    
    const newProduct = {
      ...product,
      id: maxId + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    db.products.push(newProduct);
    
    if (writeDB(db)) {
      return NextResponse.json({ 
        product: newProduct,
        success: true 
      }, { status: 201 });
    } else {
      throw new Error('Failed to save product');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      error: 'Failed to create product',
      success: false 
    }, { status: 500 });
  }
}