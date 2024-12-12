<<<<<<< HEAD
import { validationResult } from "express-validator";
import {  crearRegistro, obtenerDatosParaCrearPropiedad, renderCrearPropiedad, renderEditarRegistro, revisaDatosEditados } from "../helpersPropiedades/formularioPropiedad.js";
import Propiedad from "../models/Propiedad.js";
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import {unlink} from 'node:fs/promises';
import { esVendedor, formatearFecha } from "../helpers/index.js";
import Mensaje from "../models/Mensaje.js";
import Usuario from "../models/Usuario.js";


const admin = async(request, response)=>{
    // leer el queryString
    // validar numeros con expresion regular
    const {pagina : paginaActual   }  = request.query;
    
    const expression = /^[1-9]$/  // solo se esperan numeros de 0-9 ^(incia con numeros) $(finaliza con numeros)
    
    if(!expression.test(paginaActual)){
        return response.redirect('/mis-propiedades?pagina=1');  // comprobamos si el queryString cotiene unicamente numeros
    }

    try {

        const {id} = request.usuario;
        //limites y offset para el paginador
        const limit = 5;
        const offset =  ((paginaActual * limit) - limit)

        const [propiedades,total] = await Promise.all([
            Propiedad.findAll({
                limit, 
                offset,
                where:{
                    usuarioId: id
                },
                include:[
                    {model: Categoria, as: 'categoria'},            
                    {model: Precio, as: 'precio'}, 
                    {model: Mensaje, as: 'mensajes'},
                ]
            }),
            Propiedad.count({
                where:{
                    usuarioId: id, 
                }
            })
            
        ])

        response.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: request.csrfToken(),
            paginas: Math.ceil(total/ limit),
            paginaActual:Number(paginaActual), 
            total,
            offset, 
            limit, 
        });

    } catch (error) {
        console.error(error);
    }

}

const guardar = async (request, response)=>{
    //validacion 
    try {
        const errores = validationResult(request).array();

        if(errores.length > 0){
            return renderCrearPropiedad(request, response, true);
        }
        
        await crearRegistro(request, response);
    } catch (error) {
        console.error('error en el controlador guardar', error);
        response.status(500).send('error interno del servidor');
    }
}

const crear = async(request, response) =>{
    try {
        await renderCrearPropiedad(request,response, false);
    } catch (error) {
        console.error(error)   
    }
    
}

const agregarImagen = async(request, response)=>{

    const {id} = request.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return response.redirect('/mis-propiedades');
    }

    //validar que la propiedad no este publicada
    if(propiedad.publicado){s
        return response.redirect('/mis-propiedades');
    }

    //validar que la propiedad pertenece quien visita esta pagina
    if(request.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return response.redirect('/mis-propiedades');
    }
    
    response.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: request.csrfToken(),
        propiedad,
    })
}


const almacenarImagen = async(request, response, next) =>{
    const {id} = request.params;
    console.log(request.params);
    console.log(id);
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
       return response.redirect('/mis-propiedades');
    }

    //validar que la propiedad no este publicada
    if(propiedad.publicado){
        return response.redirect('/mis-propiedades');
    }

    //validar que la propiedad pertenece quien visita esta pagina
    if(request.usuario.id.toString() !== propiedad.usuarioId.toString()){

        return response.redirect('/mis-propiedades');
    }
 
    try {
        console.log('entra en el try');
        console.log(request.file);
        //almacenar la imagen y publicar la propiedad
        propiedad.imagen  = request.file.filename;
        propiedad.publicado = 1; 
        console.log(propiedad.imagen)
        await propiedad.save();
        next(); // nos rederiecciona al siguiente midleware

    } catch (error) {
        console.error(error);
    }
}

const editar = async (request, response)=>{
    try{

    const{id} = request.params;

    //validar que la propiedad exista
        const propiedad = await Propiedad.findByPk(id);
        if(!propiedad){
            return response.redirect('/mis-propiedades');
        }
    //validar que el usuario que creo la propiedad la pueda editar
        if(propiedad.usuarioId.toString() !== request.usuario.id.toString()){
            return response.redirect('/mis-propiedades');
        }

        await renderEditarRegistro(request,response, false, propiedad);
    } catch (error) {
        console.error(error)   
    }

}

const guardarCambios = async (request, response) => {
    try {
        const { id } = request.params;
        const propiedad = await Propiedad.findByPk(id);

        // Validar que la propiedad exista
        if (!propiedad) {
            return response.redirect('/mis-propiedades');
        }

        // Validar que el usuario que creó la propiedad la pueda editar
        if (propiedad.usuarioId.toString() !== request.usuario.id.toString()) {
            return response.redirect('/mis-propiedades');
        }

        // Obtener errores de validación
        const errores = await revisaDatosEditados(request);

        if (errores.length > 0) {
            const { categorias, precios } = await obtenerDatosParaCrearPropiedad();
            return response.render('propiedades/editar', {
                pagina: 'Editar Propiedad',
                csrfToken: request.csrfToken(),
                categorias,
                precios,
                errores,
                datos: request.body,
            });
        }

        // Reescribir el objeto y actualizarlo
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = request.body;
        propiedad.set({
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
        });

        await propiedad.save();
        response.redirect('/mis-propiedades');
    } catch (error) {
        console.error('Error en guardarCambios:', error);
        response.status(500).send('Error al guardar los cambios.');
    }
};

const eliminar = async(request, response)=>{

        const{id} = request.params;
        const propiedad = await Propiedad.findByPk(id);

        if(!propiedad){
            return response.redirect('/mis-propiedades');
        }

        if(propiedad.usuarioId.toString() !== request.usuario.id.toString()){
            return response.redirect('/mis-propiedades');
        }
        
        //eliminar las imagenes
        if(propiedad.imagen){
            await unlink(`public/uploads/${propiedad.imagen}`);
            console.log(`se elimino la imagen ${propiedad.imagen}`);
        }

        //Eliminar la propiedad
        await propiedad.destroy();
        response.redirect('/mis-propiedades');
        
}


//Modifica el estado de la propiedad
const cambiarEstado = async(request, response)=>{


    const{id} = request.params;
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return response.redirect('/mis-propiedades');
    }

    if(propiedad.usuarioId.toString() !== request.usuario.id.toString()){
        return response.redirect('/mis-propiedades');
    }

    propiedad.publicado = !propiedad.publicado

    await propiedad.save()
    response.json({
        resultado : true
    });

}

// Area publica 

const muestraPropiedad = async (request, response) => {
    try {
       
        const{id} = request.params;
       console.log(request.usuario);
        const propiedades = await Propiedad.findByPk(id,
            {
                include: [
                    {model: Precio, as: 'precio'},
                    {model: Categoria, as: 'categoria'},
                    

                ]
            });


        if(!propiedades || !propiedades.publicado){
            return response.rendirect('/404');
        }

     
        response.render('propiedades/mostrar', {
            propiedades,
            pagina: propiedades.titulo, 
            csrfToken: request.csrfToken(),
            usuario: request.usuario,
            esVendedor: esVendedor(request.usuario?.id, propiedades.usuarioId),

        });
    } catch (error) {
        console.error('Error en muestraPropiedad:', error);
        response.redirect('/404');
    }
}


const enviaMensaje = async(request, response)=>{

    try {
       
        const{id} = request.params;
        const propiedades = await Propiedad.findByPk(id,
            {
                include: [
                    {model: Precio, as: 'precio'},
                    {model: Categoria, as: 'categoria'},
                    

                ]
            });


        if(!propiedades){
            return response.rendirect('/404');
        }

        //renderizar los errores
        let resultado = validationResult(request);

        if(!resultado.isEmpty()){
            return response.render('propiedades/mostrar', {
                propiedades,
                pagina: propiedades.titulo, 
                csrfToken: request.csrfToken(),
                usuario: request.usuario,
                esVendedor: esVendedor(request.usuario?.id, propiedades.usuarioId),
                errores: resultado.array(),
            });   
        }
        
        const {mensaje} = request.body;
        const{id: propiedadId} = request.params;
        const{id: usuarioId} = request.usuario;

        console.log('body' , request.body)
        console.log('params', request.params)
        console.log('usuer' , request.usuario)
        //Almacenar mensaje 
        await Mensaje.create({
            mensaje, 
            propiedadId, 
            usuarioId,
        })
        
        response.redirect('/');
        
    } catch (error) {
        console.error('Error en muestraPropiedad:', error);
        response.redirect('/404');
    }
}

const verMensajes = async(request, response)=>{
    const{id} = request.params;
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            {model: Mensaje, as: 'mensajes', 

            include:[
                {model: Usuario.scope('eliminarPassword'), as:'usuario'}
            ]                
            }
        ]
    });

    if(!propiedad){
        return response.redirect('/mis-propiedades');
    }

    if(propiedad.usuarioId.toString() !== request.usuario.id.toString()){
        return response.redirect('/mis-propiedades');
    }
    response.render('propiedades/mensajes',{
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        
        formatearFecha,
    })
}

export{
    admin, 
    crear,
    guardar,
    agregarImagen,
    almacenarImagen, 
    editar,
    guardarCambios,
    eliminar, 
    cambiarEstado,
    muestraPropiedad, 
    enviaMensaje, 
    verMensajes, 
}

=======
import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js'
import { esVendedor, formatearFecha } from '../helpers/index.js'

const admin = async (req, res) => {

    // Leer QueryString

    const { pagina: paginaActual } = req.query
    
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const {id} = req.usuario

        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual * limit) - limit)

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId : id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    { model: Mensaje, as: 'mensajes' }
                ],
            }),
            Propiedad.count({
                where: {
                    usuarioId : id
                }
            })
        ])

        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })

    } catch (error) {
        console.log(error)
    }
    
}

// Formulario para crear una nueva propiedad
const crear = async (req, res) => {
    // Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {

    // Validación
    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {

        // Consultar Modelo de Precio y Categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios, 
            errores: resultado.array(),
            datos: req.body
        })
    }

    // Crear un Registro

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

    const { id: usuarioId } = req.usuario
  
    try {
        const propiedadGuardada = await Propiedad.create({
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
            imagen: ''
        })

        const {id} = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req, res) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ) {
        return res.redirect('/mis-propiedades')
    }
    
    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req, res, next) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    try {
        // console.log(req.file)

        // Almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()

        next()

    } catch (error) {
        console.log(error)
    }
}

const editar = async (req, res) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    // Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req, res ) => {
    
    // Verificar la validación
    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {

        // Consultar Modelo de Precio y Categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    // Reescribir el objeto y actualizarlo
    try {

        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })
        
        await propiedad.save();

        res.redirect('/mis-propiedades')
        
    } catch (error) {
        console.log(error)
    }

}

const eliminar = async (req, res) => {
    
    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    // Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)
    console.log(`Se eliminó la imagen ${propiedad.imagen}`)

    // Eliminar la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')
}

// Modifica el estado de la propiedad
const cambiarEstado = async (req, res) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    // Actualizar
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado: true
    })
}

// Muestra una propiedad
const mostrarPropiedad = async (req, res) => {
    const {id} = req.params

    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include : [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria', scope: 'eliminarPassword' },
        ]
    })

    if(!propiedad || !propiedad.publicado) {
        return res.redirect('/404')
    }


    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId )
    })
}


const enviarMensaje = async (req, res) => {
    const {id} = req.params

    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include : [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' },
        ]
    })

    if(!propiedad) {
        return res.redirect('/404')
    }

    // Renderizar los errores
        // Validación
    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {

        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId ),
            errores: resultado.array()
        })
    }
    const { mensaje } = req.body
    const { id: propiedadId } = req.params
    const { id: usuarioId } = req.usuario

    // Almacenar el mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })


    res.redirect('/')

}


// Leer mensajes recibidos
const verMensajes = async (req, res) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Mensaje, as: 'mensajes', 
                include: [
                    {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                ]
            },
        ],
    })

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}
>>>>>>> 6c306ec (fix email.js)
