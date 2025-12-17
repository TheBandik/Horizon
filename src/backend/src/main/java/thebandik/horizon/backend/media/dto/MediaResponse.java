package thebandik.horizon.backend.media.dto;


import thebandik.horizon.backend.catalog.mediaType.dto.MediaTypeResponse;
import thebandik.horizon.backend.media.Media;

import java.time.LocalDate;

public record MediaResponse(
        Long id,
        String title,
        String originalTitle,
        String poster,
        LocalDate releaseDate,
        MediaTypeResponse mediaType
) {
    public static MediaResponse from(Media media) {
        return new MediaResponse(
                media.getId(),
                media.getTitle(),
                media.getOriginalTitle(),
                media.getPoster(),
                media.getReleaseDate(),
                MediaTypeResponse.from(media.getMediaType())
        );
    }
}
