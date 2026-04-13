'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, LogOut, Package, MapPin, Lock } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { api, Categoria } from '@/lib/api';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { LoginModal } from '@/components/LoginModal';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getItemCount, openCart } = useCart();
  const { customer, logout, loading } = useCustomerAuth();

  useEffect(() => {
    api.getCategorias().then((response) => {
      if (response.success) setCategorias(response.data);
    });
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?busqueda=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    setShowUserDropdown(false);
    await logout();
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-primary text-white py-2">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>🚚 Envíos gratis en compras superiores a $150.000</p>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.jpeg" alt="Logo" className="h-16 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
              <div className="relative">
                <button
                  onMouseEnter={() => setIsMegaMenuOpen(true)}
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                  className="flex items-center space-x-1 text-dark hover:text-primary transition-colors font-medium"
                >
                  <span>Categorías</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isMegaMenuOpen && (
                  <div
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                    className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white shadow-2xl rounded-lg p-6 grid grid-cols-3 gap-6"
                  >
                    {categorias.slice(0, 9).map((categoria) => (
                      <Link key={categoria.id} href={`/catalogo?categoria=${categoria.slug}`} className="group">
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <h3 className="font-semibold text-dark group-hover:text-primary transition-colors">
                              {categoria.nombre}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{categoria.productos_count} productos</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/catalogo" className="text-dark hover:text-primary transition-colors font-medium">Catálogo</Link>
              <Link href="/ofertas" className="text-dark hover:text-primary transition-colors font-medium">Ofertas</Link>
              <Link href="/contacto" className="text-dark hover:text-primary transition-colors font-medium">Contacto</Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar repuestos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center space-x-2">
              {/* Account */}
              {!loading && (
                <div className="relative" ref={dropdownRef}>
                  {customer ? (
                    <>
                      <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden md:block text-sm font-medium text-dark max-w-[80px] truncate">
                          {customer.first_name || customer.name.split(' ')[0]}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </button>

                      {showUserDropdown && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100 mb-1">
                            <p className="font-semibold text-sm text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                          </div>
                          <Link href="/cuenta/perfil" onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <User className="w-4 h-4 text-gray-400" /> Mi perfil
                          </Link>
                          <Link href="/cuenta/direcciones" onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <MapPin className="w-4 h-4 text-gray-400" /> Mis direcciones
                          </Link>
                          <Link href="/cuenta/pedidos" onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Package className="w-4 h-4 text-gray-400" /> Mis pedidos
                          </Link>
                          <Link href="/cuenta/autenticacion" onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Lock className="w-4 h-4 text-gray-400" /> Autenticación
                          </Link>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button onClick={handleLogout}
                              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                              <LogOut className="w-4 h-4" /> Cerrar Sesión
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Iniciar sesión"
                    >
                      <User className="w-5 h-5 text-dark" />
                      <span className="hidden md:block text-sm font-medium text-dark">Ingresar</span>
                    </button>
                  )}
                </div>
              )}

              {/* Cart */}
              <button onClick={openCart} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="w-6 h-6 text-dark" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar repuestos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="/catalogo" className="block py-2 text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
              <Link href="/ofertas" className="block py-2 text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Ofertas</Link>
              <Link href="/contacto" className="block py-2 text-dark hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
              {customer ? (
                <>
                  <div className="border-t pt-3">
                    <Link href="/cuenta/perfil" className="block py-2 text-dark hover:text-primary" onClick={() => setIsMenuOpen(false)}>Mi perfil</Link>
                    <Link href="/cuenta/pedidos" className="block py-2 text-dark hover:text-primary" onClick={() => setIsMenuOpen(false)}>Mis pedidos</Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block py-2 text-red-600 w-full text-left">Cerrar sesión</button>
                  </div>
                </>
              ) : (
                <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="block py-2 text-primary font-semibold">
                  Iniciar sesión / Registrarse
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
