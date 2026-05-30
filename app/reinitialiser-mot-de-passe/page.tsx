'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={`auth-rule${ok ? ' auth-rule--ok' : ''}`}>
      <span aria-hidden="true">{ok ? '✓' : '✗'}</span> {text}
    </li>
  );
}

export default function ReinitialiserMotDePassePage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const rules = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    digit:     /[0-9]/.test(password),
    match:     confirm.length > 0 && password === confirm,
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!rules.length || (!rules.uppercase && !rules.digit))
      return setError('Le mot de passe ne respecte pas les règles.');
    if (!rules.match)
      return setError('Les mots de passe ne correspondent pas.');

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-box">
        <h1>Nouveau mot de passe</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Nouveau mot de passe
            <input className="auth-input" type="password" required value={password}
              onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
          </label>
          {password.length > 0 && (
            <ul className="auth-rules">
              <Rule ok={rules.length}    text="8 caractères minimum" />
              <Rule ok={rules.uppercase} text="Au moins une majuscule (A-Z)" />
              <Rule ok={rules.digit}     text="Au moins un chiffre (0-9)" />
            </ul>
          )}
          <label className="auth-label">
            Confirmer le mot de passe
            <input className="auth-input" type="password" required value={confirm}
              onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
          </label>
          {confirm.length > 0 && (
            <ul className="auth-rules">
              <Rule ok={rules.match} text="Les mots de passe correspondent" />
            </ul>
          )}
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </main>
  );
}
