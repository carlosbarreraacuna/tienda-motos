'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Producto, formatCOP, getImageUrl, PLACEHOLDER_IMG } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { Tag, SortAsc, Flame } from 'lucide-react';

interface OfertasContentProps {
  productosIniciales: Producto[];
}

type Orden = 'descuento_desc' | 'precio_asc' | 'precio_desc' | 'mas_vendidos';

const ORDEN_OPCIONES: { value: Orden; label: string }[] = [
  { value: 'descuento_desc', label: 'Mayor descuento' },
  { value: 'precio_asc', label: 'Menor precio' },
  { value: 'precio_desc', label: 'Mayor precio' },
  { value: 'mas_vendidos', label: 'Más vendidos' },
];

export default function OfertasContent({ productosIniciales }: OfertasContentProps) {
  const [orden, setOrden] = useState<Orden>('descuento_desc');
  const { addItem, openCart } = useCart();

  const productos = useMemo(() => {
    const sorted = [...productosIniciales];
    switch (orden) {
      case 'descuento_desc':
        return sorted.sort((a, b) => b.descuento_porcentaje - a.descuento_porcentaje);
      case 'precio_asc':
        return sorted.sort((a, b) => {
          const pa = a.precio_oferta ?? a.precio_venta;
          const pb = b.precio_oferta ?? b.precio_venta;
          return pa - pb;
        });
      case 'precio_desc':
        return sorted.sort((a, b) => {
          const pa = a.precio_oferta ?? a.precio_venta;
          const pb = b.precio_oferta ?? b.precio_venta;
          return pb - pa;
        });
      default:
        return sorted;
    }
  }, [productosIniciales, orden]);

  const handleAddToCart = (producto: Producto) => {
    addItem(producto, 1);
    openCart();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="w-8 h-8" />
            <span className="text-sm font-semibold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              Tiempo limitado
            </span>
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Ofertas y Descuentos</h1>
          <p className="text-white/80 text-lg">
            {productosIniciales.length} productos con descuento — ¡aprovecha antes de que se agoten!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm px-4 py-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Tag className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">
              {productos.length} {productos.length === 1 ? 'oferta' : 'ofertas'} disponibles
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 hidden sm:inline">Ordenar:</span>
            <div className="flex gap-1">
              {ORDEN_OPCIONES.map((op) => (
                <button
                  key={op.value}
                  onClick={() => setOrden(op.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    orden === op.value
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {productos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <Flame className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No hay ofertas disponibles en este momento.</p>
            <p className="text-gray-400 mt-1">Vuelve pronto, ¡constantemente actualizamos nuestros descuentos!</p>
            <Link
              href="/catalogo"
              className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver catálogo completo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <OfertaCard
                key={producto.id}
                producto={producto}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OfertaCard({
  producto,
  onAddToCart,
}: {
  producto: Producto;
  onAddToCart: (p: Producto) => void;
}) {
  const imagenUrl = getImageUrl(producto.imagenes[0]) ?? PLACEHOLDER_IMG;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
      <Link href={`/producto/${producto.slug}`} className="relative block aspect-square bg-gray-100 overflow-hidden">
        <img
          src={imagenUrl}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
        />
        {/* Discount badge */}
        {producto.descuento_porcentaje > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-full shadow-md">
            -{producto.descuento_porcentaje}%
          </div>
        )}
        {/* Availability badge */}
        {!producto.disponible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">Agotado</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {producto.categoria && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{producto.categoria}</p>
        )}
        <Link href={`/producto/${producto.slug}`}>
          <h3 className="font-semibold text-dark mb-3 line-clamp-2 hover:text-primary transition-colors text-sm leading-snug">
            {producto.nombre}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="mt-auto">
          <div className="mb-1">
            {producto.precio_oferta != null ? (
              <>
                <span className="text-gray-400 line-through text-sm mr-2">
                  {formatCOP(producto.precio_venta)}
                </span>
                <span className="text-xs text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                  Ahorra {formatCOP(producto.precio_venta - producto.precio_oferta)}
                </span>
                <p className="text-2xl font-bold text-red-500 mt-1">
                  {formatCOP(producto.precio_oferta)}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-primary">
                {formatCOP(producto.precio_venta)}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-3">Cód: {producto.codigo}</p>

          {producto.disponible ? (
            <button
              onClick={() => onAddToCart(producto)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition-colors font-semibold text-sm"
            >
              Agregar al carrito
            </button>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-400 py-2.5 rounded-lg font-semibold text-sm cursor-not-allowed">
              Sin stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
