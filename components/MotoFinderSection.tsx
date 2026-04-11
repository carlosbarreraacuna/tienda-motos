'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Search, Bike } from 'lucide-react';

const MOTOS: Record<string, { label: string; modelos: string[] }> = {
  AKT: {
    label: 'AKT',
    modelos: ['AK 110', 'AK 125', 'AK 150', 'NK 125', 'NKD 125', 'SL 110', 'TTR 110', 'TT 125', 'AKT 200'],
  },
  BAJAJ: {
    label: 'Bajaj',
    modelos: [
      'Boxer 100', 'Boxer 150', 'Platina 100', 'Pulsar 135', 'Pulsar 150',
      'Pulsar 180', 'Pulsar 200', 'Pulsar 220', 'Discover 100', 'Discover 125', 'Discover 135',
    ],
  },
  HONDA: {
    label: 'Honda',
    modelos: [
      'CB 110', 'CB 150', 'CBF 125', 'CBF 150', 'CBZ 160',
      'NXG 100', 'XR 150', 'Wave 110', 'ECO Deluxe', 'Titan 150',
    ],
  },
  YAMAHA: {
    label: 'Yamaha',
    modelos: [
      'YBR 125', 'FZ 150', 'FZ 250', 'XT 225', 'BWS 100',
      'DT 125', 'DT 175', 'DT 200', 'Crypton 110', 'Crypton 115', 'Next 115',
    ],
  },
  SUZUKI: {
    label: 'Suzuki',
    modelos: [
      'GN 125', 'GS 125', 'GP 125', 'EN 125', 'TS 125',
      'TR 125', 'X-GS 125', 'CN 125', 'GN 125H',
    ],
  },
  KTM: {
    label: 'KTM',
    modelos: ['Duke 200', 'Duke 250', 'Duke 390', 'RC 200', 'RC 390'],
  },
  TVS: {
    label: 'TVS',
    modelos: ['Apache 150', 'Apache 160', 'Apache 200', 'Star City 110', 'Metro 110'],
  },
  HERO: {
    label: 'Hero',
    modelos: ['Splendor 100', 'Passion 110', 'Glamour 125', 'Hunk 150', 'Ignitor 125'],
  },
};

const MARCA_COLORS: Record<string, string> = {
  AKT:    'bg-red-50   border-red-200   text-red-700   hover:bg-red-100',
  BAJAJ:  'bg-blue-50  border-blue-200  text-blue-700  hover:bg-blue-100',
  HONDA:  'bg-red-50   border-red-200   text-red-700   hover:bg-red-100',
  YAMAHA: 'bg-sky-50   border-sky-200   text-sky-700   hover:bg-sky-100',
  SUZUKI: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
  KTM:    'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
  TVS:    'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
  HERO:   'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
};

export default function MotoFinderSection() {
  const router = useRouter();
  const [marcaActiva, setMarcaActiva] = useState<string | null>(null);
  const [modeloActivo, setModeloActivo] = useState<string | null>(null);

  const seleccionarMarca = (marca: string) => {
    setMarcaActiva(prev => prev === marca ? null : marca);
    setModeloActivo(null);
  };

  const buscarPorModelo = (modelo: string) => {
    setModeloActivo(modelo);
    router.push(`/catalogo?modelo=${encodeURIComponent(modelo)}`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Lado izquierdo ── */}
          <div className="relative">
            {/* Decoración */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
                <Bike className="w-4 h-4" />
                Encuentra tus repuestos
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
                Descubre los repuestos
                <span className="text-primary block">para tu moto</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Selecciona tu marca y modelo y te mostramos exactamente los repuestos disponibles
                y compatibles con tu moto.
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                {['✓ Stock en tiempo real', '✓ Repuestos originales', '✓ Envío a toda Colombia'].map(t => (
                  <span key={t} className="bg-white/10 px-3 py-1.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Lado derecho ── */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Search className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">¿Qué moto tienes?</h3>
            </div>

            {/* Marcas */}
            <p className="text-gray-400 text-sm mb-3 font-medium uppercase tracking-wide">1. Selecciona la marca</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {Object.entries(MOTOS).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => seleccionarMarca(key)}
                  className={`border rounded-xl py-2.5 text-sm font-bold transition-all ${
                    marcaActiva === key
                      ? 'bg-primary border-primary text-white shadow-lg scale-105'
                      : 'border-white/20 text-gray-300 hover:border-primary/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Modelos */}
            {marcaActiva ? (
              <div>
                <p className="text-gray-400 text-sm mb-3 font-medium uppercase tracking-wide">
                  2. Selecciona el modelo de {MOTOS[marcaActiva].label}
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {MOTOS[marcaActiva].modelos.map((modelo) => (
                    <button
                      key={modelo}
                      onClick={() => buscarPorModelo(modelo)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                        modeloActivo === modelo
                          ? 'bg-primary border-primary text-white'
                          : 'border-white/20 text-gray-300 hover:border-primary/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{modelo}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-white/20 rounded-xl p-6 text-center text-gray-500">
                <Bike className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Selecciona una marca para ver los modelos disponibles</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
