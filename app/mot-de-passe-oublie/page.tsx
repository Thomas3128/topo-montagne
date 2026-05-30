'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    });
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <main className="auth-page">
        <div className="auth-box">
          <h1>Email envoyé</h1>
          <p>Si un compte existe pour <strong>{email}</strong>, tu recevras un lien pour réinitialiser ton mot de passe.</p>
          <Link href="/connexion" className="auth-link">Retour à la connexion</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-box">
        <h1>Mot de passe oublié</h1>
        <p style={{ color: 'rgb(var(--gray))', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Saisis ton adresse email, on t'envoie un lien pour réinitialiser ton mot de passe.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Adresse email
            <input className="auth-input" type="email" required value={email}
              onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Envoi…' : 'Envoyer le lien'}
          </button>
        </form>
        <p className="auth-footer"><Link href="/connexion" className="auth-link">Retour à la connexion</Link></p>
      </div>
    </main>
  );
}
