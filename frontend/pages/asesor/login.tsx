import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function AsesorLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Save token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            router.push('/asesor/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Acceso Asesor">
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a'
            }}>
                <div style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '2.5rem',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '400px'
                }}>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        Panel Asesor 🛡️
                    </h1>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#fca5a5',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: 'rgba(15, 23, 42, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: 'rgba(15, 23, 42, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                color: 'white',
                                border: 'none',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
