'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  topo_slug: string;
}

export default function ProfilPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const pseudo = user?.user_metadata?.pseudo as string | undefined;

  useEffect(() => {
    if (!user) { router.replace('/connexion'); return; }
    supabase
      .from('comments')
      .select('id, content, created_at, topo_slug')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setComments(data); });
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user) return null;

  return (
    <main className="auth-page" style={{ alignItems: 'flex-start' }}>
      <div className="auth-box" style={{ maxWidth: 560 }}>
        <div className="profil-header">
          <div>
            <h1 className="profil-pseudo">{pseudo}</h1>
            <p className="profil-email">{user.email}</p>
          </div>
          <button className="profil-signout" onClick={handleSignOut}>Déconnexion</button>
        </div>

        <hr style={{ margin: '1.5rem 0', borderColor: 'rgb(var(--gray-light))' }} />

        <h2 className="profil-section-title">Mes commentaires ({comments.length})</h2>

        {comments.length === 0 ? (
          <p className="comments-empty">Tu n'as pas encore posté de commentaire.</p>
        ) : (
          <ul className="profil-comments">
            {comments.map((c) => (
              <li key={c.id} className="profil-comment">
                <Link href={`/topos/${c.topo_slug}`} className="profil-comment-topo">
                  {c.topo_slug.replace(/-/g, ' ')} →
                </Link>
                <p className="profil-comment-content">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
