/*global cordova*/
var pluginListo = false,
    ultimaPosicion,
    referenciaNavegador,
    baseDatos;

function seleccionarTipoNavegador() {
    "use strict";

    localStorage.setItem("preferenciaNavegadorExterno", (document.getElementById("checkNavegador").checked ? "true" : "false"));
}

function nuevaPosicionLista() {
    "use strict";

    document.getElementById("posicionDispositivo").innerHTML = "Posici&oacute;n obtenida:<br> - Latitud: " + ultimaPosicion.coords.latitude + "<br> - Longitud: " + ultimaPosicion.coords.longitude;
    document.getElementById("botonGuardarPosicion").style.display = "block";

    referenciaNavegador = cordova.InAppBrowser.open("https://maps.google.com/?q=" + ultimaPosicion.coords.latitude + "," + ultimaPosicion.coords.longitude, "_blank", "hidden=yes");
    referenciaNavegador.addEventListener("loadstop", function () {
        document.getElementById("botonMostrarPosicion").style.display = "block";
        document.getElementById("labelCheckNavegador").style.display = "block";
    });
}

function mostrarPosicion() {
    "use strict";
    if (document.getElementById("checkNavegador").checked) {
        cordova.InAppBrowser.open("https://maps.google.com/?q=" + ultimaPosicion.coords.latitude + "," + ultimaPosicion.coords.longitude, "_system");
    } else {
        referenciaNavegador.show();
    }
}

function obtenerPosicion() {
    "use strict";

    if (pluginListo) {
        document.getElementById("posicionDispositivo").innerHTML = "Obteniendo tu posici&oacute;n...";

        navigator.geolocation.getCurrentPosition(function (posicion) {
            ultimaPosicion = posicion;
            nuevaPosicionLista();
        }, function (error) {
            document.getElementById("posicionDispositivo").innerHTML = "Error obteniendo posici&oacute;n:<br>" + error.code + " - " + error.message;
            document.getElementById("botonMostrarPosicion").style.display = "none";
            document.getElementById("botonGuardarPosicion").style.display = "none";
            document.getElementById("labelCheckNavegador").style.display = "none";
        }, {
            maximumAge: 3000,
            timeout: 10000,
            enableHighAccuracy: true
        });
    }
}

function mostrarPosicionGuardada(evento) {
    "use strict";

    var transaccion = baseDatos.transaction(["lugares"], "readwrite"),
        store = transaccion.objectStore("lugares"),
        operacion = store.get(evento.srcElement.clave);

    operacion.onsuccess = function () {
        if (document.getElementById("checkNavegador").checked) {
            cordova.InAppBrowser.open("https://maps.google.com/?q=" + operacion.result.coords.latitude + "," + operacion.result.coords.longitude, "_system");
        } else {
            cordova.InAppBrowser.open("https://maps.google.com/?q=" + operacion.result.coords.latitude + "," + operacion.result.coords.longitude, "_blank");
        }
    };
}

function visualizarUltimaPosicionAgregada() {
    "use strict";

    var nodoPosicion = document.createElement("li"),
        enlacePosicion = document.createElement("a"),
        fechaPosicion = new Date(ultimaPosicion.timestamp);

    enlacePosicion.onclick = mostrarPosicionGuardada;

    enlacePosicion.clave = ultimaPosicion.clave;
    enlacePosicion.title = ultimaPosicion.clave + "- " + fechaPosicion.getDate() + "/" + (fechaPosicion.getMonth() + 1) + "/" + fechaPosicion.getFullYear() + " - " + fechaPosicion.getHours() + ":" + fechaPosicion.getMinutes() + ":" + fechaPosicion.getSeconds();
    enlacePosicion.href = "#";
    enlacePosicion.appendChild(document.createTextNode(enlacePosicion.title));

    nodoPosicion.appendChild(enlacePosicion);
    document.getElementById("listaPosicionesGuardadas").appendChild(nodoPosicion);
}

function recuperarPosicionesBaseDatos() {
    "use strict";

    var transaccion = baseDatos.transaction(["lugares"], "readonly"),
        store = transaccion.objectStore("lugares"),
        consulta = store.openCursor();

    consulta.onsuccess = function (event) {
        var posicion = event.target.result;

        if (posicion) {
            document.getElementById("tituloPosicionesGuardadas").style.display = "block";
            ultimaPosicion = event.target.result.value;
            ultimaPosicion.clave = event.target.result.key;
            visualizarUltimaPosicionAgregada();
            posicion.continue();
        }
    };
}

function abrirBaseDatos() {
    "use strict";

    var nuevaBaseDatos = window.indexedDB.open("LugaresBaseDatos", 3);

    nuevaBaseDatos.onupgradeneeded = function (event) {
        //Este código sólo se ejecutará la primera vez

        baseDatos = event.target.result;

        if (!baseDatos.objectStoreNames.contains("lugares")) {
            baseDatos.createObjectStore("lugares", {
                autoIncrement: true
            });
        }
    };

    nuevaBaseDatos.onsuccess = function (event) {
        baseDatos = event.target.result;
        recuperarPosicionesBaseDatos();
    };
}

function agregarPosicionBaseDatos() {
    "use strict";

    document.getElementById("botonGuardarPosicion").style.display = "none";

    var transaccion = baseDatos.transaction(["lugares"], "readwrite"),
        store = transaccion.objectStore("lugares"),
        operacion = store.add({
            timestamp: ultimaPosicion.timestamp,
            coords: {
                latitude: ultimaPosicion.coords.latitude,
                longitude: ultimaPosicion.coords.longitude,
                altitude: ultimaPosicion.coords.altitude,
                accuracy: ultimaPosicion.coords.accuracy,
                altitudeAccuracy: ultimaPosicion.coords.altitudeAccuracy,
                heading: ultimaPosicion.coords.heading,
                speed: ultimaPosicion.coords.speed
            }
        });

    operacion.onsuccess = function (event) {
        ultimaPosicion.clave = event.target.result;
        visualizarUltimaPosicionAgregada();
    };

    operacion.onerror = function (event) {
        document.getElementById("botonGuardarPosicion").style.display = "block";
    };
}

function cerrarBaseDatos() {
    "use strict";

    baseDatos.close();
}

function dispositivoListo() {
    "use strict";

    pluginListo = true;

    document.getElementById("checkNavegador").checked = localStorage.getItem("preferenciaNavegadorExterno") === "true";

    abrirBaseDatos();
}

function inicioAplicacion() {
    "use strict";

    document.addEventListener("deviceready", dispositivoListo);
}
