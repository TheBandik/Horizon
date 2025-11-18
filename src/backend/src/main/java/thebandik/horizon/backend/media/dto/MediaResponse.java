package thebandik.horizon.backend.media.dto;


import thebandik.horizon.backend.catalog.mediaType.dto.MediaTypeResponse;

import java.time.LocalDate;

public record MediaResponse(
        Long id,
        String title,
        String originalTitle,
        String poster,
        LocalDate releaseDate,
        MediaTypeResponse mediaType
) {
}
