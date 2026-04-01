import Link from 'next/link';
import { Categoria } from '@/lib/api';
import {
  Wrench,
  Zap,
  Shield,
  Cog,
  Gauge,
  Fuel,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  motor: Cog,
  frenos: Shield,
  electrico: Zap,
  suspension: Gauge,
  combustible: Fuel,
  herramientas: Wrench,
};

interface CategoriesSectionProps {
  categorias: Categoria[];
}

export function CategoriesSection({ categorias }: CategoriesSectionProps) {
  const categoriasDestacadas = categorias.slice(0, 6);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Categorías Destacadas
          </h2>
          <p className="text-gray-600 text-lg">
            Encuentra lo que necesitas para tu moto
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriasDestacadas.map((categoria, index) => {
            const Icon = iconMap[categoria.slug] || Wrench;
            
            return (
              <Link
                key={categoria.id}
                href={`/catalogo/${categoria.slug}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-xl p-6 text-center hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-dark group-hover:text-white transition-colors mb-1">
                    {categoria.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors">
                    {categoria.productos_count} productos
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Ver todas las categorías
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
