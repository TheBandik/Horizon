package thebandik.horizon.backend.user.mediaUser.dto;

import thebandik.horizon.backend.catalog.status.dto.StatusResponse;
import thebandik.horizon.backend.media.dto.MediaResponse;
import thebandik.horizon.backend.user.mediaUser.DatePrecision;

import java.time.LocalDate;

public record MediaUserGetByMediaTypeResponse(
        Long id,
        MediaResponse media,
        StatusResponse status,
        Short rating,
        LocalDate lastEventDate,
        DatePrecision lastEventPrecision
        ) {
}
