# 🏍️ MotoRepuestos Colombia - E-commerce

Tienda e-commerce para repuestos de motos en Colombia, integrada con sistema POS existente.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS
- **Estado**: Zustand (carrito de compras)
- **Pagos**: Wompi (Colombia)
- **Imágenes**: Cloudinary + Replicate (IA)
- **Backend**: Laravel API (sistema POS existente)

## 📋 Requisitos Previos

- Node.js 18+ y npm/yarn
- Backend Laravel corriendo en `http://localhost:8000`
- Cuentas en:
  - Cloudinary
  - Wompi
  - Replicate (opcional, para IA)

## ⚙️ Instalación

1. **Instalar dependencias**:
```bash
npm install
# o
yarn install
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxxxx
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. **Ejecutar migraciones en Laravel**:
```bash
cd ../pos-almacen
php artisan migrate
```

4. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

La tienda estará disponible en `http://localhost:3002`

## 📁 Estructura del Proyecto

```
tienda-motos/
├── app/
│   ├── page.tsx              # Página de inicio
│   ├── catalogo/             # Catálogo de productos
│   ├── producto/[slug]/      # Detalle de producto
│   ├── checkout/             # Proceso de pago
│   └── admin/                # Panel de administración
├── components/
│   ├── Navbar.tsx            # Navegación principal
│   ├── HeroSection.tsx       # Banner hero
│   ├── CartSidebar.tsx       # Carrito lateral
│   └── ...
├── lib/
│   ├── api.ts                # Cliente API
│   └── cart.ts               # Estado del carrito (Zustand)
└── public/
    └── placeholder-product.png
```

## 🔌 Endpoints de API (Laravel)

### Públicos (con rate limiting 60 req/min)
- `GET /api/tienda/productos` - Lista paginada de productos
- `GET /api/tienda/productos/{codigo}` - Detalle de producto
- `GET /api/tienda/stock/{codigo}` - Stock en tiempo real
- `GET /api/tienda/categorias` - Árbol de categorías
- `POST /api/tienda/ordenes` - Crear orden

### Protegidos (requieren autenticación)
- `POST /api/tienda/productos/{codigo}/imagenes` - Subir imágenes

## 🎨 Paleta de Colores

- **Primario**: `#D62B2B` (Rojo)
- **Oscuro**: `#111111` (Negro)
- **Fondo**: `#FFFFFF` (Blanco)

## 🛒 Funcionalidades Principales

### ✅ Implementadas
- [x] Navbar con megamenú de categorías
- [x] Hero banner
- [x] Sección de categorías destacadas
- [x] Grid de productos destacados
- [x] Carrito de compras (sidebar)
- [x] Búsqueda en tiempo real
- [x] Footer con información de contacto
- [x] Botón flotante de WhatsApp
- [x] API Laravel completa
- [x] Migraciones de BD (orders, order_items, product_images)

### 🚧 Pendientes
- [ ] Página de catálogo con filtros
- [ ] Página de detalle de producto
- [ ] Integración con Wompi
- [ ] Generación de imágenes con IA (Replicate)
- [ ] Panel de administración
- [ ] SEO y metadata
- [ ] Google Analytics
- [ ] Sitemap.xml

## 💳 Integración con Wompi

```typescript
// Ejemplo de integración (pendiente)
const checkout = new WidgetCheckout({
  currency: 'COP',
  amountInCents: total * 100,
  reference: orderNumber,
  publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
  // ...
});
```

## 📸 Subida de Imágenes

Las imágenes se suben a Cloudinary mediante el endpoint:
```
POST /api/tienda/productos/{codigo}/imagenes
```

## 🤖 Generación de Imágenes con IA

Usa Replicate con el modelo Flux para generar imágenes de productos sin foto.

## 📱 WhatsApp

Botón flotante que abre WhatsApp con mensaje prellenado:
```
https://wa.me/573001234567?text=Hola! Estoy interesado en...
```

## 🔒 Seguridad

- Rate limiting en API (60 req/min)
- Validación de datos en backend
- CORS configurado
- Sanitización de inputs

## 📊 Formato Colombia

- Precios: `$1.250.000` (punto como separador de miles)
- Locale: `es-CO`
- Moneda: COP

## 🚀 Despliegue

### Vercel (Recomendado para Next.js)
```bash
vercel --prod
```

### Variables de entorno en producción
Configura todas las variables en el panel de Vercel/hosting.

## 📝 Licencia

Proyecto privado - Todos los derechos reservados.
