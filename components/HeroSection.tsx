import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-dark text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/80 z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920')",
        }}
      />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Repuestos de Calidad
            <br />
            <span className="text-primary">Para Tu Moto</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Encuentra todo lo que necesitas para mantener tu moto en perfecto estado.
            Envíos a toda Colombia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors group"
            >
              Ver Catálogo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/ofertas"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-dark font-semibold rounded-lg transition-colors"
            >
              Ver Ofertas
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-20" />
    </section>
  );
}
