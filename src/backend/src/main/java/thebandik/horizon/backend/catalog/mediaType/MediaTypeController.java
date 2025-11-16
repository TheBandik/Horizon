package thebandik.horizon.backend.catalog.mediaType;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/media-types")
public class MediaTypeController {

    private final MediaTypeService mediaTypes;

    public MediaTypeController(MediaTypeService mediaTypes) {
        this.mediaTypes = mediaTypes;
    }

    @PostMapping
    public ResponseEntity<MediaTypeResponse> create(@RequestBody MediaTypeRequest request) {
        MediaTypeEntity mediaType = mediaTypes.create(request);

        MediaTypeResponse response = new MediaTypeResponse(
                mediaType.getId(),
                mediaType.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<MediaTypeResponse> getAll() {
        return mediaTypes.getAll().stream()
                .map(mediaType -> new MediaTypeResponse(
                        mediaType.getId(),
                        mediaType.getName()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaTypeResponse> getById(@PathVariable Long id) {
        MediaTypeEntity mediaType = mediaTypes.getById(id);

        MediaTypeResponse response = new MediaTypeResponse(
                mediaType.getId(),
                mediaType.getName()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaTypeResponse> update(@PathVariable Long id, @RequestBody MediaTypeRequest request) {
        MediaTypeEntity mediaType = mediaTypes.update(id, request);

        MediaTypeResponse response = new MediaTypeResponse(
                mediaType.getId(),
                mediaType.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        mediaTypes.delete(id);
    }
}
