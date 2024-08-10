import express from 'express';
import {body} from 'express-validator';
import { admin, agregarImagen, almacenarImagen, cambiarEstado, crear,editar,eliminar,enviaMensaje,guardar, guardarCambios, muestraPropiedad, verMensajes } from '../controllers/propiedadController.js';
import protegerRuta from '../midddleware/protegerRuta.js';
import upload from '../midddleware/subirArchivo.js';
import { identificarUsuario } from '../midddleware/identificarUsuario.js';

const router = express.Router();


router.get('/mis-propiedades', protegerRuta, admin);
router.get('/propiedades/crear', protegerRuta, crear);
router.post('/propiedades/crear', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La Descripcion es Obligatoria')
        .isLength({max:200}).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una caetegoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    //body('lng').isNumeric().withMessage('Selecciona la cantidad de baños'),
    guardar);
router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen);
router.post('/propiedades/agregar-imagen/:id', protegerRuta,upload.single('imagen'), almacenarImagen);
router.get('/propiedades/editar/:id', protegerRuta, editar);

router.post('/propiedades/editar/:id', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La Descripcion es Obligatoria')
        .isLength({max:200}).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una caetegoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    //body('lng').isNumeric().withMessage('Selecciona la cantidad de baños'),
    guardarCambios);

router.post('/propiedades/eliminar/:id', protegerRuta, eliminar);

router.put('/propiedades/:id', protegerRuta, cambiarEstado)
// Area Publica
router.get('/propiedad/:id',identificarUsuario, muestraPropiedad);

//Almacenar los mensajes
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min:20}).withMessage('El Mensaje No Puede Ir Vacio o Es Muy Corto'),
    enviaMensaje);

router.get('/mensajes/:id', protegerRuta, verMensajes);

export default router;
