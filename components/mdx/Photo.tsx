interface Props {
  src: string;
  caption?: string;
  alt?: string;
}

export default function Photo({ src, caption, alt }: Props) {
  return (
    <figure className="mdx-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? caption ?? ''} className="mdx-photo-img" />
      {caption && <figcaption className="mdx-photo-caption">{caption}</figcaption>}
    </figure>
  );
}
