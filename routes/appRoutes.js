import express from 'express';
import { inicio,categoria, paginaError, buscador } from '../controllers/appController.js';

const router = express.Router(); 

//Pagina de inicio
router.get('/', inicio);
//pagina 404
router.get('/404', paginaError);
// categorias
router.get('/categorias/:id', categoria);
// buscador
router.post('/buscador', buscador);

export default router; 
