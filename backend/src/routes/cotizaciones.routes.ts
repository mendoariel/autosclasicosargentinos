import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createCotizacion, getCotizaciones } from '../controllers/cotizaciones.controller';

const router = Router();

// Ruta pública para crear cotización (sin autenticación requerida)
router.post('/', createCotizacion);

// Ruta protegida para obtener historial de cotizaciones del usuario
router.get('/', authenticate, getCotizaciones);

export default router;



