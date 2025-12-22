package thebandik.horizon.backend.user.mediaUser.dto;

import java.time.LocalDate;

public record MediaUserCreateRequest(
        Long mediaId,
        Long userId,
        Long statusId,
        Short rating,
        LocalDate eventDate,
        String precision
) {
}
