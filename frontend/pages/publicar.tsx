import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function Publicar() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    descripcion: '',
    precio: '',
    kilometraje: '',
    color: '',
    combustible: '',
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirigir si no está autenticado
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });
      if (imagen) {
        formDataToSend.append('imagen', imagen);
      }

      await api.post('/autos', formDataToSend);

      router.push('/autos');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al publicar el auto clásico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Publicar Clásico">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#1a1a1a' }}>
          🚗 Publicar tu Auto Clásico
        </h1>

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

        <form onSubmit={handleSubmit} style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="marca" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Marca: *
            </label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="modelo" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Modelo: *
            </label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label htmlFor="ano" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Año: *
              </label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear()}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label htmlFor="precio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Precio (USD):
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                min="0"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label htmlFor="kilometraje" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Kilometraje:
              </label>
              <input
                type="number"
                id="kilometraje"
                name="kilometraje"
                value={formData.kilometraje}
                onChange={handleChange}
                min="0"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label htmlFor="color" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Color:
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="combustible" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Combustible:
            </label>
            <select
              id="combustible"
              name="combustible"
              value={formData.combustible}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Seleccionar...</option>
              <option value="nafta">Nafta</option>
              <option value="gasoil">Gasoil</option>
              <option value="gnc">GNC</option>
              <option value="electrico">Eléctrico</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Descripción: *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="imagen" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Imagen del Auto:
            </label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {imagen && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                Archivo seleccionado: {imagen.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              background: loading ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Publicando...' : 'Publicar Auto Clásico'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

