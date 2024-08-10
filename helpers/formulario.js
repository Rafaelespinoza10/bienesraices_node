import { check, validationResult } from "express-validator";
import Usuario from '../models/Usuario.js';
import { generarId } from "./token.js";

async function validaFormulario (request,response){
  
        // validacion de formulario
    await check('nombre').notEmpty().withMessage('el nombre es obligatorio').run(request); // validacion de que el nombre no este vacio
    await check('email').isEmail().withMessage('Eso no parece un email').run(request);
    await check('password').isLength({min: 6}).withMessage('El password debe de tener al menos 6 caracteres').run(request);
    await check('repetir_password')
    .custom((value, {req}) =>{
        if(value != req.body.password){
            throw new Error('Los passwords no son iguales');
        }
        return true;
    })
    .withMessage('Los password no son iguales')
    .run(request);
    
    let resultado = validationResult(request);
            
            
    // verifica que el resultado este vacio
    if(!resultado.isEmpty()){
        // Errores
        return response.render('auth/registro',{
            pagina:'Crear cuenta',
            csrfToken: request.csrfToken(),
            errores: resultado.array(), //verifica los errores
            usuario:{
                nombre: request.body.nombre,
                correo: request.body.email, 
            }
        })
    }
    
}

async function validaEmailsDuplicados(request, response, nombre, email){
    
        
        const existeUsuario = await Usuario.findOne({where:{email}})
        if (existeUsuario){
            return response.render('auth/registro',{
                paginas: 'Crear Cuenta',
                csrfToken: request.csrfToken(), //capa de seguridad inyectada
                errores:[{msg: 'El usuario ya esta registrado'}],
                usuario:{
                    nombre,
                    email,
                }
            })
        }
}

async function ingresaNuevoUsuario(nombre,email,password, token){
    
    const nuevoUser = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),
    });

    return nuevoUser;
}


export{
    validaFormulario, 

    validaEmailsDuplicados,
    ingresaNuevoUsuario,
}