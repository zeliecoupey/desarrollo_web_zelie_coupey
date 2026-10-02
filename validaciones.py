import re
from datetime import datetime, timedelta

ANIOS_MAXIMOS_HACIA_ATRAS = 2
EXTENSIONES_PERMITIDAS = ("jpg", "jpeg", "png", "gif", "webp", "mp4", "webm")
MAX_ARCHIVOS = 5
MAX_BYTES_ARCHIVO = 20 * 1024 * 1024

RE_NOMBRE = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ ]{2,60}")
RE_CORREO = re.compile(r"[^\s@]+@[^\s@]+\.[^\s@]+")
RE_TELEFONO = re.compile(r"(\+?56)?9[0-9]{8}")
RE_ENTERO = re.compile(r"[0-9]{1,9}")


def a_entero(valor):
    if isinstance(valor, str) and RE_ENTERO.fullmatch(valor):
        return int(valor)
    return None


def limpiar_telefono(valor):
    return re.sub(r"\s", "", valor)


def validar_voluntario(v):
    errores = {}
    if v["nombre"] == "":
        errores["nombre"] = "El nombre es obligatorio."
    elif not RE_NOMBRE.fullmatch(v["nombre"]):
        errores["nombre"] = "Ingrese solo letras y espacios (2 a 60 caracteres)."

    if v["correo"] == "":
        errores["correo"] = "El correo es obligatorio."
    elif len(v["correo"]) > 80 or not RE_CORREO.fullmatch(v["correo"]):
        errores["correo"] = "Ingrese un correo válido (máximo 80 caracteres)."

    if v["telefono"] == "":
        errores["telefono"] = "El teléfono es obligatorio."
    elif not RE_TELEFONO.fullmatch(limpiar_telefono(v["telefono"])):
        errores["telefono"] = "Ingrese un celular chileno válido (ej. +56 9 1234 5678)."

    if v["region"] == "" or a_entero(v["region"]) is None:
        errores["region"] = "Debe seleccionar una región válida."

    if v["comuna"] == "" or a_entero(v["comuna"]) is None:
        errores["comuna"] = "Debe seleccionar una comuna válida."

    return errores


def parsear_fecha_hora(valor):
    for formato in ("%Y-%m-%dT%H:%M", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(valor, formato)
        except ValueError:
            continue
    return None


def validar_avistamiento(v):
    errores = {}
    if v["voluntario"] == "" or a_entero(v["voluntario"]) is None:
        errores["voluntario"] = "Debe seleccionar un voluntario válido."

    if v["ave"] == "" or a_entero(v["ave"]) is None:
        errores["ave"] = "Debe seleccionar un ave válida."

    if v["lugar"] == "":
        errores["lugar"] = "El lugar es obligatorio."
    elif len(v["lugar"]) < 3 or len(v["lugar"]) > 100:
        errores["lugar"] = "Ingrese un lugar válido (3 a 100 caracteres)."

    if v["fechaHora"] == "":
        errores["fechaHora"] = "La fecha y hora son obligatorias."
    else:
        fecha = parsear_fecha_hora(v["fechaHora"])
        if fecha is None:
            errores["fechaHora"] = "La fecha y hora no tienen un formato válido."
        else:
            ahora = datetime.now()
            if fecha > ahora:
                errores["fechaHora"] = "La fecha y hora no pueden estar en el futuro."
            elif fecha < ahora - timedelta(days=365 * ANIOS_MAXIMOS_HACIA_ATRAS):
                errores["fechaHora"] = "La fecha es demasiado antigua (máximo %d años atrás)." % ANIOS_MAXIMOS_HACIA_ATRAS

    if len(v["descripcion"]) > 500:
        errores["descripcion"] = "La descripción admite hasta 500 caracteres."

    return errores


def validar_archivos(archivos):
    archivos = [a for a in archivos if a and a.filename]
    if len(archivos) == 0:
        return "Debe adjuntar al menos una foto o vídeo del avistamiento.", []
    if len(archivos) > MAX_ARCHIVOS:
        return "Puede adjuntar como máximo %d archivos." % MAX_ARCHIVOS, []

    for archivo in archivos:
        extension = archivo.filename.rsplit(".", 1)[-1].lower() if "." in archivo.filename else ""
        if extension not in EXTENSIONES_PERMITIDAS:
            return "Formato no permitido. Use: " + ", ".join(EXTENSIONES_PERMITIDAS) + ".", []
        archivo.stream.seek(0, 2)
        tamano = archivo.stream.tell()
        archivo.stream.seek(0)
        if tamano == 0:
            return "Un archivo está vacío.", []
        if tamano > MAX_BYTES_ARCHIVO:
            return "Cada archivo puede pesar como máximo %d MB." % (MAX_BYTES_ARCHIVO // (1024 * 1024)), []

    return "", archivos