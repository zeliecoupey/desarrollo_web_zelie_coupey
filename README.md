# desarrollo_web_zelie_coupey

CC5002 - Tarea 2

Sistema de registro de avistamientos de aves (Unión de Ornitólogos de Chile)

Continuación del prototipo de la Tarea 1: ahora con servidor en Python + Flask, base de datos MySQL y acceso a datos con SQLAlchemy.

## Cómo ejecutarlo

1. Crear la base de datos (desde la carpeta `sql/`):

mysql -u root -p
source sql/tarea2.sql;
source sql/region-comuna.sql;
source sql/aves.sql;

2. Instalar dependencias: `pip install flask sqlalchemy pymysql cryptography werkzeug`
3. Ejecutar: `python app.py` y abrir http://127.0.0.1:5000

## Decisiones de diseño e implementación

### Cambios en el formulario de registro respecto a la Tarea 1
En la Tarea 1, el formulario de registro de voluntario incluía los campos RUT y "calle y número". Se decidió eliminarlos en esta tarea, porque el modelo de datos entregado en `tarea2.sql` no contempla columnas para ellos en la tabla `voluntario`. El enunciado permite ajustar el modelo, pero se optó por respetar el esquema entregado tal como está.

Región y comuna pasaron de ser un `select` fijo y un campo de texto libre, a dos `select` alimentados desde la base de datos. La comuna se carga dinámicamente según la región elegida, mediante una petición `fetch` a la ruta `/api/comunas/<region_id>`, que consulta la tabla `comuna` filtrando por `region_id`.

### Cambios en el formulario de avistamiento
El campo de texto libre para el nombre del ave y el `select` de "tipo" de ave de la Tarea 1 se reemplazaron por un único `select` que lista las aves de la tabla `ave`, ya que el modelo guarda `ave_id` y no un tipo ni un nombre libre. Por lo mismo, el filtro por tipo de ave que existía en el listado de la Tarea 1 ya no está disponible.

Se agregó un `select` de voluntario, obligatorio, para asociar el avistamiento a quien lo informa. Cuando el voluntario recién se registra y elige "Registrar un avistamiento para este voluntario", este `select` llega preseleccionado.

Se agregó también un campo de descripción, opcional, ya que la tabla `avistamiento` contempla una columna `descripcion` que admite valores nulos.

### Reemplazo de las ventanas de confirmación
En la Tarea 1, al validar un formulario se abría una ventanita con `window.open()` simulando la confirmación del servidor. En esta tarea, ambos formularios envían sus datos a una URL de Flask mediante un `POST` real. Si el registro de voluntario resulta exitoso, se redirige a una página de confirmación que ofrece registrar un avistamiento para ese voluntario o volver al inicio. Si el avistamiento se registra con éxito, se redirige directamente al inicio con un mensaje de confirmación.

### Validaciones
Las validaciones de JavaScript de la Tarea 1 se mantuvieron, con los ajustes necesarios para los campos que pasaron a ser `select`. Los formularios llevan el atributo `novalidate`, para que el navegador no muestre sus propios mensajes de validación y dejen ver los mensajes del proyecto.

El servidor repite las mismas validaciones del lado de Flask, antes de insertar cualquier dato en la base, ya que las validaciones de JavaScript se pueden omitir fácilmente. Si el servidor detecta un error, vuelve a mostrar el formulario con los datos ya escritos y los mensajes de error correspondientes, sin perder lo que el usuario había ingresado.

### Archivos subidos
Se permite adjuntar más de un archivo (foto o vídeo) por avistamiento, de acuerdo a lo solicitado. Cada archivo se guarda en el servidor con un nombre único generado automáticamente, para evitar que dos archivos distintos se sobrescriban entre sí o que el nombre original del archivo cause problemas al guardarlo. El nombre original se guarda aparte, solo para mostrarlo al usuario. Por cada archivo se crea una fila en la tabla `registro`, asociada al avistamiento correspondiente.

Se validan en el servidor la cantidad máxima de archivos, su extensión y su tamaño, antes de guardarlos.

### Portada
La portada muestra los dos últimos avistamientos agregados a la base de datos, ordenados por el identificador (`id`) en forma descendente, en vez de ordenarlos por la fecha del avistamiento. Esto corresponde a los últimos avistamientos *informados*, que no son necesariamente los más recientes en términos de la fecha en que ocurrió el avistamiento.

### Listado de avistamientos
El listado se obtiene directamente desde la base de datos y se pagina en el servidor. Se puede ordenar por ave, lugar o fecha y hora, haciendo clic en el encabezado de la columna correspondiente. Al hacer clic en una fila, se accede al detalle del avistamiento, que muestra la información completa junto con las fotos y vídeos asociados.

### Estadísticas
**Esta sección aún no está conectada a la base de datos.** Se mantiene tal como se entregó en la Tarea 1, con gráficos SVG construidos a partir de datos inventados.

## Tecnologías utilizadas
- Python 3, Flask
- SQLAlchemy
- MySQL
- HTML5, CSS3, JavaScript