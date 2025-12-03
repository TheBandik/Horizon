package thebandik.horizon.backend.media.mediaGenre;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import thebandik.horizon.backend.catalog.genre.Genre;

import java.util.List;

public interface MediaGenreRepository extends JpaRepository<MediaGenre, Long> {
    boolean existsByMediaIdAndGenreId(Long mediaId, Long genreId);

    @Query("select mg.genre from MediaGenre as mg where mg.media.id = :mediaId")
    List<Genre> findGenresByMediaId(@Param("mediaId") Long mediaId);
}
