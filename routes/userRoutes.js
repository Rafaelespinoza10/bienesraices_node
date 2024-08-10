import express, { Router } from 'express';
import { autenticarUsario, cerrarSesion, comprobar, comprobarToken, formularioLogin, formularioOlvidePassword, formularioRegistro, nuevoPassword, registrar, resetPassword } from '../controllers/userControllers.js';

const router = express.Router();


// router.get('/', function(request, response){ // get se utiliza cuando un usario visita el sitio web
//     response.json({msg: 'hola mundo en express'});
// });

router.get('/login',formularioLogin);
router.post('/login', autenticarUsario);

//cerrar sesion
router.post('/cerrar-sesion', cerrarSesion);
router.get('/registro',formularioRegistro );
router.post('/registro',registrar); // registra los users
router.get('/recuperarPassword', formularioOlvidePassword);
router.post('/recuperarPassword',resetPassword );
router.get('/confirmar/:token', comprobar);

//almacena el nuevo Password
router.get('/recuperarPassword/:token',comprobarToken);
router.post('/recuperarPassword/:token',nuevoPassword);


// router.route('/')
//     .get(function(request, response){ // get se utiliza cuando un usario visita el sitio web
//         response.json({msg: 'hola mundo en express'});
//     })
//     .post(function(request, response){ // post se utiliza para cuando el usuario llena un formulario
//         response.json({msg: 'respuesta de tipo post'});
//     });

export default router;
