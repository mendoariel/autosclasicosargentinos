import { Router } from 'express';
import { getNoticias, getNoticiaById, createNoticia } from '../controllers/noticias.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getNoticias);
router.get('/:id', getNoticiaById);
router.post('/generar', authenticate, createNoticia); // Ruta protegida para generar noticias

export default router;

