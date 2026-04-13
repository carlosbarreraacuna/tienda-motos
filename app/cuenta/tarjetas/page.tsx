'use client';

import { useState, useEffect } from 'react';
import { paymentMethodApi, PaymentMethod } from '@/lib/customerApi';
import { CreditCard, Plus, Trash2, Star, X, Save } from 'lucide-react';

const CARD_BRANDS: Record<string, { label: string; color: string }> = {
  visa:       { label: 'Visa',       color: 'bg-blue-600' },
  mastercard: { label: 'Mastercard', color: 'bg-red-500' },
  amex:       { label: 'Amex',       color: 'bg-green-600' },
  otro:       { label: 'Otro',       color: 'bg-gray-600' },
};

const emptyForm = () => ({
  card_brand: 'visa',
  last_four: '',
  holder_name: '',
  exp_month: '',
  exp_year: '',
  token: '',
  is_default: false,
});

export default function TarjetasPage() {
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const r = await paymentMethodApi.list();
      setCards(r.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.holder_name || !form.last_four || !form.exp_month || !form.exp_year) {
      setError('Completa los campos obligatorios.');
      return;
    }
    if (form.last_four.length !== 4 || !/^\d{4}$/.test(form.last_four)) {
      setError('Los últimos 4 dígitos deben ser 4 números.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await paymentMethodApi.create(form);
      await load();
      setShowForm(false);
      setForm(emptyForm());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta tarjeta?')) return;
    try { await paymentMethodApi.delete(id); await load(); } catch {}
  };

  const handleDefault = async (id: number) => {
    try { await paymentMethodApi.setDefault(id); await load(); } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarjetas de crédito</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona tus métodos de pago guardados</p>
        </div>
        <button onClick={() => { setShowForm(true); setError(''); setForm(emptyForm()); }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 font-medium">
          <Plus className="w-4 h-4" /> Añadir tarjeta
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No tienes tarjetas guardadas.</p>
          <button onClick={() => { setShowForm(true); setError(''); }}
            className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
            Añadir tarjeta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const brand = CARD_BRANDS[card.card_brand?.toLowerCase()] ?? CARD_BRANDS.otro;
            return (
              <div key={card.id}
                className={`relative bg-white rounded-xl border p-5 ${card.is_default ? 'border-primary' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold text-white px-2 py-1 rounded ${brand.color}`}>{brand.label}</span>
                    {card.is_default && (
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">Principal</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!card.is_default && (
                      <button onClick={() => handleDefault(card.id)} title="Hacer principal"
                        className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg">
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(card.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card number */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-gray-400 text-sm">••••</span>
                  <span className="text-gray-400 text-sm">••••</span>
                  <span className="text-gray-400 text-sm">••••</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">{card.last_four}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Titular</p>
                    <p className="text-sm font-medium text-gray-800">{card.holder_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Vence</p>
                    <p className="text-sm font-medium text-gray-800">
                      {card.exp_month?.toString().padStart(2, '0')}/{card.exp_year}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Añadir tarjeta</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
              )}

              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-4 py-3">
                Por seguridad, solo guardamos los últimos 4 dígitos de tu tarjeta. No almacenamos datos sensibles.
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de tarjeta</label>
                <select value={form.card_brand}
                  onChange={e => setForm(p => ({ ...p, card_brand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                  {Object.entries(CARD_BRANDS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Últimos 4 dígitos *</label>
                  <input
                    value={form.last_four}
                    onChange={e => setForm(p => ({ ...p, last_four: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none font-mono"
                    placeholder="1234" maxLength={4} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vencimiento *</label>
                  <div className="flex gap-1">
                    <input
                      value={form.exp_month}
                      onChange={e => setForm(p => ({ ...p, exp_month: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                      placeholder="MM" maxLength={2} />
                    <span className="py-2 text-gray-400">/</span>
                    <input
                      value={form.exp_year}
                      onChange={e => setForm(p => ({ ...p, exp_year: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                      placeholder="AA" maxLength={2} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del titular *</label>
                <input
                  value={form.holder_name}
                  onChange={e => setForm(p => ({ ...p, holder_name: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none uppercase"
                  placeholder="COMO APARECE EN LA TARJETA" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_default}
                  onChange={e => setForm(p => ({ ...p, is_default: e.target.checked }))}
                  className="w-4 h-4 accent-primary" />
                <span className="text-sm text-gray-700">Establecer como método de pago principal</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-60">
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
