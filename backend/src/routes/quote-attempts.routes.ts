import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const router = Router();
const prisma = new PrismaClient();

// Configurar multer para manejar archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB límite
  }
});

// POST /api/quote-attempts - Crear nuevo intento de cotización
router.post('/', async (req: Request, res: Response) => {
  try {
    const { tipoVehiculo, marca, modelo, ano, whatsapp, status = 'pending' } = req.body;
    
    // Validaciones básicas
    if (!tipoVehiculo || !marca || !modelo || !ano || !whatsapp) {
      return res.status(400).json({
        error: 'Faltan campos requeridos',
        required: ['tipoVehiculo', 'marca', 'modelo', 'ano', 'whatsapp']
      });
    }

    // Crear nuevo intento de cotización
    const quoteAttempt = await prisma.solicitudSeguro.create({
      data: {
        marca,
        modelo,
        ano: parseInt(ano),
        whatsapp
      }
    });

    res.status(201).json({
      id: quoteAttempt.id,
      message: 'Intento de cotización creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating quote attempt:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// PATCH /api/quote-attempts/:id - Actualizar intento de cotización con archivos
router.patch('/:id', upload.fields([
  { name: 'tarjetaVerdeFrente', maxCount: 1 },
  { name: 'tarjetaVerdeDorso', maxCount: 1 },
  { name: 'vehiculoFecha', maxCount: 1 },
  { name: 'carnetConducir', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { dominio, uso, valor } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Procesar archivos si existen
    const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
    
    // Asegurar que el directorio existe
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedFiles: { [key: string]: string } = {};

    for (const [fieldName, fileArray] of Object.entries(files || {})) {
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0];
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Guardar archivo
        await fs.writeFile(filePath, file.buffer);
        
        // Guardar la URL relativa
        uploadedFiles[fieldName] = `/uploads/${fileName}`;
        
        console.log(`Archivo ${fieldName} guardado: ${fileName}`);
      }
    }

    // Actualizar datos adicionales
    const updatedQuote = await prisma.solicitudSeguro.update({
      where: { id: parseInt(id) },
      data: {
        patente: dominio,
        observaciones: uso,
        estado: 'FOTOS_SUBIDAS'
      }
    });

    res.status(200).json({
      message: 'Cotización actualizada exitosamente',
      quoteAttempt: updatedQuote,
      uploadedFiles
    });
  } catch (error) {
    console.error('Error updating quote attempt:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/quote-attempts/:id - Obtener intento de cotización por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quoteAttempt = await prisma.solicitudSeguro.findUnique({
      where: { id: parseInt(id) }
    });

    if (!quoteAttempt) {
      return res.status(404).json({
        error: 'Intento de cotización no encontrado'
      });
    }

    res.status(200).json(quoteAttempt);
  } catch (error) {
    console.error('Error fetching quote attempt:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

export default router;
