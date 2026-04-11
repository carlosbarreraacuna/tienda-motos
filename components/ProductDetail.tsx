'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Producto, formatCOP, generateWhatsAppLink, api, getImageUrl, PLACEHOLDER_IMG } from '@/lib/api';
import { useCart } from '@/lib/cart';
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

interface ProductDetailProps {
  producto: Producto;
}

export function ProductDetail({ producto }: ProductDetailProps) {
  const [imagenActual, setImagenActual] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [stock, setStock] = useState(producto.stock);
  const [disponible, setDisponible] = useState(producto.disponible);
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const { addItem, openCart } = useCart();

  const imagenesRaw = producto.imagenes.length > 0 ? producto.imagenes : [];
  const imagenes = imagenesRaw.map((img) => getImageUrl(img) ?? PLACEHOLDER_IMG);
  const imagenesDisplay = imagenes.length > 0 ? imagenes : [PLACEHOLDER_IMG];

  // Polling de stock cada 30 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const stockResponse = await api.getStock(producto.codigo);
        if (stockResponse.success) {
          setStock(stockResponse.stock);
          setDisponible(stockResponse.disponible);
        }
      } catch (error) {
        console.error('Error al actualizar stock:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [producto.codigo]);

  const handleAddToCart = () => {
    addItem(producto, cantidad);
    openCart();
  };

  const handleGenerarImagen = async () => {
    setGenerandoImagen(true);
    // TODO: Implementar generación con Replicate
    setTimeout(() => {
      setGenerandoImagen(false);
      alert('Funcionalidad de IA en desarrollo');
    }, 2000);
  };

  const siguienteImagen = () => {
    setImagenActual((prev) => (prev + 1) % imagenes.length);
  };

  const anteriorImagen = () => {
    setImagenActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/catalogo" className="hover:text-primary">Catálogo</Link></li>
            {producto.categoria && (
              <>
                <li>/</li>
                <li><Link href={`/catalogo/${producto.categoria_slug}`} className="hover:text-primary">{producto.categoria}</Link></li>
              </>
            )}
            <li>/</li>
            <li className="text-dark font-semibold truncate">{producto.nombre}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Galería de Imágenes */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-4">
              <div className="relative aspect-square">
                <img
                  src={imagenesDisplay[imagenActual]}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
                {imagenesDisplay.length > 1 && (
                  <>
                    <button
                      onClick={anteriorImagen}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={siguienteImagen}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Miniaturas */}
            {imagenesDisplay.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {imagenesDisplay.map((imagen, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenActual(index)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden ${
                      imagenActual === index ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imagen}
                      alt={`${producto.nombre} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Generar imagen con IA */}
            {producto.imagenes.length === 0 && (
              <button
                onClick={handleGenerarImagen}
                disabled={generandoImagen}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>{generandoImagen ? 'Generando...' : 'Generar Imagen con IA'}</span>
              </button>
            )}
          </div>

          {/* Información del Producto */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {producto.categoria && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {producto.categoria}
                </p>
              )}
              <h1 className="text-3xl font-bold text-dark mb-4">{producto.nombre}</h1>
              
              <div className="flex items-baseline gap-4 mb-6">
                <p className="text-4xl font-bold text-primary">
                  {formatCOP(producto.precio_venta)}
                </p>
                <p className="text-sm text-gray-500">Código: {producto.codigo}</p>
              </div>

              {/* Stock */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Disponibilidad:</span>
                  {disponible ? (
                    <span className="text-green-600 font-semibold flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      {stock} unidades disponibles
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">Agotado</span>
                  )}
                </div>
              </div>

              {/* Cantidad */}
              {disponible && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Cantidad:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={cantidad}
                      onChange={(e) => setCantidad(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
                      className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                      max={stock}
                    />
                    <button
                      onClick={() => setCantidad(Math.min(stock, cantidad + 1))}
                      className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="space-y-3 mb-6">
                {disponible ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al Carrito</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Producto Agotado
                  </button>
                )}

                <a
                  href={generateWhatsAppLink(producto)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>

              {/* Características */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Envío Gratis</p>
                    <p className="text-xs text-gray-600">En compras superiores a $150.000</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Garantía</p>
                    <p className="text-xs text-gray-600">30 días de garantía en todos los productos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-line">{producto.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Productos Relacionados */}
        {producto.productos_relacionados && producto.productos_relacionados.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {producto.productos_relacionados.map((relacionado) => (
                <Link key={relacionado.id} href={`/producto/${relacionado.slug}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all">
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={getImageUrl(relacionado.imagenes[0]) ?? PLACEHOLDER_IMG}
                        alt={relacionado.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-dark mb-2 line-clamp-2 group-hover:text-primary">
                        {relacionado.nombre}
                      </h3>
                      <p className="text-xl font-bold text-primary">
                        {formatCOP(relacionado.precio_venta)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
