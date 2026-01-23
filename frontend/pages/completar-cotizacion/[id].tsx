import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const CompletarCotizacion = () => {
  const router = useRouter();
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    dominio: '',
    uso: '',
    valor: '',
    fotos: {
      tarjetaVerdeFrente: null,
      tarjetaVerdeDorso: null,
      vehiculoFecha: null,
      carnetConducir: null
    }
  });

  const [previews, setPreviews] = useState({
    tarjetaVerdeFrente: null,
    tarjetaVerdeDorso: null,
    vehiculoFecha: null,
    carnetConducir: null
  });

  useEffect(() => {
    if (router.isReady && router.query.id) {
      fetchQuoteData(router.query.id);
    }
  }, [router.isReady, router.query]);

  const fetchQuoteData = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/quote-attempts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setQuoteData(data);
      } else {
        router.push('/cotizar');
      }
    } catch (error) {
      console.error('Error fetching quote data:', error);
      router.push('/cotizar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    // Actualizar el archivo
    setFormData({
      ...formData,
      fotos: {
        ...formData.fotos,
        [name]: file
      }
    });

    // Generar previsualización
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({
          ...previews,
          [name]: reader.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews({
        ...previews,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Actualizar datos adicionales
      await fetch(`http://localhost:5001/api/quote-attempts/${router.query.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dominio: formData.dominio,
          uso: formData.uso,
          valor: formData.valor,
          status: 'completado'
        }),
      });

      alert('¡Información completada exitosamente!\n\nNuestro asesor te contactará a la brevedad con tu cotización personalizada.');
      router.push('/cotizar');
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Cargando...">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2>Cargando tu cotización...</h2>
        </div>
      </Layout>
    );
  }

  if (!quoteData) {
    return (
      <Layout title="Error">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2>No encontramos tu cotización</h2>
          <p>Por favor, solicita un nuevo link de cotización.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Completar Cotización">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>
            📋 Completar Información
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
            Para tu {quoteData.tipoVehiculo}: {quoteData.marca} {quoteData.modelo} {quoteData.ano}
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            📋 Datos del Vehículo
          </h3>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            <p><strong>{quoteData.marca} {quoteData.modelo} {quoteData.ano}</strong></p>
            <p>Contacto: {quoteData.whatsapp}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Dominio del Vehículo
            </label>
            <input
              type="text"
              name="dominio"
              value={formData.dominio}
              onChange={handleChange}
              placeholder="Ej: ABC123"
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Uso del Vehículo
            </label>
            <select
              name="uso"
              value={formData.uso}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="">Selecciona una opción</option>
              <option value="particular">Particular</option>
              <option value="comercial">Comercial</option>
              <option value="transporte">Transporte de pasajeros</option>
              <option value="carga">Transporte de carga</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Valor Asegurado (USD)
            </label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="Ej: 15000"
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#333' }}>
              📷 Documentación Requerida
            </h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                border: '2px solid #ddd',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#333' }}>
                  📄 Tarjeta Verde (Frente)
                </label>
                {previews.tarjetaVerdeFrente ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={previews.tarjetaVerdeFrente} 
                      alt="Tarjeta Verde Frente" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <p style={{ 
                      margin: '0.5rem 0 0 0', 
                      fontSize: '0.9rem', 
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      {formData.fotos.tarjetaVerdeFrente?.name}
                    </p>
                  </div>
                ) : (
                  <div style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                    <p style={{ color: '#666', margin: '0' }}>No hay imagen seleccionada</p>
                  </div>
                )}
                <input
                  type="file"
                  name="tarjetaVerdeFrente"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                border: '2px solid #ddd',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#333' }}>
                  📄 Tarjeta Verde (Dorso)
                </label>
                {previews.tarjetaVerdeDorso ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={previews.tarjetaVerdeDorso} 
                      alt="Tarjeta Verde Dorso" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <p style={{ 
                      margin: '0.5rem 0 0 0', 
                      fontSize: '0.9rem', 
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      {formData.fotos.tarjetaVerdeDorso?.name}
                    </p>
                  </div>
                ) : (
                  <div style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                    <p style={{ color: '#666', margin: '0' }}>No hay imagen seleccionada</p>
                  </div>
                )}
                <input
                  type="file"
                  name="tarjetaVerdeDorso"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                border: '2px solid #ddd',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#333' }}>
                  🚗 Foto del Vehículo con Fecha Actual
                </label>
                {previews.vehiculoFecha ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={previews.vehiculoFecha} 
                      alt="Vehículo con Fecha" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <p style={{ 
                      margin: '0.5rem 0 0 0', 
                      fontSize: '0.9rem', 
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      {formData.fotos.vehiculoFecha?.name}
                    </p>
                  </div>
                ) : (
                  <div style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                    <p style={{ color: '#666', margin: '0' }}>No hay imagen seleccionada</p>
                  </div>
                )}
                <input
                  type="file"
                  name="vehiculoFecha"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{
                background: 'white',
                padding: '1.5rem',
                border: '2px solid #ddd',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#333' }}>
                  🪪 Carnet de Conducir
                </label>
                {previews.carnetConducir ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={previews.carnetConducir} 
                      alt="Carnet de Conducir" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <p style={{ 
                      margin: '0.5rem 0 0 0', 
                      fontSize: '0.9rem', 
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      {formData.fotos.carnetConducir?.name}
                    </p>
                  </div>
                ) : (
                  <div style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                    <p style={{ color: '#666', margin: '0' }}>No hay imagen seleccionada</p>
                  </div>
                )}
                <input
                  type="file"
                  name="carnetConducir"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.5rem 3rem',
              fontSize: '1.3rem',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '⏳ Enviando...' : '📤 Enviar Información'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CompletarCotizacion;
