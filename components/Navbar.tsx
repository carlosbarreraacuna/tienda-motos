'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { api, Categoria } from '@/lib/api';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount, openCart } = useCart();

  useEffect(() => {
    api.getCategorias().then((response) => {
      if (response.success) {
        setCategorias(response.data);
      }
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?busqueda=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
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
            <div className="bg-primary text-white font-bold text-xl px-3 py-1 rounded">
              MR
            </div>
            <span className="font-bold text-xl text-dark hidden sm:block">
              MotoRepuestos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {/* Mega Menu */}
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
                    <Link
                      key={categoria.id}
                      href={`/catalogo/${categoria.slug}`}
                      className="group"
                    >
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-semibold text-dark group-hover:text-primary transition-colors">
                            {categoria.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {categoria.productos_count} productos
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/catalogo" className="text-dark hover:text-primary transition-colors font-medium">
              Catálogo
            </Link>
            <Link href="/ofertas" className="text-dark hover:text-primary transition-colors font-medium">
              Ofertas
            </Link>
            <Link href="/contacto" className="text-dark hover:text-primary transition-colors font-medium">
              Contacto
            </Link>
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

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-dark" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar repuestos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/catalogo"
              className="block py-2 text-dark hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-semibold text-gray-500 mb-2">Categorías</p>
              {categorias.slice(0, 6).map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/catalogo/${categoria.slug}`}
                  className="block py-2 pl-4 text-dark hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {categoria.nombre}
                </Link>
              ))}
            </div>
            <Link
              href="/ofertas"
              className="block py-2 text-dark hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Ofertas
            </Link>
            <Link
              href="/contacto"
              className="block py-2 text-dark hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
