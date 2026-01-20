package thebandik.horizon.backend.catalog.mediaType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaTypeRepository extends JpaRepository<MediaTypeEntity, Long> {
    Optional<MediaTypeEntity> findByNameIgnoreCase(String name);

    boolean existsByName(String name);
}
