
package cl.zelie.tarea4.dto;

import java.time.LocalDateTime;

public record AvistamientoDTO(
    Integer id,
    String voluntario,
    LocalDateTime fechaHora,
    String ave,
    String comuna,
    Double promedio
) {}
