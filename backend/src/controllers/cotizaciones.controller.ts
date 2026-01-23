import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const createCotizacion = async (req: Request, res: Response) => {
  try {
    const { marca, modelo, ano, valor, uso, antiguedad } = req.body;

    // Validar campos requeridos
    if (!marca || !modelo || !ano || !valor) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const valorAsegurado = parseFloat(valor);
    const anoAuto = parseInt(ano);
    const antiguedadAnos = antiguedad ? parseInt(antiguedad) : new Date().getFullYear() - anoAuto;

    // Lógica de cálculo de prima (simplificada)
    // En producción, esto debería ser más complejo y considerar más factores
    let factorBase = 0.02; // 2% del valor asegurado como base anual

    // Ajuste por antigüedad
    if (antiguedadAnos > 30) {
      factorBase *= 1.5; // Autos muy antiguos son más caros de asegurar
    } else if (antiguedadAnos > 20) {
      factorBase *= 1.3;
    } else if (antiguedadAnos > 10) {
      factorBase *= 1.1;
    }

    // Ajuste por uso
    if (uso === 'comercial') {
      factorBase *= 1.4;
    } else if (uso === 'exhibicion') {
      factorBase *= 0.8; // Exhibición es más seguro
    }

    // Calcular primas
    const primaAnual = valorAsegurado * factorBase;
    const primaMensual = primaAnual / 12;

    // Determinar cobertura
    let cobertura = 'Terceros Completos';
    if (primaAnual > valorAsegurado * 0.05) {
      cobertura = 'Todo Riesgo con Franquicia';
    } else if (primaAnual > valorAsegurado * 0.03) {
      cobertura = 'Todo Riesgo';
    }

    // Guardar cotización en la base de datos (opcional, si el usuario está autenticado)
    let cotizacionId: number | undefined;
    if (req.user && req.user.id) {
      const cotizacion = await prisma.cotizacion.create({
        data: {
          marca,
          modelo,
          ano: anoAuto,
          valorAsegurado,
          uso: uso || 'particular',
          primaAnual,
          primaMensual,
          cobertura,
          userId: req.user.id,
        },
      });
      cotizacionId = cotizacion.id;
    }

    res.json({
      cotizacion: {
        id: cotizacionId,
        marca,
        modelo,
        ano: anoAuto,
        valorAsegurado,
        uso: uso || 'particular',
        primaAnual: Math.round(primaAnual * 100) / 100,
        primaMensual: Math.round(primaMensual * 100) / 100,
        cobertura,
      },
    });
  } catch (error: any) {
    console.error('Error al crear cotización:', error);
    res.status(500).json({ error: 'Error al generar la cotización' });
  }
};

export const getCotizaciones = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const cotizaciones = await prisma.cotizacion.findMany({
      where: {
        usuarioId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(cotizaciones);
  } catch (error: any) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({ error: 'Error al obtener las cotizaciones' });
  }
};

