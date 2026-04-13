'use client';

import { useState, useEffect } from 'react';
import { orderApi, CustomerOrder } from '@/lib/customerApi';
import { Package, ChevronRight, ShoppingBag, Store, Globe } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  paid:       'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export default function PedidosPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.list()
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-16 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="font-semibold text-gray-700 mb-1">Aún no tienes pedidos</p>
          <p className="text-sm text-gray-500 mb-6">Cuando realices una compra, aparecerá aquí.</p>
          <Link href="/catalogo"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusKey = order.status ?? 'pending';
            const statusLabel = order.status_label || statusKey;
            const statusColor = STATUS_COLORS[statusKey] ?? 'bg-gray-100 text-gray-600';
            const itemCount = order.items_count ?? order.items?.length ?? 0;
            const date = new Date(order.created_at).toLocaleDateString('es-CO', {
              year: 'numeric', month: 'long', day: 'numeric'
            });

            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">
                          {order.order_number ? `Pedido ${order.order_number}` : `Pedido #${order.id}`}
                        </p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
                          {statusLabel}
                        </span>
                        {order.source === 'pos' ? (
                          <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                            <Store className="w-3 h-3" /> Tienda física
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            <Globe className="w-3 h-3" /> Tienda online
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{date}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                      </p>
                      {order.tracking_number && (
                        <p className="text-xs text-blue-600 mt-0.5">
                          Guía: {order.tracking_number}
                          {order.shipping_company ? ` · ${order.shipping_company}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm">{fmt(order.total)}</p>
                    <Link href={`/cuenta/pedidos/${order.id}?type=${order.type ?? 'order'}`}
                      className="flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-2 justify-end">
                      Ver detalles <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      {order.items.slice(0, 3).map(i => i.product_name).join(', ')}
                      {order.items.length > 3 ? ` y ${order.items.length - 3} más` : ''}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
