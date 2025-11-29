package thebandik.horizon.backend.catalog.series;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SeriesRepository extends JpaRepository<Series, Long> {
    boolean existsByTitle(String title);
}
