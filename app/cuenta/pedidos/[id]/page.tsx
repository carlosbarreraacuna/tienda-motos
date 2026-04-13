'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { orderApi, CustomerOrder } from '@/lib/customerApi';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle2, Clock, Circle, Store, Globe } from 'lucide-react';
import Link from 'next/link';

const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const ALL_STEPS = [
  { key: 'pending',    label: 'Pedido confirmado', icon: Clock },
  { key: 'paid',       label: 'Pago aprobado',      icon: CreditCard },
  { key: 'processing', label: 'Pedido preparado',   icon: Package },
  { key: 'shipped',    label: 'Enviando',            icon: Truck },
  { key: 'delivered',  label: 'Entregado',           icon: CheckCircle2 },
];

const STATUS_LABELS: Record<string, string> = {
  pending:    'Pendiente',
  paid:       'Pago aprobado',
  processing: 'En preparación',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') ?? 'order') as 'order' | 'sale';
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi.detail(Number(id), type)
      .then(r => setOrder(r.data))
      .catch(() => setError('No se pudo cargar el pedido.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="py-16 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
    </div>
  );

  if (error || !order) return (
    <div className="py-16 text-center">
      <p className="text-gray-500">{error || 'Pedido no encontrado.'}</p>
      <Link href="/cuenta/pedidos" className="mt-4 inline-block text-sm text-primary hover:underline">← Volver a pedidos</Link>
    </div>
  );

  const statusKey = order.status ?? 'pending';
  const isCancelled = statusKey === 'cancelled';
  const currentStepIndex = ALL_STEPS.findIndex(s => s.key === statusKey);
  const date = new Date(order.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/cuenta/pedidos" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Mis pedidos
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {order.order_number ? `Pedido ${order.order_number}` : `Pedido #${order.id}`}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">{date}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isCancelled ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'
            }`}>
              {order.status_label || STATUS_LABELS[statusKey] || statusKey}
            </span>
            {order.source === 'pos' ? (
              <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                <Store className="w-3 h-3" /> Tienda física
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                <Globe className="w-3 h-3" /> Tienda online
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status steps */}
      {!isCancelled && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-6 text-sm">Estado del pedido</h2>
          <div className="flex items-start justify-between relative">
            {/* Background line */}
            <div className="absolute top-4 h-0.5 bg-gray-200 z-0" style={{ left: '10%', right: '10%' }} />
            {/* Progress line */}
            <div
              className="absolute top-4 h-0.5 bg-primary z-0 transition-all duration-500"
              style={{
                left: '10%',
                width: currentStepIndex > 0
                  ? `${(currentStepIndex / (ALL_STEPS.length - 1)) * 80}%`
                  : '0%'
              }}
            />

            {ALL_STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center z-10 w-1/5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    done ? 'bg-primary text-white' : 'bg-white border-2 border-gray-200 text-gray-300'
                  }`}>
                    {done ? <Icon className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  <p className={`text-xs mt-2 text-center leading-tight ${done ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Tracking info */}
          {order.tracking_number && (
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
              <Truck className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Número de guía</p>
                <p className="text-sm font-semibold text-gray-800">
                  {order.tracking_number}
                  {order.shipping_company && <span className="font-normal text-gray-500"> · {order.shipping_company}</span>}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Productos ({order.items?.length ?? order.items_count ?? 0})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.product_name}</p>
                  {item.product_sku && <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>}
                  <p className="text-xs text-gray-500 mt-0.5">Cant: {item.quantity} × {fmt(item.price)}</p>
                </div>
                <p className="font-semibold text-gray-900 text-sm flex-shrink-0">{fmt(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Address */}
        <div className="space-y-4">
          {/* Order summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-800">{fmt(order.subtotal)}</span>
              </div>
              {order.shipping_cost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Envío</span>
                  <span className="text-gray-800">{fmt(order.shipping_cost)}</span>
                </div>
              )}
              {order.payment_method && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Pago</span>
                  <span className="text-gray-800 capitalize">{order.payment_method}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>{fmt(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <h2 className="font-semibold text-gray-800 text-sm">Dirección de envío</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.shipping_address}
                {(order.shipping_city || order.shipping_state) && (
                  <><br />{[order.shipping_city, order.shipping_state].filter(Boolean).join(', ')}</>
                )}
              </p>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-800 text-sm mb-2">Notas</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
