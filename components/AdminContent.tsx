'use client';

import { useState, useEffect } from 'react';
import { formatCOP } from '@/lib/api';
import { Package, Upload, Image as ImageIcon, X, Check } from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export function AdminContent() {
  const [activeTab, setActiveTab] = useState<'orders' | 'images'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [authToken, setAuthToken] = useState('');

  // Image upload state
  const [productCode, setProductCode] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    setAuthToken(token);
    loadOrders(token);
  }, []);

  const loadOrders = async (token: string) => {
    setLoading(true);
    try {
      // TODO: Implementar endpoint para listar órdenes
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ordenes`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      // setOrders(data.data);
      
      // Mock data para demostración
      setOrders([]);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/ordenes/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Estado actualizado correctamente');
      }
    } catch (error) {
      alert('Error al actualizar el estado');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      alert('Máximo 5 imágenes por producto');
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (!productCode || selectedFiles.length === 0) {
      alert('Ingresa el código del producto y selecciona al menos una imagen');
      return;
    }

    setUploadProgress(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`imagenes[${index}]`, file);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tienda/productos/${productCode}/imagenes`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`${data.data.length} imágenes subidas correctamente`);
        setProductCode('');
        setSelectedFiles([]);
      } else {
        alert('Error al subir imágenes: ' + data.message);
      }
    } catch (error) {
      alert('Error al subir imágenes');
    } finally {
      setUploadProgress(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagado',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-dark">Panel de Administración</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-dark'
            }`}
          >
            <Package className="w-5 h-5 inline mr-2" />
            Órdenes
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'images'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-dark'
            }`}
          >
            <ImageIcon className="w-5 h-5 inline mr-2" />
            Subir Imágenes
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando órdenes...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay órdenes registradas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-dark mb-1">
                          Orden #{order.order_number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_email}</p>
                        <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-2xl font-bold text-primary">{formatCOP(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Cambiar Estado</p>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="paid">Pagado</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    {selectedOrder?.id === order.id && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold mb-3">Productos</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.product_name} (x{item.quantity})
                              </span>
                              <span className="font-semibold">{formatCOP(item.subtotal)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="mt-4 text-primary hover:text-primary/80 text-sm font-semibold"
                    >
                      {selectedOrder?.id === order.id ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Subir Imágenes de Productos</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Código del Producto *
                </label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Ej: ABC123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Imágenes (Máximo 5)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Arrastra imágenes aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, WEBP (máx. 5MB por imagen)
                    </p>
                  </label>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-3">
                    Imágenes seleccionadas ({selectedFiles.length}/5)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={uploadImages}
                disabled={uploadProgress || !productCode || selectedFiles.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploadProgress ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Subir Imágenes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
