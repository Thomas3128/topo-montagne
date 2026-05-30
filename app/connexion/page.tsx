'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError('Email ou mot de passe incorrect.');
    } else {
      router.push('/');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-box">
        <h1>Se connecter</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Adresse email
            <input className="auth-input" type="email" required value={email}
              onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="auth-label">
            Mot de passe
            <input className="auth-input" type="password" required value={password}
              onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
          <Link href="/mot-de-passe-oublie" className="auth-forgot">Mot de passe oublié ?</Link>
        </form>
        <p className="auth-footer">Pas encore de compte ? <Link href="/inscription" className="auth-link">S'inscrire</Link></p>
      </div>
    </main>
  );
}
