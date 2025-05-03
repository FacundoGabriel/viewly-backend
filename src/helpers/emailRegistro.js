const { Resend } = require('resend');
require('dotenv').config();

const emailRegistro = async (datos) => {
  const resend = new Resend(process.env.API_KEY_RESEND);

  const { emailUsuario, nombreUsuario, token } = datos;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: emailUsuario,
    subject: 'Confirma tu cuenta en Viewly',
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #9333ea;">¡Hola, ${nombreUsuario}!</h2>
    <p style="font-size: 16px; color: #333;">
      Gracias por registrarte en <strong>Viewly</strong>. Estamos muy felices de tenerte con nosotros.
    </p>
    <p style="font-size: 16px; color: #333;">
      Por favor, confirmá tu cuenta haciendo clic en el siguiente botón:
    </p>
    <p style="text-align: center;">
      <a href="${process.env.URL_FRONTEND}/confirmar/${token}" 
         style="display: inline-block; padding: 10px 20px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Confirmar cuenta
      </a>
    </p>
    <p style="font-size: 14px; color: #777;">
      Si vos no creaste esta cuenta, podés ignorar este mensaje.
    </p>
    <p style="font-size: 14px; color: #777;">— El equipo de Viewly</p>
  </div>
`
  });
};

module.exports = emailRegistro;