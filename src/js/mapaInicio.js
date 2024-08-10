(function() {
    const lat = 22.1588334;
    const lng = -100.9662456;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 13);
    let markers = new L.FeatureGroup().addTo(mapa);
    let propiedades = [];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    

    
    //Filtros por categorias y precio
    
    const filtros = {
        categoria:'',
        precio:'',
    }

    const categoriaId = document.querySelector('#categorias');
    const precioId = document.querySelector('#precios');
    
    categoriaId.addEventListener('change', event=>{
        filtros.categoria = +event.target.value;
        filtrarPropiedades();
 
    });

    precioId.addEventListener('change', event=>{
        filtros.precio = +event.target.value;
        filtrarPropiedades();
    });


    const obtenerPropiedades = async () => {
        
        try {
            const url = '/api/propiedades';
            const response = await fetch(url);
            const data = await response.json();
            propiedades = data.propiedades;

            // Accede al array dentro del objeto 'data'
            if (propiedades && Array.isArray(propiedades)) {
                mostrarPropiedades(propiedades);
            } else {
                console.error('La propiedad "propiedades" no es un array:', data);
            }

        } catch (error) {
            console.log(error);
        }
    }

    function mostrarPropiedades(propiedades) {
        markers.clearLayers();       //limpia los pines filtrados 
        propiedades.forEach(propiedad => {
            if (propiedad?.lat && propiedad?.lng) {
                const marker = L.marker([propiedad.lat, propiedad.lng], {
                    autoPan: true,
                }).addTo(mapa)
                .bindPopup(`
                    <div class="mt-5">
                        <p class="text-gray-600 font-bold uppercase"> ${propiedad.categoria.nombre} </p>
                        <h1 class="text-sm font-extrabold uppercase my-5" >${propiedad?.titulo}</h1>
                        <img src="/uploads/${propiedad?.imagen}" alt="Imagen ${propiedad?.titulo}">
                        <p class="text-gray-600 font-bold uppercase">Precio: ${propiedad.precio.nombre} </p>
                        <p class="text-gray-600 font-bold uppercase"> Calle: ${propiedad.calle}</p>
                        <a href="/propiedad/${propiedad.id}" class=" text-black block p-2 uppercase  text-center">Ver Propiedad</a>                   
                    </div>
                        `);

                markers.addLayer(marker);
            } else {
                console.error('Propiedad sin coordenadas válidas:', propiedad);
            }
        });
    }

    function filtrarPropiedades(){

        // chaining
        const result = propiedades.filter(propiedad =>  filtros.categoria? propiedad.categoriaId === filtros.categoria : propiedad)  //el objeto filtro.categoria hay algo entonces que filtre los filtros.categoria y si no solo que muestre la propiedad
        .filter(propiedad => filtros.precio? propiedad.precioId === filtros.precio: propiedad);
        mostrarPropiedades(result);        

    }

 

    obtenerPropiedades();
})();
