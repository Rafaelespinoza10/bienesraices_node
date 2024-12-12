<<<<<<< HEAD
import { Categoria, Precio, Propiedad } from "../models/index.js";
import { Sequelize } from "sequelize";

const inicio = async(request, response)=>{
    

    /* mostrar casas y departamentos en la vista de inicia estos parametros se mandan al pug */
    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw:true}),
        Propiedad.findAll({
            limit:3, 
            where:{
                categoriaId: 1
            },
            include:[
                {
                model: Precio, 
                as: 'precio',
            }
        ],
         order:[
             
             ['createdAt', 'DESC']
         ]
        }),   

        Propiedad.findAll({
            limit:3, 
            where:{
                categoriaId: 2
            },
            include:[
                {
                model: Precio, 
                as: 'precio',
            }
        ],
         order:[

             ['createdAt', 'DESC']
         ] 
        })



    ])

    response.render('inicio', {
            pagina: 'Inicio',
            categorias, 
            precios,
            casas, 
            departamentos, 
            csrfToken: request.csrfToken(),

    });
}

const categoria = async (request, response) => {
   
   try {
       const{id} = request.params;
        console.log(id);
        const categoria = await Categoria.findByPk(id);
        
        if(!categoria){
        return response.redirect('/404');
        }

    const propiedades = await Propiedad.findAll({
       where:{
             categoriaId: id
         },
         include:[
             { model: Precio, as:'precio'}
         ]
        });


        response.render('categoria', {
            pagina: `${categoria.nombre}s En Venta`,
             propiedades,
             csrfToken: request.csrfToken(),
        });

   } catch (error) {
        console.error(error);
   }
}

const paginaError = (request, response)=>{
    response.render('404', {
        pagina: 'No encontrada',
        csrfToken: request.csrfToken(),
    });
}

const buscador = async (request,response)=>{

    const {termino} = request.body;

    if(!termino.trim()){
        return response.redirect('back'); //regresa a la pagina anterior
    }

    console.log(termino)
    // Consultar propiedades
    const propiedades = await Propiedad.findAll({
        where:{
            titulo: {
                [Sequelize.Op.like] :'%' + termino + '%'

            },
        }, 
        include:[
            {model:Precio, as: 'precio'}
        ]
    });

    response.render('busqueda',{
        pagina: `Busqueda para "${termino}"`, 
        propiedades,
        csrfToken: request.csrfToken(),
    })
}


export{
    inicio, 
    categoria, 
    paginaError, 
    buscador, 
}
=======
import { Sequelize } from 'sequelize'
import { Precio, Categoria, Propiedad } from '../models/index.js'

const inicio = async (req, res) => {


    const [ categorias, precios, casas, departamentos ] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: { 
                categoriaId: 1
            },
            include: [
                {
                    model: Precio, 
                    as: 'precio'
                }
            ], 
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: { 
                categoriaId: 2
            },
            include: [
                {
                    model: Precio, 
                    as: 'precio'
                }
            ], 
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])


    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken()
    })
}

const categoria = async (req, res) => {
    const { id } = req.params

    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if(!categoria) {
        return res.redirect('/404')
    }

    // Obtener las propiedades de la categoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        }, 
        include: [
            { model: Precio, as: 'precio'}
        ]
    })

    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        propiedades,
        csrfToken: req.csrfToken()
    })

}

const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}

const buscador = async (req, res) => {
    const { termino } = req.body

    // Validar que termino no este vacio
    if(!termino.trim()) {
        return res.redirect('back')
    }

    // Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include: [
            { model: Precio, as: 'precio'}
        ]
    })

    res.render('busqueda', {
        pagina: 'Resultados de la Búsqueda',
        propiedades, 
        csrfToken: req.csrfToken()
    })
    
}


export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}
>>>>>>> 6c306ec (fix email.js)
