'use client';

import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <CustomerAuthProvider>{children}</CustomerAuthProvider>;
}
