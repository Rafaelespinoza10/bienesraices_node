import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config({path: '.env'});
// Conexion a la base de datos
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS,{
    host: process.env.BD_HOST,
    port: 3307, 
    dialect: 'mysql',
    logging: console.log, // Muestra logs SQL en la consola
    define:{
        timestamps: true
    },
    pool:{  /// configura como va a ser el comportamiento para nuevas conexiones
        max:10,
        min:0,
        acquire:30000,   // 30 s  tiempo antes de marcar un error
        idle:10000,
    },
    //operatorsAliases: false, 
});

console.log(process.env.BD_NOMBRE)
console.log(process.env.BD_USER)
console.log(process.env.BD_PASS)
console.log(process.env.BD_HOST)



export default db;

