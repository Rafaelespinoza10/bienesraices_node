<<<<<<< HEAD
import { DataTypes } from "sequelize";
import db from "../config/db.js";


const Categoria = db.define('categorias', {
    nombre:{
        type: DataTypes.STRING(30),
        allowNull: false, 
    }
});

export default Categoria; 
=======
import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Categoria = db.define('categorias', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
});

export default Categoria
>>>>>>> 6c306ec (fix email.js)
