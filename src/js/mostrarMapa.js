<<<<<<< HEAD
(function(){

    const lat = document.querySelector('#lat').textContent;
    const calle = document.querySelector('#calle').textContent
    const lng = document.querySelector('#lng').textContent;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    const titulo = document.querySelector('#titulo').textContent;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Agregar el Pin

    L.marker([lat, lng])
        .addTo(mapa)
        .bindPopup(`${titulo} en ${calle}`);


})();
=======
(function() {
    const lat = document.querySelector('#lat').textContent
    const lng = document.querySelector('#lng').textContent
    const titulo = document.querySelector('#titulo').textContent
    const mapa = L.map('mapa').setView([lat, lng], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Agregar el pin
    L.marker([lat, lng])
        .addTo(mapa)
        .bindPopup(titulo)
    
})()
>>>>>>> 6c306ec (fix email.js)
