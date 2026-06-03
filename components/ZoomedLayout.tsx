'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function ZoomedLayout({ children, className }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let ro: ResizeObserver;

    const adjust = () => {
      ro?.disconnect();
      inner.style.zoom = '1';

      requestAnimationFrame(() => {
        if (!outer || !inner) return;
        const availW = outer.offsetWidth;
        // outer a overflow:hidden → scrollWidth inclut le contenu caché
        const naturalW = outer.scrollWidth;

        inner.style.zoom = naturalW > availW + 2 ? String(availW / naturalW) : '';

        ro.observe(outer);
      });
    };

    ro = new ResizeObserver(adjust);
    ro.observe(outer);
    adjust();

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} style={{ width: '100%', overflow: 'hidden' }}>
      <div ref={innerRef} className={className}>
        {children}
      </div>
    </div>
  );
}
