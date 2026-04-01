'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Producto, Categoria, PaginationMeta, formatCOP } from '@/lib/api';
import { Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

interface CatalogContentProps {
  initialProductos: Producto[];
  pagination: PaginationMeta;
  categorias: Categoria[];
  categoriaActual?: Categoria;
}

export function CatalogContent({
  initialProductos,
  pagination,
  categorias,
  categoriaActual,
}: CatalogContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const { addItem, openCart } = useCart();

  const categoriaSeleccionada = searchParams.get('categoria') || categoriaActual?.slug;
  const marcaSeleccionada = searchParams.get('marca');
  const busquedaActual = searchParams.get('busqueda');

  const aplicarFiltros = () => {
    const params = new URLSearchParams();
    
    if (categoriaSeleccionada) params.set('categoria', categoriaSeleccionada);
    if (marcaSeleccionada) params.set('marca', marcaSeleccionada);
    if (busquedaActual) params.set('busqueda', busquedaActual);
    if (precioMin) params.set('precio_min', precioMin);
    if (precioMax) params.set('precio_max', precioMax);

    router.push(`/catalogo?${params.toString()}`);
  };

  const limpiarFiltros = () => {
    setPrecioMin('');
    setPrecioMax('');
    router.push('/catalogo');
  };

  const cambiarPagina = (pagina: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pagina', pagina.toString());
    router.push(`/catalogo?${params.toString()}`);
  };

  const handleAddToCart = (producto: Producto) => {
    addItem(producto, 1);
    openCart();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-dark mb-2">
            {categoriaActual ? categoriaActual.nombre : 'Catálogo de Productos'}
          </h1>
          <p className="text-gray-600">
            {pagination.total} productos encontrados
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Filtros</h2>
                <button
                  onClick={limpiarFiltros}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Limpiar
                </button>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Categorías</h3>
                <div className="space-y-2">
                  {categorias.map((categoria) => (
                    <Link
                      key={categoria.id}
                      href={`/catalogo/${categoria.slug}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        categoriaSeleccionada === categoria.slug
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{categoria.nombre}</span>
                        <span className="text-xs opacity-75">
                          {categoria.productos_count}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Rango de Precio</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={aplicarFiltros}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Disponibilidad */}
              <div>
                <h3 className="font-semibold mb-3">Disponibilidad</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm">Solo productos disponibles</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-6 left-6 z-40 bg-dark text-white p-4 rounded-full shadow-lg"
          >
            <Filter className="w-6 h-6" />
          </button>

          {/* Products Grid */}
          <div className="flex-1">
            {initialProductos.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No se encontraron productos con los filtros seleccionados.
                </p>
                <button
                  onClick={limpiarFiltros}
                  className="mt-4 text-primary hover:text-primary/80 font-semibold"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {initialProductos.map((producto) => (
                    <ProductCard
                      key={producto.id}
                      producto={producto}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cambiarPagina(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => cambiarPagina(pageNum)}
                            className={`px-4 py-2 rounded-lg ${
                              pagination.current_page === pageNum
                                ? 'bg-primary text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => cambiarPagina(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  producto,
  onAddToCart,
}: {
  producto: Producto;
  onAddToCart: (producto: Producto) => void;
}) {
  const imagenUrl = producto.imagenes[0] || '/placeholder-product.png';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      <Link href={`/producto/${producto.slug}`}>
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={imagenUrl}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {!producto.disponible && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                Agotado
              </span>
            </div>
          )}
          {producto.disponible && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Disponible
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {producto.categoria && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {producto.categoria}
          </p>
        )}
        <Link href={`/producto/${producto.slug}`}>
          <h3 className="font-semibold text-dark mb-2 line-clamp-2 hover:text-primary transition-colors">
            {producto.nombre}
          </h3>
        </Link>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-primary">
              {formatCOP(producto.precio_venta)}
            </p>
            <p className="text-xs text-gray-500">Código: {producto.codigo}</p>
          </div>
        </div>
        {producto.disponible && (
          <button
            onClick={() => onAddToCart(producto)}
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors font-semibold"
          >
            Agregar al Carrito
          </button>
        )}
      </div>
    </div>
  );
}
