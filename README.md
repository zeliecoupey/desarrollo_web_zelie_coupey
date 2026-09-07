# desarrollo_web_zelie_coupey

CC5002 - Tarea 1
Sistema de registro de avistamientos de aves

Prototipo web desarrollado para la Tarea 1 de CC5002. El sistema permite simular el registro de voluntarios y de avistamientos de aves mediante páginas HTML, CSS y JavaScript, sin utilizar un servidor ni una base de datos.

# Decisiones de diseño e implementación
# Ventana de confirmación mediante window.open()

Cuando los datos ingresados en el formulario de avistamiento son correctos, las validaciones realizadas mediante JavaScript permiten abrir una pequeña ventana de confirmación utilizando window.open().

Se eligió esta solución para mostrar de manera clara que el formulario fue validado correctamente, manteniendo la página del formulario abierta en la ventana principal. La ventana de confirmación permite posteriormente continuar hacia el listado de avistamientos o volver al inicio.

Esta decisión también permite simular el proceso de registro sin necesidad de implementar un servidor o un sistema de almacenamiento de datos, ya que el objetivo de la tarea 1 es desarrollar un prototipo de las interfaces y su navegación.

# Datos del listado en listado.js

El listado de avistamientos utiliza un objeto/arreglo de JavaScript definido directamente en listado.js. Los datos utilizados en esta sección son datos ficticios creados para el prototipo.

Estos datos no están vinculados con los datos ingresados en el formulario de avistamiento.html. Por lo tanto, registrar un nuevo avistamiento mediante el formulario no modifica el contenido mostrado en el listado.

Esta separación fue una decisión intencional, ya que el enunciado no exige almacenar los datos ingresados por los usuarios. El objetivo del listado es demostrar el funcionamiento de las opciones de visualización, filtrado, ordenamiento y paginación utilizando un conjunto de datos de ejemplo.

# Gráficos de estadísticas

La sección de estadísticas utiliza gráficos SVG estáticos con datos ficticios. Estos gráficos no se generan a partir de los avistamientos registrados mediante el formulario ni de los datos utilizados en listado.js.

Al igual que en el listado, se decidió utilizar datos de ejemplo porque el proyecto corresponde a un prototipo y no requiere una base de datos ni almacenamiento permanente.

De esta manera, la página de estadísticas permite demostrar visualmente los indicadores solicitados en la tarea sin implementar una infraestructura de almacenamiento que no es necesaria para los objetivos del proyecto.

# Separación entre las funcionalidades

En consecuencia, las tres partes funcionan de manera independiente:

El formulario de avistamiento se utiliza para demostrar las validaciones y el flujo de registro.
listado.js utiliza datos ficticios para demostrar el listado, filtrado, ordenamiento y paginación.
La sección de estadísticas utiliza gráficos SVG estáticos con datos ficticios.

Esta arquitectura corresponde a las características de un prototipo: se priorizan las interfaces, la navegación y las validaciones solicitadas, sin implementar persistencia de datos.

# Tecnologías utilizadas
HTML5
CSS3
JavaScript
SVG