package thebandik.horizon.backend.media.dto;

import java.time.LocalDate;
import java.util.List;

public record MediaRequest(
        String title,
        String originalTitle,
        LocalDate releaseDate,
        Long mediaTypeId,
        List<Long> series,
        List<Long> genres
) {
}
