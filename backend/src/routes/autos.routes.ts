import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getAutos,
  getAutoById,
  createAuto,
  updateAuto,
  deleteAuto,
} from '../controllers/autos.controller';
import multer from 'multer';

const router = Router();

// Configurar multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
});

// Rutas públicas
router.get('/', getAutos);
router.get('/:id', getAutoById);

// Rutas protegidas
router.post('/', authenticate, upload.single('imagen'), createAuto);
router.put('/:id', authenticate, upload.single('imagen'), updateAuto);
router.delete('/:id', authenticate, deleteAuto);

export default router;



