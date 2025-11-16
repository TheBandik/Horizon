package thebandik.horizon.backend.catalog.mediaType;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaTypeRepository extends JpaRepository<MediaTypeEntity, Long> {

    boolean existsByName(String name);
}
