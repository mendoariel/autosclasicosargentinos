import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import path from 'path';
import { jwtStrategy } from './config/passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar Passport
passport.use(jwtStrategy);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', /^https?:\/\/(localhost|127\.0\.0\.1|.*\.ngrok\.io|.*\.vercel\.app|.*\.netlify\.app)(:\d+)?$/],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Servir archivos estáticos (uploads)
const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
app.use('/uploads', express.static(uploadDir));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', timestamp: new Date().toISOString() });
});

// Auth routes
import authRoutes from './routes/auth.routes';
app.use('/api/auth', authRoutes);

// Autos routes
import autosRoutes from './routes/autos.routes';
app.use('/api/autos', autosRoutes);

// Cotizaciones routes
import cotizacionesRoutes from './routes/cotizaciones.routes';
app.use('/api/cotizaciones', cotizacionesRoutes);

// Noticias routes
import noticiasRoutes from './routes/noticias.routes';
app.use('/api/noticias', noticiasRoutes);

// Quote attempts routes
import quoteAttemptsRoutes from './routes/quote-attempts.routes';
app.use('/api/quote-attempts', quoteAttemptsRoutes);

// Solicitud documentacion routes
import solicitudDocumentacionRoutes from './routes/solicitud-documentacion.routes';
app.use('/api/solicitud-documentacion', solicitudDocumentacionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   - GET  http://localhost:${PORT}/api/auth/profile (requiere token)`);
  console.log(`🚗 Autos endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/autos`);
  console.log(`   - POST http://localhost:${PORT}/api/autos (requiere token)`);
  console.log(`💼 Cotizaciones endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/cotizaciones`);
  console.log(`📰 Noticias endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/noticias`);
  console.log(`   - POST http://localhost:${PORT}/api/noticias/generar (requiere token)`);
});

