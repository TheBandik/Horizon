package thebandik.horizon.backend.media;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MediaRepository extends JpaRepository<Media, Long> {
    @Query("""
            select m
            from Media m
            where
                    lower(m.title) like lower(concat('%', :q, '%'))
                    or lower(m.originalTitle) like lower(concat('%', :q, '%'))
            """)
    Page<Media> searchMediaByTitle(
            @Param("q") String query,
            Pageable pageable
    );
}
