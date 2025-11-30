package thebandik.horizon.backend.media.mediaSeries;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import thebandik.horizon.backend.catalog.series.Series;

import java.util.List;

public interface MediaSeriesRepository extends JpaRepository<MediaSeries, Long> {
    boolean existsByMediaIdAndSeriesId(Long mediaId, Long seriesId);

    @Query("select ms.series from MediaSeries as ms where ms.media.id = :mediaId")
    List<Series> findSeriesByMediaId(@Param("mediaId") Long mediaId);
}
