import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from "../config/db.js";


// crear la tabla de usuarios
const Usuario =  db.define('usuarios', {
    // se define la estructura de la tabla
    nombre : {
        type: DataTypes.STRING,
        allowNull: false, // este campo no puede ir vacio
    }, 
    email:{
        type:DataTypes.STRING,
        allowNull: false,
    }, 
    password:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    token:{
        type:DataTypes.STRING
    },
    confirmado:{
        type:DataTypes.BOOLEAN,
    }, 
}, {
    hooks:{
        // hashear el password con bcrypt y sequelize
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);

        }
    },
    scopes:{
        eliminarPassword:{
                attributes: {
                    exclude:['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
                }
        }
    }
});

//Mtodos personalizados
Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

export default Usuario;
