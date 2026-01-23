import { useState } from 'react';
import Layout from '../components/Layout';

export default function Cotizar() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tipoVehiculo: '',
    marca: '',
    modelo: '',
    ano: '',
    whatsapp: '',
    dominio: '',
    uso: 'particular',
    valor: '',
    patente: '',
    numeroMotor: '',
    numeroChasis: '',
    fotos: {
      tarjetaVerdeFrente: null,
      tarjetaVerdeDorso: null,
      vehiculoFecha: null,
      carnetConducir: null
    }
  });
  const [loading, setLoading] = useState(false);
  const [quoteAttemptId, setQuoteAttemptId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTipoVehiculo = (tipo: string) => {
    setFormData({ ...formData, tipoVehiculo: tipo });
    setTimeout(() => setStep(2), 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        fotos: {
          ...formData.fotos,
          [name]: files[0]
        }
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.whatsapp) {
      setLoading(true);
      
      try {
        // Guardar datos en la base de datos y enviar email al asesor
        const response = await fetch('http://localhost:5001/api/quote-attempts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tipoVehiculo: formData.tipoVehiculo,
            marca: formData.marca,
            modelo: formData.modelo,
            ano: formData.ano,
            whatsapp: formData.whatsapp,
            status: 'pending'
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Cotización guardada y email enviado:', result);
          
          // Mostrar mensaje de éxito
          alert('¡Gracias por tu cotización!\n\nHemos enviado tu información a nuestro asesor comercial.\nTe contactará a la brevedad por WhatsApp.\n\nID de cotización: #' + result.id);
          
          // Resetear formulario
          setFormData({
            tipoVehiculo: '',
            marca: '',
            modelo: '',
            ano: '',
            whatsapp: '',
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
          setStep(1);
        } else {
          throw new Error('Error al procesar la cotización');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFinalSubmit = async (quoteAttemptId: number) => {
    setLoading(true);
    
    try {
      // Guardar documentación completa
      const response = await fetch('http://localhost:5001/api/solicitud-documentacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteAttemptId,
          imagenTarjetaVerdeFrente: formData.fotos.tarjetaVerdeFrente ? 'uploaded' : null,
          imagenTarjetaVerdeDorso: formData.fotos.tarjetaVerdeDorso ? 'uploaded' : null,
          imagenVehiculoFecha: formData.fotos.vehiculoFecha ? 'uploaded' : null,
          imagenCarnetConducir: formData.fotos.carnetConducir ? 'uploaded' : null,
          patente: formData.patente,
          numeroMotor: formData.numeroMotor,
          numeroChasis: formData.numeroChasis,
          dominio: formData.dominio,
          observaciones: 'Cliente completó documentación online'
        }),
      });

      if (response.ok) {
        // Enviar WhatsApp al asesor con toda la información
        const message = `🚗 *NUEVA COTIZACIÓN COMPLETA - AUTOS CLÁSICOS*\n\n` +
          `📋 *Datos del Vehículo:*\n` +
          `Tipo: ${formData.tipoVehiculo}\n` +
          `Marca: ${formData.marca}\n` +
          `Modelo: ${formData.modelo}\n` +
          `Año: ${formData.ano}\n` +
          `Dominio: ${formData.dominio}\n` +
          `Patente: ${formData.patente}\n` +
          `Motor: ${formData.numeroMotor}\n` +
          `Chasis: ${formData.numeroChasis}\n\n` +
          `📱 *Contacto:*\n` +
          `WhatsApp: ${formData.whatsapp}\n\n` +
          `📄 *Documentación recibida:*\n` +
          `✅ Tarjeta Verde (frente)\n` +
          `✅ Tarjeta Verde (dorso)\n` +
          `✅ Vehículo con fecha\n` +
          `✅ Carnet de conducir\n\n` +
          `🔥 *CLIENTE LISTO PARA COTIZAR Y CONTRATAR!*`;
        
        const whatsappUrl = `https://wa.me/5492615597977?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        setStep(5); // Paso final de confirmación
      }
    } catch (error) {
      console.error('Error saving documentacion:', error);
      alert('Ocurrió un error. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('es-AR');

  return (
    <Layout title="Cotizar Seguro">
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .step-container {
          animation: fadeIn 0.5s ease-out;
        }
        
        .vehicle-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .vehicle-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
        }
        
        .whatsapp-btn {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          transition: all 0.3s ease;
        }
        
        .whatsapp-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
        }
        
        .progress-bar {
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%);
          transition: width 0.5s ease;
        }
      `}</style>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>
            🛡️ Cotiza tu Seguro en 4 Pasos
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
            Proceso rápido y sencillo. Obtén tu cotización personalizada.
          </p>
          
          {/* Progress Bar */}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step >= i ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' : '#e0e0e0',
                  color: step >= i ? 'white' : '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  margin: '0 auto 0.5rem'
                }}>
                  {i}
                </div>
                <div style={{ fontSize: '0.8rem', color: step >= i ? '#ff6b6b' : '#999' }}>
                  {i === 1 && 'Tipo'}
                  {i === 2 && 'Datos'}
                  {i === 3 && 'WhatsApp'}
                  {i === 4 && 'Documentos'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Tipo de Vehículo */}
        {step === 1 && (
          <div className="step-container">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', textAlign: 'center', color: '#333' }}>
              ¿Qué tipo de vehículo quieres asegurar?
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
              Selecciona la opción que corresponde a tu vehículo
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {/* Camioneta */}
              <div 
                onClick={() => handleTipoVehiculo('camioneta')}
                className={`vehicle-card ${formData.tipoVehiculo === 'camioneta' ? 'selected' : ''}`}
                style={{
                  background: formData.tipoVehiculo === 'camioneta' 
                    ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' 
                    : 'white',
                  border: formData.tipoVehiculo === 'camioneta' ? '3px solid #ff6b6b' : '2px solid #e0e0e0',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: formData.tipoVehiculo === 'camioneta' 
                    ? '0 8px 24px rgba(255, 107, 107, 0.3)' 
                    : '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (formData.tipoVehiculo !== 'camioneta') {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.tipoVehiculo !== 'camioneta') {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚚</div>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  marginBottom: '0.5rem',
                  color: formData.tipoVehiculo === 'camioneta' ? 'white' : '#333'
                }}>
                  Camioneta
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: formData.tipoVehiculo === 'camioneta' ? 'rgba(255,255,255,0.9)' : '#666' 
                }}>
                  Cobertura completa para tu camioneta
                </p>
              </div>

              {/* Auto */}
              <div 
                className="vehicle-card"
                onClick={() => handleTipoVehiculo('auto')}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '3px solid #e0e0e0',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚗</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
                  Auto
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Cobertura especial para tu auto
                </p>
              </div>

              {/* Moto */}
              <div 
                className="vehicle-card"
                onClick={() => handleTipoVehiculo('moto')}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '3px solid #e0e0e0',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏍️</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
                  Moto
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Seguro pensado para tu moto
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Marca, Modelo, Año */}
        {step === 2 && (
          <div className="step-container">
            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' }}>
                📋 Datos de tu {formData.tipoVehiculo === 'camioneta' ? 'Camioneta' : formData.tipoVehiculo === 'auto' ? 'Auto' : 'Moto'}
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Marca: *
                </label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Toyota, Ford, Honda"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Modelo: *
                </label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Hilux, Mustang, CBR"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Año: *
                </label>
                <input
                  type="number"
                  name="ano"
                  value={formData.ano}
                  onChange={handleChange}
                  required
                  min="1990"
                  max={new Date().getFullYear()}
                  placeholder="2022"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!formData.marca || !formData.modelo || !formData.ano}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  fontSize: '1.2rem',
                  background: (!formData.marca || !formData.modelo || !formData.ano) ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: (!formData.marca || !formData.modelo || !formData.ano) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: WhatsApp */}
        {step === 3 && (
          <div className="step-container">
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '2.5rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                🎉 ¡Ya casi terminamos!
              </h2>
              
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                  Tu vehículo:
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {formData.marca} {formData.modelo} {formData.ano}
                </div>
              </div>

              <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                📋 Hemos preparado tu cotización personalizada
              </p>
              
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                💡 *Recibirás precios exclusivos y opciones de pago especiales*
              </div>
            </div>

            {/* Form WhatsApp */}
            <form onSubmit={handleWhatsAppSubmit} style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333', textAlign: 'center' }}>
                📱 ¿Cómo quieres recibir tu cotización?
              </h3>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                Ingresa tu número de WhatsApp y te enviaremos el link para ver tu cotización personalizada
              </p>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Número de WhatsApp: *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 2611234567"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #25D366',
                    borderRadius: '8px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#128C7E'}
                  onBlur={(e) => e.target.style.borderColor = '#25D366'}
                />
              </div>

              <button
                type="submit"
                disabled={!formData.whatsapp || loading}
                className="whatsapp-btn"
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  fontSize: '1.3rem',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: (!formData.whatsapp || loading) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? '⏳ Procesando...' : '📱 Enviar Link de Cotización'}
              </button>
              
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
                Recibirás un mensaje con el link para continuar
              </p>
            </form>
          </div>
        )}

        {/* Step 4: Documentos y Fotos */}
        {step === 4 && (
          <div className="step-container">
            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' }}>
                📄 Completa tu cotización
              </h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Para finalizar, necesitamos algunos documentos y fotos
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Patente: *
                </label>
                <input
                  type="text"
                  name="patente"
                  value={formData.patente}
                  onChange={handleTextChange}
                  required
                  placeholder="Ej: ABC123"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Número de motor:
                </label>
                <input
                  type="text"
                  name="numeroMotor"
                  value={formData.numeroMotor}
                  onChange={handleTextChange}
                  placeholder="Opcional"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Número de chasis:
                </label>
                <input
                  type="text"
                  name="numeroChasis"
                  value={formData.numeroChasis}
                  onChange={handleTextChange}
                  placeholder="Opcional"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Dominio del vehículo: *
                </label>
                <input
                  type="text"
                  name="dominio"
                  value={formData.dominio}
                  onChange={handleChange}
                  required
                  placeholder="Ej: ABC123"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
              </div>

              {/* Fotos */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#333' }}>
                  📸 Fotos requeridas:
                </label>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                      Tarjeta verde (frente):
                    </label>
                    <input
                      type="file"
                      name="tarjetaVerdeFrente"
                      onChange={handleFileChange}
                      accept="image/*"
                      capture="environment"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        background: '#f9f9f9'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                      Tarjeta verde (dorso):
                    </label>
                    <input
                      type="file"
                      name="tarjetaVerdeDorso"
                      onChange={handleFileChange}
                      accept="image/*"
                      capture="environment"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        background: '#f9f9f9'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                      Foto del vehículo con cartel de fecha ({today}):
                    </label>
                    <input
                      type="file"
                      name="vehiculoFecha"
                      onChange={handleFileChange}
                      accept="image/*"
                      capture="environment"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        background: '#f9f9f9'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                      Carnet de conducir:
                    </label>
                    <input
                      type="file"
                      name="carnetConducir"
                      onChange={handleFileChange}
                      accept="image/*"
                      capture="environment"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        background: '#f9f9f9'
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => quoteAttemptId && handleFinalSubmit(quoteAttemptId)}
                disabled={loading || !formData.dominio || !formData.patente}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  fontSize: '1.3rem',
                  background: (loading || !formData.dominio) ? '#ccc' : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: (loading || !formData.dominio) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? '⏳ Procesando...' : '📱 Enviar Documentación'}
              </button>
              
              <div style={{
                background: '#f0f9ff',
                padding: '1.5rem',
                borderRadius: '12px',
                marginTop: '1.5rem',
                border: '2px solid #25D366'
              }}>
                <h4 style={{ color: '#128C7E', marginBottom: '1rem', textAlign: 'center' }}>
                  📋 **Importante:**
                </h4>
                <ul style={{ color: '#333', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
                  <li>Se enviará tu documentación al asesor comercial</li>
                  <li>Recibirás respuesta con tu cotización personalizada</li>
                  <li>El proceso es 100% online, no necesitas ir a ninguna oficina</li>
                  <li>Un representante se contactará contigo para finalizar la póliza</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmación Final */}
        {step === 5 && (
          <div className="step-container">
            <div style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              padding: '3rem',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3)',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                ¡Todo Listo!
              </h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.95 }}>
                Tu documentación ha sido enviada exitosamente
              </p>
              
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                  📋 ¿Qué pasa ahora?
                </h3>
                <div style={{ textAlign: 'left', fontSize: '1rem' }}>
                  <p style={{ marginBottom: '1rem' }}>✅ Un asesor comercial ha recibido toda tu información</p>
                  <p style={{ marginBottom: '1rem' }}>✅ Recibirás tu cotización personalizada pronto</p>
                  <p style={{ marginBottom: '1rem' }}>✅ El asesor se contactará contigo para finalizar</p>
                  <p>✅ Tu póliza estará lista en minutos</p>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  background: 'white',
                  color: '#25D366',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🏠 Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
