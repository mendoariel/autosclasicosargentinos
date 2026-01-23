import React from 'react';
import Layout from '../../components/Layout';

const ContinuarCotizacion = () => {
  return (
    <Layout title="Continuar Cotización">
      <div style={{ padding: '2rem' }}>
        <h1>🎉 ¡Tu Cotización Personalizada!</h1>
        <p>Hemos preparado una cotización especial para tu vehículo</p>
        
        <div style={{ 
          background: '#667eea', 
          color: 'white', 
          padding: '2rem', 
          borderRadius: '16px',
          marginBottom: '2rem'
        }}>
          <h2>📋 Tu Vehículo</h2>
          <p><strong>FORD FALCON 1977</strong></p>
          <p>Contacto: 2615597977</p>
        </div>

        <h2>💰 Opciones de Cobertura</h2>
        
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3>📅 Pago Mensual - $9.500</h3>
          <p>Flexibilidad máxima</p>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          border: '1px solid #25D366',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3>🎯 Pago Trimestral - $25.650</h3>
          <p>10% DESCUENTO</p>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3>🏆 Pago Anual - $79.800</h3>
          <p>30% DESCUENTO</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              const message = '🚗 QUIERO CONTRATAR SEGURO - AUTOS CLÁSICOS\n\nTipo: Auto\nMarca: FORD\nModelo: FALCON\nAño: 1977\n\nContacto: 2615597977\n\nInteresado en contratar póliza!';
              const whatsappUrl = 'https://wa.me/5492615597977?text=' + encodeURIComponent(message);
              window.open(whatsappUrl, '_blank');
            }}
            style={{
              padding: '1.5rem 3rem',
              fontSize: '1.3rem',
              background: '#25D366',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            📱 Contratar Ahora
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ContinuarCotizacion;
