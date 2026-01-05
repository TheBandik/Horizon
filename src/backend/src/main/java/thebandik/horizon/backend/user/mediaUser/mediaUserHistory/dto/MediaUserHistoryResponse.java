package thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto;

import java.time.LocalDate;

public record MediaUserHistoryResponse(
        Long id,
        LocalDate eventDate,
        String precision
) {
}
