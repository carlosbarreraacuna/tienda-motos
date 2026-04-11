import { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Moto Spa',
  description: 'Encuentra respuestas a las preguntas más comunes sobre compras, envíos, pagos y garantías en Moto Spa.',
};

const FAQS = [
  {
    categoria: 'Compras y Pagos',
    preguntas: [
      {
        q: '¿Cómo puedo realizar mi pedido?',
        a: 'Puedes realizar tu pedido directamente desde nuestra tienda en línea. Selecciona los productos que deseas, agrégalos al carrito, y completa el proceso de pago con tus datos de envío y método de pago preferido.',
      },
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Aceptamos pagos con tarjeta crédito/débito a través de Wompi, transferencias bancarias y pago en efectivo en nuestra tienda física. Para pagos en línea, el proceso es seguro y encriptado.',
      },
      {
        q: '¿Es seguro comprar en línea en Moto Spa?',
        a: 'Sí, totalmente. Usamos protocolos de seguridad SSL y procesamos los pagos a través de Wompi, pasarela de pagos certificada en Colombia. Tu información financiera nunca es almacenada en nuestros servidores.',
      },
      {
        q: '¿Puedo cancelar mi pedido después de realizarlo?',
        a: 'Puedes cancelar tu pedido antes de que sea despachado. Una vez enviado, deberás esperar recibirlo y gestionar una devolución. Contáctanos lo antes posible a través de WhatsApp o correo electrónico.',
      },
    ],
  },
  {
    categoria: 'Envíos y Entregas',
    preguntas: [
      {
        q: '¿A qué ciudades hacen envíos?',
        a: 'Realizamos envíos a todo el territorio colombiano a través de empresas de mensajería certificadas. Los tiempos de entrega varían según la ciudad de destino.',
      },
      {
        q: '¿Cuánto tiempo tarda el envío?',
        a: 'Los envíos a ciudades principales como Bogotá, Medellín, Cali y Barranquilla tardan de 2 a 3 días hábiles. Para municipios y zonas rurales, el tiempo puede ser de 4 a 7 días hábiles.',
      },
      {
        q: '¿Cuánto cuesta el envío?',
        a: 'El costo de envío se calcula según el destino y el peso del paquete. Los envíos son GRATIS para compras superiores a $150.000 COP a ciudades principales.',
      },
      {
        q: '¿Cómo puedo rastrear mi pedido?',
        a: 'Una vez despachado tu pedido, recibirás un número de guía por correo electrónico o WhatsApp para que puedas rastrear tu envío en tiempo real en la página de la transportadora.',
      },
    ],
  },
  {
    categoria: 'Productos y Garantías',
    preguntas: [
      {
        q: '¿Los productos tienen garantía?',
        a: 'Sí, todos nuestros productos tienen garantía de 30 días contra defectos de fabricación. La garantía cubre defectos del producto y no aplica para daños causados por mal uso.',
      },
      {
        q: '¿Cómo sé si un repuesto es compatible con mi moto?',
        a: 'En la página de cada producto encontrarás la sección "Modelos Compatibles". Si tienes dudas, puedes consultarnos por WhatsApp con la referencia de tu moto y te ayudamos a encontrar el repuesto correcto.',
      },
      {
        q: '¿Los productos son originales?',
        a: 'Trabajamos con proveedores certificados y ofrecemos tanto repuestos originales como alternativas de alta calidad. Cada producto indica claramente su marca y procedencia.',
      },
      {
        q: '¿Tienen stock disponible de los productos que muestran?',
        a: 'Sí, el stock mostrado en el sitio web es actualizado en tiempo real. Solo podrás agregar al carrito los productos con disponibilidad confirmada.',
      },
    ],
  },
  {
    categoria: 'Devoluciones y Cambios',
    preguntas: [
      {
        q: '¿Puedo devolver un producto?',
        a: 'Sí. Aceptamos devoluciones dentro de los 15 días calendario después de recibir el producto, siempre que esté en su estado original, sin uso y con empaque original. Consulta nuestra política de devoluciones para más detalles.',
      },
      {
        q: '¿Qué hago si recibo un producto defectuoso?',
        a: 'Comunícate con nosotros inmediatamente por WhatsApp o correo electrónico con fotos del producto. Gestionaremos el cambio o reembolso sin ningún costo adicional para ti.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Ayuda</p>
            <h1 className="text-4xl font-extrabold text-dark mb-3">Preguntas Frecuentes</h1>
            <p className="text-gray-500 text-lg">
              ¿Tienes dudas? Aquí encontrarás respuestas a las preguntas más comunes de nuestros clientes.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {FAQS.map((seccion) => (
          <div key={seccion.categoria} className="mb-10">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block"></span>
              {seccion.categoria}
            </h2>
            <div className="space-y-3">
              {seccion.preguntas.map((item, i) => (
                <details
                  key={i}
                  className="bg-white rounded-xl shadow-sm group overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-dark pr-4">{item.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center mt-8">
          <h3 className="text-xl font-bold text-dark mb-2">¿No encontraste lo que buscabas?</h3>
          <p className="text-gray-500 mb-5">Nuestro equipo de soporte está listo para ayudarte.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href="/catalogo"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
