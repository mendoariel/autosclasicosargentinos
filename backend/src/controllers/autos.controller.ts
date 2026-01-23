import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/auth.middleware';
import path from 'path';
import fs from 'fs/promises';

export const getAutos = async (req: Request, res: Response) => {
  try {
    const autos = await prisma.auto.findMany({
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(autos);
  } catch (error: any) {
    console.error('Error al obtener autos:', error);
    res.status(500).json({ error: 'Error al obtener los autos clásicos' });
  }
};

export const getAutoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const auto = await prisma.auto.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
      },
    });

    if (!auto) {
      return res.status(404).json({ error: 'Auto no encontrado' });
    }

    res.json(auto);
  } catch (error: any) {
    console.error('Error al obtener auto:', error);
    res.status(500).json({ error: 'Error al obtener el auto' });
  }
};

export const createAuto = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const { marca, modelo, ano, descripcion, precio, kilometraje, color, combustible } = req.body;
    const userId = req.user.id;

    // Validar campos requeridos
    if (!marca || !modelo || !ano || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Manejar imagen si existe
    let imagenUrl: string | undefined;
    if (req.file) {
      const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      // Asegurar que el directorio existe
      await fs.mkdir(uploadDir, { recursive: true });

      // Guardar archivo
      await fs.writeFile(filePath, req.file.buffer);

      // URL relativa o absoluta según tu configuración
      imagenUrl = `/uploads/${fileName}`;
    }

    const auto = await prisma.auto.create({
      data: {
        marca,
        modelo,
        ano: parseInt(ano),
        descripcion,
        precio: precio ? parseFloat(precio) : null,
        kilometraje: kilometraje ? parseInt(kilometraje) : null,
        color: color || null,
        combustible: combustible || null,
        imagenUrl,
        userId: userId,
      },
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    res.status(201).json(auto);
  } catch (error: any) {
    console.error('Error al crear auto:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al publicar el auto clásico',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateAuto = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const { id } = req.params;
    const userId = req.user.id;
    const { marca, modelo, ano, descripcion, precio, kilometraje, color, combustible } = req.body;

    // Verificar que el auto pertenece al usuario
    const auto = await prisma.auto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!auto) {
      return res.status(404).json({ error: 'Auto no encontrado' });
    }

    if (auto.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar este auto' });
    }

    // Manejar nueva imagen si existe
    let imagenUrl = auto.imagenUrl;
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (auto.imagenUrl) {
        const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
        const oldFilePath = path.join(uploadDir, path.basename(auto.imagenUrl));
        try {
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.error('Error al eliminar imagen anterior:', err);
        }
      }

      const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, req.file.buffer);

      imagenUrl = `/uploads/${fileName}`;
    }

    const updatedAuto = await prisma.auto.update({
      where: { id: parseInt(id) },
      data: {
        marca: marca || auto.marca,
        modelo: modelo || auto.modelo,
        ano: ano ? parseInt(ano) : auto.ano,
        descripcion: descripcion || auto.descripcion,
        precio: precio !== undefined ? parseFloat(precio) : auto.precio,
        kilometraje: kilometraje !== undefined ? parseInt(kilometraje) : auto.kilometraje,
        color: color !== undefined ? color : auto.color,
        combustible: combustible !== undefined ? combustible : auto.combustible,
        imagenUrl,
      },
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    res.json(updatedAuto);
  } catch (error: any) {
    console.error('Error al actualizar auto:', error);
    res.status(500).json({ error: 'Error al actualizar el auto' });
  }
};

export const deleteAuto = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const { id } = req.params;
    const userId = req.user.id;

    // Verificar que el auto pertenece al usuario
    const auto = await prisma.auto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!auto) {
      return res.status(404).json({ error: 'Auto no encontrado' });
    }

    if (auto.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este auto' });
    }

    // Eliminar imagen si existe
    if (auto.imagenUrl) {
      const uploadDir = process.env.UPLOAD_DIR || '/app/uploads';
      const filePath = path.join(uploadDir, path.basename(auto.imagenUrl));
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
      }
    }

    await prisma.auto.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Auto eliminado correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar auto:', error);
    res.status(500).json({ error: 'Error al eliminar el auto' });
  }
};

