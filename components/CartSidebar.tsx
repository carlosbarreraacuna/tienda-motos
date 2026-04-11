'use client';

import { useCart } from '@/lib/cart';
import { formatCOP, getImageUrl, PLACEHOLDER_IMG } from '@/lib/api';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-dark flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Carrito ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
              <button
                onClick={closeCart}
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.producto.id} className="flex gap-4 border-b pb-4">
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
                    <h3 className="font-semibold text-sm text-dark truncate">
                      {item.producto.nombre}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      Código: {item.producto.codigo}
                    </p>
                    <p className="text-primary font-bold">
                      {formatCOP(item.producto.precio_venta)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        disabled={item.cantidad <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        disabled={item.cantidad >= item.producto.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.producto.id)}
                        className="ml-auto text-red-500 hover:text-red-600 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
