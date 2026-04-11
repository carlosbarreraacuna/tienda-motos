import { Suspense } from 'react';
import { CatalogContent } from '@/components/CatalogContent';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: { categoria: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const marca      = typeof searchParams.marca      === 'string' ? searchParams.marca      : undefined;
  const busqueda   = typeof searchParams.busqueda   === 'string' ? searchParams.busqueda   : undefined;
  const pagina     = typeof searchParams.pagina     === 'string' ? parseInt(searchParams.pagina) : 1;
  const ordenar    = typeof searchParams.ordenar    === 'string' ? searchParams.ordenar as 'recientes' | 'precio_asc' | 'precio_desc' | 'descuento_desc' | 'mas_vendidos' : 'recientes';
  const precio_min = typeof searchParams.precio_min === 'string' ? parseFloat(searchParams.precio_min) : undefined;
  const precio_max = typeof searchParams.precio_max === 'string' ? parseFloat(searchParams.precio_max) : undefined;
  const disponible = searchParams.disponible === 'true' ? true : undefined;

  const [productosResponse, categoriasResponse] = await Promise.all([
    api.getProductos({ categoria: params.categoria, marca, busqueda, pagina, ordenar, precio_min, precio_max, disponible }).catch(() => ({
      success: false,
      data: [],
      pagination: { total: 0, per_page: 20, current_page: 1, last_page: 1, from: 0, to: 0 }
    })),
    api.getCategorias().catch(() => ({ success: false, data: [] }))
  ]);

  if (productosResponse.data.length === 0 && pagina === 1) {
    notFound();
  }

  const categoriaActual = categoriasResponse.data.find(c => c.slug === params.categoria);

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Cargando...</div>}>
      <CatalogContent
        initialProductos={productosResponse.data}
        pagination={productosResponse.pagination}
        categorias={categoriasResponse.data}
        categoriaActual={categoriaActual}
      />
    </Suspense>
  );
}
