package thebandik.horizon.backend.catalog.series.dto;

import thebandik.horizon.backend.catalog.series.Series;

public record SeriesResponse(
        Long id,
        String title,
        Series series
) {
}
