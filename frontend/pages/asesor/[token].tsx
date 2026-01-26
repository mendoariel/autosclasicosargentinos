import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Solicitud {
  id: number;
  clienteNombre: string;
  marca: string;
  modelo: string;
  ano: number;
  whatsapp: string;
  tokenCliente: string;
  createdAt: string;
  fotos?: string[]; // Array of photo URLs
}

export default function AsesorDashboard() {
  const router = useRouter();
  const { token } = router.query;
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchSolicitud = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/solicitudes/asesor/${token}`);
        if (!res.ok) throw new Error('Solicitud no encontrada');
        const data = await res.json();
        setSolicitud(data);

        // If there are photos, set the first one as active to show mostly likely the car
        if (data.fotos && data.fotos.length > 0) {
          // logic to handle if fotos is array of objects or strings, assuming strings based on typical simplified implementations
          // or adapting if needed. For now assuming string URLs.
        }
      } catch (err) {
        setError('Enlace inválido o expirado');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [token]);

  const handleWhatsAppClick = () => {
    if (!solicitud) return;

    const frontendUrl = window.location.origin;
    const clienteLink = `${frontendUrl}/cotizacion/${solicitud.tokenCliente}`;

    const message =
      `Hola ${solicitud.clienteNombre || ''}! 👋\n` +
      `Vi tu pedido de cotización para el *${solicitud.marca} ${solicitud.modelo} ${solicitud.ano}*.\n\n` +
      `Para avanzar, necesito que revises este link:\n` +
      `${clienteLink}\n\n` +
      `Cualquier duda decime!`;

    const whatsappUrl = `https://wa.me/${solicitud.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return (
    <div className="dashboard-container center">
      <div className="spinner"></div>
      <style jsx>{`
                .center { display: flex; justify-content: center; align-items: center; }
                .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
    </div>
  );

  if (error) return (
    <div className="dashboard-container center">
      <div className="error-box">
        <span style={{ fontSize: '2rem' }}>⚠️</span>
        <p>{error}</p>
      </div>
      <style jsx>{`
                .center { display: flex; justify-content: center; align-items: center; }
                .error-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; padding: 2rem; border-radius: 12px; text-align: center; }
            `}</style>
    </div>
  );

  if (!solicitud) return null;

  const hasPhotos = solicitud.fotos && solicitud.fotos.length > 0;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  return (
    <div className="dashboard-container">
      <Head>
        <title>Advisor Panel | {solicitud.marca} {solicitud.modelo}</title>
      </Head>

      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="dot"></span>
            ADVISOR <strong>PANEL</strong>
          </div>
          <div className="status-badge">
            <span className="status-dot"></span>
            ONLINE
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="grid-layout">

          {/* Left Column: Lead Info */}
          <div className="col-left">
            <div className="card lead-card">
              <div className="card-header">
                <span className="label">LEAD INFO</span>
                <span className="time-badge">{new Date(solicitud.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 className="client-name">{solicitud.clienteNombre || 'Cliente Sin Nombre'}</h1>

              <div className="info-grid">
                <div className="info-item">
                  <label>WhatsApp</label>
                  <div className="value highlighted">{solicitud.whatsapp}</div>
                </div>
                <div className="info-item">
                  <label>ID Solicitud</label>
                  <div className="value">#{solicitud.id}</div>
                </div>
              </div>

              <div className="actions">
                <button onClick={handleWhatsAppClick} className="btn-whatsapp">
                  <span>💬 Contactar por WhatsApp</span>
                  <div className="icon-arrow">→</div>
                </button>
                <p className="action-hint">Abre WA Web con mensaje pre-cargado</p>
              </div>
            </div>

            <div className="card specs-card">
              <div className="card-header">
                <span className="label">VEHÍCULO</span>
              </div>
              <div className="specs-list">
                <div className="spec-row">
                  <span className="spec-label">Marca</span>
                  <span className="spec-value">{solicitud.marca}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Modelo</span>
                  <span className="spec-value highlight-text">{solicitud.modelo}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Año</span>
                  <span className="spec-value">{solicitud.ano}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="col-right">
            <div className="card photo-card">
              <div className="card-header">
                <span className="label">INSPECCIÓN VISUAL</span>
                {hasPhotos ? (
                  <span className="photo-count">{solicitud.fotos?.length} FOTO(S)</span>
                ) : (
                  <span className="photo-count warning">SIN FOTOS</span>
                )}
              </div>

              <div className="photo-viewer">
                {hasPhotos ? (
                  <>
                    {/* Main viewing area could be a carousel, simple list for now */}
                    <div className="photo-grid">
                      {solicitud.fotos?.map((foto, index) => (
                        <div key={index} className="photo-item" onClick={() => setActivePhoto(`${apiUrl}${foto}`)}>
                          <img src={`${apiUrl}${foto}`} alt={`Vehículo ${index + 1}`} />
                          <div className="zoom-overlay">🔍</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="no-photos-placeholder">
                    <div className="placeholder-icon">📷</div>
                    <p>El cliente no ha subido fotos aún.</p>
                    <button className="btn-request" onClick={handleWhatsAppClick}>
                      Solicitar Fotos
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="lightbox" onClick={() => setActivePhoto(null)}>
          <img src={activePhoto} alt="Full size" />
          <button className="close-btn">×</button>
        </div>
      )}

      <style jsx>{`
                /* Theme Variables - Advisor Command Center */
                :global(body) {
                    background: #0f172a; /* Slate 900 */
                    margin: 0;
                }

                .dashboard-container {
                    min-height: 100vh;
                    background: #0f172a;
                    color: #e2e8f0;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }

                .navbar {
                    height: 60px;
                    border-bottom: 1px solid #1e293b;
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .nav-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                }

                .logo {
                    font-size: 1rem;
                    letter-spacing: 1px;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .status-dot { width: 6px; height: 6px; background: currentColor; border-radius: 50%; box-shadow: 0 0 8px currentColor; }

                .main-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1.5rem;
                }

                .grid-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .grid-layout { grid-template-columns: 1fr; }
                }

                /* Cards */
                .card {
                    background: #1e293b; /* Slate 800 */
                    border: 1px solid #334155;
                    border-radius: 16px;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
                }

                .card-header {
                    padding: 1.25rem;
                    border-bottom: 1px solid #334155;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 700;
                    color: #64748b;
                }

                .time-badge {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    background: #334155;
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .lead-card {
                    padding-bottom: 1rem;
                }
                
                .lead-card h1 {
                    padding: 1.5rem 1.25rem 0.5rem;
                    margin: 0;
                    font-size: 1.8rem;
                    color: #f1f5f9;
                    font-weight: 600;
                }

                .info-grid {
                    padding: 1.25rem;
                    display: grid;
                    gap: 1.25rem;
                }

                .info-item label {
                    display: block;
                    font-size: 0.75rem;
                    color: #64748b;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                }

                .value { font-size: 1.1rem; color: #cbd5e1; }
                .value.highlighted { color: #fff; font-family: monospace; letter-spacing: 0.5px; }

                .actions { padding: 1.25rem; border-top: 1px solid #334155; }

                .btn-whatsapp {
                    width: 100%;
                    background: #10b981; /* Emerald 500 */
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .btn-whatsapp:hover {
                    background: #059669;
                    transform: translateY(-1px);
                }
                
                .action-hint {
                    text-align: center;
                    font-size: 0.75rem;
                    color: #64748b;
                    margin-top: 0.75rem;
                }

                .specs-list { padding: 0.5rem 0; }
                
                .spec-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid #334155;
                }
                
                .spec-row:last-child { border-bottom: none; }

                .spec-label { color: #94a3b8; font-size: 0.9rem; }
                .spec-value { color: #e2e8f0; font-weight: 500; }
                .highlight-text { color: #3b82f6; }

                /* Photos */
                .photo-count {
                    font-size: 0.75rem;
                    background: #334155;
                    padding: 2px 8px;
                    border-radius: 4px;
                    color: #e2e8f0;
                }
                
                .photo-count.warning { background: rgba(239, 68, 68, 0.2); color: #f87171; }

                .photo-viewer {
                    padding: 1.25rem;
                    min-height: 300px;
                }

                .photo-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1rem;
                }

                .photo-item {
                    aspect-ratio: 4/3;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                    cursor: pointer;
                    border: 1px solid #475569;
                    transition: border-color 0.2s;
                }

                .photo-item:hover { border-color: #3b82f6; }

                .photo-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s;
                }

                .photo-item:hover img { transform: scale(1.05); }

                .zoom-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                    font-size: 1.5rem;
                }

                .photo-item:hover .zoom-overlay { opacity: 1; }

                .no-photos-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                    text-align: center;
                    color: #64748b;
                }

                .placeholder-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

                .btn-request {
                    margin-top: 1.5rem;
                    background: transparent;
                    border: 1px solid #475569;
                    color: #cbd5e1;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-request:hover {
                    border-color: #10b981;
                    color: #10b981;
                }

                /* Lightbox */
                .lightbox {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.95);
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    animation: fadeIn 0.2s;
                }

                .lightbox img {
                    max-width: 100%;
                    max-height: 90vh;
                    box-shadow: 0 0 50px rgba(0,0,0,0.5);
                }

                .close-btn {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
    </div>
  );
}
