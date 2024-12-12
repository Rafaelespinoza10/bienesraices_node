<<<<<<< HEAD
(function(){

   const cambiarEstado = document.querySelectorAll('.cambiar-estado');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
   cambiarEstado.forEach( boton =>{
        boton.addEventListener('click', async (event)=> {


            try {
                const {propiedadId: id} = event.target.dataset; 
                console.log(id)  
    
                const url = `propiedades/${id}`;
                console.log(url);
                const respuesta = await fetch(url, {
                    method: 'PUT', 
                    headers: {
                        'CSRF-Token':token,
                    }
                })
                const {resultado} = await respuesta.json();
                
                if(resultado){
                    if(event.target.classList.contains('bg-indigo-100')){
                        event.target.classList.add('bg-indigo-700', 'text-white');
                        event.target.classList.remove('bg-indigo-100', 'text-black');
                        event.target.textContent = 'Publicado';
                    }else{
                        event.target.classList.remove('bg-indigo-700', 'text-white');
                        event.target.classList.add('bg-indigo-100', 'text-black');
                        event.target.textContent = 'No Publicado';

                    }
                }

            } catch (error) {
                console.error(error);
            }
        })


   })
})();
=======
(function() {
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    cambiarEstadoBotones.forEach( boton => {
        boton.addEventListener('click', cambiarEstadoPropiedad)
    } )


    async function cambiarEstadoPropiedad(e) {

        const { propiedadId: id } = e.target.dataset
        
        try {
            const url = `/propiedades/${id}`

            const respuesta = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            })

            const {resultado} = await respuesta.json()

            if(resultado) {
                if(e.target.classList.contains('bg-yellow-100')) {
                    e.target.classList.add('bg-green-100', 'text-green-800')
                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'Publicado'
                } else {
                    e.target.classList.remove('bg-green-100', 'text-green-800')
                    e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'No Publicado'
                }
            }
        } catch (error) {
            console.log(error)
        }
       
    }
})()
>>>>>>> 6c306ec (fix email.js)
