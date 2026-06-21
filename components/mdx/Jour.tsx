'use client';

import { useJour } from '../JourProvider';

interface Props {
  n: number;
  children: React.ReactNode;
}

export default function Jour({ n, children }: Props) {
  const selected = useJour();
  if (selected !== n) return null;
  return <div className="jour-content">{children}</div>;
}
