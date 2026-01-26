import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function CotizarPremium() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    whatsapp: '',
    clienteNombre: '',
    tipoVehiculo: 'Auto'
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const clearFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const getInputStyle = (value: string) => {
    const isFilled = value && value.length > 0;
    return {
      width: '100%',
      background: isFilled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.6)',
      border: isFilled ? '1px solid #10b981' : '1px solid var(--pk-glass-border)',
      padding: '1rem',
      borderRadius: '12px',
      color: isFilled ? '#0f172a' : 'white',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      fontWeight: isFilled ? '500' : 'normal'
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

      // Paso 1: Crear Solicitud
      const res = await fetch(`${apiUrl}/api/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error al crear solicitud');

      const data = await res.json();
      const tokenCliente = data.solicitud?.tokenCliente;

      // Paso 2: Subir Foto (si existe)
      if (file && tokenCliente) {
        const formDataImage = new FormData();
        formDataImage.append('fotos', file);

        const uploadRes = await fetch(`${apiUrl}/api/solicitudes/${tokenCliente}/fotos`, {
          method: 'POST',
          body: formDataImage
        });

        if (!uploadRes.ok) {
          console.error('Error subiendo foto:', await uploadRes.text());
        }
      }

      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout title="Solicitud Enviada">
        <div className="container" style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="glass-panel" style={{
            padding: '3rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            borderRadius: '20px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚀</div>
            <h1 style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              backgroundImage: 'var(--grad-gold)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>¡Solicitud Enviada!</h1>

            <p style={{ color: 'var(--pk-text-muted)', fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              Un asesor especializado está analizando tu <strong>{formData.marca} {formData.modelo}</strong>.
            </p>
            <p style={{ color: 'var(--pk-gold)', fontWeight: 500 }}>
              Te contactaremos por WhatsApp en breves minutos.
            </p>
            <button onClick={() => window.location.href = '/'} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
              Volver al Inicio
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Cotizar Tu Clásico">
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        marginTop: '-2rem',
        paddingTop: '6rem',
        paddingBottom: '4rem'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div className="hero-text">
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                color: 'var(--pk-white)'
              }}>
                Asegurá tu <span className="text-gradient-gold">Legado</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--pk-text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                Especialistas en vehículos clásicos y de colección. <br />
                Cotización personalizada con valores reales de mercado.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['🛡️ Cobertura Total', '⚡ Respuesta Rápida', '💎 Service Premium'].map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(5px)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--pk-white)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px' }}>
              <h2 style={{ color: 'var(--pk-white)', fontSize: '1.8rem', marginBottom: '2rem' }}>Cotizá Ahora</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Tu Nombre</label>
                  <input
                    type="text"
                    name="clienteNombre"
                    placeholder="Juan Pérez"
                    value={formData.clienteNombre}
                    onChange={handleChange}
                    required
                    style={getInputStyle(formData.clienteNombre)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Marca</label>
                    <input
                      type="text"
                      name="marca"
                      placeholder="Ford"
                      value={formData.marca}
                      onChange={handleChange}
                      required
                      style={getInputStyle(formData.marca)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Modelo</label>
                    <input
                      type="text"
                      name="modelo"
                      placeholder="Mustang"
                      value={formData.modelo}
                      onChange={handleChange}
                      required
                      style={getInputStyle(formData.modelo)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Año</label>
                    <input
                      type="number"
                      name="ano"
                      placeholder="1969"
                      value={formData.ano}
                      onChange={handleChange}
                      required
                      style={getInputStyle(formData.ano)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      placeholder="+54 9 11..."
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      style={getInputStyle(formData.whatsapp)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Foto de tu Clásico (Opcional)
                  </label>

                  {previewUrl ? (
                    <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--pk-glass-border)' }}>
                      <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={clearFile}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(239, 68, 68, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          backdropFilter: 'blur(4px)'
                        }}>
                        ×
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'inline-block',
                      width: '100%'
                    }}>
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          opacity: 0,
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer'
                        }}
                      />
                      <label htmlFor="file-upload" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px dashed var(--pk-glass-border)',
                        borderRadius: '12px',
                        color: 'var(--pk-text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        width: '100%',
                        height: '60px'
                      }}>
                        <span>📷 Click para subir foto</span>
                      </label>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>
                  {loading ? 'Enviando...' : 'SOLICITAR COTIZACIÓN'}
                </button>
                <p style={{ textAlign: 'center', color: 'var(--pk-text-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                  🔒 Tus datos están protegidos. Solo serán utilizados para contactarte.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
