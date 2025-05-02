const nodemailer = require('nodemailer')

const emailRegistro = async(datos)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { emailUsuario, nombreUsuario, token } = datos

      const info = await transporter.sendMail({
        from: 'Viewly',
        to: emailUsuario,
        subject: 'Confirma tu cuenta en Viewly',
        text: 'Confirma tu cuenta en Viewly',
        html: `<p>Hola: ${nombreUsuario}, confirma tu cuenta en Viewly.</p>
                <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.URL_FRONTEND}/confirmar/${token}">Comprobar cuenta</a></p>

                <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
      })

      console.log('mensaje enviado: %s', info.messageId)
}

module.exports = emailRegistro