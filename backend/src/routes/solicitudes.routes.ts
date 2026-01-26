import { Router } from 'express';
import multer from 'multer';
import * as solicitudesController from '../controllers/solicitudes.controller';

import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Configure Multer (Memory storage to handle in controller)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Public Routes
router.post('/', solicitudesController.createSolicitud);
router.get('/asesor/:token', solicitudesController.getSolicitudByAsesorToken);
router.get('/cliente/:token', solicitudesController.getSolicitudByClienteToken);
router.post('/:token/fotos', upload.fields([
    { name: 'cedulaFrente', maxCount: 1 },
    { name: 'cedulaDorso', maxCount: 1 },
    { name: 'carnet', maxCount: 1 },
    { name: 'pruebaVida', maxCount: 1 }
]), solicitudesController.uploadFotos);

// Protected Advisor Routes
router.get('/', authenticate, solicitudesController.getAllSolicitudes);
router.patch('/:id/estado', authenticate, solicitudesController.updateEstado);

export default router;
