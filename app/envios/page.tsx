import { Metadata } from 'next';
import { Truck, Clock, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Información de Envíos | Moto Spa',
  description: 'Conoce nuestras tarifas, tiempos y condiciones de envío a todo Colombia. Envío gratis en compras superiores a $150.000.',
};

const ZONAS = [
  { zona: 'Ciudades principales', ciudades: 'Bogotá, Medellín, Cali, Barranquilla, Bucaramanga', tiempo: '2–3 días hábiles', costo: 'Gratis en compras +$150.000 / Desde $12.000' },
  { zona: 'Ciudades intermedias', ciudades: 'Pereira, Manizales, Armenia, Ibagué, Villavicencio', tiempo: '3–5 días hábiles', costo: 'Desde $15.000' },
  { zona: 'Municipios y zonas rurales', ciudades: 'Todo el territorio nacional', tiempo: '5–8 días hábiles', costo: 'Desde $18.000' },
];

export default function EnviosPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest">Logística</p>
          </div>
          <h1 className="text-4xl font-extrabold text-dark mb-3">Información de Envíos</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Enviamos a todo Colombia. Conoce nuestras tarifas, tiempos de entrega y cómo rastrear tu pedido.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Envío gratis banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-6 mb-8 flex items-center gap-4">
          <Truck className="w-12 h-12 flex-shrink-0 opacity-90" />
          <div>
            <h2 className="text-2xl font-bold mb-1">Envío GRATIS</h2>
            <p className="text-white/85">
              En compras superiores a <strong>$150.000 COP</strong> a ciudades principales de Colombia.
            </p>
          </div>
        </div>

        {/* Zonas y tiempos */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">Zonas de envío y tarifas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 font-semibold text-gray-700">Zona</th>
                  <th className="text-left py-3 pr-4 font-semibold text-gray-700">Ciudades</th>
                  <th className="text-left py-3 pr-4 font-semibold text-gray-700">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> Tiempo</div>
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-700">Costo</th>
                </tr>
              </thead>
              <tbody>
                {ZONAS.map((zona, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="py-4 pr-4 font-medium text-dark">{zona.zona}</td>
                    <td className="py-4 pr-4 text-gray-500">{zona.ciudades}</td>
                    <td className="py-4 pr-4 text-gray-700">{zona.tiempo}</td>
                    <td className="py-4 text-gray-700">{zona.costo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * Los tiempos son aproximados en días hábiles. Pueden variar por condiciones climáticas, paros o situaciones de fuerza mayor.
          </p>
        </div>

        {/* Proceso de envío */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">¿Cómo funciona el proceso?</h2>
          <div className="space-y-5">
            {[
              { icon: Package, titulo: 'Pedido confirmado', desc: 'Recibirás un correo y WhatsApp con la confirmación de tu orden apenas se procese el pago.' },
              { icon: Clock, titulo: 'Preparación (1 día hábil)', desc: 'Empacamos y alistamos tu pedido con cuidado. Verificamos el estado de cada producto antes del despacho.' },
              { icon: Truck, titulo: 'Despacho y guía', desc: 'Entregamos el paquete a la transportadora y te enviamos el número de guía para rastreo en tiempo real.' },
              { icon: MapPin, titulo: 'Entrega', desc: 'La transportadora entrega en la dirección indicada. Si no estás en casa, intentarán 2 veces adicionales o dejarán aviso.' },
            ].map((step) => (
              <div key={step.titulo} className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-1">{step.titulo}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Condiciones */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-5">Condiciones importantes</h2>
          <div className="space-y-3">
            {[
              'El envío se calcula sobre el peso volumétrico del paquete.',
              'Los pedidos realizados antes de las 2:00 PM se despachan el mismo día hábil.',
              'Pedidos realizados después de las 2:00 PM o en fines de semana se despachan el siguiente día hábil.',
              'Para pedidos de gran volumen o peso, el costo se cotiza de manera especial.',
              'No realizamos envíos internacionales actualmente.',
              'Si la dirección es incorrecta, el reenvío tiene costo adicional.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Nota */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 mb-1">Al recibir tu pedido</p>
            <p className="text-amber-700 text-sm">
              Verifica el estado del empaque antes de firmar el recibo. Si el paquete tiene daños visibles, indícalo en el comprobante
              de la transportadora y contáctanos de inmediato para gestionar tu reclamo.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-dark mb-2">¿Tienes preguntas sobre tu envío?</h3>
          <p className="text-gray-500 mb-5">Escríbenos y te responderemos en menos de 2 horas en horario laboral.</p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567'}?text=Hola!%20Tengo%20una%20pregunta%20sobre%20el%20env%C3%ADo%20de%20mi%20pedido`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
