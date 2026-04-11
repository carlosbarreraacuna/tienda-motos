import { Suspense } from 'react';
import { CatalogContent } from '@/components/CatalogContent';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Catálogo de Repuestos - MotoRepuestos Colombia',
  description: 'Encuentra todos los repuestos para tu moto. Filtros por categoría, marca y precio.',
};

export const revalidate = 300; // 5 minutos

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categoria   = typeof searchParams.categoria  === 'string' ? searchParams.categoria  : undefined;
  const marca       = typeof searchParams.marca      === 'string' ? searchParams.marca      : undefined;
  const busqueda    = typeof searchParams.busqueda   === 'string' ? searchParams.busqueda   : undefined;
  const pagina      = typeof searchParams.pagina     === 'string' ? parseInt(searchParams.pagina) : 1;
  const ordenar     = typeof searchParams.ordenar    === 'string' ? searchParams.ordenar as 'recientes' | 'precio_asc' | 'precio_desc' | 'descuento_desc' | 'mas_vendidos' : 'recientes';
  const precio_min  = typeof searchParams.precio_min === 'string' ? parseFloat(searchParams.precio_min) : undefined;
  const precio_max  = typeof searchParams.precio_max === 'string' ? parseFloat(searchParams.precio_max) : undefined;
  const disponible  = searchParams.disponible === 'true' ? true : undefined;
  const modelo      = typeof searchParams.modelo === 'string' ? searchParams.modelo : undefined;

  const [productosResponse, categoriasResponse] = await Promise.all([
    api.getProductos({ categoria, marca, busqueda, pagina, ordenar, precio_min, precio_max, disponible, modelo }).catch(() => ({
      success: false,
      data: [],
      pagination: { total: 0, per_page: 20, current_page: 1, last_page: 1, from: 0, to: 0 }
    })),
    api.getCategorias().catch(() => ({ success: false, data: [] }))
  ]);

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Cargando...</div>}>
      <CatalogContent
        initialProductos={productosResponse.data}
        pagination={productosResponse.pagination}
        categorias={categoriasResponse.data}
      />
    </Suspense>
  );
}
