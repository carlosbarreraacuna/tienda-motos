import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Truck, Wrench, Star, Users, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Moto Spa',
  description: 'Conoce la historia, misión y valores de Moto Spa, tu tienda de confianza de repuestos y accesorios para motos en Colombia.',
};

const VALORES = [
  {
    icon: Shield,
    titulo: 'Calidad garantizada',
    desc: 'Trabajamos solo con proveedores certificados. Todos nuestros productos pasan controles de calidad antes de llegar a tus manos.',
  },
  {
    icon: Truck,
    titulo: 'Envíos a todo Colombia',
    desc: 'Despachamos a cualquier ciudad y municipio del país. Envío gratis en compras superiores a $150.000.',
  },
  {
    icon: Wrench,
    titulo: 'Asesoría técnica',
    desc: 'Nuestro equipo de expertos te ayuda a encontrar el repuesto exacto que necesita tu moto.',
  },
  {
    icon: Star,
    titulo: 'Mejores precios',
    desc: 'Compramos directamente a fabricantes y distribuidores para ofrecerte los precios más competitivos del mercado.',
  },
  {
    icon: Users,
    titulo: 'Atención personalizada',
    desc: 'Cada cliente es importante. Te acompañamos desde que buscas el repuesto hasta que llega a tu puerta.',
  },
  {
    icon: Clock,
    titulo: 'Respuesta rápida',
    desc: 'Respondemos consultas en menos de 2 horas por WhatsApp en horario laboral. Tu tiempo es valioso.',
  },
];

const STATS = [
  { valor: '10+', label: 'Años de experiencia' },
  { valor: '5.000+', label: 'Productos disponibles' },
  { valor: '20.000+', label: 'Clientes satisfechos' },
  { valor: '4.8★', label: 'Calificación promedio' },
];

export default function SobreNosotrosPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-dark to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Nuestra historia</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
              Más de 10 años llevando repuestos de calidad a los motociclistas colombianos
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Moto Spa nació de la pasión por las motos y la necesidad de contar con repuestos confiables a precios justos.
              Hoy somos una de las tiendas de repuestos más completas del país, con presencia física y en línea.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold">{stat.valor}</p>
                <p className="text-white/80 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-3">Nuestra Misión</h2>
            <p className="text-gray-600 leading-relaxed">
              Proveer a los motociclistas colombianos de repuestos y accesorios de alta calidad, con precios competitivos,
              atención personalizada y entregas rápidas a todo el país. Queremos ser el aliado confiable de cada motociclista
              en el mantenimiento y mejora de su vehículo.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-3">Nuestra Visión</h2>
            <p className="text-gray-600 leading-relaxed">
              Ser reconocidos como la tienda de repuestos para motos más confiable e innovadora de Colombia,
              integrando tecnología y servicio de excelencia para ofrecer la mejor experiencia de compra,
              tanto en nuestra tienda física como en nuestra plataforma digital.
            </p>
          </div>
        </div>

        {/* Por qué elegirnos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-dark mb-2 text-center">¿Por qué elegirnos?</h2>
          <p className="text-gray-500 text-center mb-8">Nuestros valores nos diferencian</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALORES.map((v) => (
              <div key={v.titulo} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-dark mb-2">{v.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-dark mb-3">Nuestro compromiso</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Cada miembro del equipo de Moto Spa comparte la misma pasión: ayudarte a mantener tu moto en perfecto estado.
            Contamos con técnicos especializados, asesores comerciales y un equipo de logística dedicado a garantizar que
            tu pedido llegue en tiempo y forma.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-dark mb-3">¿Listo para encontrar lo que necesitas?</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/catalogo"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Ver catálogo
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
