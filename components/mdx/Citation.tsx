// Citations « > » des récits : style de la citation de la page d'accueil,
// en plus petit et aligné à gauche.
export default function Citation({ children }: { children?: React.ReactNode }) {
  return (
    <section className="quote-box quote-box--recit">
      <blockquote>{children}</blockquote>
    </section>
  );
}
