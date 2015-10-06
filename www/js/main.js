var pluginListo = false,
    ultimaPosicion;

function nuevaPosicionLista() {
    "use strict";

    document.getElementById("posicionDispositivo").innerHTML = "Posición obtenida:<br> - Latitud: " + ultimaPosicion.coords.latitude + "<br> - Longitud: " + ultimaPosicion.coords.longitude;
}

function obtenerPosicion() {
    "use strict";

    if (pluginListo) {
        document.getElementById("posicionDispositivo").innerHTML = "Obteniendo tu posición...";

        navigator.geolocation.getCurrentPosition(function (posicion) {
            ultimaPosicion = posicion;
            nuevaPosicionLista();
        }, function (error) {
            document.getElementById("posicionDispositivo").innerHTML = "Error obteniendo posición:<br>" + error.code + " - " + error.message;
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
