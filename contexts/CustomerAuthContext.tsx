'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { customerAuthApi, CustomerProfile } from '@/lib/customerApi';

interface CustomerAuthContextType {
  customer: CustomerProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string; first_name?: string; last_name?: string;
    email: string; password: string; password_confirmation: string; phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setCustomer: (c: CustomerProfile | null) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('customer_token');
    if (saved) {
      setToken(saved);
      customerAuthApi.me()
        .then((r) => setCustomer(r.customer))
        .catch(() => {
          localStorage.removeItem('customer_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await customerAuthApi.login(email, password);
    localStorage.setItem('customer_token', res.token);
    setToken(res.token);
    setCustomer(res.customer);
  }, []);

  const register = useCallback(async (data: Parameters<typeof customerAuthApi.register>[0]) => {
    const res = await customerAuthApi.register(data);
    localStorage.setItem('customer_token', res.token);
    setToken(res.token);
    setCustomer(res.customer);
  }, []);

  const logout = useCallback(async () => {
    try { await customerAuthApi.logout(); } catch {}
    localStorage.removeItem('customer_token');
    setToken(null);
    setCustomer(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const res = await customerAuthApi.me();
    setCustomer(res.customer);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customer, token, loading, login, register, logout, refreshProfile, setCustomer }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used inside CustomerAuthProvider');
  return ctx;
}
