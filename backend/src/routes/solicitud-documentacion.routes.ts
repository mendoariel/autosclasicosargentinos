import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// POST /api/solicitud-documentacion - Crear nueva solicitud de documentación
router.post('/', async (req, res) => {
  try {
    const { 
      quoteAttemptId,
      imagenTarjetaVerdeFrente,
      imagenTarjetaVerdeDorso,
      imagenVehiculoFecha,
      imagenCarnetConducir,
      patente,
      numeroMotor,
      numeroChasis,
      dominio,
      observaciones
    } = req.body;

    // Validar que exista el quoteAttempt
    const quoteAttempt = await prisma.quoteAttempt.findUnique({
      where: { id: parseInt(quoteAttemptId) }
    });

    if (!quoteAttempt) {
      return res.status(404).json({
        error: 'Intento de cotización no encontrado'
      });
    }

    // Crear nueva solicitud de documentación
    const solicitud = await prisma.solicitudDocumentacion.create({
      data: {
        quoteAttemptId: parseInt(quoteAttemptId),
        imagenTarjetaVerdeFrente,
        imagenTarjetaVerdeDorso,
        imagenVehiculoFecha,
        imagenCarnetConducir,
        patente,
        numeroMotor,
        numeroChasis,
        dominio,
        observaciones,
        status: 'recibida'
      }
    });

    // Actualizar estado del quoteAttempt
    await prisma.quoteAttempt.update({
      where: { id: parseInt(quoteAttemptId) },
      data: { status: 'documentacion_recibida' }
    });

    res.status(201).json({
      id: solicitud.id,
      message: 'Solicitud de documentación creada exitosamente',
      solicitud
    });
  } catch (error) {
    console.error('Error creating solicitud documentacion:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/solicitud-documentacion/:quoteAttemptId - Obtener solicitud por quoteAttemptId
router.get('/quote/:quoteAttemptId', async (req, res) => {
  try {
    const { quoteAttemptId } = req.params;

    const solicitud = await prisma.solicitudDocumentacion.findFirst({
      where: { quoteAttemptId: parseInt(quoteAttemptId) },
      include: {
        quoteAttempt: true
      }
    });

    if (!solicitud) {
      return res.status(404).json({
        error: 'Solicitud de documentación no encontrada'
      });
    }

    res.json(solicitud);
  } catch (error) {
    console.error('Error fetching solicitud documentacion:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// PATCH /api/solicitud-documentacion/:id - Actualizar solicitud
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observaciones } = req.body;

    const solicitud = await prisma.solicitudDocumentacion.update({
      where: { id: parseInt(id) },
      data: {
        ...(status && { status }),
        ...(observaciones && { observaciones })
      }
    });

    res.json({
      message: 'Solicitud actualizada exitosamente',
      solicitud
    });
  } catch (error) {
    console.error('Error updating solicitud documentacion:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// POST /api/solicitud-documentacion/upload - Subir imágenes
router.post('/upload', async (req, res) => {
  try {
    // Nota: Esto es un placeholder para cuando implementemos multer
    // Por ahora, las imágenes se manejarán como URLs desde el frontend
    res.json({
      message: 'Upload endpoint - pendiente de implementar con multer',
      note: 'Por ahora usar URLs directas'
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/solicitud-documentacion - Obtener todas las solicitudes (admin)
router.get('/', async (req, res) => {
  try {
    const solicitudes = await prisma.solicitudDocumentacion.findMany({
      include: {
        quoteAttempt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(solicitudes);
  } catch (error) {
    console.error('Error fetching solicitudes:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

export default router;
