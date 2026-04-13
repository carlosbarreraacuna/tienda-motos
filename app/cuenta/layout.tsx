'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { User, MapPin, Package, CreditCard, Lock, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/cuenta/perfil',         label: 'Perfil',             icon: User },
  { href: '/cuenta/direcciones',    label: 'Direcciones',        icon: MapPin },
  { href: '/cuenta/pedidos',        label: 'Pedidos',            icon: Package },
  { href: '/cuenta/tarjetas',       label: 'Tarjetas de crédito',icon: CreditCard },
  { href: '/cuenta/autenticacion',  label: 'Autenticación',      icon: Lock },
];

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  const { customer, loading, logout } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !customer) {
      router.push('/');
    }
  }, [loading, customer, router]);

  if (loading || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0">
            {/* Avatar */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500">¡Hola,</p>
                <p className="font-bold text-gray-900">{customer.first_name || customer.name.split(' ')[0]}!</p>
              </div>
            </div>

            <nav className="space-y-0.5">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link key={href} href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-2.5'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-gray-400'}`} />
                    {label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button onClick={logout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-colors">
                  <LogOut className="w-4 h-4 text-gray-400" />
                  Cerrar Sesión
                </button>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
