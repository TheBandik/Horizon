package thebandik.horizon.backend.catalog.status;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status, Long> {
    boolean existsByName(String name);
}
