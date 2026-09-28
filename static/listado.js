// Datos inventados de avistamientos (no hay servidor/base de datos real en este prototipo).
// Cada avistamiento es un objeto JS con los mismos campos que se piden en avistamiento.html.
var avistamientos = [
    { tipo: "rapaz",       nombreAve: "Águila mora",        lugar: "Cajón del Maipo",            fechaHora: "2026-08-12T09:30" },
    { tipo: "acuatica",    nombreAve: "Cisne de cuello negro", lugar: "Humedal Batuco",          fechaHora: "2026-07-20T17:15" },
    { tipo: "paseriforme", nombreAve: "Zorzal común",        lugar: "Parque Bicentenario, Vitacura", fechaHora: "2026-08-25T08:00" },
    { tipo: "psitacido",   nombreAve: "Tricahue",            lugar: "Parque Nacional La Campana", fechaHora: "2026-06-02T11:45" },
    { tipo: "otro",        nombreAve: "Chuncho",             lugar: "Reserva Altos de Lircay",    fechaHora: "2026-05-14T20:10" },
    { tipo: "rapaz",       nombreAve: "Tiuque",              lugar: "Cerro San Cristóbal",         fechaHora: "2026-08-01T13:20" },
    { tipo: "acuatica",    nombreAve: "Garza cuca",          lugar: "Estero Marga Marga",          fechaHora: "2026-07-05T07:50" },
    { tipo: "paseriforme", nombreAve: "Diucón",              lugar: "Reserva Nacional Río Clarillo", fechaHora: "2026-04-18T10:05" },
    { tipo: "psitacido",   nombreAve: "Loro tricahue",       lugar: "Parque Metropolitano",        fechaHora: "2026-08-28T16:40" },
    { tipo: "otro",        nombreAve: "Picaflor gigante",    lugar: "Valle del Elqui",             fechaHora: "2026-03-22T18:30" }
];

var ITEMS_POR_PAGINA = 4;

var estado = {
    filtroTipo: "",
    campoOrden: null,
    direccionOrden: 1, // 1 = ascendente, -1 = descendente
    paginaActual: 1
};

var NOMBRES_TIPO = {
    rapaz: "Rapaz",
    acuatica: "Acuática",
    paseriforme: "Paseriforme",
    psitacido: "Psitácido",
    otro: "Otro"
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("filtro-tipo").addEventListener("change", function (evento) {
        estado.filtroTipo = evento.target.value;
        estado.paginaActual = 1;
        actualizarTabla();
    });

    var encabezadosOrdenables = document.querySelectorAll("th.ordenable");
    encabezadosOrdenables.forEach(function (encabezado) {
        encabezado.addEventListener("click", function () {
            var campo = encabezado.getAttribute("data-campo");
            if (estado.campoOrden === campo) {
                estado.direccionOrden = estado.direccionOrden * -1;
            } else {
                estado.campoOrden = campo;
                estado.direccionOrden = 1;
            }
            actualizarIndicadoresOrden();
            actualizarTabla();
        });
    });

    document.getElementById("btn-pagina-anterior").addEventListener("click", function () {
        if (estado.paginaActual > 1) {
            estado.paginaActual--;
            actualizarTabla();
        }
    });

    document.getElementById("btn-pagina-siguiente").addEventListener("click", function () {
        var totalPaginas = calcularTotalPaginas();
        if (estado.paginaActual < totalPaginas) {
            estado.paginaActual++;
            actualizarTabla();
        }
    });

    actualizarTabla();
});

function obtenerDatosFiltrados() {
    if (estado.filtroTipo === "") {
        return avistamientos.slice();
    }
    return avistamientos.filter(function (avistamiento) {
        return avistamiento.tipo === estado.filtroTipo;
    });
}

function obtenerDatosOrdenados(datos) {
    if (!estado.campoOrden) {
        return datos;
    }
    var campo = estado.campoOrden;
    var direccion = estado.direccionOrden;
    return datos.sort(function (a, b) {
        if (a[campo] < b[campo]) return -1 * direccion;
        if (a[campo] > b[campo]) return 1 * direccion;
        return 0;
    });
}

function calcularTotalPaginas() {
    var totalItems = obtenerDatosFiltrados().length;
    return Math.max(1, Math.ceil(totalItems / ITEMS_POR_PAGINA));
}

function obtenerDatosPagina(datos) {
    var inicio = (estado.paginaActual - 1) * ITEMS_POR_PAGINA;
    return datos.slice(inicio, inicio + ITEMS_POR_PAGINA);
}

function formatearFecha(valorIso) {
    var fecha = new Date(valorIso);
    var opciones = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return fecha.toLocaleString("es-CL", opciones);
}

function actualizarTabla() {
    var datosFiltrados = obtenerDatosFiltrados();
    var datosOrdenados = obtenerDatosOrdenados(datosFiltrados);

    var totalPaginas = calcularTotalPaginas();
    if (estado.paginaActual > totalPaginas) {
        estado.paginaActual = totalPaginas;
    }

    var datosPagina = obtenerDatosPagina(datosOrdenados);
    var cuerpoTabla = document.getElementById("cuerpo-tabla");
    cuerpoTabla.innerHTML = "";

    datosPagina.forEach(function (avistamiento) {
        var fila = document.createElement("tr");

        fila.appendChild(crearCelda(NOMBRES_TIPO[avistamiento.tipo] || avistamiento.tipo));
        fila.appendChild(crearCelda(avistamiento.nombreAve));
        fila.appendChild(crearCelda(avistamiento.lugar));
        fila.appendChild(crearCelda(formatearFecha(avistamiento.fechaHora)));
        fila.appendChild(crearCelda("Foto/vídeo adjunto"));

        cuerpoTabla.appendChild(fila);
    });

    var mensajeSinResultados = document.getElementById("sin-resultados");
    var tabla = document.getElementById("tabla-avistamientos");
    if (datosFiltrados.length === 0) {
        mensajeSinResultados.classList.remove("oculto");
        tabla.classList.add("oculto");
    } else {
        mensajeSinResultados.classList.add("oculto");
        tabla.classList.remove("oculto");
    }

    document.getElementById("indicador-pagina").textContent =
        "Página " + estado.paginaActual + " de " + totalPaginas;
    document.getElementById("btn-pagina-anterior").disabled = estado.paginaActual <= 1;
    document.getElementById("btn-pagina-siguiente").disabled = estado.paginaActual >= totalPaginas;
}

function crearCelda(texto) {
    var celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

function actualizarIndicadoresOrden() {
    var encabezados = document.querySelectorAll("th.ordenable");
    encabezados.forEach(function (encabezado) {
        var flecha = encabezado.querySelector(".flecha-orden");
        var campo = encabezado.getAttribute("data-campo");
        if (campo === estado.campoOrden) {
            flecha.textContent = estado.direccionOrden === 1 ? "▲" : "▼";
        } else {
            flecha.textContent = "";
        }
    });
}
