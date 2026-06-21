'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const SITE_TITLE = "L'appel des terres hautes";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return (
    <Link href={href} className={isActive ? styles.active : ''}>
      {children}
    </Link>
  );
}

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const ThemeToggle = () => (
    <button className={styles.themeSwitch} aria-label="Changer de thème" onClick={toggleTheme}>
      <div className={styles.switchTrack}>
        <div className={styles.switchHandle}>
          <svg
            className={`${styles.icon} ${isDark ? styles.iconHidden : styles.iconVisible}`}
            xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          <svg
            className={`${styles.icon} ${!isDark ? styles.iconHidden : styles.iconVisible}`}
            xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </div>
      </div>
    </button>
  );

  const GitHubLink = ({ className }: { className?: string }) => (
    <a
      href="https://github.com/Thomas3128/topo-montagne"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.githubLink} ${className ?? ''}`}
    >
      <span className="sr-only">Go to my GitHub repo</span>
      <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
        <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    </a>
  );

  return (
    <>
      <header className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ''}`}>
        <nav className={styles.nav}>
          <div className={styles.brand}>
            <h2><Link href="/">{SITE_TITLE}</Link></h2>
          </div>

          <div className={styles.internalLinks}>
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/topos">Topos</NavLink>
            <NavLink href="/recits">Récits</NavLink>
            <NavLink href="/materiel">Matériel</NavLink>
            <NavLink href="/aide">Aide</NavLink>
            <NavLink href="/about">À propos</NavLink>
          </div>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <GitHubLink />
          </div>

          <button
            className={`${styles.burgerBtn}${isMenuOpen ? ` ${styles.burgerOpen}` : ''}`}
            aria-label="Ouvrir le menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((o) => !o)}
          >
            <span className={styles.burgerBar} />
            <span className={styles.burgerBar} />
            <span className={styles.burgerBar} />
          </button>
        </nav>
      </header>

      <div
        className={`${styles.mobileMenu}${isMenuOpen ? ` ${styles.mobileMenuOpen}` : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <nav className={styles.mobileNav}>
          <NavLink href="/">Accueil</NavLink>
          <NavLink href="/topos">Topos</NavLink>
          <NavLink href="/recits">Récits</NavLink>
          <NavLink href="/materiel">Matériel</NavLink>
          <NavLink href="/aide">Aide</NavLink>
          <NavLink href="/about">À propos</NavLink>
        </nav>
        <div className={styles.mobileActions}>
          <ThemeToggle />
          <GitHubLink />
        </div>
      </div>
    </>
  );
}
