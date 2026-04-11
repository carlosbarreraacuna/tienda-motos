import { Metadata } from 'next';
import { api } from '../../lib/api';
import OfertasContent from '../../components/OfertasContent';

export const metadata: Metadata = {
  title: 'Ofertas y Descuentos | Moto Spa',
  description: 'Encuentra los mejores descuentos en repuestos y accesorios para motos.',
};

export const revalidate = 300;

export default async function OfertasPage() {
  let productos: any[] = [];
  try {
    const res = await api.getProductos({ en_oferta: true, por_pagina: 100, ordenar: 'descuento_desc' });
    productos = res.data ?? [];
  } catch {
    productos = [];
  }

  return <OfertasContent productosIniciales={productos} />;
}
