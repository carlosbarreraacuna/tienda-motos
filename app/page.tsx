import { HeroSection } from "@/components/HeroSection";
import { BrandsCarousel } from "@/components/BrandsCarousel";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import MotoFinderSection from "@/components/MotoFinderSection";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

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
      <BrandsCarousel />
      <CategoriesSection categorias={categorias} />
      <MotoFinderSection />
      <FeaturedProducts productos={productos} />
    </>
  );
}
