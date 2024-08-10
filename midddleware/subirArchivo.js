import multer from 'multer';
import path from 'path';
import  {generarId} from '../helpers/token.js';

// se va utilizar el servidor para subir los archivos 
const storage = multer.diskStorage({
    destination: function(request, file, callback){
        callback(null, './public/uploads/')
    }, 
    filename : function(request, file, callback){
        callback(null, generarId() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

export default upload;