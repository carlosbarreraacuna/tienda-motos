'use client';

import { useState, useEffect } from 'react';
import { addressApi, CustomerAddress } from '@/lib/customerApi';
import { Plus, Edit2, Trash2, Star, X, Save, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const emptyForm = (): Omit<CustomerAddress, 'id'> => ({
  label: 'Casa', full_name: '', phone: '', address: '',
  city: '', state: '', postal_code: '', country: 'Colombia',
  additional_info: '', is_default: false,
});

export default function DireccionesPage() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CustomerAddress | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await addressApi.list();
      setAddresses(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setShowForm(true); setError(''); };
  const openEdit = (a: CustomerAddress) => { setEditing(a); setForm({ ...a }); setShowForm(true); setError(''); };

  const handleSave = async () => {
    if (!form.full_name || !form.address || !form.city || !form.state) {
      setError('Completa los campos obligatorios.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await addressApi.update(editing.id, form);
      } else {
        await addressApi.create(form);
      }
      await load();
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta dirección?')) return;
    try { await addressApi.delete(id); await load(); } catch {}
  };

  const handleDefault = async (id: number) => {
    try { await addressApi.update(id, { is_default: true }); await load(); } catch {}
  };

  const f = (k: string) => (v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/cuenta/perfil" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Atrás
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Direcciones</h1>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 font-medium">
          <Plus className="w-4 h-4" /> Añadir dirección
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No tienes direcciones guardadas.</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
            Añadir primera dirección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className={`bg-white rounded-xl border p-5 ${a.is_default ? 'border-primary' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{a.label}</span>
                  {a.is_default && <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">Principal</span>}
                </div>
                <div className="flex items-center gap-1">
                  {!a.is_default && (
                    <button onClick={() => handleDefault(a.id)} title="Hacer principal"
                      className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg">
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => openEdit(a)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="font-medium text-gray-900 text-sm">{a.full_name}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {a.address}{a.additional_info ? ` - ${a.additional_info}` : ''}<br />
                {a.city}, {a.state} {a.postal_code}<br />
                {a.country}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{editing ? 'Editar dirección' : 'Nueva dirección'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Etiqueta</label>
                  <select value={form.label} onChange={e => f('label')(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                    {['Casa', 'Oficina', 'Otro'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
                  <input value={form.phone || ''} onChange={e => f('phone')(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="300 123 4567" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input required value={form.full_name} onChange={e => f('full_name')(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Dirección *</label>
                <input required value={form.address} onChange={e => f('address')(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Calle, número, barrio" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Información adicional</label>
                <input value={form.additional_info || ''} onChange={e => f('additional_info')(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Apto, piso, referencia..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input required value={form.city} onChange={e => f('city')(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Departamento *</label>
                  <input required value={form.state} onChange={e => f('state')(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_default} onChange={e => f('is_default')(e.target.checked)}
                  className="w-4 h-4 accent-primary" />
                <span className="text-sm text-gray-700">Establecer como dirección principal</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
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
