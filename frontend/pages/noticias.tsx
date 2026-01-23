import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import Link from 'next/link';

interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  imagenUrl?: string;
  createdAt: string;
  auto?: {
    marca: string;
    modelo: string;
    ano: number;
  };
}

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/noticias');
      setNoticias(response.data);
    } catch (err: any) {
      setError('Error al cargar las noticias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Usar fechaPublicacion si existe, sino createdAt
  const getDate = (noticia: Noticia) => {
    return (noticia as any).fechaPublicacion || noticia.createdAt;
  };

  return (
    <Layout title="Noticias">
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>
            📰 Noticias de Autos Clásicos
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Noticias diarias generadas por IA sobre autos clásicos argentinos
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Cargando noticias...</p>
          </div>
        )}

        {error && (
          <div style={{
            background: '#ffe6e6',
            color: '#d32f2f',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && noticias.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              Aún no hay noticias publicadas.
            </p>
            <p style={{ marginTop: '1rem', color: '#999' }}>
              Las noticias se generan automáticamente todos los días.
            </p>
          </div>
        )}

        {!loading && noticias.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {noticias.map((noticia) => (
              <article
                key={noticia.id}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                {noticia.imagenUrl && (
                  <div style={{
                    width: '100%',
                    height: '300px',
                    background: `url(${noticia.imagenUrl}) center/cover`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                )}
                <div style={{ padding: '2rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1rem'
                  }}>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.8rem',
                      color: '#1a1a1a',
                      flex: 1
                    }}>
                      {noticia.titulo}
                    </h2>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#999',
                      whiteSpace: 'nowrap',
                      marginLeft: '1rem'
                    }}>
                      {formatDate(getDate(noticia))}
                    </span>
                  </div>
                  
                  {noticia.auto && (
                    <div style={{
                      background: '#f0f0f0',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      marginBottom: '1rem',
                      display: 'inline-block'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                        🚗 {noticia.auto.marca} {noticia.auto.modelo} ({noticia.auto.ano})
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      color: '#333',
                      lineHeight: '1.8',
                      fontSize: '1rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: noticia.contenido.substring(0, 500) + '...' }}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

