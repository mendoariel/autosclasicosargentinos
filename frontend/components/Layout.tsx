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
        {/* Header */}
        <header style={{
          background: '#1a1a1a',
          color: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                🚗 Autos Clásicos Argentinos
              </h1>
            </Link>
            
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link 
                href="/" 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive('/') ? '#ffd700' : 'white',
                  fontWeight: isActive('/') ? 'bold' : 'normal'
                }}
              >
                Inicio
              </Link>
              <Link 
                href="/autos" 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive('/autos') ? '#ffd700' : 'white',
                  fontWeight: isActive('/autos') ? 'bold' : 'normal'
                }}
              >
                Ver Clásicos
              </Link>
              <Link 
                href="/publicar" 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive('/publicar') ? '#ffd700' : 'white',
                  fontWeight: isActive('/publicar') ? 'bold' : 'normal'
                }}
              >
                Publicar Clásico
              </Link>
              <Link 
                href="/cotizar" 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive('/cotizar') ? '#ffd700' : 'white',
                  fontWeight: isActive('/cotizar') ? 'bold' : 'normal'
                }}
              >
                Cotizar Seguro
              </Link>
              <Link 
                href="/noticias" 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive('/noticias') ? '#ffd700' : 'white',
                  fontWeight: isActive('/noticias') ? 'bold' : 'normal'
                }}
              >
                Noticias
              </Link>
              
              {user ? (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem' }}>
                    {user.nombre} {user.apellido}
                  </span>
                  <button
                    onClick={logout}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link 
                    href="/login"
                    style={{
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid white',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/registro"
                    style={{
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      background: '#0070f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem' }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          background: '#1a1a1a',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
          marginTop: 'auto'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            © 2026 Autos Clásicos Argentinos. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </>
  );
}



