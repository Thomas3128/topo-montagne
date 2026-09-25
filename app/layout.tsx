import type { Metadata } from 'next';
import './globals.css';
import './topo.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const metadata: Metadata = {
  title: "L'appel des terres hautes",
  description: 'Topos et récits de montagne — randonnée, alpinisme, ski de rando.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
