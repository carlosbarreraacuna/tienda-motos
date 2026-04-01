import { HeroSection } from "@/components/HeroSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { api } from "@/lib/api";

export const revalidate = 300; // Revalidar cada 5 minutos

export default async function HomePage() {
  // Obtener productos destacados (primeros 8)
  const productosResponse = await api.getProductos({ pagina: 1 }).catch(() => ({
    success: false,
    data: [],
    pagination: {
      total: 0,
      per_page: 20,
      current_page: 1,
      last_page: 1,
      from: 0,
      to: 0,
    }
  }));

  const productos = productosResponse.data.slice(0, 8);

  // Obtener categorías
  const categoriasResponse = await api.getCategorias().catch(() => ({
    success: false,
    data: []
  }));

  const categorias = categoriasResponse.data;

  return (
    <>
      <HeroSection />
      <CategoriesSection categorias={categorias} />
      <FeaturedProducts productos={productos} />
    </>
  );
}
