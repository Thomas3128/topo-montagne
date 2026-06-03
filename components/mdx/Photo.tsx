interface Props {
  src: string;
  caption?: string;
  alt?: string;
  width?: number; // pourcentage de la largeur du contenu, ex: 50
}

export default function Photo({ src, caption, alt, width }: Props) {
  return (
    <figure
      className="mdx-photo"
      style={width ? { width: `${width}%`, marginLeft: 'auto', marginRight: 'auto' } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? caption ?? ''} className="mdx-photo-img" />
      {caption && <figcaption className="mdx-photo-caption">{caption}</figcaption>}
    </figure>
  );
}
