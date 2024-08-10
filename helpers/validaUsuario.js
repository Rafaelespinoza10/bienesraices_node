import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import jwt from 'jsonwebtoken';
import { generarJWT } from "./token.js";

async function revisaPassword(request, response) {
    const { email, password } = request.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return response.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: request.csrfToken(),
            errores: [{ msg: 'El usuario no existe, intenta de nuevo ' }],
        });
    }

    if (!usuario.confirmado) {
        return response.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: request.csrfToken(),
            errores: [{ msg: 'No has confirmado la autenticación de usuario' }],
        });
    }

    // Verificar la contraseña
    if (!usuario.verificarPassword(password)) {
        return response.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: request.csrfToken(),
            errores: [{ msg: 'El password es incorrecto' }],
        });
    }

    // Si llega hasta aquí, la autenticación es exitosa
    // Generar el token JWT y realizar otras operaciones necesarias
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre});
    console.log(token);
    //almacenar en un cookie
    return response.cookie('_token', token, {
        httpOnly: true,
       // secure: true, // cookies en conexiones seguras.
    }).redirect('/mis-propiedades'); //redirige a la pagina de mis propiedades
}

export{
    revisaPassword,   
}