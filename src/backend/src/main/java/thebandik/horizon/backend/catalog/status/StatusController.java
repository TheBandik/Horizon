package thebandik.horizon.backend.catalog.status;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.catalog.status.dto.StatusRequest;
import thebandik.horizon.backend.catalog.status.dto.StatusResponse;

import java.util.List;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    private final StatusService statusService;

    public StatusController(StatusService statusService) {
        this.statusService = statusService;
    }

    @PostMapping
    public ResponseEntity<StatusResponse> create(@RequestBody StatusRequest request) {
        Status status = statusService.create(request);

        StatusResponse response = new StatusResponse(
                status.getId(),
                status.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<StatusResponse> getAll() {
        return statusService.getAll().stream()
                .map(status -> new StatusResponse(
                        status.getId(),
                        status.getName()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatusResponse> getById(@PathVariable Long id) {
        Status status = statusService.getById(id);

        StatusResponse response = new StatusResponse(
                status.getId(),
                status.getName()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StatusResponse> update(@PathVariable Long id, @RequestBody StatusRequest request) {
        Status status = statusService.update(id, request);

        StatusResponse response = new StatusResponse(
                status.getId(),
                status.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        statusService.delete(id);
    }
}
