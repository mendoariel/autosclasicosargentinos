import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { generarNoticia } from '../services/openai.service';

export const getNoticias = async (req: Request, res: Response) => {
  try {
    const noticias = await prisma.noticia.findMany({
      where: {
        publicado: true,
      },
      include: {
        auto: {
          select: {
            marca: true,
            modelo: true,
            ano: true,
          },
        },
      },
      orderBy: {
        fechaPublicacion: 'desc',
      },
    });

    res.json(noticias);
  } catch (error: any) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al obtener las noticias' });
  }
};

export const getNoticiaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const noticia = await prisma.noticia.findFirst({
      where: { 
        id: parseInt(id),
        publicado: true,
      },
      include: {
        auto: {
          select: {
            marca: true,
            modelo: true,
            ano: true,
          },
        },
      },
    });

    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    res.json(noticia);
  } catch (error: any) {
    console.error('Error al obtener noticia:', error);
    res.status(500).json({ error: 'Error al obtener la noticia' });
  }
};

export const createNoticia = async (req: Request, res: Response) => {
  try {
    const { autoId } = req.body;
    
    // Verificar que OpenAI API Key esté configurada
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API Key no configurada. Por favor configura OPENAI_API_KEY en las variables de entorno.' 
      });
    }

    const noticia = await generarNoticia(autoId ? parseInt(autoId) : undefined);

    res.status(201).json({
      message: 'Noticia generada exitosamente',
      noticia,
    });
  } catch (error: any) {
    console.error('Error al generar noticia:', error);
    res.status(500).json({ 
      error: 'Error al generar la noticia',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
