'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function Lightbox({ src, alt, onClose }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const posRef   = useRef({ x: 0, y: 0 });
  const dragRef  = useRef(false);
  const touchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // ESC + bloquer le scroll de la page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Zoom / pan — tout via DOM pour éviter les re-renders
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const apply = () => {
      wrap.style.transform =
        `translate(${posRef.current.x}px, ${posRef.current.y}px) scale(${scaleRef.current})`;
      wrap.style.cursor = scaleRef.current > 1
        ? (dragRef.current ? 'grabbing' : 'grab')
        : 'zoom-in';
    };

    // Zoom vers un point (clientX, clientY) à l'écran
    const zoomTo = (newScale: number, cx: number, cy: number) => {
      const vx = window.innerWidth  / 2;
      const vy = window.innerHeight / 2;
      const s  = scaleRef.current;
      // Coordonnées locales du point sous le curseur avant zoom
      const lx = (cx - vx - posRef.current.x) / s;
      const ly = (cy - vy - posRef.current.y) / s;
      scaleRef.current = Math.min(10, Math.max(1, newScale));
      if (scaleRef.current <= 1) {
        scaleRef.current = 1;
        posRef.current   = { x: 0, y: 0 };
      } else {
        posRef.current = {
          x: cx - vx - lx * scaleRef.current,
          y: cy - vy - ly * scaleRef.current,
        };
      }
      apply();
      setIsZoomed(scaleRef.current > 1);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.85 : 1.18;
      zoomTo(scaleRef.current * factor, e.clientX, e.clientY);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (scaleRef.current <= 1) return;
      e.preventDefault();
      dragRef.current = true;
      apply();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      posRef.current.x += e.movementX;
      posRef.current.y += e.movementY;
      apply();
    };

    const onMouseUp = () => {
      dragRef.current = false;
      apply();
    };

    const onDblClick = () => {
      zoomTo(1, window.innerWidth / 2, window.innerHeight / 2);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 };
      } else if (e.touches.length === 2) {
        touchRef.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
          dist: Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          ),
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchRef.current) return;
      if (e.touches.length === 1 && scaleRef.current > 1) {
        posRef.current.x += e.touches[0].clientX - touchRef.current.x;
        posRef.current.y += e.touches[0].clientY - touchRef.current.y;
        touchRef.current.x = e.touches[0].clientX;
        touchRef.current.y = e.touches[0].clientY;
        apply();
      } else if (e.touches.length === 2) {
        const d   = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY,
        );
        const mx  = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const my  = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        zoomTo(scaleRef.current * (d / touchRef.current.dist), mx, my);
        touchRef.current.dist = d;
        touchRef.current.x    = mx;
        touchRef.current.y    = my;
      }
    };

    wrap.addEventListener('wheel',      onWheel,      { passive: false });
    wrap.addEventListener('mousedown',  onMouseDown);
    wrap.addEventListener('dblclick',   onDblClick);
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);

    return () => {
      wrap.removeEventListener('wheel',      onWheel);
      wrap.removeEventListener('mousedown',  onMouseDown);
      wrap.removeEventListener('dblclick',   onDblClick);
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, []);

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Fermer">✕</button>

      <div ref={wrapRef} className="lightbox-img-wrap" onClick={e => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ''} className="lightbox-img" draggable={false} />
      </div>

      {isZoomed && (
        <div className="lightbox-hint">Double-clic pour réinitialiser</div>
      )}
    </div>
  );
}
