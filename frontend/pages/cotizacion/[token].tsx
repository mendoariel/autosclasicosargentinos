import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Solicitud {
    id: number;
    clienteNombre: string;
    marca: string;
    modelo: string;
    ano: number;
    estado: string;
    whatsapp: string;
    patente?: string;
    motor?: string;
    chasis?: string;
    fotos?: string[];
}

export default function ClientDashboard() {
    const router = useRouter();
    const { token } = router.query;
    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Technical Data Form
    const [techData, setTechData] = useState({
        patente: '',
        motor: '',
        chasis: ''
    });

    // Files
    const [files, setFiles] = useState<{
        cedulaFrente: File | null;
        cedulaDorso: File | null;
        carnet: File | null;
        pruebaVida: File | null;
    }>({
        cedulaFrente: null,
        cedulaDorso: null,
        carnet: null,
        pruebaVida: null
    });

    // Previews
    const [previews, setPreviews] = useState<{ [key: string]: string | null }>({});

    // State Management
    const [viewMode, setViewMode] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isAdvisor, setIsAdvisor] = useState(false);

    useEffect(() => {
        // Check for Advisor Session (Invisible to clients)
        if (localStorage.getItem('token')) {
            setIsAdvisor(true);
        }

        if (!token) return;

        const fetchSolicitud = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const res = await fetch(`${apiUrl}/api/solicitudes/cliente/${token}`);
                if (!res.ok) throw new Error('Solicitud no encontrada');
                const data = await res.json();
                setSolicitud(data);

                // Populate Technical Data
                setTechData({
                    patente: data.patente || '',
                    motor: data.motor || '',
                    chasis: data.chasis || ''
                });

                // Populate Photo Previews (Smart Slots)
                if (data.fotos) {
                    setPreviews({
                        cedulaFrente: data.fotos[0] ? `${apiUrl}${data.fotos[0]}` : null,
                        cedulaDorso: data.fotos[1] ? `${apiUrl}${data.fotos[1]}` : null,
                        carnet: data.fotos[2] ? `${apiUrl}${data.fotos[2]}` : null,
                        pruebaVida: data.fotos[3] ? `${apiUrl}${data.fotos[3]}` : null
                    });
                }

                // Initialize view mode if content exists or status indicates submission
                if (data.estado === 'FOTOS_SUBIDAS' || data.estado === 'GANADA') {
                    setViewMode(true);
                }
            } catch (err) {
                setError('Enlace inválido o expirado');
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitud();
    }, [token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTechData({
            ...techData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFiles(prev => ({ ...prev, [key]: file }));
            const url = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [key]: url }));
        }
    };

    const getInputStyle = (value: string) => {
        const isFilled = value && value.length > 0;
        return {
            width: '100%',
            background: isFilled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.6)',
            border: isFilled ? '1px solid #ca8a04' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1rem',
            borderRadius: '12px',
            color: isFilled ? '#0f172a' : 'white',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            fontWeight: isFilled ? '600' : 'normal'
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setUploading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const formData = new FormData();

        formData.append('patente', techData.patente);
        formData.append('motor', techData.motor);
        formData.append('chasis', techData.chasis);

        // Helper to append file or existing URL
        const appendPhoto = (field: string, file: File | null, preview: string | null) => {
            if (file) {
                formData.append(field, file);
            } else if (preview) {
                // Strip domain to send relative path
                const relativePath = preview.replace(apiUrl, '');
                formData.append(`existing_${field}`, relativePath);
            }
        };

        appendPhoto('cedulaFrente', files.cedulaFrente, previews.cedulaFrente);
        appendPhoto('cedulaDorso', files.cedulaDorso, previews.cedulaDorso);
        appendPhoto('carnet', files.carnet, previews.carnet);
        appendPhoto('pruebaVida', files.pruebaVida, previews.pruebaVida);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/solicitudes/${token}/fotos`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();

                // Update local state immediately
                setSolicitud(prev => prev ? ({
                    ...prev,
                    estado: 'FOTOS_SUBIDAS',
                    fotos: data.fotos // Backend returns the updated list
                }) : null);

                // Update smart slots previews with the new finalized list from backend
                // This ensures that if the user goes back to Edit, they see the definitive URLs
                const newFotos = data.fotos as string[]; // Cast based on backend response
                if (newFotos) {
                    setPreviews({
                        cedulaFrente: newFotos[0] ? `${apiUrl}${newFotos[0]}` : null,
                        cedulaDorso: newFotos[1] ? `${apiUrl}${newFotos[1]}` : null,
                        carnet: newFotos[2] ? `${apiUrl}${newFotos[2]}` : null,
                        pruebaVida: newFotos[3] ? `${apiUrl}${newFotos[3]}` : null
                    });
                }

                // Success logic
                setViewMode(true);
                setShowSuccessMessage(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert('Error al guardar. Intenta nuevamente.');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="center">Cargando tu gestor...</div>;
    if (error) return <div className="center error">{error}</div>;

    // View Mode Render (Read Only)
    if (viewMode) {
        return (
            <div className="dashboard-container">
                <Head><title>Resumen de Póliza | {solicitud?.marca}</title></Head>

                <div className="main-grid">
                    <div className="view-mode-container">
                        {showSuccessMessage && (
                            <div className="success-banner">
                                <span className="icon">✅</span>
                                <div>
                                    <h3>¡Información Guardada con Éxito!</h3>
                                    <p>Tu asesor ya recibió la notificación. Podés editar si necesitas corregir algo.</p>
                                </div>
                                <button className="close-btn" onClick={() => setShowSuccessMessage(false)}>✕</button>
                            </div>
                        )}

                        <div className="summary-card">
                            <div className="summary-header">
                                <h2>📄 Resumen de Documentación</h2>
                                <button className="btn-edit" onClick={() => setViewMode(false)}>
                                    ✏️ Editar Información
                                </button>
                            </div>

                            <div className="summary-section">
                                <h3>Vehículo</h3>
                                <div className="info-row">
                                    <span>Vehículo:</span> <strong>{solicitud?.marca} {solicitud?.modelo} ({solicitud?.ano})</strong>
                                </div>
                                <div className="info-row">
                                    <span>Titular:</span> <strong>{solicitud?.clienteNombre}</strong>
                                </div>
                            </div>

                            <div className="summary-section">
                                <h3>Datos Técnicos</h3>
                                <div className="data-grid">
                                    <div className="data-item">
                                        <label>Patente</label>
                                        <div className="value">{techData.patente || '-'}</div>
                                    </div>
                                    <div className="data-item">
                                        <label>Motor</label>
                                        <div className="value">{techData.motor || '-'}</div>
                                    </div>
                                    <div className="data-item">
                                        <label>Chasis</label>
                                        <div className="value">{techData.chasis || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-section">
                                <h3>Fotos Cargadas</h3>
                                <div className="photos-grid">
                                    {Object.entries(previews).map(([key, url]) => (
                                        url && (
                                            <div key={key} className="photo-preview-item">
                                                <img src={url} alt={key} />
                                                <span className="photo-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            </div>
                                        )
                                    ))}
                                    {Object.keys(previews).length === 0 && <p className="no-data">No hay fotos para previsualizar actuales.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="advisor-contact">
                            <p>¿Tenes dudas o necesitas ayuda?</p>
                            <button
                                onClick={() => window.open(`https://wa.me/5492615597977?text=${encodeURIComponent(`Hola Araceli, soy ${solicitud?.clienteNombre || 'un cliente'}. Tengo una consulta sobre la documentación de mi ${solicitud?.marca} ${solicitud?.modelo}.`)}`, '_blank')}
                                className="btn-whatsapp"
                            >
                                Contactar a mi Asesor
                            </button>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .dashboard-container { min-height: 100vh; background: #0f172a; font-family: 'Inter', sans-serif; color: #e2e8f0; padding: 2rem 1rem; }
                    .main-grid { max-width: 800px; margin: 0 auto; }
                    
                    .previous-status-banner {
                        background: rgba(202, 138, 4, 0.1); border: 1px solid rgba(202, 138, 4, 0.2); 
                        color: #ca8a04; padding: 1rem; border-radius: 12px; margin-bottom: 2rem; text-align: center;
                    }

                    .success-banner {
                        background: rgba(22, 163, 74, 0.15); border: 1px solid #16a34a; 
                        padding: 1.5rem; border-radius: 12px; display: flex; align-items: flex-start; gap: 1rem;
                        margin-bottom: 2rem; animation: slideDown 0.5s ease;
                    }
                    .success-banner h3 { color: #4ade80; margin: 0 0 0.25rem 0; font-size: 1.1rem; }
                    .success-banner p { color: #bbf7d0; margin: 0; font-size: 0.95rem; }
                    .success-banner .icon { font-size: 1.5rem; }
                    .close-btn { background: none; border: none; color: #bbf7d0; font-size: 1.2rem; cursor: pointer; margin-left: auto; }

                    .summary-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 2rem; margin-bottom: 2rem; }
                    .summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
                    .summary-header h2 { margin: 0; color: white; font-size: 1.5rem; }
                    
                    .btn-edit { 
                        background: transparent; border: 1px solid #64748b; color: #cbd5e1; 
                        padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-weight: 500;
                    }
                    .btn-edit:hover { background: rgba(255,255,255,0.05); border-color: #94a3b8; color: white; }

                    .summary-section { margin-bottom: 2rem; }
                    .summary-section h3 { color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.5px; }
                    
                    .info-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                    .info-row span { color: #cbd5e1; }
                    .info-row strong { color: white; }

                    .data-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
                    .data-item label { display: block; color: #64748b; font-size: 0.8rem; margin-bottom: 0.25rem; }
                    .data-item .value { color: #facc15; font-family: monospace; font-size: 1.1rem; }

                    .photos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; }
                    .photo-preview-item { text-align: center; }
                    .photo-preview-item img { width: 100%; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #475569; }
                    .photo-label { display: block; font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem; text-transform: capitalize; }
                    .no-data { color: #64748b; font-style: italic; font-size: 0.9rem; }

                    .advisor-contact { text-align: center; margin-top: 3rem; border-top: 1px solid #334155; padding-top: 2rem; }
                    .advisor-contact p { color: #94a3b8; margin-bottom: 1rem; }
                    .btn-whatsapp { 
                        background: #10b981; color: white; border: none; padding: 0.75rem 2rem; 
                        border-radius: 50px; font-weight: 600; cursor: pointer; transition: transform 0.2s; 
                    }
                    .btn-whatsapp:hover { transform: scale(1.05); }

                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @media(max-width: 600px) {
                        .data-grid { grid-template-columns: 1fr; }
                        .summary-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
                        .btn-edit { width: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Head>
                <title>Gestión de Póliza | {solicitud?.marca}</title>
            </Head>

            {/* Premium Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="brand">
                        <span className="logo-icon">🛡️</span>
                        <div className="brand-text">
                            <span className="brand-title">AUTOS CLÁSICOS</span>
                            <span className="brand-subtitle">Gestión Privada</span>
                        </div>
                    </div>

                    <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Advisor Back Button (Conditional) */}
                        {isAdvisor && (
                            <button
                                onClick={() => router.push('/asesor/dashboard')}
                                className="btn-advisor-back"
                            >
                                ← Volver al Panel
                            </button>
                        )}

                        <div className={`status-pill ${solicitud?.estado === 'FOTOS_SUBIDAS' || solicitud?.estado === 'GANADA' ? 'success' : 'pending'}`}>
                            <span className="dot"></span>
                            {solicitud?.estado === 'FOTOS_SUBIDAS' || solicitud?.estado === 'GANADA' ? 'DOCUMENTACIÓN COMPLETA' : 'DOCUMENTACIÓN PENDIENTE'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-grid">
                {/* Left Col: Vehicle Summary */}
                <aside className="vehicle-card">
                    <div className="card-header">
                        <h3>Tu Clásico</h3>
                    </div>
                    <div className="vehicle-details">
                        <div className="detail-row">
                            <label>Vehículo</label>
                            <div className="value">{solicitud?.marca} {solicitud?.modelo}</div>
                        </div>
                        <div className="detail-row">
                            <label>Año</label>
                            <div className="value">{solicitud?.ano}</div>
                        </div>
                        <div className="detail-row">
                            <label>Titular</label>
                            <div className="value highlight">{solicitud?.clienteNombre}</div>
                        </div>
                    </div>
                    <div className="help-box">
                        <p>¿Tenes dudas?</p>
                        <button onClick={() => window.open(`https://wa.me/5491112345678`, '_blank')} className="btn-whatsapp-sm">
                            Contactar Asesor
                        </button>
                    </div>
                </aside>

                {/* Right Col: Action Form */}
                <section className="form-section">
                    <div className="section-header">
                        <h2>Completar Legajo</h2>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <p style={{ color: '#93c5fd', margin: 0, fontSize: '0.95rem' }}>
                                ✅ <strong>Tu número ya fue asignado a un asesor (Araceli).</strong><br />
                                Podes esperar a que te contacte, o <strong>avanzar ahora</strong> completando la documentación para acelerar la póliza.
                            </p>
                        </div>
                        <p>Documentación requerida para el alta:</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* 1. Datos Técnicos */}
                        <div className="group-container">
                            <h3 className="group-title">📋 Datos Técnicos</h3>
                            <div className="fields-grid">
                                <div>
                                    <label>Patente</label>
                                    <input
                                        name="patente"
                                        value={techData.patente}
                                        onChange={handleInputChange}
                                        placeholder="AA 000 BB"
                                        style={getInputStyle(techData.patente)}
                                    />
                                </div>
                                <div>
                                    <label>Motor</label>
                                    <input
                                        name="motor"
                                        value={techData.motor}
                                        onChange={handleInputChange}
                                        placeholder="Ver cédula"
                                        style={getInputStyle(techData.motor)}
                                    />
                                </div>
                                <div>
                                    <label>Chasis</label>
                                    <input
                                        name="chasis"
                                        value={techData.chasis}
                                        onChange={handleInputChange}
                                        placeholder="Ver cédula"
                                        style={getInputStyle(techData.chasis)}
                                    />
                                </div>
                            </div>
                        </div>


                        {/* 2. Documentacion (4 Fotos) */}
                        <div className="group-container">
                            <h3 className="group-title">📸 Documentación (4 Fotos)</h3>



                            <div className="uploads-grid">
                                <UploadCard
                                    label="Cédula Frente"
                                    icon="🪪"
                                    preview={previews.cedulaFrente}
                                    onChange={handleFileChange('cedulaFrente')}
                                    isFilled={!!files.cedulaFrente}
                                />
                                <UploadCard
                                    label="Cédula Dorso"
                                    icon="🔄"
                                    preview={previews.cedulaDorso}
                                    onChange={handleFileChange('cedulaDorso')}
                                    isFilled={!!files.cedulaDorso}
                                />
                                <UploadCard
                                    label="Licencia Cond."
                                    icon="🚗"
                                    preview={previews.carnet}
                                    onChange={handleFileChange('carnet')}
                                    isFilled={!!files.carnet}
                                />
                                <UploadCard
                                    label="Prueba de Vida"
                                    icon="📅"
                                    hint="Foto del auto con fecha de hoy"
                                    preview={previews.pruebaVida}
                                    onChange={handleFileChange('pruebaVida')}
                                    isFilled={!!files.pruebaVida}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={uploading} className="btn-submit">
                            {uploading ? 'GUARDANDO...' : 'GUARDAR Y ENVIAR A REVISIÓN'}
                        </button>
                    </form>
                </section>
            </main>

            <style jsx>{`
                /* Premium Dashboard Theme */
                .dashboard-container {
                    min-height: 100vh;
                    background: #0f172a;
                    font-family: 'Inter', sans-serif;
                    color: #e2e8f0;
                }

                .center { display: flex; justify-content: center; align-items: center; height: 100vh; color: #94a3b8; }

                /* Header */
                .dashboard-header {
                    background: #1e293b;
                    border-bottom: 1px solid #334155;
                    padding: 1rem 0;
                    position: sticky; top: 0; z-index: 10;
                }

                .header-content {
                    max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
                    display: flex; justify-content: space-between; align-items: center;
                }

                .brand { display: flex; align-items: center; gap: 12px; }
                .logo-icon { font-size: 1.8rem; }
                .brand-text { display: flex; flex-direction: column; }
                .brand-title { color: #f8fafc; font-weight: 700; letter-spacing: 1px; font-size: 1.1rem; }
                .brand-subtitle { color: #ca8a04; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; }

                .status-pill {
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    display: flex; align-items: center; gap: 8px;
                    transition: all 0.3s ease;
                }
                .status-pill.pending {
                    background: rgba(202, 138, 4, 0.1);
                    color: #ca8a04;
                    border: 1px solid rgba(202, 138, 4, 0.2);
                }
                .status-pill.success {
                    background: rgba(22, 163, 74, 0.15);
                    color: #4ade80;
                    border: 1px solid rgba(22, 163, 74, 0.3);
                    box-shadow: 0 0 10px rgba(22, 163, 74, 0.1);
                }
                .dot { width: 8px; height: 8px; background: currentColor; border-radius: 50%; box-shadow: 0 0 5px currentColor; }

                .btn-advisor-back {
                    background: rgba(30, 41, 59, 0.8);
                    color: #94a3b8;
                    border: 1px solid #475569;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }
                .btn-advisor-back:hover {
                    color: white;
                    border-color: #cbd5e1;
                    background: rgba(30, 41, 59, 1);
                }

                /* Layout */
                .main-grid {
                    max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem;
                    display: grid; grid-template-columns: 300px 1fr; gap: 2rem;
                }

                @media(max-width: 768px) { .main-grid { grid-template-columns: 1fr; } }

                /* Sidebar / Vehicle Card */
                .vehicle-card {
                    background: linear-gradient(145deg, #1e293b, #0f172a);
                    border: 1px solid #334155;
                    border-radius: 16px;
                    padding: 1.5rem;
                    height: fit-content;
                    position: sticky; top: 100px;
                }

                .card-header h3 { margin: 0 0 1.5rem 0; color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }

                .detail-row { margin-bottom: 1.25rem; }
                .detail-row label { display: block; color: #64748b; font-size: 0.8rem; margin-bottom: 4px; }
                .value { color: #f1f5f9; font-size: 1.1rem; font-weight: 500; }
                .value.highlight { color: #ca8a04; font-family: serif; font-size: 1.2rem; }

                .help-box { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #334155; text-align: center; }
                .help-box p { font-size: 0.9rem; color: #94a3b8; margin-bottom: 1rem; }
                .btn-whatsapp-sm {
                    background: transparent; border: 1px solid #10b981; color: #10b981;
                    padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: all 0.2s;
                    font-size: 0.85rem; width: 100%;
                }
                .btn-whatsapp-sm:hover { background: rgba(16, 185, 129, 0.1); }

                /* Form Area */
                .form-section { }
                .section-header { margin-bottom: 2rem; }
                .section-header h2 { font-size: 2rem; color: white; margin-bottom: 0.5rem; }
                .section-header p { color: #94a3b8; font-size: 1.1rem; }

                .group-container {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .group-title { color: #e2e8f0; margin: 0 0 1.5rem 0; font-size: 1.2rem; display: flex; align-items: center; gap: 10px; }

                .fields-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
                .fields-grid label { display: block; color: #94a3b8; margin-bottom: 0.5rem; font-size: 0.9rem; }

                .existing-photos {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                }
                .existing-photos h4 { color: #94a3b8; margin: 0 0 1rem 0; font-size: 0.9rem; }
                .photos-mini-grid { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 0.5rem; }
                .mini-photo img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #475569; }
                .existing-photos .note { font-size: 0.8rem; color: #64748b; margin-top: 0.5rem; font-style: italic; }

                .uploads-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; }

                /* Button */
                .btn-submit {
                    width: 100%;
                    background: linear-gradient(135deg, #ca8a04 0%, #a16207 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem;
                    font-size: 1.1rem;
                    font-weight: 700;
                    border-radius: 12px;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(202, 138, 4, 0.2);
                    transition: transform 0.2s;
                }
                .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(202, 138, 4, 0.3); }
                .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

            `}</style>
        </div>
    );
}

// Upload Card Component
function UploadCard({ label, icon, hint, preview, onChange, isFilled }: any) {
    return (
        <label className={`upload-card ${isFilled ? 'filled' : ''}`}>
            <input type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />

            {preview ? (
                <div className="preview-mode">
                    <img src={preview} alt="Preview" />
                    <div className="change-overlay">Cambiar</div>
                </div>
            ) : (
                <div className="empty-mode">
                    <span className="icon">{icon}</span>
                    <span className="label">{label}</span>
                    {hint && <span className="hint">{hint}</span>}
                    <span className="btn-fake">Subir Foto +</span>
                </div>
            )}

            <style jsx>{`
                .upload-card {
                    background: rgba(30, 41, 59, 0.6);
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    height: 180px;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.2s;
                    position: relative;
                }
                .upload-card:hover { border-color: #ca8a04; background: rgba(202, 138, 4, 0.05); }
                
                .upload-card.filled { border-style: solid; border-color: #ca8a04; }

                .empty-mode {
                    height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 1rem;
                }
                .icon { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.7; }
                .label { color: #e2e8f0; font-weight: 500; font-size: 0.9rem; margin-bottom: 0.5rem; }
                .hint { font-size: 0.7rem; color: #94a3b8; margin-bottom: 0.5rem; }
                .btn-fake {
                    font-size: 0.75rem; color: #ca8a04; background: rgba(202, 138, 4, 0.1);
                    padding: 4px 10px; border-radius: 4px; font-weight: 600;
                }

                .preview-mode { height: 100%; position: relative; }
                .preview-mode img { width: 100%; height: 100%; object-fit: cover; }
                .change-overlay {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    background: rgba(0,0,0,0.7); color: white;
                    text-align: center; padding: 4px; font-size: 0.8rem;
                    opacity: 0; transition: opacity 0.2s;
                }
                .upload-card:hover .change-overlay { opacity: 1; }
            `}</style>
        </label>
    );
}
