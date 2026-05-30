'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={`auth-rule${ok ? ' auth-rule--ok' : ''}`}>
      <span aria-hidden="true">{ok ? '✓' : '✗'}</span> {text}
    </li>
  );
}

export default function InscriptionPage() {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    digit:     /[0-9]/.test(password),
    match:     confirm.length > 0 && password === confirm,
  };

  const validate = () => {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(pseudo))
      return 'Le pseudo doit faire 3 à 20 caractères (lettres, chiffres, _).';
    if (!rules.length)
      return 'Le mot de passe doit faire au moins 8 caractères.';
    if (!rules.uppercase && !rules.digit)
      return 'Le mot de passe doit contenir au moins une majuscule ou un chiffre.';
    if (!rules.match)
      return 'Les mots de passe ne correspondent pas.';
    return null;
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { pseudo } },
    });
    setLoading(false);

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Un compte existe déjà avec cet email.'
        : error.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-box">
          <h1>Vérifie tes emails !</h1>
          <p>Un lien de confirmation a été envoyé à <strong>{email}</strong>. Clique dessus pour activer ton compte.</p>
          <Link href="/" className="auth-link">Retour à l'accueil</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-box">
        <h1>Créer un compte</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Adresse email
            <input className="auth-input" type="email" required value={email}
              onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="auth-label">
            Pseudo <span className="auth-hint">(affiché sur tes commentaires)</span>
            <input className="auth-input" type="text" required value={pseudo}
              onChange={e => setPseudo(e.target.value)} autoComplete="username"
              placeholder="3–20 caractères, lettres et chiffres" />
          </label>
          <label className="auth-label">
            Mot de passe
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
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>
        <p className="auth-footer">Déjà un compte ? <Link href="/connexion" className="auth-link">Se connecter</Link></p>
      </div>
    </main>
  );
}
