package thebandik.horizon.backend.media.mediaSeries;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.series.Series;
import thebandik.horizon.backend.catalog.series.SeriesService;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.MediaService;
import thebandik.horizon.backend.media.mediaSeries.dto.MediaSeriesForMediaResponse;
import thebandik.horizon.backend.media.mediaSeries.dto.MediaSeriesRequest;

import java.util.List;

@Service
public class MediaSeriesService {

    private final MediaSeriesRepository mediaSeriesRepository;
    private final MediaService mediaService;
    private final SeriesService seriesService;
    private final MediaSeriesMapper mediaSeriesMapper;

    public MediaSeriesService(MediaSeriesRepository mediaSeriesRepository,
                              MediaService mediaService,
                              SeriesService seriesService,
                              MediaSeriesMapper mediaSeriesMapper) {
        this.mediaSeriesRepository = mediaSeriesRepository;
        this.mediaService = mediaService;
        this.seriesService = seriesService;
        this.mediaSeriesMapper = mediaSeriesMapper;
    }

    public MediaSeries create(MediaSeriesRequest request) {
        Long mediaId = request.mediaId();
        Long seriesId = request.seriesId();

        if (mediaSeriesRepository.existsByMediaIdAndSeriesId(mediaId, seriesId)) {
            throw new AlreadyExistsException("MEDIA_SERIES", "MediaSeries", mediaId + " + " + seriesId);
        }

        Media media = mediaService.getById(mediaId);
        Series series = seriesService.getById(seriesId);

        MediaSeries mediaSeries = new MediaSeries();
        mediaSeries.setMedia(media);
        mediaSeries.setSeries(series);

        return mediaSeriesRepository.save(mediaSeries);
    }

    public List<MediaSeriesForMediaResponse> getSeriesByMediaId(Long mediaId) {
        return mediaSeriesRepository.findSeriesByMediaId(mediaId).stream()
                .map(mediaSeriesMapper::toResponse)
                .toList();
    }
}
