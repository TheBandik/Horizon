package thebandik.horizon.backend.media.dto;

import java.time.LocalDate;

public record MediaRequest(
        String title,
        String originalTitle,
        LocalDate releaseDate,
        Long mediaTypeId
) {
}
