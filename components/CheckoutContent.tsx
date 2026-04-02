'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { api, formatCOP } from '@/lib/api';
import Image from 'next/image';
import { ShoppingBag, CreditCard, Truck, CheckCircle } from 'lucide-react';

export function CheckoutContent() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [ordenId, setOrdenId] = useState<string>('');

  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_email: '',
    cliente_telefono: '',
    cliente_direccion: '',
    cliente_ciudad: '',
    cliente_departamento: '',
    notas: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estados para código promocional
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const subtotal = getTotal();
  const envio = subtotal >= 150000 ? 0 : 15000;
  const totalBeforeDiscount = subtotal + envio;
  const total = Math.max(0, totalBeforeDiscount - couponDiscount);

  useEffect(() => {
    if (items.length === 0 && step === 'info') {
      router.push('/catalogo');
    }
  }, [items, step, router]);

  useEffect(() => {
    if (step === 'payment') {
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        initWompiWidget();
      }, 100);
    }
  }, [step, total]); // Re-render cuando cambie el total (por cupón)

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cliente_nombre.trim()) newErrors.cliente_nombre = 'Nombre requerido';
    if (!formData.cliente_email.trim()) newErrors.cliente_email = 'Email requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.cliente_email)) {
      newErrors.cliente_email = 'Email inválido';
    }
    if (!formData.cliente_telefono.trim()) newErrors.cliente_telefono = 'Teléfono requerido';
    if (!formData.cliente_direccion.trim()) newErrors.cliente_direccion = 'Dirección requerida';
    if (!formData.cliente_ciudad.trim()) newErrors.cliente_ciudad = 'Ciudad requerida';
    if (!formData.cliente_departamento.trim()) newErrors.cliente_departamento = 'Departamento requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      setCouponError('Por favor ingresa un código promocional');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const productIds = items.map(item => item.producto.id);
      const response = await api.validarCupon(promoCode.trim(), totalBeforeDiscount, productIds);

      if (response.success && response.data) {
        setAppliedCoupon(response.data.coupon);
        setCouponDiscount(response.data.discount);
        setCouponError('');
      }
    } catch (error: any) {
      setCouponError(error.message || 'Cupón inválido o expirado');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setPromoCode('');
    setCouponError('');
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('payment');
    }
  };

  const initWompiWidget = () => {
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    
    console.log('🔑 Wompi Public Key:', publicKey ? 'Configurada ✅' : 'NO configurada ❌');
    console.log('🔑 Valor:', publicKey);
    
    if (!publicKey) {
      console.error('NEXT_PUBLIC_WOMPI_PUBLIC_KEY no está configurada');
      alert('Error: La clave pública de Wompi no está configurada. Por favor contacta al administrador.');
      return;
    }

    // Verificar si el script ya está cargado
    if (!document.getElementById('wompi-widget-script')) {
      const script = document.createElement('script');
      script.id = 'wompi-widget-script';
      script.src = 'https://checkout.wompi.co/widget.js';
      script.async = true;
      script.onload = () => {
        renderWompiCheckout();
      };
      document.body.appendChild(script);
    } else {
      renderWompiCheckout();
    }

    // Listener para eventos de Wompi
    window.addEventListener('message', handleWompiEvent);
  };

  const renderWompiCheckout = async () => {
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    const reference = `ORDER-${Date.now()}`;
    const amountInCents = Math.round(total * 100);
    
    // Verificar que WidgetCheckout esté disponible
    if (typeof (window as any).WidgetCheckout === 'undefined') {
      console.error('WidgetCheckout no está disponible');
      setTimeout(renderWompiCheckout, 500);
      return;
    }

    console.log('✅ Inicializando Wompi Widget...');
    console.log('💰 Total a cobrar:', total, '→ En centavos:', amountInCents);

    // Obtener firma de integridad del backend
    let integrity = undefined;
    try {
      const integrityResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/tienda/wompi/integrity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: reference,
          amount_in_cents: amountInCents,
          currency: 'COP',
        }),
      });

      if (integrityResponse.ok) {
        const integrityData = await integrityResponse.json();
        if (integrityData.success && integrityData.data) {
          integrity = integrityData.data.integrity;
          console.log('🔐 Firma de integridad obtenida');
        }
      }
    } catch (error) {
      console.error('Error obteniendo firma de integridad:', error);
    }

    const checkout = new (window as any).WidgetCheckout({
      currency: 'COP',
      amountInCents: amountInCents,
      reference: reference,
      publicKey: publicKey,
      redirectUrl: window.location.origin + '/orden-confirmada',
      customerData: {
        email: formData.cliente_email,
        fullName: formData.cliente_nombre,
        phoneNumber: formData.cliente_telefono,
        phoneNumberPrefix: '+57',
      },
      ...(integrity && { signature: { integrity } }),
    });

    const container = document.getElementById('wompi-widget');
    console.log('📦 Container encontrado:', container);
    
    if (container) {
      // Limpiar contenedor antes de renderizar
      container.innerHTML = '';
      
      const buttonHTML = `
        <button 
          id="wompi-pay-button"
          style="width: 100%; background-color: #D62B2B; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; font-weight: 600; font-size: 1.125rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; cursor: pointer; transition: all 0.3s;"
          onmouseover="this.style.backgroundColor='#b82424'"
          onmouseout="this.style.backgroundColor='#D62B2B'"
        >
          <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Pagar con Wompi - ${formatCOP(total)}
        </button>
      `;
      
      container.innerHTML = buttonHTML;
      console.log('✅ Botón HTML insertado');

      setTimeout(() => {
        const button = document.getElementById('wompi-pay-button');
        console.log('🔘 Botón encontrado:', button);
        
        if (button) {
          button.addEventListener('click', () => {
            console.log('🖱️ Click en botón de pago');
            checkout.open((result: any) => {
              console.log('💳 Resultado del pago:', result);
              if (result.transaction && result.transaction.status === 'APPROVED') {
                crearOrden(result.transaction.id);
              }
            });
          });
          console.log('✅ Event listener agregado al botón');
        } else {
          console.error('❌ No se encontró el botón después de insertar HTML');
        }
      }, 100);
    } else {
      console.error('❌ No se encontró el contenedor #wompi-widget');
    }
  };

  const handleWompiEvent = async (event: MessageEvent) => {
    if (event.data.type === 'PAYMENT_SUCCESS') {
      await crearOrden(event.data.transaction.id);
    }
  };

  const crearOrden = async (referenciaWompi: string) => {
    setLoading(true);
    try {
      const ordenData = {
        ...formData,
        items: items.map(item => ({
          producto_id: item.producto.id,
          cantidad: item.cantidad,
          precio: item.producto.precio_venta,
        })),
        subtotal,
        envio,
        total,
        metodo_pago: 'wompi',
        referencia_pago: referenciaWompi,
        cupon_codigo: appliedCoupon?.code,
        cupon_descuento: couponDiscount,
      };

      const response = await api.crearOrden(ordenData);
      
      if (response.success) {
        setOrdenId(response.data.numero_orden);
        clearCart();
        
        // Google Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'purchase', {
            transaction_id: response.data.numero_orden,
            value: total,
            currency: 'COP',
            items: items.map(item => ({
              item_id: item.producto.codigo,
              item_name: item.producto.nombre,
              price: item.producto.precio_venta,
              quantity: item.cantidad,
            })),
          });
        }

        // Redirigir a página de confirmación con parámetros seguros
        router.push(`/orden-confirmada?id=${response.data.numero_orden}&transaction=${referenciaWompi}`);
      }
    } catch (error) {
      alert('Error al crear la orden. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-4">¡Compra Exitosa!</h1>
          <p className="text-gray-600 mb-2">Tu orden ha sido procesada correctamente</p>
          <p className="text-2xl font-bold text-primary mb-6">#{ordenId}</p>
          <p className="text-sm text-gray-500 mb-8">
            Recibirás un email de confirmación con los detalles de tu pedido.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => router.push('/catalogo')}
              className="w-full border border-gray-300 hover:bg-gray-50 text-dark py-3 rounded-lg font-semibold transition-colors"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-dark mb-8">Finalizar Compra</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'info' ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'info' ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-semibold hidden sm:inline">Información</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'payment' ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-semibold hidden sm:inline">Pago</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            {step === 'info' && (
              <form onSubmit={handleSubmitInfo} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Información de Envío
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Nombre Completo *</label>
                    <input
                      type="text"
                      value={formData.cliente_nombre}
                      onChange={(e) => setFormData({ ...formData, cliente_nombre: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.cliente_nombre ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cliente_nombre && <p className="text-red-500 text-sm mt-1">{errors.cliente_nombre}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.cliente_email}
                      onChange={(e) => setFormData({ ...formData, cliente_email: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.cliente_email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cliente_email && <p className="text-red-500 text-sm mt-1">{errors.cliente_email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      value={formData.cliente_telefono}
                      onChange={(e) => setFormData({ ...formData, cliente_telefono: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.cliente_telefono ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cliente_telefono && <p className="text-red-500 text-sm mt-1">{errors.cliente_telefono}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Dirección *</label>
                    <input
                      type="text"
                      value={formData.cliente_direccion}
                      onChange={(e) => setFormData({ ...formData, cliente_direccion: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.cliente_direccion ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cliente_direccion && <p className="text-red-500 text-sm mt-1">{errors.cliente_direccion}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Ciudad *</label>
                    <input
                      type="text"
                      value={formData.cliente_ciudad}
                      onChange={(e) => setFormData({ ...formData, cliente_ciudad: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.cliente_ciudad ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cliente_ciudad && <p className="text-red-500 text-sm mt-1">{errors.cliente_ciudad}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Departamento *</label>
                    <input
                      type="text"
                      value={formData.cliente_departamento}
                      onChange={(e) => setFormData({ ...formData, cliente_departamento: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.cliente_departamento ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cliente_departamento && <p className="text-red-500 text-sm mt-1">{errors.cliente_departamento}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Notas del Pedido (Opcional)</label>
                    <textarea
                      value={formData.notas}
                      onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Instrucciones especiales de entrega, etc."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-4 rounded-lg font-semibold transition-colors"
                >
                  Continuar al Pago
                </button>
              </form>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Método de Pago
                </h2>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Paga de forma segura con Wompi. Aceptamos tarjetas de crédito, débito y PSE.
                  </p>
                  <div id="wompi-widget" className="min-h-[200px]"></div>
                </div>

                <button
                  onClick={() => setStep('info')}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-dark py-3 rounded-lg font-semibold transition-colors"
                >
                  Volver
                </button>
              </div>
            )}
          </div>

          {/* Resumen del Pedido */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.producto.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                      <Image
                        src={item.producto.imagenes[0] || '/placeholder-product.png'}
                        alt={item.producto.nombre}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.producto.nombre}</p>
                      <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                      <p className="text-sm font-bold text-primary">
                        {formatCOP(item.producto.precio_venta * item.cantidad)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Código Promocional */}
              <div className="border-t pt-4 mb-4">
                <h3 className="text-sm font-semibold mb-2">Código Promocional</h3>
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Ingresa tu código"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={couponLoading}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !promoCode.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {couponLoading ? 'Validando...' : 'Aplicar'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm font-semibold text-green-800">{appliedCoupon.name}</p>
                        <p className="text-xs text-green-600">Código: {appliedCoupon.code}</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 text-xs underline"
                      >
                        Remover
                      </button>
                    </div>
                    <p className="text-xs text-green-700">
                      Descuento: -{formatCOP(couponDiscount)}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span className="font-semibold">
                    {envio === 0 ? 'GRATIS' : formatCOP(envio)}
                  </span>
                </div>
                {envio === 0 && (
                  <p className="text-xs text-green-600">
                    ¡Envío gratis por compra superior a $150.000!
                  </p>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento cupón:</span>
                    <span className="font-semibold">-{formatCOP(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary">{formatCOP(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
