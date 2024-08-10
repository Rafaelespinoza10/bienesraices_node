(function() {
    const lat = document.querySelector('#lat').value ||  22.1588334;
    const lng = document.querySelector('#lng').value || -100.9662456;
    const mapa = L.map('mapa').setView([lat, lng ], 12);
    let marker;

    //utilizar Provider y Geocoder
    const geoCoderServicer = L.esri.Geocoding.geocodeService();


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Colocar el pin
    marker  = new L.marker([lat, lng],{
        draggable: true, 
        autoPan: true,

    })
    .addTo(mapa);

    //detectar el mov del pin y leer su lat y lon
    marker.on('moveend', function(event){   
        marker = event.target; 
        console.log(marker);
        const {lat, lng} = marker.getLatLng();
        mapa.panTo(new L.LatLng(lat, lng));

        //obtener la informacion de las calles al soltar el pin
       geoCoderServicer.reverse().latlng([lat,lng], 13).run((error, resultado)=>{
            //console.log(resultado);
            marker.bindPopup(resultado.address.LongLabel);
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
          
        });
       
       //llenar los campos

    });


    


})();
