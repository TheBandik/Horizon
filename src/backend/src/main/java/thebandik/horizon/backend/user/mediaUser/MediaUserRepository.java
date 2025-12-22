package thebandik.horizon.backend.user.mediaUser;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaUserRepository extends JpaRepository<MediaUser, Long> {
    Optional<MediaUser> findByUserIdAndMediaId(Long userId, Long mediaId);
}
