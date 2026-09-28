from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def inicio():
    return render_template("inicio.html")
@app.route("/registro")
def registro():
    return render_template("registro.html")

@app.route("/avistamientos/nuevo")
def avistamiento_nuevo():
    return render_template("avistamiento.html")

@app.route("/avistamientos")
def listado():
    return render_template("listado.html")

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

if __name__ == "__main__":
    app.run(debug=True)