'use client';

import { useState } from 'react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { customerAuthApi } from '@/lib/customerApi';
import { Save, Edit2, Bell, BellOff } from 'lucide-react';

export default function PerfilPage() {
  const { customer, setCustomer } = useCustomerAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState<{
    first_name: string;
    last_name: string;
    phone: string;
    birth_date: string;
    gender: 'masculino' | 'femenino' | 'otro' | '';
    document_number: string;
  }>({
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    phone: customer?.phone || '',
    birth_date: customer?.birth_date || '',
    gender: customer?.gender || '',
    document_number: customer?.document_number || '',
  });

  if (!customer) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await customerAuthApi.updateProfile({
        ...form,
        gender: form.gender || null,
      });
      setCustomer(res.customer);
      setEditing(false);
      setMsg('Perfil actualizado.');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const toggleNewsletter = async () => {
    try {
      const res = await customerAuthApi.toggleNewsletter(!customer.newsletter_subscribed);
      setCustomer({ ...customer, newsletter_subscribed: res.newsletter_subscribed });
    } catch {}
  };

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const Field = ({ label, value, editable = true, field }: { label: string; value: string; editable?: boolean; field?: string }) => (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
      {editing && editable && field ? (
        <input value={(form as any)[field]} onChange={e => f(field)(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
      ) : (
        <p className="text-sm text-gray-500">{value || <span className="italic text-gray-300">No especificado</span>}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        {msg && <p className="text-sm text-green-600 font-medium">{msg}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos personales */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <Field label="Nombre" value={customer.first_name || ''} field="first_name" />
          <Field label="Apellido" value={customer.last_name || ''} field="last_name" />
          <Field label="Email" value={customer.email} editable={false} />
          <Field label="Cédula de ciudadanía" value={customer.document_number || ''} field="document_number" />
          <div className="py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-1">Género</p>
            {editing ? (
              <select value={form.gender} onChange={e => f('gender')(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            ) : (
              <p className="text-sm text-gray-500 capitalize">{customer.gender || <span className="italic text-gray-300">No especificado</span>}</p>
            )}
          </div>
          <Field label="Fecha de nacimiento" value={customer.birth_date || ''} field="birth_date" />
          <Field label="Teléfono" value={customer.phone || ''} field="phone" />

          <div className="flex justify-end mt-4 gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit2 className="w-4 h-4" /> Editar
              </button>
            )}
          </div>
        </div>

        {/* Boletín */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h3 className="font-semibold text-gray-800 mb-2">Boletín informativo</h3>
          <p className="text-sm text-gray-500 mb-4">¿Quiere recibir boletines informativos promocionales?</p>
          <label className="flex items-start gap-3 cursor-pointer" onClick={toggleNewsletter}>
            <div className={`w-5 h-5 mt-0.5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
              customer.newsletter_subscribed ? 'bg-primary border-primary' : 'border-gray-300'
            }`}>
              {customer.newsletter_subscribed && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className="text-sm text-gray-700 flex items-center gap-2">
              {customer.newsletter_subscribed ? <Bell className="w-4 h-4 text-primary" /> : <BellOff className="w-4 h-4 text-gray-400" />}
              Quiero recibir el boletín informativo con promociones.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
