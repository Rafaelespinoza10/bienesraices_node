import {exit} from 'node:process';
import categorias from "./categorias.js";
import db from "../config/db.js";
import precios from './precios.js';
import {Categoria, Precio, Usuario} from '../models/index.js';
import usuarios from './usuarios.js';


const importarDatos = async() =>{
    try {
       //autenticar en la base de datos
       await db.authenticate();
       //generar columnas
        await db.sync();
       //insertar los datos
        await Promise.all([
                           Categoria.bulkCreate(categorias), 
                           Precio.bulkCreate(precios),
                            Usuario.bulkCreate(usuarios),
                        ]); //inserta todos los datos

        console.log('Datos importados correctamente');
        exit();  // termina la ejucicion correctamente

    } catch (error) {
        console.error(error);
        exit(1);    // termina la ejecucion del codigo con errores. 
    }
}

const eliminarDatos = async ()=> {
    try {
        
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate:true}),
        //     Precio.destroy({where: {}, truncate: true})
        // ]);

        await db.sync({force:true}); //otra manera mas sencilla
        console.log('Datos eliminados');
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if(process.argv[2] === "-i" ){
    importarDatos();
}


if(process.argv[2] === "-e"){
    eliminarDatos();
}