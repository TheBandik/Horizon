package thebandik.horizon.backend.media;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import thebandik.horizon.backend.catalog.genre.Genre;
import thebandik.horizon.backend.catalog.genre.GenreRepository;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeService;
import thebandik.horizon.backend.catalog.series.Series;
import thebandik.horizon.backend.catalog.series.SeriesRepository;
import thebandik.horizon.backend.common.errors.NotFoundException;
import thebandik.horizon.backend.common.s3.S3StorageService;
import thebandik.horizon.backend.media.dto.MediaRequest;
import thebandik.horizon.backend.media.mediaGenre.MediaGenre;
import thebandik.horizon.backend.media.mediaGenre.MediaGenreRepository;
import thebandik.horizon.backend.media.mediaSeries.MediaSeries;
import thebandik.horizon.backend.media.mediaSeries.MediaSeriesRepository;

import java.util.List;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaSeriesRepository mediaSeriesRepository;
    private final MediaGenreRepository mediaGenreRepository;
    private final SeriesRepository seriesRepository;
    private final GenreRepository genreRepository;

    private final MediaTypeService mediaTypeService;
    private final S3StorageService s3;

    @Value("${s3.enabled}")
    private Boolean enabled;

    public MediaService(
            MediaRepository mediaRepository,
            MediaTypeService mediaTypeService,
            MediaSeriesRepository mediaSeriesRepository,
            MediaGenreRepository mediaGenreRepository,
            S3StorageService s3,
            SeriesRepository seriesRepository,
            GenreRepository genreRepository
    ) {
        this.mediaRepository = mediaRepository;
        this.mediaTypeService = mediaTypeService;
        this.mediaSeriesRepository = mediaSeriesRepository;
        this.mediaGenreRepository = mediaGenreRepository;
        this.s3 = s3;
        this.seriesRepository = seriesRepository;
        this.genreRepository = genreRepository;
    }

    @Transactional
    public void create(MediaRequest request, MultipartFile poster) {
        List<Long> series = request.series();
        List<Long> genres = request.genres();

        MediaTypeEntity mediaType = mediaTypeService.getById(request.mediaTypeId());

        Media media = new Media();

        media.setTitle(request.title());
        media.setOriginalTitle(request.originalTitle());

        if (!enabled) {
            media.setPoster("https://test");
        } else if (poster != null && !poster.isEmpty()) {
            String key = s3.upload(poster);
            media.setPoster(s3.getPublicUrl(key));
        }

        media.setReleaseDate(request.releaseDate());
        media.setMediaType(mediaType);

        mediaRepository.save(media);

        if (!series.isEmpty()) {
            for (Long seriesId : series) {
                Series s = seriesRepository.findById(seriesId)
                        .orElseThrow(() -> new NotFoundException("SERIES", "Series", seriesId.toString()));

                mediaSeriesRepository.save(new MediaSeries(null, media, s));
            }
        }

        if (!genres.isEmpty()) {
            for (Long genreId : genres) {
                Genre genre = genreRepository.findById(genreId)
                        .orElseThrow(() -> new NotFoundException("GENRE", "Genre", genreId.toString()));

                mediaGenreRepository.save(new MediaGenre(null, media, genre));
            }
        }
    }

    public List<Media> getAll() {
        return mediaRepository.findAll();
    }

    public Media getById(Long id) {
        return mediaRepository.findById(id).orElseThrow(() -> new NotFoundException("MEDIA", "Media", id.toString()));
    }

    public Media update(Long id, MediaRequest request) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("MEDIA", "Media", id.toString()));

        MediaTypeEntity mediaType = mediaTypeService.getById(request.mediaTypeId());

        media.setTitle(request.title());
        media.setOriginalTitle(request.originalTitle());
        media.setPoster("https://cloud/**");
        media.setReleaseDate(request.releaseDate());
        media.setMediaType(mediaType);

        return mediaRepository.save(media);
    }

    public void delete(Long id) {
        if (!mediaRepository.existsById(id)) {
            throw new NotFoundException("MEDIA", "Media", id.toString());
        }

        mediaRepository.deleteById(id);
    }

    public Page<Media> searchMediaByTitle(String query, int page, int size, Long mediaTypeId) {
        return mediaRepository.searchMediaByTitle(query, PageRequest.of(page, size), mediaTypeId);
    }
}
