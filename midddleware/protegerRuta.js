import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

const protegerRuta = async(request, response, next)=>{
   
    //verificar si hay un token
   const {_token} = request.cookies;

   if(!_token){
        return response.redirect('/auth/login');
   }


    //comprobar el token
   try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await  Usuario.scope('eliminarPassword').findByPk(decoded.id);
        console.log(usuario)
        // almacenar el usuario en el request
        if(usuario){
            request.usuario = usuario;
        }else{
            return response.redirect('/auth/login');
        }
        return next();

   } catch (error) {
        return response.clearCookie('_token').redirect('/auth/login');
   }

}


export default protegerRuta;
