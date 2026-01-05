package thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto;

import java.time.LocalDate;

public record MediaUserHistoryRequest(
        LocalDate eventDate,
        String precision
) {
}
