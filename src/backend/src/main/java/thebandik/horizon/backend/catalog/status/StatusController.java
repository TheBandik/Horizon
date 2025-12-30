package thebandik.horizon.backend.catalog.status;

import org.springframework.http.HttpStatus;
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
    @ResponseStatus(HttpStatus.CREATED)
    public StatusResponse create(@RequestBody StatusRequest request) {
        return statusService.create(request);
    }

    @GetMapping
    public List<StatusResponse> getAll() {
        return statusService.getAll();
    }

    @GetMapping("/{id}")
    public StatusResponse getById(@PathVariable Long id) {
        return statusService.getById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        statusService.delete(id);
    }
}
