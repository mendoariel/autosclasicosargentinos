import nodemailer from 'nodemailer';

// Configuración del transporter para Outlook
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-mail.outlook.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'info@autosclasicosargentinos.com.ar',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente a:', emailData.to);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return false;
  }
};

export const generateSolicitudEmail = (solicitud: any) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://autosclasicosargentinos.com.ar';
  const asesorLink = `${frontendUrl}/asesor/${solicitud.tokenAsesor}`;
  const clienteLink = `${frontendUrl}/cotizacion/${solicitud.tokenCliente}`;

  const whatsappMessage =
    `Hola ${solicitud.clienteNombre || ''}! 👋\n` +
    `Vi tu pedido de cotización para el *${solicitud.marca} ${solicitud.modelo} ${solicitud.ano}*.\n\n` +
    `Para darte el mejor precio, necesito que subas unas fotos del auto en este link seguro:\n` +
    `${clienteLink}\n\n` +
    `Cualquier duda decime!`;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Nueva Solicitud Recibida 🚀</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Un cliente espera tu cotización</p>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">🚗 Vehículo</h2>
          <table style="width: 100%; font-size: 15px;">
            <tr><td style="padding: 5px 0; color: #64748b; width: 100px;">Vehículo:</td><td style="font-weight: 500;">${solicitud.marca} ${solicitud.modelo}</td></tr>
            <tr><td style="padding: 5px 0; color: #64748b;">Año:</td><td style="font-weight: 500;">${solicitud.ano}</td></tr>
            <tr><td style="padding: 5px 0; color: #64748b;">Cliente:</td><td style="font-weight: 500;">${solicitud.clienteNombre || 'No especificado'}</td></tr>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">📱 Acción Rápida</h2>
          <p style="margin-bottom: 15px;">1. Accede a tu panel para ver detalles y contactar:</p>
          <a href="${asesorLink}" style="display: block; width: 100%; text-align: center; background: #2563eb; color: white; padding: 14px 0; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 20px;">
            Abrir Panel del Asesor
          </a>

          <p style="margin-bottom: 15px;">2. O envíale este mensaje directo por WhatsApp:</p>
          <div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 15px; border-radius: 8px; font-size: 14px; color: #166534;">
            ${whatsappMessage.replace(/\n/g, '<br>')}
            <br><br>
            <a href="https://wa.me/${solicitud.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}" 
               style="display: inline-block; margin-top: 10px; color: #16a34a; font-weight: 600; text-decoration: none;">
               👉 Click para enviar WhatsApp
            </a>
          </div>
        </div>

        <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 40px;">
          Este link es mágico y único para esta gestión. No requiere contraseña.
        </p>
      </div>
    </div>
  `;

  return {
    to: process.env.ADVISOR_EMAIL || 'mendoariel@gmail.com',
    subject: `Nueva Solicitud: ${solicitud.marca} ${solicitud.modelo} (${solicitud.ano})`,
    html: htmlContent
  };
};

export const generatePhotosUploadedEmail = (solicitud: any) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://autosclasicosargentinos.com.ar';
  const asesorLink = `${frontendUrl}/asesor/${solicitud.tokenAsesor}`;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">¡Fotos Recibidas! 📸</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">El cliente ha subido documentación</p>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">🚗 Detalles</h2>
           <p><strong>Cliente:</strong> ${solicitud.clienteNombre}</p>
           <p><strong>Vehículo:</strong> ${solicitud.marca} ${solicitud.modelo}</p>
           <p><strong>Estado:</strong> ${solicitud.fotos.length} fotos subidas</p>
        </div>

        <div style="margin-bottom: 30px;">
          <a href="${asesorLink}" style="display: block; width: 100%; text-align: center; background: #2563eb; color: white; padding: 14px 0; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 20px;">
            Ver Fotos y Cotizar
          </a>
        </div>
      </div>
    </div>
  `;

  return {
    to: process.env.ADVISOR_EMAIL || 'mendoariel@gmail.com',
    subject: `📸 Fotos recibidas: ${solicitud.clienteNombre} - ${solicitud.marca}`,
    html: htmlContent
  };
};
