package thebandik.horizon.backend.media;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import thebandik.horizon.backend.catalog.mediaType.dto.MediaTypeResponse;
import thebandik.horizon.backend.common.PageResponse;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public void create(
            @RequestPart("data") MediaRequest request,
            @RequestPart(value = "poster", required = false) MultipartFile poster
    ) {
        mediaService.create(request, poster);
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

    @GetMapping("/search")
    public PageResponse<MediaResponse> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Long mediaTypeId
    ) {
        Page<MediaResponse> searchResult = mediaService.searchMediaByTitle(query, page, size, mediaTypeId)
                .map(MediaResponse::from);
        return PageResponse.from(searchResult);
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
