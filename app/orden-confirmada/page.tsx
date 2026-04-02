'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, Clock, AlertCircle } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface OrderItem {
  producto_nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

interface OrderData {
  numero_orden: string;
  fecha: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_direccion: string;
  cliente_ciudad: string;
  cliente_departamento: string;
  subtotal: number;
  envio: number;
  total: number;
  estado: string;
  estado_pago: string;
  metodo_pago: string;
  cupon_codigo?: string;
  cupon_descuento?: number;
  items: OrderItem[];
}

function OrdenConfirmadaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const orderId = searchParams.get('id');
    const transactionId = searchParams.get('transaction') || searchParams.get('id');
    
    if (!orderId || !transactionId) {
      setError('No se proporcionó un ID de orden válido');
      setLoading(false);
      return;
    }

    verifyOrder(orderId, transactionId);
  }, [searchParams]);

  const verifyOrder = async (orderId: string, transactionId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/tienda/wompi/verify-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: orderId,
            transaction_id: transactionId,
          }),
        }
      );

      const data = await response.json();

      if (data.success && data.data.order) {
        setOrder(data.data.order);
      } else {
        setError(data.message || 'No se pudo verificar la orden');
      }
    } catch (err) {
      console.error('Error verificando orden:', err);
      setError('Error al verificar la orden. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando tu orden...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/catalogo')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header de confirmación */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Orden Confirmada!
          </h1>
          <p className="text-gray-600 mb-4">
            Gracias por tu compra, {order.cliente_nombre}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Número de Orden</p>
            <p className="text-2xl font-bold text-primary">{order.numero_orden}</p>
          </div>
        </div>

        {/* Estado del pedido */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estado del Pedido</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                order.estado_pago === 'pagado' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  order.estado_pago === 'pagado' ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <p className="text-sm font-medium">Pago Confirmado</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-2 flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium">Preparando</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-2 flex items-center justify-center">
                <Truck className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium">En Camino</p>
            </div>
          </div>
        </div>

        {/* Detalles de la orden */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles de la Orden</h2>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.producto_nombre}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCOP(item.subtotal)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCOP(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío:</span>
              <span className="font-medium">{formatCOP(order.envio)}</span>
            </div>
            {order.cupon_descuento && order.cupon_descuento > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento ({order.cupon_codigo}):</span>
                <span className="font-medium">-{formatCOP(order.cupon_descuento)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-primary">{formatCOP(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Información de envío */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Envío</h2>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium text-gray-900">Nombre:</span> {order.cliente_nombre}</p>
            <p><span className="font-medium text-gray-900">Email:</span> {order.cliente_email}</p>
            <p><span className="font-medium text-gray-900">Teléfono:</span> {order.cliente_telefono}</p>
            <p><span className="font-medium text-gray-900">Dirección:</span> {order.cliente_direccion}</p>
            <p><span className="font-medium text-gray-900">Ciudad:</span> {order.cliente_ciudad}, {order.cliente_departamento}</p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <Clock className="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">¿Qué sigue?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Recibirás un email de confirmación en {order.cliente_email}</li>
                <li>• Te notificaremos cuando tu pedido sea enviado</li>
                <li>• El tiempo estimado de entrega es de 3-5 días hábiles</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/catalogo')}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Seguir Comprando
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Imprimir Orden
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdenConfirmadaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando orden...</p>
        </div>
      </div>
    }>
      <OrdenConfirmadaContent />
    </Suspense>
  );
}
