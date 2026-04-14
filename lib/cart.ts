'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Producto } from './api';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

export interface CartIssue {
  productoId: number;
  type: 'price_changed' | 'stock_reduced' | 'out_of_stock';
  oldValue?: number;
  newValue?: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  updateProductData: (productoId: number, updates: Partial<Producto>) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (producto, cantidad = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.producto.id === producto.id
          );

          if (existingItem) {
            const newCantidad = existingItem.cantidad + cantidad;
            const capped = Math.min(newCantidad, producto.stock);
            return {
              items: state.items.map((item) =>
                item.producto.id === producto.id
                  ? { ...item, cantidad: capped }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { producto, cantidad: Math.min(cantidad, producto.stock) }],
          };
        });
      },

      removeItem: (productoId) => {
        set((state) => ({
          items: state.items.filter((item) => item.producto.id !== productoId),
        }));
      },

      updateQuantity: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.producto.id === productoId ? { ...item, cantidad } : item
          ),
        }));
      },

      /** Actualiza precio, stock y disponibilidad de un ítem ya en el carrito */
      updateProductData: (productoId, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.producto.id === productoId
              ? { ...item, producto: { ...item.producto, ...updates } }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.producto.precio_venta * item.cantidad,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
