var MAX_ARCHIVOS = 5;
var MAX_BYTES_ARCHIVO = 20 * 1024 * 1024;
var EXTENSIONES = ["jpg", "jpeg", "png", "gif", "webp", "mp4", "webm"];
var ANIOS_MAXIMOS_HACIA_ATRAS = 2;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("form-avistamiento").addEventListener("submit", function (evento) {
        if (!validarAvistamiento()) evento.preventDefault();
    });
    document.getElementById("form-avistamiento").addEventListener("reset", limpiarMensajesError);
});

function limpiarMensajesError() {
    document.querySelectorAll("#form-avistamiento .mensaje-error").forEach(function (m) { m.textContent = ""; });
}

function validarAvistamiento() {
    var ok = true;
    ok = validarCampo("voluntario", function (v) { return v === "" ? "Debe seleccionar un voluntario." : ""; }) && ok;
    ok = validarCampo("ave", function (v) { return v === "" ? "Debe seleccionar un ave." : ""; }) && ok;
    ok = validarCampo("lugar", validarLugar) && ok;
    ok = validarCampo("fechaHora", validarFechaHora) && ok;
    ok = validarCampo("descripcion", function (v) { return v.length > 500 ? "Máximo 500 caracteres." : ""; }) && ok;
    ok = validarArchivos() && ok;
    return ok;
}

function validarCampo(id, fn) {
    var campo = document.getElementById(id);
    var span = document.getElementById("error-" + id);
    var msg = fn(campo.value.trim());
    span.textContent = msg;
    return msg === "";
}

function validarLugar(v) {
    if (v === "") return "El lugar es obligatorio.";
    if (v.length < 3 || v.length > 100) return "Ingrese un lugar válido (3 a 100 caracteres).";
    return "";
}

function validarFechaHora(v) {
    if (v === "") return "La fecha y hora son obligatorias.";
    var fecha = new Date(v);
    var ahora = new Date();
    if (fecha > ahora) return "La fecha y hora no pueden estar en el futuro.";
    var limite = new Date();
    limite.setFullYear(ahora.getFullYear() - ANIOS_MAXIMOS_HACIA_ATRAS);
    if (fecha < limite) return "La fecha es demasiado antigua.";
    return "";
}

function validarArchivos() {
    var campo = document.getElementById("archivo");
    var span = document.getElementById("error-archivo");
    var archivos = campo.files;
    var msg = "";

    if (archivos.length === 0) {
        msg = "Debe adjuntar al menos una foto o vídeo.";
    } else if (archivos.length > MAX_ARCHIVOS) {
        msg = "Puede adjuntar como máximo " + MAX_ARCHIVOS + " archivos.";
    } else {
        for (var i = 0; i < archivos.length; i++) {
            var partes = archivos[i].name.split(".");
            var ext = partes.length > 1 ? partes.pop().toLowerCase() : "";
            if (EXTENSIONES.indexOf(ext) === -1) { msg = "Formato no permitido."; break; }
            if (archivos[i].size > MAX_BYTES_ARCHIVO) { msg = "Cada archivo puede pesar máximo 20 MB."; break; }
        }
    }
    span.textContent = msg;
    return msg === "";
}