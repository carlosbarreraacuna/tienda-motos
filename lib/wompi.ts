/**
 * Wompi Payment Integration
 * Documentación: https://docs.wompi.co/
 */

export interface WompiCheckoutData {
  currency: 'COP';
  amountInCents: number;
  reference: string;
  publicKey: string;
  redirectUrl?: string;
  customerData?: {
    email: string;
    fullName: string;
    phoneNumber: string;
  };
}

/**
 * Inicializar checkout de Wompi
 */
export const initWompiCheckout = (data: WompiCheckoutData) => {
  // Cargar script de Wompi si no está cargado
  if (!document.getElementById('wompi-widget-script')) {
    const script = document.createElement('script');
    script.id = 'wompi-widget-script';
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }

  // Configurar checkout
  const checkout = new (window as any).WidgetCheckout({
    currency: data.currency,
    amountInCents: data.amountInCents,
    reference: data.reference,
    publicKey: data.publicKey,
    redirectUrl: data.redirectUrl || window.location.origin + '/orden-confirmada',
    customerData: data.customerData,
  });

  // Abrir modal de pago
  checkout.open((result: any) => {
    const transaction = result.transaction;
    console.log('Transacción completada:', transaction);
    
    // Redirigir a página de confirmación
    if (transaction.status === 'APPROVED') {
      window.location.href = `/orden-confirmada?ref=${transaction.reference}`;
    }
  });
};

/**
 * Formatear precio a centavos para Wompi
 */
export const formatPriceForWompi = (price: number): number => {
  return Math.round(price * 100);
};

/**
 * Formatear centavos a precio para mostrar
 */
export const formatPriceFromWompi = (cents: number): number => {
  return cents / 100;
};
