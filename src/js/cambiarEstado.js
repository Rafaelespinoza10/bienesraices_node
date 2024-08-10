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
