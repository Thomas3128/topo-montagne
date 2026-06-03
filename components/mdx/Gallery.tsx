interface Props {
  children: React.ReactNode;
  cols?: 2 | 3;
}

export default function Gallery({ children, cols = 2 }: Props) {
  return (
    <div className="mdx-gallery" data-cols={cols}>
      {children}
    </div>
  );
}
