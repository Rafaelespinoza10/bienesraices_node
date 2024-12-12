<<<<<<< HEAD
//const express = require('express'); //Common Js
import express from 'express'   // ECMAscript modules
import router from './routes/userRoutes.js';
import Propiedadesrouters from './routes/propiedadesRoutes.js';
import db from './config/db.js';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import appRouters from './routes/appRoutes.js';
import apiRouters from './routes/APIRoutes.js';

// crear la app
const app = express();

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended:true}));

// conexion a la base de datos
try {
    await db.authenticate();    
    console.log('conexion correcta a la base de datos');
    db.sync(); //crea la tabla en caso de que no este creada
} catch (error) {
    console.log(error);
}

//habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

//carpeta Publica
app.use(express.static('public')); // en la carpeta publica se identiifcan los archivos estaticos

//Habilitar cookie parser
app.use(cookieParser())

//habilitar CSRF
app.use(csrf({cookie: true}));

//Routing
//get busca la ruta en especifica (la que sea exacta)
// use busca todas las rutas con '/'
app.use('/',appRouters);
app.use('/auth', router);
app.use('/', Propiedadesrouters);
app.use('/api', apiRouters);  //APIS


//definir un puerto y arrancar el proyecto
const port = process.env.PORT || 10000;

app.listen(port, ()=>{
    console.log(`el servidor esta funcionando en el puerto ${port}`);
=======
import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

// Crear la app
const app = express()

// Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}) )

// Habilitar Cookie Parser
app.use( cookieParser() )

// Habilitar CSRF
app.use( csrf({cookie: true}) )

// Conexión a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('Conexión Correcta a la Base de datos')
} catch (error) {
    console.log(error)
}

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta Pública
app.use( express.static('public') )

// Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)




// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El Servidor esta funcionando en el puerto ${port}`)
>>>>>>> 6c306ec (fix email.js)
});