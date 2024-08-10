import { Categoria, Precio, Propiedad } from "../models/index.js";

const propiedades = async(request, response)=>{
    
    const propiedades = await Propiedad.findAll({
            include:[
                {model: Precio, as: 'precio'},
                {model: Categoria, as: 'categoria'},   
            ]
    });

    response.json({
        propiedades, 
    });

}

export{
    propiedades, 
}