'use client';

import { useEffect, useState } from 'react';
import { X, Tag, ArrowRight } from 'lucide-react';

const POPUP_KEY = 'msp_new_user_popup_shown';

export default function NewUserPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds for first-time visitors
    const alreadyShown = localStorage.getItem(POPUP_KEY);
    if (!alreadyShown) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(POPUP_KEY, '1');
    }, 300);
  };

  const handleClaim = () => {
    // Copy code to clipboard and close
    navigator.clipboard.writeText('NUEVO20').catch(() => {});
    handleClose();
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 ${closing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner gradient */}
        <div className="bg-gradient-to-br from-red-500 to-orange-400 px-8 pt-10 pb-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-1">Bienvenido a Moto Spa</p>
          <h2 className="text-4xl font-extrabold mb-1">20% OFF</h2>
          <p className="text-white/90 text-sm">en tu primera compra</p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 text-center">
          <p className="text-gray-600 text-sm mb-5">
            Usa el siguiente código al finalizar tu compra y obtén un descuento exclusivo para nuevos clientes.
          </p>

          {/* Coupon code */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="border-2 border-dashed border-red-400 rounded-lg px-6 py-3 bg-red-50">
              <span className="text-2xl font-extrabold tracking-widest text-red-600">NUEVO20</span>
            </div>
          </div>

          <button
            onClick={handleClaim}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
          >
            Copiar código y seguir comprando
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleClose}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            No gracias, continuar sin descuento
          </button>
        </div>
      </div>
    </div>
  );
}
