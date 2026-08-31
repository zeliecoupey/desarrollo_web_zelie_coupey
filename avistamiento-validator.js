// Validaciones del formulario de avistamiento (avistamiento.html)
// Cada función de validación devuelve un mensaje de error (string) o "" si el campo es válido.

// Límite razonable hacia el pasado: no se aceptan avistamientos informados con más
// de 2 años de antigüedad (evita errores de tipeo como años mal escritos).
var ANIOS_MAXIMOS_HACIA_ATRAS = 2;

document.addEventListener("DOMContentLoaded", function () {
    var btnEnviar = document.getElementById("btn-enviar");
    btnEnviar.addEventListener("click", validarYAgregar);
});

function validarYAgregar() {
    var esValido = true;

    esValido = validarCampo("tipoAve", validarTipoAve) && esValido;
    esValido = validarCampo("nombreAve", validarNombreAve) && esValido;
    esValido = validarCampo("lugar", validarLugar) && esValido;
    esValido = validarCampo("fechaHora", validarFechaHora) && esValido;
    esValido = validarArchivo() && esValido;

    if (esValido) {
        // Simula el envío al servidor: se abre la ventanita de confirmación
        window.open(
            "confirmacion-avistamiento.html",
            "confirmacionAvistamiento",
            "width=420,height=220,menubar=no,toolbar=no,location=no"
        );
    }
    // Si no es válido, el formulario se mantiene visible con los mensajes de error ya mostrados
}

// Ejecuta una función de validación sobre un campo de texto/select y despliega/limpia su mensaje de error
function validarCampo(idCampo, funcionValidadora) {
    var campo = document.getElementById(idCampo);
    var spanError = document.getElementById("error-" + idCampo);
    var mensaje = funcionValidadora(campo.value.trim());
    spanError.textContent = mensaje;
    return mensaje === "";
}

function validarTipoAve(valor) {
    if (valor === "") return "Debe seleccionar un tipo de ave.";
    return "";
}

function validarNombreAve(valor) {
    if (valor === "") return "El nombre del ave es obligatorio.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,60}$/.test(valor)) {
        return "Ingrese solo letras y espacios (2 a 60 caracteres).";
    }
    return "";
}

function validarLugar(valor) {
    if (valor === "") return "El lugar es obligatorio.";
    if (valor.length < 3 || valor.length > 100) {
        return "Ingrese un lugar válido (3 a 100 caracteres).";
    }
    return "";
}

function validarFechaHora(valor) {
    if (valor === "") return "La fecha y hora del avistamiento son obligatorias.";

    var fechaIngresada = new Date(valor);
    var ahora = new Date();

    if (fechaIngresada > ahora) {
        return "La fecha y hora no pueden estar en el futuro.";
    }

    var limiteHaciaAtras = new Date();
    limiteHaciaAtras.setFullYear(ahora.getFullYear() - ANIOS_MAXIMOS_HACIA_ATRAS);

    if (fechaIngresada < limiteHaciaAtras) {
        return "La fecha es demasiado antigua (máximo " + ANIOS_MAXIMOS_HACIA_ATRAS + " años atrás).";
    }

    return "";
}

// El input de archivo se valida aparte porque su "valor" relevante son los archivos seleccionados,
// no el value textual del input.
function validarArchivo() {
    var campo = document.getElementById("archivo");
    var spanError = document.getElementById("error-archivo");

    if (campo.files.length === 0) {
        spanError.textContent = "Debe adjuntar al menos una foto o vídeo del avistamiento.";
        return false;
    }

    spanError.textContent = "";
    return true;
}