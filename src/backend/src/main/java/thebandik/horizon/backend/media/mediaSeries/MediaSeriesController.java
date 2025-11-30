package thebandik.horizon.backend.media.mediaSeries;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.media.mediaSeries.dto.MediaSeriesForMediaResponse;
import thebandik.horizon.backend.media.mediaSeries.dto.MediaSeriesRequest;
import thebandik.horizon.backend.media.mediaSeries.dto.MediaSeriesResponse;

import java.util.List;

@RestController
@RequestMapping("/api/media-series")
public class MediaSeriesController {

    private final MediaSeriesService mediaSeriesService;

    public MediaSeriesController(MediaSeriesService mediaSeriesService) {
        this.mediaSeriesService = mediaSeriesService;
    }

    @PostMapping
    public ResponseEntity<MediaSeriesResponse> create(@RequestBody MediaSeriesRequest request) {
        MediaSeries mediaSeries = mediaSeriesService.create(request);

        MediaSeriesResponse response = new MediaSeriesResponse(
                mediaSeries.getId(),
                mediaSeries.getMedia().getId(),
                mediaSeries.getSeries().getId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{mediaId}/series")
    public List<MediaSeriesForMediaResponse> getSeriesByMediaId(@PathVariable Long mediaId) {
        return mediaSeriesService.getSeriesByMediaId(mediaId);
    }
}
