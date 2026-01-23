import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
// import nodemailer from 'nodemailer';

const router = Router();
const prisma = new PrismaClient();

// POST /api/quote-attempts - Crear nuevo intento de cotización
router.post('/', async (req, res) => {
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
    const quoteAttempt = await prisma.quoteAttempt.create({
      data: {
        tipoVehiculo,
        marca,
        modelo,
        ano: parseInt(ano),
        whatsapp,
        status
      }
    });

    // Enviar email al asesor comercial (temporalmente deshabilitado)
    try {
      // TODO: Arreglar instalación de nodemailer en Docker
      console.log('📧 EMAIL TEMPORALMENTE DESHABILITADO');
      console.log('Datos para enviar por email:');
      console.log('- Para: mendoariel@gmail.com');
      console.log('- Asunto: 🚗 Nueva Cotización -', marca, modelo, ano);
      console.log('- WhatsApp:', whatsapp);
      console.log('- Link cliente: http://localhost:3000/completar-cotizacion/', quoteAttempt.id);
      
      /*
      // Configuración del transporter para Outlook
      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // TLS
        auth: {
          user: 'info@peludosclick.com',
          pass: 'Yamaha600'
        }
      });

      // Mensaje para WhatsApp
      const whatsappMessage = `🚗 *NUEVA COTIZACIÓN - AUTOS CLÁSICOS*\n\n` +
        `📋 *Datos del Vehículo:*\n` +
        `Tipo: ${tipoVehiculo}\n` +
        `Marca: ${marca}\n` +
        `Modelo: ${modelo}\n` +
        `Año: ${ano}\n\n` +
        `📱 *Contacto del Cliente:*\n` +
        `WhatsApp: ${whatsapp}\n\n` +
        `🔗 *Link para que el cliente complete información:*\n` +
        `http://localhost:3000/completar-cotizacion/${quoteAttempt.id}\n\n` +
        `📞 *Por favor, contacta al cliente para continuar con la cotización.*`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 2rem;">🚗 NUEVA COTIZACIÓN</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.2rem;">Autos Clásicos Argentinos</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-top: 0;">📋 Datos del Vehículo</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Tipo:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${tipoVehiculo}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Marca:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${marca}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Modelo:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${modelo}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Año:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${ano}</td></tr>
            </table>
          </div>
          
          <div style="background: #e8f5e8; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-top: 0;">📱 Contacto del Cliente</h2>
            <p style="font-size: 1.1rem; margin: 10px 0;"><strong>WhatsApp:</strong> ${whatsapp}</p>
            <p style="margin: 15px 0;">Puedes enviarle este mensaje por WhatsApp:</p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #25D366;">
              <pre style="margin: 0; white-space: pre-wrap; font-family: monospace; font-size: 0.9rem;">${whatsappMessage}</pre>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-top: 0;">🔗 Link para el Cliente</h2>
            <p style="margin: 10px 0;">El cliente puede completar su información aquí:</p>
            <a href="http://localhost:3000/completar-cotizacion/${quoteAttempt.id}" 
               style="display: inline-block; background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Completar Cotización
            </a>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f1f3f4; border-radius: 10px;">
            <p style="margin: 0; color: #666;">📞 Por favor, contacta al cliente a la brevedad para continuar con el proceso de cotización.</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: 'info@peludosclick.com',
        to: 'mendoariel@gmail.com',
        subject: `🚗 Nueva Cotización - ${marca} ${modelo} ${ano}`,
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log('Email enviado al asesor comercial');
      */
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallamos el request si el email no se envía
    }

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

// GET /api/quote-attempts/:id - Obtener intento de cotización por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const quoteAttempt = await prisma.quoteAttempt.findUnique({
      where: { id: parseInt(id) }
    });

    if (!quoteAttempt) {
      return res.status(404).json({
        error: 'Intento de cotización no encontrado'
      });
    }

    res.json(quoteAttempt);
  } catch (error) {
    console.error('Error fetching quote attempt:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// PATCH /api/quote-attempts/:id - Actualizar intento de cotización
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { dominio, uso, valor, status } = req.body;

    const quoteAttempt = await prisma.quoteAttempt.update({
      where: { id: parseInt(id) },
      data: {
        ...(dominio && { dominio }),
        ...(uso && { uso }),
        ...(valor && { valor }),
        ...(status && { status })
      }
    });

    res.json({
      message: 'Intento de cotización actualizado exitosamente',
      quoteAttempt
    });
  } catch (error) {
    console.error('Error updating quote attempt:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/quote-attempts - Obtener todos los intentos de cotización (admin)
router.get('/', async (req, res) => {
  try {
    const quoteAttempts = await prisma.quoteAttempt.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(quoteAttempts);
  } catch (error) {
    console.error('Error fetching quote attempts:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

export default router;
