const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  slug: string;
  precio_venta: number;
  stock: number;
  disponible: boolean;
  categoria: string | null;
  categoria_slug: string | null;
  proveedor_marca: string | null;
  descripcion: string;
  imagenes: string[];
  especificaciones?: {
    unidad_medida: string;
    peso: string | null;
    dimensiones: string | null;
  };
  productos_relacionados?: Producto[];
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  imagen: string | null;
  productos_count: number;
  subcategorias: Categoria[];
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface ProductosResponse {
  success: boolean;
  data: Producto[];
  pagination: PaginationMeta;
}

export interface StockResponse {
  success: boolean;
  stock: number;
  disponible: boolean;
  bajo_stock: boolean;
}

export interface OrdenItem {
  producto_id: number;
  cantidad: number;
  precio: number;
}

export interface CrearOrdenData {
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_direccion: string;
  cliente_ciudad: string;
  cliente_departamento: string;
  items: OrdenItem[];
  subtotal: number;
  envio: number;
  total: number;
  metodo_pago: string;
  referencia_pago?: string;
  notas?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `Error ${response.status}`);
    }

    return response.json();
  }

  // Obtener productos con filtros
  async getProductos(params?: {
    categoria?: string;
    marca?: string;
    busqueda?: string;
    disponible?: boolean;
    precio_min?: number;
    precio_max?: number;
    pagina?: number;
  }): Promise<ProductosResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const query = searchParams.toString();
    return this.request<ProductosResponse>(
      `/tienda/productos${query ? `?${query}` : ''}`
    );
  }

  // Obtener detalle de producto
  async getProducto(codigo: string): Promise<{ success: boolean; data: Producto }> {
    return this.request<{ success: boolean; data: Producto }>(
      `/tienda/productos/${codigo}`
    );
  }

  // Obtener stock en tiempo real
  async getStock(codigo: string): Promise<StockResponse> {
    return this.request<StockResponse>(`/tienda/stock/${codigo}`);
  }

  // Obtener categorías
  async getCategorias(): Promise<{ success: boolean; data: Categoria[] }> {
    return this.request<{ success: boolean; data: Categoria[] }>(
      '/tienda/categorias'
    );
  }

  // Crear orden
  async crearOrden(data: CrearOrdenData): Promise<{
    success: boolean;
    message: string;
    data: { orden_id: number; numero_orden: string };
  }> {
    return this.request('/tienda/ordenes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Subir imágenes de producto (requiere auth)
  async subirImagenes(codigo: string, imagenes: File[], token: string): Promise<{
    success: boolean;
    message: string;
    data: string[];
  }> {
    const formData = new FormData();
    imagenes.forEach((imagen, index) => {
      formData.append(`imagenes[${index}]`, imagen);
    });

    const response = await fetch(`${this.baseUrl}/tienda/productos/${codigo}/imagenes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al subir imágenes' }));
      throw new Error(error.message);
    }

    return response.json();
  }
}

export const api = new ApiClient();

// Utilidades para formateo
export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateWhatsAppLink = (producto: Producto): string => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567';
  const message = `Hola! Estoy interesado en el producto:\n\n*${producto.nombre}*\nCódigo: ${producto.codigo}\nPrecio: ${formatCOP(producto.precio_venta)}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
