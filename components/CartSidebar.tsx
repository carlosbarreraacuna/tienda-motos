'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useCart, CartIssue } from '@/lib/cart';
import { api, formatCOP, getImageUrl, PLACEHOLDER_IMG } from '@/lib/api';
import { X, Minus, Plus, ShoppingBag, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const SYNC_INTERVAL_MS = 60_000; // Re-sync every 60 s while open

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal, updateProductData } = useCart();

  const [syncing, setSyncing] = useState(false);
  const [issues, setIssues] = useState<CartIssue[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncCart = useCallback(async () => {
    if (items.length === 0) return;
    setSyncing(true);

    const newIssues: CartIssue[] = [];

    await Promise.all(
      items.map(async (item) => {
        try {
          const res = await api.getProducto(item.producto.codigo);
          if (!res.success) return;
          const fresh = res.data;

          const oldPrice = item.producto.precio_venta;
          const newPrice = fresh.precio_venta;
          const newStock = fresh.stock;

          // Update stored product data (price, stock, disponible)
          updateProductData(item.producto.id, {
            precio_venta: newPrice,
            precio_oferta: fresh.precio_oferta,
            descuento_porcentaje: fresh.descuento_porcentaje,
            en_oferta: fresh.en_oferta,
            stock: newStock,
            disponible: fresh.disponible,
          });

          if (newStock === 0) {
            // Out of stock — remove automatically
            removeItem(item.producto.id);
            newIssues.push({ productoId: item.producto.id, type: 'out_of_stock' });
          } else if (item.cantidad > newStock) {
            // Reduce quantity to available stock
            updateQuantity(item.producto.id, newStock);
            newIssues.push({
              productoId: item.producto.id,
              type: 'stock_reduced',
              oldValue: item.cantidad,
              newValue: newStock,
            });
          }

          if (Math.abs(newPrice - oldPrice) > 0.5) {
            newIssues.push({
              productoId: item.producto.id,
              type: 'price_changed',
              oldValue: oldPrice,
              newValue: newPrice,
            });
          }
        } catch {
          // Ignore individual item errors — keep stale data
        }
      })
    );

    setIssues(newIssues);
    setSyncing(false);
  }, [items, updateProductData, updateQuantity, removeItem]);

  // Sync on open + set up interval
  useEffect(() => {
    if (!isOpen) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIssues([]);
      return;
    }

    syncCart();
    intervalRef.current = setInterval(syncCart, SYNC_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const issueMap = new Map(issues.map((i) => [i.productoId, i]));

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-dark flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Carrito ({items.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={syncCart}
              disabled={syncing}
              title="Actualizar precios y stock"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Issues banner */}
        {issues.length > 0 && (
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 space-y-1">
            {issues.map((issue) => {
              const name = items.find((i) => i.producto.id === issue.productoId)?.producto.nombre
                ?? `#${issue.productoId}`;
              if (issue.type === 'out_of_stock')
                return (
                  <p key={issue.productoId} className="text-xs text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <strong>{name}</strong> se quedó sin stock y fue eliminado.
                  </p>
                );
              if (issue.type === 'stock_reduced')
                return (
                  <p key={issue.productoId} className="text-xs text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <strong>{name}</strong>: cantidad reducida a {issue.newValue} (stock disponible).
                  </p>
                );
              if (issue.type === 'price_changed')
                return (
                  <p key={issue.productoId} className="text-xs text-amber-800 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 shrink-0" />
                    <strong>{name}</strong>: precio actualizado de{' '}
                    {formatCOP(issue.oldValue!)} a {formatCOP(issue.newValue!)}.
                  </p>
                );
              return null;
            })}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
              <button onClick={closeCart} className="text-primary hover:text-primary/80 font-semibold">
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const issue = issueMap.get(item.producto.id);
                const lowStock = item.producto.stock > 0 && item.producto.stock <= 3;
                return (
                  <div
                    key={item.producto.id}
                    className={`flex gap-4 border-b pb-4 ${issue ? 'opacity-90' : ''}`}
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.producto.imagenes[0]) ?? PLACEHOLDER_IMG}
                        alt={item.producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-dark truncate">{item.producto.nombre}</h3>
                      <p className="text-xs text-gray-500 mb-1">Código: {item.producto.codigo}</p>

                      {/* Price — show price_oferta if available */}
                      <div className="flex items-center gap-2">
                        <p className="text-primary font-bold text-sm">
                          {formatCOP(item.producto.precio_oferta ?? item.producto.precio_venta)}
                        </p>
                        {item.producto.precio_oferta && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatCOP(item.producto.precio_venta)}
                          </p>
                        )}
                      </div>

                      {/* Low-stock badge */}
                      {lowStock && (
                        <p className="text-xs text-amber-600 font-medium mt-0.5">
                          Últimas {item.producto.stock} unidades
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          disabled={item.cantidad >= item.producto.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.producto.id)}
                          className="ml-auto text-red-500 hover:text-red-600 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">{formatCOP(getTotal())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-primary hover:bg-primary/90 text-white text-center font-semibold py-3 rounded-lg transition-colors"
            >
              Proceder al Pago
            </Link>
            <button
              onClick={closeCart}
              className="block w-full border border-gray-300 hover:bg-gray-50 text-dark text-center font-semibold py-3 rounded-lg transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
