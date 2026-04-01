# 🚀 Guía de Instalación - Tienda MotoRepuestos

## Paso 1: Backend Laravel (POS)

### 1.1 Ejecutar Migraciones
```bash
cd pos-almacen
php artisan migrate
```

Esto creará las tablas:
- `orders` - Órdenes de la tienda
- `order_items` - Items de cada orden
- `product_images` - Imágenes de productos

### 1.2 Instalar Cloudinary (opcional)
```bash
composer require cloudinary/cloudinary_php
```

### 1.3 Configurar .env
Agrega a `pos-almacen/.env`:
```env
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### 1.4 Verificar Rutas
```bash
php artisan route:list --path=tienda
```

Deberías ver:
- GET /api/tienda/productos
- GET /api/tienda/productos/{codigo}
- GET /api/tienda/stock/{codigo}
- GET /api/tienda/categorias
- POST /api/tienda/ordenes
- POST /api/tienda/productos/{codigo}/imagenes

## Paso 2: Frontend Next.js (Tienda)

### 2.1 Instalar Dependencias
```bash
cd tienda-motos
npm install
```

### 2.2 Configurar Variables de Entorno
Crea `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxxxx
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_NAME=MotoRepuestos Colombia
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

### 2.3 Iniciar Servidor de Desarrollo
```bash
npm run dev
```

La tienda estará en: http://localhost:3002

## Paso 3: Verificación

### 3.1 Verificar Backend
```bash
curl http://localhost:8000/api/tienda/productos
```

Debería devolver JSON con productos.

### 3.2 Verificar Frontend
Abre http://localhost:3002 en tu navegador.

Deberías ver:
- ✅ Navbar con logo y menú
- ✅ Hero banner
- ✅ Categorías destacadas
- ✅ Productos destacados
- ✅ Footer
- ✅ Botón de WhatsApp flotante

## Paso 4: Configuraciones Adicionales

### 4.1 Wompi (Pagos)
1. Regístrate en https://wompi.com
2. Obtén tus claves de prueba
3. Actualiza `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`

### 4.2 Cloudinary (Imágenes)
1. Regístrate en https://cloudinary.com
2. Obtén tu Cloud Name
3. Actualiza las variables de entorno

### 4.3 Replicate (IA - Opcional)
1. Regístrate en https://replicate.com
2. Obtén tu API token
3. Agrega `REPLICATE_API_TOKEN` al .env

### 4.4 Google Analytics
1. Crea una propiedad GA4
2. Obtén tu Measurement ID (G-XXXXXXXXXX)
3. Actualiza `NEXT_PUBLIC_GA_ID`

## Paso 5: Datos de Prueba

### 5.1 Crear Productos de Prueba
Usa el panel POS para crear productos con:
- Nombre
- SKU/Código
- Precio
- Stock
- Categoría
- Marca

### 5.2 Subir Imágenes
Desde el panel admin de la tienda (pendiente) o mediante API:
```bash
curl -X POST http://localhost:8000/api/tienda/productos/ABC123/imagenes \
  -H "Authorization: Bearer tu_token" \
  -F "imagenes[]=@imagen1.jpg"
```

## Troubleshooting

### Error: Cannot connect to API
- Verifica que Laravel esté corriendo en puerto 8000
- Revisa CORS en `pos-almacen/config/cors.php`

### Error: No products found
- Asegúrate de tener productos con `is_active = true`
- Verifica que las categorías existan

### Error: Images not loading
- Verifica configuración de Cloudinary
- Revisa `next.config.js` para dominios permitidos

## Próximos Pasos

1. ✅ Página de catálogo con filtros
2. ✅ Página de detalle de producto
3. ✅ Integración con Wompi
4. ✅ Panel de administración
5. ✅ SEO y metadata
6. ✅ Google Analytics

## Soporte

Para problemas o preguntas, revisa:
- README.md
- Documentación de Next.js: https://nextjs.org/docs
- Documentación de Laravel: https://laravel.com/docs
