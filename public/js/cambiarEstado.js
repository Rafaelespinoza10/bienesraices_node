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

/***/ "./src/js/cambiarEstado.js":
/*!*********************************!*\
  !*** ./src/js/cambiarEstado.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n\r\n   const cambiarEstado = document.querySelectorAll('.cambiar-estado');\r\n    const token = document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\r\n   cambiarEstado.forEach( boton =>{\r\n        boton.addEventListener('click', async (event)=> {\r\n\r\n\r\n            try {\r\n                const {propiedadId: id} = event.target.dataset; \r\n                console.log(id)  \r\n    \r\n                const url = `propiedades/${id}`;\r\n                console.log(url);\r\n                const respuesta = await fetch(url, {\r\n                    method: 'PUT', \r\n                    headers: {\r\n                        'CSRF-Token':token,\r\n                    }\r\n                })\r\n                const {resultado} = await respuesta.json();\r\n                \r\n                if(resultado){\r\n                    if(event.target.classList.contains('bg-indigo-100')){\r\n                        event.target.classList.add('bg-indigo-700', 'text-white');\r\n                        event.target.classList.remove('bg-indigo-100', 'text-black');\r\n                        event.target.textContent = 'Publicado';\r\n                    }else{\r\n                        event.target.classList.remove('bg-indigo-700', 'text-white');\r\n                        event.target.classList.add('bg-indigo-100', 'text-black');\r\n                        event.target.textContent = 'No Publicado';\r\n\r\n                    }\r\n                }\r\n\r\n            } catch (error) {\r\n                console.error(error);\r\n            }\r\n        })\r\n\r\n\r\n   })\r\n})();\r\n\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/cambiarEstado.js?");

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
/******/ 	__webpack_modules__["./src/js/cambiarEstado.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;