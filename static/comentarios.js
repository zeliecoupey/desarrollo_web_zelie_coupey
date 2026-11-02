
document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("form-comentario");
    const listaComentarios = document.getElementById("lista-comentarios");
    const mensaje = document.getElementById("mensaje-comentarios");

    const urlComentarios =
        `/api/avistamientos/${AVISTAMIENTO_ID}/comentarios`;

    // Mostrar un mensaje al usuario
    function mostrarMensaje(texto, esError = false) {
        mensaje.textContent = texto;
        mensaje.style.color = esError ? "red" : "green";
    }

    // Crear un elemento HTML para cada comentario
    function crearComentario(comentario) {
        const article = document.createElement("article");

        const encabezado = document.createElement("h4");
        encabezado.textContent = comentario.nombre;

        const fecha = document.createElement("small");
        fecha.textContent = comentario.fecha;

        const texto = document.createElement("p");
        texto.textContent = comentario.texto;

        article.appendChild(encabezado);
        article.appendChild(fecha);
        article.appendChild(texto);

        return article;
    }

    // Recuperar los comentarios desde Flask
    async function cargarComentarios() {
        try {
            const respuesta = await fetch(urlComentarios);

            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar los comentarios.");
            }

            const comentarios = await respuesta.json();

            listaComentarios.replaceChildren();

            if (comentarios.length === 0) {
                const vacio = document.createElement("p");
                vacio.textContent = "Todavía no hay comentarios.";
                listaComentarios.appendChild(vacio);
                return;
            }

            comentarios.forEach(comentario => {
                listaComentarios.appendChild(
                    crearComentario(comentario)
                );
            });

        } catch (error) {
            mostrarMensaje(error.message, true);
        }
    }

    // Enviar un nuevo comentario
    formulario.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const nombre = document
            .getElementById("nombre-comentario")
            .value.trim();

        const texto = document
            .getElementById("texto-comentario")
            .value.trim();

        // Validación del lado del cliente
        if (nombre.length < 3 || nombre.length > 50) {
            mostrarMensaje(
                "El nombre debe tener entre 3 y 50 caracteres.",
                true
            );
            return;
        }

        if (texto.length < 5 || texto.length > 300) {
            mostrarMensaje(
                "El comentario debe tener entre 5 y 300 caracteres.",
                true
            );
            return;
        }

        const datos = new URLSearchParams();
        datos.append("nombre", nombre);
        datos.append("texto", texto);

        try {
            const respuesta = await fetch(urlComentarios, {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body: datos
            });

            const resultado = await respuesta.json();

            // Errores de validación enviados por Flask
            if (!respuesta.ok) {
                if (resultado.errores) {
                    const errores = Object.values(
                        resultado.errores
                    ).join(" ");

                    mostrarMensaje(errores, true);
                } else {
                    mostrarMensaje(
                        "No se pudo agregar el comentario.",
                        true
                    );
                }

                return;
            }

            // Mostrar el nuevo comentario
            const comentario = crearComentario(resultado);

            listaComentarios.prepend(comentario);

            // Limpiar el formulario únicamente si todo salió bien
            formulario.reset();

            mostrarMensaje("¡Comentario agregado correctamente!");

        } catch (error) {
            mostrarMensaje(
                "Error de conexión. Inténtalo nuevamente.",
                true
            );
        }
    });

    // Cargar los comentarios al entrar en la página
    cargarComentarios();

});
