import { check,validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "./token.js";
import { emailRegistro } from "./email.js";
import bcrypt from 'bcrypt';

async function validaEmailRecuperaPassword(request, response){
    
    await check('email').isEmail().withMessage('Eso no parece un email').run(request);
    let resultado = validationResult(request); 
    console.log('resultado', resultado)  
    
    // verifica que el resultado este vacio
    if(!resultado.isEmpty()){
        // Errores
        console.log(request.csrfToken())
        console.log(resultado.array())
        console.log('entra a este condicional')
 
        return response.render('auth/recuperarPassword', {
            pagina: 'Recupera tu Acceso a Bienes Raíces',
            csrfToken: request.csrfToken(),
            errores: resultado.array(), 
        });
    } 
}

async function buscarUsuario(request,response){
    const {email} = request.body
    console.log(email)
    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return response.render('auth/recuperarPassword',{
            pagina: 'Recupera tu Acceso a Bienes Raices',
            csrfToken: request.csrfToken(),
            errores:[{msg: 'El email no pertenece al usuario'}]
        })
    }

    
}

async function generarTokenEnviarEmail(request, response){
    const {email} = request.body;

    const usuario = await Usuario.findOne({where: {email}})
    //generar un token unico
     usuario.token = generarId();
    await usuario.save();  //guardamos el usuario en la base de datos
    
    //enviamos un email y envio de mensaje
    emailRegistro({
        nombre : usuario.nombre,
        email: usuario.email, 
        token: usuario.token,
        asunto: 'Recuperar Password',
        subject: 'Reestablece tu Password en Bienes Raices.com', 
        text: 'Reestablece tu Password en Bienes Raices.com',
    }); 
}

async function muestraPaginaToken(request, response){
   
    const{token} = request.params;
    const usuario = await Usuario.findOne({where: {token}});
    console.log(usuario);

    if(!usuario){
        return response.render('auth/confirmar-pagina',{
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true, 
        })
    }

    response.render('auth/reset-password',{
        pagina: 'Reestablece tu Password',
        csrfToken:request.csrfToken(),
    });

}

async function validaNuevoPassword(request, response) {
    await check('password').isLength({ min: 6 }).withMessage('El password debe de tener al menos 6 caracteres').run(request);
    let resultado = validationResult(request);

    if (!resultado.isEmpty()) {
        throw { errores: resultado.array() };
    }
}

async function identificaEmailCambio(request, response) {
    const { token } = request.params;
    const { password } = request.body;

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    usuario.token = null;
    await usuario.save();
}

export{
    validaEmailRecuperaPassword,
    buscarUsuario,
    generarTokenEnviarEmail,
    muestraPaginaToken,
    validaNuevoPassword,
    identificaEmailCambio,
}