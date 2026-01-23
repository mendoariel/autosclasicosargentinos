import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import api from '../lib/api';

export default function Home() {
  const [stats, setStats] = useState({
    autos: 0,
    noticias: 0,
    usuarios: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Aquí podrías hacer llamadas para obtener estadísticas
      // Por ahora, solo marcamos como cargado
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  return (
    <Layout title="Inicio">
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      <div>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '4rem 2rem',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            🚗 Autos Clásicos Argentinos
          </h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.95 }}>
            El portal más completo para amantes de los autos clásicos
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/autos"
              style={{
                padding: '1rem 2rem',
                background: 'white',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              Ver Clásicos
            </Link>
            <Link
              href="/publicar"
              style={{
                padding: '1rem 2rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                border: '2px solid white'
              }}
            >
              Publicar tu Clásico
            </Link>
          </div>
        </section>

        {/* Servicios */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#1a1a1a' }}>
            Nuestros Servicios
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Publicar Clásico */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚗</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>
                Publica tu Clásico
              </h3>
              <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Comparte tu auto clásico con la comunidad. Publica fotos, detalles y precio.
              </p>
              <Link
                href="/publicar"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: '#0070f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                Publicar →
              </Link>
            </div>

            {/* Cotizar Seguro - Enhanced CTA */}
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(238, 90, 36, 0.3)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(238, 90, 36, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(238, 90, 36, 0.3)';
            }}
            >
              {/* Badge de oferta */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#fff',
                color: '#ff6b6b',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite'
              }}>
                🔥 COTIZACIÓN GRATIS
              </div>
              
              <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🛡️</div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white', fontWeight: 'bold' }}>
                Protege tu Clásico
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
                💎 Cobertura especializada para autos clásicos<br/>
                🚀 Cotización en menos de 60 segundos<br/>
                💰 Ahorra hasta 30% en tu póliza
              </p>
              
              {/* Features rápidas */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⚡</div>
                  <div>Instantáneo</div>
                </div>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎯</div>
                  <div>Personalizado</div>
                </div>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏆</div>
                  <div>Mejor Precio</div>
                </div>
              </div>
              
              <Link
                href="/cotizar"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2.5rem',
                  background: 'white',
                  color: '#ff6b6b',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(255,255,255,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,255,255,0.3)';
                }}
              >
                🚗 COTIZAR AHORA →
              </Link>
            </div>

            {/* Noticias */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📰</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>
                Noticias Diarias
              </h3>
              <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Noticias generadas por IA sobre autos clásicos argentinos. Actualizadas diariamente.
              </p>
              <Link
                href="/noticias"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: '#0070f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                Ver Noticias →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
