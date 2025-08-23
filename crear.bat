@echo off
REM === Crear estructura de carpetas ===
mkdir src
mkdir src\app
mkdir src\app\components
mkdir src\app\hooks
mkdir src\app\data

REM === Crear archivos base ===
type nul > src\app\page.tsx
type nul > src\app\types.ts
type nul > src\app\utils.ts

REM === Componentes reutilizables ===
type nul > src\app\components\Header.tsx
type nul > src\app\components\Hero.tsx
type nul > src\app\components\FeaturedProducts.tsx
type nul > src\app\components\ProductCard.tsx
type nul > src\app\components\ProductGrid.tsx
type nul > src\app\components\CategoryFilter.tsx
type nul > src\app\components\ImageGallery.tsx
type nul > src\app\components\CartModal.tsx
type nul > src\app\components\ChatWidget.tsx
type nul > src\app\components\AboutUs.tsx
type nul > src\app\components\Footer.tsx
type nul > src\app\components\AdminPanel.tsx
type nul > src\app\components\AdminLogin.tsx

REM === Hooks personalizados ===
type nul > src\app\hooks\useAdmin.ts

REM === Datos y configuración ===
type nul > src\app\data\products.ts
type nul > src\app\data\rent.ts
type nul > src\app\data\db.json

echo ✅ Estructura creada exitosamente
pause
