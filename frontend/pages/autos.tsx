import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';

// Función para obtener la URL completa de la imagen
const getImageUrl = (imagenUrl?: string) => {
  if (!imagenUrl) return null;
  
  // Si ya es una URL completa, retornarla
  if (imagenUrl.startsWith('http://') || imagenUrl.startsWith('https://')) {
    return imagenUrl;
  }
  
  // Construir URL completa basada en el entorno
  let apiUrl = 'http://localhost:5001'; // Por defecto desarrollo
  
  if (typeof window !== 'undefined') {
    // Si hay variable de entorno, usarla
    if (process.env.NEXT_PUBLIC_API_URL) {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
    } else if (window.location.protocol === 'https:') {
      // Producción HTTPS
      apiUrl = 'https://api.autosclasicosargentinos.com.ar';
    } else if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Otro dominio (no localhost)
      apiUrl = `https://api.${window.location.hostname}`;
    }
  } else {
    // Server-side: usar variable de entorno o default
    apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  }
  
  return `${apiUrl}${imagenUrl}`;
};

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  descripcion: string;
  precio?: number;
  imagenUrl?: string;
  user: {
    nombre: string;
    apellido: string;
  };
}

export default function Autos() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/autos');
      setAutos(response.data);
    } catch (err: any) {
      setError('Error al cargar los autos clásicos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Autos Clásicos">
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#1a1a1a' }}>
          🚗 Autos Clásicos en Venta
        </h1>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Cargando autos clásicos...</p>
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

        {!loading && !error && autos.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              Aún no hay autos clásicos publicados.
            </p>
            <p style={{ marginTop: '1rem' }}>
              <a href="/publicar" style={{ color: '#0070f3', textDecoration: 'none' }}>
                Sé el primero en publicar tu clásico →
              </a>
            </p>
          </div>
        )}

        {!loading && autos.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {autos.map((auto) => (
              <div
                key={auto.id}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                {getImageUrl(auto.imagenUrl) && !imageErrors.has(auto.id) ? (
                  <img
                    src={getImageUrl(auto.imagenUrl)!}
                    alt={`${auto.marca} ${auto.modelo}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      backgroundColor: '#f0f0f0'
                    }}
                    onError={() => {
                      setImageErrors(prev => new Set(prev).add(auto.id));
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}
                  >
                    🚗
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#1a1a1a' }}>
                    {auto.marca} {auto.modelo}
                  </h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                    Año: {auto.ano}
                  </p>
                  <p style={{ margin: '0 0 1rem 0', color: '#333', lineHeight: '1.6' }}>
                    {auto.descripcion.substring(0, 100)}...
                  </p>
                  {auto.precio && (
                    <p style={{
                      margin: '0 0 1rem 0',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: '#0070f3'
                    }}>
                      ${auto.precio.toLocaleString('es-AR')}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}>
                    Publicado por: {auto.user.nombre} {auto.user.apellido}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

