'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setMsg('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || 'Não foi possível entrar.');
      setState('error');
    } catch {
      setMsg('Erro de conexão. Tente novamente.');
      setState('error');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8">
        <h1 className="font-serif text-3xl text-ink">Painel Admin</h1>
        <p className="mt-2 text-sm text-muted">Acesso restrito. Informe a senha de administrador.</p>

        {!configured ? (
          <div className="mt-6 rounded-lg border border-mustard-400 bg-mustard-50 px-4 py-3 text-[13px] text-moss-800">
            O admin ainda não está configurado. Defina{' '}
            <code className="font-mono">ADMIN_PASSWORD</code> e{' '}
            <code className="font-mono">SESSION_SECRET</code> nas variáveis de ambiente e reinicie a aplicação.
          </div>
        ) : (
          <form className="mt-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Senha</span>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-ink focus:border-moss-700 focus:outline-none"
              />
            </label>
            {state === 'error' && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{msg}</p>
            )}
            <button
              type="submit"
              disabled={state === 'loading' || !password}
              className="mt-4 w-full rounded-full bg-moss-800 py-2.5 text-sm text-bg transition hover:bg-moss-900 disabled:opacity-60"
            >
              {state === 'loading' ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function AdminLogout() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  };
  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm text-muted transition hover:border-moss-700 hover:text-moss-700"
    >
      Sair
    </button>
  );
}
