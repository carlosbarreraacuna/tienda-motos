import { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Devoluciones | Moto Spa',
  description: 'Conoce nuestra política de devoluciones y cambios. En Moto Spa tu satisfacción es nuestra prioridad.',
};

export default function DevolucionesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest">Garantía y devoluciones</p>
          </div>
          <h1 className="text-4xl font-extrabold text-dark mb-3">Política de Devoluciones</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Tu satisfacción es nuestra prioridad. Si por algún motivo no estás conforme con tu compra, estamos aquí para ayudarte.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Plazo */}
        <div className="bg-primary text-white rounded-2xl p-6 mb-8 flex items-center gap-4">
          <Clock className="w-12 h-12 flex-shrink-0 opacity-80" />
          <div>
            <h2 className="text-xl font-bold mb-1">Tienes 15 días hábiles</h2>
            <p className="text-white/80">
              Para solicitar una devolución o cambio desde la fecha en que recibiste tu pedido.
            </p>
          </div>
        </div>

        {/* Qué acepta y qué no */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-bold text-dark">Casos que aceptamos</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Producto defectuoso o con falla de fabricación',
                'Producto diferente al pedido (error de envío)',
                'Producto llegó dañado durante el transporte',
                'Producto no compatible, consultado previamente con nuestro equipo',
                'Producto en estado original, sin uso y con empaque original',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-lg font-bold text-dark">Casos que NO aplican</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Producto ya instalado o con señales de uso',
                'Producto sin su empaque original',
                'Daños causados por instalación incorrecta',
                'Productos de consumo (aceites, lubricantes, filtros usados)',
                'Devoluciones después de 15 días hábiles',
                'Cambio de opinión sin defecto del producto',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Proceso */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-6">¿Cómo solicitar una devolución?</h2>
          <div className="space-y-6">
            {[
              {
                paso: '1',
                titulo: 'Contáctanos',
                desc: 'Comunícate con nosotros por WhatsApp o correo electrónico dentro de los 15 días hábiles. Indica tu número de orden y el motivo de la devolución.',
              },
              {
                paso: '2',
                titulo: 'Envía las evidencias',
                desc: 'Comparte fotos o videos del producto con el defecto o daño. Esto nos ayuda a procesar tu solicitud más rápido.',
              },
              {
                paso: '3',
                titulo: 'Aprobación',
                desc: 'Revisaremos tu caso en máximo 48 horas hábiles y te notificaremos si aplica la devolución o cambio.',
              },
              {
                paso: '4',
                titulo: 'Envío de devolución',
                desc: 'Si la devolución es aprobada, te daremos las instrucciones para enviar el producto. El costo de envío de retorno es cubierto por Moto Spa en casos de defectos o errores nuestros.',
              },
              {
                paso: '5',
                titulo: 'Reembolso o cambio',
                desc: 'Una vez recibamos y verifiquemos el producto, procesamos el reembolso en máximo 5 días hábiles o enviamos el cambio según tu preferencia.',
              },
            ].map((step) => (
              <div key={step.paso} className="flex gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
                  {step.paso}
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-1">{step.titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 mb-1">Nota importante</p>
            <p className="text-amber-700 text-sm">
              Para garantías y cambios, conserva siempre el empaque original del producto y el comprobante de compra (número de orden).
              Sin estos, no podremos procesar tu solicitud.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-dark mb-2">¿Necesitas iniciar una devolución?</h3>
          <p className="text-gray-500 mb-5">Contáctanos directamente, estamos listos para ayudarte.</p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567'}?text=Hola!%20Quiero%20iniciar%20una%20devoluci%C3%B3n`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Iniciar devolución por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
