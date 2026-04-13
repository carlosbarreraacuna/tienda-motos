const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface CustomerProfile {
  id: number;
  name: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  birth_date: string | null;
  gender: 'masculino' | 'femenino' | 'otro' | null;
  document_number: string | null;
  newsletter_subscribed: boolean;
  customer_type: string;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface CustomerAddress {
  id: number;
  label: string;
  full_name: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string | null;
  country: string;
  additional_info: string | null;
  is_default: boolean;
}

export interface CustomerOrder {
  id: number;
  type: 'order' | 'sale';
  source: 'online' | 'pos';
  source_label: string;
  order_number: string;
  status: string;
  status_label: string;
  status_steps: string[];
  current_step: number;
  total: number;
  subtotal: number;
  shipping_cost: number;
  payment_method: string;
  created_at: string;
  items_count: number;
  items: OrderItem[];
  // detail only
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  tracking_number?: string | null;
  shipping_company?: string | null;
  notes?: string | null;
  paid_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface PaymentMethod {
  id: number;
  card_brand: string;
  last_four: string;
  holder_name: string;
  exp_month: string;
  exp_year: string;
  is_default: boolean;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('customer_token');
}

async function req<T>(
  path: string,
  options?: RequestInit & { auth?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (options?.auth !== false) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    const msg =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(', ') : 'Error');
    throw new Error(msg);
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const customerAuthApi = {
  register: (body: {
    name: string; first_name?: string; last_name?: string;
    email: string; password: string; password_confirmation: string; phone?: string;
  }) => req<{ success: boolean; token: string; customer: CustomerProfile }>(
    '/cliente/auth/register', { method: 'POST', body: JSON.stringify(body), auth: false }
  ),

  login: (email: string, password: string) =>
    req<{ success: boolean; token: string; customer: CustomerProfile }>(
      '/cliente/auth/login', { method: 'POST', body: JSON.stringify({ email, password }), auth: false }
    ),

  logout: () => req<{ success: boolean }>('/cliente/auth/logout', { method: 'POST' }),

  me: () => req<{ success: boolean; customer: CustomerProfile }>('/cliente/auth/me'),

  updateProfile: (data: Partial<CustomerProfile>) =>
    req<{ success: boolean; customer: CustomerProfile }>(
      '/cliente/auth/profile', { method: 'PUT', body: JSON.stringify(data) }
    ),

  toggleNewsletter: (subscribed: boolean) =>
    req<{ success: boolean; newsletter_subscribed: boolean }>(
      '/cliente/auth/newsletter', { method: 'PUT', body: JSON.stringify({ subscribed }) }
    ),

  changePassword: (current_password: string, password: string, password_confirmation: string) =>
    req<{ success: boolean; token: string }>(
      '/cliente/auth/change-password',
      { method: 'PUT', body: JSON.stringify({ current_password, password, password_confirmation }) }
    ),

  forgotPassword: (email: string) =>
    req<{ success: boolean; not_found?: boolean; message: string }>(
      '/cliente/auth/forgot-password',
      { method: 'POST', body: JSON.stringify({ email }), auth: false }
    ),

  verifyResetCode: (email: string, code: string) =>
    req<{ success: boolean; message: string }>(
      '/cliente/auth/verify-reset-code',
      { method: 'POST', body: JSON.stringify({ email, code }), auth: false }
    ),

  resetPassword: (email: string, code: string, password: string, password_confirmation: string) =>
    req<{ success: boolean; message: string }>(
      '/cliente/auth/reset-password',
      { method: 'POST', body: JSON.stringify({ email, code, password, password_confirmation }), auth: false }
    ),
};

// ── Addresses ─────────────────────────────────────────────────────────────
export const addressApi = {
  list: () => req<{ success: boolean; data: CustomerAddress[] }>('/cliente/direcciones'),
  create: (data: Omit<CustomerAddress, 'id'>) =>
    req<{ success: boolean; data: CustomerAddress }>(
      '/cliente/direcciones', { method: 'POST', body: JSON.stringify(data) }
    ),
  update: (id: number, data: Partial<CustomerAddress>) =>
    req<{ success: boolean; data: CustomerAddress }>(
      `/cliente/direcciones/${id}`, { method: 'PUT', body: JSON.stringify(data) }
    ),
  delete: (id: number) =>
    req<{ success: boolean }>(`/cliente/direcciones/${id}`, { method: 'DELETE' }),
};

// ── Orders ────────────────────────────────────────────────────────────────
export const orderApi = {
  list: () => req<{ success: boolean; data: CustomerOrder[] }>('/cliente/pedidos'),
  detail: (id: number, type: 'order' | 'sale' = 'order') =>
    req<{ success: boolean; data: CustomerOrder }>(`/cliente/pedidos/${id}?type=${type}`),
};

// ── Payment Methods ───────────────────────────────────────────────────────
export const paymentMethodApi = {
  list: () => req<{ success: boolean; data: PaymentMethod[] }>('/cliente/tarjetas'),
  create: (data: Omit<PaymentMethod, 'id'>) =>
    req<{ success: boolean; data: PaymentMethod }>(
      '/cliente/tarjetas', { method: 'POST', body: JSON.stringify(data) }
    ),
  delete: (id: number) =>
    req<{ success: boolean }>(`/cliente/tarjetas/${id}`, { method: 'DELETE' }),
  setDefault: (id: number) =>
    req<{ success: boolean }>(`/cliente/tarjetas/${id}/default`, { method: 'PATCH' }),
};
