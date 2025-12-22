package thebandik.horizon.backend.user.mediaUser.dto;

import java.time.LocalDate;

public record MediaUserResponse(
        Long id,
        Long mediaId,
        Long userId,
        Long statusId,
        Short rating,
        LocalDate firstEventDate,
        LocalDate lastEventDate,
        Integer historyCount
) {
}
