
package cl.zelie.tarea4.controller;

import cl.zelie.tarea4.dto.AvistamientoDTO;
import cl.zelie.tarea4.model.Avistamiento;
import cl.zelie.tarea4.model.Nota;
import cl.zelie.tarea4.repository.AvistamientoRepository;
import cl.zelie.tarea4.repository.NotaRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avistamientos")
public class AvistamientoController {

    private final AvistamientoRepository avistamientos;
    private final NotaRepository notas;

    public AvistamientoController(
            AvistamientoRepository avistamientos,
            NotaRepository notas) {
        this.avistamientos = avistamientos;
        this.notas = notas;
    }

    @GetMapping("/buscar")
    @Transactional(readOnly = true)
    public List<AvistamientoDTO> buscar(
            @RequestParam(defaultValue = "") String q) {

        String texto = q.trim();

        if (texto.isEmpty()) {
            return List.of();
        }

        return avistamientos.buscar(texto)
                .stream()
                .map(a -> new AvistamientoDTO(
                    a.getId(),
                    a.getVoluntario().getNombre(),
                    a.getFechaHora(),
                    a.getAve().getNombre(),
                    a.getVoluntario()
                     .getComuna().getNombre(),
                    notas.promedio(a.getId())
                ))
                .toList();
    }

    @PostMapping("/{id}/notas")
    @Transactional
    public ResponseEntity<Map<String, Object>> evaluar(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> datos) {

        Object valor = datos.get("nota");

        if (!(valor instanceof Integer nota)
                || nota < 1 || nota > 7) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La nota debe ser un entero entre 1 y 7"
            );
        }

        Avistamiento avistamiento = avistamientos
                .findById(id)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Avistamiento no encontrado"
                    )
                );

        notas.saveAndFlush(new Nota(avistamiento, nota));

        Double promedio = notas.promedio(id);

        return ResponseEntity.ok(
            Map.of(
                "mensaje", "Nota guardada",
                "promedio", promedio
            )
        );
    }
}
