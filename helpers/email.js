import nodemailer from 'nodemailer';

const emailRegistro = async(datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        }
      });
      console.log(datos);

      const{email, nombre, token, asunto, subject, text} = datos;
    
      if(asunto === 'Confirmacion Email')
          enviarEmailConfirmacion(transport, email, nombre, token, subject,text);
      else if(asunto === 'Recuperar Password')
          enviarEmailRecuperacion(transport, email, nombre, token, subject, text);         

}


async function enviarEmailConfirmacion(transport, email, nombre, token,subject,text){
     //enviar el email
     try {
        await  transport.sendMail({
          from:'BienesRaices.com', 
          to:email, 
          subject,
          text,
          html: crearHTMLConfirmacion(nombre,token),
        })
      
    } catch (error) {
      console.log(error);
    }
}



async function enviarEmailRecuperacion(transport, email, nombre, token,subject,text){
  //enviar el email
  try {
     await  transport.sendMail({
       from:'BienesRaices.com', 
       to:email, 
       subject,
       text,
       html: crearHTMLRecuperacion(nombre,token),
     })
   
 } catch (error) {
   console.log(error);
 }
}


function crearHTMLConfirmacion(nombre,token){
    return `
    <p>Hola ${nombre}, comprueba tu cuenta de BienesRaices.com</p>
    <p> Tu cuenta ya esta lista, solo debes de confirmar en el siguiente enlace:</p>
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a>
    <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
}


function crearHTMLRecuperacion(nombre,token){
  return `
  <p>Hola ${nombre}, has solicitado reestablecer tu password en Bienes Raices.com</p>
  <p>Sigue el sigueinte enlace para generar un password nuevo:</p>
  <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recuperarPassword/${token}">Reestablecer Password</a>
  <p> Si tu no solicitaste el cambio de password puedes ignorar el mensaje</p>
  `
}



export{
    emailRegistro,
    
}