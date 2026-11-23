
const input = document.getElementById("busqueda");
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tabla-resultados");
const resultados = document.getElementById("resultados");
const formulario = document.getElementById("form-busqueda");

let temporizador;
let controlador = null;
let versionBusqueda = 0;

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
});

input.addEventListener("input", () => {
    clearTimeout(temporizador);
    versionBusqueda++;

    if (controlador) {
        controlador.abort();
    }

    const texto = input.value.trim();

    resultados.replaceChildren();
    tabla.hidden = true;

    if (!texto) {
        mensaje.textContent = "Escribe para comenzar la búsqueda.";
        return;
    }

    mensaje.textContent = "Buscando...";

    const version = versionBusqueda;

    temporizador = setTimeout(() => {
        buscar(texto, version);
    }, 300);
});

async function buscar(texto, version) {
    const actual = new AbortController();
    controlador = actual;

    try {
        const respuesta = await fetch(
            "/api/avistamientos/buscar?q=" +
            encodeURIComponent(texto),
            { signal: actual.signal }
        );

        if (!respuesta.ok) {
            throw new Error("Error en la búsqueda");
        }

        const datos = await respuesta.json();

        if (version !== versionBusqueda) return;

        resultados.replaceChildren();

        if (datos.length === 0) {
            tabla.hidden = true;
            mensaje.textContent =
                "No se encontraron avistamientos.";
            return;
        }

        datos.forEach((avistamiento) => {
            agregarFila(avistamiento, texto);
        });

        tabla.hidden = false;
        mensaje.textContent =
            datos.length + " resultado(s) encontrado(s).";

    } catch (error) {
        if (error.name === "AbortError") return;
        if (version !== versionBusqueda) return;

        mensaje.textContent =
            "No se pudo realizar la búsqueda.";
    }
}

function destacar(elemento, texto, patron) {
    const posicion = texto.toLocaleLowerCase()
        .indexOf(patron.toLocaleLowerCase());

    if (posicion === -1) {
        elemento.textContent = texto;
        return;
    }

    elemento.append(document.createTextNode(
        texto.slice(0, posicion)
    ));

    const marca = document.createElement("mark");
    marca.textContent = texto.slice(
        posicion, posicion + patron.length
    );
    elemento.append(marca);

    elemento.append(document.createTextNode(
        texto.slice(posicion + patron.length)
    ));
}

function agregarFila(a, patron) {
    const fila = document.createElement("tr");

    for (const valor of [a.voluntario, a.ave, a.comuna]) {
        // Las celdas se colocan después en el orden correcto.
    }

    const voluntario = document.createElement("td");
    destacar(voluntario, a.voluntario, patron);

    const fecha = document.createElement("td");
    fecha.textContent = a.fechaHora.slice(0, 10);

    const ave = document.createElement("td");
    destacar(ave, a.ave, patron);

    const comuna = document.createElement("td");
    destacar(comuna, a.comuna, patron);

    const promedio = document.createElement("td");
    promedio.textContent = formatearPromedio(a.promedio);

    const evaluar = document.createElement("td");
    const selector = document.createElement("select");

    selector.setAttribute(
        "aria-label", "Evaluar avistamiento " + a.id
    );

    const inicial = document.createElement("option");
    inicial.value = "";
    inicial.textContent = "Seleccionar nota";
    selector.append(inicial);

    for (let nota = 1; nota <= 7; nota++) {
        const opcion = document.createElement("option");
        opcion.value = String(nota);
        opcion.textContent = String(nota);
        selector.append(opcion);
    }

    selector.addEventListener("change", async () => {
        if (!selector.value) return;

        selector.disabled = true;

        try {
            const respuesta = await fetch(
                "/api/avistamientos/" + a.id + "/notas",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nota: Number(selector.value)
                    })
                }
            );

            if (!respuesta.ok) {
                throw new Error("Error al guardar");
            }

            const datos = await respuesta.json();

            promedio.textContent =
                formatearPromedio(datos.promedio);

            mensaje.textContent =
                "Nota guardada correctamente.";

        } catch (error) {
            mensaje.textContent =
                "No se pudo guardar la nota.";
        } finally {
            selector.value = "";
            selector.disabled = false;
        }
    });

    evaluar.append(selector);

    fila.append(
        voluntario, fecha, ave,
        comuna, promedio, evaluar
    );

    resultados.append(fila);
}

function formatearPromedio(valor) {
    if (valor === null || valor === undefined) {
        return "-";
    }

    return Number(valor).toFixed(2);
}
