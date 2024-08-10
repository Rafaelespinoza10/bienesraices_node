import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config({path: '.env'});
// Conexion a la base de datos
const db = new Sequelize(process.env.BD_NOMBRE,process.env.BD_USER,process.env.DB_PASSWORD,{
    host: process.env.DB_HOST,
    port: 3307, 
    dialect: 'mysql',
    define:{
        timestamps: true
    },
    pool:{  /// configura como va a ser el comportamiento para nuevas conexiones
        max:5,
        min:0,
        acquire:30000,   // 30 s  tiempo antes de marcar un error
        idle:10000,
    },
    operatorsAliases: false, 
});

export default db;

