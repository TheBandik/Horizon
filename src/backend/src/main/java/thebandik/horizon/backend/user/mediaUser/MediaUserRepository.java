package thebandik.horizon.backend.user.mediaUser;

import org.springframework.data.jpa.repository.JpaRepository;
import thebandik.horizon.backend.user.User;

import java.util.List;
import java.util.Optional;

public interface MediaUserRepository extends JpaRepository<MediaUser, Long> {
    Optional<MediaUser> findByUserIdAndMediaId(Long userId, Long mediaId);

    List<MediaUser> user(User user);

    List<MediaUser> findByUserIdAndMedia_MediaType_Id(Long userId, Long aLong);
}
