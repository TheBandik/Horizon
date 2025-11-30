package thebandik.horizon.backend.media.mediaSeries;

import org.springframework.stereotype.Component;
import thebandik.horizon.backend.catalog.series.Series;
import thebandik.horizon.backend.media.mediaSeries.dto.MediaSeriesForMediaResponse;

@Component
public class MediaSeriesMapper {
    public MediaSeriesForMediaResponse toResponse(Series series) {
        return new MediaSeriesForMediaResponse(
                series.getId(),
                series.getTitle()
        );
    }
}
