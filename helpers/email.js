import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // Usar secure solo si puerto es 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  console.log(datos);

  const { email, nombre, token, asunto, subject, text } = datos;

  if (asunto === 'Confirmacion Email') {
    await enviarEmailConfirmacion(transport, email, nombre, token, subject, text);
  } else if (asunto === 'Recuperar Password') {
    await enviarEmailRecuperacion(transport, email, nombre, token, subject, text);
  }
};

async function enviarEmailConfirmacion(transport, email, nombre, token, subject, text) {
  try {
    await transport.sendMail({
      from: 'bienesraices136@gmail.com',
      to: email,
      subject,
      text,
      html: crearHTMLConfirmacion(nombre, token),
    });
    console.log('Correo enviado a:', email);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
}

async function enviarEmailRecuperacion(transport, email, nombre, token, subject, text) {
  try {
    await transport.sendMail({
      from: 'bienesraices136@gmail.com',
      to: email,
      subject,
      text,
      html: crearHTMLRecuperacion(nombre, token),
    });
    console.log('Correo enviado a:', email);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
}

function crearHTMLConfirmacion(nombre, token) {
  return `
    <p>Hola ${nombre}, comprueba tu cuenta de BienesRaices.com</p>
    <p>Tu cuenta ya está lista, solo debes confirmar en el siguiente enlace:</p>
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a>
    <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje.</p>
  `;
}

function crearHTMLRecuperacion(nombre, token) {
  return `
    <p>Hola ${nombre}, has solicitado reestablecer tu password en Bienes Raices.com</p>
    <p>Sigue el siguiente enlace para generar un nuevo password:</p>
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recuperarPassword/${token}">Reestablecer Password</a>
    <p>Si tú no solicitaste el cambio de password, puedes ignorar el mensaje.</p>
  `;
}

export { emailRegistro };
