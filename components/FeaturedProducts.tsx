import Link from 'next/link';
import { Producto, formatCOP, getImageUrl, PLACEHOLDER_IMG } from '@/lib/api';
import { ShoppingCart } from 'lucide-react';

interface FeaturedProductsProps {
  productos: Producto[];
}

export function FeaturedProducts({ productos }: FeaturedProductsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Productos Destacados
          </h2>
          <p className="text-gray-600 text-lg">
            Los repuestos más populares para tu moto
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ producto }: { producto: Producto }) {
  const imagenUrl = getImageUrl(producto.imagenes[0]) ?? PLACEHOLDER_IMG;

  return (
    <Link href={`/producto/${producto.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
          <img
            src={imagenUrl}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

        {/* Content */}
        <div className="p-4">
          {producto.categoria && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {producto.categoria}
            </p>
          )}
          <h3 className="font-semibold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {producto.nombre}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatCOP(producto.precio_venta)}
              </p>
              <p className="text-xs text-gray-500">
                Código: {producto.codigo}
              </p>
            </div>
            {producto.disponible && (
              <button className="p-2 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
