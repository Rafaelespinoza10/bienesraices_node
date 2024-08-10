import {Dropzone} from 'dropzone';


const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = {
    dictDefaultMessage: 'Arrastra tus imagenes aqui',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1, 
    parallelUploads: 1, 
    autoProcessQueue: false,
    addRemoveLinks: true, 
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El limite es un solo un archivo',
    headers:{
        'CSRF-Token':token
    },
    paramName: 'imagen',   // mismo nombre para upload.single('imagen')
    init: function(){
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar');

        btnPublicar.addEventListener('click', ()=>{
            dropzone.processQueue()
        })

        //finalizar el proceesQueue
        dropzone.on('queuecomplete',()=>{
            if(dropzone.getActiveFiles().length === 0){
                window.location.href = '/mis-propiedades';
            }
        })
    }
}
