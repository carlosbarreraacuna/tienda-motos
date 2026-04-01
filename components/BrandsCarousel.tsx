'use client';

import React from 'react';

export function BrandsCarousel() {
  // Marcas de motos y aceites/repuestos colombianas e internacionales
  const brands = [
    { name: 'Mobil', logo: '/brands/mobil.png' },
    { name: 'Motul', logo: '/brands/motul.png' },
    { name: 'Castrol', logo: '/brands/castrol.png' },
    { name: 'Shell', logo: '/brands/shell.png' },
    { name: 'Yamalube', logo: '/brands/yamalube.png' },
    { name: 'Honda', logo: '/brands/honda.png' },
    { name: 'Yamaha', logo: '/brands/yamaha.png' },
    { name: 'Suzuki', logo: '/brands/suzuki.png' },
    { name: 'Kawasaki', logo: '/brands/kawasaki.png' },
    { name: 'Bajaj', logo: '/brands/bajaj.png' },
    { name: 'TVS', logo: '/brands/tvs.png' },
    { name: 'AKT', logo: '/brands/akt.png' },
    { name: 'Auteco', logo: '/brands/auteco.png' },
    { name: 'Havoline', logo: '/brands/havoline.png' },
    { name: 'Valvoline', logo: '/brands/valvoline.png' },
  ];

  // Duplicar las marcas para el efecto infinito
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-2">
          Marcas de Confianza
        </h2>
        <p className="text-gray-600">
          Trabajamos con las mejores marcas del mercado
        </p>
      </div>

      <div className="relative">
        {/* Gradient overlays para efecto fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        {/* Carrusel */}
        <div 
          className="flex hover:pause-animation"
          style={{
            animation: 'scroll 30s linear infinite',
          }}
        >
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 mx-8 w-32 h-20 flex items-center justify-center hover:brightness-0 transition-all duration-300"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Fallback si la imagen no carga
                  e.currentTarget.src = `https://via.placeholder.com/150x80/e5e7eb/6b7280?text=${brand.name}`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
