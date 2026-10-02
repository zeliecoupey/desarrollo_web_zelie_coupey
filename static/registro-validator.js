document.getElementById("region").addEventListener("change", cargarComunas);

function cargarComunas() {
    var regionId = document.getElementById("region").value;
    var selectComuna = document.getElementById("comuna");
    selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';
    if (regionId === "") return;

    fetch("/api/comunas/" + regionId)
        .then(function (r) { return r.json(); })
        .then(function (comunas) {
            comunas.forEach(function (c) {
                var o = document.createElement("option");
                o.value = c.id;
                o.textContent = c.nombre;
                selectComuna.appendChild(o);
            });
        });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("form-registro").addEventListener("submit", function (evento) {
        if (!validarRegistro()) evento.preventDefault();
    });
    document.getElementById("form-registro").addEventListener("reset", limpiarMensajesError);
});

function limpiarMensajesError() {
    document.querySelectorAll("#form-registro .mensaje-error").forEach(function (m) { m.textContent = ""; });
}

function validarRegistro() {
    var ok = true;
    ok = validarCampo("nombre", validarNombre) && ok;
    ok = validarCampo("correo", validarCorreo) && ok;
    ok = validarCampo("telefono", validarTelefono) && ok;
    ok = validarCampo("region", validarRegion) && ok;
    ok = validarCampo("comuna", validarComuna) && ok;
    return ok;
}

function validarCampo(id, fn) {
    var campo = document.getElementById(id);
    var span = document.getElementById("error-" + id);
    var msg = fn(campo.value.trim());
    span.textContent = msg;
    return msg === "";
}

function validarNombre(v) {
    if (v === "") return "El nombre es obligatorio.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,60}$/.test(v)) return "Ingrese solo letras y espacios (2 a 60 caracteres).";
    return "";
}
function validarCorreo(v) {
    if (v === "") return "El correo es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Ingrese un correo válido.";
    return "";
}
function validarTelefono(v) {
    if (v === "") return "El teléfono es obligatorio.";
    var limpio = v.replace(/\s/g, "");
    if (!/^(\+?56)?9\d{8}$/.test(limpio)) return "Ingrese un celular chileno válido (ej. +56 9 1234 5678).";
    return "";
}
function validarRegion(v) { return v === "" ? "Debe seleccionar una región." : ""; }
function validarComuna(v) { return v === "" ? "Debe seleccionar una comuna." : ""; }