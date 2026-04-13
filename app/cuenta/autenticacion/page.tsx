'use client';

import { useState } from 'react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { customerAuthApi } from '@/lib/customerApi';
import { Lock, Eye, EyeOff, Save, CheckCircle2, Shield } from 'lucide-react';

export default function AutenticacionPage() {
  const { customer, setCustomer } = useCustomerAuth();
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.current_password || !form.password || !form.password_confirmation) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (form.password.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (form.password !== form.password_confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSaving(true);
    try {
      const res = await customerAuthApi.changePassword(
        form.current_password, form.password, form.password_confirmation
      );
      // Store new token if returned
      if (res.token && typeof window !== 'undefined') {
        localStorage.setItem('customer_token', res.token);
      }
      setSuccess(true);
      setForm({ current_password: '', password: '', password_confirmation: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña.');
    } finally {
      setSaving(false);
    }
  };

  if (!customer) return null;

  const PasswordField = ({
    label, field, show, onToggle, placeholder
  }: {
    label: string; field: keyof typeof form; show: boolean;
    onToggle: () => void; placeholder?: string
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock className="w-4 h-4" />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={form[field]}
          onChange={e => set(field, e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Autenticación</h1>
        <p className="text-sm text-gray-500 mt-0.5">Administra la seguridad de tu cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Change password */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-gray-800">Cambiar contraseña</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Contraseña actualizada correctamente.
              </div>
            )}

            <PasswordField
              label="Contraseña actual *"
              field="current_password"
              show={showPass.current}
              onToggle={() => setShowPass(p => ({ ...p, current: !p.current }))}
              placeholder="Tu contraseña actual"
            />
            <PasswordField
              label="Nueva contraseña *"
              field="password"
              show={showPass.new}
              onToggle={() => setShowPass(p => ({ ...p, new: !p.new }))}
              placeholder="Mínimo 8 caracteres"
            />
            <PasswordField
              label="Confirmar nueva contraseña *"
              field="password_confirmation"
              show={showPass.confirm}
              onToggle={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}
              placeholder="Repite la nueva contraseña"
            />

            {/* Strength hints */}
            {form.password && (
              <ul className="text-xs space-y-1 mt-1">
                <li className={form.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                  {form.password.length >= 8 ? '✓' : '○'} Al menos 8 caracteres
                </li>
                <li className={/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-gray-400'}>
                  {/[A-Z]/.test(form.password) ? '✓' : '○'} Al menos una mayúscula
                </li>
                <li className={/[0-9]/.test(form.password) ? 'text-green-600' : 'text-gray-400'}>
                  {/[0-9]/.test(form.password) ? '✓' : '○'} Al menos un número
                </li>
              </ul>
            )}

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-60">
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        </div>

        {/* Security info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-gray-400" />
              <h3 className="font-semibold text-gray-800 text-sm">Tu cuenta</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400">Correo registrado</p>
                <p className="text-sm font-medium text-gray-800 break-all">{customer.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">Recomendaciones de seguridad</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Usa una contraseña única para esta cuenta</li>
              <li>• No compartas tu contraseña con nadie</li>
              <li>• Cambia tu contraseña periódicamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
