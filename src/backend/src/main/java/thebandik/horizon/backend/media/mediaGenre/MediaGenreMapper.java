package thebandik.horizon.backend.media.mediaGenre;

import org.springframework.stereotype.Component;
import thebandik.horizon.backend.catalog.genre.Genre;
import thebandik.horizon.backend.media.mediaGenre.dto.MediaGenreForMediaResponse;

@Component
public class MediaGenreMapper {
    public MediaGenreForMediaResponse toResponse(Genre genre) {
        return new MediaGenreForMediaResponse(
                genre.getId(),
                genre.getName()
        );
    }
}
