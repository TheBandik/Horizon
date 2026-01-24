package thebandik.horizon.backend.user.mediaUser.dto;

import thebandik.horizon.backend.user.mediaUser.DatePrecision;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto.MediaUserHistoryResponse;

import java.time.LocalDate;
import java.util.List;

public record MediaUserDetailsResponse(
        Long id,
        Long mediaId,
        Long userId,
        Long statusId,
        Short rating,
        LocalDate firstEventDate,
        LocalDate lastEventDate,
        DatePrecision lastEventPrecision,
        Integer historyCount,
        List<MediaUserHistoryResponse> history
) {
}
