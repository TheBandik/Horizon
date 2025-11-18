package thebandik.horizon.backend.media;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.catalog.mediaType.dto.MediaTypeResponse;
import thebandik.horizon.backend.media.dto.MediaRequest;
import thebandik.horizon.backend.media.dto.MediaResponse;

import java.util.List;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping
    public ResponseEntity<MediaResponse> create(@RequestBody MediaRequest request) {
        Media media = mediaService.create(request);

        MediaResponse response = new MediaResponse(
                media.getId(),
                media.getTitle(),
                media.getOriginalTitle(),
                media.getPoster(),
                media.getReleaseDate(),

                new MediaTypeResponse(
                        media.getMediaType().getId(),
                        media.getMediaType().getName()
                )
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<MediaResponse> getAll() {
        return mediaService.getAll().stream()
                .map(media -> new MediaResponse(
                        media.getId(),
                        media.getTitle(),
                        media.getOriginalTitle(),
                        media.getPoster(),
                        media.getReleaseDate(),

                        new MediaTypeResponse(
                                media.getMediaType().getId(),
                                media.getMediaType().getName()
                        )
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponse> getById(@PathVariable Long id) {
        Media media = mediaService.getById(id);

        MediaResponse response = new MediaResponse(
                media.getId(),
                media.getTitle(),
                media.getOriginalTitle(),
                media.getPoster(),
                media.getReleaseDate(),

                new MediaTypeResponse(
                        media.getMediaType().getId(),
                        media.getMediaType().getName()
                )
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaResponse> update(@PathVariable Long id, @RequestBody MediaRequest request) {
        Media media = mediaService.update(id, request);

        MediaResponse response = new MediaResponse(
                media.getId(),
                media.getTitle(),
                media.getOriginalTitle(),
                media.getPoster(),
                media.getReleaseDate(),

                new MediaTypeResponse(
                        media.getMediaType().getId(),
                        media.getMediaType().getName()
                )
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        mediaService.delete(id);
    }
}
