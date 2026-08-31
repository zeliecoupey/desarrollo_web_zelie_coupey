// Validaciones del formulario de registro voluntario (registro.html)
// Cada función de validación devuelve un mensaje de error (string) o "" si el campo es válido.

document.addEventListener("DOMContentLoaded", function () {
    var btnRegistrar = document.getElementById("btn-registrar");
    btnRegistrar.addEventListener("click", validarYRegistrar);
});

function validarYRegistrar() {
    var esValido = true;

    esValido = validarCampo("nombre", validarNombre) && esValido;
    esValido = validarCampo("rut", validarRut) && esValido;
    esValido = validarCampo("correo", validarCorreo) && esValido;
    esValido = validarCampo("telefono", validarTelefono) && esValido;
    esValido = validarCampo("region", validarRegion) && esValido;
    esValido = validarCampo("comuna", validarComuna) && esValido;
    esValido = validarCampo("calleynumero", validarCalleYNumero) && esValido;

    if (esValido) {
        // Simula el envío al servidor: se abre una ventanita de confirmación,
        // tal como se muestra en la maqueta ("Datos correctos. Usuario registrado.")
        window.open(
            "confirmacion-registro.html",
            "confirmacionRegistro",
            "width=400,height=220,menubar=no,toolbar=no,location=no"
        );
    }
    // Si no es válido, el formulario se mantiene visible con los mensajes de error ya mostrados
}

// Ejecuta una función de validación sobre un campo y despliega/limpia su mensaje de error
function validarCampo(idCampo, funcionValidadora) {
    var campo = document.getElementById(idCampo);
    var spanError = document.getElementById("error-" + idCampo);
    var mensaje = funcionValidadora(campo.value.trim());
    spanError.textContent = mensaje;
    return mensaje === "";
}

function validarNombre(valor) {
    if (valor === "") return "El nombre es obligatorio.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,60}$/.test(valor)) {
        return "Ingrese solo letras y espacios (2 a 60 caracteres).";
    }
    return "";
}

function validarRut(valor) {
    if (valor === "") return "El RUT es obligatorio.";
    var limpio = valor.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
    if (!/^[0-9]+-[0-9K]$/.test(limpio)) {
        return "Formato inválido. Use el formato 12345678-9.";
    }
    return "";
}

function calcularDigitoVerificador(numero) {
    var suma = 0;
    var multiplo = 2;
    for (var i = numero.length - 1; i >= 0; i--) {
        suma += parseInt(numero.charAt(i), 10) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    var resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
}

function validarCorreo(valor) {
    if (valor === "") return "El correo es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
        return "Ingrese un correo con formato válido (ej. nombre@dominio.cl).";
    }
    return "";
}

function validarTelefono(valor) {
    if (valor === "") return "El teléfono es obligatorio.";
    var limpio = valor.replace(/\s/g, "");
    if (!/^(\+?56)?9\d{8}$/.test(limpio)) {
        return "Ingrese un celular chileno válido (ej. +56 9 1234 5678).";
    }
    return "";
}

function validarRegion(valor) {
    if (valor === "") return "Debe seleccionar una región.";
    return "";
}

function validarComuna(valor) {
    if (valor === "") return "La comuna es obligatoria.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,40}$/.test(valor)) {
        return "Ingrese solo letras y espacios (2 a 40 caracteres).";
    }
    return "";
}

function validarCalleYNumero(valor) {
    if (valor === "") return "La dirección es obligatoria.";
    if (!/^.{5,80}$/.test(valor)) {
        return "Ingrese una dirección válida (mínimo 5 caracteres).";
    }
    return "";
}