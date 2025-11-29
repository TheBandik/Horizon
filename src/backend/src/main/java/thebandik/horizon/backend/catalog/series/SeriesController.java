package thebandik.horizon.backend.catalog.series;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.catalog.series.dto.SeriesRequest;
import thebandik.horizon.backend.catalog.series.dto.SeriesResponse;

import java.util.List;

@RestController
@RequestMapping("/api/series")
public class SeriesController {

    private final SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    @PostMapping
    public ResponseEntity<SeriesResponse> create(@RequestBody SeriesRequest request) {
        Series series = seriesService.create(request);

        SeriesResponse response = new SeriesResponse(
                series.getId(),
                series.getTitle(),
                series.getSeries()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<SeriesResponse> getAll() {
        return seriesService.getAll().stream()
                .map(series -> new SeriesResponse(
                        series.getId(),
                        series.getTitle(),
                        series.getSeries()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeriesResponse> getById(@PathVariable Long id) {
        Series series = seriesService.getById(id);

        SeriesResponse response = new SeriesResponse(
                series.getId(),
                series.getTitle(),
                series.getSeries()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeriesResponse> update(@PathVariable Long id, @RequestBody SeriesRequest request) {
        Series series = seriesService.update(id, request);

        SeriesResponse response = new SeriesResponse(
                series.getId(),
                series.getTitle(),
                series.getSeries()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        seriesService.delete(id);
    }
}
