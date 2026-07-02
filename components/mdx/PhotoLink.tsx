'use client';

import { useGallery } from '../PhotoGalleryProvider';

interface Props {
  id: string;
  children: React.ReactNode;
}

export default function PhotoLink({ id, children }: Props) {
  const { open } = useGallery();
  return (
    <button type="button" className="photo-link" onClick={() => open(id)}>
      {children}
    </button>
  );
}
