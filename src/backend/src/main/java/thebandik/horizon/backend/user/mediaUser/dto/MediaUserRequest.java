package thebandik.horizon.backend.user.mediaUser.dto;

import java.time.LocalDate;

public record MediaUserRequest(
        Long mediaId,
        Long statusId,
        Short rating,
        LocalDate eventDate,
        String precision
) {
}
