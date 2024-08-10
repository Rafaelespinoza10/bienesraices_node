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
