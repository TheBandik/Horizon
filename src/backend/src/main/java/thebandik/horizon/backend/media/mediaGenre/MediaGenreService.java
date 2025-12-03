package thebandik.horizon.backend.media.mediaGenre;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.genre.Genre;
import thebandik.horizon.backend.catalog.genre.GenreService;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.MediaService;
import thebandik.horizon.backend.media.mediaGenre.dto.MediaGenreForMediaResponse;
import thebandik.horizon.backend.media.mediaGenre.dto.MediaGenreRequest;

import java.util.List;

@Service
public class MediaGenreService {

    private final MediaGenreRepository mediaGenreRepository;
    private final MediaService mediaService;
    private final GenreService genreService;
    private final MediaGenreMapper mediaGenreMapper;

    public MediaGenreService(MediaGenreRepository mediaGenreRepository,
                             MediaService mediaService,
                             GenreService genreService,
                             MediaGenreMapper mediaSeriesMapper) {
        this.mediaGenreRepository = mediaGenreRepository;
        this.mediaService = mediaService;
        this.genreService = genreService;
        this.mediaGenreMapper = mediaSeriesMapper;
    }

    public MediaGenre create(MediaGenreRequest request) {
        Long mediaId = request.mediaId();
        Long genreId = request.genreId();

        if (mediaGenreRepository.existsByMediaIdAndGenreId(mediaId, genreId)) {
            throw new AlreadyExistsException("MEDIA_GENRES", "MediaGenre", mediaId + " + " + genreId);
        }

        Media media = mediaService.getById(mediaId);
        Genre genre = genreService.getById(genreId);

        MediaGenre mediaGenre = new MediaGenre();
        mediaGenre.setMedia(media);
        mediaGenre.setGenre(genre);

        return mediaGenreRepository.save(mediaGenre);
    }

    public List<MediaGenreForMediaResponse> getGenresByMediaId(Long mediaId) {
        return mediaGenreRepository.findGenresByMediaId(mediaId).stream()
                .map(mediaGenreMapper::toResponse)
                .toList();
    }
}
