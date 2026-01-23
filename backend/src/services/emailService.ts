import nodemailer from 'nodemailer';

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

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const mailOptions = {
      from: 'info@peludosclick.com',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente a:', emailData.to);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

export const generateQuoteEmail = (quoteData: any) => {
  const whatsappMessage = `🚗 *NUEVA COTIZACIÓN - AUTOS CLÁSICOS*\n\n` +
    `📋 *Datos del Vehículo:*\n` +
    `Tipo: ${quoteData.tipoVehiculo}\n` +
    `Marca: ${quoteData.marca}\n` +
    `Modelo: ${quoteData.modelo}\n` +
    `Año: ${quoteData.ano}\n\n` +
    `📱 *Contacto del Cliente:*\n` +
    `WhatsApp: ${quoteData.whatsapp}\n\n` +
    `🔗 *Link para que el cliente complete información:*\n` +
    `${process.env.FRONTEND_URL || 'http://localhost:3000'}/completar-cotizacion/${quoteData.id}\n\n` +
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
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Tipo:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${quoteData.tipoVehiculo}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Marca:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${quoteData.marca}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Modelo:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${quoteData.modelo}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Año:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${quoteData.ano}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #e8f5e8; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #333; margin-top: 0;">📱 Contacto del Cliente</h2>
        <p style="font-size: 1.1rem; margin: 10px 0;"><strong>WhatsApp:</strong> ${quoteData.whatsapp}</p>
        <p style="margin: 15px 0;">Puedes enviarle este mensaje por WhatsApp:</p>
        <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #25D366;">
          <pre style="margin: 0; white-space: pre-wrap; font-family: monospace; font-size: 0.9rem;">${whatsappMessage}</pre>
        </div>
      </div>
      
      <div style="background: #fff3cd; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #333; margin-top: 0;">🔗 Link para el Cliente</h2>
        <p style="margin: 10px 0;">El cliente puede completar su información aquí:</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/completar-cotizacion/${quoteData.id}" 
           style="display: inline-block; background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Completar Cotización
        </a>
      </div>
      
      <div style="text-align: center; padding: 20px; background: #f1f3f4; border-radius: 10px;">
        <p style="margin: 0; color: #666;">📞 Por favor, contacta al cliente a la brevedad para continuar con el proceso de cotización.</p>
      </div>
    </div>
  `;

  return {
    to: 'mendoariel@gmail.com',
    subject: `🚗 Nueva Cotización - ${quoteData.marca} ${quoteData.modelo} ${quoteData.ano}`,
    html: htmlContent
  };
};
