import { api } from '@/lib/api';
import { ProductDetail } from '@/components/ProductDetail';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

function extractCodigo(slug: string): string {
  const idx = slug.indexOf('--');
  return idx >= 0 ? slug.slice(idx + 2) : slug;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const codigo = extractCodigo(params.slug);
  const response = await api.getProducto(codigo).catch(() => null);

  if (!response || !response.success) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const producto = response.data;

  return {
    title: `${producto.nombre} - MotoRepuestos Colombia`,
    description: producto.descripcion || `Compra ${producto.nombre} al mejor precio. Stock disponible.`,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion,
      images: producto.imagenes.length > 0 ? [producto.imagenes[0]] : [],
    },
  };
}

export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const codigo = extractCodigo(params.slug);
  const response = await api.getProducto(codigo).catch(() => null);

  if (!response || !response.success) {
    notFound();
  }

  return <ProductDetail producto={response.data} />;
}
