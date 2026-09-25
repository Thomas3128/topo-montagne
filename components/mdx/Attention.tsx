// Encadré d'avertissement pour les passages à risque d'un topo.
export default function Attention({ children }: { children: React.ReactNode }) {
  return <aside className="mdx-attention" role="note">{children}</aside>;
}
