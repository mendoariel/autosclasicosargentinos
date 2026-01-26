import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga o fetch
    setLoading(false);
  }, []);

  return (
    <Layout title="Inicio">
      <div style={{ paddingBottom: '4rem' }}>

        {/* Full-width Hero Section */}
        <section style={{
          position: 'relative',
          padding: '8rem 2rem 6rem',
          textAlign: 'center',
          background: 'radial-gradient(circle at top center, #1e293b 0%, #0f172a 100%)',
          marginBottom: '4rem',
          borderRadius: '0 0 40px 40px',
          marginTop: '-2rem', // Offset default padding
        }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'url("https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
            zIndex: 0,
            borderRadius: '0 0 40px 40px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(212, 175, 55, 0.15)',
              color: 'var(--pk-gold)',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              ✨ El Portal Nº1 de Argentina
            </span>
            <h1 style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              lineHeight: 1.1,
              background: 'linear-gradient(to bottom, #fff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Preservando la Historia Sobre Ruedas
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '3rem',
              color: 'var(--pk-text-muted)',
              lineHeight: 1.6
            }}>
              La comunidad más exclusiva para compra, venta y aseguramiento de vehículos clásicos y de colección.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link
                href="/autos"
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '1rem 2rem', textDecoration: 'none' }}
              >
                Explorar Catálogo
              </Link>
              <Link
                href="/publicar"
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'background 0.2s'
                }}
              >
                Publicar
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>

            {/* Venta */}
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>🏎️</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Compra Venta</h3>
              <p style={{ color: 'var(--pk-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Encontrá la joya que buscás o dale un nuevo hogar a tu clásico. Publicaciones detalladas con fotos HD.
              </p>
              <Link href="/autos" style={{ color: 'var(--pk-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Ver Vehículos <span>→</span>
              </Link>
            </div>

            {/* Featured: Cotizador */}
            <div style={{
              background: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)', // Amber/Bronze gradient
              padding: '3px', // Border wrapper
              borderRadius: '16px',
              position: 'relative',
              transform: 'translateY(-10px)'
            }}>
              <div style={{
                background: '#1a120b',
                height: '100%',
                borderRadius: '14px',
                padding: '2.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--pk-gold)',
                  color: '#000',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  DESTACADO
                </div>

                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛡️</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Seguros Especializados</h3>
                <p style={{ color: '#d6d3d1', marginBottom: '2rem', lineHeight: '1.6' }}>
                  No asegures tu clásico como un auto común. Obtené una cobertura a medida con tasación real de mercado.
                </p>
                <Link
                  href="/cotizar"
                  className="btn-primary"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                >
                  Cotizar Ahora
                </Link>
              </div>
            </div>

            {/* Noticias */}
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📰</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Noticias IA</h3>
              <p style={{ color: 'var(--pk-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Mantenete al día con resúmenes diarios generados por inteligencia artificial sobre el mundo motor.
              </p>
              <Link href="/noticias" style={{ color: 'var(--pk-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Leer Novedades <span>→</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Trust Section */}
        <section className="container" style={{ marginTop: '6rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--pk-text-muted)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            Confían en nosotros
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', opacity: 0.4, filter: 'grayscale(100%)' }}>
            {/* Placeholders for logos */}
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>MERCADO</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>CLASSIC</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>INSURE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>MOTORS</div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
