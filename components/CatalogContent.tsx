'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Producto, Categoria, PaginationMeta, formatCOP, getImageUrl, PLACEHOLDER_IMG } from '@/lib/api';
import { Filter, X, SortAsc, Tag } from 'lucide-react';
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
  const { addItem, openCart } = useCart();

  // Inicializar desde URL para que los filtros persistan al recargar
  const [precioMin, setPrecioMin] = useState(searchParams.get('precio_min') || '');
  const [precioMax, setPrecioMax] = useState(searchParams.get('precio_max') || '');
  const [soloDisponible, setSoloDisponible] = useState(searchParams.get('disponible') === 'true');
  const [soloEnOferta, setSoloEnOferta] = useState(searchParams.get('en_oferta') === 'true');
  const [ordenar, setOrdenar] = useState(searchParams.get('ordenar') || 'recientes');

  const categoriaSeleccionada = searchParams.get('categoria') || categoriaActual?.slug || '';
  const busquedaActual = searchParams.get('busqueda');

  // Nombre de la categoría activa (para el título)
  const categoriaActivaNombre = categoriaActual?.nombre
    ?? categorias.find(c => c.slug === categoriaSeleccionada)?.nombre
    ?? null;

  // Sincronizar estado si el usuario navega hacia atrás/adelante
  useEffect(() => {
    setPrecioMin(searchParams.get('precio_min') || '');
    setPrecioMax(searchParams.get('precio_max') || '');
    setSoloDisponible(searchParams.get('disponible') === 'true');
    setSoloEnOferta(searchParams.get('en_oferta') === 'true');
    setOrdenar(searchParams.get('ordenar') || 'recientes');
  }, [searchParams]);

  const buildParams = (overrides: Record<string, string | boolean | null> = {}) => {
    const params = new URLSearchParams();
    const get = (key: string, fallback: string | boolean | null) =>
      key in overrides ? overrides[key] : fallback;

    const cat  = get('categoria',  categoriaSeleccionada);
    const bus  = get('busqueda',   busquedaActual);
    const pmin = get('precio_min', precioMin);
    const pmax = get('precio_max', precioMax);
    const disp = get('disponible', soloDisponible);
    const ofer = get('en_oferta',  soloEnOferta);
    const ord  = get('ordenar',    ordenar);

    if (cat)                      params.set('categoria',  String(cat));
    if (bus)                      params.set('busqueda',   String(bus));
    if (pmin)                     params.set('precio_min', String(pmin));
    if (pmax)                     params.set('precio_max', String(pmax));
    if (disp)                     params.set('disponible', 'true');
    if (ofer)                     params.set('en_oferta',  'true');
    if (ord && ord !== 'recientes') params.set('ordenar',  String(ord));
    return params;
  };

  const seleccionarCategoria = (slug: string) => {
    const params = buildParams({ categoria: slug });
    params.delete('pagina');
    router.push(`/catalogo?${params.toString()}`);
  };

  const aplicarFiltros = () => {
    const params = buildParams();
    params.delete('pagina');
    router.push(`/catalogo?${params.toString()}`);
  };

  const toggleDisponible = () => {
    const next = !soloDisponible;
    setSoloDisponible(next);
    const params = buildParams({ disponible: next });
    params.delete('pagina');
    router.push(`/catalogo?${params.toString()}`);
  };

  const toggleEnOferta = () => {
    const next = !soloEnOferta;
    setSoloEnOferta(next);
    const params = buildParams({ en_oferta: next });
    params.delete('pagina');
    router.push(`/catalogo?${params.toString()}`);
  };

  const cambiarOrden = (nuevoOrden: string) => {
    setOrdenar(nuevoOrden);
    const params = buildParams({ ordenar: nuevoOrden });
    params.delete('pagina');
    router.push(`/catalogo?${params.toString()}`);
  };

  const limpiarFiltros = () => {
    setPrecioMin('');
    setPrecioMax('');
    setSoloDisponible(false);
    setSoloEnOferta(false);
    setOrdenar('recientes');
    router.push('/catalogo');
  };

  const cambiarPagina = (pagina: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pagina', pagina.toString());
    router.push(`/catalogo?${params.toString()}`);
  };

  const hayFiltrosActivos = !!(precioMin || precioMax || soloDisponible || soloEnOferta || categoriaSeleccionada || busquedaActual);

  const handleAddToCart = (producto: Producto) => {
    addItem(producto, 1);
    openCart();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-dark mb-1">
            {categoriaActivaNombre ?? 'Catálogo de Productos'}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-gray-500 text-sm">{pagination.total} productos encontrados</p>
            {categoriaActivaNombre && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                {categoriaActivaNombre}
                <button onClick={() => seleccionarCategoria('')} className="hover:text-primary/60">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {busquedaActual && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Búsqueda: "{busquedaActual}"
              </span>
            )}
            {hayFiltrosActivos && (
              <button onClick={limpiarFiltros} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                <X className="w-3 h-3" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filtros */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Filtros</h2>
                {hayFiltrosActivos && (
                  <button onClick={limpiarFiltros} className="text-xs text-primary hover:text-primary/80">
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* Categorías */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide">Categorías</h3>
                <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                  <button
                    onClick={() => seleccionarCategoria('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !categoriaSeleccionada ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Todas las categorías
                  </button>
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => seleccionarCategoria(cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoriaSeleccionada === cat.slug
                          ? 'bg-primary text-white font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{cat.nombre}</span>
                      <span className={`text-xs ${categoriaSeleccionada === cat.slug ? 'text-white/70' : 'text-gray-400'}`}>
                        {cat.productos_count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide">Rango de Precio</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={aplicarFiltros}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Aplicar precio
                  </button>
                  {(precioMin || precioMax) && (
                    <button
                      onClick={() => { setPrecioMin(''); setPrecioMax(''); aplicarFiltros(); }}
                      className="w-full text-xs text-gray-400 hover:text-gray-600"
                    >
                      Quitar filtro de precio
                    </button>
                  )}
                </div>
              </div>

              {/* Ofertas */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-red-500" />
                  Ofertas
                </h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={toggleEnOferta}
                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
                      soloEnOferta ? 'bg-red-500' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      soloEnOferta ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-dark transition-colors">
                    Solo en oferta
                  </span>
                </label>
              </div>

              {/* Disponibilidad */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wide">Disponibilidad</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={toggleDisponible}
                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
                      soloDisponible ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      soloDisponible ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-dark transition-colors">
                    Solo disponibles
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Botón filtros móvil */}
          <button
            onClick={() => {}}
            className="lg:hidden fixed bottom-6 left-6 z-40 bg-dark text-white p-4 rounded-full shadow-lg"
          >
            <Filter className="w-6 h-6" />
          </button>

          {/* Grilla de productos */}
          <div className="flex-1 min-w-0">
            {/* Barra de ordenamiento */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-xl shadow-sm px-4 py-2.5 flex-wrap gap-2">
              <p className="text-sm text-gray-500 shrink-0">{pagination.total} productos</p>
              <div className="flex items-center gap-2 flex-wrap">
                <SortAsc className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 hidden sm:inline">Ordenar:</span>
                <div className="flex gap-1 flex-wrap">
                  {[
                    { value: 'recientes',      label: 'Recientes' },
                    { value: 'mas_vendidos',   label: 'Más vendidos' },
                    { value: 'descuento_desc', label: 'Mayor descuento' },
                    { value: 'precio_asc',     label: 'Menor precio' },
                    { value: 'precio_desc',    label: 'Mayor precio' },
                  ].map((op) => (
                    <button
                      key={op.value}
                      onClick={() => cambiarOrden(op.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        ordenar === op.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chips de filtros activos */}
            {(precioMin || precioMax || soloDisponible || soloEnOferta) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {(precioMin || precioMax) && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                    Precio: {precioMin ? `$${Number(precioMin).toLocaleString('es-CO')}` : '0'}
                    {' – '}
                    {precioMax ? `$${Number(precioMax).toLocaleString('es-CO')}` : '∞'}
                    <button onClick={() => { setPrecioMin(''); setPrecioMax(''); aplicarFiltros(); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {soloEnOferta && (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    Solo en oferta
                    <button onClick={toggleEnOferta}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {soloDisponible && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    Solo disponibles
                    <button onClick={toggleDisponible}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {initialProductos.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                <p className="text-gray-500 text-lg font-medium">No se encontraron productos</p>
                <p className="text-gray-400 text-sm mt-1">Prueba con otros filtros o categoría</p>
                <button
                  onClick={limpiarFiltros}
                  className="mt-5 bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {initialProductos.map((producto) => (
                    <ProductCard
                      key={producto.id}
                      producto={producto}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Paginación */}
                {pagination.last_page > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => cambiarPagina(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>

                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      const start = Math.max(1, pagination.current_page - 2);
                      const pageNum = start + i;
                      if (pageNum > pagination.last_page) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => cambiarPagina(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm ${
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
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
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
  const imagenUrl = getImageUrl(producto.imagenes[0]) ?? PLACEHOLDER_IMG;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
      <Link href={`/producto/${producto.slug}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={imagenUrl}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
          />
          {producto.en_oferta && producto.descuento_porcentaje > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              -{producto.descuento_porcentaje}%
            </div>
          )}
          {!producto.disponible && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">Agotado</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {producto.categoria && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{producto.categoria}</p>
        )}
        <Link href={`/producto/${producto.slug}`}>
          <h3 className="font-semibold text-dark mb-2 line-clamp-2 hover:text-primary transition-colors text-sm leading-snug">
            {producto.nombre}
          </h3>
        </Link>
        <div className="mt-auto">
          {producto.en_oferta && producto.precio_oferta != null ? (
            <div className="mb-3">
              <span className="text-gray-400 line-through text-sm">{formatCOP(producto.precio_venta)}</span>
              <p className="text-2xl font-bold text-red-500">{formatCOP(producto.precio_oferta)}</p>
            </div>
          ) : (
            <div className="mb-3">
              <p className="text-2xl font-bold text-primary">{formatCOP(producto.precio_venta)}</p>
            </div>
          )}
          <p className="text-xs text-gray-400 mb-3">Cód: {producto.codigo}</p>
          {producto.disponible ? (
            <button
              onClick={() => onAddToCart(producto)}
              className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors font-semibold text-sm"
            >
              Agregar al carrito
            </button>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-400 py-2 rounded-lg font-semibold text-sm cursor-not-allowed">
              Sin stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
