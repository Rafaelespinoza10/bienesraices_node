import jwt from 'jsonwebtoken';
import Usuario  from '../models/Usuario.js';

const identificarUsuario = async(request, response, next)=>{

    //identificar si hay un token en las cookies
    const {_token} = request.cookies;
    if(!_token){
        request.usuario = null;
        return next();
    }


    //comprobar el token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        if(usuario){
            request.usuario = usuario;
        }

        return next();
    } catch (error) {
        console.error(error);
        return response.clearCookie('_token').redirect('/auth/login');
    }
}

export{
    identificarUsuario,
}