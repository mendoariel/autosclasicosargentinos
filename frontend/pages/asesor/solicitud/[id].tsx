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
    estado: string;
    fotos: string[];
    patente: string;
    motor: string;
    chasis: string;
    createdAt: string;
    tokenCliente: string;
}

export default function SolicitudDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/asesor/login');
            return;
        }

        // We reuse the list endpoint? No, we need a detail endpoint or filter the list.
        // For urgency/MVP, let's fetch list and find. Ideally backend should have GET /:id but list is cached/fast enough for MVP size.
        // Actually, backend DOES NOT have GET /:id for advisor yet (only by token for external). 
        // Let's add GET /api/solicitudes/:id to backend OR just filter client-side if the list is small (it is).
        // Let's try filtering client side from the full list for speed, OR implement endpoint. 
        // Given I can't easily change backend right now without more context switch, I'll implement GET /api/solicitudes (list) and filter.
        // WAIT: I added `getAllSolicitudes` which returns ALL. I can use that and filter.

        fetchSolicitud(token);
    }, [id]);

    const fetchSolicitud = async (token: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/solicitudes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data: Solicitud[] = await res.json();
                const found = data.find(s => s.id === parseInt(id as string));
                setSolicitud(found || null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsWon = async () => {
        if (!solicitud) return;
        if (!confirm('¿Confirmar venta GANADA?')) return;

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

            await fetch(`${apiUrl}/api/solicitudes/${solicitud.id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: 'GANADA' })
            });

            alert('Estado actualizado!');
            router.push('/asesor/dashboard');
        } catch (error) {
            alert('Error al actualizar');
        }
    };

    if (loading) return <div className="center">Cargando legajo...</div>;
    if (!solicitud) return <div className="center">Solicitud no encontrada</div>;

    return (
        <div className="layout">
            <Head><title>Legajo #{solicitud.id}</title></Head>

            <header className="topbar">
                <button onClick={() => router.push('/asesor/dashboard')} className="btn-back">← Volver al Panel</button>
                <h1>Legajo Digital</h1>
                <div className="status">{solicitud.estado}</div>
            </header>

            <div className="container">
                <div className="grid">
                    {/* Info Card */}
                    <div className="card info">
                        <h2>🚗 Vehículo y Cliente</h2>
                        <div className="row">
                            <label>Cliente:</label> <span>{solicitud.clienteNombre}</span>
                        </div>
                        <div className="row">
                            <label>Teléfono:</label> <span>{solicitud.whatsapp}</span>
                        </div>
                        <div className="row">
                            <label>Vehículo:</label> <span>{solicitud.marca} {solicitud.modelo} {solicitud.ano}</span>
                        </div>
                        <hr />
                        <div className="row">
                            <label>Patente:</label> <span className="highlight">{solicitud.patente || '-'}</span>
                        </div>
                        <div className="row">
                            <label>Motor:</label> <span className="highlight">{solicitud.motor || '-'}</span>
                        </div>
                        <div className="row">
                            <label>Chasis:</label> <span className="highlight">{solicitud.chasis || '-'}</span>
                        </div>

                        <div className="actions">
                            <button onClick={handleMarkAsWon} className="btn-win">🏆 Marcar Ganada</button>

                            {/* Dynamic Action Button */}
                            {solicitud.fotos && solicitud.fotos.length > 0 ? (
                                <a
                                    href={`https://wa.me/${solicitud.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${solicitud.clienteNombre}, recibí la documentación de tu ${solicitud.marca} ${solicitud.modelo} y está perfecta. ✅\n\n¿Tendrás unos minutos para coordinar la emisión de la póliza?\n\nTe dejo el link de tu trámite por si necesitás consultar algo:\n${window.location.origin}/cotizacion/${solicitud.tokenCliente}`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-secondary"
                                    style={{ display: 'block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none', borderColor: '#ca8a04', color: '#facc15' }}
                                >
                                    📱 Contactar Cliente
                                </a>
                            ) : (
                                <a
                                    href={`https://wa.me/${solicitud.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${solicitud.clienteNombre}, para avanzar con el seguro de tu ${solicitud.marca} ${solicitud.modelo}, por favor completá los datos y fotos en este link seguro: ${window.location.origin}/cotizacion/${solicitud.tokenCliente}`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-secondary"
                                    style={{ display: 'block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}
                                >
                                    📱 Solicitar Documentación
                                </a>
                            )}

                            {/* Admin Contact Button */}
                            <a
                                href={`https://wa.me/5492615597977?text=${encodeURIComponent(`*SOLICITUD DE EMISIÓN*\n\n*Cliente:* ${solicitud.clienteNombre}\n*Vehículo:* ${solicitud.marca} ${solicitud.modelo} ${solicitud.ano}\n\n*Datos Técnicos:*\nPatente: ${solicitud.patente || 'Pendiente'}\nMotor: ${solicitud.motor || 'Pendiente'}\nChasis: ${solicitud.chasis || 'Pendiente'}\n\n_Adjunto fotos a continuación:_`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-admin"
                                style={{ display: 'block', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}
                            >
                                📤 Enviar al Administrador
                            </a>
                        </div>
                    </div>

                    {/* Photos Grid */}
                    <div className="card photos">
                        <h2>📸 Documentación ({solicitud.fotos.length})</h2>
                        <div className="gallery">
                            {solicitud.fotos.length === 0 ? (
                                <p className="no-photos">No hay fotos cargadas aún.</p>
                            ) : (
                                solicitud.fotos.map((foto, i) => (
                                    <div key={i} className="photo-item">
                                        <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${foto}`} target="_blank" rel="noreferrer">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${foto}`}
                                                alt={`Doc ${i}`}
                                            />
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .layout { background: #0f172a; min-height: 100vh; color: #e2e8f0; font-family: 'Inter', sans-serif; }
                .center { height: 100vh; display: flex; align-items: center; justify-content: center; }
                
                .topbar { 
                    background: #1e293b; padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #334155;
                }
                .btn-back { background: none; border: 1px solid #475569; color: #cbd5e1; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
                h1 { margin: 0; font-size: 1.2rem; flex: 1; }
                
                .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
                .grid { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; }
                
                .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem; }
                h2 { margin-top: 0; color: #94a3b8; font-size: 1rem; text-transform: uppercase; border-bottom: 1px solid #334155; padding-bottom: 1rem; margin-bottom: 1.5rem; }
                
                .row { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .row label { color: #64748b; }
                .highlight { color: #facc15; font-family: monospace; font-size: 1.1rem; }

                .actions { margin-top: 2rem; }
                .btn-win { width: 100%; background: #16a34a; color: white; border: none; padding: 1rem; border-radius: 8px; font-weight: bold; cursor: pointer; }
                .btn-secondary { width: 100%; background: transparent; border: 1px solid #475569; color: #cbd5e1; padding: 1rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s; box-sizing: border-box; }
                .btn-secondary:hover { border-color: #94a3b8; color: white; background: rgba(255,255,255,0.05); }

                .btn-admin { width: 100%; background: rgba(59, 130, 246, 0.15); border: 1px solid #3b82f6; color: #60a5fa; padding: 1rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s; box-sizing: border-box; }
                .btn-admin:hover { background: rgba(59, 130, 246, 0.25); color: #93c5fd; }

                .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
                .photo-item img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #475569; transition: transform 0.2s; }
                .photo-item img:hover { transform: scale(1.02); }
                .no-photos { color: #64748b; font-style: italic; }

                @media(max-width: 768px) { .grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
