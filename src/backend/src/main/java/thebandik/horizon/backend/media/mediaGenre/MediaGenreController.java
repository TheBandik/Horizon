package thebandik.horizon.backend.media.mediaGenre;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.media.mediaGenre.dto.MediaGenreForMediaResponse;
import thebandik.horizon.backend.media.mediaGenre.dto.MediaGenreRequest;
import thebandik.horizon.backend.media.mediaGenre.dto.MediaGenreResponse;

import java.util.List;

@RestController
@RequestMapping("/api/media-genre")
public class MediaGenreController {

    private final MediaGenreService mediaGenreService;

    public MediaGenreController(MediaGenreService mediaGenreService) {
        this.mediaGenreService = mediaGenreService;
    }

    @PostMapping
    public ResponseEntity<MediaGenreResponse> create(@RequestBody MediaGenreRequest request) {
        MediaGenre mediaGenre = mediaGenreService.create(request);

        MediaGenreResponse response = new MediaGenreResponse(
                mediaGenre.getId(),
                mediaGenre.getMedia().getId(),
                mediaGenre.getGenre().getId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{mediaId}/genres")
    public List<MediaGenreForMediaResponse> getGenresByMediaId(@PathVariable Long mediaId) {
        return mediaGenreService.getGenresByMediaId(mediaId);
    }

}
