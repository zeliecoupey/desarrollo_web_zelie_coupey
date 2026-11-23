# Tarea 4 – Desarrollo Web CC5002

## Descripción

Aplicación web para consultar avistamientos de aves y evaluarlos mediante notas de 1 a 7.

## Tecnologías utilizadas

- Java y Spring Boot
- Spring Data JPA
- MySQL
- HTML, CSS y JavaScript
- Fetch API para llamadas asíncronas

## Funcionalidades implementadas

- **Buscador dinámico:** permite buscar avistamientos por nombre de ave, voluntario o comuna, destacando el texto encontrado.
- **Evaluación:** permite asignar notas enteras entre 1 y 7 a los avistamientos.
- **Promedio:** se calcula automáticamente y se actualiza sin recargar la página.
- **Validación:** el backend rechaza notas inválidas.

## Decisiones de implementación

Se utilizó `fetch` para realizar peticiones asíncronas y un *debounce* de 300 ms para evitar búsquedas excesivas.

Las notas se almacenan en una tabla independiente de MySQL y su promedio se calcula mediante JPA.

## Ejecución

1. Configurar MySQL con la base de datos `tarea2` y crear la tabla `nota`.
2. Configurar las credenciales de MySQL.
3. Ejecutar:

```bash
./mvnw spring-boot:run
```

4. Abrir `http://localhost:8080/`.

## Consideraciones

La aplicación requiere que MySQL esté ejecutándose y que existan avistamientos registrados en la base de datos.