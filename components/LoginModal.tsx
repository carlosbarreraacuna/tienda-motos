'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Loader2, ArrowLeft, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { customerAuthApi } from '@/lib/customerApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'register' | 'forgot' | 'verify' | 'reset' | 'done';

export function LoginModal({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const { login, register } = useCustomerAuth();

  // Login / Register
  const [form, setForm] = useState({
    name: '', first_name: '', last_name: '',
    email: '', password: '', password_confirmation: '', phone: '',
  });

  // Forgot password flow
  const [fpEmail, setFpEmail] = useState('');
  const [fpCode, setFpCode] = useState('');
  const [fpPassword, setFpPassword] = useState('');
  const [fpConfirm, setFpConfirm] = useState('');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const resetFp = () => {
    setFpEmail(''); setFpCode(''); setFpPassword(''); setFpConfirm('');
    setError('');
  };

  const goMode = (m: Mode) => { setError(''); setMode(m); };

  // ── Login / Register ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (form.password !== form.password_confirmation) {
          setError('Las contraseñas no coinciden.');
          setLoading(false);
          return;
        }
        await register({ ...form });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot: enviar código ─────────────────────────────────────────────────
  const handleForgotSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpEmail) { setError('Ingresa tu correo.'); return; }
    setLoading(true); setError('');
    try {
      await customerAuthApi.forgotPassword(fpEmail);
      goMode('verify');
    } catch (err: any) {
      if (err?.message?.includes('No existe') || err?.message?.includes('404')) {
        setError('No existe una cuenta con ese correo. ¿Quieres crear una cuenta nueva?');
      } else {
        setError(err instanceof Error ? err.message : 'Error al enviar el código.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Verify: validar código ────────────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpCode.length !== 6) { setError('El código debe tener 6 dígitos.'); return; }
    setLoading(true); setError('');
    try {
      await customerAuthApi.verifyResetCode(fpEmail, fpCode);
      goMode('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código incorrecto.');
    } finally {
      setLoading(false);
    }
  };

  // ── Reset: cambiar contraseña ─────────────────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpPassword.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (fpPassword !== fpConfirm) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true); setError('');
    try {
      await customerAuthApi.resetPassword(fpEmail, fpCode, fpPassword, fpConfirm);
      goMode('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isForgotFlow = ['forgot', 'verify', 'reset', 'done'].includes(mode);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 pt-6 pb-8">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>

          {isForgotFlow ? (
            <>
              <button onClick={() => { goMode('login'); resetFp(); }}
                className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
              </button>
              <h2 className="text-2xl font-bold">
                {mode === 'forgot' && 'Recuperar contraseña'}
                {mode === 'verify' && 'Verificar código'}
                {mode === 'reset'  && 'Nueva contraseña'}
                {mode === 'done'   && '¡Listo!'}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {mode === 'forgot' && 'Te enviaremos un código a tu correo'}
                {mode === 'verify' && `Código enviado a ${fpEmail}`}
                {mode === 'reset'  && 'Elige una nueva contraseña segura'}
                {mode === 'done'   && 'Tu contraseña fue actualizada'}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {mode === 'login' ? 'Accede a tu cuenta de cliente' : 'Regístrate para hacer seguimiento de tus pedidos'}
              </p>
            </>
          )}
        </div>

        {/* Tabs (solo en login/register) */}
        {!isForgotFlow && (
          <div className="flex border-b border-gray-200 -mt-4 relative z-10">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} onClick={() => { goMode(m); }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  mode === m
                    ? 'bg-white text-primary border-b-2 border-primary'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}>
                {m === 'login' ? 'Ingresar' : 'Registrarse'}
              </button>
            ))}
          </div>
        )}

        {/* ── LOGIN / REGISTER ── */}
        {!isForgotFlow && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre *</label>
                    <input required value={form.first_name} onChange={e => set('first_name', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Carlos" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Apellido</label>
                    <input value={form.last_name} onChange={e => set('last_name', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="García" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="300 123 4567" />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Correo electrónico *</label>
              <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="correo@ejemplo.com" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña *</label>
              <div className="relative">
                <input required type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
                <input required type="password" value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Repite tu contraseña" />
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>

            {mode === 'login' && (
              <button type="button" onClick={() => { resetFp(); goMode('forgot'); }}
                className="w-full text-sm text-primary hover:underline text-center pt-1">
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </form>
        )}

        {/* ── FORGOT: ingresar correo ── */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSend} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
                {error.includes('cuenta nueva') && (
                  <button type="button" onClick={() => { setError(''); goMode('register'); resetFp(); }}
                    className="block mt-2 text-primary font-semibold hover:underline">
                    Crear cuenta nueva →
                  </button>
                )}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Correo electrónico *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required value={fpEmail} onChange={e => setFpEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="correo@ejemplo.com" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Recibirás un código de 6 dígitos en este correo.</p>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        )}

        {/* ── VERIFY: ingresar código ── */}
        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="p-6 space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Código de verificación *</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={fpCode}
                  onChange={e => setFpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-xl focus:ring-2 focus:ring-primary outline-none font-mono tracking-widest text-center"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Revisa tu bandeja de entrada y carpeta de spam.</p>
            </div>
            <button type="submit" disabled={loading || fpCode.length !== 6}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>
            <button type="button" onClick={() => { setError(''); setFpCode(''); handleForgotSend({ preventDefault: () => {} } as any); }}
              className="w-full text-sm text-gray-500 hover:text-primary text-center">
              ¿No recibiste el código? Reenviar
            </button>
          </form>
        )}

        {/* ── RESET: nueva contraseña ── */}
        {mode === 'reset' && (
          <form onSubmit={handleReset} className="p-6 space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nueva contraseña *</label>
              <div className="relative">
                <input type={showNewPass ? 'text' : 'password'} required value={fpPassword}
                  onChange={e => setFpPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowNewPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
              <input type="password" required value={fpConfirm} onChange={e => setFpConfirm(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="Repite la nueva contraseña" />
            </div>
            {fpPassword && (
              <ul className="text-xs space-y-1">
                <li className={fpPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}>{fpPassword.length >= 8 ? '✓' : '○'} Al menos 8 caracteres</li>
                <li className={fpPassword === fpConfirm && fpConfirm.length > 0 ? 'text-green-600' : 'text-gray-400'}>{fpPassword === fpConfirm && fpConfirm.length > 0 ? '✓' : '○'} Las contraseñas coinciden</li>
              </ul>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </form>
        )}

        {/* ── DONE ── */}
        {mode === 'done' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-bold text-gray-900 text-lg">¡Contraseña actualizada!</p>
            <p className="text-sm text-gray-500">Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <button onClick={() => { goMode('login'); resetFp(); }}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/90">
              Iniciar sesión
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
