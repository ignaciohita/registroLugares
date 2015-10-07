/*global cordova*/
var pluginListo = false,
    ultimaPosicion;

function nuevaPosicionLista() {
    "use strict";

    document.getElementById("posicionDispositivo").innerHTML = "Posici&oacute;n obtenida:<br> - Latitud: " + ultimaPosicion.coords.latitude + "<br> - Longitud: " + ultimaPosicion.coords.longitude;
    document.getElementById("botonMostrarPosicion").style.display = "block";
}

function mostrarPosicion() {
    "use strict";

    cordova.InAppBrowser.open("https://maps.google.com/?q=" + ultimaPosicion.coords.latitude + "," + ultimaPosicion.coords.longitude, "_blank");
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
        }, {
            maximumAge: 3000,
            timeout: 10000,
            enableHighAccuracy: true
        });
    }
}

function dispositivoListo() {
    "use strict";

    pluginListo = true;
}

function inicioAplicacion() {
    "use strict";

    document.addEventListener("deviceready", dispositivoListo);
}
