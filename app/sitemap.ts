import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tutienda.com';

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ofertas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Obtener productos dinámicamente
  try {
    const productosResponse = await api.getProductos({ pagina: 1 });
    const productos: MetadataRoute.Sitemap = productosResponse.data.map((producto) => ({
      url: `${baseUrl}/producto/${producto.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Obtener categorías
    const categoriasResponse = await api.getCategorias();
    const categorias: MetadataRoute.Sitemap = categoriasResponse.data.map((categoria) => ({
      url: `${baseUrl}/catalogo/${categoria.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticPages, ...categorias, ...productos];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
