/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

<<<<<<< HEAD
eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    const lat = 22.1588334;\r\n    const lng = -100.9662456;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng], 13);\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n    let propiedades = [];\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n    \r\n\r\n    \r\n    //Filtros por categorias y precio\r\n    \r\n    const filtros = {\r\n        categoria:'',\r\n        precio:'',\r\n    }\r\n\r\n    const categoriaId = document.querySelector('#categorias');\r\n    const precioId = document.querySelector('#precios');\r\n    \r\n    categoriaId.addEventListener('change', event=>{\r\n        filtros.categoria = +event.target.value;\r\n        filtrarPropiedades();\r\n \r\n    });\r\n\r\n    precioId.addEventListener('change', event=>{\r\n        filtros.precio = +event.target.value;\r\n        filtrarPropiedades();\r\n    });\r\n\r\n\r\n    const obtenerPropiedades = async () => {\r\n        \r\n        try {\r\n            const url = '/api/propiedades';\r\n            const response = await fetch(url);\r\n            const data = await response.json();\r\n            propiedades = data.propiedades;\r\n\r\n            // Accede al array dentro del objeto 'data'\r\n            if (propiedades && Array.isArray(propiedades)) {\r\n                mostrarPropiedades(propiedades);\r\n            } else {\r\n                console.error('La propiedad \"propiedades\" no es un array:', data);\r\n            }\r\n\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n\r\n    function mostrarPropiedades(propiedades) {\r\n        markers.clearLayers();       //limpia los pines filtrados \r\n        propiedades.forEach(propiedad => {\r\n            if (propiedad?.lat && propiedad?.lng) {\r\n                const marker = L.marker([propiedad.lat, propiedad.lng], {\r\n                    autoPan: true,\r\n                }).addTo(mapa)\r\n                .bindPopup(`\r\n                    <div class=\"mt-5\">\r\n                        <p class=\"text-gray-600 font-bold uppercase\"> ${propiedad.categoria.nombre} </p>\r\n                        <h1 class=\"text-sm font-extrabold uppercase my-5\" >${propiedad?.titulo}</h1>\r\n                        <img src=\"/uploads/${propiedad?.imagen}\" alt=\"Imagen ${propiedad?.titulo}\">\r\n                        <p class=\"text-gray-600 font-bold uppercase\">Precio: ${propiedad.precio.nombre} </p>\r\n                        <p class=\"text-gray-600 font-bold uppercase\"> Calle: ${propiedad.calle}</p>\r\n                        <a href=\"/propiedad/${propiedad.id}\" class=\" text-black block p-2 uppercase  text-center\">Ver Propiedad</a>                   \r\n                    </div>\r\n                        `);\r\n\r\n                markers.addLayer(marker);\r\n            } else {\r\n                console.error('Propiedad sin coordenadas válidas:', propiedad);\r\n            }\r\n        });\r\n    }\r\n\r\n    function filtrarPropiedades(){\r\n\r\n        // chaining\r\n        const result = propiedades.filter(propiedad =>  filtros.categoria? propiedad.categoriaId === filtros.categoria : propiedad)  //el objeto filtro.categoria hay algo entonces que filtre los filtros.categoria y si no solo que muestre la propiedad\r\n        .filter(propiedad => filtros.precio? propiedad.precioId === filtros.precio: propiedad);\r\n        mostrarPropiedades(result);        \r\n\r\n    }\r\n\r\n \r\n\r\n    obtenerPropiedades();\r\n})();\r\n\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapaInicio.js?");
=======
eval("__webpack_require__.r(__webpack_exports__);\n(function(){\n    const lat = 34.040967;\n    const lng = -118.1618621;\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);\n\n    let markers = new L.FeatureGroup().addTo(mapa)\n\n    let propiedades = [];\n\n    // Filtros\n    const filtros = {\n        categoria: '',\n        precio: ''\n    }\n\n    const categoriasSelect = document.querySelector('#categorias');\n    const preciosSelect = document.querySelector('#precios');\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa)\n\n    // Filtrado de Categorias y precios\n    categoriasSelect.addEventListener('change', e => {\n        filtros.categoria = +e.target.value\n        filtrarPropiedades();\n    })\n\n    preciosSelect.addEventListener('change', e => {\n        filtros.precio = +e.target.value\n        filtrarPropiedades();\n    })\n\n    const obtenerPropiedades = async () => {\n        try {\n            const url = '/api/propiedades'\n            const respuesta = await fetch(url)\n            propiedades = await respuesta.json()\n            mostrarPropiedades(propiedades)\n        } catch (error) {\n            console.log(error)\n        }\n    }\n\n    const mostrarPropiedades = propiedades => {\n\n        // Limpiar los markers previos\n        markers.clearLayers()\n\n        propiedades.forEach(propiedad => {\n            // Agregar los pines\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng ], {\n                autoPan: true\n            })\n            .addTo(mapa)\n            .bindPopup(`\n                <p class=\"text-indigo-600 font-bold\">${propiedad.categoria.nombre}</p>\n                <h1 class=\"text-xl font-extrabold uppercase my-2\">${propiedad?.titulo}</h1>\n                <img src=\"/uploads/${propiedad?.imagen}\" alt=\"Imagen de la propiedad ${propiedad.titulo}\">\n                <p class=\"text-gray-600 font-bold\">${propiedad.precio.nombre}</p>\n                <a href=\"/propiedad/${propiedad.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\">Ver Propiedad</a>\n            `)\n            markers.addLayer(marker)\n        })\n    }\n\n    const filtrarPropiedades = () => {\n        const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio )\n        mostrarPropiedades(resultado)\n    }\n\n\n    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad\n    \n     const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad\n\n\n    obtenerPropiedades()\n\n\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapaInicio.js?");
>>>>>>> 6c306ec (fix email.js)

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;