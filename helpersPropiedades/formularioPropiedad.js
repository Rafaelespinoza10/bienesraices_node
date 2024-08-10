import { validationResult } from "express-validator";
import {Categoria,Precio, Propiedad } from '../models/index.js'


async function obtenerDatosParaCrearPropiedad(){
    const[categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    ]);
    return {categorias, precios};
}


async function renderCrearPropiedad(request, response, isError) {
    try {
        const { categorias, precios } = await obtenerDatosParaCrearPropiedad();
        
        // Obtener los errores de validación
        const errores = validationResult(request).array();
        
        if (!isError || errores.length > 0) {
            response.render('propiedades/crear', {
                pagina: 'Crear propiedad',
                csrfToken: request.csrfToken(),
                categorias,
                precios,
                errores: errores.length > 0 ? errores : null, // Solo pasar errores si existen
                datos:request.body
            });
        } else {
            response.render('propiedades/crear', {
                pagina: 'Crear propiedad',
                csrfToken: request.csrfToken(),
                categorias,
                precios,
                datos:''
            });
        }
    } catch (error) {
        console.error('Error al renderizar la vista de crear propiedad:', error);
        response.status(500).send('Error interno del servidor');
    }
}


async function renderEditarRegistro(request, response, isError,propiedad){
    try {
        const { categorias, precios } = await obtenerDatosParaCrearPropiedad();

        // Obtener los errores de validación
        const errores = validationResult(request).array();
        console.log(propiedad);
        console.log(categorias);

        if (!isError || errores.length > 0) {
            response.render('propiedades/editar', {
                pagina: `Editar Propiedad : ${propiedad.titulo}`,
                csrfToken: request.csrfToken(),
                categorias,
                precios,
                errores: errores.length > 0 ? errores : null, // Solo pasar errores si existen
                datos:propiedad
            });
        } else {
            response.render('propiedades/editar', {
                pagina: 'Editar Propiedad' `${propiedad.titulo}`,
                csrfToken: request.csrfToken(),
                categorias,
                precios,
                datos:propiedad
            });
        }
    } catch (error) {
        console.error('Error al renderizar la vista de crear propiedad:', error);
        response.status(500).send('Error interno del servidor');
    }
}

async function revisaDatosEditados(request) {
    // Realiza la validación y retorna los errores
    const errores = validationResult(request).array();
    return errores;
}



async function crearRegistro(request, response){
    const{titulo,descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId} = request.body
    const{id: usuarioId} = request.usuario;

    try {
        const propiedadAlmacenda = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones, 
            estacionamiento, 
            wc, 
            calle,
            lat, 
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen:'',
        });

        const {id} = propiedadAlmacenda;
        console.log(id);
        response.redirect(`/propiedades/agregar-imagen/${id}`);
        
    } catch (error) {
        console.error('error al crear un registro', error);
        response.status(500).send('error interno del servidor');
    }
}

export{
    obtenerDatosParaCrearPropiedad,
    renderCrearPropiedad,
    crearRegistro,
    renderEditarRegistro,
    revisaDatosEditados,
}