import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Autos Clásicos Argentinos' }: LayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      <Head>
        <title>{title} - Autos Clásicos Argentinos</title>
        <meta name="description" content="Portal de autos clásicos argentinos - Publica tu clásico, cotiza seguros y lee noticias" />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Sticky Glass Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--pk-glass-border)',
          padding: '1rem 0'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--pk-white)' }}>
                🚗 <span className="text-gradient-gold">ACA</span>
              </h1>
            </Link>

            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              {[
                { label: 'Inicio', path: '/' },
                { label: 'Ver Clásicos', path: '/autos' },
                { label: 'Publicar', path: '/publicar' },
                { label: 'Noticias', path: '/noticias' },
              ].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  style={{
                    textDecoration: 'none',
                    color: isActive(link.path) ? 'var(--pk-gold)' : 'var(--pk-text-muted)',
                    fontWeight: isActive(link.path) ? 600 : 400,
                    fontSize: '0.95rem',
                    transition: 'color 0.2s'
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/cotizar"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1.25rem'
                }}
              >
                Cotizar
              </Link>

              {user ? (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem', borderLeft: '1px solid var(--pk-glass-border)', paddingLeft: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--pk-text-muted)' }}>
                    {user.nombre}
                  </span>

                  {user.role === 'asesor' && (
                    <Link
                      href="/asesor/dashboard"
                      style={{
                        textDecoration: 'none',
                        color: 'var(--pk-gold)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '4px',
                        background: 'rgba(212, 175, 55, 0.1)'
                      }}
                    >
                      Panel
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    style={{
                      background: 'transparent',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
                  <Link
                    href="/login"
                    style={{
                      color: 'var(--pk-white)',
                      fontSize: '0.9rem',
                      opacity: 0.8
                    }}
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, width: '100%' }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          background: 'var(--pk-navy-light)',
          color: 'var(--pk-text-muted)',
          padding: '3rem 0',
          marginTop: 'auto',
          borderTop: '1px solid var(--pk-glass-border)'
        }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--pk-white)', fontSize: '1.5rem', marginBottom: '1rem' }}>Autos Clásicos Argentinos</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <Link href="/autos">Catálogo</Link>
              <Link href="/cotizar">Seguros</Link>
              <Link href="/autos">Catálogo</Link>
              <Link href="/cotizar">Seguros</Link>
              <Link href="/noticias">Noticias</Link>
              <Link href="/asesor/login" style={{ fontSize: '0.8rem', opacity: 0.5 }}>Acceso Asesores</Link>
            </div>
            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>
              © 2026 Autos Clásicos Argentinos. Pasión por lo nuestro.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}



