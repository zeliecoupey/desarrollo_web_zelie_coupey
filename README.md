# CC5002 - Desarrollo de Aplicaciones WEB
## Tarea 3

### Descripción

Este proyecto corresponde a la Tarea 3 del curso CC5002 – Desarrollo de Aplicaciones WEB. Consiste en complementar la aplicación desarrollada en la Tarea 2, implementada con Flask y MySQL, incorporando estadísticas y comentarios asociados a los avistamientos.

### Tecnologías utilizadas

- Python
- Flask
- MySQL
- SQLAlchemy
- HTML5
- CSS3
- JavaScript
- Chart.js

### Funcionalidades implementadas

#### 1. Estadísticas

La aplicación incluye una pantalla de estadísticas que obtiene los datos desde la base de datos mediante una ruta de Flask y utiliza llamadas asíncronas con `fetch` para generar los gráficos en el lado del cliente.

Se implementaron los siguientes gráficos:

- **Gráfico de líneas:** muestra la cantidad de avistamientos registrados por día.
- **Gráfico de torta:** muestra el total de avistamientos por especie, utilizando el campo `nombre` de la tabla `ave`.
- **Gráfico de barras:** muestra la cantidad de voluntarios registrados por comuna.

El gráfico de torta utiliza el nombre de la especie porque el modelo de datos de la Tarea 2 no contiene un atributo separado para el tipo de ave.

La pantalla de estadísticas incluye un enlace para volver a la portada del sistema.

#### 2. Comentarios en avistamientos

Al consultar un avistamiento, la aplicación permite:

- Visualizar los comentarios asociados al avistamiento.
- Mostrar la fecha, el nombre del comentarista y el texto de cada comentario.
- Agregar un nuevo comentario mediante un formulario.
- Validar los datos ingresados tanto en el cliente como en el servidor.
- Enviar y recibir comentarios de manera asíncrona mediante `fetch`, sin recargar la página.

Los comentarios se almacenan en la tabla `comentario` de la base de datos.

### Validaciones

Para el ingreso de comentarios se consideran las siguientes reglas:

- El nombre del comentarista es obligatorio y debe tener entre 3 y 50 caracteres.
- El texto del comentario es obligatorio y debe tener al menos 5 caracteres.
- Las validaciones se realizan en el cliente y nuevamente en el servidor.
- Se verifican los parámetros recibidos en las rutas para evitar solicitudes inválidas.

### Decisiones de implementación

- Se utilizó `fetch` para realizar las solicitudes asíncronas desde JavaScript.
- Se utilizó Chart.js para generar los gráficos estadísticos en el navegador.
- Las estadísticas se calculan a partir de los datos almacenados en MySQL.
- El gráfico de torta agrupa los avistamientos por nombre de especie, debido a que la tabla `ave` no posee un campo específico para el tipo de ave.

### Ejecución del proyecto

1. Tener Python, Flask y MySQL instalados.
2. Crear y configurar la base de datos utilizada en la Tarea 2.
3. Ejecutar el script SQL proporcionado para crear la tabla `comentario`.
4. Configurar las credenciales de conexión a la base de datos en el proyecto.
5. Ejecutar la aplicación Flask:

   ```bash
   python app.py
   ```

6. Abrir la aplicación en el navegador utilizando la dirección local indicada por Flask.

### Autor

Zélie Coupey
