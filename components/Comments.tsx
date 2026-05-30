'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { pseudo: string } | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

export default function Comments({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, content, created_at, profiles(pseudo)')
      .eq('topo_slug', slug)
      .order('created_at', { ascending: true });
    if (data) setComments(data as Comment[]);
  };

  useEffect(() => { fetchComments(); }, [slug]);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.from('comments').insert({
      topo_slug: slug,
      user_id: user!.id,
      content: text.trim(),
    });
    setLoading(false);
    if (error) {
      setError('Impossible de poster le commentaire.');
    } else {
      setText('');
      fetchComments();
    }
  };

  return (
    <section className="comments-section">
      <h2 className="comments-title">Commentaires{comments.length > 0 && ` (${comments.length})`}</h2>

      {comments.length === 0 && (
        <p className="comments-empty">Aucun commentaire pour l'instant. Sois le premier !</p>
      )}

      <ul className="comments-list">
        {comments.map((c) => (
          <li key={c.id} className="comment">
            <div className="comment-meta">
              <span className="comment-pseudo">{c.profiles?.pseudo ?? 'Anonyme'}</span>
              <span className="comment-date">{timeAgo(c.created_at)}</span>
            </div>
            <p className="comment-content">{c.content}</p>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            className="comment-textarea"
            placeholder="Laisse un commentaire…"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            maxLength={1000}
          />
          {error && <p className="auth-error">{error}</p>}
          <button className="comment-submit" type="submit" disabled={loading || !text.trim()}>
            {loading ? 'Envoi…' : 'Publier'}
          </button>
        </form>
      ) : (
        <p className="comments-login">
          <Link href="/connexion" className="auth-link">Connecte-toi</Link> pour laisser un commentaire.
        </p>
      )}
    </section>
  );
}
