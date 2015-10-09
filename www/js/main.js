/*global cordova*/
var pluginListo = false,
    ultimaPosicion,
    referenciaNavegador;

function seleccionarTipoNavegador() {
    "use strict";

    localStorage.setItem("preferenciaNavegadorExterno", (document.getElementById("checkNavegador").checked ? "true" : "false"));
}

function nuevaPosicionLista() {
    "use strict";

    document.getElementById("posicionDispositivo").innerHTML = "Posici&oacute;n obtenida:<br> - Latitud: " + ultimaPosicion.coords.latitude + "<br> - Longitud: " + ultimaPosicion.coords.longitude;

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
            document.getElementById("labelCheckNavegador").style.display = "none";
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
    document.getElementById("checkNavegador").checked = localStorage.getItem("preferenciaNavegadorExterno") === "true";
}

function inicioAplicacion() {
    "use strict";

    document.addEventListener("deviceready", dispositivoListo);
}
