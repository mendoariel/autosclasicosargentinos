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
    tokenCliente: string;
    createdAt: string;
    fotos: string[];
}

export default function AsesorDashboard() {
    const router = useRouter();
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'NUEVAS' | 'FOTOS' | 'HISTORIAL'>('NUEVAS');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Auth Check
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            router.push('/asesor/login');
            return;
        }

        setUser(JSON.parse(storedUser));
        fetchSolicitudes(token);
    }, []);

    const fetchSolicitudes = async (token: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/solicitudes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setSolicitudes(data);
            }
        } catch (error) {
            console.error('Error fetching solicitudes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsWon = async (id: number) => {
        if (!confirm('¿Marcar venta como GANADA?')) return;

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

            await fetch(`${apiUrl}/api/solicitudes/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: 'GANADA' })
            });

            // Refresh list
            fetchSolicitudes(token!);
        } catch (error) {
            alert('Error al actualizar estado');
        }
    };

    const getFilteredList = () => {
        return solicitudes.filter(s => {
            const hasPhotos = s.fotos && s.fotos.length > 0;

            if (activeTab === 'NUEVAS') {
                return s.estado === 'NUEVA';
            }
            if (activeTab === 'FOTOS') {
                return s.estado === 'FOTOS_SUBIDAS';
            }
            if (activeTab === 'HISTORIAL') return ['GANADA', 'PERDIDA'].includes(s.estado);
            return false;
        });
    };

    const getWhatsappLink = (s: Solicitud) => {
        const link = `${window.location.origin}/cotizacion/${s.tokenCliente}`;
        const msg = `Hola ${s.clienteNombre}, soy tu asesor de Autos Clásicos. Vi tu pedido por el ${s.marca} ${s.modelo}. Para avanzar, por favor cargá las fotos en este link seguro: ${link}`;
        return `https://wa.me/${s.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    };

    if (loading) return <div className="center-screen">Cargando panel...</div>;

    return (
        <div className="dashboard-layout">
            <Head>
                <title>Panel Asesor | Autos Clásicos</title>
            </Head>

            {/* Topbar */}
            <nav className="topbar">
                <div className="brand" onClick={() => router.reload()} style={{ cursor: 'pointer' }}>🛡️ Panel Asesor</div>

                <a href="/cotizar" className="btn-cotizar" target="_blank">
                    COTIZAR
                </a>

                <div className="user-info">
                    <span>Hola, {user?.nombre}</span>
                    <button onClick={() => {
                        localStorage.clear();
                        router.push('/asesor/login');
                    }} className="btn-logout">Salir</button>
                </div>
            </nav>

            <div className="container">
                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'NUEVAS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('NUEVAS')}
                    >
                        Nuevas Cotizaciones
                        <span className="badge">
                            {solicitudes.filter(s => s.estado === 'NUEVA' && (!s.fotos || s.fotos.length === 0)).length}
                        </span>
                    </button>
                    <button
                        className={`tab ${activeTab === 'FOTOS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('FOTOS')}
                    >
                        Con Documentación
                        <span className="badge badge-green">
                            {solicitudes.filter(s => s.estado === 'FOTOS_SUBIDAS' || (s.fotos && s.fotos.length > 0)).length}
                        </span>
                    </button>
                    <button
                        className={`tab ${activeTab === 'HISTORIAL' ? 'active' : ''}`}
                        onClick={() => setActiveTab('HISTORIAL')}
                    >
                        Historial
                    </button>
                </div>

                {/* Table Container */}
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Vehículo</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                {(activeTab === 'FOTOS' || activeTab === 'NUEVAS') && <th>Fotos</th>}
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredList().length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty-state">No hay solicitudes en esta sección.</td>
                                </tr>
                            ) : (
                                getFilteredList().map(solicitud => (
                                    <tr key={solicitud.id}>
                                        <td>{new Date(solicitud.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="vehicle-info">
                                                <span className="brand-model">{solicitud.marca} {solicitud.modelo}</span>
                                                <span className="year">{solicitud.ano}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="client-info">
                                                <div className="name">{solicitud.clienteNombre}</div>
                                                <div className="phone">{solicitud.whatsapp}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${solicitud.estado.toLowerCase()}`}>
                                                {solicitud.estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            {solicitud.fotos && solicitud.fotos.length > 0 ? (
                                                <div className="photo-preview-mini">
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${solicitud.fotos[0]}`}
                                                        alt="Mini preview"
                                                    />
                                                    <span className="count">+{solicitud.fotos.length}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                {activeTab === 'NUEVAS' && (
                                                    <a
                                                        href={getWhatsappLink(solicitud)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn-icon whatsapp"
                                                        title="Enviar Link por WhatsApp"
                                                    >
                                                        <span className="icon">📱</span> <span className="text">Link</span>
                                                    </a>
                                                )}

                                                <button
                                                    onClick={() => router.push(`/asesor/solicitud/${solicitud.id}`)}
                                                    className="btn-icon view"
                                                    title="Ver Detalle"
                                                >
                                                    👁️
                                                </button>

                                                {(activeTab === 'FOTOS' || activeTab === 'NUEVAS') && (
                                                    <button
                                                        onClick={() => handleMarkAsWon(solicitud.id)}
                                                        className="btn-icon win"
                                                        title="Marcar Ganada"
                                                    >
                                                        🏆
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .dashboard-layout {
                    min-height: 100vh;
                    background: #0f172a;
                    color: #e2e8f0;
                    font-family: 'Inter', sans-serif;
                }
                .center-screen {
                    height: 100vh; display: flex; align-items: center; justify-content: center; color: #94a3b8; background: #0f172a;
                }
                
                .topbar {
                    background: #1e293b;
                    border-bottom: 1px solid #334155;
                    padding: 1rem 2rem;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .brand { font-weight: 700; color: white; letter-spacing: 1px; }
                .user-info { display: flex; align-items: center; gap: 1rem; font-size: 0.9rem; }
                .btn-logout { background: none; border: 1px solid #475569; color: #94a3b8; padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer; }
                .btn-logout:hover { color: white; border-color: white; }

                .btn-cotizar {
                    background: #ca8a04;
                    color: #0f172a;
                    padding: 0.5rem 1.5rem;
                    border-radius: 6px;
                    font-weight: 700;
                    text-decoration: none;
                    letter-spacing: 1px;
                    transition: all 0.2s;
                    box-shadow: 0 0 15px rgba(202, 138, 4, 0.3);
                }
                .btn-cotizar:hover {
                    background: #facc15;
                    box-shadow: 0 0 20px rgba(202, 138, 4, 0.5);
                    transform: translateY(-1px);
                }

                .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }

                /* Tabs */
                .tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid #334155; padding-bottom: 1px; }
                .tab {
                    background: none; border: none; color: #94a3b8; padding: 0.75rem 1rem; cursor: pointer;
                    font-size: 1rem; font-weight: 500; display: flex; align-items: center; gap: 8px;
                    border-bottom: 2px solid transparent; transition: all 0.2s;
                }
                .tab:hover { color: #e2e8f0; }
                .tab.active { color: #facc15; border-bottom-color: #facc15; }
                
                .badge { background: #334155; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }
                .badge-green { background: #166534; }

                /* Table Styles */
                .table-container {
                    background: #1e293b;
                    border-radius: 12px;
                    border: 1px solid #334155;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .data-table th {
                    background: #0f172a;
                    padding: 1rem 1.5rem;
                    color: #94a3b8;
                    font-weight: 500;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #334155;
                }

                .data-table td {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #334155;
                    color: #e2e8f0;
                    vertical-align: middle;
                }

                .data-table tr:last-child td { border-bottom: none; }
                .data-table tr:hover { background: rgba(255,255,255,0.02); }

                .empty-state { text-align: center; color: #64748b; padding: 3rem; }

                /* Column specific styles */
                .vehicle-info { display: flex; flex-direction: column; }
                .brand-model { font-weight: 600; color: white; }
                .year { color: #94a3b8; font-size: 0.85rem; }

                .client-info .name { font-weight: 500; }
                .client-info .phone { color: #94a3b8; font-size: 0.85rem; }

                .status-pill { 
                    padding: 4px 10px; 
                    border-radius: 20px; 
                    font-size: 0.75rem; 
                    font-weight: 600; 
                    text-transform: uppercase;
                    display: inline-block;
                }
                .status-pill.nueva { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
                .status-pill.fotos_subidas { background: rgba(234, 179, 8, 0.15); color: #facc15; }
                .status-pill.ganada { background: rgba(22, 163, 74, 0.15); color: #4ade80; }
                .status-pill.perdida { background: rgba(239, 68, 68, 0.15); color: #f87171; }

                .photo-preview-mini {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .photo-preview-mini img {
                    width: 40px;
                    height: 40px;
                    border-radius: 6px;
                    object-fit: cover;
                    border: 1px solid #475569;
                }
                .photo-preview-mini .count {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    background: #334155;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                /* Actions */
                .actions-cell { text-align: right; }
                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }

                .btn-icon {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                }

                .btn-icon.whatsapp {
                    background: rgba(22, 101, 52, 0.2);
                    color: #4ade80;
                    border: 1px solid rgba(22, 101, 52, 0.5);
                }
                .btn-icon.whatsapp:hover {
                    background: rgba(22, 101, 52, 0.4);
                }

                .btn-icon.view {
                    background: transparent;
                    color: #cbd5e1;
                    border: 1px solid #475569;
                    padding: 8px;
                }
                .btn-icon.view:hover {
                    border-color: #94a3b8;
                    color: white;
                }

                .btn-icon.win {
                    background: rgba(250, 204, 21, 0.1);
                    color: #facc15;
                    border: 1px solid rgba(250, 204, 21, 0.3);
                    padding: 8px;
                }
                .btn-icon.win:hover {
                    background: rgba(250, 204, 21, 0.2);
                }
            `}</style>
        </div>
    );
}
