import Usuario from '../models/Usuario.js';
import { emailRegistro} from '../helpers/email.js';
import { validaFormulario, validaEmailsDuplicados, ingresaNuevoUsuario } from '../helpers/formulario.js';
import { buscarUsuario, generarTokenEnviarEmail, identificaEmailCambio, muestraPaginaToken, validaEmailRecuperaPassword, validaNuevoPassword } from '../helpers/recuperarPassword.js';
import {  revisaPassword } from '../helpers/validaUsuario.js';

const formularioLogin = (request, response)=>{
    response.render('auth/login', {
        pagina: 'Iniciar Sesión', 
        csrfToken : request.csrfToken(),

    })
}

const autenticarUsario = async(request, response) =>{
    try {
       await revisaPassword(request, response);
    } catch (error) {
       console.error(error);
    }
}

const cerrarSesion = (request, response)=>{
    return response.clearCookie('_token').status(200).redirect('/auth/login')
}   

const formularioRegistro= (request, response)=>{
    response.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: request.csrfToken(),
    })
}

const formularioOlvidePassword = (request, response)=>{
    response.render('auth/recuperarPassword', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: request.csrfToken(),
    })

}

const registrar = async (request, response) =>{

        try{            
            await validaFormulario(request,response);
            const {nombre, email, password, token} = request.body;    
            await validaEmailsDuplicados(request,response,nombre, email);
            const nuevoUser = await ingresaNuevoUsuario(nombre, email, password, token);
            
            //envia email de confirmacion
                emailRegistro({
                    nombre : nuevoUser.nombre,
                    email: nuevoUser.email, 
                    token: nuevoUser.token,
                    asunto: 'Confirmacion Email',
                    subject: 'Confirma tu email en Bienes Raices.com', 
                    text: 'Confirma tu email en Bienes Raices.com',
                }); 
        
                response.render('templates/mensaje',{
                    pagina: 'Cuenta creada correctamente',
                    mensaje: 'Hemos enviado un email de confirmacion, presiona en el enlace',
                });
        }catch{
            console.error('error en el registro', error);
        }    

}

const comprobar = async(request, response )=>{
    const {token} = request.params;
    console.log(token);

    //vetificar si el token es valido
    const usuario = await Usuario.findOne({where:{token}});
    console.log(usuario);

    if(!usuario){
        return response.render('auth/confirmar-pagina',{
            pagina:'Error al confirmar tu cuenta',
            mensaje:'Hubo un error al confirmar tu cuenta, intenta de nuevo', 
            error:true,
        })
    }

    // confirmar la cuenta
    usuario.token = null; // se elimina el token de un solo uso
    usuario.confirmado = true; // confirmado pasa a uno
    await usuario.save();
    response.render('auth/confirmar-pagina',{
        pagina:'Cuenta confirmada',
        mensaje:'Se ha confirmado la cuenta correctamente',
        error:false,
    });

}

const resetPassword = async(request, response)=>{

    try {
        
        await validaEmailRecuperaPassword(request, response);
        await buscarUsuario(request,response);
        await generarTokenEnviarEmail(request, response);
    
        response.render('templates/mensaje',{
            pagina:'Reestablece tu password',
            mensaje:'Hemos enviado un email con las instrucciones',
        })
    } catch (error) {
        console.log(error);
    }
    
}

const comprobarToken = async (request, response) =>{
    //Muestra las paginas segun el estado del token
    await muestraPaginaToken(request, response);

}

const nuevoPassword = async (request, response) => {
    try {
        await validaNuevoPassword(request, response);
        await identificaEmailCambio(request, response);

        response.render('auth/confirmar-pagina', {
            pagina: 'El Password Fue Reestablecido',
            mensaje: 'Ha sido Reestablecido Tu Password',
        });
    } catch (error) {
        console.log(error);
        if (error.errores) {
            response.render('auth/reset-password', {
                pagina: 'Reestablece tu Password',
                csrfToken: request.csrfToken(),
                errores: error.errores,
            });
        } else {
            // Manejar otros errores
            response.status(500).send('Error interno del servidor');
        }
    }
};

export{
    formularioLogin,
    autenticarUsario,
    cerrarSesion,
    formularioRegistro,
    formularioOlvidePassword,
    registrar, 
    comprobar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
}