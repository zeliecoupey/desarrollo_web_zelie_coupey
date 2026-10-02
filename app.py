import math
import os
import uuid
from datetime import datetime

from flask import Flask, abort, flash, jsonify, redirect, render_template, request, send_from_directory, url_for
from sqlalchemy import func, select
from werkzeug.utils import secure_filename

import validaciones
from db import Ave, Avistamiento, Comuna, Region, Registro, Session, Voluntario

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ITEMS_POR_PAGINA = 4

app = Flask(__name__)
app.secret_key = "clave-solo-para-desarrollo"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

COLUMNAS_ORDEN = {"ave": Ave.nombre, "lugar": Avistamiento.lugar, "fecha": Avistamiento.fecha_hora}


@app.template_filter("fecha")
def filtro_fecha(valor):
    return valor.strftime("%d-%m-%Y %H:%M") if valor else ""


@app.route("/")
def inicio():
    sesion = Session()
    ultimos = sesion.execute(
        select(Avistamiento).order_by(Avistamiento.id.desc()).limit(2)
    ).scalars().all()
    return render_template("inicio.html", ultimos=ultimos)


@app.route("/registro", methods=["GET", "POST"])
def registro():
    sesion = Session()
    valores = {"nombre": "", "correo": "", "telefono": "", "region": "", "comuna": ""}
    errores = {}

    if request.method == "POST":
        valores = {c: request.form.get(c, "").strip() for c in valores}
        errores = validaciones.validar_voluntario(valores)

        if not errores:
            voluntario = Voluntario(
                nombre=valores["nombre"],
                email=valores["correo"],
                telefono=validaciones.limpiar_telefono(valores["telefono"]),
                fecha_registro=datetime.now(),
                comuna_id=validaciones.a_entero(valores["comuna"]),
            )
            sesion.add(voluntario)
            sesion.commit()
            return redirect(url_for("registro_exito", voluntario_id=voluntario.id))

    region_sel = validaciones.a_entero(valores["region"])
    comunas = []
    if region_sel:
        comunas = sesion.execute(select(Comuna).where(Comuna.region_id == region_sel).order_by(Comuna.nombre)).scalars().all()

    regiones = sesion.execute(select(Region).order_by(Region.id)).scalars().all()
    return render_template("registro.html", valores=valores, errores=errores, regiones=regiones, comunas=comunas)


@app.route("/registro/exito")
def registro_exito():
    voluntario_id = validaciones.a_entero(request.args.get("voluntario_id", ""))
    return render_template("registro_exito.html", voluntario_id=voluntario_id)


@app.route("/api/comunas/<int:region_id>")
def api_comunas(region_id):
    sesion = Session()
    comunas = sesion.execute(select(Comuna).where(Comuna.region_id == region_id).order_by(Comuna.nombre)).scalars().all()
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in comunas])


@app.route("/avistamientos/nuevo", methods=["GET", "POST"])
def avistamiento_nuevo():
    sesion = Session()
    valores = {"voluntario": "", "ave": "", "lugar": "", "fechaHora": "", "descripcion": ""}
    errores = {}

    if request.method == "GET":
        vid = request.args.get("voluntario_id", "")
        if validaciones.a_entero(vid):
            valores["voluntario"] = vid
    else:
        valores = {c: request.form.get(c, "").strip() for c in valores}
        errores = validaciones.validar_avistamiento(valores)

        error_archivos, archivos = validaciones.validar_archivos(request.files.getlist("archivo"))
        if error_archivos:
            errores["archivo"] = error_archivos

        if not errores:
            avistamiento = Avistamiento(
                voluntario_id=validaciones.a_entero(valores["voluntario"]),
                ave_id=validaciones.a_entero(valores["ave"]),
                fecha_hora=validaciones.parsear_fecha_hora(valores["fechaHora"]),
                lugar=valores["lugar"],
                descripcion=valores["descripcion"] or None,
            )
            for archivo in archivos:
                extension = archivo.filename.rsplit(".", 1)[-1].lower()
                nombre_unico = uuid.uuid4().hex + "." + extension
                archivo.save(os.path.join(UPLOAD_FOLDER, nombre_unico))
                nombre_original = secure_filename(archivo.filename) or ("archivo." + extension)
                avistamiento.registros.append(Registro(ruta_archivo=nombre_unico, nombre_archivo=nombre_original))

            sesion.add(avistamiento)
            sesion.commit()
            flash("Avistamiento registrado correctamente.")
            return redirect(url_for("inicio"))

    voluntarios = sesion.execute(select(Voluntario).order_by(Voluntario.nombre)).scalars().all()
    aves = sesion.execute(select(Ave).order_by(Ave.nombre)).scalars().all()
    return render_template("avistamiento.html", valores=valores, errores=errores, voluntarios=voluntarios, aves=aves)


@app.route("/avistamientos")
def listado():
    sesion = Session()
    orden = request.args.get("orden", "fecha")
    if orden not in COLUMNAS_ORDEN:
        orden = "fecha"
    direccion = request.args.get("dir", "desc")
    if direccion not in ("asc", "desc"):
        direccion = "desc"
    pagina = validaciones.a_entero(request.args.get("page", "")) or 1

    total = sesion.execute(select(func.count(Avistamiento.id))).scalar_one()
    total_paginas = max(1, math.ceil(total / ITEMS_POR_PAGINA))
    pagina = min(pagina, total_paginas)

    columna = COLUMNAS_ORDEN[orden]
    criterio = columna.asc() if direccion == "asc" else columna.desc()
    consulta = (
        select(Avistamiento).join(Avistamiento.ave)
        .order_by(criterio).limit(ITEMS_POR_PAGINA).offset((pagina - 1) * ITEMS_POR_PAGINA)
    )
    avistamientos = sesion.execute(consulta).scalars().all()

    return render_template("listado.html", avistamientos=avistamientos, total=total, pagina=pagina,
                            total_paginas=total_paginas, orden=orden, direccion=direccion)


@app.route("/avistamientos/<int:avistamiento_id>")
def detalle(avistamiento_id):
    av = Session().get(Avistamiento, avistamiento_id)
    if av is None:
        abort(404)
    return render_template("detalle.html", av=av)


@app.route("/archivos/<int:registro_id>")
def archivo(registro_id):
    reg = Session().get(Registro, registro_id)
    if reg is None:
        abort(404)
    return send_from_directory(UPLOAD_FOLDER, reg.ruta_archivo, mimetype=reg.mimetype)


@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")


if __name__ == "__main__":
    app.run(debug=True)